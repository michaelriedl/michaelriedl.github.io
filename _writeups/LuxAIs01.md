---
layout: projectpost
thumb: /assets/images/thumbs/lux_ai_thumb.png
title: LuxAI Season 1
date: 2021-12-30
update: 2021-12-30
---

<script type="text/javascript" async
    src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML">
</script>

<div align="center">
<figure>
    <img src="/assets/images/thumbs/lux_ai_thumb.png" alt="LuxAI Season 1">
</figure>
</div>

I recently competed in the LuxAI Season 1 Kaggle competition. The competition was to develop an agent to play a turn-based two-player game. The game involves collecting resources, building cities, and surviving the day/night cycle. I wanted to participate in the competition in order to learn more about reinforcement learning (RL). I was also excited that the competition offered a number of languages for coding/implementing the agent, including Python which I currently use most often. In the process of competing, I developed a greedy heuristic agent as well as a rule-based RL agent. Here I document the algorithms and outline potential future directions to explore.

The rest of the write up is organized as follows. First, I present the greedy heuristic agent and the rules that govern its actions. Next, I introduce the rule-based reinforcement learning agent including the method, implementation, and result. Finally, I conclude with a comparison of the two agents and their performance. I will not exhaustively describe the rules of the LuxAI game except where they are relevant to the agent implementation. For a complete description of the game see the <a href="https://www.lux-ai.org/specs-2021" target="_blank">official specifications</a>.

## Greedy Heuristic Agent
Before diving in to reinforcement learning for the first time, I created a greedy heuristic agent based on very simple rules to get a feel for the game as well as submitting an agent to the competition. The agent can be broken down into two pieces:
1. Decision making
2. Action taking

The decision making part of the agent takes the board state and makes a decision about what high-level action should be taken by each unit and city on the board. For instance, the agent may decide that a unit should move to a resource and mine that resource until a certain criteria has been met. The action taking part of the agent implements the high-level action decided upon by the previous part. Using the previous example, for a unit to move to a resource it must take a certain path and move one tile each turn until it has reached the resource. The action taking part implements the turn-level actions to achieve the high-level action the agent decided for a unit or city. By breaking the agent into these two pieces, I can separate the high-level decision making, which is governed by strategy, from the turn-level action taking, which is governed by path finding and collision avoidance. This bifurcation of the agent allows for simpler decision making since the "how" of an action does not need to be understood by the decision making piece. Likewise, the action taking piece does not need to know the "why" of the high-level action to be taken.

The initial greedy agent implements this two-piece approach using heuristics for the decision making and simple path finding and collision avoidance for the action taking. Here I will outline the heuristics used for the decision making but will not go into detail about the path finding and obstacle avoidance since they are not interesting or sophisticated. Additionally, this agent does not use carts and only spawns workers. The heuristics for the worker decision making are as follows:
1. If a worker has 100 resources then it should move to an empty tile and build a city.
2. If a worker has less than 100 resources then it should move to the nearest resource tile and collect resources.

The heuristics for the city decision making are as follows:
1. If the unit limit has not been reached then it should build a worker.
2. If the unit limit has been reached then it should perform research.

These heuristics are incredibly simple but were good enough for the agent to be ranked in the top 50% early in the competition. As I stated before, the action taking portion of the agent is not interesting and basically tries to coordinate the movements of the workers so that they all move towards their objective each turn. To improve the performance of this agent, I needed to incorporate reinforcement learning into the decision making piece of the agent.

## Rule-Based Reinforcement Learning Agent
To incorporate reinforcement learning into the two-piece agent framework, I searched the literature for rule-based reinforcement learning approaches. Rule-based approaches allow me to incorporate obvious strategies and rules for the agent to use without needing the agent to learn them from scratch by playing a large number of games. With a rule-based approach the agent would only need to learn a small number of parameters, hopefully reducing the number of games that need to be played for the agent to learn good parameters. In the following subsection I summarize the method I found and decided to use for this agent.

### Method
The method that aligned with what I was trying to accomplish comes from <a href="https://doi.org/10.1016/j.robot.2020.103568" target="_blank">Likmeta et al.</a> The authors develop an approach to combine reinforcement learning with rule-based decision making to achieve transparency and robustness in the domain of self driving car agents. The key contribution of the paper for this project is the "reinforcement learning with parametric rule-based policies". The authors present rule-based policies that are parameterized and use a re-parameterization trick so that the hyperparameters are differentiable and can be learned with a gradient decent algorithm, thereby indirectly learning the parameters of the rule-based policy.

I think the re-parameterization is the most interesting part of the approach; so, I will try to describe how it works with an example. Let's reuse some of the decision making of the greedy heuristic agent and make a rule that if a worker does not have enough resources to build a city then it should go to the "best" resource tile to collect resources. To define "best" I create the following features:
1. Distance from unit to resource $$ (f_1) $$
2. Average distance from all other units to resource $$ (f_2) $$
3. Average distance of opponent's units to resource $$ (f_3) $$

These features can then be combined to rank-order the resource tiles to determine the "best" resource tile the worker should go to collect resources. This combination is shown in the equation below where I can weight the importance of each feature by weight $$w_n$$.
\$$\text{score} = w_1f_1 + w_2f_2 + w_3f_3 $$

These weights can then be learned through the reinforcement learning algorithm. However, since the resource is chosen by taking the maximum score, the decision making rule is not differentiable. This is where the re-parameterization trick is required. Instead of learning the weights, $$w_n$$, directly, the reinforcement learning algorithm learns the hyperparameters of their distribution. Specifically, I assume that the weights are normally distributed
\$$w_n \sim \mathcal{N}(\mu_n, \sigma^2_n)$$

