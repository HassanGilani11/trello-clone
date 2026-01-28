"use client";

import { Comment } from "@/lib/supabase/models";
import { formatDistanceToNow } from "date-fns";
import { User, MessageSquare, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CommentListProps {
    comments: Comment[];
    onEdit: (commentId: string, content: string) => Promise<void>;
    onDelete: (commentId: string) => Promise<void>;
}

export function CommentList({ comments, onEdit, onDelete }: CommentListProps) {
    const { user } = useUser();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleStartEdit = (comment: Comment) => {
        setEditingId(comment.id);
        setEditContent(comment.content);
    };

    const handleSaveEdit = async () => {
        if (!editingId || !editContent.trim()) return;
        setIsSubmitting(true);
        try {
            await onEdit(editingId, editContent);
            setEditingId(null);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (comments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <MessageSquare className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-sm">No comments yet. Be the first to share your thoughts!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
            {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 group">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                                    {comment.user_email || "Anonymous User"}
                                </span>
                                <span className="text-[10px] text-gray-500">
                                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                </span>
                            </div>

                            {user?.id === comment.user_id && !editingId && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreVertical className="h-3 w-3" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="text-xs">
                                        <DropdownMenuItem onClick={() => handleStartEdit(comment)} className="cursor-pointer">
                                            <Edit2 className="h-3 w-3 mr-2" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onDelete(comment.id)} className="cursor-pointer text-red-600 focus:text-red-600">
                                            <Trash2 className="h-3 w-3 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>

                        {editingId === comment.id ? (
                            <div className="space-y-2">
                                <Textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="min-h-[60px] text-sm resize-none"
                                    autoFocus
                                />
                                <div className="flex justify-end gap-2">
                                    <Button size="sm" variant="outline" onClick={() => setEditingId(null)} disabled={isSubmitting}>
                                        Cancel
                                    </Button>
                                    <Button size="sm" onClick={handleSaveEdit} disabled={isSubmitting || !editContent.trim()}>
                                        {isSubmitting ? "Saving..." : "Save"}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-3 bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 shadow-sm leading-relaxed whitespace-pre-wrap">
                                {comment.content}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
