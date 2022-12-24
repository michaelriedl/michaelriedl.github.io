---
layout: blogpost
thumb: /assets/images/thumbs/collections_thumb.png
title: "Jekyll Loops and Collections"
date: 2021-06-08
tags: programming
intro: "Adding additional collections to your GitHub Pages."
---

I have been using Jekyll with GitHub Pages to host my personal blog for a number of years. By default, Jekyll allows you to manage your blog posts with the _posts folder (<a href="https://jekyllrb.com/docs/posts/" target="_blank">reference</a>). You can then iterate over the posts collections using loops to easily populate your homepage or dynamically display them. I wanted to be able to have a second collection for manage my projects which have larger write ups. I struggled to figure out how to get this working but I eventually found this excellent <a href="https://carpentries-incubator.github.io/jekyll-pages-novice/arrays/index.html" target="_blank">reference</a>. The relevant sections are title "Configuring a Collection" and "Looping Over a Collection".

The solution is to set a new collection in your _config.yml file. I added an additional collection named "writeups" so now I have that to manage my projects in addition to the "posts" collection for my shorter blog posts. My current _config.yml is shown below for example. It can be seen in the last section where I add the new collection.
```yaml
timezone: America/New_York
lsi: false
safe: true
source: .
incremental: false
highlighter: rouge
gist:
  noscript: false
kramdown:
  math_engine: mathjax
  syntax_highlighter: rouge

collections:
  writeups:
    output: true
```



