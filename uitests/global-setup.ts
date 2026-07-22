import { chromium, type FullConfig, request } from '@playwright/test';
import { execSync, spawn } from 'node:child_process';
import * as net from 'node:net';
import path from 'path';

async function globalSetup(config: FullConfig) {
  await resetDbAndBackend();
}

async function resetDbAndBackend() {
  execSync(
    `wsl docker compose -f ./docker-compose.yml down -v`,
    { stdio: 'inherit' }
  );

  execSync(
    `wsl docker compose -f ./docker-compose.yml up -d`,
    { stdio: 'inherit' }
  );

  await new Promise(resolve => setTimeout(resolve, 5000));

  killBackend(3000);
  startBackend();

  await waitForBackend();

  await createTesData();

  console.log('Backend is up and running');
}

function killBackend(port: number) {
  try {
    // Get PID using the port
    const output: string = execSync(
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

function startBackend() {
  const backendPath = path.resolve(__dirname, '../sheltify-backend');

  const proc = spawn('go', ['run', '.'], {
    cwd: backendPath,
    stdio: 'inherit',
    env: {
      ...process.env,
      USE_TEST_DB: 'true',
      API_BEARER: 'test_bearer',
    },
  });

  return proc;
}

async function waitForBackend(port = 3000, host = 'localhost', timeout = 30000) {
  const start = Date.now();

  return new Promise<void>((resolve, reject) => {
    const tryConnect = () => {
      const socket = new net.Socket();

      socket
        .once('connect', () => {
          socket.destroy();
          resolve();
        })
        .once('error', () => {
          socket.destroy();
          if (Date.now() - start > timeout) {
            reject(new Error('Timeout waiting for DB'));
          } else {
            setTimeout(tryConnect, 500);
          }
        })
        .connect(port, host);
    };

    tryConnect();
  });
}

async function createTesData() {
  const apiContext = await request.newContext({
    baseURL: 'http://localhost:3000',
    extraHTTPHeaders: {
      'Authorization': 'Bearer test_bearer',
    },
  });

  const tenantForm = new FormData();
  tenantForm.append('ID', 'test');
  tenantForm.append('Name', 'Testorga');
  tenantForm.append('SiteUrl', 'http://localhost:4205');

  const userForm = new FormData();
  userForm.append('username', 'testuser');
  userForm.append('password', 'Test12345678');
  userForm.append('tenant', 'test');
  userForm.append('email', 'test@test.test');
  userForm.append('role', 'SUPERADMIN');


  // Send POST request
  const tenantResponse = await apiContext.post('/admin/api/create-tenant', {
    multipart: tenantForm,
  });

  if (!tenantResponse.ok()) {
    throw new Error(`Failed to create user: ${tenantResponse.status()} ${await tenantResponse.text()}`);
  }

  // Send POST request
  const userResponse = await apiContext.post('/admin/api/create-user', {
    multipart: userForm,
  });

  if (!userResponse.ok()) {
    throw new Error(`Failed to create user: ${userResponse.status()} ${await userResponse.text()}`);
  }

  console.log('User created successfully');

  await apiContext.dispose();
}


export default globalSetup;
