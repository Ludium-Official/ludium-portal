import { useHackathonSectionsQuery } from '@/apollo/queries/hackathon-sections.generated';
import MarkdownPreviewer from '@/components/markdown/markdown-previewer';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

interface HackathonDetailsTabProps {
  hackathonId: string;
}

function HackathonDetailsTab({ hackathonId }: HackathonDetailsTabProps) {
  const { data, loading } = useHackathonSectionsQuery({
    variables: { hackathonId },
  });

  const sections = [...(data?.hackathonSections ?? [])]
    .filter((s) => s.isVisible)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  const [activeId, setActiveId] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const sidebarRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sections.length > 0 && !activeId) {
      setActiveId(sections[0].id ?? null);
    }
  }, [sections, activeId]);

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
  }, [sections]);

  useEffect(() => {
    const scrollEl = document.getElementById('scroll-area-main-viewport');
    if (!scrollEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { root: scrollEl, threshold: 0.3 },
    );

    for (const id of Object.keys(sectionRefs.current)) {
      const el = sectionRefs.current[id];
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id];
    const scrollEl = document.getElementById('scroll-area-main-viewport');
    if (el && scrollEl) {
      const elTop = el.getBoundingClientRect().top - scrollEl.getBoundingClientRect().top;
      scrollEl.scrollBy({ top: elTop - 16, behavior: 'smooth' });
      setActiveId(id);
    }
  };

  if (loading) {
    return (
      <div className="flex gap-6 mt-3">
        <div className="flex flex-col gap-2 w-40 shrink-0">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full rounded-md" />
          ))}
        </div>
        <Skeleton className="flex-1 h-64" />
      </div>
    );
  }

  if (!sections.length) return null;

  return (
    <div ref={wrapperRef} className="flex gap-6 mt-3">
      <div
        ref={sidebarRef}
        className="flex flex-col gap-2 w-45 h-fit shrink-0 p-4 rounded-lg border border-gray-200"
      >
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => scrollToSection(section.id ?? '')}
            className={cn(
              'w-fit px-3 py-2 rounded-md transition-colors text-sm',
              activeId === section.id
                ? 'bg-gray-100 text-gray-900'
                : 'text-muted-foreground hover:text-gray-900 hover:bg-gray-50',
            )}
          >
            {section.title}
          </button>
        ))}
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-5">
        {sections.map((section) => (
          <div
            key={section.id}
            id={section.id ?? ''}
            ref={(el) => {
              sectionRefs.current[section.id ?? ''] = el;
            }}
            className="border border-gray-200 rounded-lg px-7 pt-4"
          >
            <h2 className="font-bold mb-4">{section.title}</h2>
            <MarkdownPreviewer value={section.value ?? ''} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default HackathonDetailsTab;
