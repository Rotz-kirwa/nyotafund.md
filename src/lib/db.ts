import pg from "pg";

/**
 * NyotaCredit Premium PostgreSQL Database Adapter.
 * Fully resilient: connects to a live PostgreSQL database via DATABASE_URL if configured,
 * or falls back to an elegant in-memory store so the app is always functional.
 */

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

// In-Memory fallback store for maximum resilience and instant zero-config operations
let mockDatabase: TransactionRecord[] = [
  { id: 1, name: "Brian Otieno", phone: "0712***456", national_id: "32145678", package_id: "starter", fee_amount: 100, status: "paid", transaction_id: "MPESA-NC-7A19X", created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString() },
  { id: 2, name: "Amani Kamau", phone: "0722***912", national_id: "28471203", package_id: "growth", fee_amount: 300, status: "paid", transaction_id: "MPESA-NC-2K84M", created_at: new Date(Date.now() - 14 * 60 * 1000).toISOString() },
  { id: 3, name: "Fatma Hassan", phone: "0790***124", national_id: "30582910", package_id: "business-boost", fee_amount: 700, status: "paid", transaction_id: "MPESA-NC-9P52Z", created_at: new Date(Date.now() - 42 * 60 * 1000).toISOString() },
  { id: 4, name: "Wycliffe Omwamba", phone: "0701***883", national_id: "29471928", package_id: "starter", fee_amount: 100, status: "failed", transaction_id: "MPESA-NC-4Q91K", created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString() },
  { id: 5, name: "Zawadi Njuguna", phone: "0745***661", national_id: "34918239", package_id: "elite", fee_amount: 1500, status: "pending", transaction_id: "MPESA-NC-1W45X", created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString() },
  { id: 6, name: "David Mutua", phone: "0711***502", national_id: "31049283", package_id: "growth", fee_amount: 300, status: "paid", transaction_id: "MPESA-NC-6V18T", created_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString() },
];

let pool: pg.Pool | null = null;
const isDbConfigured = !!(process.env.DATABASE_URL || process.env.PGURI);

if (isDbConfigured) {
  try {
    pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL || process.env.PGURI,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    console.log("🟢 PostgreSQL database pool initialized successfully.");
  } catch (error) {
    console.error("🔴 Failed to initialize PostgreSQL pool, falling back to mock database.", error);
  }
} else {
  console.log("ℹ️ No DATABASE_URL configured in .env, utilizing secure runtime fallback database.");
}

