import { memo, useState, useEffect } from "react";
import { TextAttributes } from "@opentui/core";

interface NewSubjectRowProps {
  isFocused: boolean;
  subFocus: 0 | 1;
  onAdd: (name: string, code: string) => void;
}

export const NewSubjectRow = memo(function NewSubjectRow({
  isFocused,
  subFocus,
  onAdd,
}: NewSubjectRowProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  // Reset fields when focus is lost or added successfully
  useEffect(() => {
    if (!isFocused) {
    }
  }, [isFocused]);

  const handleSubmit = () => {
    if (name.trim()) {
      onAdd(name, code);
      setName("");
      setCode("");
    }
  };

  return (
    <box height={1} marginTop={1} flexDirection="row">
      <text fg="blue" attributes={isFocused ? TextAttributes.BOLD : undefined}>
        {isFocused ? "> " : "+ "}
      </text>

      <input
        value={name}
        placeholder={isFocused ? "Type Subject Name..." : "Add new..."}
        onInput={setName}
        onSubmit={handleSubmit}
        focused={isFocused && subFocus === 0}
        flexGrow={1}
      />

      <box width={2} />

      <input
        value={code}
        placeholder="Code (opt)"
        onInput={setCode}
        onSubmit={handleSubmit}
        focused={isFocused && subFocus === 1}
        width={15}
      />
    </box>
  );
});
