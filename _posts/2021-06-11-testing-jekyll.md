---
layout: blogpost
thumb: /assets/images/thumbs/jekyll_thumb.png
title: "Testing Your GitHub Pages Site Locally with Jekyll"
date: 2021-06-11
tags: programming
intro: "Getting GitHub pages and Jekyll setup locally on macOS."
---

I use GitHub Pages to host this blog and the most annoying part is constantly pushing changes to the repository and waiting for the site to rebuild to see the changes. This is particularly painful when adding any new styling or JavaScript functionality. I always knew that there was a way to host a Jekyll site locally to do development before pushing the changes to GitHub Pages, but until recently I found it too intimidating to try setting everything up. I wanted to write this post because I finally took the dive and did not find the <a href="https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/testing-your-github-pages-site-locally-with-jekyll" target="_blank">tutorial on GitHub</a> particularly useful for someone who is completely new to Ruby, Bundler, and Jekyll. The steps I took to get it working are:

## 1) Install Ruby

I installed the latest version of Ruby using <a href="https://brew.sh" target="_blank">Homebrew</a>. This can be done with the code below. You can skip the first command if you already have Homebrew installed.

```bash
$ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

$ brew install ruby
```

After installing Ruby, you will be prompted to add the Ruby install location to your PATH. The installer will provide the correct code to copy and paste.

## 2) Install Bundler

I installed Bundler using gem as recommended on the <a href="https://bundler.io" target="_blank">Bundler homepage</a>. You can check that gem is already installed and install Bundler as follows:
```bash
$ which gem
/usr/local/opt/ruby/bin/gem

$ gem install bundler
```

## 3) Install Jekyll with GitHub Pages Settings

This is the part of the guide provided by GitHub that lost me and I struggled to figure out what I needed to do. It ended up being quite simple after reading some other blog posts and debugging an error message. All you need to do is navigate to the folder that has all the source files for your Pages site and create a file named *Gemfile* and add the following lines to the file:
```
source "https://rubygems.org"
gem "github-pages"
gem "webrick"
```
This will install Jekyll with the appropriate settings and modules to mimic the setup on GitHub Pages. For some reason, you currently need to manually add the webrick dependency. Once this *Gemfile* is created you can install everything with:
```bash
$ bundle install
```

## 4) Launch Jekyll
Once the install is complete, you can launch the Jekyll server with:
```bash
$ bundle exec jekyll serve
Configuration file: /path/_config.yml
            Source: .
       Destination: /path/_site
 Incremental build: disabled. Enable with --incremental
      Generating... 
                    done in 0.994 seconds.
 Auto-regeneration: enabled for '.'
    Server address: http://127.0.0.1:4000
  Server running... press ctrl-c to stop.
```

Hopefully this guide will help someone else jumpstart their local blog development for GitHub Pages. Good luck!
