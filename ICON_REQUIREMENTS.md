# 应用图标说明

## 图标要求

electron-builder 的 NSIS 打包器对图标文件有严格要求：

### 必须满足的要求：

1. **格式**：必须是标准的 Windows ICO 格式
2. **尺寸**：必须包含以下所有尺寸（多尺寸 ICO）：
   - 256x256 (32位)
   - 48x48 (32位)
   - 32x32 (32位)
   - 16x16 (32位)
3. **位深度**：32位色彩（带 alpha 通道）
4. **文件大小**：通常在 20-100 KB 之间

### 创建正确的图标：

**推荐工具：**

1. **IcoFX** (Windows) - 专业图标编辑器
2. **在线工具**：
   - https://redketchup.io/icon-converter （推荐，支持多尺寸）
   - https://convertio.co/zh/png-ico/

**使用 ImageMagick 命令行（推荐）：**
```bash
# 准备一个 256x256 的 PNG 文件，然后运行：
magick convert icon-256.png -define icon:auto-resize=256,48,32,16 icon.ico
```

### 设计建议：

- 使用 Minecraft 风格的方块或工具图标
- 主色调建议使用蓝色 (#3b82f6) 配合深色背景
- 确保在 16x16 小尺寸下也清晰可见
- 使用简洁的设计，避免过多细节

### 放置位置：

```
public/icon.ico  <-- 在这里放置符合要求的图标文件
```

### 启用图标：

创建好图标后，在 `package.json` 的 `build.win` 部分添加：

```json
"win": {
  "target": [...],
  "icon": "public/icon.ico"
}
```

### 验证图标：

可以使用以下工具验证图标是否符合要求：
- IcoFX - 打开图标查看所有尺寸
- 在线验证：https://www.checkicononline.com/

### 当前状态：

⚠️ 图标配置已暂时移除，electron-builder 将使用默认 Electron 图标。添加正确格式的图标后，请取消注释 package.json 中的图标配置。
