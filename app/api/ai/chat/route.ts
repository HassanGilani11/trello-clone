import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { taskService } from "@/lib/services";

export async function POST(req: NextRequest) {
    try {
        const { message, history, context } = await req.json();
        const apiKey = process.env.GOOGLE_AI_API_KEY;

        if (!apiKey) {
            console.error("AI API Key is missing in environment variables");
            return NextResponse.json({ error: "AI API Key not configured" }, { status: 500 });
        }

        const supabase = await createClient();
        const genAI = new GoogleGenerativeAI(apiKey);

        // Define Tools for Gemini
        const tools = [
            {
                functionDeclarations: [
                    {
                        name: "update_task",
                        description: "Update task properties like priority, assignee, or due date.",
                        parameters: {
                            type: "OBJECT",
                            properties: {
                                taskId: { type: "STRING", description: "The UUID of the task to update." },
                                priority: { type: "STRING", enum: ["low", "medium", "high"], description: "The new priority level." },
                                assignee: { type: "STRING", description: "The email of the assignee." },
                                dueDate: { type: "STRING", description: "The due date in ISO format (YYYY-MM-DD)." },
                            },
                            required: ["taskId"],
                        },
                    },
                    {
                        name: "move_task",
                        description: "Move a task to a different column.",
                        parameters: {
                            type: "OBJECT",
                            properties: {
                                taskId: { type: "STRING", description: "The UUID of the task to move." },
                                columnId: { type: "STRING", description: "The UUID of the target column." },
                            },
                            required: ["taskId", "columnId"],
                        },
                    },
                ],
            },
        ];

        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview",
            tools: tools as any
        });

        const systemPrompt = `
      You are "Antigravity", a premium, powerful agentic AI project management assistant.
      Your goal is to help users manage their Trello-style boards, optimize their workflows, and provide intelligent insights.

      BOARD CONTEXT:
      - Board: ${context.boardName}
      - Columns: ${context.columns.map((c: any) => `${c.title} (ID: ${c.id})`).join(", ")}
      - Tasks: ${context.tasks.map((t: any) => `${t.content} (ID: ${t.id}, Status: ${t.column_title})`).join("; ")}

      --- 

      1. USER QUERY INTERPRETATION PROMPT
      Classify the user's request into ONE of the following intents:
      - READ_ONLY_INSIGHT
      - ACTION_REQUEST
      - SUMMARY
      - ANALYSIS
      - CLARIFICATION_REQUIRED

      Return the intent and a short explanation in your internal reasoning, then provide the response based on the blueprint below.

      2. READ-ONLY INSIGHT PROMPTS
      Answer the user's question using only task data.
      Include: Task title, Status, Assignee, Due date. Sort by urgency.

      3. BOARD SUMMARY PROMPT
      Concise bullet points: Overall progress, Completed vs pending, Overdue tasks, High-priority items, Team workload.

      4. WORKLOAD & RISK ANALYSIS PROMPT
      Identify: Risks, Bottlenecks, and Suggested corrective actions.

      5. AI ACTION DETECTION & EXECUTION (CRITICAL)
      When a user requests an action (ACTION_REQUEST):
      - FIRST: If they haven't confirmed, use the "Action Detected" format below.
      - SECOND: If they have confirmed (e.g., "Yes", "Go ahead"), use the provided tools (update_task, move_task) to persist changes.
      - DO NOT just pretend to execute. Use the tool.

      Action Detected Format (Pre-Confirmation):
      Action Detected:
      - Action: [The specific action]
      - Target: [The specific task or column]
      - Confirmation Question: [The question asking user to confirm]

      ---

      GENERAL RULES:
      1. Use **bolding** for task names, status, and critical terms.
      2. Professional, proactive executive tone.
      3. Avoid fluff or generic AI introductions.
    `;

        const chatHistory = [
            { role: "user", parts: [{ text: systemPrompt }] },
            { role: "model", parts: [{ text: "I am Antigravity. I have analyzed your board context and am ready to assist with management and execution. How can I help you today?" }] },
            ...(history || []).map((msg: any) => ({
                role: msg.role === "user" ? "user" : "model",
                parts: [{ text: msg.content }],
            })),
        ];

        const chat = model.startChat({
            history: chatHistory,
        });

        const result = await chat.sendMessage(message);
        let response = result.response;
        let iterations = 0;
        let actionExecuted = false;

        // Handle Tool Calls
        while (response.candidates?.[0]?.content?.parts?.some((p: any) => p.functionCall) && iterations < 5) {
            const toolCalls = response.candidates[0].content.parts.filter((p: any) => p.functionCall);
            const toolResponses = [];

            for (const call of toolCalls) {
                const functionCall = (call as any).functionCall;
                const { name, args } = functionCall;
                console.log(`AI Tool Call: ${name}`, args);

                let output;
                try {
                    if (name === "update_task") {
                        const updateArgs = args as any;
                        output = await taskService.updateTask(supabase, updateArgs.taskId, {
                            priority: updateArgs.priority as any,
                            assignee: updateArgs.assignee,
                            due_date: updateArgs.dueDate
                        });
                        actionExecuted = true;
                    } else if (name === "move_task") {
                        const moveArgs = args as any;
                        output = await taskService.moveTask(supabase, moveArgs.taskId, moveArgs.columnId, 0);
                        actionExecuted = true;
                    }
                    toolResponses.push({
                        functionResponse: {
                            name,
                            response: { content: output, status: "success" }
                        }
                    });
                } catch (e: any) {
                    console.error(`Tool Execution Error (${name}):`, e);
                    toolResponses.push({
                        functionResponse: {
                            name,
                            response: { error: e.message, status: "error" }
                        }
                    });
                }
            }

            const nextResult = await chat.sendMessage(toolResponses);
            response = nextResult.response;
            iterations++;
        }

        const responseText = response.text();
        return NextResponse.json({ text: responseText, actionExecuted });

    } catch (error: any) {
        console.error("AI Chat Error Details:", error);
        const status = error.status || 500;
        const message = error.message || "Failed to generate AI response";
        return NextResponse.json({ error: message }, { status });
    }
}
