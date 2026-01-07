import os from "os";
import path from "path";
import type { Subject, Schedule, TimetablePreset } from "../context/app-context";
import { DAYS } from "../context/app-context";

let canvasModule: typeof import("canvas") | null = null;

async function loadCanvas() {
  if (!canvasModule) {
    try {
      canvasModule = await import("canvas");
    } catch {
      throw new Error("canvas package not installed. Run 'bun add canvas' first.");
    }
  }
  return canvasModule;
}

interface TimetableData {
  subjects: Subject[];
  schedule: Schedule;
  preset: TimetablePreset;
}

export async function generateTimetableImage(data: TimetableData): Promise<string> {
  const canvas = await loadCanvas();
  const { createCanvas } = canvas;

  const { subjects, schedule, preset } = data;

  const dayHeaderWidth = 90;
  const slotWidth = 155;
  const headerHeight = 60;
  const columnHeaderHeight = 50;
  const rowHeight = 90;

  const canvasWidth = dayHeaderWidth + (slotWidth * 8);
  const canvasHeight = headerHeight + columnHeaderHeight + (rowHeight * 5);

  const cvs = createCanvas(canvasWidth, canvasHeight);
  const ctx = cvs.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(0, 0, canvasWidth, headerHeight);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 26px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Weekly Timetable", canvasWidth / 2, 36);

  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  ctx.font = "11px Arial";
  ctx.fillStyle = "#aaaaaa";
  ctx.fillText(dateStr, canvasWidth / 2, 53);

  const gridStartY = headerHeight + columnHeaderHeight;
  const dayHeaderStartY = gridStartY;

  ctx.fillStyle = "#f0f0f0";
  ctx.fillRect(0, headerHeight, dayHeaderWidth, columnHeaderHeight);

  ctx.fillStyle = "#e8e8e8";
  ctx.fillRect(dayHeaderWidth, headerHeight, canvasWidth - dayHeaderWidth, columnHeaderHeight);

  for (let slotIdx = 0; slotIdx < 8; slotIdx++) {
    const x = dayHeaderWidth + slotIdx * slotWidth;
    
    ctx.strokeStyle = "#dddddd";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, headerHeight, slotWidth, columnHeaderHeight);

    const timeLabel = preset.slots[slotIdx] || "";
    if (timeLabel) {
      ctx.fillStyle = "#333333";
      ctx.font = "bold 11px Arial";
      ctx.textAlign = "center";
      ctx.fillText(timeLabel, x + slotWidth / 2, headerHeight + 30);
    }
  }

  ctx.fillStyle = "#e8e8e8";
  ctx.fillRect(0, gridStartY, dayHeaderWidth, rowHeight * 5);

  ctx.strokeStyle = "#dddddd";
  ctx.lineWidth = 1;

  DAYS.forEach((day, dayIdx) => {
    const y = gridStartY + dayIdx * rowHeight;

    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, y, dayHeaderWidth, rowHeight);
    ctx.fillStyle = "#333333";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(day.substring(0, 3), dayHeaderWidth / 2, y + rowHeight / 2 + 4);

    for (let slotIdx = 0; slotIdx < 8; slotIdx++) {
      const x = dayHeaderWidth + slotIdx * slotWidth;

      ctx.strokeRect(x, y, slotWidth, rowHeight);

      const subjectId = schedule[day]?.[slotIdx];

      if (subjectId && subjectId !== "FREE") {
        const subject = subjects.find((s) => s.id === subjectId);
        if (subject) {
          ctx.fillStyle = getColorHex(subject.color);
          ctx.fillRect(x + 2, y + 2, slotWidth - 4, rowHeight - 4);

          ctx.fillStyle = "#000000";
          ctx.font = "bold 15px Arial";
          ctx.textAlign = "left";
          const maxNameLen = Math.floor((slotWidth - 20) / 8);
          const shortName = subject.name.length > maxNameLen
            ? subject.name.substring(0, maxNameLen) + "..."
            : subject.name;
          ctx.fillText(shortName, x + 10, y + 26);

          ctx.font = "11px Arial";
          ctx.fillStyle = "#444444";
          ctx.fillText(`[${subject.code}]`, x + 10, y + 44);

          if (subject.room) {
            ctx.font = "10px Arial";
            ctx.fillStyle = "#1a1a1a";
            ctx.fillText(`📍 ${subject.room}`, x + 10, y + 62);
          }

          if (subject.instructor) {
            ctx.font = "9px Arial";
            ctx.fillStyle = "#333333";
            const maxInstrLen = Math.floor((slotWidth - 20) / 6);
            const shortInstr = subject.instructor.length > maxInstrLen
              ? subject.instructor.substring(0, maxInstrLen) + "..."
              : subject.instructor;
            ctx.fillText(shortInstr, x + 10, y + 78);
          }
        }
      }
    }
  });

  const fileName = `timetable-${new Date().toISOString().split("T")[0]}.png`;
  const filePath = path.join(os.homedir(), fileName);

  const buffer = cvs.toBuffer("image/png");
  await Bun.write(filePath, buffer);

  return filePath;
}

function getColorHex(colorName: string): string {
  const colorMap: Record<string, string> = {
    cyan: "#e0f7fa",
    red: "#ffebee",
    green: "#e8f5e9",
    yellow: "#fffde7",
    magenta: "#fce4ec",
    white: "#fafafa",
    gray: "#f5f5f5",
  };

  return colorMap[colorName.toLowerCase()] || "#e0f7fa";
}
