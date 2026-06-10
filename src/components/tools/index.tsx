"use client";

import type { ToolId } from "@/lib/types";
import { CalendarExplorer } from "./CalendarExplorer";
import { CycleExplorer } from "./CycleExplorer";
import { SocWindowTool } from "./SocWindowTool";
import { V2GDispatch } from "./V2GDispatch";
import { ArrheniusTool } from "./ArrheniusTool";
import { MechanismDiagram } from "./MechanismDiagram";

export function ToolHost({ tool }: { tool: ToolId }) {
  switch (tool) {
    case "calendar-explorer":
      return <CalendarExplorer />;
    case "cycle-explorer":
      return <CycleExplorer />;
    case "soc-window":
      return <SocWindowTool />;
    case "v2g-dispatch":
      return <V2GDispatch />;
    case "arrhenius":
      return <ArrheniusTool />;
    case "mechanism-diagram":
      return <MechanismDiagram />;
    default:
      return null;
  }
}
