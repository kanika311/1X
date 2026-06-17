import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { ensureUploadDir } from "../lib/server/ensure-upload-dir.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const uploadDir = path.join(root, "public", "uploads");

ensureUploadDir(uploadDir);
const stat = fs.statSync(uploadDir);
console.log(uploadDir, stat.isDirectory() ? "is a directory" : "still not a directory");
