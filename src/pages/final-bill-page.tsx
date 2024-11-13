import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useQueryState } from "nuqs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Clock,
  ArrowRight,
  RefreshCcw,
  Gift,
  X,
  Check,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { BillService } from "@/services/bill.service";
import { useSystemState } from "@/hooks/useSystem";
import { isAxiosError } from "axios";
import { formatAmount } from "@/utils/amount";
import {
  useCancelBillOperation,
  useCompleteBillOperation,
} from "@/hooks/useOperations";
import useTime from "@/hooks/useTime";
import { FinalPageResult, InitialBill } from "@/types/bill";

interface PageError {
  type: "not_found" | "error";
  message: string;
}

export default function FinalBillPage() {
  const time = useTime();
  const system = useSystemState();
  const cancelBill = useCancelBillOperation();
  const completeBill = useCompleteBillOperation();
  const [orderNo, setOrderNo] = useQueryState("orderNo", { defaultValue: "" });
  const [manualOrderNo, setManualOrderNo] = useState("");
  const [billData, setBillData] = useState<FinalPageResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<PageError | null>(null);
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  const billCalculation = useMemo(() => {
    if (!billData) return null;
    let now = time;
    if (billData.status == "completed" && billData.final) {
      now = billData.final.endTime;
    }
    const startTime = billData.startTime;
    const durationMs = now.getTime() - startTime.getTime();
    const durationMinutes = Math.floor(durationMs / (1000 * 60));

    let billableHours = 0;
    const isCancellable = durationMinutes <= 5;

    if (durationMinutes > 5) {
      billableHours = 1;

      const remainingMinutes = durationMinutes - 60;
      if (remainingMinutes > 0) {
        const additionalHours = Math.floor(remainingMinutes / 60);
        const extraMinutes = remainingMinutes % 60;
        billableHours +=
          extraMinutes <= 15 ? additionalHours : additionalHours + 1;
      }
    }

    const hourlyRate = billData.service.pricePerHour;
    const totalAmount = billableHours * hourlyRate * billData.quantity;
    const maximumCuttoff =
      billData.service.fulldayAdvanceAmount * billData.quantity;

    // Subtract discount from balance amount
    let balanceAmount = Math.max(
      0,
      billData.paidAmount - totalAmount + discountAmount
    );

    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    const usageDuration = `${hours}h ${minutes}m`;

    if (totalAmount > maximumCuttoff) {
      balanceAmount = billData.paidAmount - maximumCuttoff;
    }

    return {
      usageDuration,
      totalAmount,
      balanceAmount,
      billableHours,
      isCancellable,
    };
  }, [time, billData, discountAmount]);

  const fetchBillDetails = useCallback(async () => {
    if (system.status !== "loaded" || !orderNo) return;

    setLoading(true);
    setError(null);
    try {
      const data = await BillService.getBillData(system.token, orderNo);
      setBillData(data);
    } catch (err) {
      // Assuming your API throws with response property for fetch errors
      if (isAxiosError(err)) {
        if (err.response?.status == 404) {
          setError({
            type: "not_found",
            message: "Bill not found with the provided order number.",
          });
          return;
        }
      }
      setError({
        type: "error",
        message: "Failed to fetch bill details. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [orderNo, system]);

  useEffect(() => {
    fetchBillDetails();
  }, [orderNo, system, fetchBillDetails]);

  useEffect(() => {
    setDiscountAmount(0);
    setShowDiscountInput(false);
  }, [billData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualOrderNo.trim()) {
      setOrderNo(manualOrderNo.trim());
    }
  };

  const handleCompleteBill = useCallback(async () => {
    if (!billData || !billCalculation || system.status !== "loaded") return;
    await completeBill({
      balanceAmount: billCalculation.balanceAmount,
      billedHours: billCalculation.billableHours,
      orderNo: billData.orderNo,
      endTime: time,
      discountAmount: discountAmount, // Add discount amount to the complete bill payload
    });
    await fetchBillDetails();
  }, [
    time,
    billCalculation,
    billData,
    system,
    completeBill,
    fetchBillDetails,
    discountAmount,
  ]);

  const handleDiscountSave = () => {
    setShowDiscountInput(false);
  };

  const handleDiscountCancel = () => {
    setDiscountAmount(0);
    setShowDiscountInput(false);
  };

  const handleCancelBill = useCallback(async () => {
    if (!billData) return;
    await cancelBill(billData.id);
    await fetchBillDetails();
  }, [billData, cancelBill, fetchBillDetails]);

  const canAddDiscount = useMemo(() => {
    if (system.status != "loaded") return false;
    if (billCalculation?.isCancellable) return false;
    return true;
  }, [system, billCalculation]);

  const getStatusColor = (status: InitialBill["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      case "completed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!orderNo) {
    return (
      <div className="h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="container mx-auto p-4 max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>Enter Order Number</CardTitle>
              <CardDescription>
                Please provide your order number to view the bill details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="flex">
                  <Input
                    value={manualOrderNo}
                    onChange={(e) => setManualOrderNo(e.target.value)}
                    placeholder="Enter order number"
                    className="flex-1 mr-2"
                  />
                  <Button type="submit">View Bill</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="container mx-auto p-4 max-w-md">
          <Alert variant="destructive">
            <AlertTitle>
              {error.type === "not_found" ? "Bill Not Found" : "Error"}
            </AlertTitle>
            <AlertDescription className="mt-2">
              <p>{error.message}</p>
              {error.type === "error" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchBillDetails}
                  className="mt-2"
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              )}
            </AlertDescription>
          </Alert>
          {error.type === "not_found" && (
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => setOrderNo("")}
            >
              Enter Different Order Number
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (!billData || !billCalculation || system.status !== "loaded") {
    return null;
  }

  const renderPaymentDetails = () => {
    if (billData.status === "cancelled") {
      return (
        <div className="space-y-2">
          <div className="flex justify-between items-center pt-2 border-t font-bold text-lg">
            <span>Amount Paid</span>
            <span>{formatAmount(billData.paidAmount)}</span>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span>Unit Price (per hour)</span>
          <span>{formatAmount(billData.service.pricePerHour)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Quantity</span>
          <span>x {billData.quantity}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Hours</span>
          <span>x {billCalculation.billableHours}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t">
          <span>Total Usage Amount</span>
          <span>{formatAmount(billCalculation.totalAmount)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Advance Paid</span>
          <span>{formatAmount(billData.paidAmount)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between items-center text-red-600">
            <span>Discount Applied</span>
            <span>+ {formatAmount(discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between items-center pt-2 border-t font-bold text-lg">
          {billData.status === "completed" ? (
            <>
              <span>Returned Amount</span>
              <span className="text-green-600">
                {formatAmount(billData.final?.balanceAmount || 0)}
              </span>
            </>
          ) : (
            <>
              <span>Balance to Return</span>
              <span className="text-green-600">
                {formatAmount(billCalculation.balanceAmount)}
              </span>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Final Bill</CardTitle>
              <CardDescription>Order #{billData.orderNo}</CardDescription>
            </div>
            <Badge className={getStatusColor(billData.status)}>
              {billData.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2">
            <div className="mb-4 pr-4">
              <h3 className="text-sm font-medium text-gray-500">
                Customer Name
              </h3>
              <p className="mt-1">{billData.customerName}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">Phone</h3>
              <p className="mt-1">{billData.customerPhone || "N/A"}</p>
            </div>
            <div className="mb-4 pr-4">
              <h3 className="text-sm font-medium text-gray-500">Service</h3>
              <p className="mt-1">{billData.service.title}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">Counter</h3>
              <p className="mt-1">{billData.counter.name}</p>
            </div>
            <div className="mb-4 pr-4">
              <h3 className="text-sm font-medium text-gray-500">Quantity</h3>
              <p className="mt-1">{billData.quantity}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">Rate/Hour</h3>
              <p className="mt-1">
                {formatAmount(billData.service.pricePerHour)}
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium text-gray-500">
                  Start Time
                </span>
              </div>
              <span>{new Date(billData.startTime).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ArrowRight className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium text-gray-500">
                  Duration
                </span>
              </div>
              <span>
                {billCalculation.usageDuration} ({billCalculation.billableHours}{" "}
                billable hours)
              </span>
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Payment Details</h3>
              <Badge variant="outline">{billData.paymentMethod}</Badge>
            </div>
            {renderPaymentDetails()}
          </div>
        </CardContent>
        {billData.status === "pending" && (
          <CardFooter className="flex justify-between">
            <div className="flex items-center gap-4">
              {canAddDiscount ? (
                showDiscountInput ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={discountAmount}
                      onChange={(e) =>
                        setDiscountAmount(Number(e.target.value))
                      }
                      placeholder="Enter discount amount"
                      className="w-40"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleDiscountSave}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleDiscountCancel}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDiscountInput(true)}
                  >
                    <Gift className="h-4 w-4 mr-2" />
                    Add Discount
                  </Button>
                )
              ) : null}
            </div>
            <div>
              {billCalculation.isCancellable ? (
                <Button variant="destructive" onClick={handleCancelBill}>
                  Cancel Bill
                </Button>
              ) : (
                <Button onClick={handleCompleteBill}>Complete Bill</Button>
              )}
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
