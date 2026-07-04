import React from 'react';

export function CardSkeleton() {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-5 animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <div className="bg-slate-200 h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-slate-200 rounded-md w-2/3" />
          <div className="h-3 bg-slate-200 rounded-md w-1/2" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-slate-200 rounded-md w-full" />
        <div className="h-3 bg-slate-200 rounded-md w-5/6" />
      </div>
      <div className="h-9 bg-slate-200 rounded-lg w-full" />
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="animate-pulse border-b border-slate-100">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-slate-200 rounded-md w-3/4" />
        </td>
      ))}
    </tr>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-xs">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
        <div className="h-5 bg-slate-200 rounded-md w-1/4 animate-pulse" />
      </div>
      <table className="w-full">
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} cols={cols} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
