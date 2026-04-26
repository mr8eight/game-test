# 如果你回到2019：你真的能选对吗？PPT 制作教程

## 目录

1. [项目概述](#项目概述)
2. [技术栈](#技术栈)
3. [文件结构](#文件结构)
4. [数据设计](#数据设计)
5. [组件开发](#组件开发)
   - [第1页：封面与标题](#第1页封面与标题)
   - [第2页：时间轴导航](#第2页时间轴导航)
   - [第3页：季度切换器](#第3页季度切换器)
   - [第4页：市场新闻](#第4页市场新闻)
   - [第5页：行情图表](#第5页行情图表)
   - [第6页：板块价格卡片](#第6页板块价格卡片)
   - [第7页：复盘总结](#第7页复盘总结)
6. [样式设计](#样式设计)
7. [运行部署](#运行部署)

---

## 项目概述

这是一个用于线上会议展示的互动游戏页面，模拟 2019-2021 年疫情期间股市波动。用户可以按季度/周切换，观察不同板块的涨跌情况。

### 核心功能

- 按季度切换的进度导航
- 周级别数据粒度
- 6大行业板块实时价格
- 折线图展示历史走势
- 市场新闻轮播
- 最终复盘总结

---

## 技术栈

- **React 18** + TypeScript
- **Tailwind CSS 4** (via Vite)
- **Recharts** 图表库
- **Vite** 构建工具

### 依赖安装

```bash
npm create vite@latest . -- --template react-ts
npm install
npm install recharts
npm install -D tailwindcss @tailwindcss/vite
```

---

## 文件结构

```
src/
├── App.tsx              # 根组件，渲染主页面
├── main.tsx             # React 入口
├── index.css            # Tailwind 入口
└── StockDisplay.tsx     # 主页面组件（所有内容）
```

---

## 数据设计

### 行业板块配置

```typescript
const SECTORS = ['航空 ✈️', '酒店 🏨', '医疗防护 🏥', '云办公 💻', '游戏娱乐 🎮', '电商 🛒'] as const;
type Sector = typeof SECTORS[number];
```

### 季度数据

```typescript
const ROUNDS = [
  { id: 0, label: '2019 Q1', title: '一切看起来都很正常', period: '2019.01 - 2019.03' },
  { id: 1, label: '2019 Q4', title: '繁荣仍在继续，但微弱信号出现', period: '2019.10 - 2019.12' },
  { id: 2, label: '2020 Q1', title: '不确定性开始放大', period: '2020.01 - 2020.03' },
  { id: 3, label: '2020 Q2', title: '疫情全面冲击市场', period: '2020.04 - 2020.06' },
  { id: 4, label: '2020 Q4', title: '分化后的新格局', period: '2020.10 - 2020.12' },
  { id: 5, label: '2021 Q2', title: '后疫情时代的回归与反思', period: '2021.04 - 2021.06' },
] as const;
```

### 季度锚点价格

```typescript
const INITIAL_PRICES: Record<Sector, number[]> = {
  '航空 ✈️': [100, 108, 78, 52, 68, 92],
  '酒店 🏨': [100, 106, 72, 48, 62, 88],
  '医疗防护 🏥': [100, 102, 135, 190, 230, 205],
  '云办公 💻': [100, 105, 145, 220, 280, 250],
  '游戏娱乐 🎮': [100, 110, 125, 160, 185, 170],
  '电商 🛒': [100, 112, 118, 140, 165, 180],
};
```

### 周数据生成算法

每季度 13 周，通过插值 + 噪声生成平滑曲线：

```typescript
const generateWeeklyData = () => {
  // 季度锚点 → 线性插值 → 添加噪声 → 事件加成
  // 航空 ✈️ 在 2020 Q1 末（疫情爆发）: -15 加成
  // 医疗防护 🏥 在 2020 Q2: +25 加成（口罩需求暴涨）
  // ...
};
```

---

## 组件开发

### 基础框架

```typescript
import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, ... } from 'recharts';

export default function StockDisplay() {
  const [currentRound, setCurrentRound] = useState(0);
  const [currentWeek, setCurrentWeek] = useState(0);
  // ...
}
```

---

### 第1页：封面与标题

**目标**：展示主标题、副标题、当前时间信息

**代码位置**：`StockDisplay.tsx` Header 部分

```typescript
<header className="mb-8">
  <div className="flex items-center justify-between mb-6">
    <div>
      <h1 className="text-2xl font-bold tracking-tight">
        <span className="text-white/90">如果你回到</span>
        <span className="text-cyan-400">2019</span>
        <span className="text-white/90">：你真的能选对吗？</span>
      </h1>
      <p className="text-white/40 text-sm mt-1">股票行情模拟 · 投资决策推演</p>
    </div>
    <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10">
      <div className="text-[10px] text-white/40 uppercase tracking-wider">当前</div>
      <div className="text-lg font-mono text-cyan-400">
        {ROUNDS[currentRound].label} W{currentWeek + 1}
      </div>
    </div>
  </div>
</header>
```

**设计要点**：

- 标题使用渐变色 `text-white/90` + `text-cyan-400` 强调关键词
- 时间信息用等宽字体 `font-mono` 增强数字感
- 卡片式信息块带半透明背景 `bg-white/5` 和细边框 `border-white/10`

---

### 第2页：时间轴导航

**目标**：展示6个季度的圆形进度步骤

**代码位置**：`header` 内的 Round Progress 部分

```typescript
<div className="relative mb-4">
  {/* 背景灰线 */}
  <div className="absolute top-5 left-0 right-0 h-[2px] bg-white/10 -z-0"></div>

  {/* 渐变进度线 */}
  <div
    className="absolute top-5 left-0 h-[2px] bg-gradient-to-r from-cyan-500 to-blue-500 -z-0"
    style={{ width: `${(currentRound / 5) * 100}%` }}
  ></div>

  {/* 圆形步骤按钮 */}
  <div className="flex items-center justify-between">
    {ROUNDS.map((round, idx) => (
      <button
        key={round.id}
        onClick={() => idx <= currentRound && goToRound(idx)}
        className={`relative z-10 flex flex-col items-center ${
          idx <= currentRound ? 'cursor-pointer' : 'cursor-not-allowed'
        }`}
      >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
          currentRound === idx
            ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50 scale-110'
            : idx < currentRound
            ? 'bg-white/10 text-white/70 hover:bg-white/20'
            : 'bg-white/5 text-white/30'
        }`}>
          {idx + 1}
        </div>
        <div className={`mt-2 text-xs font-medium ${
          currentRound === idx ? 'text-cyan-400' : 'text-white/40'
        }`}>
          {round.label}
        </div>
      </button>
    ))}
  </div>
</div>
```

**设计要点**：

- 使用 `z-index` 分层：进度线在底层（`-z-0`），按钮在上层（`z-10`）
- 当前选中项用 `scale-110` 放大 + 发光阴影
- 已完成项用较亮的背景，未来项用暗色禁用态
- 进度线宽度动态计算：`${(currentRound / 5) * 100}%`

---

### 第3页：季度切换器

**目标**：周级别滑块，可在当前季度内切换

**代码位置**：`header` 内的 Week Slider 部分

```typescript
<div className="bg-white/5 rounded-xl p-4 border border-white/10">
  <div className="flex items-center justify-between mb-3">
    <span className="text-xs text-white/50 uppercase tracking-wider">本周</span>
    <span className="text-xs text-cyan-400">13 周/季度</span>
  </div>
  <div className="flex items-center gap-4">
    <button onClick={() => goToWeek(Math.max(0, currentWeek - 1))} disabled={...}>←</button>

    {/* 周按钮网格 */}
    <div className="flex-1 flex gap-1">
      {Array.from({ length: WEEKS_PER_QUARTER }, (_, i) => (
        <button
          key={i}
          onClick={() => goToWeek(i)}
          className={`flex-1 h-8 rounded text-xs font-medium transition-all ${
            currentWeek === i
              ? 'bg-cyan-500 text-white'
              : 'bg-white/5 text-white/50 hover:bg-white/10'
          }`}
        >
          W{i + 1}
        </button>
      ))}
    </div>

    <button onClick={() => goToWeek(Math.min(WEEKS_PER_QUARTER - 1, currentWeek + 1))}>→</button>
  </div>
</div>
```

**设计要点**：

- 横向等分 13 个周按钮，用 `flex-1` 自适应宽度
- 当前周高亮为 `bg-cyan-500`
- 左右箭头按钮控制快进/快退

---

### 第4页：市场新闻

**目标**：展示当前季度的4条市场快讯

**代码位置**：左侧栏的 News Card

```typescript
<div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
  <div className="flex items-center gap-2 mb-5">
    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
    <h3 className="text-sm font-medium text-white/80 uppercase tracking-wider">市场快讯</h3>
  </div>
  <div className="space-y-3">
    {NEWS[currentRound].map((news, idx) => (
      <div
        key={idx}
        className="relative pl-4 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-gradient-to-b before:from-cyan-500/50 before:to-transparent"
      >
        <p className="text-sm text-white/70 leading-relaxed">{news}</p>
      </div>
    ))}
  </div>
</div>
```

**设计要点**：

- 左侧竖线装饰用 `::before` 伪元素，渐变色 `from-cyan-500/50 to-transparent`
- 每条新闻之间用 `space-y-3` 间距
- 标题前用琥珀色脉冲圆点 `animate-pulse` 吸引注意

---

### 第5页：行情图表

**目标**：用 Recharts 绘制多板块折线图

**代码位置**：右侧栏的 Chart Card

```typescript
<div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
  <div className="flex items-center justify-between mb-6">
    <div>
      <h3 className="text-lg font-medium text-white">板块走势</h3>
      <p className="text-xs text-white/40 mt-0.5">近两季度周数据 · 基准点 100</p>
    </div>
    <div className="flex gap-3">
      {SECTORS.map((sector) => (
        <div key={sector} className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: SECTOR_COLORS[sector] }}></div>
          <span className="text-[10px] text-white/50">{SECTOR_NAMES[sector]}</span>
        </div>
      ))}
    </div>
  </div>
  <div className="h-[400px]">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <defs>
          {SECTORS.map((sector) => (
            <linearGradient key={sector} id={`gradient-${sector}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={SECTOR_COLORS[sector]} stopOpacity={0.3} />
              <stop offset="95%" stopColor={SECTOR_COLORS[sector]} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} />
        <YAxis domain={[0, 300]} ticks={[0, 50, 100, 150, 200, 250, 300]} />
        <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', ... }} />
        {SECTORS.map((sector) => (
          <Line
            key={sector}
            type="monotone"
            dataKey={sector}
            stroke={SECTOR_COLORS[sector]}
            strokeWidth={2.5}
            dot={{ fill: SECTOR_COLORS[sector], r: 0 }}
            activeDot={{ r: 6, fill: SECTOR_COLORS[sector], stroke: '#fff', strokeWidth: 2 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>
```

**设计要点**：

- `ResponsiveContainer` 自适应容器，图表 `h-[400px]` 固定高度
- `linearGradient` 定义渐变填充效果（虽然这里没用在AreaChart，但defs保留扩展性）
- `CartesianGrid` 用暗色 `rgba(255,255,255,0.05)` 避免喧宾夺主
- 悬浮点 `activeDot` 加白色边框 `stroke: '#fff'` 更容易辨识
- 图例放在右上角，用小圆点 + 简称

---

### 第6页：板块价格卡片

**目标**：展示6个板块的当前价格、周涨跌、进度条

**代码位置**：右侧栏底部的板块网格

```typescript
<div className="grid grid-cols-3 gap-4">
  {SECTORS.map((sector) => {
    const change = getChange(sector);
    return (
      <div
        key={sector}
        className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-2xl p-5 border border-white/10"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg">{sector.split(' ')[1]}</span>
          <span className="text-xs text-white/40">{SECTOR_NAMES[sector]}</span>
        </div>
        <div className="flex items-end justify-between">
          <div className="text-3xl font-bold" style={{ color: SECTOR_COLORS[sector] }}>
            {prices[sector]}
          </div>
          {change !== null && (
            <div className={`text-sm font-medium px-2 py-1 rounded-lg ${
              change >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {change >= 0 ? '+' : ''}{change.toFixed(2)}%
            </div>
          )}
        </div>
        {/* 进度条 */}
        <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${(prices[sector] / maxPrice) * 100}%`,
              backgroundColor: SECTOR_COLORS[sector]
            }}
          ></div>
        </div>
      </div>
    );
  })}
</div>
```

**设计要点**：

- 卡片使用玻璃拟态效果：`bg-white/[0.08]` + `backdrop-blur-xl`
- 价格数字用对应板块颜色高亮
- 涨跌幅用绿/红色药丸标签 `bg-green-500/20`
- 进度条展示该板块价格相对于历史最高值的比例

---

### 第7页：复盘总结

**目标**：最后一季结束时展示三条核心启示

**代码位置**：主内容区底部，条件渲染

```typescript
{currentRound === 5 && currentWeek >= WEEKS_PER_QUARTER - 1 && (
  <div className="mt-8 bg-gradient-to-r from-purple-900/30 via-slate-900/50 to-blue-900/30 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20">
    <h3 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
      复盘总结
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { icon: '💡', title: '知道未来 ≠ 做出正确选择', desc: '...' },
        { icon: '🧠', title: '人性是最大的敌人', desc: '...' },
        { icon: '🎯', title: '坚持比判断更难', desc: '...' },
      ].map((item, idx) => (
        <div key={idx} className="bg-white/[0.05] rounded-xl p-6 border border-white/10">
          <div className="text-4xl mb-4">{item.icon}</div>
          <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
          <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
)}
```

**设计要点**：

- 紫色到蓝色的渐变边框 `border-purple-500/20` 突出结束感
- 标题用彩虹渐变文字 `from-purple-400 via-pink-400 to-cyan-400`
- 三列卡片布局，内容用 Emoji 作为视觉锚点

---

## 样式设计

### 深色主题配色

```css
/* 背景层次 */
bg-[#0a0e17]          /* 最深背景 */
bg-slate-900          /* 卡片背景 */

/* 玻璃拟态 */
bg-white/[0.08]        /* 半透明卡片 */
backdrop-blur-xl       /* 模糊背景 */
border-white/10        /* 细边框 */
```

### 渐变背景

```typescript
<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0e17] to-[#0a0e17]"></div>
```

### 文字渐变

```typescript
<span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
```

### 发光效果

```typescript
// 按钮发光
shadow-lg shadow-cyan-500/50

// 背景光晕
<div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
```

### 网格纹理

```typescript
<div className="absolute inset-0 opacity-[0.02]" style={{
  backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
  backgroundSize: '64px 64px'
}}></div>
```

---

## 运行部署

### 开发模式

```bash
npm run dev
```

访问 `http://localhost:5173`

### 构建生产版本

```bash
npm run build
```

输出在 `dist/` 目录

### Vite 配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

### Tailwind 入口

```css
/* src/index.css */
@import "tailwindcss";
```

---

## 总结

这个项目展示了一个专业的金融数据演示页面，核心设计要点：

1. **深色主题** + **玻璃拟态** 营造交易终端氛围
2. **圆形进度条** + **渐变线** 直观展示时间维度
3. **多板块折线图** 用不同颜色区分，悬浮交互增强
4. **卡片式布局** 模块化展示各类信息
5. **周数据粒度** 增强数据密度和真实感

希望这个教程对你有帮助！
