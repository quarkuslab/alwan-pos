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
    <div>
      <div>Initial Bill</div>
      <div>{service.title}</div>
    </div>
  );
}
