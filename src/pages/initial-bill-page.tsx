import InitialBillConfirmationDialog from "@/components/core/InitialBillConfirmationDialog";
import InitialBillForm from "@/components/forms/InitialBillForm";
import { useCreateInitialBillOperation } from "@/hooks/useOperations";
import { useSystemState } from "@/hooks/useSystem";
import { CreateInitialBillRequest } from "@/types/bill";
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
  const [data, setData] = useState<CreateInitialBillRequest | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const system = useSystemState();
  const params = useParams();
  const createInitialBill = useCreateInitialBillOperation();
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
    (data: CreateInitialBillRequest) => {
      navigate("confirm");
      setData(data);
    },
    [navigate]
  );

  const handleConfirm = useCallback(
    async (data: CreateInitialBillRequest) => {
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
        service={service}
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
