import { memo, useState, useEffect } from "react";
import { TextAttributes } from "@opentui/core";
import { type Subject } from "../context/app-context";

interface CustomizeRowProps {
  subject: Subject;
  isFocused: boolean;
  isEditing: boolean;
  colFocus: number;
  onSave: (id: string, field: "color" | "credits" | "room" | "instructor", value: string) => void;
}

export const CustomizeRow = memo(function CustomizeRow({
  subject,
  isFocused,
  isEditing,
  colFocus,
  onSave,
}: CustomizeRowProps) {
  const [credits, setCredits] = useState(subject.credits);
  const [room, setRoom] = useState(subject.room);
  const [instructor, setInstructor] = useState(subject.instructor);
  const isColour = ["cyan", "red", "green", "yellow", "magenta", "white", "gray"].includes(subject.color.toLowerCase());

  useEffect(() => {
    if (!isEditing) {
      setCredits(subject.credits);
      setRoom(subject.room);
      setInstructor(subject.instructor);
    }
  }, [isEditing, subject]);

  const handleSubmit = () => {
    if (colFocus === 2) {
      onSave(subject.id, "credits", credits);
    } else if (colFocus === 3) {
      onSave(subject.id, "room", room);
    } else if (colFocus === 4) {
      onSave(subject.id, "instructor", instructor);
    }
  };

  return (
    <box height={1} flexDirection="row">
      <text
        width={25}
        attributes={isFocused ? TextAttributes.BOLD : undefined}
        fg={isFocused ? "blue" : "white"}
      >
        {subject.name}
      </text>

      <box width={10}>
        <text
          fg={isFocused && colFocus === 1 ? "black" : (isColour ? subject.color : "white")}
          bg={isFocused && colFocus === 1 ? "white" : undefined}
          attributes={isFocused && colFocus === 1 ? TextAttributes.BOLD : undefined}
        >
          {subject.color}
        </text>
      </box>

      <box width={8}>
        {isEditing && isFocused && colFocus === 2 ? (
          <input
            value={credits}
            onInput={setCredits}
            onSubmit={handleSubmit}
            focused={true}
            width={6}
          />
        ) : (
          <text
            fg={isFocused && colFocus === 2 ? "black" : "white"}
            bg={isFocused && colFocus === 2 ? "white" : undefined}
          >
            {subject.credits || "-"}
          </text>
        )}
      </box>

      <box width={12}>
        {isEditing && isFocused && colFocus === 3 ? (
          <input
            value={room}
            onInput={setRoom}
            onSubmit={handleSubmit}
            focused={true}
            width={10}
          />
        ) : (
          <text
            fg={isFocused && colFocus === 3 ? "black" : "white"}
            bg={isFocused && colFocus === 3 ? "white" : undefined}
          >
            {subject.room || "-"}
          </text>
        )}
      </box>

      <box width={20}>
        {isEditing && isFocused && colFocus === 4 ? (
          <input
            value={instructor}
            onInput={setInstructor}
            onSubmit={handleSubmit}
            focused={true}
            flexGrow={1}
          />
        ) : (
          <text
            fg={isFocused && colFocus === 4 ? "black" : "white"}
            bg={isFocused && colFocus === 4 ? "white" : undefined}
          >
            {subject.instructor || "-"}
          </text>
        )}
      </box>
    </box>
  );
});
