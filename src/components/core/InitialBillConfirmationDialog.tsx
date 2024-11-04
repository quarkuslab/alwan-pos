import { Dialog, DialogTitle } from "@radix-ui/react-dialog";
import { DialogContent, DialogDescription, DialogHeader } from "../ui/dialog";
import { useCallback, useMemo } from "react";
import { CreateInitialBillData } from "@/services/bill.service";

interface Props {
  data: CreateInitialBillData | null;
  onClose: () => void;
}

export default function InitialBillConfirmationDialog({
  data,
  onClose,
}: Props) {
  const isOpen = useMemo(() => !!data, [data]);
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open == false) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
