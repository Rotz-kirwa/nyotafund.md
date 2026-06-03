export interface TransactionRecord {
  id: number;
  name: string;
  phone: string;
  national_id: string;
  package_id: string;
  fee_amount: number;
  status: "pending" | "paid" | "failed";
  transaction_id: string;
  created_at: string;
}
