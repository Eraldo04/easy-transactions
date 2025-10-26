import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import type { LayoutPropsTypes } from "./types";

const Layout: React.FC<LayoutPropsTypes> = ({ children }) => {
  return (
    <div className="flex flex-row h-screen relative">
      <Sidebar />
      <div
        className="relative flex-1 h-full overflow-y-auto"
        style={{
          scrollbarGutter: "stable",
        }}
      >
        <Topbar />
        <main className="relative pb-4 min-h-[calc(100%-48px)] flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
