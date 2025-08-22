import { useAuth } from '@/lib/hooks/use-auth';
import { useCallback, useMemo } from 'react';

export type InvestmentDraft = {
  programName?: string;
  price?: string;
  description?: string;
  summary?: string;
  currency?: string;
  deadline?: string; // yyyy-MM-dd
  keywords?: string[];
  validators?: string[];
  selectedValidatorItems?: Array<{ label: string; value: string }>;
  links?: string[];
  network?: string;
  visibility?: 'public' | 'restricted' | 'private';
  builders?: string[];
  selectedBuilderItems?: Array<{ label: string; value: string }>;
  applicationStartDate?: string;
  applicationEndDate?: string;
  fundingStartDate?: string;
  fundingEndDate?: string;
  fundingCondition?: 'open' | 'tier';
  tierSettings?: {
    bronze?: { enabled: boolean; maxAmount: string };
    silver?: { enabled: boolean; maxAmount: string };
    gold?: { enabled: boolean; maxAmount: string };
    platinum?: { enabled: boolean; maxAmount: string };
  };
  feeType?: 'default' | 'custom';
  customFee?: string;
};

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
        // Intentionally swallow storage errors. Consumer may notify user.
        console.error('Failed to save investment draft', err);
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
      console.error('Failed to load investment draft', err);
      return null;
    }
  }, [storageKey]);

  const clearDraft = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(storageKey);
    } catch (err) {
      console.error('Failed to clear investment draft', err);
    }
  }, [storageKey]);

  return { saveDraft, loadDraft, clearDraft, storageKey };
};
