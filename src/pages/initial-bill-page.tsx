import InitialBillConfirmationDialog from "@/components/core/InitialBillConfirmationDialog";
import InitialBillForm from "@/components/forms/InitialBillForm";
import { useCreateInitialBill } from "@/hooks/useCreateInitialBill";
import { useSystemState } from "@/hooks/useSystem";
import { CreateInitialBillData } from "@/services/bill.service";
import {
  ComponentRef,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate, useParams } from "react-router";

export default function InitialBillPage() {
  const [data, setData] = useState<CreateInitialBillData | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const system = useSystemState();
  const params = useParams();
  const createInitialBill = useCreateInitialBill();
  const formRef = useRef<ComponentRef<typeof InitialBillForm>>(null);

  useEffect(() => {
    if (!location.pathname.includes("confirm")) {
      setData(null);
    }
  }, [location]);

  const service = useMemo(() => {
    if (system.status == "loaded") {
      return system.services.find((service) => service.id == params.service);
    }
  }, [system, params]);

  const handleSubmit = useCallback(
    (data: CreateInitialBillData) => {
      navigate("confirm");
      setData(data);
    },
    [navigate]
  );

  const handleConfirm = useCallback(
    async (data: CreateInitialBillData) => {
      navigate(-1);
      await createInitialBill(data);
      formRef.current?.reset();
    },
    [navigate, createInitialBill]
  );

  const closeConfirmationDialog = useCallback(() => {
    if (location.pathname.includes("confirm")) {
      navigate(-1);
    }
  }, [location, navigate]);

  if (!service) {
    return null;
  }

  return (
    <Fragment>
      <InitialBillConfirmationDialog
        data={data}
        onClose={closeConfirmationDialog}
        onConfirm={handleConfirm}
      />
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center">
        <InitialBillForm
          ref={formRef}
          service={service}
          onSubmit={handleSubmit}
        />
      </div>
    </Fragment>
  );
}
