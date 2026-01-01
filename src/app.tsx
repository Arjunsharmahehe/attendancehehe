import { useKeyboard } from "@opentui/react";
import { useState } from "react";
import { SubjectsPage } from "./pages/subjects";
import { SchedulePage } from "./pages/settings";
import { DashboardPage } from "./pages/dashboard";

export type View = "dashboard" | "settings" | "subjects";

export function MainApp() {
    const [activeView, setActiveView] = useState<View>("dashboard");

    useKeyboard((key) => {
        if (key.name == "tab") {
            setActiveView((prev) => {
                if (prev == "dashboard") return "subjects";
                if (prev == "subjects") return "settings";
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
            backgroundColor={"black"}
        >
            {activeView == "subjects" && <SubjectsPage />}
            {activeView == "settings" && <SchedulePage />}
            {activeView == "dashboard" && <DashboardPage />}
        </box>
    );
}
