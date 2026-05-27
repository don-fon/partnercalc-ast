# 星极抽卡

FFXIV 占星术士发卡收益分析工具。项目基于原舞者搭档收益计算工具改造，当前目标是分析占星在 FFLogs 战斗记录中的 `太阳神之衡` / `战争神之枪` 发卡收益。

线上地址：

https://don-fon.github.io/partnercalc-ast/

## 功能

- 从 FFLogs 报告链接读取战斗事件。
- 识别占星发出的两种输出卡：
  - `太阳神之衡`
  - `战争神之枪`
- 按每一次发卡分别计算：
  - 实际发卡目标收益
  - 当次最优目标收益
  - 实际与最优之间的损失
- 汇总展示两种卡的整体收益。
- 提供右侧时间轴，方便跳转到每次发卡窗口。
- 每次发卡窗口提供 FFLogs 时间轴外链。
- `/test` 页面使用本地匿名 fixture，便于调试 UI 和计算逻辑。

## 本地开发

要求：

- Git
- Node.js 20

安装依赖：

```powershell
npm install
```

配置环境变量：

```powershell
Copy-Item .env_dev .env
```

然后在 `.env` 中填写 FFLogs v1 API key 以及需要的 API 地址。

启动开发服务器：

```powershell
npm run serve
```

默认访问：

```text
http://localhost:7000/
```

测试数据页面：

```text
http://localhost:7000/test
```

## 构建

```powershell
npm run build
```

GitHub Pages 部署时通过 `REPO_NAME` 注入子路径，例如：

```powershell
$env:REPO_NAME = 'partnercalc-ast'
npm run build
Remove-Item Env:\REPO_NAME
```

## 项目说明

本项目由 `don-fon` 维护：

https://github.com/don-fon

原项目仓库：

- https://github.com/hintxiv/ts-partnercalc
