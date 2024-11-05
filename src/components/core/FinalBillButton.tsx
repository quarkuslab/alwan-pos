import { cn } from "@/lib/utils";
import { ReceiptText } from "lucide-react";
import { useRef, MouseEvent } from "react";
import { useLocation, useNavigate } from "react-router";

interface Props {
  href: string;
}

export default function FinalBillButton(props: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname.includes(props.href);
  const shouldReplace =
    location.pathname.includes("initial-bill") ||
    location.pathname.includes("search") ||
    location.pathname.includes("settings");
  const buttonRef = useRef<HTMLButtonElement>(null);

  function handleClick(e: MouseEvent) {
    e.preventDefault();
    navigate(props.href, { replace: shouldReplace });
    if (buttonRef.current) {
      buttonRef.current.blur();
    }
  }

  return (
    <button
      className={cn(
        "h-12 flex items-center justify-center px-6 rounded-md bg-primary-200",
        isActive && "bg-primary-950 text-white"
      )}
      ref={buttonRef}
      onClick={handleClick}
    >
      <ReceiptText />
      <span className="ml-3 font-medium">Final Bill</span>
    </button>
  );
}
