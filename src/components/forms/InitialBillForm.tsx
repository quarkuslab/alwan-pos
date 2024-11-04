import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormInput } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import useTime from "@/hooks/useTime";
import { displayTime } from "@/utils/time";
import { Button } from "../ui/button";
import {
  FormSelectionGroup,
  FormSelectionGroupItem,
} from "../ui/form-selection-group";
import { displayAmount } from "@/utils/amount";
import { CircleDollarSign, Clock, CreditCard } from "lucide-react";
import { CounterService } from "@/services/counter.service";
import { CreateInitialBillData } from "@/services/bill.service";

interface Props {
  service: CounterService;
  onSubmit: (data: CreateInitialBillData) => void;
}

const formSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  remarks: z.string().optional(),
  payment: z.enum(["cash", "card"]),
});

export default function InitialBillForm({ service, onSubmit }: Props) {
  const time = useTime();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      remarks: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit({
      customerName: values.name,
      customerPhone: values.phone,
      remarks: values.remarks,
      paymentMethod: values.payment,
      time,
      service,
    });
  }

  return (
    <Form {...form}>
      <form
        className="w-full max-w-2xl space-y-5"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="grid grid-cols-5 space-x-5">
          <div className="col-span-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <FormInput {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Phone</FormLabel>
                  <FormControl>
                    <FormInput {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div>
          <FormField
            control={form.control}
            name="remarks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Remarks</FormLabel>
                <FormControl>
                  <Textarea className="resize-none h-20" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-end justify-between space-x-5">
          <div>
            <FormField
              control={form.control}
              name="payment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment</FormLabel>
                  <FormControl>
                    <FormSelectionGroup
                      type="single"
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormSelectionGroupItem value="cash">
                        <CircleDollarSign />
                        <span className="ml-3">Cash</span>
                      </FormSelectionGroupItem>
                      <FormSelectionGroupItem value="card">
                        <CreditCard />
                        <span className="ml-3">Card</span>
                      </FormSelectionGroupItem>
                    </FormSelectionGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center justify-center space-x-3 bg-white px-5 py-2 border border-primary-950 rounded-md">
            <Clock />
            <span className="text-xl">{displayTime(time)}</span>
          </div>
        </div>
        <div className="bg-white border border-primary-950 rounded-md flex items-center justify-between p-10">
          <div className="text-2xl font-bold">ADVANCE TO BE PAID:</div>
          <div className="text-4xl font-bold">
            AED {displayAmount(service.advanceAmount)}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-lg font-medium">PRICE PER HOUR:</div>
            <div className="text-2xl font-bold ml-20">
              AED {displayAmount(service.pricePerHour)}
            </div>
          </div>
          <div>
            <Button type="submit" size="lg">
              Print Reciept
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
