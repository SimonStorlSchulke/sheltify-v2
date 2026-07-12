import { type FullConfig } from '@playwright/test';
import { execSync, spawn } from 'node:child_process';



async function globalTeardown(config: FullConfig) {
  killBackend(3000);
}

function killBackend(port: number) {
  try {
    // Get PID using the port
    const output = execSync(
      `netstat -ano | findstr :${port}`,
      { encoding: 'utf-8' }
    );

    const lines = output.trim().split('\n');

    const pids = new Set(
      lines.map(line => line.trim().split(/\s+/).pop())
    );

    for (const pid of Array.from(pids)) {
      if (pid && pid !== '0') {
        execSync(`taskkill /PID ${pid} /F`);
      }
    }
  } catch {
    // No process found → ignore
  }
}

export default globalTeardown;
