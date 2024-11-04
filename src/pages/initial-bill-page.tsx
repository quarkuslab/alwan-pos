import InitialBillConfirmationDialog from "@/components/core/InitialBillConfirmationDialog";
import InitialBillForm from "@/components/forms/InitialBillForm";
import { useCounterState } from "@/hooks/useCounter";
import { CreateInitialBillData } from "@/services/bill.service";
import { Fragment, useCallback, useMemo, useState } from "react";
import { useParams } from "react-router";

export default function InitialBillPage() {
  const [data, setData] = useState<CreateInitialBillData | null>(null);
  const counter = useCounterState();
  const params = useParams();

  const service = useMemo(() => {
    if (counter.status == "loaded") {
      return counter.services.find((service) => service.id == params.service);
    }
  }, [counter, params]);

  const createInitialBill = useCallback(async (data: CreateInitialBillData) => {
    console.log(data);
  }, []);

  if (!service) {
    return null;
  }

  return (
    <Fragment>
      <InitialBillConfirmationDialog
        data={data}
        onClose={() => setData(null)}
        onConfirm={createInitialBill}
      />
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center">
        <InitialBillForm service={service} onSubmit={setData} />
      </div>
    </Fragment>
  );
}