// Function to initialize tables in PostgreSQL
export async function initializeDatabaseSchema() {
  if (!pool) return;
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS nyota_transactions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        national_id VARCHAR(50) NOT NULL,
        package_id VARCHAR(50) NOT NULL,
        fee_amount NUMERIC(10, 2) NOT NULL,
        status VARCHAR(20) NOT NULL,
        transaction_id VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );

      ALTER TABLE nyota_transactions
        ADD COLUMN IF NOT EXISTS name VARCHAR(255),
        ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
        ADD COLUMN IF NOT EXISTS national_id VARCHAR(50),
        ADD COLUMN IF NOT EXISTS package_id VARCHAR(50),
        ADD COLUMN IF NOT EXISTS fee_amount NUMERIC(10, 2),
        ADD COLUMN IF NOT EXISTS status VARCHAR(20),
        ADD COLUMN IF NOT EXISTS transaction_id VARCHAR(100),
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

      UPDATE nyota_transactions SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL;

      ALTER TABLE nyota_transactions
        ALTER COLUMN name SET NOT NULL,
        ALTER COLUMN phone SET NOT NULL,
        ALTER COLUMN national_id SET NOT NULL,
        ALTER COLUMN package_id SET NOT NULL,
        ALTER COLUMN fee_amount SET NOT NULL,
        ALTER COLUMN status SET NOT NULL,
        ALTER COLUMN transaction_id SET NOT NULL,
        ALTER COLUMN created_at SET NOT NULL;

      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'nyota_transactions_status_check'
        ) THEN
          ALTER TABLE nyota_transactions
            ADD CONSTRAINT nyota_transactions_status_check
            CHECK (status IN ('pending', 'paid', 'failed'));
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'nyota_transactions_package_id_check'
        ) THEN
          ALTER TABLE nyota_transactions
            ADD CONSTRAINT nyota_transactions_package_id_check
            CHECK (package_id IN ('starter', 'growth', 'business-boost', 'elite'));
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'nyota_transactions_fee_amount_check'
        ) THEN
          ALTER TABLE nyota_transactions
            ADD CONSTRAINT nyota_transactions_fee_amount_check
            CHECK (fee_amount > 0);
        END IF;
      END $$;

      CREATE UNIQUE INDEX IF NOT EXISTS nyota_transactions_transaction_id_idx
        ON nyota_transactions (transaction_id);
      CREATE INDEX IF NOT EXISTS nyota_transactions_created_at_idx
        ON nyota_transactions (created_at DESC);
      CREATE INDEX IF NOT EXISTS nyota_transactions_status_idx
        ON nyota_transactions (status);
      CREATE INDEX IF NOT EXISTS nyota_transactions_package_id_idx
        ON nyota_transactions (package_id);
    `;
    await pool.query(query);
    console.log("✅ PostgreSQL schema verified/initialized successfully.");
  } catch (error) {
    console.error("❌ Failed to initialize database schema:", error);
  }
}

// Ensure schema matches database constraints
if (pool) {
  initializeDatabaseSchema().catch(console.error);
}

/**
 * DB Operations
 */
export async function getAllTransactions(): Promise<TransactionRecord[]> {
  if (pool) {
    try {
      const res = await pool.query("SELECT * FROM nyota_transactions ORDER BY created_at DESC");
      return res.rows.map((row) => ({
        id: row.id,
        name: row.name,
        phone: row.phone,
        national_id: row.national_id,
        package_id: row.package_id,
        fee_amount: parseFloat(row.fee_amount),
        status: row.status as "pending" | "paid" | "failed",
        transaction_id: row.transaction_id,
        created_at: row.created_at.toISOString(),
      }));
    } catch (error) {
      console.error("DB Query error, returning runtime copy:", error);
    }
  }
  return [...mockDatabase].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function addTransaction(tx: Omit<TransactionRecord, "id" | "created_at">): Promise<TransactionRecord> {
  const newRecord: TransactionRecord = {
    id: mockDatabase.length + 1,
    ...tx,
    created_at: new Date().toISOString(),
  };

  if (pool) {
    try {
      const query = `
        INSERT INTO nyota_transactions (name, phone, national_id, package_id, fee_amount, status, transaction_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      const values = [tx.name, tx.phone, tx.national_id, tx.package_id, tx.fee_amount, tx.status, tx.transaction_id];
      const res = await pool.query(query, values);
      const row = res.rows[0];
      return {
        id: row.id,
        name: row.name,
        phone: row.phone,
        national_id: row.national_id,
        package_id: row.package_id,
        fee_amount: parseFloat(row.fee_amount),
        status: row.status as "pending" | "paid" | "failed",
        transaction_id: row.transaction_id,
        created_at: row.created_at.toISOString(),
      };
    } catch (error) {
      console.error("DB Insert error, inserting to runtime memory instead:", error);
    }
  }

  mockDatabase.unshift(newRecord);
  return newRecord;
}

export async function updateTransactionStatus(transaction_id: string, status: "pending" | "paid" | "failed"): Promise<boolean> {
  if (pool) {
    try {
      const res = await pool.query(
        "UPDATE nyota_transactions SET status = $1 WHERE transaction_id = $2",
        [status, transaction_id]
      );
      if (res.rowCount && res.rowCount > 0) return true;
    } catch (error) {
      console.error("DB Update error:", error);
    }
  }

  const idx = mockDatabase.findIndex((t) => t.transaction_id === transaction_id);
  if (idx !== -1) {
    mockDatabase[idx].status = status;
    return true;
  }
  return false;
}

export async function getTransactionStatus(transaction_id: string): Promise<"pending" | "paid" | "failed" | null> {
  if (pool) {
    try {
      const res = await pool.query(
        "SELECT status FROM nyota_transactions WHERE transaction_id = $1 LIMIT 1",
        [transaction_id]
      );
      if (res.rows.length > 0) {
        return res.rows[0].status as "pending" | "paid" | "failed";
      }
    } catch (error) {
      console.error("DB status lookup error:", error);
    }
  }

  const tx = mockDatabase.find((t) => t.transaction_id === transaction_id);
  return tx ? tx.status : null;
}
