"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BaseDialog } from "@/components/common/BaseDialog";
import { useState } from "react";

interface CreateWorkspaceDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: { name: string; slug: string }) => Promise<void>;
}

export function CreateWorkspaceDialog({
    isOpen,
    onOpenChange,
    onSubmit,
}: CreateWorkspaceDialogProps) {
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await onSubmit({ name, slug: name.toLowerCase().replace(/\s+/g, '-') });
            setName("");
            onOpenChange(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <BaseDialog
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title="Create New Workspace"
            description="Organize your boards and collaborate with others in a dedicated workspace."
        >
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <Label htmlFor="wsName">Workspace Name</Label>
                    <Input
                        id="wsName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Marketing Team, Personal Projects"
                        required
                        autoFocus
                        disabled={isSubmitting}
                    />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting || !name.trim()}>
                        {isSubmitting ? "Creating..." : "Create Workspace"}
                    </Button>
                </div>
            </form>
        </BaseDialog>
    );
}
