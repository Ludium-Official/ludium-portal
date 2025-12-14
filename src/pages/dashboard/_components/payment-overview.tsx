import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ArrowUpRight } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

const mockChartData = [
  { week: "1week", earning: 200, spending: 15 },
  { week: "2week", earning: 45, spending: 35 },
  { week: "3week", earning: 80, spending: 100 },
  { week: "4week", earning: 65, spending: 50 },
];

const chartConfig = {
  earning: {
    label: "Earning",
    color: "var(--color-primary)",
  },
  spending: {
    label: "Spending",
    color: "var(--color-blue-700)",
  },
} satisfies ChartConfig;

export function PaymentOverview() {
  const date = {
    startDate: "Nov 3",
    endDate: "Nov 3, 2025",
  };

  return (
    <Card className="border border-gray-200 shadow-none">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Payment Overview
          </CardTitle>
          <ArrowUpRight className="w-6 h-6" />
        </div>
        <p className="text-sm text-muted-foreground">
          {date.startDate} - {date.endDate}
        </p>
      </CardHeader>
      <CardContent className="pt-4">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <AreaChart
            data={mockChartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="earningGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-earning)"
                  stopOpacity={0.5}
                />
                <stop
                  offset="50%"
                  stopColor="var(--color-earning)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-earning)"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-spending)"
                  stopOpacity={0.5}
                />
                <stop
                  offset="50%"
                  stopColor="var(--color-spending)"
                  stopOpacity={0.15}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-spending)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="week"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--color-slate-400)" }}
              interval={0}
              padding={{ left: 10, right: 10 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              type="monotone"
              dataKey="earning"
              stroke="var(--color-primary)"
              strokeWidth={2}
              fill="url(#earningGradient)"
            />
            <Area
              type="monotone"
              dataKey="spending"
              stroke="var(--color-blue-700)"
              strokeWidth={2}
              fill="url(#spendingGradient)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
