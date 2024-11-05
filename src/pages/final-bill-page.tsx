import { useQueryState } from "nuqs";

export default function FinalBillPage() {
  const [barcode] = useQueryState("barcode", { defaultValue: "" });
  return <div>Final Bill {barcode}</div>;
}
