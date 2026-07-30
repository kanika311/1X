import dns from "dns";

import mongoose from "mongoose";

// Some ISP / WiFi DNS resolvers refuse MongoDB Atlas SRV queries
// (querySrv ECONNREFUSED). Force reliable public DNS so mongodb+srv works.
try {
  dns.setServers(["8.8.8.8", "1.1.1.1", ...dns.getServers()]);
} catch {
  /* ignore — fall back to system DNS */
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cached;

let migrationsRun = false;

/** One-time: migrate the legacy global-unique email index to a per-role unique index. */
async function runUserIndexMigration() {
  if (migrationsRun) return;
  migrationsRun = true;
  try {
    const coll = mongoose.connection.db?.collection("users");
    if (!coll) return;

    const indexes = await coll.indexes();
    const legacyEmail = indexes.find((i) => i.name === "email_1");
    if (legacyEmail) {
      await coll.dropIndex("email_1");
      console.info("[db] Dropped legacy global-unique email index (email_1)");
    }

    // Normalize empty-string emails to unset so the partial unique index stays clean.
    await coll.updateMany({ email: "" }, { $unset: { email: "" } });

    await coll.createIndex(
      { email: 1, role: 1 },
      { unique: true, partialFilterExpression: { email: { $type: "string" } } },
    );
  } catch (err) {
    migrationsRun = false;
    const message = err instanceof Error ? err.message : String(err);
    console.warn("[db] User index migration skipped:", message);
  }
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined");
  }

  if (cached.conn) {
    await runUserIndexMigration();
    return cached.conn;
  }

  if (!cached.promise) {
    mongoose.set("strictQuery", true);
    cached.promise = mongoose.connect(uri).then((m) => m);
  }

  cached.conn = await cached.promise;
  await runUserIndexMigration();
  return cached.conn;
}
