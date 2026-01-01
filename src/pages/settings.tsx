import { useState, useMemo } from "react";
import { useKeyboard } from "@opentui/react";
import { useApp, DAYS } from "../context/app-context";
import { ScheduleRow } from "../components/schedule-row";
import { TextAttributes } from "@opentui/core";

export function SchedulePage() {
    const { schedule, subjects, updateSchedule, resetSchedule } = useApp();

    const [row, setRow] = useState(0);
    const [col, setCol] = useState(0);
    const [isEditing, setIsEditing] = useState(false);

    // Create stable options list (Free + IDs)
    const options = useMemo(
        () => ["FREE", ...subjects.map((s) => s.id)],
        [subjects],
    );

    useKeyboard((key) => {
        // --- 1. EDIT MODE ---
        if (isEditing) {
            // Stop Editing
            if (key.name === "s") {
                setIsEditing(false);
                return;
            }

            // Cycle Options (A/D)
            const currentDay = DAYS[row];
            const currentVal = schedule[currentDay][col];
            const idx = options.indexOf(currentVal);
            const safeIdx = idx === -1 ? 0 : idx;

            if (key.name === "d") {
                const next = safeIdx < options.length - 1 ? safeIdx + 1 : 0;
                updateSchedule(currentDay, col, options[next]);
            }
            if (key.name === "a") {
                const prev = safeIdx > 0 ? safeIdx - 1 : options.length - 1;
                updateSchedule(currentDay, col, options[prev]);
            }
            return; // Block other navigation while editing
        }

        // --- 2. NAVIGATION MODE ---

        // Start Editing
        if (key.name === "space") {
            setIsEditing(true);
            return;
        }

        // Global Reset
        if (key.name === "r" && key.ctrl) {
            resetSchedule();
            return;
        }

        // Grid Navigation
        if (key.name === "right") setCol((prev) => Math.min(prev + 1, 7));
        if (key.name === "left") setCol((prev) => Math.max(prev - 1, 0));
        if (key.name === "up") setRow((prev) => Math.max(prev - 1, 0));
        if (key.name === "down") setRow((prev) => Math.min(prev + 1, 4));
    });

    return (
        <box flexDirection="column" alignItems="center" padding={1} width={120}>
            <box flexDirection="column" marginBottom={1}>
                <text fg="blue" attributes={TextAttributes.BOLD}>
                    Weekly Schedule Configuration
                </text>
            </box>

            {/* Headers */}
            <box flexDirection="row" marginBottom={1}>
                <box width={12}>
                    <text attributes={TextAttributes.DIM}>Day</text>
                </box>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <box key={i} width={12} justifyContent="center">
                        <text attributes={TextAttributes.DIM}>{i}</text>
                    </box>
                ))}
            </box>

            {/* Grid */}
            <box flexDirection="column">
                {DAYS.map((day, idx) => (
                    <ScheduleRow
                        key={day}
                        day={day}
                        slots={schedule[day] as string[]}
                        focusedColIndex={row === idx ? col : -1}
                        isEditing={isEditing}
                        subjects={subjects}
                    />
                ))}
            </box>

            {/* Footer */}
            <box
                marginTop={2}
                flexGrow={1}
                alignItems="center"
                justifyContent="center"
            >
                <text attributes={TextAttributes.DIM}>
                    [↑/↓/←/→] Navigate [Space] Edit [a/d] Cycle Options [s] Save
                </text>
            </box>
        </box>
    );
}
