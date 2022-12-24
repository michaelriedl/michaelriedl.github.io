---
layout: blogpost
thumb: /assets/images/thumbs/macos_cron_rsync_thumb.png
title: "Schedule Rsync Jobs with Crontab on MacOS"
date: 2022-01-02
tags: programming
intro: "Steps and settings to run crontab scheduled rsync jobs with macOS."
---

I have been meaning to setup a data backup plan for my machines for quite some time. I used to rely on a system of external drives that I would occasionally connect to my main machine and copy over a manual backup to the drive before putting the drive back into storage. In the last couple of years, I have lost that habit of routinely backing up to the external drives. I was spurred to act after watching <a href="https://youtu.be/S0KZ5iXTkzg" target="_blank">Jeff Geerling's video</a> on the topic.

My new data backup plan is to use rsync to manually sync my project files between my desktop and my laptop. I will then have scheduled rsync jobs, using cron, to backup the entirety of my laptop to another machine which has a large HDD for backups. Since my desktop strictly has project files that are synced with my laptop, there is no need to also back it up. To implement the plan, I need to create an rsync shell script and add a job schedule using crontab. I will describe the steps below since I ran into a couple issues when setting this up.

## 1. Creating an Rsync Shell Script
I created my script following the guidance of this <a href="https://ole.michelsen.dk/blog/schedule-jobs-with-crontab-on-mac-osx/" target="_blank">blog post</a>. I have included the *PATH* and *MAILTO* lines but I am not sure they are entirely necessary after I did some testing; leaving them does not seem to cause any issues. My shell script is shown in the code block below.
```
#!/bin/sh
# Add the paths needed
PATH=/usr/local/bin:/usr/local/sbin:~/bin:/usr/bin:/bin:/usr/sbin:/sbin
# Disable mail alerts
MAILTO=""

# This solves the "Permission denied, please try again." error
# Where ssh-agent is running, for password-less access to the key
export SSH_AUTH_SOCK=$( ls /private/tmp/com.apple.launchd.*/Listeners )

# Print the time for logging purposes
now=$(date)
echo "Running backup now : $now"

# Run the rsync
rsync -vrau --delete -e "ssh -p port" \
/path/to/backup \
user@ip:/path/to/backup \
--exclude="Library" \
--exclude="Library/*" \
--exclude=".Trash" \
--exclude=".Trash/*" 

# Print a blank line for logging purposes
echo ""
``` 

One issue I had was the rsync failing due to not finding the correct ssh key that I setup. I was getting the error:
```
Permission denied, please try again.
Permission denied, please try again.
user@ip: Permission denied (publickey,password).
rsync: connection unexpectedly closed (0 bytes received so far) [sender]
rsync error: unexplained error (code 255) at /System/Volumes/Data/... [sender=2.6.9]
```
To fix this error, I added the following line to my script which points an environment variable to the running ssh-agent so that the correct ssh key is used.
```
export SSH_AUTH_SOCK=$( ls /private/tmp/com.apple.launchd.*/Listeners )
```
I found this fix on this <a href="https://chrishardie.com/2015/04/cron-rsync-encrypted-ssh-keys-osx/" target="_blank">blog post</a>. Next, I need to setup the cron job using crontab.

## 2. Adding a Cron Job with Crontab
Adding a new cron job is pretty straightforward. First, open the job list with:
```
crontab -e
```
This will open an editor (mine defaults to Vim) so you can add the line:
```
0 0 * * * cd /path/to && ./backup.sh >> /path/to/backup.log 2>&1
```
After closing the editor, you can look at the scheduled jobs by running:
```
crontab -l
```
The job I scheduled will run the backup every day at midnight and save the output of the script to the specified log file. This is why we added the date output to the backup script. The last thing to do is make sure that cron has access to the file system. You have to change the security settings in macOS otherwise the rsync will simply fail. I found the fix for this on <a href="https://apple.stackexchange.com/questions/375383/rsync-in-cron-on-catalina-no-longer-working" target="_blank">Stack Exchange</a>.
* Open System Preferences : Security & Privacy : Privacy : Full Disk Access
* In the Full Disk Access preference pane, hitting Command+Shift+G will allow typing */usr/sbin/* in order to then choose *cron*

After this fix, the cron job should run and you should see output in your backup log. Hopefully these steps help someone else get their backups running smoothly!
