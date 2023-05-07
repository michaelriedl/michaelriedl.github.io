---
layout: blogpost
thumb: /assets/images/thumbs/slurm_thumb.png
title: "Installing SLURM on Jetson Nano"
date: 2023-04-27
tags: programming deep-learning
intro: "Installing SLURM on a Jetson Nano in a Turing Pi 2 cluster."
---

<div align="center">
<figure>
<img src="/assets/images/blogs/slurm_install.png" alt="SLURM AI Art" style="width:50%">
<figcaption>AI generated image of "Installing SLURM workload manager on a NVIDIA Jetson Nano".</figcaption>
</figure>
</div>

Here I outline the steps to install SLURM on an NVIDIA Jetson Nano. I use this in a Turing Pi 2 cluster setup with a Raspberry Pi CM4 as the head node and three Jetson Nanos as compute nodes. The issue I encountered is that the version you can install with
```bash
sudo apt install slurmd
```
on the Jetson Nano is significantly behind the version installed on a Raspberry Pi CM4. Therefore to get a compatible version, you need to build SLURM from source. The sections below outline the steps to build from source.

## About SLURM
SLURM (Simple Linux Utility for Resource Management) is an open-source job scheduler and workload manager for Linux and Unix-like systems. It is commonly used in high-performance computing (HPC) clusters to manage and allocate computing resources, such as CPU cores, memory, and GPUs, among users and applications.

## Setup SSH Keys and Keychain
The first thing to do is setup SSH keys between your computer and the Jetson Nano.

```bash
ssh-keygen -t rsa
ssh-copy-id -i $HOME/.ssh/<ssh-key>.pub user@hostname
```

I like to have multiple SSH keys for different services. To manage the different keys, I use Keychain. This can be installed and launched with the commands below.

```bash
sudo apt install keychain
/usr/bin/keychain -q --nogui $HOME/.ssh/<ssh-key>
```

To have Keychain manage the SSH keys after a reboot, modify .bashrc to contain the entry below.

```bash
# add ssh keys
/usr/bin/keychain -q --nogui $HOME/.ssh/<ssh-key>
source $HOME/.keychain/<hostname>-sh
```

### Using ssh-agent Instead of Keychain
If you prefer not to use Keychain, you can use ssh-agent to manage your SSH keys instead. ssh-agent is a program that runs in the background and caches your SSH keys, so you don't have to keep typing in your passphrase every time you connect to a remote server. Here's how you can use ssh-agent:
```bash
# start ssh-agent
eval "$(ssh-agent -s)"

# add your SSH key to ssh-agent
ssh-add ~/.ssh/<ssh-key>

# verify that your key has been added
ssh-add -l
```

You can add the eval "$(ssh-agent -s)" line to your .bashrc file to automatically start ssh-agent when you open a terminal.

## Install IOZone (Optional)
I want to be able to test the NVMe speeds of the Jetson Nano and I use IOZone for that. It can be installed with the commands below.

```bash
export IOZONE_VERSION=iozone3_492
curl "http://www.iozone.org/src/current/$IOZONE_VERSION.tar" | tar -x
cd $IOZONE_VERSION/src/current
make --quiet linux-arm
```

## Install NVMe Temperature Monitor (Optional)
I also want to be able to monitor the temperature of the NVMe drives so I install nvme-cli with the commands below.

```bash
sudo apt install nvme-cli
sudo nvme smart-log /dev/nvme0 | grep "^temperature"
```

### Using smartctl Instead of nvme-cli
Another utility you can use to monitor the temperature of your NVMe drives is smartctl. smartctl is a tool that can read the S.M.A.R.T. (Self-Monitoring, Analysis and Reporting Technology) data from storage devices, including NVMe drives. Here's how you can use smartctl to monitor the temperature of your NVMe drives:

```bash
# install smartmontools
sudo apt install smartmontools

# view the temperature of the NVMe drive
sudo smartctl -a /dev/nvme0 | grep Temperature
```

### Other Things to Monitor
In addition to monitoring the temperature of your NVMe drives, you may also want to monitor other system metrics, such as CPU usage, memory usage, disk usage, and network activity. There are many tools available for monitoring these metrics, such as top, htop, nmon, iftop, and vnstat. You can install these tools using apt and use them to monitor your system's performance.

## Fix System Time
It is important to have the time across the nodes synchronized so that jobs can be coordinated and tracked. To make sure the times are accurate, we install a Network Time Protocol (NTP) utility. This is done with the commands below.
```bash
sudo apt install ntpdate -y
```

### About NTP and NTPdate
The Network Time Protocol (NTP) is a protocol used to synchronize the clocks of computers over a network. The protocol is designed to be accurate and reliable, and is commonly used in computer networks, including the Internet.

NTPdate is a simple utility that sets the system time on a Linux system by querying an NTP server. NTPdate is useful for correcting the system time if it is off by a few seconds or minutes.

However, NTPdate is not a full-featured NTP client, and it is not recommended for continuous use. For continuous time synchronization, it is recommended to use a full-featured NTP client, such as chrony or ntp.

