import { memo } from "react";
import { type Subject } from "../context/app-context";
import { TextAttributes } from "@opentui/core";

interface ScheduleCellProps {
  value: string;
  color?: string;
  isFocused: boolean;
  subjects: Subject[];
}

export const ScheduleCell = memo(function ScheduleCell({
  value,
  color,
  isFocused,
  subjects,
}: ScheduleCellProps) {
  if (isFocused) {
    return (
      <box width={12} height={2} alignItems="center" justifyContent="center">
        <text
          fg="black"
          bg="white"
          attributes={TextAttributes.BOLD}
        >
          {value === "FREE" ? "FREE" : `[${subjects.find(s => s.id === value)?.code ?? value}]`}
        </text>
      </box>
    );
  }
  
  const fgColor = value === "FREE" ? "gray" : (color ?? "cyan");
  return (
    <box width={12} height={2} alignItems="center" justifyContent="center">
      <text fg={fgColor}>
        {value === "FREE" ? "FREE" : `[${subjects.find(s => s.id === value)?.code ?? value}]`}
      </text>
    </box>
  );
});
