---
layout: blogpost
thumb: /assets/images/thumbs/astar_thumb.png
title: "Implementing the A* Pathfinding Algorithm with ChatGPT"
date: 2023-04-03
tags: programming deep-learning
intro: "Using ChatGPT to implement the A* pathfinding algorithm in Python."
---

<div align="center">
<figure>
<img src="/assets/images/blogs/astar_gpt.png" alt="A* AI Art" style="width:50%">
<figcaption>AI generated image of "robot in a maze, searching for a path, confused, scared".</figcaption>
</figure>
</div>

## Introduction

In the world of artificial intelligence, one of the most fascinating and useful applications is pathfinding. Whether you're building a game, a navigation system, or a robotics project, finding the shortest path from point A to point B is a fundamental problem. The A* algorithm is a popular choice for solving this problem. In this blog post, we will explore how to implement the A* pathfinding algorithm in Python with the assistance of AI.

## Understanding the A* Algorithm

Before we dive into the implementation, let's briefly explain how the A* algorithm works. A* combines two key elements: cost-so-far and estimated total cost. It explores the nodes in a graph, choosing the one with the lowest total cost, which is the sum of the cost-so-far and an estimated cost-to-go (heuristic). The heuristic guides the search towards the goal efficiently.

## My Specific Use Case

I am working on the LuxAI Season 2 competition and the one thing that I did not get implemented in Season 1 that I really wanted was pathfinding. In Season 1, I used a simple heuristic to determine which direction to move in. This worked well enough for the first few turns but as the game progressed, the heuristic became less and less effective. So for Season 2, I wanted to implement a more robust pathfinding algorithm. I decided to use the A* algorithm because it is a well-known and well-documented algorithm that is relatively easy to implement. I also wanted to use AI to help me implement the algorithm because I thought it would be a fun challenge.

In the competition there is a cost to moving units across the map based on the amount of rubble in a cell. This is meant to simulate terrain. This cost drains power from the unit and if you are not efficient with your movement, you are less likely to win the game against strong competition. So the goal of the pathfinding algorithm is to find the shortest path from the unit's current position to the destination position while minimizing the cost of moving across the map.

## Using ChatGPT

I decided to use ChatGPT to help me implement the A* algorithm. The history of my chat is shown below:

> User:

> Can you write a Python function that implements the A* path finding algorithm that takes as input the starting location an target location on a 2D grip map

> AI:

> Sure! Here's an example Python function that implements the A* pathfinding algorithm:

```python
import heapq

# Define a class to represent a node in the grid
class Node:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.g = 0
        self.h = 0
        self.f = 0
        self.parent = None
        
    def __lt__(self, other):
        return self.f < other.f
    
    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

# Define a function to calculate the heuristic distance between two points
def heuristic(start, end):
    return abs(start.x - end.x) + abs(start.y - end.y)

# Define the A* pathfinding function
def astar(start, end, grid):
    # Create open and closed sets
    open_set = []
    closed_set = []
    
    # Add start node to the open set
    heapq.heappush(open_set, start)
    
    # Loop until open set is empty
    while len(open_set) > 0:
        # Get the node with the lowest f value
        current_node = heapq.heappop(open_set)
        
        # Check if we have reached the end node
        if current_node == end:
            path = []
            while current_node is not None:
                path.append((current_node.x, current_node.y))
                current_node = current_node.parent
            return path[::-1]
        
        # Add the current node to the closed set
        closed_set.append(current_node)
        
        # Check the neighbors of the current node
        for x_offset, y_offset in [(0, -1), (0, 1), (-1, 0), (1, 0)]:
            # Calculate the coordinates of the neighbor node
            neighbor_x = current_node.x + x_offset
            neighbor_y = current_node.y + y_offset
            
            # Check if the neighbor node is in bounds
            if neighbor_x < 0 or neighbor_x >= len(grid) or neighbor_y < 0 or neighbor_y >= len(grid[0]):
                continue
                
            # Check if the neighbor node is an obstacle
            if grid[neighbor_x][neighbor_y] == 1:
                continue
                
            # Create the neighbor node object
            neighbor_node = Node(neighbor_x, neighbor_y)
            
            # Check if the neighbor node is in the closed set
            if neighbor_node in closed_set:
                continue
                
            # Calculate the tentative g value for the neighbor node
            tentative_g = current_node.g + 1
            
            # Check if the neighbor node is already in the open set
            if neighbor_node not in open_set:
                # Add the neighbor node to the open set
                heapq.heappush(open_set, neighbor_node)
            elif tentative_g >= neighbor_node.g:
                continue
                
            # Update the neighbor node's parent and g value
            neighbor_node.parent = current_node
            neighbor_node.g = tentative_g
            neighbor_node.h = heuristic(neighbor_node, end)
            neighbor_node.f = neighbor_node.g + neighbor_node.h
            
    # If the open set is empty and we haven't found the end node, no path exists
    return None
```

This original implementation not only has a bug but it also does not incorporate the fact that there should be a cost associated with moving to each cell in the map. I then prompted ChatGPT to help incorporate the cost into the algorithm. The history of my chat is shown below:

> User:

> Can you modify the function to accept inputs of not just obstacles but a cost of moving to each point on the 2D grid?

> AI:

> Sure, here's a modified version of the function that accepts a 2D grid of costs as input:

