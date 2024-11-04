import InitialBillConfirmationDialog from "@/components/core/InitialBillConfirmationDialog";
import InitialBillForm from "@/components/forms/InitialBillForm";
import { useCounterState } from "@/hooks/useCounter";
import { CreateInitialBillData } from "@/services/bill.service";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

export default function InitialBillPage() {
  const [data, setData] = useState<CreateInitialBillData | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const counter = useCounterState();
  const params = useParams();

  useEffect(() => {
    if (!location.pathname.includes("confirm")) {
      setData(null);
    }
  }, [location]);

  const service = useMemo(() => {
    if (counter.status == "loaded") {
      return counter.services.find((service) => service.id == params.service);
    }
  }, [counter, params]);

  const handleSubmit = useCallback(
    (data: CreateInitialBillData) => {
      navigate("confirm");
      setData(data);
    },
    [navigate]
  );

  const closeConfirmationDialog = useCallback(() => {
    if (location.pathname.includes("confirm")) {
      navigate(-1);
    }
  }, [location, navigate]);

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
        onClose={closeConfirmationDialog}
        onConfirm={createInitialBill}
      />
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center">
        <InitialBillForm service={service} onSubmit={handleSubmit} />
      </div>
    </Fragment>
  );
}
