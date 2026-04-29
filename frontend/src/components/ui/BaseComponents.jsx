import React from 'react';
import { cn } from '@/lib/utils';
import { STATUS_COLORS } from '@/constants/enums';

export function Badge({ children, status, className }) {
  const colorClass = STATUS_COLORS[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  
  return (
    <span className={cn(
      "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider transition-colors duration-200",
      colorClass,
      className
    )}>
      {children || status}
    </span>
  );
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  className, 
  ...props 
}) {
  const variants = {
    primary: 'bg-[#2563EB] text-white hover:bg-blue-700 shadow-sm focus-visible:ring-blue-600',
    secondary: 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-sm focus-visible:ring-slate-400',
    outline: 'bg-transparent text-[#2563EB] border border-[#2563EB] hover:bg-blue-50 focus-visible:ring-blue-600',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-400',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm focus-visible:ring-rose-600',
  };

  const sizes = {
    sm: 'px-4 py-2 text-[13px] font-semibold',
    md: 'px-5 py-2.5 text-sm font-semibold',
    lg: 'px-6 py-3 text-base font-bold',
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="mr-2 h-4 w-4 animate-spin text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}

export function Card({ children, title, subtitle, footer, className }) {
  return (
    <div className={cn("bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden", className)}>
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          {title && <h3 className="text-lg font-bold text-[#0F172A] leading-tight tracking-tight">{title}</h3>}
          {subtitle && <p className="mt-1 text-xs font-semibold text-[#64748B] uppercase tracking-wider">{subtitle}</p>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
          {footer}
        </div>
      )}
    </div>
  );
}

export function Input({ label, error, className, ...props }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        className={cn(
          "w-full rounded-lg border border-slate-200 px-4 py-2 text-sm transition-all duration-200 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500 placeholder:text-slate-400",
          error && "border-rose-500 focus:border-rose-500 focus:ring-rose-100"
        )}
        {...props}
      />
      {error && <p className="text-xs text-rose-500 font-medium animate-in fade-in slide-in-from-top-1">{error}</p>}
    </div>
  );
}

export function Select({ label, error, options = [], className, ...props }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <select
        className={cn(
          "w-full rounded-lg border border-slate-200 px-4 py-2 text-sm transition-all duration-200 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500",
          error && "border-rose-500 focus:border-rose-500 focus:ring-rose-100"
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
}
