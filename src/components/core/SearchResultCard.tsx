import { User, Phone, CreditCard, Clock, Copy, MonitorCog } from "lucide-react";
import { displayTime } from "@/utils/time";
import { Card, CardContent } from "../ui/card";
import HighlightText from "../ui/highlight";
import { Button } from "../ui/button";
import { SearchResultBill } from "@/types/bill";
import { useSystemState } from "@/hooks/useSystem";
import { useMemo, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  searchQuery: string;
  bill: SearchResultBill;
  onCancel?: (bill: SearchResultBill) => void;
}

export default function SearchResultCard({
  bill,
  searchQuery,
  onCancel,
}: Props) {
  const system = useSystemState();
  const [showCopied, setShowCopied] = useState(false);

  const copyToClipboard = () => {
    try {
      // Create temporary input
      const tempInput = document.createElement("input");
      tempInput.style.position = "fixed";
      tempInput.style.opacity = "0";
      tempInput.value = bill.orderNo;
      document.body.appendChild(tempInput);

      // Select the text
      tempInput.focus();
      tempInput.select();

      // Copy the text
      const successful = document.execCommand("copy");

      // Remove the temporary input
      document.body.removeChild(tempInput);

      if (successful) {
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const canCancel = useMemo(() => {
    if (system.status != "loaded") return false;
    if (bill.counterId != system.counter.id) return false;
    if (Date.now() - bill.startTime.getTime() > 5 * 60 * 1000) return false;
    return true;
  }, [system, bill]);

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-stretch justify-between">
          <div className="flex-1 flex flex-col space-y-3">
            <div className="text-xl">
              <Popover open={showCopied}>
                <PopoverTrigger asChild>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center bg-white"
                  >
                    <span className="mr-2">
                      <HighlightText
                        text={"#" + bill.orderNo}
                        query={searchQuery}
                      />
                    </span>
                    <Copy className="h-4 w-4 text-muted-foreground" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="bg-green-500 text-white border-none py-1 px-3 w-auto">
                  <p className="text-sm font-medium">Copied!</p>
                </PopoverContent>
              </Popover>
            </div>
            <div className="text-2xl font-medium">{bill.service.title}</div>
            <div className="flex space-x-5">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <HighlightText text={bill.customerName} query={searchQuery} />
              </div>
              {bill.customerPhone ? (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <HighlightText
                    text={bill.customerPhone}
                    query={searchQuery}
                  />
                </div>
              ) : null}
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{displayTime(bill.startTime)}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end justify-between">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              <span className="uppercase">{bill.paymentMethod}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MonitorCog className="w-4 h-4 text-muted-foreground" />
              <span className="uppercase">{bill.customerName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">
                AED {(bill.paidAmount ?? 0).toFixed(2)}
              </span>
            </div>
            {canCancel ? (
              <div className="mt-3">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onCancel && onCancel(bill)}
                >
                  Cancel Bill
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
