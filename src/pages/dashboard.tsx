import { useState, useMemo } from "react";
import { useKeyboard } from "@opentui/react";
import { TextAttributes } from "@opentui/core";
import { useApp, DAYS } from "../context/app-context";
import { DailySchedule } from "../components/daily-schedule";
import { OverallStats } from "../components/overall-stats";

export function DashboardPage() {
  const { schedule, subjects, attendance, markAttendance } = useApp();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [focusedSlot, setFocusedSlot] = useState(0);

  const formatDate = (d: Date) => d.toISOString().split("T")[0];
  const dateStr = useMemo(
    () => formatDate(currentDate),
    [currentDate],
  ) as string;

  const jsDay = currentDate.getDay();
  const dayIndex = jsDay === 0 ? -1 : jsDay - 1;
  const dayName = (dayIndex >= 0 && dayIndex < 5 ? DAYS[dayIndex] : "Weekend") as string;

  const todaysSlots = useMemo(() => {
    if (dayName === "Weekend") return [];
    return schedule[dayName] || [];
  }, [dayName, schedule]);

  useKeyboard((key) => {
    if (key.name === "left") {
      const prev = new Date(currentDate);
      prev.setDate(prev.getDate() - 1);
      setCurrentDate(prev);
      setFocusedSlot(0);
    }
    if (key.name === "right") {
      const next = new Date(currentDate);
      next.setDate(next.getDate() + 1);
      setCurrentDate(next);
      setFocusedSlot(0);
    }
    if (todaysSlots.length > 0) {
      if (key.name === "up") setFocusedSlot((prev) => Math.max(prev - 1, 0));
      if (key.name === "down")
        setFocusedSlot((prev) => Math.min(prev + 1, todaysSlots.length - 1));
    }
    if (
      dayName !== "Weekend" &&
      todaysSlots[focusedSlot] &&
      todaysSlots[focusedSlot] !== "FREE"
    ) {
      if (key.name === "p") markAttendance(dateStr, focusedSlot, "P");
      if (key.name === "a") markAttendance(dateStr, focusedSlot, "A");
      if (key.name === "t") markAttendance(dateStr, focusedSlot, "T");
    }
  });

  // I can't with these type issues...
  if (attendance[dateStr] === undefined) {
    attendance[dateStr] = {};
  }

  return (
    <box flexDirection="column" alignItems="center" padding={1} width={120}>
      {/* Header */}
      <box flexDirection="row" justifyContent="center" marginBottom={1}>
        <text fg="blue" attributes={TextAttributes.BOLD}>
          {"< "}
        </text>
        <text attributes={TextAttributes.BOLD}>
          {" "}
          {currentDate.toDateString()}{" "}
        </text>
        <text fg="blue" attributes={TextAttributes.BOLD}>
          {" >"}
        </text>
      </box>

      {/* Content */}
      <box flexDirection="row" flexGrow={1}>
        {/* Left: Schedule */}
        <box
          width="50%"
          flexDirection="column"
          alignItems="flex-end"
          paddingRight={5}
        >
          <text fg="blue" attributes={TextAttributes.BOLD} marginBottom={1}>
            Daily Schedule
          </text>
          <DailySchedule
            dayName={dayName as string}
            slots={todaysSlots}
            subjects={subjects}
            attendanceRecord={attendance[dateStr]}
            focusedSlot={focusedSlot}
          />
        </box>

        {/* Right: Stats */}
        <box width="50%" flexDirection="column" paddingLeft={5}>
          <OverallStats subjects={subjects} />
        </box>
      </box>

      <box marginTop={2} justifyContent="center" flexDirection="row" gap={1}>
        <text>↑/↓</text>
        <text attributes={TextAttributes.DIM}>Select</text>
        <text>←/→</text>
        <text attributes={TextAttributes.DIM}>Date</text>
        <text>P</text>
        <text attributes={TextAttributes.DIM}>Present</text>
        <text>A</text>
        <text attributes={TextAttributes.DIM}>Absent</text>
        <text>T</text>
        <text attributes={TextAttributes.DIM}>Teacher</text>
      </box>
    </box>
  );
}
