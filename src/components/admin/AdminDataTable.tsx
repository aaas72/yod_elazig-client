"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, ChevronDown } from 'lucide-react';

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface AdminDataTableProps<T> {
  title: string;
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  onAdd?: () => void;
  addLabel?: string;
  pagination?: { page: number; pages: number; total: number; limit?: number };
  onPageChange?: (page: number) => void;
  actions?: (item: T) => React.ReactNode;
  emptyMessage?: string;
}

export default function AdminDataTable<T extends { _id: string }>({
  title,
  data: rawData,
  columns,
  loading,
  search,
  onSearchChange,
  searchPlaceholder = 'بحث...',
  onAdd,
  addLabel = 'إضافة',
  pagination,
  onPageChange,
  actions,
  emptyMessage = 'لا توجد بيانات',
}: AdminDataTableProps<T>) {
  const PAGE_SIZE = 10;
  const data = Array.isArray(rawData) ? rawData : [];
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Reset visible count when search changes or data reloads
  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [search, rawData]);

  const visibleData = data.slice(0, visibleCount);
  const hasMore = visibleCount < data.length;
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <div className="flex flex-row flex-wrap items-center gap-3 w-full sm:w-auto">
          {onSearchChange && (
            <div className="relative flex-1 min-w-0 sm:w-64">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pr-10 pl-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              />
            </div>
          )}
          {onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors whitespace-nowrap"
            >
              <Plus size={16} />
              <span>{addLabel}</span>
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p>{emptyMessage}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-max text-sm">
              <thead className="hidden sm:table-header-group">
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {columns.map((col) => (
                    <th key={col.key} className={`text-right px-5 py-3.5 font-medium text-gray-500 ${col.className || ''}`}>
                      {col.label}
                    </th>
                  ))}
                  {actions && <th className="text-right px-5 py-3.5 font-medium text-gray-500 w-32">إجراءات</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {visibleData.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors block sm:table-row odd:bg-white even:bg-gray-50 border-b sm:border-none border-gray-400">
                    {columns.map((col) => (
                      <td key={col.key} data-label={col.label}
                        className={`px-5 py-4 break-words whitespace-nowrap relative block sm:table-cell ${col.className || ''}`}
                      >
                        {col.render ? col.render(item) : (item as any)[col.key]}
                      </td>
                    ))}
                    {actions && <td data-label="إجراءات" className="px-5 py-4 relative block sm:table-cell">{actions(item)}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              يُعرض <span className="font-medium text-gray-700">{visibleCount}</span> من <span className="font-medium text-gray-700">{data.length}</span>
            </p>
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
            >
              <ChevronDown size={15} />
              <span>عرض المزيد</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
