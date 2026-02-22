import { useHackathonSponsorsQuery } from '@/apollo/queries/hackathon-sponsors.generated';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

interface HackathonTracksTabProps {
  hackathonId: string;
}

function HackathonTracksTab({ hackathonId }: HackathonTracksTabProps) {
  const { data, loading } = useHackathonSponsorsQuery({ variables: { hackathonId } });

  const sponsors = data?.hackathonSponsors ?? [];
  const [activeSponsorId, setActiveSponsorId] = useState<string | null>(null);
  const sponsorRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const sidebarRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sponsors.length > 0 && !activeSponsorId) {
      setActiveSponsorId(sponsors[0].id ?? null);
    }
  }, [sponsors, activeSponsorId]);

  // sticky sidebar (same pattern as details tab)
  useEffect(() => {
    const scrollEl = document.getElementById('scroll-area-main-viewport');
    if (!scrollEl) return;
    const PADDING = 16;
    const onScroll = () => {
      if (!sidebarRef.current || !wrapperRef.current) return;
      const scrollRect = scrollEl.getBoundingClientRect();
      const wrapperTop = wrapperRef.current.getBoundingClientRect().top - scrollRect.top;
      const maxShift = wrapperRef.current.offsetHeight - sidebarRef.current.offsetHeight - PADDING;
      if (wrapperTop < PADDING) {
        const shift = Math.min(-wrapperTop + PADDING, Math.max(0, maxShift));
        sidebarRef.current.style.transform = `translateY(${shift}px)`;
      } else {
        sidebarRef.current.style.transform = '';
      }
    };
    scrollEl.addEventListener('scroll', onScroll);
    return () => scrollEl.removeEventListener('scroll', onScroll);
  }, [sponsors]);

  // IntersectionObserver for active sponsor
  useEffect(() => {
    const scrollEl = document.getElementById('scroll-area-main-viewport');
    if (!scrollEl) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSponsorId(entry.target.id);
            break;
          }
        }
      },
      { root: scrollEl, threshold: 0.3 },
    );
    for (const id of Object.keys(sponsorRefs.current)) {
      const el = sponsorRefs.current[id];
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sponsors]);

  const scrollToSponsor = (id: string) => {
    const el = sponsorRefs.current[id];
    const scrollEl = document.getElementById('scroll-area-main-viewport');
    if (el && scrollEl) {
      const elTop = el.getBoundingClientRect().top - scrollEl.getBoundingClientRect().top;
      scrollEl.scrollBy({ top: elTop - 16, behavior: 'smooth' });
      setActiveSponsorId(id);
    }
  };

  if (loading) {
    return (
      <div className="flex gap-6 mt-3">
        <div className="flex flex-col gap-2 w-45 shrink-0">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full rounded-md" />
          ))}
        </div>
        <Skeleton className="flex-1 h-64" />
      </div>
    );
  }

  if (!sponsors.length) return null;

  return (
    <div ref={wrapperRef} className="flex gap-6 mt-3">
      <div
        ref={sidebarRef}
        className="flex flex-col gap-1 w-45 h-fit shrink-0 p-4 rounded-lg border border-gray-200"
      >
        {sponsors.map((sponsor) => (
          <button
            key={sponsor.id}
            type="button"
            onClick={() => scrollToSponsor(sponsor.id ?? '')}
            className={cn(
              'flex items-center gap-2 w-fit px-3 py-2 rounded-md transition-colors text-sm text-left',
              activeSponsorId === sponsor.id
                ? 'bg-gray-100 text-gray-900'
                : 'text-muted-foreground hover:text-gray-900 hover:bg-gray-50',
            )}
          >
            {sponsor.sponsorImage && (
              <img
                src={sponsor.sponsorImage}
                alt={sponsor.name || ''}
                className="w-5 h-5 rounded-sm object-cover shrink-0"
              />
            )}
            <span className="truncate">{sponsor.name}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-5">
        {sponsors.map((sponsor) => {
          const totalPrize = (sponsor.tracks ?? []).reduce((sum, t) => sum + (t.prize ?? 0), 0);
          return (
            <div
              key={sponsor.id}
              id={sponsor.id ?? ''}
              ref={(el) => {
                sponsorRefs.current[sponsor.id ?? ''] = el;
              }}
              className="border border-gray-200 rounded-lg px-[30px] py-4"
            >
              <div className="flex items-center gap-5 mb-4 text-lg font-bold">
                {sponsor.sponsorImage && (
                  <img
                    src={sponsor.sponsorImage}
                    alt={sponsor.name || ''}
                    className="w-20 h-20 object-cover shrink-0"
                  />
                )}
                <div className="flex flex-col gap-3">
                  <div>{sponsor.name}</div>
                  {totalPrize > 0 && (
                    <div className="text-gray-700">${totalPrize.toLocaleString()}</div>
                  )}
                </div>
              </div>

              {sponsor.about && (
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{sponsor.about}</p>
              )}

              {sponsor.tracks && sponsor.tracks.length > 0 && (
                <Accordion type="multiple" className="flex flex-col gap-5">
                  {sponsor.tracks.map((track, idx) => (
                    <AccordionItem
                      key={track.id}
                      value={track.id ?? `track-${idx}`}
                      className="border border-gray-200 rounded-lg px-4 last:border-b-1"
                    >
                      <AccordionTrigger className="py-4 hover:no-underline font-semibold text-zinc-900">
                        {idx + 1}. {track.title}
                        {track.prize ? ` - $${track.prize.toLocaleString()}` : ''}
                      </AccordionTrigger>
                      <AccordionContent className="pb-4">{track.description}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HackathonTracksTab;
