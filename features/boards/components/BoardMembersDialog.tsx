"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BaseDialog } from "@/components/common/BaseDialog";
import { BoardMember } from "@/lib/supabase/models";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";

interface BoardMembersDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    members: BoardMember[];
    onAddMember: (email: string, role: "admin" | "member" | "viewer") => Promise<void>;
    onRemoveMember: (memberId: string) => Promise<void>;
    onUpdateRole: (memberId: string, role: "admin" | "member" | "viewer") => Promise<void>;
}

export function BoardMembersDialog({
    isOpen,
    onOpenChange,
    members,
    onAddMember,
    onRemoveMember,
    onUpdateRole,
}: BoardMembersDialogProps) {
    const [newMemberEmail, setNewMemberEmail] = useState("");
    const [newMemberRole, setNewMemberRole] = useState<"admin" | "member" | "viewer">("member");
    const [loading, setLoading] = useState(false);

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMemberEmail.trim()) return;

        try {
            setLoading(true);
            await onAddMember(newMemberEmail, newMemberRole);
            setNewMemberEmail("");
            setNewMemberRole("member");
        } catch (error) {
            console.error("Failed to add member:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        try {
            await onRemoveMember(memberId);
        } catch (error) {
            console.error("Failed to remove member:", error);
        }
    };

    const handleUpdateRole = async (memberId: string, role: "admin" | "member" | "viewer") => {
        try {
            await onUpdateRole(memberId, role);
        } catch (error) {
            console.error("Failed to update role:", error);
        }
    };

    return (
        <BaseDialog
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title="Manage Members"
            description="Invite users and manage roles."
        >
            <div className="space-y-6">
                {/* Add Member Form */}
                <form onSubmit={handleAddMember} className="flex flex-col gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email Address</label>
                        <Input
                            placeholder="user@example.com"
                            value={newMemberEmail}
                            onChange={(e) => setNewMemberEmail(e.target.value)}
                            required
                            type="email"
                        />
                    </div>
                    <div className="flex items-end gap-3">
                        <div className="space-y-2 flex-grow">
                            <label className="text-sm font-medium">Role</label>
                            <Select
                                value={newMemberRole}
                                onValueChange={(val: any) => setNewMemberRole(val)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="member">Member</SelectItem>
                                    <SelectItem value="viewer">Viewer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit" disabled={loading} className="w-auto px-4">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add
                        </Button>
                    </div>
                </form>

                {/* Member List */}
                <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Current Members</h4>
                    <div className="space-y-3">
                        {members.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">No members yet.</p>
                        ) : (
                            members.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border"
                                >
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm">{member.email}</span>
                                        <span className="text-xs text-muted-foreground capitalize">
                                            {member.role}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {member.role !== "owner" && (
                                            <Select
                                                value={member.role}
                                                onValueChange={(val: any) =>
                                                    handleUpdateRole(member.id, val)
                                                }
                                            >
                                                <SelectTrigger className="h-8 w-24 text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                    <SelectItem value="member">Member</SelectItem>
                                                    <SelectItem value="viewer">Viewer</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                        {member.role !== "owner" && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:text-destructive/90"
                                                onClick={() => handleRemoveMember(member.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </BaseDialog>
    );
}
