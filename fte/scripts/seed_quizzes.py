# Seed quizzes and answer keys into the database
# Run: python scripts/seed_quizzes.py

import asyncio, os, ssl, json
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / "phase1" / "backend" / ".env")
import asyncpg

QUIZZES = [
    {
        "id": "quiz-001",
        "chapter_id": "ch-001",
        "title": "Quiz 1 — Introduction to AI Agents",
        "questions": [
            {"id": "q1", "text": "What are the three core components of an AI agent?", "type": "mcq",
             "options": ["Perception, Reasoning, Action", "Input, Process, Output", "Model, Data, API", "Train, Test, Deploy"]},
            {"id": "q2", "text": "An AI agent runs in a loop until the goal is achieved.", "type": "truefalse",
             "options": ["True", "False"]},
            {"id": "q3", "text": "A Digital FTE works ___ hours per week.", "type": "fill", "options": None},
            {"id": "q4", "text": "What does LLM stand for?", "type": "mcq",
             "options": ["Large Language Model", "Logical Learning Machine", "Linear Logic Module", "Layered Language Mechanism"]},
            {"id": "q5", "text": "Agent Factory creates Custom Agents from specification documents.", "type": "truefalse",
             "options": ["True", "False"]},
        ],
        "answers": {"q1": "Perception, Reasoning, Action", "q2": "True", "q3": "168", "q4": "Large Language Model", "q5": "True"},
    },
    {
        "id": "quiz-002",
        "chapter_id": "ch-002",
        "title": "Quiz 2 — Claude Agent SDK Basics",
        "questions": [
            {"id": "q1", "text": "Which Python package is used to access Claude?", "type": "mcq",
             "options": ["anthropic", "openai", "langchain", "huggingface"]},
            {"id": "q2", "text": "What is the correct method to create a message with Claude SDK?", "type": "mcq",
             "options": ["client.messages.create()", "client.chat()", "client.run()", "client.generate()"]},
            {"id": "q3", "text": "The system prompt defines the agent's ___ and behavior.", "type": "fill", "options": None},
            {"id": "q4", "text": "Claude SDK requires an API key to function.", "type": "truefalse",
             "options": ["True", "False"]},
            {"id": "q5", "text": "Which role is used for user messages in Claude SDK?", "type": "mcq",
             "options": ["user", "human", "input", "prompt"]},
        ],
        "answers": {"q1": "anthropic", "q2": "client.messages.create()", "q3": "role", "q4": "True", "q5": "user"},
    },
    {
        "id": "quiz-003",
        "chapter_id": "ch-003",
        "title": "Quiz 3 — MCP Protocol",
        "questions": [
            {"id": "q1", "text": "What does MCP stand for?", "type": "mcq",
             "options": ["Model Context Protocol", "Multi-Cloud Platform", "Machine Communication Protocol", "Model Computation Pipeline"]},
            {"id": "q2", "text": "MCP allows AI models to connect to external tools and services.", "type": "truefalse",
             "options": ["True", "False"]},
            {"id": "q3", "text": "MCP servers expose capabilities called ___.", "type": "fill", "options": None},
            {"id": "q4", "text": "Which company developed MCP?", "type": "mcq",
             "options": ["Anthropic", "OpenAI", "Google", "Meta"]},
            {"id": "q5", "text": "MCP uses which protocol for communication?", "type": "mcq",
             "options": ["JSON-RPC", "REST", "GraphQL", "gRPC"]},
        ],
        "answers": {"q1": "Model Context Protocol", "q2": "True", "q3": "tools", "q4": "Anthropic", "q5": "JSON-RPC"},
    },
    {
        "id": "quiz-004",
        "chapter_id": "ch-005",
        "title": "Quiz 4 — Tool Use and Function Calling",
        "questions": [
            {"id": "q1", "text": "Function calling allows Claude to invoke external tools.", "type": "truefalse",
             "options": ["True", "False"]},
            {"id": "q2", "text": "Tool definitions are passed in which parameter of messages.create()?", "type": "mcq",
             "options": ["tools", "functions", "actions", "capabilities"]},
            {"id": "q3", "text": "What stop reason indicates Claude wants to use a tool?", "type": "mcq",
             "options": ["tool_use", "function_call", "action_required", "tool_needed"]},
            {"id": "q4", "text": "Tool results are sent back with role ___.", "type": "fill", "options": None},
            {"id": "q5", "text": "A tool schema must include name, description, and input_schema.", "type": "truefalse",
             "options": ["True", "False"]},
        ],
        "answers": {"q1": "True", "q2": "tools", "q3": "tool_use", "q4": "user", "q5": "True"},
    },
    {
        "id": "quiz-005",
        "chapter_id": "ch-006",
        "title": "Quiz 5 — Multi-Agent Patterns",
        "questions": [
            {"id": "q1", "text": "In multi-agent systems, the orchestrator agent coordinates other agents.", "type": "truefalse",
             "options": ["True", "False"]},
            {"id": "q2", "text": "What pattern uses a single agent to break tasks into subtasks?", "type": "mcq",
             "options": ["Orchestrator-Subagent", "Pipeline", "Broadcast", "Round-Robin"]},
            {"id": "q3", "text": "Agent ___ refers to passing control from one agent to another.", "type": "fill", "options": None},
            {"id": "q4", "text": "Which is NOT a valid multi-agent pattern?", "type": "mcq",
             "options": ["Singleton Lock", "Parallel Fan-out", "Sequential Pipeline", "Specialist Routing"]},
            {"id": "q5", "text": "Multi-agent systems can run subagents in parallel to save time.", "type": "truefalse",
             "options": ["True", "False"]},
        ],
        "answers": {"q1": "True", "q2": "Orchestrator-Subagent", "q3": "handoff", "q4": "Singleton Lock", "q5": "True"},
    },
]


async def seed():
    dsn = os.environ.get("DATABASE_URL", "").replace("postgresql+asyncpg://", "postgresql://")
    ssl_ctx = ssl.create_default_context()
    conn = await asyncpg.connect(dsn=dsn, ssl=ssl_ctx)
    print("Connected to database.")

    for q in QUIZZES:
        questions_no_answers = [
            {k: v for k, v in question.items() if k != "answer"}
            for question in q["questions"]
        ]
        await conn.execute(
            """
            INSERT INTO quizzes (id, chapter_id, title, questions)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (id) DO UPDATE SET
                title = EXCLUDED.title,
                questions = EXCLUDED.questions
            """,
            q["id"], q["chapter_id"], q["title"], json.dumps(questions_no_answers),
        )
        await conn.execute(
            """
            INSERT INTO quiz_answer_keys (quiz_id, answers)
            VALUES ($1, $2)
            ON CONFLICT (quiz_id) DO UPDATE SET answers = EXCLUDED.answers
            """,
            q["id"], json.dumps(q["answers"]),
        )
        print(f"  OK  {q['id']} — {q['title']}")

    await conn.close()
    print("\nDone! All quizzes seeded.")


if __name__ == "__main__":
    asyncio.run(seed())
