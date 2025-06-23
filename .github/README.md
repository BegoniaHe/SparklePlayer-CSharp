# GitHub Actions Nightly Build

## 概述

这个workflow提供了SparklePlayer的自动化Nightly构建功能，支持多平台发布和灵活的手动触发选项。

## 功能特性

### 🔄 自动构建
- **定时触发**: 每天凌晨2:00 UTC（北京时间上午10:00）自动运行
- **平台支持**: 自动构建Windows x64、macOS ARM64、Linux x64三个平台
- **版本管理**: 自动清理旧的预发布版本，保持仓库整洁

### 🎮 手动构建
支持手动触发构建，提供以下选项：

#### 版本后缀
- **留空**: 使用时间戳格式 `YYYY.MM.DD.HHMM`
- **自定义**: 输入自定义版本后缀，如 `v1.0-beta`、`feature-test` 等

#### 平台选择
- **all**: 构建所有平台（默认）
- **windows-only**: 仅构建Windows x64
- **macos-only**: 仅构建macOS ARM64  
- **linux-only**: 仅构建Linux x64

#### 清理选项
- **是**: 构建前清理现有预发布版本（默认）
- **否**: 保留现有预发布版本

## 使用方法

### 自动构建
无需任何操作，workflow会自动在设定时间运行。

### 手动构建
1. 访问GitHub仓库的 **Actions** 页面
2. 选择 **Nightly Build** workflow
3. 点击 **Run workflow** 按钮
4. 根据需要配置选项：
   - 输入版本后缀（可选）
   - 选择构建平台
   - 选择是否清理现有预发布版本
5. 点击 **Run workflow** 开始构建

## 输出产物

每次构建会生成以下文件：
- `SparklePlayer-windows-x64.zip` - Windows x64自包含可执行文件
- `SparklePlayer-macos-arm64.tar.gz` - macOS ARM64自包含可执行文件
- `SparklePlayer-linux-x64.tar.gz` - Linux x64自包含可执行文件

## 版本命名

### 自动构建
格式：`nightly-YYYY.MM.DD.HHMM`
示例：`nightly-2024.06.24.1000`

### 手动构建
- 有自定义后缀：`nightly-{自定义后缀}`
- 无自定义后缀：`nightly-YYYY.MM.DD.HHMM`

## 注意事项

1. **预发布版本**: 所有构建都标记为预发布版本（prerelease）
2. **自包含部署**: 所有构建都是自包含的，无需安装.NET运行时
3. **单文件发布**: 每个平台生成单个可执行文件
4. **清理机制**: 默认情况下会清理所有现有的预发布版本以保持仓库整洁

## 故障排除

### 构建失败
1. 检查.NET 9.0是否可用
2. 确认项目文件路径正确
3. 查看GitHub Actions日志获取详细错误信息

### 权限问题
确保仓库的GitHub Actions具有以下权限：
- **Contents**: Read & Write
- **Actions**: Read & Write  
- **Pull requests**: Read & Write

## 技术栈

- **.NET 9.0**: 目标框架
- **Avalonia UI**: 跨平台UI框架
- **GitHub Actions**: CI/CD平台
- **自包含部署**: 无依赖部署方式
