import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

interface Props {
  label: string;
  href: string;
}

export default function SidebarButton(props: Props) {
  const location = useLocation();
  const isActive = location.pathname.includes(props.href);

  return (
    <Link
      to={props.href}
      className={cn(
        "w-full h-full max-h-40 grid place-content-center rounded-md bg-primary-200 hover:bg-primary-300 text-xl font-medium",
        isActive && "bg-primary-950 hover:bg-primary-950 text-white"
      )}
    >
      {props.label}
    </Link>
  );
}
