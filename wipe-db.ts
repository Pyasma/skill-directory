import prisma from "./db/prisma";

async function main() {
  await prisma.skills.deleteMany({});
  await prisma.projects.deleteMany({});
  console.log("Cleared database.");
}

main().catch(console.error).finally(() => process.exit(0));
