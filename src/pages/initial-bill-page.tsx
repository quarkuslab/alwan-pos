import InitialBillForm from "@/components/forms/InitialBillForm";
import { useCounterState } from "@/hooks/useCounter";
import { useMemo } from "react";
import { useParams } from "react-router";

export default function InitialBillPage() {
  const counter = useCounterState();
  const params = useParams();

  const service = useMemo(() => {
    if (counter.status == "loaded") {
      return counter.services.find((service) => service.id == params.service);
    }
  }, [counter, params]);

  if (!service) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center">
      <InitialBillForm service={service} />
    </div>
  );
}
