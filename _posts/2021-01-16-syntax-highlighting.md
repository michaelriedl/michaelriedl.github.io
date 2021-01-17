---
layout: blogpost
title: "Github.io Syntax Highlighting"
date: 2021-01-16
tags: programming
description: "Getting syntax highlighting to work on your blog."
---

I tried using the block syntax highlighting feature of Github.io blogs using Jekyll and Kramdown. However, it did not seem to work right out of the box. I had to do some searching and no one seemed to have a start to finish guide and I had to piece multiple suggestions together. To ultimately get it working I had to do a number of things.

First, I needed to add a _config.yml to the base directory of my site. I originally did not have one since most features of the site seemed to be working without one. My _config.yml is the default suggested and is as follows:
```
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
```

After adding the configuration YAML, I could see that the code blocks were inserting the correct tags for syntax highlighting. However, the highlighting was not working because my CSS did not support syntax highlighting. The easiest way I found to fix this is by downloading a syntax CSS from <a href="http://jwarby.github.io/jekyll-pygments-themes/languages/javascript.html " target="_blank">here</a> and loading it along with my base CSS with
```html
<link rel="stylesheet" href="/assets/css/syntax.css">
```
in my default.html layout. After adding the syntax CSS, my code block syntax highlighting started working. The final piece of advice is that the syntax language tag should be all lowercase. 