```python
import heapq

# Define a class to represent a node in the grid
class Node:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.g = 0
        self.h = 0
        self.f = 0
        self.parent = None
        
    def __lt__(self, other):
        return self.f < other.f
    
    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

# Define a function to calculate the heuristic distance between two points
def heuristic(start, end):
    return abs(start.x - end.x) + abs(start.y - end.y)

# Define the A* pathfinding function
def astar(start, end, grid):
    # Create open and closed sets
    open_set = []
    closed_set = []
    
    # Add start node to the open set
    heapq.heappush(open_set, start)
    
    # Loop until open set is empty
    while len(open_set) > 0:
        # Get the node with the lowest f value
        current_node = heapq.heappop(open_set)
        
        # Check if we have reached the end node
        if current_node == end:
            path = []
            while current_node is not None:
                path.append((current_node.x, current_node.y))
                current_node = current_node.parent
            return path[::-1]
        
        # Add the current node to the closed set
        closed_set.append(current_node)
        
        # Check the neighbors of the current node
        for x_offset, y_offset in [(0, -1), (0, 1), (-1, 0), (1, 0)]:
            # Calculate the coordinates of the neighbor node
            neighbor_x = current_node.x + x_offset
            neighbor_y = current_node.y + y_offset
            
            # Check if the neighbor node is in bounds
            if neighbor_x < 0 or neighbor_x >= len(grid) or neighbor_y < 0 or neighbor_y >= len(grid[0]):
                continue
                
            # Check if the neighbor node is an obstacle
            if grid[neighbor_x][neighbor_y] == -1:
                continue
                
            # Create the neighbor node object
            neighbor_node = Node(neighbor_x, neighbor_y)
            
            # Check if the neighbor node is in the closed set
            if neighbor_node in closed_set:
                continue
                
            # Calculate the tentative g value for the neighbor node
            tentative_g = current_node.g + grid[neighbor_x][neighbor_y]
            
            # Check if the neighbor node is already in the open set
            if neighbor_node not in open_set:
                # Add the neighbor node to the open set
                heapq.heappush(open_set, neighbor_node)
            elif tentative_g >= neighbor_node.g:
                continue
                
            # Update the neighbor node's parent and g value
            neighbor_node.parent = current_node
            neighbor_node.g = tentative_g
            neighbor_node.h = heuristic(neighbor_node, end)
            neighbor_node.f = neighbor_node.g + neighbor_node.h
            
    # If the open set is empty and we haven't found the end node, no path exists
    return None
```

This modified version of the function is much better but it still has a bug. I then prompted ChatGPT to help me fix the bug. ChatGPT was unable to fix the issue; but after looking at the code for a while, I was able to fix it myself. The final implementation of the A* algorithm is shown below:

```python
import heapq
import numpy as np


# Define a class to represent a node in the grid
class Node:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.g = 0
        self.h = 0
        self.f = 0
        self.parent = None
        
    def __lt__(self, other):
        return self.f < other.f
    
    def __eq__(self, other):
        return self.x == other.x and self.y == other.y


# Define a function to calculate the heuristic distance between two points
def heuristic(start, end):
    return np.sqrt((start.x - end.x)**2 + (start.y - end.y)**2)


# Define the A* pathfinding function
def astar(start, end, grid):
    # Convert the start and end
    start = Node(start[0], start[1])
    end = Node(end[0], end[1])
    
    # Create open and closed sets
    open_set = []
    closed_set = []
    
    # Add start node to the open set
    heapq.heappush(open_set, start)
    
    # Loop until open set is empty
    while len(open_set) > 0:
        # Get the node with the lowest f value
        current_node = heapq.heappop(open_set)
        
        # Check if we have reached the end node
        if current_node == end:
            path = []
            while current_node is not None:
                path.append((current_node.x, current_node.y))
                current_node = current_node.parent
            return path[::-1]
        
        # Add the current node to the closed set
        closed_set.append(current_node)
        
        # Check the neighbors of the current node
        for x_offset, y_offset in [(0, -1), (0, 1), (-1, 0), (1, 0)]:
            # Calculate the coordinates of the neighbor node
            neighbor_x = current_node.x + x_offset
            neighbor_y = current_node.y + y_offset
            
            # Check if the neighbor node is in bounds
            if neighbor_x < 0 or neighbor_x >= len(grid) or neighbor_y < 0 or neighbor_y >= len(grid[0]):
                continue
                
            # Check if the neighbor node is an obstacle
            if grid[neighbor_x][neighbor_y] == -1:
                continue
                
            # Create the neighbor node object
            neighbor_node = Node(neighbor_x, neighbor_y)
            
            # Check if the neighbor node is in the closed set
            if neighbor_node in closed_set:
                continue
                
            # Calculate the tentative g value for the neighbor node
            tentative_g = current_node.g + grid[neighbor_x][neighbor_y]

            # Update the neighbor node's parent and g value
            neighbor_node.parent = current_node
            neighbor_node.g = tentative_g
            neighbor_node.h = heuristic(neighbor_node, end)
            neighbor_node.f = neighbor_node.g + neighbor_node.h
            
            # Check if the neighbor node is already in the open set
            if neighbor_node not in open_set:
                # Add the neighbor node to the open set
                heapq.heappush(open_set, neighbor_node)
                
            
            
    # If the open set is empty and we haven't found the end node, no path exists
    return None
```

## Conclusion

It was interesting working with ChatGPT to get a working version of the A* algorithm. I think it is a great tool for brainstorming and getting ideas. I also think it is a great tool for getting unstuck when you are stuck on a problem. I am excited to see what other applications I can find for ChatGPT.

If you want to try a demo in a Jupyter Notebook then check out the one I shared on <a href="https://www.kaggle.com/michaelriedl/a-pathfinding" target="_blank">Kaggle</a>.