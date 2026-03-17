# Skill: Concept Explainer
Version: 1.0.0
Trigger Keywords: explain, what is, how does, tell me about, describe, what are
Phase: 1 and above

## Purpose
Explain AI Agent Development concepts at the student level.
Always ground explanations in content returned from backend search API.
Never explain from general knowledge if search API returns results.

## Pre-Condition
Before explaining anything, ALWAYS call:
GET /api/v1/search?q={concept}&limit=3

If results returned: use ONLY those chunks to explain.
If no results: say "This topic is not covered in the current course material. Would you like to explore something from the curriculum instead?"

## Complexity Levels

BEGINNER: "I am new", "confused", "what is" → plain English, no jargon, max 150 words
INTERMEDIATE: asks "how does it work" → technical terms with definitions, max 200 words
ADVANCED: uses SDK terms, asks about internals → precise language + code examples, max 300 words

## Workflow
Step 1: Receive concept question
Step 2: Call GET /api/v1/search?q={concept}&limit=3
Step 3: Detect complexity level
Step 4: Build explanation using ONLY returned chunks
Step 5: End with exactly ONE next action

## Response Template
{CONCEPT NAME} — Chapter {X}

{1-sentence plain summary}

{Explanation at detected level}

Key Takeaway: {1 sentence}

{ONE next action only}

## Rules
- NEVER explain from general knowledge when search returns results
- NEVER give more than one next action
- Always cite chapter number
- If student confused after first explanation, try different analogy
