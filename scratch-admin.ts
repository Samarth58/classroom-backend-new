import "dotenv/config";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function main() {
  await sql`UPDATE "user" SET role = 'admin' WHERE email = 'admin@example.com'`;
  console.log("SUCCESS: Updated admin@example.com role to admin");
}

main().catch(console.error);
