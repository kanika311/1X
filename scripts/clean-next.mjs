/**
 * Deletes `.next`. If locked (Windows EPERM), retries then renames the folder aside.
 * Run `npm run kill-dev` first if clean still fails.
 */
import { existsSync, renameSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextDir = path.join(root, ".next");

function sleep(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    /* busy wait — short delays only */
  }
}

function removeDir(dir) {
  rmSync(dir, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 });
}

function clean() {
  if (!existsSync(nextDir)) {
    console.log("No .next folder to remove.");
    return;
  }

  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      removeDir(nextDir);
      console.log("Removed", nextDir);
      return;
    } catch (err) {
      if (attempt < 5) {
        console.warn(`Retry ${attempt}/5 — ${err.message}`);
        sleep(400 * attempt);
        continue;
      }

      const backup = `${nextDir}.old-${Date.now()}`;
      try {
        renameSync(nextDir, backup);
        console.log("Could not delete .next (locked). Renamed to:", backup);
        console.log("If issues persist, run: npm run kill-dev");
        return;
      } catch (renameErr) {
        console.error("Could not remove or rename .next:", renameErr.message);
        console.error("Run: npm run kill-dev");
        console.error("Then close other terminals / stop pphysiopilates on port 3000, and retry.");
        process.exit(1);
      }
    }
  }
}

clean();
