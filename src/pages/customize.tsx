import { useState, useMemo, useCallback } from "react";
import { useKeyboard } from "@opentui/react";
import { TextAttributes } from "@opentui/core";
import { useApp } from "../context/app-context";
import { ColorDialog } from "../components/color-dialog";
import { CustomizeRow } from "../components/customize-row";

const COLORS = [
  { name: "Cyan", value: "cyan" },
  { name: "Red", value: "red" },
  { name: "Green", value: "green" },
  { name: "Yellow", value: "yellow" },
  { name: "Magenta", value: "magenta" },
  { name: "White", value: "white" },
  { name: "Gray", value: "gray" },
];

type Field = "color" | "credits" | "room" | "instructor";

const FIELD_ORDER: Field[] = ["color", "credits", "room", "instructor"];

export function CustomizePage() {
  const { subjects, updateSubject } = useApp();

  const [focusIndex, setFocusIndex] = useState<number>(-1);
  const [colFocus, setColFocus] = useState<number>(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isColorDialogOpen, setIsColorDialogOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const currentSubject = focusIndex >= 0 ? subjects[focusIndex] : null;
  const currentField = FIELD_ORDER[colFocus - 1] as Field | undefined;

  const colorIndex = useMemo(() => {
    if (!currentSubject || currentField !== "color") return 0;
    const idx = COLORS.findIndex((c) => c.value === currentSubject.color);
    return idx >= 0 ? idx : 0;
  }, [currentSubject, currentField]);

  useKeyboard((key) => {
    if (isColorDialogOpen && currentSubject) {
      if (key.name === "escape" || key.name === "x" || key.name === "X") {
        setIsColorDialogOpen(false);
        return;
      }

      if (key.name === "w" || key.name === "W" || key.name === "up") {
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : COLORS.length - 1));
        return;
      }

      if (key.name === "s" || key.name === "S" || key.name === "down") {
        setHighlightedIndex((prev) => (prev < COLORS.length - 1 ? prev + 1 : 0));
        return;
      }

      if (key.name === "space") {
        const selectedColor = COLORS[highlightedIndex];
        if (currentSubject && selectedColor) {
          updateSubject(currentSubject.id, { color: selectedColor.value });
        }
        setIsColorDialogOpen(false);
        return;
      }

      return;
    }

    if (isEditing) {
      if (key.name === "escape") {
        setIsEditing(false);
        return;
      }
    }

    if (key.name === "down") {
      setFocusIndex((prev) => {
        if (prev === -1) return 0;
        if (prev >= subjects.length - 1) return subjects.length - 1;
        return prev + 1;
      });
      return;
    }

    if (key.name === "up") {
      setFocusIndex((prev) => {
        if (prev <= 0) return 0;
        if (prev === subjects.length) return subjects.length - 1;
        return prev - 1;
      });
      return;
    }

    if (key.name === "right" && focusIndex >= 0) {
      setColFocus((prev) => Math.min(prev + 1, 4));
      return;
    }

    if (key.name === "left") {
      setColFocus((prev) => Math.max(prev - 1, 1));
      return;
    }

    if (key.name === "space" && focusIndex >= 0) {
      if (currentField === "color") {
        setHighlightedIndex(colorIndex);
        setIsColorDialogOpen(true);
      } else {
        setIsEditing(true);
      }
      return;
    }
  });

  const handleSaveField = useCallback((id: string, field: Field, value: string) => {
    updateSubject(id, { [field]: value });
    setIsEditing(false);
  }, [updateSubject]);

  return (
    <box flexDirection="column" alignItems="center" padding={1} width={100}>
      <text fg="blue" attributes={TextAttributes.BOLD}>
        Customize Subjects
      </text>

      <box flexDirection="column" marginTop={1}>
        <box flexDirection="row" alignItems="center" marginBottom={1}>
          <text attributes={TextAttributes.DIM} width={25}>Name</text>
          <text attributes={TextAttributes.DIM} width={10}>Color</text>
          <text attributes={TextAttributes.DIM} width={8}>Credits</text>
          <text attributes={TextAttributes.DIM} width={12}>Room</text>
          <text attributes={TextAttributes.DIM} width={20}>Instructor</text>
        </box>

        {subjects.map((subj, idx) => (
          <CustomizeRow
            key={subj.id}
            subject={subj}
            isFocused={focusIndex === idx}
            isEditing={isEditing && focusIndex === idx}
            colFocus={colFocus}
            onSave={handleSaveField}
          />
        ))}
      </box>

      <box marginTop={3} justifyContent="center" flexDirection="row" gap={1}>
        <text>↑/↓</text>
        <text attributes={TextAttributes.DIM}>Navigate</text>
        <text>←/→</text>
        <text attributes={TextAttributes.DIM}>Columns</text>
        <text>space</text>
        <text attributes={TextAttributes.DIM}>Edit</text>
        <text>enter</text>
        <text attributes={TextAttributes.DIM}>Save</text>
        <text>esc</text>
        <text attributes={TextAttributes.DIM}>Cancel</text>
      </box>

      {isColorDialogOpen && currentSubject && (
        <box position="absolute" top={8} left={30}>
          <ColorDialog
            options={COLORS}
            highlightedIndex={highlightedIndex}
            currentValue={currentSubject.color}
          />
        </box>
      )}
        </box>
  );
}
