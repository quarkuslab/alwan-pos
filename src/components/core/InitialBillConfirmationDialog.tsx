import { Dialog, DialogTitle } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "../ui/dialog";
import { useCallback, useMemo } from "react";
import { CreateInitialBillData } from "@/services/bill.service";
import { Card, CardContent } from "../ui/card";
import {
  Banknote,
  ClipboardList,
  Clock,
  CreditCard,
  Phone,
  User,
} from "lucide-react";
import { displayAmount } from "@/utils/amount";
import { Button } from "../ui/button";
import { displayTime } from "@/utils/time";

interface Props {
  data: CreateInitialBillData | null;
  onClose: () => void;
  onConfirm: (data: CreateInitialBillData) => void;
}

export default function InitialBillConfirmationDialog({
  data,
  onClose,
  onConfirm,
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

  const handleConfirm = useCallback(() => {
    if (data) {
      onConfirm(data);
    }
  }, [onConfirm, data]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Confirm Billing Details</DialogTitle>
          <DialogDescription>
            Please review the billing information below
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Customer Information */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">
                    {data?.customerName}
                  </span>
                </div>
                {data?.customerPhone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{data?.customerPhone}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Service Details */}
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-medium mb-2">Service Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Service:</span>
                  <span className="font-medium">{data?.service.title}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Price per Hour:</span>
                  <span>{displayAmount(data?.service.pricePerHour || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Advance Amount:</span>
                  <span>{displayAmount(data?.service.advanceAmount || 0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  {data?.paymentMethod === "card" ? (
                    <CreditCard className="w-4 h-4 text-gray-500" />
                  ) : (
                    <Banknote className="w-4 h-4 text-gray-500" />
                  )}
                  <span className="text-sm capitalize">
                    {data?.paymentMethod}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    {displayTime(data?.time || new Date())}
                  </span>
                </div>
                {data?.remarks && (
                  <div className="flex items-center space-x-2">
                    <ClipboardList className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{data?.remarks}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm Billing</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
