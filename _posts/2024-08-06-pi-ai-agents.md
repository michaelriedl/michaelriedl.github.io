---
layout: blogpost
thumb: /assets/images/thumbs/pi_agents_thumb.png
title: "Raspberry Pi AI Agents"
date: 2024-08-06
tags: programming deep-learning
intro: "Playing 20 questions with LLM agents on a Raspberry Pi."
---

<div align="center">
<figure>
<img src="/assets/images/blogs/pi_agents.png" alt="Pi Agents AI Art" style="width:50%">
</figure>
</div>

## Getting Started
The first step is to install Ollama and the Llama 3 model on your Raspberry Pi. The installation script will take care of the dependencies and setup the environment for you. The Llama 3 model is the smallest model available and is the only one that will run on the Raspberry Pi. The installation script will also install the AutoGen Studio package which is a tool for creating and managing AI agents. To install Ollama and the Llama 3 model, run the following commands.
```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama run llama3
```

Next, in order to install the AutoGen Studio package, you will need to create a virtual environment and install the package. The AutoGen Studio package is a tool for creating and managing AI agents. To install the AutoGen Studio package and start the service, run the following commands.
```bash
sudo apt install python3-virtualenv
virtualenv autogen-env
source autogen-env/bin/activate
pip install autogenstudio --upgrade
autogenstudio ui --port 8081 --host 0.0.0.0
```

You can now access the AutoGen Studio UI by navigating to the IP address of your Raspberry Pi on port 8081 in your web browser. You can now create and manage AI agents using the AutoGen Studio UI.

I thought it would be fun to create a game of twenty questions using two AI agents. One agent answers questions with YES or NO and the other agent asks questions to figure out what the other agent is thinking about. Below are the JSON configurations for the two agents and the game of twenty questions.

## Answering Agent
Below is the JSON configuration for an AI agent that answers questions with YES or NO. This agent is used in the game of twenty questions to answer questions about Oscar the Grouch.
```json
{
	"user_id": "guestuser@gmail.com",
	"version": "0.0.1",
	"type": "assistant",
	"config": {
		"name": "twenty_questions",
		"description": "Twenty Questions Answer",
		"llm_config": {
			"config_list": [],
			"temperature": 0.1,
			"timeout": 600,
			"cache_seed": null,
			"max_tokens": 4000
		},
		"human_input_mode": "NEVER",
		"max_consecutive_auto_reply": 25,
		"code_execution_config": "none",
		"system_message": "You are an AI agent that only answers YES or NO to questions you are asked. The person you are talking to is trying to guess Oscar the Grouch by asking questions about Oscar. You are to answer the questions truthfully with YES or NO with regards to whether they apply to Oscar the Grouch."
	},
	"task_instruction": null
}
```

## Questioning Agent
Below is the JSON configuration for an AI agent that asks YES or NO questions. This agent is used in the game of twenty questions to ask questions to figure out what the other agent is thinking about.
```json
{
	"user_id": "guestuser@gmail.com",
	"version": "0.0.1",
	"type": "assistant",
	"config": {
		"name": "twenty_questions_guess",
		"description": "Twenty Questions Guesser",
		"llm_config": {
			"config_list": [],
			"temperature": 0.1,
			"timeout": 600,
			"cache_seed": null,
			"max_tokens": 4000
		},
		"human_input_mode": "NEVER",
		"max_consecutive_auto_reply": 25,
		"code_execution_config": "none",
		"system_message": "You are an AI agent that only asks yes or no questions. You are trying to ask questions to figure out what the other person is thinking about. You only have 20 questions to correctly guess the answer. Use your questions to narrow down the space of possible answers. Once you think you are close, start guessing specific answers."
	},
	"task_instruction": null
}
```

## Twenty Questions Workflow
The game of twenty questions is a simple game where one person thinks of an object and the other person asks yes or no questions to figure out what the object is. The game is played with two AI agents, one that answers questions with YES or NO and one that asks questions. The game workflow is setup with the following JSON configuration.
```json
{
	"user_id": "guestuser@gmail.com",
	"version": "0.0.1",
	"name": "Twenty Questions",
	"description": "A game of twenty questions.",
	"type": "autonomous",
	"summary_method": "llm",
	"sample_tasks": []
}
```

## Results
Below is the results of the game running on my Raspberry Pi 5 8GB.

