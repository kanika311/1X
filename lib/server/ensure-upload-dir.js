import fs from "fs";
import path from "path";

/**
 * Ensures UPLOAD_DIR exists as a directory.
 * If a file blocks the path (common when a stray image was saved as "uploads"), move it aside.
 */
export function ensureUploadDir(dir) {
  if (fs.existsSync(dir)) {
    const stat = fs.statSync(dir);
    if (stat.isDirectory()) return dir;

    const backupName = `uploads-backup-${Date.now()}.jpg`;
    const backupPath = path.join(path.dirname(dir), backupName);
    fs.renameSync(dir, backupPath);

    fs.mkdirSync(dir, { recursive: true });
    try {
      fs.renameSync(backupPath, path.join(dir, backupName));
    } catch {
      /* keep backup next to uploads/ if move fails */
    }
    return dir;
  }

  fs.mkdirSync(dir, { recursive: true });
  return dir;
}
