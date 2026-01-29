"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { BaseDialog } from "@/components/common/BaseDialog";
import { AssigneeSelect } from "./AssigneeSelect";
import { BoardMember, Task, ActivityLog, Comment } from "@/lib/supabase/models";
import { useEffect, useState } from "react";
import { ActivityLogList } from "./ActivityLogList";
import { CommentList } from "./CommentList";
import { CommentInput } from "./CommentInput";
import { activityService } from "@/lib/services";
import { useSupabase } from "@/providers/SupabaseProvider";

interface EditTaskDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    task: Task | null;
    members: BoardMember[];
    comments: Comment[];
    onFetchComments: (taskId: string) => void;
    onAddComment: (taskId: string, content: string) => Promise<void>;
    onEditComment: (taskId: string, commentId: string, content: string) => Promise<void>;
    onDeleteComment: (taskId: string, commentId: string) => Promise<void>;
}


export function EditTaskDialog({
    isOpen,
    onOpenChange,
    onSubmit,
    task,
    members,
    comments,
    onFetchComments,
    onAddComment,
    onEditComment,
    onDeleteComment,
}: EditTaskDialogProps) {
    const { supabase } = useSupabase();
    const [priority, setPriority] = useState<string>("medium");
    const [assignee, setAssignee] = useState<string>("");
    const [logs, setLogs] = useState<ActivityLog[]>([]);

    useEffect(() => {
        if (task) {
            setPriority(task.priority);
            setAssignee(task.assignee || "");
            loadLogs(task.id);
            onFetchComments(task.id);
        }
    }, [task, isOpen]);

    async function loadLogs(taskId: string) {
        if (!supabase) return;
        try {
            const data = await activityService.getLogs(supabase, taskId);
            setLogs(data);
        } catch (error) {
            console.error("Failed to load logs", error);
        }
    }

    if (!task) return null;

    return (
        <BaseDialog
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title="Edit Task"
            description="Update task details"
            className="sm:!max-w-[95vw] !w-[95vw]"
        >
            <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-8 py-2">
                <form onSubmit={onSubmit} className="space-y-4">
                    <input type="hidden" name="taskId" value={task.id} />
                    <div className="space-y-2">
                        <Label>Title *</Label>
                        <Input
                            id="title"
                            name="title"
                            defaultValue={task.title}
                            placeholder="Enter task title"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={task.description || ""}
                            placeholder="Enter task description (use @ to mention)"
                            rows={6}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Properties</label>
                        <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                            <div className="space-y-1">
                                <Label className="text-xs">Assignee</Label>
                                <AssigneeSelect
                                    members={members}
                                    value={assignee}
                                    onChange={setAssignee}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Priority</Label>
                                <Select
                                    name="priority"
                                    value={priority}
                                    onValueChange={setPriority}
                                >
                                    <SelectTrigger className="w-full cursor-pointer h-9">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {["low", "medium", "high"].map((p, key) => (
                                            <SelectItem
                                                key={key}
                                                value={p}
                                                className="cursor-pointer"
                                            >
                                                {p.charAt(0).toUpperCase() + p.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Due Date</Label>
                                <Input
                                    type="date"
                                    name="dueDate"
                                    id="dueDate"
                                    className="h-9"
                                    defaultValue={task.due_date ? task.due_date.split("T")[0] : ""}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button type="submit" className="cursor-pointer">
                            Save Changes
                        </Button>
                    </div>
                </form>

                <div className="space-y-6">
                    <div className="border-t pt-4 space-y-4 md:border-t-0 md:pt-0">
                        <h3 className="text-sm font-semibold flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            Comments
                        </h3>
                        <CommentList
                            comments={comments || []}
                            onEdit={(id, content) => onEditComment(task.id, id, content)}
                            onDelete={(id) => onDeleteComment(task.id, id)}
                        />
                        <CommentInput
                            onAddComment={(content) => onAddComment(task.id, content)}
                        />
                    </div>

                    <div className="border-t pt-4 max-h-[200px] overflow-y-auto">
                        <ActivityLogList logs={logs} />
                    </div>
                </div>
            </div>
        </BaseDialog >
    );
}
