/**
 * Frees Next.js dev ports so `.next/` is not locked (avoids EPERM on `.next/trace` on Windows).
 */
import { execSync } from "node:child_process";
import process from "node:process";

const DEFAULT_PORTS = [3000, 3001, 3002, 3003];

function parsePorts(argv) {
  const raw = argv.slice(2).map(Number).filter((n) => n > 0 && n < 65536);
  return raw.length ? raw : DEFAULT_PORTS;
}

function killPidWindows(pid) {
  try {
    execSync(`taskkill /F /PID ${pid}`, { stdio: "pipe" });
    console.log(`Stopped process ${pid}`);
  } catch {
    /* already exited or access denied */
  }
}

function pidsListeningOnPort(output, port) {
  const pids = new Set();
  const portSuffix = `:${port}`;
  for (const line of output.split(/\r?\n/)) {
    const parts = line.trim().split(/\s+/);
    if (parts.length < 5) continue;
    const local = parts[1];
    const state = parts[3];
    const pid = parts[parts.length - 1];
    if (state !== "LISTENING") continue;
    if (!local.endsWith(portSuffix)) continue;
    if (/^\d+$/.test(pid) && pid !== String(process.pid)) pids.add(pid);
  }
  return [...pids];
}

function killPortsWindows(ports) {
  let netstat = "";
  try {
    netstat = execSync("netstat -ano", { encoding: "utf8" });
  } catch {
    console.warn("Could not run netstat — skip port cleanup.");
    return;
  }
  for (const port of ports) {
    for (const pid of pidsListeningOnPort(netstat, port)) killPidWindows(pid);
  }
}

function killPortsUnix(ports) {
  for (const port of ports) {
    try {
      const out = execSync(`lsof -ti:${port}`, { encoding: "utf8" }).trim();
      if (!out) continue;
      for (const pid of out.split(/\n/).filter(Boolean)) {
        if (pid === String(process.pid)) continue;
        execSync(`kill -9 ${pid}`, { stdio: "pipe" });
        console.log(`Stopped process ${pid}`);
      }
    } catch {
      /* nothing listening */
    }
  }
}

const ports = parsePorts(process.argv);
if (process.platform === "win32") killPortsWindows(ports);
else killPortsUnix(ports);
