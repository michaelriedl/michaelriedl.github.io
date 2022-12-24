---
layout: blogpost
thumb: /assets/images/thumbs/virtualenv_thumb.png
title: "Setting Up a Python Virtual Environment on a RPi"
date: 2022-08-06
tags: raspberry-pi programming
intro: "How to setup a Python virtual environment (virtualenv) on a Raspberry Pi."
---

A Python virtual environment allows you to build individual environments for your programming projects to install the required packages for the projects. Keeping environments separate for each project allows for the minimal dependencies to be installed to run the project. It also prevents package versions from clashing across projects. Finally, it makes it a little bit easier to share the environment requirements with someone else who wants to run your Python project.

You can easily install virtualenv on a Raspberry Pi with pip using the following command:
```bash
pip install virtualenv
```

If you do not have pip installed yet, you can install it with:
```bash
sudo apt install python3-pip
```

To put the virtualenv bin folder on your path you can modify the ~/.bashrc file and add the following line:
```bash
export PATH=$PATH:/home/pi/.local/bin
```

You will need to logout and log back in for the path modification to take place. Finally, you can setup and activate a virtualenv with:
```bash
virtualenv test
source test/bin/activate
```

You can also deactivate an environment with:
```bash
deactivate
```

I hope this helps someone get started with Python and virtualenv on a Raspberry Pi!
