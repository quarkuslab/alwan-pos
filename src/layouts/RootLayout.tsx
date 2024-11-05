import useBarcodeHandle from "@/hooks/useBarcodeHandle";
import useOnMount from "@/hooks/useOnMount";
import useSystemNavigate from "@/hooks/useSystemNavigate";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  const navigate = useSystemNavigate();
  useOnMount(() => {
    if (document.activeElement) {
      // @ts-expect-error if blur exists then blur ignore error if does not exist
      document.activeElement.blur();
    }
  });
  useBarcodeHandle({
    barcodeLength: 16,
    barcodeTimeout: 100,
    onScan: (barcode) => {
      navigate(`/app/final-bill?barcode=${barcode}`);
    },
  });

  return <Outlet />;
}
