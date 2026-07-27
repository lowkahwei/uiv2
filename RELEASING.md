```bash
# 在 ~/.npmrc 或项目根目录下的 .npmrc 中配置
//registry.npmjs.org/:_authToken=你的_GRANULAR_TOKEN
```

## 核心概念

发布分为三个阶段：

| 阶段     | 命令                          | 作用                               | 会发布 npm 吗？ |
| -------- | ----------------------------- | ---------------------------------- | --------------- |
| 记录改动 | `pnpm exec changeset`         | 记录受影响的包、版本级别和更新说明 | 否              |
| 生成版本 | `pnpm exec changeset version` | 更新版本、内部依赖和 CHANGELOG     | 否              |
| 正式发布 | `pnpm exec changeset publish` | 将尚未发布的新版本上传到 npm       | 是              |

> 不要使用 `pnpm version`。这是 pnpm 自己的版本信息命令，不会执行本仓库的
> Changesets 脚本。

## 版本级别

- `patch`：向后兼容的 Bug 修复，例如 `2.2.29 → 2.2.30`。
- `minor`：向后兼容的新功能或公开 API，例如 `2.2.29 → 2.3.0`。
- `major`：包含破坏性修改，例如 `2.2.29 → 3.0.0`。

## 1. 创建发布计划

完成代码和测试后运行：

```bash
pnpm exec changeset
```

交互操作：

- `↑` / `↓`：移动。
- `Space`：选择或取消包。
- `Enter`：确认。

只选择实际发生用户可感知改动的包。Changesets 后续可能根据内部依赖关系自动加入其他
patch 包，不需要在这里手动选择所有依赖方。

填写 Summary 时说明用户会得到什么，例如：

```text
Add smooth native drawer animations, swipe-to-dismiss handles, and configurable motion durations.
```

命令只会在 `.changeset/` 中创建 Markdown 发布计划，不会修改版本或发布 npm。

预览计划：

```bash
pnpm exec changeset status
git diff -- .changeset
```

确认后提交：

```bash
git add .changeset
git commit -m "chore: add release changeset"
git push
```

## 2. 生成版本

准备正式发布时，确保工作区干净并已同步远端：

```bash
git status
git pull --ff-only
pnpm exec changeset status
pnpm exec changeset version
pnpm install --lockfile-only
```

`changeset version` 会：

- 修改相关 `package.json` 的版本。
- 更新 workspace 内部依赖版本。
- 更新相关 `CHANGELOG.md`。
- 删除已经消费的 `.changeset/*.md`。

它也可能自动 patch 依赖已更新包的其他 workspace。这是 monorepo 的正常依赖传播。

执行后必须检查：

```bash
git status
git diff
pnpm exec changeset status
```

特别检查 `peerDependencies` 的最低版本。Changesets 不一定会提高仍满足旧范围的 peer
dependency。例如新版 Drawer 依赖新版 Theme 功能时，应确保 Drawer 不允许安装缺少该功能的
旧 Theme。

## 3. 发布前验证

至少执行：

```bash
pnpm build
pnpm test
pnpm typecheck
pnpm lint
pnpm build:sb
```

新增 package 时，必须保留脚手架生成的 `tsup.config.ts`。组件包应至少包含：

```ts
export default defineConfig({
  clean: true,
  target: "es2019",
  format: ["cjs", "esm"],
  banner: {js: '"use client";'},
});
```

发布配置声明的入口必须和实际构建产物一致。对于使用仓库根目录
`clean-package.config.json` 的组件包，在 package 目录中检查：

```bash
pnpm build
test -f dist/index.js
test -f dist/index.mjs
test -f dist/index.d.ts
npm pack --dry-run
```

三个 `test` 命令必须全部成功。尤其不能只确认 `dist/index.js`：发布配置中的
`exports.import` 指向 `dist/index.mjs`，缺少该文件会导致 Next.js 等 ESM 消费方报告
`Module not found`。`npm pack --dry-run` 还应列出这些入口文件。

检查发布包会包含哪些文件：

```bash
pnpm --filter <package-name> exec npm pack --dry-run
```

例如：

```bash
pnpm --filter @sytechui/drawer exec npm pack --dry-run
```

确认版本、CHANGELOG、lockfile 和测试都正确后提交版本变更：

```bash
git add .
git commit -m "chore: release packages"
git push
```

## 4. 正式发布 npm

确认 npm 身份：

```bash
npm whoami
```

发布所有尚未发布的新版本：

```bash
pnpm exec changeset publish
```

这是三个核心命令中唯一会真正修改 npm registry 的命令。已经发布的相同
`package@version` 不能重新覆盖。

发布后验证：

```bash
npm view <package-name> version
npm view <package-name> dist-tags --json
git push --follow-tags
```

例如：

```bash
npm view @sytechui/drawer version
npm view @sytechui/drawer dist-tags --json
```

## 可选：先发布 Canary

重大重构建议先让真实项目和 Safari 实机验证 Canary。由于 Canary 命令会修改本地版本文件，
应在临时分支或 Git worktree 中执行：

```bash
pnpm version:canary
pnpm build
pnpm test
pnpm release:canary
```

安装验证：

```bash
pnpm add @sytechui/drawer@canary
```

Canary 验证完成后，回到包含原始 Changeset 的干净正式分支执行正常版本流程。不要把
snapshot 版本误提交为正式版本。

## 发布失败时

- 不要马上删除 npm 版本，也不要手工复用同一个版本号。
- 先用 `npm view <package> versions --json` 确认哪些包已经成功。
- 修复认证或网络问题后，可再次运行 `pnpm exec changeset publish`；先确认它只准备发布缺失版本。
- 如果代码有问题，发布新的 patch 修复版本。npm 已发布版本不能被覆盖。
- 如果只是 `latest` 指错版本，使用 `npm dist-tag` 修正，不要重新发布相同版本。

## npm 发布通知邮件

npm 会向账号邮箱发送“使用该账号发布了包”的通知。这类邮件用于提醒账号所有者发现未经
授权的发布。npm 当前公开文档没有提供关闭发布通知邮件的 `.npmrc` 或 CLI 配置。

`update-notifier=false` 只会关闭终端中的 npm 版本升级提示，不会关闭发布邮件。

推荐在邮箱中建立过滤规则：

1. 打开一封实际收到的 npm 发布通知。
2. 使用它的发件人和发布通知主题建立过滤条件。
3. 自动添加 `npm-publish` 标签并跳过收件箱，或汇总到专用文件夹。
4. 不要屏蔽全部 npm 邮件，以免漏掉登录、密码重置、2FA 和账号安全通知。

如果不希望发布通知进入日常邮箱，也可以在 npm Account Settings 中改用专门接收发布和安全
通知的邮箱，但该邮箱必须持续可访问。

参考：

- [npm 隐私说明：npm 使用邮箱通知账号发布行为](https://docs.npmjs.com/policies/privacy/)
- [npm 账号设置](https://docs.npmjs.com/managing-your-profile-settings/)
- [npm publish 文档](https://docs.npmjs.com/cli/v11/commands/npm-publish)

## 最短检查表

```bash
# 记录功能改动
pnpm exec changeset
pnpm exec changeset status

# 准备版本
pnpm exec changeset version
pnpm install --lockfile-only
git diff
pnpm build && pnpm test && pnpm typecheck && pnpm lint

# 正式发布
npm whoami
pnpm exec changeset publish
npm view <package-name> version
git push --follow-tags
```
