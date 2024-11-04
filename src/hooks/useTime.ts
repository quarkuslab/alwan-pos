import { TimeContext } from "@/providers/TimeProvider";
import { useContext } from "react";

export default function useTime() {
  return useContext(TimeContext)
}