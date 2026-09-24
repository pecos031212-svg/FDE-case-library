# 更新与同步流程

## 1. 同步上游仓库

在仓库根目录执行：

```bash
npm run sync:upstream
```

这个命令会先拉取 `origin/main` 并检查工作区。没有本地提交时只做快进同步；已有本地维护提交时，会把它们重新衔接到最新上游。若出现冲突，操作会自动中止并恢复同步前状态，不会覆盖本地内容。

只检查是否有更新：

```bash
node scripts/sync-upstream.mjs --check-only
```

## 2. 录入已有资料

先按 `docs/case-intake-template.md` 整理每个案例。`data/cases.json` 是唯一事实源，`data/cases.js`、英文数据和英文页面都属于生成结果，不要直接编辑。

已有资料中无法确认的字段使用“未披露”或在 `verification_notes` 中记录缺口；不要把编辑推演写成客户已确认的事实。

## 3. 生成双语页面并校验

修改中文数据后按顺序执行：

```bash
npm run classify:detail
npm test
```

校验会检查字段完整性、来源 HTTPS、详细度评分、证据边界、中英文案例 ID 与顺序，以及页面入口脚本。

## 4. 定期补充公开来源

公开来源进入维护队列前，至少记录：来源链接、发布者、访问日期、主张来源、是否独立核验和待复核事项。优先补充客户一手材料、工程博客、年报、论文和带明确页码的报告。

每次补充完成后保留变更记录，并在提交前运行 `npm test`。如果只更新来源链接或证据说明，也要重新检查 `source_record` 与 `analysis_boundary` 是否一致。
