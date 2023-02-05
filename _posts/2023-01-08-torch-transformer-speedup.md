---
layout: blogpost
thumb: /assets/images/thumbs/transformer_thumb.png
title: "Speeding up your Transformer Model by Upgrading"
date: 2023-01-08
tags: deep-learning programming
intro: "How upgrading your PyTorch version can speed up your Transformer model."
---

<div align="center">
<figure>
<img src="/assets/images/blogs/transformer_ai.png" alt="Transformer Model" style="width:50%">
<figcaption>AI generated image of "transformer as a deep learning model".</figcaption>
</figure>
</div>

I recently updated the version of PyTorch for one of my development environments at work and came across a runtime error on one of my main model training scripts. The issue was a tensor dimension mismatch at the output of the BERT model the script is training. It took me a couple of minutes to figure out what was causing the issue. It turns out that the newest versions of PyTorch will dynamically size the batch of data going into a Transformer model based on the zero padding mask that is included.

While initially finding this breaking change to be quite annoying, I realized that this feature could potentially offer a dramatic speedup in training by reducing unnecessary computations on the zero padded elements.

I was curious what the exact speedup of my model would be with this change so I decided to write up a simple benchmark. My model is trained on the ZINC 15 dataset which has some longer sequences but the median sequence length is much shorter than the maximum. I sub-sampled the full dataset to make a smaller version for the benchmark. I then ran the forward pass of the model (using GPU acceleration) in batches and timed how long an entire epoch took. I ran this trial 100 times and took the average execution time. I repeated this benchmark for PyTorch 1.9 and PyTorch 1.13. The results of the benchmark are shown below.

<div align="center">
<figure>
<img src="/assets/images/blogs/transformer_benchmark_comparison.png" alt="Transformer benchmark comparison" style="width:50%">
<figcaption>Benchmark comparison of BERT implementation with vanilla PyTorch versions.</figcaption>
</figure>
</div>

It can be seen that simply by switching versions of PyTorch, you can get a significant speedup with your Transformer models. Yes, you could implement this feature in older versions of PyTorch yourself too, but it is nice to have handled automatically. I feel silly that I didn't think to implement this myself previously but I am not normally tasked with model optimization and the model training times were already reasonable. Hopefully this helps someone else out or finds the results interesting for the ZINC 15 dataset.