import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = new Set(process.argv.slice(2));

function git(gitArgs, options = {}) {
  const result = spawnSync('git', gitArgs, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    const details = (result.stderr || result.stdout || '').trim();
    throw new Error(`git ${gitArgs.join(' ')} 失败${details ? `：${details}` : ''}`);
  }
  return (result.stdout || '').trim();
}

const status = git(['status', '--porcelain']);
if (status && !args.has('--allow-dirty')) {
  throw new Error('工作区有未提交修改。请先提交或暂存修改，确认后再运行同步；如需仅检查远端可使用 --allow-dirty。');
}

const branch = git(['branch', '--show-current']);
if (!branch) throw new Error('当前不在 Git 分支上，无法执行自动同步。');

git(['fetch', 'origin', 'main']);
const [ahead, behind] = git(['rev-list', '--left-right', '--count', 'HEAD...origin/main'])
  .split(/\s+/)
  .map(Number);

if (behind === 0) {
  console.log(`已是最新：${branch} 与 origin/main 没有待同步提交（本地领先 ${ahead}）。`);
  process.exit(0);
}

if (status) {
  throw new Error('远端有待同步提交，但工作区不干净。为避免覆盖本地修改，自动合并已停止。');
}

if (args.has('--check-only')) {
  console.log(`检测到 ${behind} 个待同步提交；使用 npm run sync:upstream 执行快进同步。`);
  process.exit(2);
}

if (ahead === 0) {
  git(['merge', '--ff-only', 'origin/main']);
  console.log(`同步完成：${branch} 已快进 ${behind} 个提交到 origin/main。`);
  process.exit(0);
}

try {
  git(['rebase', 'origin/main']);
  console.log(`同步完成：已取得 ${behind} 个上游提交，并将 ${ahead} 个本地提交重新衔接到 origin/main。`);
} catch (error) {
  spawnSync('git', ['rebase', '--abort'], { cwd: root, stdio: 'ignore' });
  throw new Error(`上游同步产生冲突，已中止并恢复同步前状态。${error.message}`);
}
