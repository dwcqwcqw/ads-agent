# 广告流量智能系统 - AI 多智能体对话界面

基于 LangChain Deep Agents UI 框架改造的多智能体对话展示系统。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **UI**: React + Tailwind CSS + shadcn/ui
- **样式**: 自定义深色主题，渐变背景
- **动画**: CSS 动画 + React state

## 项目结构

```
├── src/
│   ├── app/
│   │   ├── page.tsx          # 主页面 - 多智能体对话界面
│   │   ├── layout.tsx         # 根布局
│   │   ├── globals.css        # 全局样式
│   │   └── components/
│   │       ├── ChatMessage.tsx     # 消息组件
│   │       ├── AgentCard.tsx      # 智能体卡片
│   │       ├── AdBanner.tsx       # 广告Banner展示
│   │       └── StatusIndicator.tsx # 状态指示器
│   ├── components/
│   │   └── ui/                # shadcn/ui 组件
│   ├── lib/
│   │   └── utils.ts           # 工具函数
│   └── providers/
│       └── AgentProvider.tsx   # 智能体状态管理
├── public/
│   └── example_ad_creative.jpg # 示例广告图片
├── package.json
├── tailwind.config.mjs
└── next.config.ts
```

## 功能特性

### 1. 多智能体对话展示
- Agent 1: 用户画像分析
- Agent 2: 数据补全与增强
- Agent 3: 广告匹配
- Agent 4: 广告创意生成
- Agent 5: AI销售对话
- Agent 6: 优化分析

### 2. 实时状态展示
- 智能体执行状态（等待/执行中/完成）
- 消息流展示
- 执行进度指示

### 3. 广告创意展示
- 匹配广告卡片
- 广告Banner预览
- 示例图片展示

### 4. 销售对话模拟
- 多轮对话展示
- 对话气泡样式
- 销售策略说明

## 启动方式

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

访问 http://localhost:3001

## 自定义配置

在 `src/lib/config.ts` 中可以修改：

- 默认智能体配置
- 示例数据
- 广告池配置
- 对话模板

## 截图

[将在此添加系统截图]

## License

MIT
