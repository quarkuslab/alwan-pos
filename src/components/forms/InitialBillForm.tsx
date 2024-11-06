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
import { Toggle } from "@/components/ui/toggle";
import useTime from "@/hooks/useTime";
import { displayTime } from "@/utils/time";
import { Button } from "../ui/button";
import {
  FormSelectionGroup,
  FormSelectionGroupItem,
} from "../ui/form-selection-group";
import { displayAmount } from "@/utils/amount";
import {
  CircleDollarSign,
  Clock,
  CreditCard,
  Sun,
  Minus,
  Plus,
} from "lucide-react";
import { CreateInitialBillData } from "@/services/bill.service";
import { SystemService } from "@/services/system.service";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

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
  fullDay: z.boolean().default(false),
});

const InitialBillForm = forwardRef<Methods, Props>((props, ref) => {
  const time = useTime();
  const toggleGroupRef = useRef<HTMLDivElement>(null);
  const [quantity, setQuantity] = useState(1);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      remarks: "",
      payment: undefined,
      fullDay: false,
    },
  });

  const resetForm = useCallback(() => {
    form.reset();
    setQuantity(1);
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

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    props.onSubmit({
      time,
      quantity,
      customerName: values.name,
      customerPhone: values.phone,
      remarks: values.remarks,
      paymentMethod: values.payment,
      service: props.service,
      isFullday: values.fullDay,
    });
  }

  return (
    <Form {...form}>
      <form
        className="w-full max-w-3xl space-y-5"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        {/* First row with name and phone remains the same */}
        <div className="grid grid-cols-7 gap-5">
          <div className="col-span-4">
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
          <div className="col-span-3">
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

        {/* Updated grid section */}
        <div className="grid grid-cols-7 gap-5">
          <div className="col-span-4">
            <div className="grid grid-cols-2 gap-5">
              {/* Payment Section */}
              <FormField
                control={form.control}
                name="payment"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Payment</FormLabel>
                    <FormControl>
                      <FormSelectionGroup
                        ref={toggleGroupRef}
                        type="single"
                        value={field.value}
                        onValueChange={field.onChange}
                        className="h-11"
                      >
                        <FormSelectionGroupItem value="cash" className="h-full">
                          <CircleDollarSign className="h-4 w-4" />
                          <span className="ml-3">Cash</span>
                        </FormSelectionGroupItem>
                        <FormSelectionGroupItem value="card" className="h-full">
                          <CreditCard className="h-4 w-4" />
                          <span className="ml-3">Card</span>
                        </FormSelectionGroupItem>
                      </FormSelectionGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Quantity Section */}
              <div className="space-y-2">
                <FormLabel>Quantity</FormLabel>
                <div className="flex items-center space-x-2 h-11">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleDecrement}
                    className="border-primary-950 h-full"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 flex items-center justify-center h-full text-center border border-primary-950 rounded-md">
                    {quantity}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleIncrement}
                    className="border-primary-950 h-full"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Full Day Section */}
              {props.service.hasFulldayCalculation && (
                <FormField
                  control={form.control}
                  name="fullDay"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Full Day</FormLabel>
                      <FormControl>
                        <Toggle
                          pressed={field.value}
                          onPressedChange={field.onChange}
                          className="w-full h-11 data-[state=on]:bg-primary-950 data-[state=on]:text-white border border-primary-950"
                        >
                          <Sun className="h-4 w-4 mr-2" />
                          Full Day
                        </Toggle>
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              {/* Time Section */}
              <div className="space-y-2">
                <FormLabel>Time</FormLabel>
                <div className="flex items-center justify-center space-x-3 h-11 bg-white px-5 border border-primary-950 rounded-md">
                  <Clock className="h-4 w-4" />
                  <span className="text-xl">{displayTime(time)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Updated Remarks Section with full height */}
          <div className="col-span-3">
            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem className="h-full">
                  <div className="flex flex-col h-full space-y-3">
                    <FormLabel>Remarks</FormLabel>
                    <FormControl className="flex-1">
                      <Textarea
                        className="h-full min-h-[140px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Rest of the form remains the same */}
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
