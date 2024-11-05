import { User, Phone, CreditCard, Clock } from "lucide-react";
import { displayTime } from "@/utils/time";
import { SearchResultBill } from "@/services/bill.service";
import { Card, CardContent } from "../ui/card";
import HighlightText from "../ui/highlight";
import { Button } from "../ui/button";

interface Props {
  searchQuery: string;
  bill: SearchResultBill;
  onCancel?: (id: number) => void;
}

export default function SearchResultCard({
  bill,
  searchQuery,
  onCancel,
}: Props) {
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-stretch justify-between">
          <div className="flex-1 flex flex-col space-y-3">
            <div className="text-xl">
              <HighlightText text={"#" + bill.orderNo} query={searchQuery} />
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
                <HighlightText
                  text={displayTime(bill.startTime)}
                  query={searchQuery}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end justify-between">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              <span className="uppercase">{bill.paymentMethod}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">
                AED {(bill.amountPaid ?? 0).toFixed(2)}
              </span>
            </div>
            <div className="mt-3">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onCancel && onCancel(bill.id)}
              >
                Cancel Bill
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
