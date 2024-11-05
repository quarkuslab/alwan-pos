import useBarcodeHandle from "@/hooks/useBarcodeHandle";
import useOnMount from "@/hooks/useOnMount";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function RootLayout() {
  const navigate = useNavigate();
  const location = useLocation();
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
      let replace = false;
      if (location.pathname.includes("/app/final-bill")) {
        replace = true;
      }
      navigate(`/app/final-bill?barcode=${barcode}`, { replace });
    },
  });

  return <Outlet />;
}
