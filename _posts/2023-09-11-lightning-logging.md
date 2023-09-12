---
layout: blogpost
thumb: /assets/images/thumbs/lightning_thumb.png
title: "Testing out the Logging for Lightning Fabric"
date: 2023-09-11
tags: programming deep-learning
intro: "Testing how logging works with distributed training using Lightning Fabric."
---

<div align="center">
<figure>
<img src="/assets/images/blogs/lightning_log.png" alt="Llama AI Art" style="width:50%">
</figure>
</div>

I recently came across Lightning Fabric as a lightweight alternative to PyTorch Lightning and have been really excited to try it out. One of the things I did not like about PyTorch Lightning was how much detail was abstracted away while not behaving in an intuitive way. One of the areas where this was particularly problematic was logging training progress to Tensorboard. I regularly had to hack so many different things to get the results logged in a way that was meaningful to me. So the first thing I wanted to figure out in Lightning Fabric is how to correctly log results when in a distributed training scenario. To that end, I setup this test case.

First, you need to build your environment. I prefer to use conda so this was my setup.
```bash
conda create --name lightning-env python=3.9 -y --copy
conda activate lightning-env

conda install pytorch torchvision torchaudio pytorch-cuda=11.8 -c pytorch -c nvidia -y --copy
pip install lightning tensorboard
```

Next, my test script sets up a logging folder and creates a distributed training setup using 4 processes and the CPU to simulate a scenario where training is happening on 4 GPUs using a DDP strategy.
```python
import os
import shutil

import torch
import lightning as L
from torch.utils.tensorboard import SummaryWriter
from tensorboard.backend.event_processing import event_accumulator

LOG_DIR = "./logs"


# Setup the logs folder
try:
    shutil.rmtree(LOG_DIR)
except FileNotFoundError:
    pass
os.mkdir(LOG_DIR)

# Create the Lightning Fabric
fabric = L.Fabric(accelerator="cpu", devices=4)
fabric.launch()
```
To see how the logging behaves in different scenarios, we create unique data for each of the parallel processes. Likewise, we create a different Tensorboard logger to test the different scenarios. The scenarios we are testing are no reduction across processes, reduction across processes with every process writing to the log, and finally reduction across the processes with a single process writing to the log.
```python
# Create unique data per device
data = torch.tensor(10 * fabric.global_rank, dtype=float)

# Create the loggers
no_reduce_summary_writer = SummaryWriter(os.path.join(LOG_DIR, "no_reduce"))
reduce_summary_writer = SummaryWriter(os.path.join(LOG_DIR, "reduce"))
reduce_rank_zero_summary_writer = SummaryWriter(
    os.path.join(LOG_DIR, "reduce_rank_zero")
)
```
Next, we test each of those scenarios. After the scenarios are complete, we block the processes to make sure all of them have completed the logging before looking at the results.
```python
# Perform the logging
result = fabric.all_gather(data)
# Log without gather and reduction
no_reduce_summary_writer.add_scalar("data", data.mean(), 0)
# Log with gather and reduction
reduce_summary_writer.add_scalar("data", result.mean(), 0)
# Log with gather and reduction on rank zero
if fabric.global_rank == 0:
    reduce_rank_zero_summary_writer.add_scalar(
        "data", result.mean(), fabric.global_rank
    )

# Wait for all processes
fabric.barrier()
```
Finally, we print out the results.
```python
# Output the results from the Tensorboard logs
if fabric.global_rank == 0:
    for log_name in ["no_reduce", "reduce", "reduce_rank_zero"]:
        # Create the event accumulator that will load the events files
        event_acc = event_accumulator.EventAccumulator(
            os.path.join(LOG_DIR, log_name),
        )
        event_acc.Reload()
        # Print the number of sotred entries
        print(f"Strategy: {log_name}")
        print(f"Number of log entries: {len(event_acc.Scalars('data'))}")
        results = [x.value for x in event_acc.Scalars("data")]
        print(f"{results}\n")
```
You can see from the results below that the desired behavior is achieved by gathering and reducing the data across the processes and having a single process log the results.
```
Strategy: no_reduce
Number of log entries: 4
[0.0, 20.0, 10.0, 30.0]

Strategy: reduce
Number of log entries: 4
[15.0, 15.0, 15.0, 15.0]

Strategy: reduce_rank_zero
Number of log entries: 1
[15.0]
```

I hope this experiment helps someone else figure out the behavior they desire in their training script. I'm also excited that Lighting Fabric is less boilerplate and abstraction, giving more control to the user to implement exactly what they want.

If you want to try out the script yourself, I have posted it on GitHub here: <a href="https://gist.github.com/michaelriedl/5984af8bb34872b53a430ce2e3e61179" target="_blank">test_gather.py</a>

