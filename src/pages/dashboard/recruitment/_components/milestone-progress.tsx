import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';
import type { MilestoneProgress as MilestoneProgressType } from '@/types/types.generated';

interface MilestoneProgressProps {
  milestoneProgress?: MilestoneProgressType | null;
}

const chartConfig = {
  completed: {
    label: 'Completed',
    color: 'var(--color-primary)',
  },
  remaining: {
    label: 'Remaining',
    color: 'var(--color-muted)',
  },
} satisfies ChartConfig;

export const MilestoneProgress: React.FC<MilestoneProgressProps> = ({ milestoneProgress }) => {
  const percentage = Math.round(
    ((milestoneProgress?.completed || 0) / (milestoneProgress?.total || 0)) * 100,
  );

  const chartData = [
    {
      name: 'milestones',
      completed: milestoneProgress?.completed || 0,
      remaining: (milestoneProgress?.total || 0) - (milestoneProgress?.completed || 0),
    },
  ];

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h2 className="text-base font-semibold mb-1">Milestone progress</h2>
      <p className="text-sm text-slate-500 mb-6">You've completed {percentage}% of milestones.</p>

      <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full max-w-[200px]">
        <RadialBarChart
          data={chartData}
          innerRadius={100}
          outerRadius={70}
          startAngle={0}
          endAngle={-360}
        >
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy || 0}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {milestoneProgress?.completed || 0}/{milestoneProgress?.total || 0}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 20}
                        className="fill-muted-foreground text-xs"
                      >
                        Milestones
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </PolarRadiusAxis>
          <RadialBar
            dataKey="remaining"
            fill="var(--color-muted)"
            stackId="a"
            cornerRadius={5}
            className="stroke-transparent stroke-2"
          />
          <RadialBar
            dataKey="completed"
            fill="var(--color-primary)"
            stackId="a"
            cornerRadius={5}
            className="stroke-transparent stroke-2"
          />
        </RadialBarChart>
      </ChartContainer>
    </div>
  );
};

export default MilestoneProgress;
