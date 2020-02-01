---
layout: blogpost
title: "PokeGAN"
date: 2018-04-28
tags: programming deep-learning
description: "Generative Adversarial Network (GAN) for Pokemon generation."
---

One of the current research topics we find very interesting is Deep Learning. Deep learning algorithms have shown state-of-the-art performance for many perceptual problems such as image classification and speech recognition. Since it appears that deep learning is going to continue to be a very hot topic for at least the near future, we made it a goal to learn more about the subject. Before learning the basics, we thought it would be fun to dive off the deep end and try a deep learning project based on existing work.

# Generative Adversarial Networks

Generative adversarial networks (GANs) are essentially two networks that are trying to win a game. The generator network tries to generate samples that come from the same distribution of the training data while the discriminator network tries to determine whether the samples are real or fake. The generator network is trying to win this game by tricking the discriminator into thinking samples are real when they are in fact fake. The discriminator network is trying to win the game by correctly telling the real samples from the fake samples. Iteratively training these networks will eventually result in a generator network capable of creating samples that cannot be discerned from real samples.

This is an incredibly simple explanation of GANs that we have cobbled together from reading various papers and blog posts on the topic. If you would like to read more, we suggest that you follow up with some of these links:
* [Generative Adversarial Networks](https://arxiv.org/abs/1406.2661)
* [GAN Tutorial - Ian Goodfellow](https://arxiv.org/abs/1701.00160)
* [Understanding GANs](https://danieltakeshi.github.io/2017/03/05/understanding-generative-adversarial-networks/)

# The PokeGAN

A super cool project that got us interested in GANs involved using a GAN to generate images of cat faces. The source code for the project can be found [here](https://github.com/AlexiaJM/Deep-learning-with-cats) and a discussion of the results can be found [here](https://ajolicoeur.wordpress.com/cats/). For our project, we decided to use the same code and modify the training data in order to generate new Pokemon sprites.

The training data we chose to use is this Pokemon sprite sheet that we found with a Google search.

![](/assets/images/Poke_Sprite_Sheet.png){:height="50%" width="50%"}

We then used a Python script to subdivide the sheet into individual files for each sprite on the sheet. For variety, we also used a horizontally mirrored version of each subdivided sprite in the training set. For the initial run, we had the code automatically resize our sprites to 64x64 pixels even though it probably would have been better to manually crop the sprites to 32x32 pixels. The smaller sprite size would have reduced the run time.

We allowed the GAN to run overnight on our four core iMac. The training was pretty slow, taking about seven minutes per epoch. We noticed that the GAN had diverged after about the 140th epoch and the generator network began producing noise images. One of the best images produced was this one:

![](/assets/images/fake_samples_epoch125.png){:height="100%" width="100%"}

It can be seen that most of these wouldn't really pass as a Pokemon but they are still pretty cool results. It is interesting to point out that a couple of images are nearly identical and are shaped like one of the moth Pokemon. After closer inspection of the original sprite sheet, there are a disproportionate amount of the moth sprites would may have biased these results.

We would like to continue to refine this project as we learn more about the fundamentals of deep learning. Future work will include:
1. Upload the code to a [repository](https://github.com/tmtrcreations/PokeGAN)
2. Balancing the training data so that a single sprite shape doesn't bias the output
3. Cropping the sprites to 32x32 pixels to help with runtime
4. Refining the algorithm to help with convergence 
5. Possibly building a deep learning rig with a powerful GPU
6. Obviously, learning more about the fundamentals of deep learning

