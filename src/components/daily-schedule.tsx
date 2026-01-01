import { memo } from "react";
import { TextAttributes } from "@opentui/core";
import { type Subject } from "../context/app-context";
import { DailyScheduleRow } from "./daily-schedule-row";

interface DailyScheduleProps {
  dayName: string;
  slots: string[];
  subjects: Subject[];
  attendanceRecord: Record<number, string>; // Just the record for THIS day
  focusedSlot: number;
}

export const DailySchedule = memo(function DailySchedule({
  dayName,
  slots,
  subjects,
  attendanceRecord,
  focusedSlot,
}: DailyScheduleProps) {
  // Early returns for empty states
  if (dayName === "Weekend") {
    return <text attributes={TextAttributes.DIM}>Weekend - No Classes</text>;
  }
  if (slots.length === 0) {
    return <text attributes={TextAttributes.DIM}>No classes scheduled.</text>;
  }

  return (
    <box flexDirection="column">
      {slots.map((subId, idx) => (
        <DailyScheduleRow
          key={idx}
          subId={subId}
          subject={subjects.find((s) => s.id === subId)}
          status={attendanceRecord?.[idx]}
          isFocused={focusedSlot === idx}
        />
      ))}
    </box>
  );
});
