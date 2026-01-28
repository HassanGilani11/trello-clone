"use client";

import { useState, useRef, useEffect } from "react";
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

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface AIChatPanelProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    boardContext: {
        boardName: string;
        columns: Array<{ title: string; id: string }>;
        tasks: Array<{ content: string; column_title: string; id: string }>;
    };
    onAction?: () => void;
}

export function AIChatPanel({ isOpen, onOpenChange, boardContext, onAction }: AIChatPanelProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage,
                    history: messages,
                    context: boardContext,
                }),
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            if (data.actionExecuted && onAction) {
                onAction();
            }

            setMessages(prev => [...prev, { role: "assistant", content: data.text }]);
        } catch (error) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "I'm sorry, I encountered an error. Please try again later."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="w-[400px] sm:w-[540px] p-0 flex flex-col glass border-l border-white/20 dark:border-gray-800/50">
                <SheetHeader className="p-6 border-b border-white/20 dark:border-gray-800/50 bg-white/50 dark:bg-black/20 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-blue-600/10 text-blue-600">
                            <Bot className="w-6 h-6" />
                        </div>
                        <div>
                            <SheetTitle className="text-xl font-bold flex items-center gap-2">
                                Antigravity
                                <Badge variant="secondary" className="bg-blue-600/10 text-blue-600 border-blue-600/20 text-[10px] px-1.5 py-0">PRO</Badge>
                            </SheetTitle>
                            <SheetDescription className="text-xs">
                                Your Agentic Project Intelligence Assistant
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <ScrollArea className="flex-1 p-6 h-[calc(100vh-200px)]">
                    <div className="space-y-6" ref={scrollRef}>
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="p-4 rounded-full bg-blue-600/5 mb-4 mb-4">
                                    <Sparkles className="w-8 h-8 text-blue-600 animate-pulse" />
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
                                            className="justify-start text-xs font-normal border-white/20 dark:border-gray-800 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm hover:bg-blue-600/5 hover:border-blue-600/20 transition-all"
                                            onClick={() => {
                                                setInput(suggestion);
                                            }}
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
                                    <div className={`p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 ${msg.role === "assistant" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-800"
                                        }`}>
                                        {msg.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                    </div>
                                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === "assistant"
                                        ? "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
                                        : "bg-blue-600 text-white"
                                        }`}>
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                                ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                                                ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                                                li: ({ children }) => <li className="mb-1">{children}</li>,
                                                strong: ({ children }) => <strong className="font-bold text-blue-600 dark:text-blue-400">{children}</strong>,
                                                code: ({ children }) => <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded font-mono text-xs">{children}</code>,
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex gap-3 max-w-[85%]">
                                    <div className="p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 bg-blue-600 text-white">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
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
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask Antigravity..."
                            className="bg-white/80 dark:bg-gray-900/80 border-white/20 dark:border-gray-800 backdrop-blur-sm"
                            disabled={isLoading}
                        />
                        <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="shrink-0 bg-blue-600 hover:bg-blue-700 transition-colors">
                            <Send className="w-4 h-4" />
                        </Button>
                    </form>
                    <p className="text-[10px] text-gray-400 mt-3 text-center">
                        Antigravity leverages Board Context to provide intelligent project insights.
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    );
}
