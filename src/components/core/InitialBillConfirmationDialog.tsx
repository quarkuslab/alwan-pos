import { useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Banknote,
  MessageSquare,
  Clock,
  CreditCard,
  Phone,
  User,
  Calculator,
  Timer,
  DollarSign,
} from "lucide-react";
import { CreateInitialBillData } from "@/services/bill.service";

interface Props {
  data: CreateInitialBillData | null;
  onClose: () => void;
  onConfirm: (data: CreateInitialBillData) => void;
}

const BillingConfirmationDialog = ({ data, onClose, onConfirm }: Props) => {
  const isOpen = useMemo(() => !!data, [data]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) onClose();
    },
    [onClose]
  );

  const handleConfirm = useCallback(() => {
    if (data) onConfirm(data);
  }, [onConfirm, data]);

  const displayAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "AED",
    }).format(amount);
  };

  const displayTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(new Date(date));
  };

  const calculateTotal = (data: CreateInitialBillData) => {
    return data.service.advanceAmount * data.quantity;
  };

  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-md mx-auto flex flex-col h-[85vh]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold">
            Billing Confirmation
          </DialogTitle>
          <DialogDescription>
            Please review your billing details below
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-6">
            <Card>
              <CardContent className="space-y-2 pt-5">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span className="text-sm text-muted-foreground">
                    {data.customerName}
                  </span>
                </div>
                {data.customerPhone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    <span className="text-sm text-muted-foreground">
                      {data.customerPhone}
                    </span>
                  </div>
                )}
                {data.remarks && (
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    <span className="text-sm text-muted-foreground">
                      {data.remarks}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-3 pt-5">
                <div className="flex items-center">
                  {data.paymentMethod === "card" ? (
                    <CreditCard className="h-4 w-4 mr-2" />
                  ) : (
                    <Banknote className="h-4 w-4 mr-2" />
                  )}
                  <Badge variant="secondary" className="capitalize">
                    {data.paymentMethod}
                  </Badge>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm text-muted-foreground">
                    {displayTime(data.time)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-3 pt-5">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium">{data.service.title}</span>
                </div>
                <Separator className="my-3" />

                <div className="space-y-3">
                  {!data.isFullday && (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span className="text-sm text-muted-foreground">
                          Hourly Rate
                        </span>
                      </div>
                      <span className="font-medium">
                        {displayAmount(data.service.pricePerHour)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Timer className="h-4 w-4 mr-2" />
                      <span className="text-sm text-muted-foreground">
                        Service Type
                      </span>
                    </div>
                    <Badge variant={data.isFullday ? "default" : "secondary"}>
                      {data.isFullday ? "Full Day" : "Hourly"}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Calculator className="h-4 w-4 mr-2" />
                      <span className="text-sm text-muted-foreground">
                        Quantity
                      </span>
                    </div>
                    <span className="font-medium">{data.quantity} item(s)</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span className="text-sm text-muted-foreground">
                        {data.isFullday ? "Price" : "Advance Amount"}
                      </span>
                    </div>
                    <span className="font-medium">
                      {displayAmount(data.service.advanceAmount)}
                    </span>
                  </div>
                </div>

                <Separator className="my-3" />

                <div className="rounded-lg bg-muted/50 p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Amount</span>
                    <span className="font-semibold text-lg">
                      {displayAmount(calculateTotal(data))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="border-t pt-4 bg-background mt-auto">
          <DialogFooter className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm Billing</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BillingConfirmationDialog;
