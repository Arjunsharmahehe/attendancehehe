#!/usr/bin/env node

import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { MainApp } from "./app";
import { AppProvider } from "./context/app-context";

function Layout() {
    return (
        <AppProvider>
            <MainApp />
        </AppProvider>
    );
}

const renderer = await createCliRenderer();
createRoot(renderer).render(<Layout />);
