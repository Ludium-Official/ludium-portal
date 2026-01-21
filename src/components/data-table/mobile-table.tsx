import { flexRender } from '@tanstack/react-table';
import type { Row, Table } from '@tanstack/react-table';
import type { ReactNode } from 'react';

export interface MobileTableHeaderLabels {
  [key: string]: string;
}

interface MobileTableProps<TData> {
  table: Table<TData>;
  headerLabels: MobileTableHeaderLabels;
  renderRowHeader?: (row: TData) => ReactNode;
  onRowClick?: (row: TData) => void;
  excludeColumns?: string[];
}

export function MobileTable<TData>({
  table,
  headerLabels,
  renderRowHeader,
  onRowClick,
  excludeColumns = [],
}: MobileTableProps<TData>) {
  const headers = table.getHeaderGroups()[0]?.headers || [];
  const rows = table.getRowModel().rows;

  const renderRow = (row: Row<TData>) => {
    return (
      <div key={row.id} className="border border-gray-border rounded-xl overflow-hidden">
        {renderRowHeader && <div className="p-4 pb-3">{renderRowHeader(row.original)}</div>}
        <div className="cursor-pointer" onClick={() => onRowClick?.(row.original)}>
          {row.getVisibleCells().map((cell, index) => {
            const header = headers[index];
            const headerId = header?.id || '';

            if (excludeColumns.includes(headerId)) return null;

            const headerText = headerLabels[headerId];
            if (!headerText) return null;

            return (
              <div key={cell.id} className="flex justify-between items-center px-4 pb-3 text-xs">
                <span className="text-slate-400 font-normal">{headerText}</span>
                <span className="[&_*]:!font-medium">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (!rows.length) {
    return <div className="py-10 text-center text-slate-500">No results.</div>;
  }

  return <div className="flex flex-col gap-3">{rows.map(renderRow)}</div>;
}
