import { useAuth } from '@/lib/hooks/use-auth';
import type { InvestmentDraft } from '@/types/draft';
import { useCallback, useMemo } from 'react';

export type { InvestmentDraft };

const INVESTMENT_DRAFT_KEY_PREFIX = 'investmentDraft';

export const useInvestmentDraft = () => {
  const { userId } = useAuth();

  const storageKey = useMemo(() => {
    const suffix = userId ? `:${userId}` : ':anon';
    return `${INVESTMENT_DRAFT_KEY_PREFIX}${suffix}`;
  }, [userId]);

  const saveDraft = useCallback(
    (draft: InvestmentDraft) => {
      if (typeof window === 'undefined') return;
      try {
        localStorage.setItem(storageKey, JSON.stringify(draft));
      } catch (err) {
        console.error('Failed to save funding draft', err);
      }
    },
    [storageKey],
  );

  const loadDraft = useCallback((): InvestmentDraft | null => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      return JSON.parse(raw) as InvestmentDraft;
    } catch (err) {
      console.error('Failed to load funding draft', err);
      return null;
    }
  }, [storageKey]);

  const clearDraft = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(storageKey);
    } catch (err) {
      console.error('Failed to clear funding draft', err);
    }
  }, [storageKey]);

  return { saveDraft, loadDraft, clearDraft, storageKey };
};
