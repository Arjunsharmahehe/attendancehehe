import { memo, useState } from "react";
import { useKeyboard } from "@opentui/react";
import { TextAttributes } from "@opentui/core";
import type { TimetablePreset } from "../context/app-context";

interface TimetableModalProps {
  presets: TimetablePreset[];
  onSelect: (preset: TimetablePreset) => void;
  onCancel: () => void;
}

export const TimetableModal = memo(function TimetableModal({
  presets,
  onSelect,
  onCancel,
}: TimetableModalProps) {
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  useKeyboard((key) => {
    if (key.name === "w" || key.name === "W" || key.name === "up") {
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : presets.length - 1));
      return;
    }

    if (key.name === "s" || key.name === "S" || key.name === "down") {
      setHighlightedIndex((prev) => (prev < presets.length - 1 ? prev + 1 : 0));
      return;
    }

    if (key.name === "space") {
      const selected = presets[highlightedIndex];
      if (selected) {
        onSelect(selected);
      }
      return;
    }

    if (key.name === "escape" || key.name === "x" || key.name === "X") {
      onCancel();
      return;
    }
  });

  return (
    <box
      position="absolute"
      top={8}
      left={35}
      width={40}
      flexDirection="column"
      paddingTop={0.5}
      paddingLeft={1}
      paddingRight={1}
      paddingBottom={0.5}
      style={{ backgroundColor: "#1a1a1a" }}
    >
      <box justifyContent="center" alignItems="center" marginBottom={1}>
        <text fg="gray" attributes={TextAttributes.DIM}>
          Select Time Format
        </text>
      </box>

      <box flexDirection="column">
        {presets.map((preset, idx) => {
          const isHighlighted = idx === highlightedIndex;

          return (
            <box key={preset.name} paddingLeft={1} paddingRight={1}>
              <text
                fg={isHighlighted ? "blue" : "white"}
                attributes={isHighlighted ? TextAttributes.BOLD : undefined}
              >
                {isHighlighted ? "> " : "  "}
                {preset.name}
              </text>
            </box>
          );
        })}
      </box>

      <box
        marginTop={2}
        marginBottom={1}
        justifyContent="center"
        flexDirection="row"
        gap={1}
      >
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
