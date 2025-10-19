# KOL.Network 前端项目

## 🎨 项目概述

基于 Next.js + TypeScript + Shadcn/ui 构建的现代化 Web3 任务平台前端。

### ✨ 技术栈

- **框架**: Next.js 14 + TypeScript
- **UI 组件**: Shadcn/ui + Radix UI
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **表单处理**: React Hook Form + Zod
- **钱包集成**: ethers.js
- **国际化**: 中英文双语支持
- **图标**: Lucide React

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
npm run build
npm start
```

## 📁 项目结构

```
frontend/
├── public/              # 静态资源
│   └── logo.png        # Logo 图片
├── src/
│   ├── components/     # React 组件
│   │   ├── ui/        # Shadcn/ui 基础组件
│   │   ├── Button.tsx
│   │   ├── Layout.tsx
│   │   ├── Navbar.tsx
│   │   ├── TaskCard.tsx
│   │   └── ...
│   ├── pages/         # Next.js 页面
│   │   ├── index.tsx  # 首页 ✅
│   │   ├── tasks.tsx  # 任务大厅 ✅
│   │   ├── my-tasks.tsx  # 我的任务 🚧
│   │   └── profile.tsx   # 个人中心 🚧
│   ├── hooks/         # 自定义 Hooks
│   │   └── useTranslation.ts
│   ├── store/         # Zustand 状态管理
│   │   └── authStore.ts
│   ├── services/      # API 服务
│   │   └── mockApi.ts
│   ├── locales/       # 国际化翻译文件
│   │   ├── zh.json    # 中文
│   │   └── en.json    # 英文
│   ├── lib/           # 工具函数
│   │   └── utils.ts
│   └── styles/        # 全局样式
│       └── globals.css
├── mock-data/         # 模拟数据（临时目录）
│   ├── tasks.json
│   ├── user.json
│   ├── my-claimed-tasks.json
│   ├── my-published-tasks.json
│   └── withdraw-history.json
└── ...
```

## 🎯 已完成功能

### ✅ 基础设施
- [x] Next.js 项目初始化
- [x] TypeScript 配置
- [x] Tailwind CSS + Shadcn/ui 配置
- [x] 中英文国际化支持
- [x] 状态管理（Zustand）
- [x] Mock API 数据

### ✅ UI 组件库
- [x] Button（按钮）
- [x] Card（卡片）
- [x] Dialog（对话框）
- [x] Badge（徽章）
- [x] Input（输入框）
- [x] Label（标签）
- [x] Textarea（文本域）
- [x] Tabs（标签页）

### ✅ 页面
- [x] **首页** - 现代化设计，包含 Hero 区域、统计数据、平台特色
- [x] **任务大厅** - 任务列表、任务卡片、任务详情弹窗

### 🚧 进行中
- [ ] 我的任务页面
- [ ] 个人中心页面
- [ ] 发布任务功能
- [ ] 登录注册流程
- [ ] 钱包连接功能

## 🎨 设计特色

### 现代化 UI
- ✨ 渐变色背景和文字效果
- 🎯 卡片悬停动画
- 🌈 彩色图标和徽章
- 📱 完全响应式设计
- 🎭 流畅的过渡动画

### 组件特点
- 基于 Radix UI，无障碍性极佳
- 完全可定制的样式
- 支持深色模式（已配置）
- 一致的设计语言

## 🌍 国际化

项目支持中英文切换：

- 中文（默认）：`/zh`
- 英文：`/en`

翻译文件位于 `src/locales/` 目录。

## 📦 Mock 数据

所有 API 数据都是模拟的，存储在 `mock-data/` 目录（临时目录，可随时删除）：

- `tasks.json` - 任务列表数据
- `user.json` - 用户信息
- `my-claimed-tasks.json` - 我领取的任务
- `my-published-tasks.json` - 我发布的任务
- `withdraw-history.json` - 提现记录

Mock API 服务位于 `src/services/mockApi.ts`，模拟网络延迟和真实 API 响应。

## 🔧 开发指南

### 添加新页面

1. 在 `src/pages/` 创建新文件
2. 使用 `Layout` 组件包裹页面内容
3. 使用 `useTranslation` Hook 获取翻译

```tsx
import Layout from '@/components/Layout'
import { useTranslation } from '@/hooks/useTranslation'

export default function NewPage() {
  const { t } = useTranslation()
  
  return (
    <Layout>
      <h1>{t('page.title')}</h1>
    </Layout>
  )
}
```

### 添加新组件

使用 Shadcn/ui 组件作为基础：

```tsx
import { Button } from '@/components/Button'
import { Card, CardContent } from '@/components/ui/card'

export default function MyComponent() {
  return (
    <Card>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  )
}
```

### 添加翻译

在 `src/locales/zh.json` 和 `src/locales/en.json` 中添加对应的键值对。

## 📝 待办事项

### 高优先级
- [ ] 完成"我的任务"页面（双标签页）
- [ ] 完成"个人中心"页面（余额、提现）
- [ ] 实现发布任务弹窗
- [ ] 实现登录注册流程（4步）
- [ ] 集成 MetaMask 钱包

### 中优先级
- [ ] 添加提交任务功能
- [ ] 添加倒计时组件
- [ ] 添加文件上传组件
- [ ] 优化移动端体验

### 低优先级
- [ ] 添加深色模式切换
- [ ] 添加页面加载动画
- [ ] 添加错误边界
- [ ] 性能优化

## 🎯 下一步计划

1. **完成核心页面**
   - 我的任务页面（进行中、验证中、已完成等状态）
   - 个人中心页面（用户信息、余额、提现）

2. **实现关键功能**
   - 发布任务流程（表单验证 + 充值）
   - 提交任务流程（上传截图 + 链接）
   - 提现流程（金额验证 + 交易确认）

3. **钱包集成**
   - MetaMask 连接
   - 签名验证
   - 交易处理

4. **优化体验**
   - 响应式设计完善
   - 加载状态优化
   - 错误处理完善

## 📄 许可证

MIT

---

**开发状态**: 🚧 进行中

**最后更新**: 2025-10-18

