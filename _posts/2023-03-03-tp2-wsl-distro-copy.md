---
layout: blogpost
thumb: /assets/images/thumbs/wslcopy_thumb.png
title: "Copying a WSL Distribution"
date: 2023-03-03
tags: programming deep-learning
intro: "Copying a Windows Subsystem for Linux distribution and fixing common issues."
---

<div align="center">
<figure>
<img src="/assets/images/blogs/linux_wsl.jpg" alt="Linux Bird AI Art" style="width:50%">
<figcaption>AI generated image of "linux on a windows machine".</figcaption>
</figure>
</div>

I have found recently that the best workflow for me involves having multiple Ubuntu distributions on the Windows Subsystem for Linux (WSL). The multiple distributions are also split between WSL 1 and WSL 2 since there are pros and cons to the different versions of WSL. For instance, I use the WSL 1 distributions when I need to interact with the Windows file system. Additionally, I use the WSL 2 distributions when I need to use the hardware pass-though capabilities for GPU programming. In order to quickly setup these various distributions, I used the export and import functionality of WSL.

## Duplicating a WSL Distribution

I initially used <a href="https://endjin.com/blog/2021/11/setting-up-multiple-wsl-distribution-instances" target="_blank">this guide</a> for duplicating the various WSL distributions. First, open the command prompt or Windows PowerShell and create a folder somewhere to store the distribution images. Once that folder has been created and you have changed directories into the folder, you can duplicate a WSL distribution with the following commands. This first command will export the distribution you are duplicating:
```bash
wsl --export <distribution name> <export file name>

# Example:
wsl --export Ubuntu ubuntu.tar
```
Next, you can import the image to create the new distribution using the exported image as the base. This is accomplished with the following command:
```bash
wsl --import <new distribution name> <install location> <export file name>

# Example:
wsl --import Ubuntu-cuda .\ubuntu-cuda ubuntu.tar
```

Once you have created the new instance of the distribution, you can list the available distributions with the command:
```bash
wsl -l -v
```
and open it with the command:
```bash
wsl -d <distribution name>
```

If you have WSL 2 as the default version, then the duplicated distribution will use WSL 2 even if the original distribution was running on WSL 1. You can change the WSL version using the following command:
```bash
wsl --set-version <distribution name> <version number>

# Example:
wsl --set-version Ubuntu 2
```
Additionally, you can change the default WSL version with the command:
```bash
wsl --set-default-version <version number>

# Example:
wsl --set-default-version 2
```

## Fixing Common Issues

You may find after starting the distribution, that you are logged in as the root user. This can be fixed by modifying the file /etc/wsl.conf in the distribution. You could also start the distribution with the command:
```bash
wsl -d <new distribution name> -u <username>
```

I have found that these are the default settings in /etc/wsl.conf that I prefer to use:
```bash
[user]
default=<username>

[boot]
systemd=true

[automount]
enabled=true

[interop]
appendWindowsPath=false

[network]
generateResolvConf=false
```

I hope this helps anyone else looking to run multiple distributions across the different versions of WSL.