import { cn } from "@/lib/utils";
import { ComponentType } from "react";
import { Link, useMatch } from "react-router-dom";

interface Props {
  icon: ComponentType;
  href?: string;
  onClick?: () => void;
}

export default function IconButton(props: Props) {
  const match = useMatch(props.href ?? "");
  const defaultStyles =
    "w-12 h-12 bg-primary-200 hover:bg-primary-300 p-3 rounded-md flex items-center justify-center text-4xl";

  if (props.href) {
    return (
      <Link
        to={props.href}
        className={cn(
          defaultStyles,
          match && "bg-primary-950 hover:bg-primary-950 text-white"
        )}
      >
        <props.icon />
      </Link>
    );
  }

  if (props.onClick) {
    return (
      <button className={defaultStyles} onClick={props.onClick}>
        <props.icon />
      </button>
    );
  }

  return (
    <div className={defaultStyles}>
      <props.icon />
    </div>
  );
}
