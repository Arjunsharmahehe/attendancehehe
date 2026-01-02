import { useKeyboard } from "@opentui/react";
import { useState } from "react";
import { SubjectsPage } from "./pages/subjects";
import { SchedulePage } from "./pages/settings";
import { DashboardPage } from "./pages/dashboard";
import { TextAttributes } from "@opentui/core";
import { CustomizePage } from "./pages/customize";

export type View = "dashboard" | "timetable" | "subjects" | "customize";

export function MainApp() {
    const [activeView, setActiveView] = useState<View>("dashboard");

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
    });

    return (
        <box
            alignItems="center"
            justifyContent="center"
            flexGrow={1}
            flexDirection="column"
            backgroundColor={"black"}
        >
            <box flexDirection="row" alignItems="center" justifyContent="center" gap={2} position="absolute" top={2}>
                {["Dashboard", "Subjects", "Timetable", "Customize"].map((label) => (
                    <text key={label} attributes={label.toLowerCase() == activeView ? TextAttributes.BOLD : TextAttributes.DIM}>
                        {label}
                    </text>
                ))}
            </box>
            {activeView == "subjects" && <SubjectsPage />}
            {activeView == "timetable" && <SchedulePage />}
            {activeView == "dashboard" && <DashboardPage />}
            {activeView == "customize" && <CustomizePage />}
        </box>
    );
}
