---
layout: blogpost
thumb: /assets/images/thumbs/apex_thumb.png
title: "Installing NVIDIA Apex on Windows 11"
date: 2023-05-26
tags: programming deep-learning
intro: "Installing NVIDIA Apex on Windows 11 for use with PyTorch 2.x."
---

<div align="center">
<figure>
<img src="/assets/images/blogs/apex_install.png" alt="Apex AI Art" style="width:50%">
<figcaption>AI generated image of "cyber punk interpretation of a user in a battle to the death with a computer".</figcaption>
</figure>
</div>

NVIDIA Apex provides some custom fused operators for PyTorch that can increase the speed of training various models. The fused operator I am most interested in is the FusedLAMB optimizer. The LAMB optimizer has been shown to stabilize pre-training of large models using large batch sizes. I have had a difficult time getting this package installed since it needs to be built from source and there is no dedicated Windows support. I recently tried again and was able to get it built with CUDA extensions. The process is outlined below.

## Installing NVIDIA Apex
I found the following is enough to install NVIDIA Apex on Windows 11 assuming you already have the Visual Studio C extensions installed for your system. For some reason the current commit on the main branch breaks the install for Windows, but reverting to an earlier commit still works. It just requires the modification of a couple files after the install. This is due to the deprecation of the torch._six module.
```bash
python -m pip install --upgrade pip

conda install pytorch torchvision torchaudio pytorch-cuda=11.8 -c pytorch -c nvidia -y --copy

conda install -c "nvidia/label/cuda-11.8.0" cuda-toolkit cuda-nvcc -y --copy

git clone https://github.com/NVIDIA/apex

cd apex

git checkout 2ec84eb

pip install -v --no-cache-dir --global-option="--cpp_ext" --global-option="--cuda_ext" .
```

After the install completes you need to replace in _amp_state.py
```python
if TORCH_MAJOR == 0:
    import collections.abc as container_abcs
else:
    from torch._six import container_abcs
```

with
```python
import collections.abc as container_abcs
```


Finally, replace in _initialize.py
```python
from torch._six import string_classes
```

with
```python
string_classes = str
```

Hopefully this helps out someone else who has been struggling to get this working.

## Helpful Links
* <a href="https://github.com/NVIDIA/apex/issues/835#issuecomment-646112354" target="_blank">https://github.com/NVIDIA/apex/issues/835#issuecomment-646112354</a>
* <a href="https://anaconda.org/nvidia/repo" target="_blank">https://anaconda.org/nvidia/repo</a>
