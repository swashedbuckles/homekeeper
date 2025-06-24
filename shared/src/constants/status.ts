export const INVITATION_STATUS = {
  PENDING:   'pending',
  EXPIRED:   'expired',
  CANCELLED: 'cancelled',
  REDEEMED:  'redeemed'
} as const;

export type InvitationStatus = typeof INVITATION_STATUS[keyof typeof INVITATION_STATUS];

export const INVITATION_STATUSES = [
  INVITATION_STATUS.PENDING,
  INVITATION_STATUS.EXPIRED,
  INVITATION_STATUS.REDEEMED,
  INVITATION_STATUS.CANCELLED
] as const;
