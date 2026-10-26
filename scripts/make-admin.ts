/**
 * Admin upgrade script.
 *
 * Usage:
 *   npx tsx scripts/make-admin.ts your@email.com
 *
 * Run ONCE to promote your own account to admin.
 */

import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error("❌  Usage: npx tsx scripts/make-admin.ts <your@email.com>");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.error(`❌  No user found with email: ${email}`);
    console.error("    Make sure you have signed up first.");
    process.exit(1);
  }

  await prisma.user.update({
    where: { email },
    data: { role: "admin" },
  });

  console.log(`✅  ${email} is now an admin.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
