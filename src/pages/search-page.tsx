import { Input } from "@/components/ui/input";
import { BillService } from "@/services/bill.service";
import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import SearchResultCard from "@/components/core/SearchResultCard";
import { useSystemState } from "@/hooks/useSystem";
import IconButton from "@/components/core/IconButton";
import { Loader2, RotateCw } from "lucide-react";
import { useCancelBillOperation } from "@/hooks/useOperations";
import { SearchResultBill } from "@/types/bill";

const ITEMS_PER_PAGE = 5;

export default function SearchPage() {
  const system = useSystemState();
  const cancelBill = useCancelBillOperation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultBill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const isFirstLoad = useRef(true);
  const currentPage = useRef(1);
  const loadingPage = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const observer = useRef<IntersectionObserver>();
  const lastResultRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading || isLoadingMore) return;

      if (observer.current) observer.current.disconnect();

      if (!hasMore) return;

      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isFirstLoad.current &&
          !isLoadingMore &&
          loadingPage.current === null
        ) {
          const nextPage = currentPage.current + 1;
          setPage(nextPage);
          loadingPage.current = nextPage;
        }
      });

      if (node) observer.current.observe(node);

      return () => {
        if (observer.current) {
          observer.current.disconnect();
        }
      };
    },
    [isLoading, isLoadingMore, hasMore]
  );

  // Scroll to top function
  const scrollToTop = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (system.status === "loaded") {
        try {
          setIsLoading(true);
          currentPage.current = 1;
          loadingPage.current = 1;
          isFirstLoad.current = true;
          const response = await BillService.searchBills(
            system.token,
            searchQuery,
            {
              page: 1,
              limit: ITEMS_PER_PAGE,
            }
          );
          setResults(response.bills);
          setHasMore(response.pagination.hasMore);
          isFirstLoad.current = false;
          loadingPage.current = null;
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }, 300),
    [system]
  );

  const loadMore = useCallback(async () => {
    if (
      system.status === "loaded" &&
      !isLoadingMore &&
      hasMore &&
      !isFirstLoad.current &&
      loadingPage.current !== null
    ) {
      try {
        setIsLoadingMore(true);
        const response = await BillService.searchBills(system.token, query, {
          page: loadingPage.current,
          limit: ITEMS_PER_PAGE,
        });

        const newBills = response.bills.filter(
          (newBill) =>
            !results.some((existingBill) => existingBill.id === newBill.id)
        );

        if (newBills.length > 0) {
          setResults((prev) => [...prev, ...newBills]);
          currentPage.current = loadingPage.current;
        }

        setHasMore(response.pagination.hasMore);

        if (!response.pagination.hasMore) {
          observer.current?.disconnect();
        }
      } catch (error) {
        console.error("Load more error:", error);
      } finally {
        setIsLoadingMore(false);
        loadingPage.current = null;
      }
    }
  }, [hasMore, isLoadingMore, system, query, results]);

  const handleBillCancel = useCallback(
    async (bill: SearchResultBill) => {
      await cancelBill(bill.id);
      setResults([]);
      currentPage.current = 1;
      loadingPage.current = null;
      isFirstLoad.current = true;
      await debouncedSearch(query);
    },
    [cancelBill, debouncedSearch, query]
  );

  // Effect to trigger search when query changes
  useEffect(() => {
    setResults([]);
    currentPage.current = 1;
    loadingPage.current = null;
    isFirstLoad.current = true;
    debouncedSearch(query);
    scrollToTop();

    return () => {
      debouncedSearch.cancel();
      observer.current?.disconnect();
    };
  }, [query, debouncedSearch, scrollToTop]);

  // Effect to load more results when page changes
  useEffect(() => {
    if (page > 1 && !isFirstLoad.current) {
      loadMore();
    }
  }, [page, loadMore]);

  const handleReset = useCallback(async () => {
    // First update the state
    setQuery("");
    setResults([]);
    setPage(1);
    currentPage.current = 1;
    loadingPage.current = null;
    setHasMore(true);
    isFirstLoad.current = true;

    // Disconnect the observer
    if (observer.current) {
      observer.current.disconnect();
    }

    // Scroll to top
    scrollToTop();

    // Perform the empty search
    if (system.status == "loaded") {
      try {
        setIsLoading(true);
        const response = await BillService.searchBills(system.token, "", {
          page: 1,
          limit: ITEMS_PER_PAGE,
        });
        setResults(response.bills);
        setHasMore(response.pagination.hasMore);
        isFirstLoad.current = false;
      } catch (error) {
        console.error("Reset search error:", error);
      } finally {
        setIsLoading(false);
        loadingPage.current = null;
      }
    }
  }, [system, scrollToTop]);

  return (
    <div className="w-full flex flex-col h-full">
      <div className="border-b border-primary-950">
        <div className="p-5 flex items-center justify-center space-x-3 max-w-3xl w-full mx-auto">
          <Input
            type="search"
            placeholder="Search bills..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
          />
          <IconButton
            icon={isLoading ? Loader2 : RotateCw}
            onClick={handleReset}
            disabled={isLoading}
            iconClassName={isLoading ? "animate-spin" : ""}
          />
        </div>
      </div>
      <div ref={scrollContainerRef} className="flex-1 overflow-y-scroll">
        <div className="w-full max-w-3xl mx-auto space-y-4 p-5">
          {!isLoading && results.length === 0 && query && (
            <div className="text-gray-500">No results found</div>
          )}

          {results.map((result, index) => (
            <div
              ref={
                hasMore && index === results.length - 1
                  ? lastResultRef
                  : undefined
              }
              key={result.id}
            >
              <SearchResultCard
                searchQuery={query}
                bill={result}
                onCancel={handleBillCancel}
              />
            </div>
          ))}

          {isLoadingMore && (
            <div className="flex justify-center p-4">
              <Loader2 className="animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
