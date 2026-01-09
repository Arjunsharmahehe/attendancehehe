import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import os from "os";
import path from "path";
import fs from "fs";
import Bun from "bun";

export type Subject = {
  id: string;
  name: string;
  code: string;
  color: string;
  credits: string;
  room: string;
  instructor: string;
};
export type Schedule = Record<string, string[]>;
export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Timetable Preset Types
export type TimetablePreset = {
  name: string;
  slots: (string | null)[]; // null means no class for that slot
};

const DEFAULT_PRESETS: TimetablePreset[] = [
  {
    name: "Standard (9-1, 1:30-5:30)",
    slots: [
      "9:00am-10:00am",
      "10:00am-11:00am",
      "11:00am-12:00pm",
      "12:00pm-1:00pm",
      "1:30pm-2:30pm",
      "2:30pm-3:30pm",
      "3:30pm-4:30pm",
      "4:30pm-5:30pm",
    ],
  },
  {
    name: "Schools-1 (8-11, 11:15-2:15)",
    slots: [
      "",
      "8:00am-8:45am",
      "8:45am-9:30am",
      "9:30am-10:15am",
      "10:15am-11:00am",
      "11:15am-12:00pm",
      "12:00pm-12:45pm",
      "12:45pm-1:30pm",
      "1:30pm-2:15pm",
    ],
  },
];

// Attendance Types
export type AttendanceStatus = "P" | "A" | "T"; // Present, Absent, Teacher Absent
export type AttendanceRecord = Record<string, Record<number, AttendanceStatus>>; // "YYYY-MM-DD" -> { 0: "P", 1: "A" }

const dataDir = path.join(os.homedir(), ".config", "attendthat");

// Ensure directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const FILES = {
  SUBJECTS: path.join(dataDir, "subjects.json"),
  SCHEDULE: path.join(dataDir, "schedule.json"),
  MASTER: path.join(dataDir, "master.csv"),
  TIMETABLE_PRESETS: path.join(dataDir, "timetable-presets.json"),
};

function atomicWriteSync(filePath: string, content: string): void {
  const tempPath = `${filePath}.tmp`;
  fs.writeFileSync(tempPath, content, "utf-8");
  fs.renameSync(tempPath, filePath);
}

async function atomicWrite(filePath: string, content: string): Promise<void> {
  const tempPath = `${filePath}.tmp`;
  await Bun.write(tempPath, content);
  await Bun.write(filePath, await Bun.file(tempPath).text());
  try {
    await Bun.write(tempPath, "");
  } catch {}
}

interface AppContextType {
  subjects: Subject[];
  schedule: Schedule;
  attendance: AttendanceRecord;
  timetablePresets: TimetablePreset[];
  addSubject: (name: string, code: string) => void;
  removeSubject: (id: string | undefined) => void;
  updateSubjectNameCode: (id: string, name: string, code: string) => void;
  updateSubject: (
    id: string,
    updates: Partial<
      Pick<Subject, "color" | "credits" | "room" | "instructor">
    >,
  ) => void;
  updateSchedule: (day: string, slotIndex: number, subjectId: string) => void;
  resetSchedule: () => void;
  markAttendance: (
    date: string,
    slotIndex: number,
    status: AttendanceStatus,
  ) => void;
  getSubjectStats: (subjectId: string) => {
    total: number;
    present: number;
    percentage: number;
    buffer: number;
    lag: number;
  };
  addTimetablePreset: (preset: TimetablePreset) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [schedule, setSchedule] = useState<Schedule>(() => {
    const init: Schedule = {};
    DAYS.forEach((d) => (init[d] = Array(8).fill("FREE")));
    return init;
  });
  const [attendance, setAttendance] = useState<AttendanceRecord>({});
  const [timetablePresets, setTimetablePresets] =
    useState<TimetablePreset[]>(DEFAULT_PRESETS);

  // --- Load Data ---
  useEffect(() => {
    async function load() {
      const subFile = Bun.file(FILES.SUBJECTS);
      if (await subFile.exists()) {
        const loadedSubjects: Subject[] = await subFile.json();
        // Migrate subjects to include new fields with defaults
        const migratedSubjects = loadedSubjects.map((s) => ({
          ...s,
          color: s.color ?? "cyan",
          credits: s.credits ?? "",
          room: s.room ?? "",
          instructor: s.instructor ?? "",
        }));
        setSubjects(migratedSubjects);
      }

      const schedFile = Bun.file(FILES.SCHEDULE);
      if (await schedFile.exists()) {
        const scheduleFile = await schedFile.json();
        setSchedule((prev) => ({
          ...prev,
          ...scheduleFile,
        }));

        // Parse that Attendance
        const csvFile = Bun.file(FILES.MASTER);
        if (await csvFile.exists()) {
          const text = await csvFile.text();
          const records: AttendanceRecord = {};
          text.split("\n").forEach((line) => {
            if (!line.trim()) return;
            const [date, slotStr, , status] = line.split(","); // date,slot,subId,status
            // Skip invalid (gotta get rid of red squiggles)
            if (!date || !slotStr || !status) return;
            if (!records[date]) records[date] = {};
            records[date][parseInt(slotStr)] = status as AttendanceStatus;
          });
          setAttendance(records);
        }
      }

      // Load timetable presets
      const presetsFile = Bun.file(FILES.TIMETABLE_PRESETS);
      if (await presetsFile.exists()) {
        const loadedPresets: TimetablePreset[] = await presetsFile.json();
        if (Array.isArray(loadedPresets) && loadedPresets.length > 0) {
          setTimetablePresets(loadedPresets);
        }
      }
    }
    load();
  }, []);

