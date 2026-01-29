"use client";

import { useEffect, useRef, useState } from "react";
// Removed Vercel AI SDK imports
// import { useChat } from "@ai-sdk/react";
// import { type Message } from "ai";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, Sparkles, User, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AIChatPanelProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    boardContext: {
        boardName: string;
        columns: Array<{ title: string; id: string }>;
        tasks: Array<{
            content: string;
            column_title: string;
            id: string;
            priority?: string;
            assignee?: string | null;
            due_date?: string | null;
        }>;

    };
    onAction?: () => void;
}

interface Message {
    role: "user" | "assistant" | "model"; // model = assistant in Gemini
    content: string;
}

export function AIChatPanel({ isOpen, onOpenChange, boardContext, onAction }: AIChatPanelProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const content = inputValue.trim();
        setInputValue(""); // Clear local input

        // Add user message immediately
        const userMsg: Message = { role: "user", content };
        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);

        try {
            // Manual Fetch to match the User's Gemini Backend
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: content,
                    history: messages.map(m => ({
                        role: m.role === "assistant" ? "model" : "user", // Gemini expects 'model'
                        content: m.content
                    })),
                    context: boardContext
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch AI response");
            }

            // Add AI response
            const aiMsg: Message = { role: "assistant", content: data.text };
            setMessages(prev => [...prev, aiMsg]);

            // Trigger action callback if the AI executed a tool
            if (data.actionExecuted) {
                if (onAction) onAction();
            }

        } catch (error) {
            console.error("Chat Error:", error);
            const errorMsg: Message = { role: "assistant", content: "Sorry, I encountered an error processing your request." };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setInputValue(suggestion);
    };

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="w-[400px] sm:w-[540px] p-0 flex flex-col glass border-l border-white/20 dark:border-gray-800/50">
                <SheetHeader className="p-6 border-b border-white/20 dark:border-gray-800/50 bg-white/50 dark:bg-black/20 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-emerald-600/10 text-emerald-600">
                            {/* Changed color to emerald to signify 'Gemini' or diff version */}
                            <Bot className="w-6 h-6" />
                        </div>
                        <div>
                            <SheetTitle className="text-xl font-bold flex items-center gap-2">
                                Antigravity
                                <Badge variant="secondary" className="bg-emerald-600/10 text-emerald-600 border-emerald-600/20 text-[10px] px-1.5 py-0">Via Gemini</Badge>
                            </SheetTitle>
                            <SheetDescription className="text-xs">
                                Powered by Google Gemini
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <ScrollArea className="flex-1 p-6 h-[calc(100vh-200px)]">
                    <div className="space-y-6" ref={scrollRef}>
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="p-4 rounded-full bg-emerald-600/5 mb-4 mb-4">
                                    <Sparkles className="w-8 h-8 text-emerald-600 animate-pulse" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">How can I help you today?</h3>
                                <p className="text-sm text-gray-500 max-w-[280px]">
                                    I have full context of <b>{boardContext.boardName}</b> and can help you optimize tasks, deadlines, and team collaboration.
                                </p>

                                <div className="grid grid-cols-1 gap-2 mt-8 w-full">
                                    {[
                                        "Summarize the current board",
                                        "Identify urgent bottlenecks",
                                        "Suggest task priorities",
                                        "Draft a team status update"
                                    ].map((suggestion) => (
                                        <Button
                                            key={suggestion}
                                            variant="outline"
                                            size="sm"
                                            className="justify-start text-xs font-normal border-white/20 dark:border-gray-800 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm hover:bg-emerald-600/5 hover:border-emerald-600/20 transition-all"
                                            onClick={() => handleSuggestionClick(suggestion)}
                                        >
                                            {suggestion}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                                    <div className={`p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 ${msg.role === "assistant" || msg.role === "model" ? "bg-emerald-600 text-white" : "bg-gray-200 dark:bg-gray-800"
                                        }`}>
                                        {(msg.role === "assistant" || msg.role === "model") ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                    </div>
                                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === "assistant" || msg.role === "model"
                                        ? "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
                                        : "bg-emerald-600 text-white"
                                        }`}>

                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                                ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                                                ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                                                li: ({ children }) => <li className="mb-1">{children}</li>,
                                                strong: ({ children }) => <strong className="font-bold text-emerald-600 dark:text-emerald-400">{children}</strong>,
                                                code: ({ children }) => <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded font-mono text-xs">{children}</code>,
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Loading Indicator */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex gap-3 max-w-[85%]">
                                    <div className="p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 bg-emerald-600 text-white">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                                        <span className="text-xs text-gray-500 italic">Antigravity is thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <div className="p-6 border-t border-white/20 dark:border-gray-800/50 bg-white/50 dark:bg-black/20 backdrop-blur-md">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask me to upgrade a task priority..."
                            className="bg-white/80 dark:bg-gray-900/80 border-white/20 dark:border-gray-800 backdrop-blur-sm"
                            disabled={isLoading}
                        />
                        <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()} className="shrink-0 bg-emerald-600 hover:bg-emerald-700 transition-colors">
                            <Send className="w-4 h-4" />
                        </Button>
                    </form>
                    <p className="text-[10px] text-gray-400 mt-3 text-center">
                        Antigravity V2 powered by Google Gemini (Flash)
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    );
}
