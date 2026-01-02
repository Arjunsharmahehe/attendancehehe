import { memo } from "react";
import { ScheduleCell } from "./schedule-cell";
import { type Subject } from "../context/app-context";
import { TextAttributes } from "@opentui/core";

interface ScheduleRowProps {
  day: string;
  slots: string[];
  focusedColIndex: number;
  subjects: Subject[];
}

export const ScheduleRow = memo(function ScheduleRow({
  day,
  slots,
  focusedColIndex,
  subjects,
}: ScheduleRowProps) {
  return (
    <box flexDirection="row" height={1} marginBottom={1} alignItems="center">
      {/* Day Label */}
      <box width={12} justifyContent="flex-start">
        <text
          fg={focusedColIndex >= 0 ? "blue" : "white"}
          attributes={focusedColIndex >= 0 ? TextAttributes.BOLD : undefined}
        >
          {day}
        </text>
      </box>

      {/* Slots */}
      {slots.map((val, idx) => (
        <ScheduleCell
          key={`${day}-${idx}`}
          value={val}
          isFocused={focusedColIndex === idx}
          subjects={subjects}
        />
      ))}
    </box>
  );
});
