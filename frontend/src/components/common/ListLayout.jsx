import React from 'react';
import { Search, Filter, Plus, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button, Input, Select, Card } from '@/components/ui/BaseComponents';
import { cn } from '@/lib/utils';

export default function ListLayout({
  title,
  subtitle,
  actions,
  filters,
  searchPlaceholder = "Search...",
  onSearch,
  columns = [],
  data = [],
  isLoading,
  pagination,
  onPageChange,
  emptyMessage = "No records found."
}) {
  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h1>
          {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          {actions}
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-3 bg-white border-none shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
             <input 
                type="text" 
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-[13px] font-medium focus:ring-4 focus:ring-blue-100 focus:border-[#2563EB] focus:outline-none transition-all placeholder:text-slate-400"
                onChange={(e) => onSearch?.(e.target.value)}
             />
          </div>
          <div className="flex flex-wrap items-center gap-2">
             {filters}
          </div>
        </div>
      </Card>

      {/* Table Area */}
      <Card className="overflow-hidden border-none shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                {columns.map((col, idx) => (
                  <th 
                    key={idx} 
                    className={cn(
                      "px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-[#64748B]",
                      col.className
                    )}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 relative">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {columns.map((_, j) => (
                      <td key={j} className="px-6 py-5">
                        <div className="h-3 bg-slate-100 rounded w-3/4"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : data.length > 0 ? (
                data.map((row, idx) => (
                   <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                      {columns.map((col, j) => (
                        <td key={j} className={cn("px-6 py-4 text-[13px] font-medium text-[#0F172A]", col.className)}>
                          {col.cell ? col.cell(row) : row[col.accessor]}
                        </td>
                      ))}
                   </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-16 text-center">
                     <div className="flex flex-col items-center gap-2">
                        <div className="bg-slate-50 p-4 rounded-full">
                           <Search className="h-8 w-8 text-slate-200" />
                        </div>
                        <p className="text-slate-400 font-medium">{emptyMessage}</p>
                     </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {pagination && (
          <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
             <p className="text-[10px] font-black text-[#64748B] uppercase tracking-widest">
               Showing <span className="text-[#0F172A]">{pagination.number * pagination.size + 1}</span> - <span className="text-[#0F172A]">{Math.min((pagination.number + 1) * pagination.size, pagination.totalElements)}</span> of <span className="text-[#0F172A]">{pagination.totalElements}</span>
             </p>
             <div className="flex items-center gap-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="h-8 px-3 text-[11px] font-bold uppercase tracking-wider border-slate-200"
                  disabled={pagination.first}
                  onClick={() => onPageChange?.(pagination.number - 1)}
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Prev
                </Button>
                <div className="flex items-center gap-1">
                   {Array.from({ length: Math.min(pagination.totalPages, 5) }).map((_, i) => (
                      <button 
                        key={i}
                        onClick={() => onPageChange?.(i)}
                        className={cn(
                          "h-8 w-8 text-[11px] font-black rounded-lg transition-all",
                          pagination.number === i ? "bg-[#2563EB] text-white shadow-lg shadow-blue-200" : "text-[#64748B] hover:bg-slate-200"
                        )}
                      >
                        {i + 1}
                      </button>
                   ))}
                </div>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="h-8 px-3 text-[11px] font-bold uppercase tracking-wider border-slate-200"
                  disabled={pagination.last}
                  onClick={() => onPageChange?.(pagination.number + 1)}
                >
                  Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
             </div>
          </div>
        )}
      </Card>
    </div>
  );
}
