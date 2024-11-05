import { MoveLeft } from "lucide-react";
import IconButton from "./IconButton";
import { useNavigate } from "react-router";
import { useCanGoBack } from "@/hooks/useSystemNavigate";

export default function HeaderBackButton() {
  const navigate = useNavigate();
  const showBackButton = useCanGoBack();
  function handleClick() {
    navigate(-1);
  }

  if (showBackButton) {
    return (
      <div className="mr-[6.5rem]">
        <IconButton icon={MoveLeft} onClick={handleClick} />
      </div>
    );
  }

  return null;
}
