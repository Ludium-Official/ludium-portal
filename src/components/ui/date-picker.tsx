import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import type { Matcher } from 'react-day-picker';

export function DatePicker({
  date,
  setDate,
  disabled,
  align = 'start',
}: {
  date?: Date;
  setDate: (date: Date) => void;
  disabled?: Matcher | Matcher[] | undefined;
  align?: 'center' | 'start' | 'end' | undefined;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal rounded-[6px] h-10',
            !date && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className="w-auto p-0 z-[10000] pointer-events-auto">
        <Calendar
          disabled={disabled}
          mode="single"
          selected={date}
          onSelect={(day) => {
            if (day) {
              setDate(day);
            }
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
