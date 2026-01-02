import { useKeyboard } from "@opentui/react";
import { TextAttributes } from "@opentui/core";
import { useApp } from "../context/app-context";
import { useState, useCallback } from "react";
import { SubjectRow } from "../components/subject-row";
import { NewSubjectRow } from "../components/new-subject-row";

export function SubjectsPage() {
  const { subjects, addSubject, removeSubject } = useApp();

  const [focusIndex, setFocusIndex] = useState<number>(-1);
  const [subFocus, setSubFocus] = useState<0 | 1>(0);
  const [isEditing, setIsEditing] = useState(false);

  useKeyboard((key) => {
    if (key.name === "right" || key.name === "tab") {
      setSubFocus(1);
      return;
    }
    if (key.name === "left") {
      setSubFocus(0);
      return;
    }
    if (isEditing) {
      if (key.name === "escape") {
        setIsEditing(false);
      }
      return;
    }

    if (key.name === "down") {
      setFocusIndex((prev) => {
        if (prev === -1) return -1;
        if (prev === subjects.length - 1) return -1;
        return prev + 1;
      });
      setSubFocus(0); // Reset col on row change
    }
    if (key.name === "up") {
      setFocusIndex((prev) => {
        if (prev === 0) return 0;
        if (prev === -1) return subjects.length > 0 ? subjects.length - 1 : 0;
        return prev - 1;
      });
      setSubFocus(0); // Reset col on row change
    }

    if (key.name === "space" && focusIndex >= 0) {
      setIsEditing(true);
      setSubFocus(0);
    }

    if (key.name === "d" && focusIndex >= 0) {
      const idToDelete = subjects[focusIndex]?.id;
      removeSubject(idToDelete);
      setFocusIndex((prev) =>
        prev > 0 ? prev - 1 : subjects.length > 1 ? 0 : -1,
      );
    }
  });

  const handleSaveRow = useCallback(
    (id: string, name: string, code: string) => {
      removeSubject(id);
      addSubject(name, code);
      setIsEditing(false);
    },
    [removeSubject, addSubject],
  );

  const handleAddRow = useCallback(
    (name: string, code: string) => {
      addSubject(name, code);
      setSubFocus(0);
    },
    [addSubject],
  );

  return (
    <box flexDirection="column" padding={1} width={100}>
      {/* Header */}
      <box flexDirection="column" marginBottom={1}>
        <text fg="blue" attributes={TextAttributes.BOLD}>
          Subjects
        </text>
      </box>

      {/* List */}
      <box flexDirection="column" flexGrow={1}>
        {subjects.map((sub, idx) => (
          <SubjectRow
            key={sub.id}
            subject={sub}
            isFocused={focusIndex === idx}
            isEditing={isEditing && focusIndex === idx}
            subFocus={subFocus}
            onSave={handleSaveRow}
          />
        ))}
      </box>

      {/* Footer Input */}
      <NewSubjectRow
        isFocused={focusIndex === -1}
        subFocus={subFocus}
        onAdd={handleAddRow}
      />

      {/* Controls Helper */}
      <box marginTop={2} justifyContent="center" flexDirection="row" gap={1}>
        <text>↑/↓</text>
        <text attributes={TextAttributes.DIM}>Row</text>
        <text>←/→</text>
        <text attributes={TextAttributes.DIM}>Col</text>
        <text>space</text>
        <text attributes={TextAttributes.DIM}>Edit</text>
        <text>d</text>
        <text attributes={TextAttributes.DIM}>Delete</text>
      </box>
    </box>
  );
}
