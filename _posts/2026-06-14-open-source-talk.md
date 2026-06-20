---
layout: post
title: The Need for Free and Open Source Software
date: 2026-06-14 14:00
description: A small talk I gave on FOSS.
tags: misc
---

Despite my deep interest and involvement with Free software and open source, it is actually not an ideology I've held for very long. While I've known what open source was its importance was never impressed upon me till I joined college and sometime in my second year I had to get a Linux distribution for a programming class.

While we could have used Windows for the development our Professor told us it is much easier in Linux and I've always liked machines and messing with them. However, I was too scared to try it out on my expensive gaming laptop. So I did the next best thing and convinced my roommate it was a good idea to try it out on his laptop. In my defense his laptop was quite old and he was quite computer illiterate at the time [^1], which led him to make the grave mistake of "upgrading" to Windows 11. This absolutely gutted his relatively new laptop and made it nearly unusable. He was going to buy a new laptop so I managed to convince him that we should try installing Linux on it.

We looked around and decided Fedora was pretty "scientific" and looked well supported enough. This random decision extended that laptop's lifespan by nearly two years as his laptop went from being literally unusable to just a little slow. I realized Linux was pretty safe and ended up getting it myself. 

After this I realized I was using it quite a bit more than I expected and I came to a very abrupt realization. My laptop felt way better all of a sudden. It felt responsive and like an actual tool for doing things instead of a dystopian advertisement terminal that begrudgingly did my bidding once in a while. No more Windows updates, no more ads in the start menu, actually no more start menu at all. I know many people have strong opinions about GNOME but coming from Windows its a life changer. It actually has so many features that seemed built to help the user instead of for some arbitrary or hostile reason.

My computing experience was significantly better. So many things that I struggled with on Windows just worked. Programs were a single command to run. I knew exactly what my PC was doing and I actually got to use my laptop without a charger once in a while (This was important as I made the terrible mistake of assuming a 3 Kg gaming laptop would be a great college laptop). 

After a few years of this truly enjoyable experience I became the de facto Linux guy at my college. I can confidently say apart from the one or two people who installed mint I was responsible for every single Linux install (all of which were Fedora Workstation till I learned about Silverblue) at my institute. This made me realize that for most people there was actually not a single reason to use Windows. Combine this with my background in physics and my love for LaTeX, I quickly connected the dots and realized the problem wasn't with Linux or the people who used Windows.

A lot of research and forum delving later, I realized how deep the plot ran. There was absolutely zero marketing for Free and Open source software and the corporate software world put out their best efforts to make sure the community built copyleft movement never saw the light of day. This pissed me off. What made me even more mad was there were so many examples of similar things happening in places that I cared about. For example, the reality of journals in science. I realized the biggest problem in this space was lack of awareness. 

Since I realized this I thought I should do something about it myself. In my institute we had a Science Club which used to give short talks, seminars and workshops on various topics. My friends and I took it upon ourselves to have a Linux Workshop every year. We helped people install Linux and talked about the general advantages of these systems as well. Eventually, last year when I was in the middle of my Master's thesis one of my juniors who worked with the [Breakthrough Science Society](https://breakthroughindia.org/) asked me if I could give a talk on Open Source software. I agreed happily since I had very little to do while my MESA simulations ran. I was went into it thinking it would be a small affair but when I found out that there was a Professor from IISER Mohali invited as the other speaker [^2] I realized I had to up my game.

To not embarrass myself I pulled two all nighters before the talk and made a presentation that I could be proud of. This presentation is what I've linked below.

<a target="_blank" href="/assets/pdf/FOSSTalk.pdf"><img src="/assets/img/presentation_thumbnail.png" alt="Presentation Link" style="max-width: 100%; height: auto;"></a>

I thought it was incredible to be given the chance to officially give a talk so early in my scientific career but I ended up giving the same talk at Mithibhai College of Arts to the Physics students there as part of a program that Breakthrough Science Society organized. This gave me the opportunity to refine the presentation further which is still not the same as the version I've put up here. I suppose one never finds satisfaction in creative pursuits (The blog post sitting in my drafts folder for 2 years going now is a great example). 

What I realized giving this talk multiple times is that people hate Windows but have no idea that there are alternatives. What FOSS and Linux gives is the realization that you have a very real alternative that is actually much better in many ways. I'd say there's still some ways to go for Linux and FOSS to overtake proprietary software but the onus is actually on the consumers and not on the community. FOSS is in a great place today and more people would only speed up the process.  

<div class="v-ascii-art" id="linux_peng_art">
</div>

[^1]: After being exposed to Fedora and Linux in general he rapidly evolved and now does scientific computation in Theoretical Condensed Matter and related fields. 
[^2]: He gave a wonderful talk on the reality of publishing in science and the importance of Open Access and archiving.

<script>
  fetch('/assets/txt/penguin.txt')
  .then(response => response.text())
  .then((data) => {
    document.getElementById("linux_peng_art").innerText = data;
  }) 
</script> 
