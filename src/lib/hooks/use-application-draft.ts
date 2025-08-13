import { useAuth } from '@/lib/hooks/use-auth';
import { useCallback, useMemo } from 'react';

export type ApplicationDraft = {
  overview: {
    name: string;
    links: string[];
    price: string;
  };
  description: {
    summary: string;
    content: string;
  };
  milestones: Array<{
    title: string;
    price: string;
    deadline: string; // yyyy-MM-dd
    summary: string;
    description: string;
  }>;
};

const APPLICATION_DRAFT_KEY_PREFIX = 'applicationDraft';

export const useApplicationDraft = (programId?: string) => {
  const { userId } = useAuth();

  const storageKey = useMemo(() => {
    const uid = userId ? `:${userId}` : ':anon';
    const pid = programId ? `:${programId}` : '';
    return `${APPLICATION_DRAFT_KEY_PREFIX}${uid}${pid}`;
  }, [userId, programId]);

  const saveDraft = useCallback(
    (draft: ApplicationDraft) => {
      if (typeof window === 'undefined') return;
      try {
        localStorage.setItem(storageKey, JSON.stringify(draft));
      } catch (err) {
        console.error('Failed to save application draft', err);
      }
    },
    [storageKey],
  );

  const loadDraft = useCallback((): ApplicationDraft | null => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      return JSON.parse(raw) as ApplicationDraft;
    } catch (err) {
      console.error('Failed to load application draft', err);
      return null;
    }
  }, [storageKey]);

  const clearDraft = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(storageKey);
    } catch (err) {
      console.error('Failed to clear application draft', err);
    }
  }, [storageKey]);

  return { saveDraft, loadDraft, clearDraft, storageKey };
};
