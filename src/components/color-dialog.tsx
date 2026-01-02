import { memo } from "react";
import { TextAttributes } from "@opentui/core";

interface ColorOption {
  name: string;
  value: string;
}

interface ColorDialogProps {
  options: ColorOption[];
  highlightedIndex: number;
  currentValue: string;
}

export const ColorDialog = memo(function ColorDialog({
  options,
  highlightedIndex,
  currentValue,
}: ColorDialogProps) {
  return (
    <box
      width={40}
      height={15}
      flexDirection="column"
      paddingTop={0.5}
      paddingLeft={1}
      paddingRight={1}
      style={{ backgroundColor: "#1a1a1a" }}
    >
      <box justifyContent="center" alignItems="center" marginBottom={1}>
        <text fg="gray" attributes={TextAttributes.DIM}>
          Select Color
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
                {marker}{selectMark}{option.name}
              </text>
            </box>
          );
        })}
      </box>
      <box marginTop={1} justifyContent="center" flexDirection="row" gap={1}>
        <text>W/S</text>
        <text attributes={TextAttributes.DIM}>Navigate</text>
        <text>Enter</text>
        <text attributes={TextAttributes.DIM}>Select</text>
        <text>X</text>
        <text attributes={TextAttributes.DIM}>Cancel</text>
      </box>
    </box>
  );
});
