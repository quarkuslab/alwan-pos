import { zodResolver } from "@hookform/resolvers/zod";
import logo from "@/assets/logo.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormInput } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Spinner from "@/components/ui/spinner";
import { useNavigate } from "react-router";
import { useSystemRegister } from "@/hooks/useSystem";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(1, { message: "Required" }),
  contactInfo: z.string().min(1, { message: "Required" }),
});

export default function RegisterPage() {
  const [isLoading, setLoading] = useState(false);
  const { toast } = useToast();
  const register = useSystemRegister();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contactInfo: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      await register({
        name: values.name,
        contactInfo: values.contactInfo,
      });
      navigate("/app", { replace: true });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error",
        description: String(e),
      });
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen overflow-y-scroll bg-white flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <img className="h-[200px]" src={logo} alt="logo" />
      </div>

      <div className="w-full max-w-3xl mx-auto py-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Counter Setup</CardTitle>
                <CardDescription>Fill all counter details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-10">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Counter Name</FormLabel>
                        <FormControl>
                          <FormInput {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="contactInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Info</FormLabel>
                        <FormControl>
                          <FormInput {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button disabled={isLoading} type="submit" size="lg">
                {isLoading ? <Spinner /> : <span>Setup Counter</span>}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
