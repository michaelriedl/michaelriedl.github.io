---
layout: blogpost
thumb: /assets/images/thumbs/wsl_thumb.png
title: "Setting Up WSL on Windows 11 22H2"
date: 2022-12-26
tags: electronics programming
intro: "Dealing with issues setting up WSL on Windows 11 with update 22H2."
---

I recently migrated from an old MacBook Air to a new Windows 11 laptop. I made the switch because most of my projects revolve around machine learning and deep learning. While there is some support for GPU acceleration on MacOS, I wanted to get a laptop with an NVIDIA GPU that has CUDA support. In the process of setting up my workflow on the new laptop, I hit a snag getting Windows Subsystem for Linux (WSL) installed on Windows 11 22H2. 

The main issue I had was downloading the packages from Microsoft. Running the install command as recommended would get stuck during the download part of the process. It would take minutes to begin the download and then it would never move past 0% progress.
```bash
wsl --install
```
I found through trial and error that this command seemed to be trying to download and install WSL through the Microsoft Store. I'm not sure if the store was down at the time or having internal issues but I could not find anyone else having a similar problem. I discovered that one way around this roadblock was to install and update WSL through the Windows Update settings.

This can be done by first enabling the following optional features:
* Virtual Machine Platform 
* Windows Subsystem for Linux

This is shown in the image below. You can find this by searching for "features" in the taskbar.
<div align="center">
<figure>
<img src="/assets/images/blogs/windows_features.png" alt="Windows 11 Features" style="width:50%">
</figure>
</div>
Once those optional features have been enabled, you need to change the advanced settings for the Windows updates. You need to change the default settings and enable "Receive updates for other Microsoft products". This is shown in the image below.
<div align="center">
<figure>
<img src="/assets/images/blogs/windows_update.png" alt="Windows 11 Updates" style="width:50%">
</figure>
</div>
Once this setting has been changed, you can check for Windows updates and WSL should be installed an updated without issue.

Finally, to install your desired Linux distribution you can download it directly from <a href="https://learn.microsoft.com/en-us/windows/wsl/install-manual#downloading-distributions" target="_blank">Microsoft</a>. After downloading the file, you can install it by simply double clicking the file.

I hope this helps anyone else who hits a similar roadblock on Windows 11 22H2.