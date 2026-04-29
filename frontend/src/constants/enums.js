export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ORG_ADMIN: 'ORG_ADMIN',
  USER: 'USER',
};

export const ASSET_STATUS = {
  AVAILABLE: 'AVAILABLE',
  IN_USE: 'IN_USE',
  MAINTENANCE: 'MAINTENANCE',
  RETIRED: 'RETIRED',
};

export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
};

export const STATUS_COLORS = {
  // Asset Statuses (Matching theme badges)
  AVAILABLE: 'bg-[#DCFCE7] text-[#166534] border-[#d1fae5]',
  IN_USE: 'bg-[#DBEAFE] text-[#1E40AF] border-[#dbeafe]',
  MAINTENANCE: 'bg-[#FEF9C3] text-[#854D0E] border-[#fef9c3]',
  RETIRED: 'bg-[#F1F5F9] text-[#475569] border-[#e2e8f0]',

  // Booking Statuses
  PENDING: 'bg-[#DBEAFE] text-[#1E40AF] border-[#dbeafe]',
  APPROVED: 'bg-[#DCFCE7] text-[#166534] border-[#d1fae5]',
  REJECTED: 'bg-[#FEE2E2] text-[#991B1B] border-[#fecaca]',
  CANCELLED: 'bg-[#F1F5F9] text-[#475569] border-[#e2e8f0]',
  COMPLETED: 'bg-[#F5F3FF] text-[#5B21B6] border-[#ddd6fe]',
};
