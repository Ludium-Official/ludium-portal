import { useAuth } from '@/lib/hooks/use-auth';
import { LabelValueProps, VisibilityProps } from '@/types/common';
import { useCallback, useMemo } from 'react';

export type ProgramDraft = {
  programTitle?: string;
  price?: string;
  description?: string;
  currency?: string;
  deadline?: Date;
  skills?: string[];
  selectedSkillItems?: Array<LabelValueProps>;
  links?: string[];
  network?: string;
  visibility?: VisibilityProps;
  builders?: string[];
  selectedBuilderItems?: Array<LabelValueProps>;
  budget?: string;
};

const PROGRAM_DRAFT_KEY_PREFIX = 'programDraft';

export const useProgramDraft = () => {
  const { userId } = useAuth();

  const storageKey = useMemo(() => {
    const suffix = userId ? `:${userId}` : ':anon';
    return `${PROGRAM_DRAFT_KEY_PREFIX}${suffix}`;
  }, [userId]);

  const saveDraft = useCallback(
    (draft: ProgramDraft) => {
      if (typeof window === 'undefined') return;
      try {
        localStorage.setItem(storageKey, JSON.stringify(draft));
      } catch (err) {
        // Intentionally swallow storage errors. Consumer may notify user.
        console.error('Failed to save program draft', err);
      }
    },
    [storageKey],
  );

  const loadDraft = useCallback((): ProgramDraft | null => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      return JSON.parse(raw) as ProgramDraft;
    } catch (err) {
      console.error('Failed to load program draft', err);
      return null;
    }
  }, [storageKey]);

  const clearDraft = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(storageKey);
    } catch (err) {
      console.error('Failed to clear program draft', err);
    }
  }, [storageKey]);

  return { saveDraft, loadDraft, clearDraft, storageKey };
};
