import { useCallback } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "./use-toast";

interface Options<T> {
  promise: Promise<T>;
  loading?: string;
  success?: string | ((data: T) => string);
  error?: (error: Error) => string;
}

export function useAsyncToast() {
  const { toast } = useToast();

  const asyncToast = useCallback(
    async <T,>({
      promise,
      loading = "Loading...",
      success = "Operation completed successfully",
      error = (e: Error) => e.message,
    }: Options<T>): Promise<T> => {
      const loadingToast = toast({
        title: "Loading",
        description: (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{loading}</span>
          </div>
        ),
        duration: Infinity,
      });

      try {
        const result = await promise;
        loadingToast.dismiss();

        toast({
          title: "Success",
          description:
            typeof success === "function" ? success(result) : success,
          className: "bg-green-50 border-green-200",
        });

        return result;
      } catch (err) {
        loadingToast.dismiss();

        const errorMessage = error(
          err instanceof Error ? err : new Error("Unknown error")
        );

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });

        throw err;
      }
    },
    [toast]
  );

  return asyncToast;
}
