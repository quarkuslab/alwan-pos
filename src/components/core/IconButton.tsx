import useSystemNavigate from "@/hooks/useSystemNavigate";
import { cn } from "@/lib/utils";
import { ComponentType, useRef } from "react";
import { useMatch } from "react-router-dom";

interface Props {
  icon: ComponentType;
  href?: string;
  onClick?: () => void;
}

export default function IconButton(props: Props) {
  const match = useMatch(props.href ?? "");
  const navigate = useSystemNavigate();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const defaultStyles =
    "w-12 h-12 bg-primary-200 p-3 rounded-md flex items-center justify-center text-4xl";

  return (
    <button
      className={cn(
        defaultStyles,
        match && "bg-primary-950 hover:bg-primary-950 text-white"
      )}
      onClick={(e) => {
        e.preventDefault();
        if (props.onClick) {
          props.onClick();
        }
        if (props.href) {
          navigate(props.href);
        }
        if (buttonRef.current) {
          buttonRef.current.blur();
        }
      }}
      ref={buttonRef}
    >
      <props.icon />
    </button>
  );
}
