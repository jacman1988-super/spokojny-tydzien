import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
test('Preview serves assets and keeps private project files inaccessible', async () => {
  const child = spawn(process.execPath, ['server.mjs'], { cwd: new URL('../', import.meta.url), env: { ...process.env, PORT: '18770' }, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
  try {
    const ready = await Promise.race([
      once(child.stdout, 'data'),
      once(child, 'exit').then(() => { throw new Error('Preview exited before ready'); }),
      new Promise((_, reject) => { const timer = setTimeout(() => reject(new Error('Preview startup timeout')), 5000); timer.unref(); })
    ]);
    assert.match(String(ready[0]), /127\.0\.0\.1:18770/);
    for (const path of ['/', '/app.mjs', '/planner.mjs', '/styles.css', '/storage.mjs']) {
      const response = await fetch(`http://127.0.0.1:18770${path}`, { signal: AbortSignal.timeout(3000) });
      assert.equal(response.status, 200, path); assert.ok((await response.text()).length > 0);
    }
    for (const path of ['/devpost/learner-profile.md', '/.git/config', '/.env', '/tests/planner.test.mjs', '/../../devpost/learner-profile.md']) {
      const response = await fetch(`http://127.0.0.1:18770${path}`, { signal: AbortSignal.timeout(3000) });
      assert.equal(response.status, 404, path);
    }
    assert.equal((await fetch('http://127.0.0.1:18770/', { method: 'POST', signal: AbortSignal.timeout(3000) })).status, 405);
  } finally { child.kill(); await once(child, 'exit').catch(() => {}); }
});