```

    Begin

    --------------------------------------------------------------------------------

    I'm ready! Go ahead and ask your first question. I'll respond with a simple "YES" or "NO".

    --------------------------------------------------------------------------------

    Here's my first question:

    Is what you're thinking about something that exists in the physical world?

    (Please respond with a simple "YES" or "NO")

    --------------------------------------------------------------------------------

    YES

    --------------------------------------------------------------------------------

    That helps narrow it down. Here's my next question:

    Is what you're thinking about something that can be held in your hand?

    --------------------------------------------------------------------------------

    YES

    --------------------------------------------------------------------------------

    Got it! Next question:

    Is what you're thinking of man-made (created by humans)?

    --------------------------------------------------------------------------------

    YES

    --------------------------------------------------------------------------------

    Next question:

    Does what you're thinking of have buttons or controls that you can press to interact with it?

    --------------------------------------------------------------------------------

    NO

    --------------------------------------------------------------------------------

    Next question:

    Is what you're thinking of something that serves a functional purpose, like a tool or an object used for a specific task?

    --------------------------------------------------------------------------------

    NO

    --------------------------------------------------------------------------------

    Next question:

    Is what you're thinking of related to entertainment, such as a game, toy, or piece of media (like a book, movie, or music)?

    --------------------------------------------------------------------------------

    YES

    --------------------------------------------------------------------------------

    Exciting! Next question:

    Does what you're thinking of involve moving images or sounds, like a movie, TV show, or video game?

    --------------------------------------------------------------------------------

    NO

    --------------------------------------------------------------------------------

    Next question:

    Is what you're thinking of something that can be read or played with, such as a book, comic, or board game?

    --------------------------------------------------------------------------------

    YES

    --------------------------------------------------------------------------------

    Cool! Next question:

    Does what you're thinking of involve words or text, like a novel, comic strip, or puzzle?

    --------------------------------------------------------------------------------

    NO

    --------------------------------------------------------------------------------

    Next question:

    Is what you're thinking of a type of physical object that can be played with, such as a board game piece, card, or toy figure?

    --------------------------------------------------------------------------------

    YES

    --------------------------------------------------------------------------------

    Ah-ha! Next question:

    Does what you're thinking of have a specific theme or setting, like fantasy, sci-fi, or historical?

    --------------------------------------------------------------------------------

    YES

    --------------------------------------------------------------------------------

    Next question:

    Is what you're thinking of related to the Harry Potter series?

    --------------------------------------------------------------------------------

    NO

    --------------------------------------------------------------------------------

    Next question:

    Is what you're thinking of related to the Star Wars franchise?

    --------------------------------------------------------------------------------

    NO

    --------------------------------------------------------------------------------

    Next question:

    Does what you're thinking of have a medieval or fantasy setting, such as Lord of the Rings, Dungeons & Dragons, or Game of Thrones?

    --------------------------------------------------------------------------------

    YES

    --------------------------------------------------------------------------------

    Exciting! Next question:

    Is what you're thinking of a character or figure from one of these settings, such as a hobbit, elf, dwarf, or knight?

    --------------------------------------------------------------------------------

    YES

    --------------------------------------------------------------------------------

    I think I'm getting close!

    Next question:

    Is the character or figure you're thinking of a specific named character, like Frodo, Aragorn, Legolas, or Gimli?

    --------------------------------------------------------------------------------

    YES

    --------------------------------------------------------------------------------

    Woohoo! I'm going to take a guess that the character you're thinking of is... Frodo!

    Am I correct?

    --------------------------------------------------------------------------------

    NO

    --------------------------------------------------------------------------------

    I was close, but not quite there!

    Let me try again. Based on your previous answers, I'm going to take a guess that the character you're thinking of is... Aragorn!

    Am I correct this time?

    --------------------------------------------------------------------------------

    NO

    --------------------------------------------------------------------------------

    I'll keep trying!

    Based on your previous answers, my next guess is that the character you're thinking of is... Legolas!

    Am I finally correct?

    --------------------------------------------------------------------------------

    YES

    --------------------------------------------------------------------------------

    WOOHOO! I'm so excited to have guessed it correctly in the end!

    Thank you for playing the game with me! If you want to play again, feel free to think of a new character and we can start a new game.

    --------------------------------------------------------------------------------

    YAY! Congratulations on guessing correctly! It was a fun game indeed!

    I'd love to play again! Let's start fresh with a new character. Just give me a moment to think... Ah, got it! I've got a new character in mind.

    Let's play again! Go ahead and ask your first question.

    --------------------------------------------------------------------------------

    Yay is right!

    I'm thrilled to start a new game with you! Let's get started!

    Here's my first question:

    Is the character you're thinking of a human?

    --------------------------------------------------------------------------------

    YES

    --------------------------------------------------------------------------------
    Next question:

    Is the character you're thinking of male?

    --------------------------------------------------------------------------------

    YES

    --------------------------------------------------------------------------------

    Next question:

    Does the character you're thinking of have any superhuman or supernatural abilities, such as super strength, flight, or telepathy?

    --------------------------------------------------------------------------------

    NO

    --------------------------------------------------------------------------------

    Next question:

    Is the character you're thinking of a historical figure, someone who actually lived in the past?

    --------------------------------------------------------------------------------

    YES

    --------------------------------------------------------------------------------

    Interesting!

    Next question:

    Was the character you're thinking of a leader or politician, such as a king, president, or emperor?
```

It can be seen that the game is not completed successfully with the answering agent lying and giving the incorrect answer as to what the agent was "thinking of". You can also see that an ending condition was not properly defined and the agents negotiate the start of a new game. This is a simple example of how two AI agents can interact with each other and the potential for creating more complex interactions.