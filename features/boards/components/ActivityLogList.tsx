"use client";

import { ActivityLog } from "@/lib/supabase/models";
import { formatDistanceToNow } from "date-fns";
import { Activity, ArrowRight, Edit2, MessageSquare, Move } from "lucide-react";

interface ActivityLogProps {
    logs: ActivityLog[];
}

export function ActivityLogList({ logs }: ActivityLogProps) {
    if (logs.length === 0) {
        return (
            <div className="text-center py-4 text-muted-foreground text-sm">
                No activity yet.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Activity
            </h3>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {logs.map((log) => (
                    <div key={log.id} className="flex gap-3 text-sm">
                        <div className="mt-0.5">
                            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
                                {getIcon(log.action_type)}
                            </div>
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{log.details.user_email || "User"}</span>
                                <span className="text-muted-foreground text-xs">
                                    {formatDistanceToNow(new Date(log.created_at), {
                                        addSuffix: true,
                                    })}
                                </span>
                            </div>
                            <div className="text-gray-700 dark:text-gray-300">
                                {getMessage(log)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function getIcon(type: string) {
    switch (type) {
        case "move":
            return <Move className="h-4 w-4" />;
        case "update":
            return <Edit2 className="h-4 w-4" />;
        case "mention":
            return <MessageSquare className="h-4 w-4" />;
        default:
            return <Activity className="h-4 w-4" />;
    }
}

function getMessage(log: ActivityLog) {
    switch (log.action_type) {
        case "create":
            return `Created this task`;
        case "move":
            return (
                <span className="flex items-center gap-1 flex-wrap">
                    Moved from <span className="font-medium">{log.details.from}</span>
                    <ArrowRight className="h-3 w-3" />
                    <span className="font-medium">{log.details.to}</span>
                </span>
            );
        case "update":
            const fields = log.details.fields || [];
            if (fields.includes("priority") && log.details.new_priority) {
                return `Updated priority to ${log.details.new_priority}`;
            }
            if (fields.includes("assignee") && log.details.new_assignee) {
                return `Assigned to ${log.details.new_assignee}`;
            }
            if (fields.includes("title") && log.details.new_title) {
                return `Renamed to "${log.details.new_title}"`;
            }
            if (fields.includes("due_date") && log.details.new_due_date) {
                return `Set due date to ${new Date(log.details.new_due_date).toLocaleDateString()}`;
            }
            return `Updated ${fields.join(", ")}`;
        case "mention":
            const mentions = log.details.mentions?.join(", ") || "someone";
            return `Mentioned ${mentions}`;
        default:
            return "Performed an action";
    }
}
