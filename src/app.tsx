import { useKeyboard } from "@opentui/react";
import { useState, useCallback } from "react";
import { SubjectsPage } from "./pages/subjects";
import { SchedulePage } from "./pages/settings";
import { DashboardPage } from "./pages/dashboard";
import { TextAttributes } from "@opentui/core";
import { CustomizePage } from "./pages/customize";
import { TimetableModal } from "./components/timetable-modal";
import { useApp } from "./context/app-context";
import { generateTimetableImage } from "./utils/timetable-renderer";

export type View = "dashboard" | "timetable" | "subjects" | "customize";

export function MainApp() {
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [showTimetableModal, setShowTimetableModal] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<string | null>(null);
  const { subjects, schedule, timetablePresets } = useApp();

  const handleGenerateTimetable = useCallback(
    async (preset: (typeof timetablePresets)[0]) => {
      setGenerationStatus("Generating timetable...");
      setShowTimetableModal(false);

      try {
        const filePath = await generateTimetableImage({
          subjects,
          schedule,
          preset,
        });
        setGenerationStatus(`Saved: ${filePath}`);
      } catch (error) {
        setGenerationStatus(
          `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    },
    [subjects, schedule],
  );

  useKeyboard((key) => {
    if (key.name == "tab") {
      setActiveView((prev) => {
        if (prev == "dashboard") return "subjects";
        if (prev == "subjects") return "timetable";
        if (prev == "timetable") return "customize";
        return "dashboard";
      });
    }
    if (key.name == "q") {
      process.exit(0);
    }
    if (key.name == "g" && key.ctrl) {
      setShowTimetableModal(true);
      setGenerationStatus(null);
      return;
    }
    if (key.name == "escape" && showTimetableModal) {
      setShowTimetableModal(false);
      setGenerationStatus(null);
      return;
    }
  });

  return (
    <box
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
      flexDirection="column"
      backgroundColor={"black"}
    >
      <box
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        gap={2}
        position="absolute"
        top={2}
      >
        {["Dashboard", "Subjects", "Timetable", "Customize"].map((label) => (
          <text
            key={label}
            attributes={
              label.toLowerCase() == activeView
                ? TextAttributes.BOLD
                : TextAttributes.DIM
            }
          >
            {label}
          </text>
        ))}
      </box>
      {activeView == "subjects" && <SubjectsPage />}
      {activeView == "timetable" && <SchedulePage />}
      {activeView == "dashboard" && <DashboardPage />}
      {activeView == "customize" && <CustomizePage />}

      {/* Timetable generation modal */}
      {showTimetableModal && (
        <TimetableModal
          presets={timetablePresets}
          onSelect={handleGenerateTimetable}
          onCancel={() => {
            setShowTimetableModal(false);
            setGenerationStatus(null);
          }}
        />
      )}

      {/* Generation status message */}
      {generationStatus && (
        <box position="absolute" bottom={5} justifyContent="center">
          <text
            fg={generationStatus.startsWith("Error") ? "red" : "green"}
            attributes={TextAttributes.BOLD}
          >
            {generationStatus}
          </text>
        </box>
      )}
    </box>
  );
}
