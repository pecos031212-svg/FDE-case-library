# 案例补充模板

每个新案例先填写这份模板，再写入 `data/cases.json`。不确定或未公开的内容写成“未披露”，不要用推测补齐。

## 基本信息

- `id`：小写字母、数字和连字符，例如 `company-001`
- `company`：公司或组织
- `industry` / `industry_group`：行业与行业组
- `scenario`：具体业务场景
- `source`：来源方名称
- `url`：主要来源的 HTTPS 深链接

## 证据记录

- `source_record.title`：来源标题
- `source_record.publisher`：发布者
- `source_record.source_type`：官方案例、工程博客、年报、论文等
- `source_record.directness`：一手、二手或转述
- `source_record.claim_origin`：客户、供应商、研究者或编辑整理
- `source_record.independently_verified`：是否有独立交叉来源
- `source_record.accessed_at`：访问日期，格式为 `YYYY-MM-DD`
- `additional_sources`：补充来源，至少记录标题和 HTTPS 链接

## 案例正文

- `problem`：业务问题与原有基线
- `solution`：公开材料明确描述的解决方案
- `architecture`：架构要素；推演内容必须明确标注
- `components`：公开可确认的模型、系统或数据组件
- `human`：人工审核、责任边界和例外处理
- `fde_actions`：可从材料复原的现场工作
- `result`：结果、指标、范围和对照基线
- `reusable`：可复用经验
- `verification_notes`：证据缺口、未披露内容和复核提醒

## 编辑边界

分别填写 `analysis_boundary.business_problem`、`solution`、`architecture`、`fde_actions` 和 `result`。每一项都要说明哪些是公开事实，哪些是来源方披露，哪些是编辑分析。

完成后执行：

```bash
npm run classify:detail
npm test
```
