# 应用图标说明

## 需要添加应用图标

请在 `public/icon.ico` 位置放置一个 256x256 的 ICO 图标文件。

### 制作图标的方法：

1. **在线工具**：
   - https://www.icoconverter.com/
   - https://convertio.co/zh/png-ico/

2. **设计建议**：
   - 使用 Minecraft 风格的方块或工具图标
   - 主色调建议使用蓝色 (#3b82f6) 配合深色背景
   - 确保在小尺寸下也清晰可见

3. **尺寸要求**：
   - 推荐：256x256px（主图标）
   - 还应包含：128x128, 64x64, 48x48, 32x32, 16x16
   - 格式：ICO（包含多个尺寸）

### 临时解决方案：

如果没有图标，electron-builder 会使用默认图标。可以先使用 Vite 的 logo 转换：

```bash
# 使用在线工具将 public/vite.svg 转换为 icon.ico
```

### 文件位置：
```
public/icon.ico  <-- 在这里放置图标文件
```
