import { type RefObject, useEffect, useRef, useState } from 'react';
import { useIsMobile } from './use-mobile';

interface UseCommentLineHeightOptions {
  showComments: boolean;
  commentsLength: number;
}

interface UseCommentLineHeightReturn {
  lineHeight: number | null;
  commentsRef: RefObject<HTMLDivElement | null>;
  parentContentRef: RefObject<HTMLDivElement | null>;
}

export function useCommentLineHeight({
  showComments,
  commentsLength,
}: UseCommentLineHeightOptions): UseCommentLineHeightReturn {
  const isMobile = useIsMobile();
  const commentsRef = useRef<HTMLDivElement>(null);
  const parentContentRef = useRef<HTMLDivElement>(null);
  const [lineHeight, setLineHeight] = useState<number | null>(null);

  const calculateLineHeight = () => {
    if (showComments && commentsRef.current && parentContentRef.current) {
      const parentHeight = parentContentRef.current.offsetHeight;
      const children = commentsRef.current.children;
      const offsetValue = isMobile ? 150 : 180;

      if (children.length === 0) {
        setLineHeight(parentHeight);
      } else if (children.length === 1) {
        setLineHeight(parentHeight + 155);
      } else {
        let childrenHeight = 0;
        for (let i = 0; i < children.length - 1; i++) {
          const child = children[i] as HTMLElement;
          childrenHeight += child.offsetHeight;
        }
        const gapCount = children.length - 2;
        childrenHeight += gapCount > 0 ? gapCount * 24 : 0;
        setLineHeight(parentHeight + childrenHeight + offsetValue);
      }
    } else {
      setLineHeight(null);
    }
  };

  useEffect(() => {
    calculateLineHeight();
  }, [showComments, commentsLength, isMobile]);

  useEffect(() => {
    if (!commentsRef.current || !showComments) return;

    const resizeObserver = new ResizeObserver(() => {
      calculateLineHeight();
    });

    resizeObserver.observe(commentsRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [showComments, commentsLength]);

  return {
    lineHeight,
    commentsRef,
    parentContentRef,
  };
}
