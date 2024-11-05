import useSystemNavigate from "@/hooks/useSystemNavigate";
import { cn } from "@/lib/utils";
import { MouseEvent, useRef } from "react";
import { useLocation } from "react-router-dom";

interface Props {
  label: string;
  href: string;
}

export default function SidebarButton(props: Props) {
  const location = useLocation();
  const isActive = location.pathname.includes(props.href);
  const navigate = useSystemNavigate();
  const buttonRef = useRef<HTMLButtonElement>(null);

  function handleClick(e: MouseEvent) {
    e.preventDefault();
    navigate(props.href);
    if (buttonRef.current) {
      buttonRef.current.blur();
    }
  }

  return (
    <button
      className={cn(
        "w-full h-full min-h-14 grid place-content-center rounded-md bg-primary-200 text-xl font-medium",
        isActive && "bg-primary-950 hover:bg-primary-950 text-white"
      )}
      ref={buttonRef}
      onClick={handleClick}
    >
      {props.label}
    </button>
  );
}
