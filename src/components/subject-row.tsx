import { memo, useEffect, useState } from "react";
import { TextAttributes } from "@opentui/core";
import { type Subject } from "../context/app-context";

interface SubjectRowProps {
    subject: Subject;
    isFocused: boolean;
    isEditing: boolean;
    subFocus: 0 | 1; // 0 = Name, 1 = Code
    onSave: (id: string, name: string, code: string) => void;
}

export const SubjectRow = memo(function SubjectRow({
    subject,
    isFocused,
    isEditing,
    subFocus,
    onSave,
}: SubjectRowProps) {
    // Local state isolates typing updates from the parent
    const [name, setName] = useState(subject.name);
    const [code, setCode] = useState(subject.code);

    // Reset local state if the subject prop changes or we stop editing
    useEffect(() => {
        if (!isEditing) {
            setName(subject.name);
            setCode(subject.code);
        }
    }, [isEditing, subject]);

    const handleSubmit = () => {
        onSave(subject.id, name, code);
    };

    return (
        <box height={1} flexDirection="row">
            {/* Indicator */}
            <text
                fg="blue"
                attributes={isFocused ? TextAttributes.BOLD : undefined}
            >
                {isFocused ? "> " : "  "}
            </text>

            {/* Name Column */}
            {isEditing && isFocused ? (
                <input
                    value={name}
                    onInput={setName}
                    onSubmit={handleSubmit}
                    focused={subFocus === 0}
                    flexGrow={1}
                />
            ) : (
                <text
                    fg={isFocused ? "white" : "gray"}
                    attributes={isFocused ? TextAttributes.BOLD : undefined}
                    style={{ flexGrow: 1 }}
                >
                    {subject.name}
                </text>
            )}

            <box width={2} />

            {/* Code Column */}
            {isEditing && isFocused ? (
                <input
                    value={code}
                    onInput={setCode}
                    onSubmit={handleSubmit}
                    focused={subFocus === 1}
                    width={15}
                />
            ) : (
                <text
                    fg={isFocused ? "cyan" : "gray"}
                    attributes={!isFocused ? TextAttributes.DIM : undefined}
                    width={15}
                >
                    {subject.code}
                </text>
            )}
        </box>
    );
});
