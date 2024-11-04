import { useLocation, useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { MoveLeft, Search, Settings } from "lucide-react";
import useTime from "@/hooks/useTime";
import IconButton from "./IconButton";
import { displayDateWithTime } from "@/utils/time";
import { useSystemState } from "@/hooks/useSystem";

const BACK_BUTTON_CONDITIONS = [
  "advance",
  "settlement",
  "fullday",
  "search",
  "dashboard",
  "settings",
];

export default function Header() {
  const system = useSystemState();
  const time = useTime();
  const location = useLocation();
  const navigate = useNavigate();
  const showBackButton = BACK_BUTTON_CONDITIONS.some((condition) =>
    location.pathname.includes(condition)
  );

  return (
    <header className="fixed left-80 top-0 right-0 h-20 bg-white border-b border-primary-950 flex items-center justify-between px-5">
      {showBackButton ? (
        <div className="mr-10">
          <IconButton icon={MoveLeft} onClick={() => navigate(-1)} />
        </div>
      ) : null}
      <div className="flex-1">
        <div className={cn("flex flex-col items-start justify-center gap-0")}>
          <div className="text-xl font-medium">
            {system.status == "loaded" ? system.counter.name : ""}
          </div>
          <div className="opacity-70 text-sm">{displayDateWithTime(time)}</div>
        </div>
      </div>
      <div className="flex space-x-3">
        <IconButton icon={Search} href="/app/search" />
        <IconButton icon={Settings} href="/app/settings" />
      </div>
    </header>
  );
}
