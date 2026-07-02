import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string) {
  // Try to find the user first
  const existing = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
  if (existing.length > 0) {
    // If found, update email if it changed or just return
    if (existing[0].email !== email) {
      await db.update(users).set({ email }).where(eq(users.uid, uid));
      existing[0].email = email;
    }
    return existing[0];
  }

  // Insert the new user
  await db.insert(users).values({ uid, email });
  
  // Fetch again to return the full user record with auto-incremented ID
  const fresh = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
  return fresh[0];
}
