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

Here I outline the steps to install SLURM on an NVIDIA Jetson Nano. I use this in a Turing Pi 2 cluster setup.

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

## Install IOZone (Optional)
I want to be able to test the NVMe speeds of the Jetson Nano and I use IOZone for that. It can be installed with the commands below.

```bash
export IOZONE_VERSION=iozone3_492
curl "http://www.iozone.org/src/current/$IOZONE_VERSION.tar" | tar -x
cd $IOZONE_VERSION/src/current
make --quiet linux-arm
```

## Install NVMe Temperature Sensor (Optional)
I also want to be able to monitor the temperature of the NVMe drives so I install nvme-cli with the commands below.

```bash
sudo apt install nvme-cli
sudo nvme smart-log /dev/nvme0 | grep "^temperature"
```

## Fix System Time
```bash
sudo apt install ntpdate -y
```

## Build Munge from Source
```bash
sudo apt install libssl-dev

sudo groupadd -r munge
sudo useradd -c "MUNGE authentication service" --no-create-home -g munge -s /sbin/nologin -r munge
```

Build from source using the instructions on <a href="https://github.com/dun/munge/wiki/Installation-Guide#installing-from-git" target="_blank">GitHub</a>. 

Move the munge.key into /etc/munge

```bash
sudo chown -R munge:munge /etc/munge
sudo chown -R munge:munge /var/lib/munge
sudo chown -R munge:munge /var/log/munge

sudo systemctl enable munge
sudo systemctl start munge
```

## Build SLURM from Source
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

./configure --sysconfdir=/etc/slurm/
make
sudo make install

sudo install -D -m644 etc/slurmd.service /lib/systemd/system/

sudo groupadd -r slurm
sudo useradd -c "SLURM service" --no-create-home -g slurm -s /sbin/nologin -r slurm --uid <UID>
```

Copy over configuration files

May need to make /etc/slurm with: sudo mkdir /etc/slurm

```bash
sudo mkdir /var/log/slurm
sudo mkdir /var/lib/slurm

sudo chown -R root:root /etc/slurm
sudo chown -R slurm:slurm /var/log/slurm/

sudo systemctl enable slurmd
sudo systemctl start slurmd 

systemctl status slurmd.service
journalctl -xe
```

```bash
usermod -u NEW_UID your_username
```

```bash
sudo scontrol update nodename=tp2-node-2 state=down reason=hung_proc
sudo scontrol update nodename=tp2-node-2 state=resume
```

In some threads it was noted that on newer versions of SLURM, you can specify the system unit directory with:
```bash
./configure --sysconfdir=/etc/slurm/ --with-systemdsystemunitdir=/etc/init.d/
```
However, this does not work in earlier versions of SLURM.

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

