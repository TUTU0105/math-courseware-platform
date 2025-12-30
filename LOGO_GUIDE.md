# Logo 设置指南

## 当前状态

项目已配置好logo显示功能，目前显示为文字：**"初中数学课件网"**

## 如何添加您的Logo

### 方法1：使用图片URL（推荐）

1. **上传logo图片到图床**
   - 访问 https://imgtp.com/ 或 https://sm.ms/
   - 上传您的logo图片
   - 复制图片的URL链接

2. **修改配置文件**
   打开 `src/config/site.ts`，修改 `logo.url`：

   ```typescript
   export const siteConfig = {
     // ... 其他配置
     
     logo: {
       // 将下面的URL替换为您的logo图片URL
       url: 'https://your-image-host.com/logo.png',  // 👈 修改这里
       
       text: '初中数学课件网',
       height: 60,
     },
   }
   ```

3. **重启开发服务器**
   ```bash
   # Ctrl+C 停止服务器
   npm run dev
   ```

### 方法2：使用本地图片文件

1. **将logo图片放入public目录**
   - 将您的logo图片（如 logo.png）复制到项目根目录的 `public/` 文件夹中

2. **修改配置文件**
   打开 `src/config/site.ts`，修改 `logo.url`：

   ```typescript
   export const siteConfig = {
     // ... 其他配置
     
     logo: {
       url: '/logo.png',  // 👈 确保文件名与public目录中的文件一致
       text: '初中数学课件网',
       height: 60,
     },
   }
   ```

3. **重启开发服务器**
   ```bash
   # Ctrl+C 停止服务器
   npm run dev
   ```

## Logo图片要求

### 推荐规格

- **格式**: PNG（支持透明背景）或 JPG
- **尺寸**: 建议宽度 200px 左右，高度自适应
- **背景**: 透明背景或与网站主色（#8A9BB5）协调的背景
- **大小**: 建议不超过 100KB

### 设计建议

- Logo颜色在深色背景（#8A9BB5）上要清晰可见
- 建议使用白色或浅色系
- 保持简洁，避免过多细节

## 调整Logo显示

如果logo显示大小不合适，可以调整配置：

```typescript
logo: {
  url: '/logo.png',
  text: '初中数学课件网',
  height: 80,  // 👈 调整这个值改变logo高度
},
```

## 恢复为文字Logo

如果想改回文字显示，只需：

```typescript
logo: {
  url: '',  // 👈 留空
  text: '初中数学课件网',
  height: 60,
},
```

## Logo显示位置

Logo会显示在以下位置：

- ✅ 导航栏头部（桌面端左右两侧）
- ✅ 移动端导航栏顶部
- ✅ 点击logo跳转到首页

## 测试Logo

修改配置后：

1. 刷新浏览器页面（Ctrl+F5 强制刷新）
2. 查看导航栏是否正确显示logo
3. 点击logo确认是否跳转到首页

## 常见问题

### Q: Logo图片不显示？

**可能原因**：
- URL不正确或图片无法访问
- 图片格式不支持（请使用PNG或JPG）
- 文件名错误（区分大小写）

**解决方法**：
- 在浏览器中直接访问图片URL测试
- 检查控制台是否有错误信息
- 确保文件名拼写正确

### Q: Logo尺寸太大/太小？

**解决方法**：
- 调整 `logo.height` 值
- 或者使用图片编辑工具调整原图尺寸

### Q: 只有左侧导航显示logo？

**说明**：
正常情况，左右导航栏会同时显示相同logo。如果只有一边显示，请检查代码。

## 示例配置

### 示例1：使用网络图片
```typescript
logo: {
  url: 'https://example.com/logo.png',
  text: '初中数学课件网',
  height: 70,
},
```

### 示例2：使用本地图片
```typescript
logo: {
  url: '/my-logo.png',
  text: '初中数学课件网',
  height: 60,
},
```

### 示例3：仅使用文字
```typescript
logo: {
  url: '',
  text: '我的数学课件网',
  height: 60,
},
```

---

**提示**: 完成logo设置后，建议在不同设备（手机、平板、PC）上测试显示效果。
