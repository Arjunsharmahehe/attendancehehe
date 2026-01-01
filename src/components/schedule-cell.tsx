import { memo } from "react";
import { type Subject } from "../context/app-context";
import { TextAttributes } from "@opentui/core";

interface ScheduleCellProps {
  value: string;
  isFocused: boolean;
  isEditing: boolean;
  subjects: Subject[];
}

export const ScheduleCell = memo(function ScheduleCell({
  value,
  isFocused,
  isEditing,
  subjects,
}: ScheduleCellProps) {
  const getDisplayText = () => {
    if (value === "FREE") return "FREE";
    const sub = subjects.find((s) => s.id === value);
    return sub ? sub.code : "???";
  };

  let borderColor = "#131313";
  if (isFocused) borderColor = "white";
  if (isEditing) borderColor = "#131313";

  let fgColor = value === "FREE" ? "gray" : "cyan";
  if (isFocused) fgColor = "black";
  if (isEditing) fgColor = "yellow";

  return (
    <box width={12} height={2} alignItems="center" justifyContent="center">
      <text
        fg={fgColor}
        attributes={isFocused ? TextAttributes.BOLD : undefined}
        bg={isFocused ? borderColor : undefined}
      >
        {isEditing ? `> ${getDisplayText()} <` : getDisplayText()}
      </text>
    </box>
  );
});
