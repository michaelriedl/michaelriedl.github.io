---
layout: blogpost
thumb: /assets/images/thumbs/jetson_thumb.png
title: "Custom ML Docker Container for Jetson Nano"
date: 2021-09-04
tags: electronics programming deep-learning
intro: "Building a custom machine learning Docker container for the 2GB Jetson Nano."
---

<div align="center">
<figure>
<img src="/assets/images/blogs/jetson_desk.png" alt="2GB Jetson Nano" style="width:50%">
</figure>
</div>

I won a 2GB Jetson Nano through a raffle on Instagram. I wanted to try out some unique uses of the Jetson Nano; one of those use cases is detecting shooting stars. A simple algorithm for detecting shooting stars is a streak detection algorithm. One of the most basic streak detection approaches I have come across uses the Radon transform. In order to make use of the GPU acceleration of the Jetson Nano, I began to look around for a GPU accelerated implementation of the Radon Transform. I can across <a href="https://github.com/matteo-ronchetti/torch-radon" target="_blank">this implementation in PyTorch</a>. The next step was to get it installed on the Jetson Nano.

The Jetson Nano uses Docker to containerize computing environments. To get familiar with Docker on the Jetson Nano, I initially tried to build the official machine learning containers from  <a href="https://github.com/dusty-nv/jetson-containers" target="_blank">NVIDIA</a>. My initial attempts always would get stuck on the second part of the build shown in the message below.
```bash
[2/15] /usr/bin/c++   -I../../third_party/kaldi/src -I../../third_party/kaldi/submodule/src -isystem /usr/local/lib/python3.6/dist-packages/torch/include -isystem /usr/local/lib/python3.6/dist-packages/torch/include/torch/csrc/api/include -isystem /usr/local/cuda-10.2/include -Wall -D_GLIBCXX_USE_CXX11_ABI=1 -fvisibility=hidden -O3 -DNDEBUG -fPIC   -D_GLIBCXX_USE_CXX11_ABI=1 -std=gnu++14 -MD -MT third_party/kaldi/CMakeFiles/kaldi.dir/submodule/src/base/kaldi-error.cc.o -MF third_party/kaldi/CMakeFiles/kaldi.dir/submodule/src/base/kaldi-error.cc.o.d -o third_party/kaldi/CMakeFiles/kaldi.dir/submodule/src/base/kaldi-error.cc.o -c ../../third_party/kaldi/submodule/src/base/kaldi-error.cc
```

After some research, it seemed that I was likely running into a memory issue and tried adding more swap and disabling the desktop GUI, to reclaim more RAM, following the guide <a href="https://github.com/dusty-nv/jetson-inference/blob/master/docs/pytorch-transfer-learning.md#mounting-swap" target="_blank">here</a>. After these steps, I was able to get to the next step of the build shown in the message below.
```bash
[3/15] /usr/bin/c++  -DINCLUDE_KALDI -DTORCH_API_INCLUDE_EXTENSION_H -DUSE_CUDA -D_torchaudio_EXPORTS -I../../ -I/usr/include/python3.6m -isystem /usr/local/lib/python3.6/dist-packages/torch/include -isystem /usr/local/lib/python3.6/dist-packages/torch/include/torch/csrc/api/include -isystem /usr/local/cuda-10.2/include -I../../third_party/kaldi/src -I../../third_party/kaldi/submodule/src -Wall -D_GLIBCXX_USE_CXX11_ABI=1 -O3 -DNDEBUG -fPIC   -D_GLIBCXX_USE_CXX11_ABI=1 -std=gnu++14 -MD -MT torchaudio/csrc/CMakeFiles/_torchaudio.dir/pybind.cpp.o -MF torchaudio/csrc/CMakeFiles/_torchaudio.dir/pybind.cpp.o.d -o torchaudio/csrc/CMakeFiles/_torchaudio.dir/pybind.cpp.o -c ../../torchaudio/csrc/pybind.cpp
```
However, even letting the Jetson Nano run overnight did not move the compilation past this point. I think ultimately 2GB of RAM is not enough to build the ML Docker container in a reasonable amount of time.

I decided to take the dive and modify the build script to make my own container, getting rid of torchvision and torchaudio and adding the dependencies needed for the PyTorch implementation of the Radon transform. I was eventually able to get the script working and successfully build my custom Docker container. Once I ran the container, I was able to connect to a Jupyter Notebook session and run the Radon transform demo shown in the image below.
<div align="center">
<figure>
<img src="/assets/images/blogs/jetson_container.png" alt="Style Image" style="width:50%">
<figcaption>Jupyter Notebook example of the PyTorch Radon transform implementation.</figcaption>
</figure>
</div>

If you want to try out this container for yourself, check out my <a href="https://github.com/michaelriedl/jetson-torch-radon" target="_blank">GitHub repository</a>.
