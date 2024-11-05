import { Input } from "@/components/ui/input";
import { BillService, SearchResultBill } from "@/services/bill.service";
import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import SearchResultCard from "@/components/core/SearchResultCard";
import { useSystemState } from "@/hooks/useSystem";
import IconButton from "@/components/core/IconButton";
import { RotateCw } from "lucide-react";
import { useCancelBillOperation } from "@/hooks/useOperations";

export default function SearchPage() {
  const system = useSystemState();
  const cancelBill = useCancelBillOperation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultBill[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (system.status == "loaded") {
        if (!searchQuery.trim()) {
          setResults([]);
          setIsLoading(false);
          return;
        }

        try {
          setIsLoading(true);
          const searchResults = await BillService.search(
            system.token,
            searchQuery
          );
          setResults(searchResults);
        } catch (error) {
          console.error("Search error:", error);
          // You might want to add error state handling here
        } finally {
          setIsLoading(false);
        }
      }
    }, 300),
    []
  );

  const handleBillCancel = useCallback(
    async (bill: SearchResultBill) => {
      await cancelBill(bill.id);
      await debouncedSearch(query);
    },
    [cancelBill, debouncedSearch, query]
  );

  // Effect to trigger search when query changes
  useEffect(() => {
    debouncedSearch(query);
    // Cleanup
    return () => {
      debouncedSearch.cancel();
    };
  }, [query, debouncedSearch]);

  return (
    <div className="w-full flex flex-col h-full">
      <div className=" border-b border-primary-950">
        <div className="p-5 flex items-center justify-center space-x-3 max-w-3xl w-full mx-auto">
          <Input
            type="search"
            placeholder="Search bills..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
          />
          <IconButton icon={RotateCw} onClick={() => setQuery("")} />
        </div>
      </div>
      <div className="flex-1 overflow-y-scroll">
        <div className="w-full max-w-3xl mx-auto space-y-4 p-5">
          {!isLoading && results.length === 0 && query && (
            <div className="text-gray-500">No results found</div>
          )}

          {results.map((result) => (
            <SearchResultCard
              searchQuery={query}
              bill={result}
              key={result.id}
              onCancel={handleBillCancel}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