## Build Munge from Source
Before building SLURM, you need to install Munge which is used for authentication across the nodes. We will also build Munge from source. Before building, we need to install dependencies and setup the user that is used for the Munge service.
```bash
sudo apt install libssl-dev

sudo groupadd -r munge
sudo useradd -c "MUNGE authentication service" --no-create-home -g munge -s /sbin/nologin -r munge
```

After that setup you can build from source using the instructions on <a href="https://github.com/dun/munge/wiki/Installation-Guide#installing-from-git" target="_blank">GitHub</a>. 

Next, move the munge.key into /etc/munge, make sure the permissions are set correctly, and start the service.

```bash
sudo chown -R munge:munge /etc/munge
sudo chown -R munge:munge /var/lib/munge
sudo chown -R munge:munge /var/log/munge

sudo systemctl enable munge
sudo systemctl start munge
```

## Build SLURM from Source
After installing Munge, we can then build SLURM from source. First, install the required dependencies.
```bash
sudo apt install libmysqlclient-dev
sudo apt install libpam0g-dev
sudo apt install libjson-c-dev
sudo apt install libhttp-parser-dev
sudo apt install libyaml-dev
sudo apt install libreadline-dev
sudo apt install libgtk-3-dev
sudo apt install man2html
sudo apt install libcurl4-openssl-dev
```

Next, you can configure and build SLURM with the commands below.
```bash
./configure --sysconfdir=/etc/slurm/
make
sudo make install

sudo install -D -m644 etc/slurmd.service /lib/systemd/system/
```

It is also important to setup the slurm user which is used to launch jobs on the compute nodes. It is very important that the User ID is the same across all of the nodes in the cluster. You can check the UID of the user slurm on the head node and set it on the compute nodes when you make the user. This is shown in the commands below.
```bash
sudo groupadd -r slurm
sudo useradd -c "SLURM service" --no-create-home -g slurm -s /sbin/nologin -r slurm --uid <UID>
```

Next, copy over configuration files. You may need to make the directory /etc/slurm with: 
```bash
sudo mkdir /etc/slurm
```

Finally, you can make the required directories, set their permissions, and start the service.
```bash
sudo mkdir /var/log/slurm
sudo mkdir /var/lib/slurm

sudo chown -R root:root /etc/slurm
sudo chown -R slurm:slurm /var/log/slurm/

sudo systemctl enable slurmd
sudo systemctl start slurmd 
```

You can check the status of the service with either of the commands below.
```bash
systemctl status slurmd.service
journalctl -xe
```

If you are having issues matching the UID of the slurm users across the nodes, you can use the command below to change the UID.
```bash
usermod -u NEW_UID your_username
```

In some threads it was noted that on newer versions of SLURM, you can specify the system unit directory with:
```bash
./configure --sysconfdir=/etc/slurm/ --with-systemdsystemunitdir=/etc/init.d/
```
However, this does not work in earlier versions of SLURM.

## Helpful SLURM Commands
```bash
sudo scontrol update nodename=tp2-node-2 state=down reason=hung_proc
sudo scontrol update nodename=tp2-node-2 state=resume
```

## Helpful Links

* <a href="https://slurm.schedmd.com/quickstart_admin.html" target="_blank">https://slurm.schedmd.com/quickstart_admin.html</a>
* <a href="https://glmdev.medium.com/building-a-raspberry-pi-cluster-784f0df9afbd" target="_blank">https://glmdev.medium.com/building-a-raspberry-pi-cluster-784f0df9afbd</a>
* <a href="https://github.com/dun/munge/issues/92" target="_blank">https://github.com/dun/munge/issues/92</a>
* Bad info: <a href="https://stackoverflow.com/questions/48410583/slurm-standalone-system-ubuntu-16-04-3-compiled-not-working-authentication" target="_blank">https://stackoverflow.com/questions/48410583/slurm-standalone-system-ubuntu-16-04-3-compiled-not-working-authentication</a>
* <a href="https://github.com/dun/munge/wiki/Installation-Guide" target="_blank">https://github.com/dun/munge/wiki/Installation-Guide</a>
* <a href="https://github.com/geerlingguy/pi-cluster/blob/06dde8a332a9ad9a4edc6a5ca188f3cdc6d01f5f/benchmarks/disk-benchmark.sh#L31" target="_blank">https://github.com/geerlingguy/pi-cluster/blob/06dde8a332a9ad9a4edc6a5ca188f3cdc6d01f5f/benchmarks/disk-benchmark.sh#L31</a>
* <a href="https://github.com/ThomasKaiser/sbc-bench/blob/master/sd-card-bench.sh" target="_blank">https://github.com/ThomasKaiser/sbc-bench/blob/master/sd-card-bench.sh</a>
* <a href="https://www.sevarg.net/2019/04/07/benchmarking-nvidia-jetson-nano/" target="_blank">https://www.sevarg.net/2019/04/07/benchmarking-nvidia-jetson-nano/</a>
* <a href="https://groups.google.com/g/slurm-users/c/9Qvs8q1Uc-A" target="_blank">https://groups.google.com/g/slurm-users/c/9Qvs8q1Uc-A</a>

