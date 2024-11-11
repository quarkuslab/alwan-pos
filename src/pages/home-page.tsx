import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAnalyticsState, useAnalyticsUpdate } from "@/hooks/useAnalytics";
import useOnMount from "@/hooks/useOnMount";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Ban, CheckCircle, Timer, Package } from "lucide-react";
import { useMemo } from "react";
import Spinner from "@/components/ui/spinner";

export default function HomePage() {
  const analytics = useAnalyticsState();
  const updateAnalytics = useAnalyticsUpdate();
  const total = useMemo(() => {
    if (analytics.status == "loaded") {
      return (
        analytics.counts.pendingCount +
        analytics.counts.cancelledCount +
        analytics.counts.completedCount
      );
    }
    return 0;
  }, [analytics]);

  const statusData = useMemo(
    () => [
      {
        name: "Pending",
        value: analytics.status == "loaded" ? analytics.counts.pendingCount : 0,
        color: "#f59e0b",
        description: "Services currently with customers",
      },
      {
        name: "Cancelled",
        value:
          analytics.status == "loaded" ? analytics.counts.cancelledCount : 0,
        color: "#ef4444",
        description: "Services cancelled before use",
      },
      {
        name: "Completed",
        value:
          analytics.status == "loaded" ? analytics.counts.completedCount : 0,
        color: "#22c55e",
        description: "Services returned by customers",
      },
    ],
    [analytics]
  );

  useOnMount(updateAnalytics);

  const activeRate = useMemo(() => {
    if (analytics.status == "loaded") {
      return (
        (analytics.counts.completedCount /
          (total - analytics.counts.cancelledCount)) *
        100
      ).toFixed(1);
    }
    return "0";
  }, [analytics, total]);

  const cancellationRate = useMemo(() => {
    if (analytics.status == "loaded") {
      return ((analytics.counts.cancelledCount / total) * 100).toFixed(1);
    }
    return "0";
  }, [analytics, total]);

  if (analytics.status == "loading") {
    return (
      <div className="h-[calc(100vh-5rem)] flex flex-col items-center justify-center">
        <Spinner size={30} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl py-5">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Current Rentals Card */}
          <Card className="bg-amber-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Services
              </CardTitle>
              <Timer className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-700">
                {analytics.counts.pendingCount}
              </div>
              <p className="text-xs text-amber-600">
                Services currently with customers
              </p>
            </CardContent>
          </Card>

          {/* Returns Today Card */}
          <Card className="bg-green-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Services
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">
                {analytics.counts.completedCount}
              </div>
              <p className="text-xs text-green-600">
                Completion rate: {activeRate}%
              </p>
            </CardContent>
          </Card>

          {/* Cancellations Card */}
          <Card className="bg-red-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Cancelled Services
              </CardTitle>
              <Ban className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700">
                {analytics.counts.cancelledCount}
              </div>
              <p className="text-xs text-red-600">
                Cancellation rate: {cancellationRate}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Rental Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Status Overview
            </CardTitle>
            <CardDescription>
              Distribution of services by status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Donut Chart */}
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36} />
                  <Tooltip
                    formatter={(value: number, _, props) => [
                      `${value} (${((+value / total) * 100).toFixed(1)}%)`,
                      props.payload.description,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
