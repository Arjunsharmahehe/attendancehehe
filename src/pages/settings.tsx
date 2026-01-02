import { useState, useMemo } from "react";
import { useKeyboard } from "@opentui/react";
import { useApp, DAYS } from "../context/app-context";
import { ScheduleRow } from "../components/schedule-row";
import { SubjectDialog } from "../components/subject-dialog";
import { TextAttributes } from "@opentui/core";

export function SchedulePage() {
  const { schedule, subjects, updateSchedule, resetSchedule } = useApp();

  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const options = useMemo(
    () => [
      { code: "FREE", name: "Free Period", value: "FREE" },
      ...subjects.map((s) => ({ code: s.code, name: s.name, value: s.id })),
    ],
    [subjects],
  );

  const currentValue = useMemo(() => {
    const currentDay = DAYS[row] as string;
    return (schedule[currentDay]?.[col] ?? "FREE") as string;
  }, [schedule, row, col]);

  useKeyboard((key) => {
    if (isEditing) {
      if (key.name === "escape") {
        setIsEditing(false);
        return;
      }

      if (key.name === "space") {
        const currentDay = DAYS[row] as string;
        const selectedOption = options[highlightedIndex];
        if (currentDay && selectedOption) {
          updateSchedule(currentDay, col, selectedOption.value);
        }
        setIsEditing(false);
        return;
      }

      if (key.name === "up") {
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        return;
      }

      if (key.name === "down") {
        setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        return;
      }

      return;
    }

    if (key.name === "space") {
      const currentDay = DAYS[row] as string;
      const currentVal = schedule[currentDay]?.[col] ?? "FREE";
      const idx = options.findIndex((opt) => opt.value === currentVal);
      setHighlightedIndex(idx >= 0 ? idx : 0);
      setIsEditing(true);
      return;
    }

    if (key.name === "r" && key.ctrl) {
      resetSchedule();
      return;
    }

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
            subjects={subjects}
          />
        ))}
      </box>

      {/* Footer */}
      <box marginTop={2} justifyContent="center" flexDirection="row" gap={1}>
        <text>↑/↓/←/→</text>
        <text attributes={TextAttributes.DIM}>Navigate</text>
        <text>space</text>
        <text attributes={TextAttributes.DIM}>Edit</text>
        <text>ctrl+r</text>
        <text attributes={TextAttributes.DIM}>Reset</text>
      </box>

      {/* Subject Selection Dialog - rendered on top */}
      {isEditing && (
        <box position="absolute" top={1} left={35}>
          <SubjectDialog
            options={options}
            highlightedIndex={highlightedIndex}
            currentValue={currentValue}
          />
        </box>
      )}
    </box>
  );
}