and the hyperparameters $$\mu_n$$ and $$\sigma^2_n$$ are learned. 

As the reinforcement learning progresses, the variances of the distributions should decrease so that the optimal value of the weights can be assumed to be the learned means. The means can then be substituted as the final weights and the agent can be submitted to the competition. This learning behavior is visualized in the Result subsection that discusses the final result of this approach. For more details of the algorithm please see the original paper. The exact rule-based policies and training implementation are described in the next subsection.

### Implementation
The first thing I did to implement the agent was to finalize the parameterized rule-based policies. To keep things simple, I kept the same policies from the greedy heuristic agent and parameterized them. The policies for the worker and city are shown below.

**Worker:**
1. Worker has 100 resources\
    a. If the worker can build a city on the current tile, then build.\
    b. Else, move to the closest empty tile to build the city.
2. The worker has < 100 resources\
    a. Go to the resource with the highest score, using the score described previously, and collect resources.
    
**City:**
1. If the unit limit has not been reached then it should build a worker.\
2. If the unit limit has been reached then it should perform research.

I used the parameterized resource tile score from the previous subsection since the features made sense and were easy to implement. Finally, the action taking piece of the agent is the same as the greedy heuristic agent.

I then implemented the training algorithm in PyTorch. While I could have just used Numpy or another numerical package, I wanted to utilize the gradient descent optimizers and learning rate schedulers that are already implemented and available in PyTorch. To train the RL agent, I had it play games against the greedy heuristic agent I developed previously. I did this for two reasons. One, a learning agent should be able to learn to outplay a static heuristic agent. And two, the greedy heuristic agent was already in the top 50% so if the RL agents learns to play better, then I should progress up the leaderboard.

The hyperparameters I used to train the RL agent are as follows:
* The parameters are sampled from their distributions to produce 5 agents
* Each agent plays 10 games against the greedy heuristic agent
* Agent learns for 500 steps
* Learning rate = $$ 1e-3 $$
* Discount factor = $$ 0.99 $$
* The reward function is the difference between the number of cities for each player at each turn
* Like the reference paper, I use the optimal baseline to stabilize the training 

I also used multiprocessing to speed up the training process. The major bottleneck was running the games so the more CPU cores I could use for running the games, the faster the training would run. Unfortunately, I was limited to 4 CPU cores so running the training for 500 steps took about 10 hours. The result of training this agent is detailed in the following subsection. 

### Result
Here I discuss the result of training the rule-based reinforcement learning agent. First, I plot the average reward of the agent over the 500 training steps. This is shown in the figure below.
<div align="center">
<figure>
    <img src="/assets/images/projects/luxais01/reward.png" alt="Training result" width="50%">
</figure>
</div>
It can be seen from the reward figure that the agent is learning and obtaining a higher reward as the training progresses. By the end of the training, the agent is easily defeating the greedy heuristic agent.

Next, I plot the distributions of the learned weights over the training steps. As mentioned previously, the agent does not learn the weight parameters directly, but rather the hyperparameters of the distribution for the parameters. This distribution learning is shown in the animation below.
<div align="center">
<figure>
    <img src="/assets/images/projects/luxais01/rule_based_rl.gif" alt="Training result" width="50%">
</figure>
</div>
It can be seen from the animation above that the means shift over time to the best value and the variances shrink as the agent becomes more confident of those parameter values. As mentioned previously, after training, the learned means are substituted as the final weight parameters so that the agent can be submitted. It is interesting to note that the agent gives almost zero weight to the feature that characterizes the opponent's units, $$ w_3 $$.

## Comparison of the Agents
In this section I compare the behavior of the greedy heuristic and rule-based RL agents. To do this comparison, I have each agent play a simple agent that only collects resources with a single worker. I then have the two agents play each other. Each of these games uses the same seed so that the board is identical for each match. The replays of the games are shown in the videos below.
<video class="embed-responsive" width="640" height="480" controls>
    <source src="/assets/videos/projects/simple_vs_greedy.mov">
Your browser does not support the video tag.
</video>
<center>Simple agent versus greedy heuristic agent.</center>

<video class="embed-responsive" width="640" height="480" controls>
    <source src="/assets/videos/projects/simple_vs_rl.mov">
Your browser does not support the video tag.
</video>
<center>Simple agent versus rule-based reinforcement learning agent.</center>

<video class="embed-responsive" width="640" height="480" controls>
    <source src="/assets/videos/projects/greedy_vs_rl.mov">
Your browser does not support the video tag.
</video>
<center>Greedy heuristic agent versus rule-based reinforcement learning agent.</center>
<br>

It can be seen from the videos that the greedy heuristic agent tends to have all the workers clustered together since the workers go to the nearest resource which tends to be the same for every unit. Oftentimes, the workers get stuck behind each other and are unable to collect resources. By adding the features described previously, the rule-based RL agent is able to avoid this unwanted behavior. The learned parameters promote the agent to make decisions that keep the workers spread out amongst all the resources.

While the rule-based RL agent is able to routinely defeat the greedy heuristic agent, it was only able to achieve top 40% on the leaderboard of the competition. By the end of the competition it was ranked around 50%. I think performance could further be improved by establishing rules for the cities as well as incorporating more obvious rules about not building cities too close to the end of the day cycle since that tends to kill both the worker and the city once night begins. Overall, I had fun with this project and hope to see a season 2 for this competition.
