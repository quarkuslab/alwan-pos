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
import { Loader2, Clock, ArrowRight, RefreshCcw } from "lucide-react";
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
import { InitialBill, SearchResultBill } from "@/types/bill";

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
  const [billData, setBillData] = useState<SearchResultBill | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<PageError | null>(null);

  const billCalculation = useMemo(() => {
    if (!billData) return null;
    const startTime = billData.startTime;
    const durationMs = time.getTime() - startTime.getTime();
    const durationMinutes = Math.floor(durationMs / (1000 * 60));

    // Calculate billable hours with corrected 15-minute rule
    // When minutes > 15, round up to next hour
    const hours = Math.floor(durationMinutes / 60);
    const extraMinutes = durationMinutes % 60;
    const billableHours = extraMinutes <= 15 ? hours : hours + 1;

    // Calculate total amount considering quantity
    const hourlyRate = billData.service.pricePerHour;
    const totalAmount = billableHours * hourlyRate * billData.quantity;

    // Calculate balance amount (amount to return to customer)
    const balanceAmount = Math.max(0, billData.paidAmount - totalAmount);

    // Format duration string
    const usageDuration = `${hours}h ${extraMinutes}m`;

    return {
      usageDuration,
      totalAmount,
      balanceAmount,
      billableHours,
    };
  }, [time, billData]);

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
    });
    await fetchBillDetails();
  }, [time, billCalculation, billData, system, completeBill, fetchBillDetails]);

  const handleCancelBill = useCallback(async () => {
    if (!billData) return;
    await cancelBill(billData.id);
    await fetchBillDetails();
  }, [billData, cancelBill, fetchBillDetails]);

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
              <p className="mt-1">{system.counter.name}</p>
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
              <div className="flex justify-between items-center pt-2 border-t font-bold text-lg">
                <span>Balance to Return</span>
                <span className="text-green-600">
                  {formatAmount(billCalculation.balanceAmount)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        {billData.status == "pending" ? (
          <CardFooter className="flex justify-end">
            {billCalculation.billableHours > 0 ? (
              <Button onClick={handleCompleteBill}>Complete Bill</Button>
            ) : (
              <Button variant="destructive" onClick={handleCancelBill}>
                Cancel Bill
              </Button>
            )}
          </CardFooter>
        ) : null}
      </Card>
    </div>
  );
}
