export interface NotificationLogDTO {
  id: number;
  userId: number;
  referenceId: string;
  type: string;
  channel: string;
  recipient: string;
  subject: string;
  status: string;
  retryCount: number;
  failureReason: string | null;
  createdAt: string;
  sentAt: string | null;
}
