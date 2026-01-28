"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { BoardMember } from "@/lib/supabase/models";

interface AssigneeSelectProps {
    members: BoardMember[];
    value?: string;
    onChange: (value: string) => void;
    name?: string;
}

export function AssigneeSelect({
    members,
    value,
    onChange,
    name = "assignee"
}: AssigneeSelectProps) {
    return (
        <Select name={name} value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select assignee" />
            </SelectTrigger>
            <SelectContent>
                {members && members.length > 0 ? (
                    members.map((member) => (
                        <SelectItem key={member.id} value={member.email}>
                            {member.email} ({member.role})
                        </SelectItem>
                    ))
                ) : (
                    <div className="p-2 text-xs text-muted-foreground text-center">
                        No members found
                    </div>
                )}
            </SelectContent>
        </Select>
    );
}
