export type SmsHistoryStatus = "pending" | "used";

export type SmsHistory = {
  id: number;
  uid: string;
  user_id: string;
  email: string;
  code: string;
  status: SmsHistoryStatus;
  expires_at: string;
  create_date: string;
  update_date: string;
};
