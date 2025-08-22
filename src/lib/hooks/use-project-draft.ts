import { useAuth } from '@/lib/hooks/use-auth';
import { useCallback, useMemo } from 'react';

// Terms state
interface Term {
  id: number;
  title: string;
  prize: string;
  purchaseLimit: string;
  description: string;
}

// Milestones state
interface Milestone {
  id: number;
  title: string;
  payoutPercentage: string;
  endDate: Date | undefined;
  summary: string;
  description: string;
}

export type ProjectDraft = {
  name?: string;
  fundingToBeRaised?: string;
  description?: string;
  summary?: string;
  links?: string[];
  visibility?: 'public' | 'restricted' | 'private';
  builders?: string[];
  selectedBuilderItems?: Array<{ label: string; value: string }>;
  supporterTierConfirmed?: boolean;
  terms?: Term[];
  milestones?: Milestone[];
};

const PROJECT_DRAFT_KEY_PREFIX = 'projectDraft';

export const useProjectDraft = () => {
  const { userId } = useAuth();

  const storageKey = useMemo(() => {
    const suffix = userId ? `:${userId}` : ':anon';
    return `${PROJECT_DRAFT_KEY_PREFIX}${suffix}`;
  }, [userId]);

  const saveDraft = useCallback(
    (draft: ProjectDraft) => {
      if (typeof window === 'undefined') return;
      try {
        localStorage.setItem(storageKey, JSON.stringify(draft));
      } catch (err) {
        // Intentionally swallow storage errors. Consumer may notify user.
        console.error('Failed to save project draft', err);
      }
    },
    [storageKey],
  );

  const loadDraft = useCallback((): ProjectDraft | null => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      return JSON.parse(raw) as ProjectDraft;
    } catch (err) {
      console.error('Failed to load project draft', err);
      return null;
    }
  }, [storageKey]);

  const clearDraft = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(storageKey);
    } catch (err) {
      console.error('Failed to clear project draft', err);
    }
  }, [storageKey]);

  return { saveDraft, loadDraft, clearDraft, storageKey };
};
