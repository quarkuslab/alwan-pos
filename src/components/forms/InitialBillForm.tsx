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
import { CreateInitialBillData } from "@/services/bill.service";
import { SystemService } from "@/services/system.service";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

interface Props {
  service: SystemService;
  onSubmit: (data: CreateInitialBillData) => void;
}

interface Methods {
  reset: () => void;
}

const formSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  remarks: z.string().optional(),
  payment: z.enum(["cash", "card"]),
});

const InitialBillForm = forwardRef<Methods, Props>((props, ref) => {
  const time = useTime();
  const toggleGroupRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      remarks: "",
      payment: undefined,
    },
  });

  const resetForm = useCallback(() => {
    form.reset();
    // Force reset the toggle group items' data-state
    if (toggleGroupRef.current) {
      const items = toggleGroupRef.current.querySelectorAll("[data-state]");
      items.forEach((item) => {
        item.setAttribute("data-state", "off");
      });
    }
  }, [form]);

  useImperativeHandle(ref, () => ({
    reset: resetForm,
  }));

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    props.onSubmit({
      customerName: values.name,
      customerPhone: values.phone,
      remarks: values.remarks,
      paymentMethod: values.payment,
      time,
      service: props.service,
    });
  }

  return (
    <Form {...form}>
      <form
        className="w-full max-w-3xl space-y-5"
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
                      ref={toggleGroupRef}
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
            AED {displayAmount(props.service.advanceAmount)}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-lg font-medium">PRICE PER HOUR:</div>
            <div className="text-2xl font-bold ml-20">
              AED {displayAmount(props.service.pricePerHour)}
            </div>
          </div>
          <div>
            <Button type="submit" size="lg">
              Print Receipt
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
});

export default InitialBillForm;
