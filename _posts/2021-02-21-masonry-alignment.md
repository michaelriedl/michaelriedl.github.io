---
layout: blogpost
title: "Masonry Alignment Issues"
date: 2021-02-21
tags: programming
description: "How to fix Masonry alignment issues on screen rotation."
---

I've been helping build a new website for a small business and came across this really weird issue. We are using a free CSS design [Moschino](https://www.free-css.com/free-css-templates/page263/moschino) which uses [Masonry](https://masonry.desandro.com) to handle the resizing and alignment of the images and text on the home screen. The issue we came across is on mobile, if the screen was rotated from portrait to landscape and then back to portrait, Masonry would not resize the images and text correctly; it would leave images and text overlapping each other. We could also duplicate this on a desktop by shrinking the window really small and forcing the layout into a single column. 

Based on playing around with the error, it felt like there was some kind of circular logic issue where the element needed to wait for Masonry to change the arrangement before resizing itself but Masonry also needed to know the new element size before making the new arrangement. I searched and searched and couldn't really find an easy solution. I tried fixing the issue myself by adding in delays to Masonry hoping that this was caused by some kind of race condition. However, nothing I tried fixed the issue.

Finally, after going back to searching I found an [answer](https://github.com/desandro/masonry/issues/427#issuecomment-50423923) to fixing this problem. Basically, the elements that Masonry controls need an explicit default size even if they are being dynamically resized by the CSS. This can be solved by adding in 
```html
.hentry {
    margin: 0 0 3.5em;
    width: 100%
}
```
to the style.css for the Moschino template.
