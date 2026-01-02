import { memo } from "react";
import { TextAttributes } from "@opentui/core";

interface SubjectOption {
  code: string;
  name: string;
  value: string;
}

interface SubjectDialogProps {
  options: SubjectOption[];
  highlightedIndex: number;
  currentValue: string;
}

export const SubjectDialog = memo(function SubjectDialog({
  options,
  highlightedIndex,
  currentValue,
}: SubjectDialogProps) {
  return (
    <box
      width={50}
      height={20}
      flexDirection="column"
      paddingTop={0.5}
      paddingLeft={1}
      paddingRight={1}
      style={{ backgroundColor: "#1a1a1a" }}
    >
      <box justifyContent="center" alignItems="center" marginBottom={1}>
        <text fg="gray" attributes={TextAttributes.DIM}>
          Select Subject
        </text>
      </box>
      <box flexDirection="column">
        {options.map((option, idx) => {
          const isSelected = option.value === currentValue;
          const isHighlighted = idx === highlightedIndex;
          
          const marker = isHighlighted ? "> " : "  ";
          const selectMark = isSelected ? "● " : "  ";
          
          return (
            <box key={option.value} paddingLeft={1} paddingRight={1}>
              <text
                fg={isHighlighted ? "blue" : "white"}
                attributes={isHighlighted ? TextAttributes.BOLD : undefined}
              >
                {marker}{selectMark}[{option.code}] {option.name}
              </text>
            </box>
          );
        })}
      </box>
      <box marginTop={1} justifyContent="center" flexDirection="row" gap={1}>
        <text>↑/↓</text>
        <text attributes={TextAttributes.DIM}>Navigate</text>
        <text>space</text>
        <text attributes={TextAttributes.DIM}>Select</text>
        <text>esc</text>
        <text attributes={TextAttributes.DIM}>Cancel</text>
      </box>
    </box>
  );
});
