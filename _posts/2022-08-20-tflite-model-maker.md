---
layout: blogpost
thumb: /assets/images/thumbs/tflitemm_thumb.png
title: "Building an Object Detection Model with TFLite Model Maker"
date: 2022-08-20
tags: deep-learning programming
intro: "Setup and issues training an object detection model with TFLite Model Maker."
---

<div align="center">
<figure>
<img src="/assets/images/blogs/tflite_model_maker.png" alt="TFLite Model Maker" style="width:50%">
</figure>
</div>

I've been working on building an object detection model training pipeline using TFLite Model Maker. The coding is relatively easy but I ran into some issues with the data format, GPU support, and package version conflicts. The first issue I came across was the data formatting. 

The docs specify that the DataLoader is compatible with various image formats but when using PNG images, I got the following error:
```bash
ValueError: Image format not JPEG
```
After some searching I came across this <a href="https://discuss.tensorflow.org/t/valueerror-image-format-not-jpeg/2143/4" target="_blank">thread</a>. The solution posed there was just to convert the images to JPEG. This was easy enough for me since I had an existing build script for storing all of the training data. I'm not entirely sure why the data setup I was using did not support the PNG format.

After resolving the data formatting issue, the next issue I came across was not having GPU support on my deep learning rig. When I would run the training script, I would get the following warnings and the training would default to using the CPU.
```bash
2022-08-20 20:19:46.000113: W tensorflow/stream_executor/platform/default/dso_loader.cc:64] Could not load dynamic library 'libcudart.so.11.0'; dlerror: libcudart.so.11.0: cannot open shared object file: No such file or directory
2022-08-20 20:19:46.000145: W tensorflow/stream_executor/platform/default/dso_loader.cc:64] Could not load dynamic library 'libcublas.so.11'; dlerror: libcublas.so.11: cannot open shared object file: No such file or directory
2022-08-20 20:19:46.000173: W tensorflow/stream_executor/platform/default/dso_loader.cc:64] Could not load dynamic library 'libcublasLt.so.11'; dlerror: libcublasLt.so.11: cannot open shared object file: No such file or directory
2022-08-20 20:19:46.000198: W tensorflow/stream_executor/platform/default/dso_loader.cc:64] Could not load dynamic library 'libcufft.so.10'; dlerror: libcufft.so.10: cannot open shared object file: No such file or directory
2022-08-20 20:19:46.000224: W tensorflow/stream_executor/platform/default/dso_loader.cc:64] Could not load dynamic library 'libcurand.so.10'; dlerror: libcurand.so.10: cannot open shared object file: No such file or directory
2022-08-20 20:19:46.000248: W tensorflow/stream_executor/platform/default/dso_loader.cc:64] Could not load dynamic library 'libcusolver.so.11'; dlerror: libcusolver.so.11: cannot open shared object file: No such file or directory
2022-08-20 20:19:46.000273: W tensorflow/stream_executor/platform/default/dso_loader.cc:64] Could not load dynamic library 'libcusparse.so.11'; dlerror: libcusparse.so.11: cannot open shared object file: No such file or directory
2022-08-20 20:19:46.000299: W tensorflow/stream_executor/platform/default/dso_loader.cc:64] Could not load dynamic library 'libcudnn.so.8'; dlerror: libcudnn.so.8: cannot open shared object file: No such file or directory
2022-08-20 20:19:46.000306: W tensorflow/core/common_runtime/gpu/gpu_device.cc:1850] Cannot dlopen some GPU libraries. Please make sure the missing libraries mentioned above are installed properly if you would like to use GPU. Follow the guide at https://www.tensorflow.org/install/gpu for how to download and setup the required libraries for your platform.
Skipping registering GPU devices...
```
I did some searching and the obvious answer to the problem was that the CUDA backend was not properly installed. I confirmed this by also trying to import TensorFlow and got the similar warning below.
```bash
2022-08-20 20:23:52.731299: W tensorflow/stream_executor/platform/default/dso_loader.cc:64] Could not load dynamic library 'libcudart.so.11.0'; dlerror: libcudart.so.11.0: cannot open shared object file: No such file or directory
```
The solution to the problem is to install CUDA before installing TFLite model maker. I took the steps below from the <a href="https://www.tensorflow.org/install/pip" target="_blank">TensorFlow installation page</a>.
```bash
conda create --name tf-lite python=3.8
conda activate tf-lite
pip install --upgrade pip
conda install -c conda-forge cudatoolkit=11.2 cudnn=8.1.0
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$CONDA_PREFIX/lib/
pip install --use-deprecated=legacy-resolver tflite-model-maker
pip install pycocotools
pip install hydra-core --upgrade
pip install tensorflow==2.8.0
```
You do not have to install hydra-core if you do not plan to use hydra but I use it in my pipeline.

The final issue I had showed up when trying to export the trained model. I got the following error during the export process:
```bash
...line 3015, in Pack
    mean = builder.EndVector()
TypeError: EndVector() missing 1 required positional argument: 'vectorNumElems'
```
I found <a href="https://discuss.tensorflow.org/t/model-export-endvector-takes-1-positional-argument-but-2-were-given/7464" target="_blank">this discussion</a> while researching the error. The solution one user found was to update TFLite Model Maker to the nightly build version. The root of the issue is a conflict with the flatbuffers package and updating the the nightly build seems to resolve the issue for me. This upgrade can be done with the command below.
```bash
pip install tflite-model-maker-nightly
```
After resolving all these issues, I was able to successfully train and export an object detection model using TFLite Model Maker. Hope this helps out someone else who encounters similar problems.
