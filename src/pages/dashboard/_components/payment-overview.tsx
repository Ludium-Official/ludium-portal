import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { PaymentWeek } from '@/types/types.generated';
import { format, subMonths } from 'date-fns';
import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

const chartConfig = {
  earning: {
    label: 'Earning',
    color: 'var(--color-primary)',
  },
  spending: {
    label: 'Spending',
    color: 'var(--color-blue-700)',
  },
} satisfies ChartConfig;

export function PaymentOverview({
  sponsorPaymentOverview,
  builderPaymentOverview,
}: {
  sponsorPaymentOverview: PaymentWeek[];
  builderPaymentOverview: PaymentWeek[];
}) {
  const chartData = useMemo(() => {
    const weekLabels = ['1 week', '2 week', '3 week', '4 week'];

    return weekLabels.map((label) => {
      const earning = builderPaymentOverview?.find((p) => p.label === label);
      const spending = sponsorPaymentOverview?.find((p) => p.label === label);

      return {
        week: label,
        earning: earning?.budget ? Number(earning.budget) : 0,
        spending: spending?.budget ? Number(spending.budget) : 0,
      };
    });
  }, [sponsorPaymentOverview, builderPaymentOverview]);

  const dateRange = useMemo(() => {
    const endDate = new Date();
    const startDate = subMonths(endDate, 1);
    return {
      startDate: format(startDate, 'MMM d, yyyy'),
      endDate: format(endDate, 'MMM d, yyyy'),
    };
  }, []);

  return (
    <Card className="border border-gray-200 shadow-none">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <CardTitle className="text-base font-semibold">Payment Overview</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          {dateRange.startDate} - {dateRange.endDate}
        </p>
      </CardHeader>
      <CardContent className="pt-4">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="earningGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-earning)" stopOpacity={0.5} />
                <stop offset="50%" stopColor="var(--color-earning)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--color-earning)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-spending)" stopOpacity={0.5} />
                <stop offset="50%" stopColor="var(--color-spending)" stopOpacity={0.15} />
                <stop offset="100%" stopColor="var(--color-spending)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="week"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--color-slate-400)' }}
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
