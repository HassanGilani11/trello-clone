"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface CommentInputProps {
    onAddComment: (content: string) => void;
    isLoading?: boolean;
}

export function CommentInput({ onAddComment, isLoading }: CommentInputProps) {
    const [content, setContent] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || isLoading) return;
        onAddComment(content);
        setContent("");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <div className="relative">
                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Add a comment..."
                    className="min-h-[80px] pr-10 resize-none focus-visible:ring-1 focus-visible:ring-blue-500"
                    disabled={isLoading}
                />
                <Button
                    type="submit"
                    size="icon"
                    variant="ghost"
                    className="absolute bottom-2 right-2 h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/50"
                    disabled={!content.trim() || isLoading}
                >
                    <Send className="w-4 h-4" />
                </Button>
            </div>
            <p className="text-[10px] text-gray-400 italic">
                Tip: Press Enter to send (Shift + Enter for new line - future enhancement)
            </p>
        </form>
    );
}