  const addSubject = (name: string, code: string) => {
    const newSubject: Subject = {
      id: crypto.randomUUID(),
      name,
      code,
      color: "cyan",
      credits: "",
      room: "",
      instructor: "",
    };
    setSubjects((prev) => [...prev, newSubject]);
    atomicWriteSync(
      FILES.SUBJECTS,
      JSON.stringify([...subjects, newSubject], null, 2),
    );
  };

  const removeSubject = (id: string | undefined) => {
    if (!id) return;
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    atomicWriteSync(
      FILES.SUBJECTS,
      JSON.stringify([...subjects.filter((s) => s.id !== id)], null, 2),
    );
  };

  const updateSubject = (
    id: string,
    updates: Partial<
      Pick<Subject, "color" | "credits" | "room" | "instructor">
    >,
  ) => {
    setSubjects((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...updates } : s));
      atomicWriteSync(FILES.SUBJECTS, JSON.stringify(next, null, 2));
      return next;
    });
  };

  const updateSubjectNameCode = (id: string, name: string, code: string) => {
    setSubjects((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, name, code } : s));
      atomicWriteSync(FILES.SUBJECTS, JSON.stringify(next, null, 2));
      return next;
    });
  };

  const updateSchedule = (
    day: string,
    slotIndex: number,
    subjectId: string,
  ) => {
    setSchedule((prev) => {
      const next = { ...prev, [day]: [...(prev[day] || [])] };
      if (!next[day]) next[day] = Array(8).fill("FREE");
      next[day][slotIndex] = subjectId;
      atomicWriteSync(FILES.SCHEDULE, JSON.stringify(next, null, 2));
      return next;
    });
  };
  const resetSchedule = () => {
    const init: Schedule = {};
    DAYS.forEach((d) => (init[d] = Array(8).fill("FREE")));
    setSchedule(init);
    atomicWriteSync(FILES.SCHEDULE, JSON.stringify(init, null, 2));
  };

  const markAttendance = (
    date: string,
    slotIndex: number,
    status: AttendanceStatus,
  ) => {
    setAttendance((prev) => {
      const next = { ...prev };

      const updatedDayRecord = { ...(next[date] || {}) };
      updatedDayRecord[slotIndex] = status;
      next[date] = updatedDayRecord;

      saveAttendanceToDisk(next);

      return next;
    });
  };

  const saveAttendanceToDisk = async (data: AttendanceRecord) => {
    let csv = "";

    Object.entries(data).forEach(([date, slots]) => {
      const d = new Date(date);
      const dayIndex = d.getDay() - 1;
      const dayName = dayIndex >= 0 && dayIndex < 5 ? DAYS[dayIndex] : null;

      Object.entries(slots).forEach(([slotStr, status]) => {
        const slot = parseInt(slotStr);

        let realSubjectId = "UNKNOWN";
        if (dayName && schedule[dayName] && schedule[dayName][slot]) {
          realSubjectId = schedule[dayName][slot];
        }

        csv += `${date},${slot},${realSubjectId},${status}\n`;
      });
    });

    await atomicWrite(FILES.MASTER, csv);
  };

  const getSubjectStats = (subjectId: string) => {
    let total = 0;
    let present = 0;

    // Iterate all attendance records
    // Note: This is O(N) where N is total days recorded.
    // For a personal app, this is instant.
    Object.entries(attendance).forEach(([date, slots]) => {
      // Find which subject was scheduled on this day?
      // We need to know the Day of Week for this date.
      const d = new Date(date);
      const dayName = DAYS[d.getDay() - 1]; // getDay: 0=Sun, 1=Mon...

      if (!dayName || !schedule[dayName]) return; // Weekend or invalid

      Object.entries(slots).forEach(([slotIdx, status]) => {
        if (!schedule[dayName]) return;
        const scheduledSub = schedule[dayName][parseInt(slotIdx)];

        // Only count if this specific subject was scheduled here
        if (scheduledSub === subjectId) {
          if (status === "P") {
            present++;
            total++;
          } else if (status === "A") {
            total++;
          }
          // 'T' (Teacher Absent) is ignored for both
        }
      });
    });

    const percentage = total === 0 ? 0 : (present / total) * 100;

    // Buffer Calculation (Target 75%)
    // Formula: (P + x) / (T + x) >= 0.75  => x is buffer classes to bunk? NO.
    // Buffer = How many classes can I MISS?
    // Formula: P / (T + x) >= 0.75  =>  P >= 0.75T + 0.75x  =>  0.75x <= P - 0.75T
    const bufferRaw = present / 0.75 - total;
    const buffer = Math.floor(bufferRaw); // If positive, can bunk this many.

    // Lag Calculation (Need to attend)
    // Formula: (P + x) / (T + x) >= 0.75
    // x >= 3T - 4P
    const lagRaw = 3 * total - 4 * present;
    const lag = Math.max(0, Math.ceil(lagRaw));

    return {
      total,
      present,
      percentage,
      buffer: buffer > 0 ? buffer : 0,
      lag: buffer < 0 ? lag : 0,
    };
  };

  const addTimetablePreset = (preset: TimetablePreset) => {
    const next = [...timetablePresets, preset];
    setTimetablePresets(next);
    atomicWriteSync(FILES.TIMETABLE_PRESETS, JSON.stringify(next, null, 2));
  };

  return (
    <AppContext.Provider
      value={{
        subjects,
        schedule,
        attendance,
        timetablePresets,
        addSubject,
        removeSubject,
        updateSubject,
        updateSubjectNameCode,
        updateSchedule,
        resetSchedule,
        markAttendance,
        getSubjectStats,
        addTimetablePreset,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
