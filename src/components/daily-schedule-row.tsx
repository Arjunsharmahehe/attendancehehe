import { memo } from "react";
import { TextAttributes } from "@opentui/core";
import { type Subject } from "../context/app-context";

interface DailyScheduleRowProps {
    subId: string;
    subject: Subject | undefined;
    status: string | undefined; // "P" | "A" | "T" | undefined
    isFocused: boolean;
}

export const DailyScheduleRow = memo(function DailyScheduleRow({
    subId,
    subject,
    status,
    isFocused,
}: DailyScheduleRowProps) {
    // 1. Handle Free Slots
    if (subId === "FREE") {
        return (
            <box height={1} marginBottom={1}>
                <text
                    attributes={TextAttributes.DIM}
                    fg={isFocused ? "green" : undefined}
                >
                    {isFocused ? "> " : "  "} -- Free --
                </text>
            </box>
        );
    }

    // 2. Handle Subject Slots
    let statusIcon = "[ ]";
    let statusColor = "white";

    if (status === "P") {
        statusIcon = "[P]";
        statusColor = "green";
    } else if (status === "A") {
        statusIcon = "[A]";
        statusColor = "red";
    } else if (status === "T") {
        statusIcon = "[T]";
        statusColor = "yellow";
    }

    return (
        <box height={1} marginBottom={1} flexDirection="row">
            {/* Cursor Indicator */}
            <text
                fg="blue"
                attributes={isFocused ? TextAttributes.BOLD : undefined}
            >
                {isFocused ? "> " : "  "}
            </text>

            {/* Attendance Status */}
            <text
                fg={statusColor}
                attributes={status ? TextAttributes.BOLD : undefined}
            >
                {statusIcon}
            </text>

            <box width={1} />

            {/* Subject Name */}
            <text attributes={isFocused ? TextAttributes.BOLD : undefined}>
                {subject
                    ? subject.name.length > 36
                        ? subject.name.slice(0, 33) + "..."
                        : subject.name
                    : "Unknown"}
            </text>

            <box width={1} />

            {/* Subject Code */}
            <text attributes={TextAttributes.DIM}>
                ({subject ? subject.code : ""})
            </text>
        </box>
    );
});
