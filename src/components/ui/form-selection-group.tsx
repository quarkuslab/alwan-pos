import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { toggleVariants } from "@/components/ui/toggle";
import { useFormField } from "./form";

const FormSelectionGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "default",
  variant: "default",
});

const FormSelectionGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, ...props }, ref) => {
  const { error } = useFormField();
  return (
    <ToggleGroupPrimitive.Root
      ref={ref}
      className={cn(
        "flex h-10 items-center justify-center border border-primary-950 rounded-lg overflow-hidden bg-white divide-x divide-primary-950",
        error && "border-red-500",
        className
      )}
      {...props}
    >
      <FormSelectionGroupContext.Provider value={{ variant, size }}>
        {children}
      </FormSelectionGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
});

FormSelectionGroup.displayName = "FormSelectionGroup";

const FormSelectionGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(FormSelectionGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        "data-[state=on]:bg-primary-950 data-[state=on]:text-white px-8 h-full flex items-center justify-center text-base font-medium rounded-r-none [&:last-child]:rounded-l-none",
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});

FormSelectionGroupItem.displayName = "FormSelectionGroupItem";

export { FormSelectionGroup, FormSelectionGroupItem };
