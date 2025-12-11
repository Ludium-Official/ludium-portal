import { useAuth } from '@/lib/hooks/use-auth';
import type { ProjectDraft, ProjectMilestone, ProjectTerm } from '@/types/draft';
import { useCallback, useMemo } from 'react';

export type { ProjectDraft, ProjectMilestone, ProjectTerm };

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
