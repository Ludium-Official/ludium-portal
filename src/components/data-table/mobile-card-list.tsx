import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface MobileCardField<TData> {
  key: string;
  label: string;
  render: (item: TData) => ReactNode;
}

interface MobileCardListProps<TData> {
  data: TData[];
  keyExtractor: (item: TData) => string;
  renderHeader: (item: TData) => ReactNode;
  fields: MobileCardField<TData>[];
  onItemClick?: (item: TData) => void;
  emptyMessage?: string;
  isInBoardCard?: boolean;
}

export function MobileCardList<TData>({
  data,
  keyExtractor,
  renderHeader,
  fields,
  onItemClick,
  emptyMessage = "No results.",
  isInBoardCard = false,
}: MobileCardListProps<TData>) {
  if (!data.length) {
    return (
      <div className="py-10 text-center text-slate-500">{emptyMessage}</div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        isInBoardCard && "border-b border-gray-border pb-2"
      )}
    >
      {data.map((item) => (
        <div
          key={keyExtractor(item)}
          className={cn(
            "border border-gray-border rounded-xl overflow-hidden",
            isInBoardCard && "border-x-0 border-b-0 rounded-none"
          )}
          onClick={() => onItemClick?.(item)}
        >
          <div className="p-4 pb-2">{renderHeader(item)}</div>

          <div className="px-4 pb-4 text-xs">
            {fields.map((field, index) => (
              <div
                key={field.key}
                className={index < fields.length - 1 ? "pb-2" : ""}
              >
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-normal">
                    {field.label}
                  </span>
                  <span className="[&_*]:!font-medium">
                    {field.render(item)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
