import { useHackathonFaqsQuery } from '@/apollo/queries/hackathon-faqs.generated';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';

interface HackathonFaqTabProps {
  hackathonId: string;
}

function HackathonFaqTab({ hackathonId }: HackathonFaqTabProps) {
  const { data, loading } = useHackathonFaqsQuery({ variables: { hackathonId } });

  const faqs = [...(data?.hackathonFaqs ?? [])].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );

  if (loading) {
    return (
      <div className="flex flex-col gap-3 mt-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!faqs.length) return null;

  return (
    <Accordion type="multiple" className="flex flex-col gap-3 mt-3">
      {faqs.map((faq) => (
        <AccordionItem
          key={faq.id}
          value={faq.id ?? ''}
          className="border border-gray-200 rounded-lg px-4 last:border-b-1"
        >
          <AccordionTrigger className="py-4 hover:no-underline font-semibold text-left text-zinc-900">
            {faq.title}
          </AccordionTrigger>
          <AccordionContent className="pb-4">{faq.description}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default HackathonFaqTab;
