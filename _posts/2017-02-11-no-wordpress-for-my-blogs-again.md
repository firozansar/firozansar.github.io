---
layout: post
title:  "Why I'll not use Wordpress for my blogs again"
image: ''
date:   2017-02-11 00:06:31
tags:
- Jekyll
description: ''
categories:
- blog
series: learn
---

First I want to make it clear that its not a tirade against Wordpress. [Here](https://codeinwp.com/blog/wordpress-statistics/) are some interesting facts about Wordpress. What I am trying to say here is that if you are looking for a blog platform, there is a good alternative which I'll elaborate later.

 I went to the Wordpress route a few years back convinced by those facts. What I learned from my experience is Wordpress is hacker's and spammer's paradise. If poorly written plugin are not enough for SQL injection, then plenty of online scripts are out there which will do the hacking job easily. If your blog grows in popularity, the number of spam comments will increase in tandem. Not to mention all the hosting charges you incurred for your website from providers like GoDaddy. 
 
 So when I was looking for a good alternatives for Wordpress, I came across Static Website Generators. Never heard of it? [here](https://davidwalsh.name/introduction-static-site-generators) is a really good introduction. Currently there are [450 of them to choose from](https://staticsitegenerators.net/). My personal choice is [Jekyll](https://jekyllrb.com/). Instead of using databases, Jekyll takes the content, renders Markdown (or Textile) and Liquid templates, and produces a complete, static website ready to be served by any server. Jekyll is the engine behind [GitHub Pages](https://pages.github.com/) which presently I am using to host my personal blog website: [firozansar.github.io](https://firozansar.github.io/). Github page is free one per Github account and you can even [add custom domain](https://help.github.com/articles/using-a-custom-domain-with-github-pages/). It is hosted directly from the Github repository, so whatever changes I push to my [repository](https://github.com/firozansar/firozansar.github.io) it goes live instantly. Jekyll's content model has grown rich enough to support websites with way more complexity than that of a simple blog. There are thousands of plugins available to extend Jekyll. I have seen some people prefer CMS system where they just edit the web content in the browser. If you prefer CMS, there are options like [CloudCannon](http://cloudcannon.com/). 