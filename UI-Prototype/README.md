# Sparkle Player UI 原型说明

## 概述

这是 Sparkle Player 的 HTML/CSS/JavaScript 原型，用于预览和测试用户界面设计。原型完全基于前端技术实现，专注于 UI 设计和用户体验，不包含实际的音频播放逻辑。

## 文件结构

```
UI-Prototype/
├── index.html          # 主页面结构
├── styles.css          # 样式表
├── script.js          # 交互逻辑
├── assets/            # 资源文件夹
└── README.md          # 说明文档
```

## 功能特性

### 🎨 UI 设计特性

#### 主题系统
- **深色主题** (默认): 基于 `#181A1B` 的深色配色方案
- **浅色主题**: 基于 `#FDFDFD` 的浅色配色方案
- **一键切换**: 右上角主题切换按钮，带平滑过渡动画

#### 布局结构
- **顶部标题栏** (60px): 应用图标、标题、搜索框、控制按钮
- **左侧导航栏** (240px): 音乐库分类、个人区域、播放列表
- **中央内容区**: 横幅、操作栏、歌曲列表
- **底部播放栏** (80px): 歌曲信息、播放控制、音量控制

### 🎭 动画效果

#### 非线性动画 (CSS Cubic-Bezier)
```css
--transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
--transition-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
--bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

#### 关键动画效果
1. **页面加载动画**: 元素依次从下方滑入
2. **主题切换动画**: 涟漪效果 + 颜色过渡
3. **歌曲旋转动画**: 专辑封面旋转效果
4. **悬停效果**: 按钮缩放、阴影变化
5. **点击反馈**: 涟漪效果、脉冲动画
6. **爱心粒子**: 点赞时的粒子爆炸效果

### 🎵 交互功能

#### 播放控制
- **播放/暂停**: 中央播放按钮
- **上一首/下一首**: 切歌按钮
- **进度控制**: 可拖拽的进度条
- **音量控制**: 滑块调节音量

#### 歌曲列表
- **点击播放**: 点击歌曲项播放
- **悬停效果**: 显示操作按钮
- **右键菜单**: 上下文操作菜单
- **收藏功能**: 爱心按钮切换

#### 搜索功能
- **搜索框**: 顶部居中搜索框
- **焦点动画**: 聚焦时的缩放效果
- **实时搜索**: (模拟功能)

### ⌨️ 键盘快捷键

| 按键 | 功能 |
|------|------|
| `Space` | 播放/暂停 |
| `←` | 上一首 |
| `→` | 下一首 |
| `↑` | 音量增加 |
| `↓` | 音量减少 |
| `M` | 静音切换 |

## 详细 UI 规范

### 🎨 颜色规范

#### 深色主题
```css
--bg-body: #181A1B      /* 主背景 */
--bg-header: #23272A    /* 次要背景 */
--text-primary: #F5F7FA /* 主要文字 */
--primary: #6CA0DC      /* 强调色 */
--accent: #B0BEC5       /* 辅助色 */
--border: #23272A       /* 边框色 */
```

#### 浅色主题
```css
--bg-body: #FDFDFD      /* 主背景 */
--bg-header: #F5F7FA    /* 次要背景 */
--text-primary: #222222 /* 主要文字 */
--primary: #4A90E2      /* 强调色 */
--accent: #B0C4DE       /* 辅助色 */
--border: #E5E7EB       /* 边框色 */
```

### 📐 尺寸规范

```css
--sidebar-width: 240px
--titlebar-height: 60px
--playerbar-height: 80px
--border-radius: 8px
--border-radius-small: 4px
```

### 🔤 字体规范

- **主标题**: 24px, HYRunYuan-65S (粗体)
- **副标题**: 16px, HYRunYuan-35S (常规)
- **正文**: 14px, HYRunYuan-35S (常规)
- **小字**: 12px, HYRunYuan-35S (常规)

### 🎯 阴影规范

```css
--shadow-small: 0 2px 4px rgba(0, 0, 0, 0.1)
--shadow-medium: 0 4px 12px rgba(0, 0, 0, 0.15)
--shadow-large: 0 8px 32px rgba(0, 0, 0, 0.3)
```

## 响应式设计

### 断点设置
- **桌面**: > 1024px
- **平板**: 768px - 1024px
- **手机**: < 768px

### 适配策略
1. **侧边栏隐藏**: 小屏幕时侧边栏滑出隐藏
2. **网格调整**: 歌曲列表列数自适应
3. **按钮合并**: 小屏幕时合并控制按钮
4. **字体缩放**: 保持可读性的字体大小

## 使用说明

### 1. 预览方式

#### 直接打开
```bash
# 在浏览器中打开
open index.html
```

#### 本地服务器 (推荐)
```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js
npx serve .

