import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAnalyticsData, useAnalyticsUpdate } from "@/hooks/useAnalytics";
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

export default function HomePage() {
  const analytics = useAnalyticsData();
  const updateAnalytics = useAnalyticsUpdate();
  const total = useMemo(
    () =>
      analytics.paidCount + analytics.cancelledCount + analytics.completedCount,
    [analytics]
  );

  const statusData = useMemo(
    () => [
      {
        name: "Active",
        value: analytics.paidCount,
        color: "#0ea5e9",
        description: "Services currently with customers",
      },
      {
        name: "Cancelled",
        value: analytics.cancelledCount,
        color: "#ef4444",
        description: "Services cancelled before use",
      },
      {
        name: "Completed",
        value: analytics.completedCount,
        color: "#22c55e",
        description: "Services returned by customers",
      },
    ],
    [analytics]
  );

  useOnMount(updateAnalytics);

  const activeRate = (
    (analytics.completedCount / (total - analytics.cancelledCount)) *
    100
  ).toFixed(1);
  const cancellationRate = ((analytics.cancelledCount / total) * 100).toFixed(
    1
  );

  return (
    <div className="mx-auto max-w-4xl py-5">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Current Rentals Card */}
          <Card className="bg-blue-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Services
              </CardTitle>
              <Timer className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">
                {analytics.paidCount}
              </div>
              <p className="text-xs text-blue-600">
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
                {analytics.completedCount}
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
                {analytics.cancelledCount}
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