# 访问 http://localhost:8000
```

### 2. 功能测试

#### 基础交互
1. 点击主题切换按钮测试深色/浅色主题
2. 点击播放按钮测试播放/暂停状态
3. 点击歌曲列表项测试歌曲切换
4. 拖拽进度条测试进度控制
5. 调节音量滑块测试音量控制

#### 动画效果
1. 观察页面加载时的渐入动画
2. 体验按钮悬停时的缩放效果
3. 测试歌曲播放时的封面旋转
4. 尝试点赞按钮的粒子效果
5. 测试右键菜单的弹出动画

#### 键盘操作
1. 使用空格键控制播放/暂停
2. 使用方向键控制切歌和音量
3. 使用 M 键测试静音功能

### 3. 自定义修改

#### 颜色主题
在 `styles.css` 文件的 `:root` 选择器中修改颜色变量:

```css
:root {
  /* 修改主色调 */
  --primary-dark: #你的颜色;
  --primary-light: #你的颜色;
}
```

#### 动画效果
修改动画时长和缓动函数:

```css
:root {
  /* 调整动画速度 */
  --transition-normal: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
```

#### 布局尺寸
调整布局相关的 CSS 变量:

```css
:root {
  /* 修改侧边栏宽度 */
  --sidebar-width: 280px;
}
```

## 技术实现要点

### 🎨 CSS 技术

#### 1. CSS 变量系统
使用 CSS 自定义属性实现主题系统和尺寸规范:

```css
:root {
  --primary: #6CA0DC;
}

.button {
  background: var(--primary);
}
```

#### 2. CSS Grid 布局
歌曲列表使用 CSS Grid 实现响应式列布局:

```css
.song-item {
  display: grid;
  grid-template-columns: 60px 1fr 200px 200px 80px 100px;
  gap: 16px;
}
```

#### 3. CSS 动画
使用 `@keyframes` 和 `transition` 实现流畅动画:

```css
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.rotating {
  animation: rotate 20s linear infinite;
}
```

#### 4. 毛玻璃效果
使用 `backdrop-filter` 实现现代化的透明效果:

```css
.app-container {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
```

### 🎭 JavaScript 交互

#### 1. 事件处理
使用现代 JavaScript 事件监听:

```javascript
button.addEventListener('click', (e) => {
  this.handleClick(e);
});
```

#### 2. DOM 操作
高效的 DOM 查询和修改:

```javascript
const element = document.querySelector('.target');
element.style.transform = 'scale(1.1)';
```

#### 3. 动画控制
JavaScript 控制 CSS 动画和过渡:

```javascript
element.style.transition = 'all 0.3s ease';
element.style.opacity = '1';
```

#### 4. 状态管理
简单的应用状态管理:

```javascript
class SparklePlayerUI {
  constructor() {
    this.isPlaying = false;
    this.currentTheme = 'dark';
  }
}
```

## 开发建议

### 1. 转换为 Avalonia UI

#### XAML 结构对应
```xml
<!-- HTML div 对应 -->
<Border>
  <StackPanel>
    <!-- 内容 -->
  </StackPanel>
</Border>

<!-- CSS Grid 对应 -->
<Grid>
  <Grid.ColumnDefinitions>
    <ColumnDefinition Width="60"/>
    <ColumnDefinition Width="*"/>
  </Grid.ColumnDefinitions>
</Grid>
```

#### 样式绑定
```xml
<!-- CSS 类对应 -->
<Button Classes="primary-button">
  <Button.Styles>
    <Style Selector="Button.primary-button">
      <Setter Property="Background" Value="{DynamicResource Primary}"/>
    </Style>
  </Button.Styles>
</Button>
```

#### 动画实现
```xml
<!-- CSS 动画对应 -->
<Button>
  <Button.Styles>
    <Style Selector="Button:pointerover">
      <Style.Animations>
        <Animation Duration="0:0:0.15">
          <KeyFrame Cue="100%">
            <Setter Property="RenderTransform" Value="scale(1.1)"/>
          </KeyFrame>
        </Animation>
      </Style.Animations>
    </Style>
  </Button.Styles>
</Button>
```

### 2. 性能优化建议

#### CSS 优化
- 使用 `transform` 和 `opacity` 进行动画
- 避免频繁的重排重绘
- 使用 `will-change` 提示浏览器优化

#### JavaScript 优化
- 使用事件委托减少监听器数量
- 防抖和节流处理高频事件
- 使用 `requestAnimationFrame` 优化动画

### 3. 可访问性考虑

#### 键盘导航
- 确保所有交互元素可通过键盘访问
- 提供明确的焦点指示器
- 支持 Tab 键导航顺序

#### 屏幕阅读器
- 添加适当的 ARIA 标签
- 提供替代文本
- 语义化的 HTML 结构

## 总结

这个 HTML 原型为 Sparkle Player 提供了一个完整的 UI 设计预览，包含了现代化的界面设计、流畅的动画效果、响应式布局和丰富的交互功能。原型专注于 UI 设计和用户体验，为后续的 Avalonia UI 开发提供了清晰的设计指导和技术参考。

通过这个原型，开发团队可以:
1. 预览完整的用户界面设计
2. 测试交互逻辑和用户体验
3. 验证响应式布局效果
4. 确认动画效果和性能表现
5. 为 Avalonia UI 开发提供详细的设计规范
