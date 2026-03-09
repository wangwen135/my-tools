# Markdown Reader

一个简单的 Markdown 阅读器，支持本地文件、远程 URL 和拖拽打开 Markdown 文件。

## 📖 使用方法

### 方式一：URL 参数

在浏览器中打开 `MarkdownReader.html`，并通过 URL 参数指定 Markdown 文件路径：

```
http://your-server/markdownReader/MarkdownReader.html?file=README.md
```

**支持的文件类型：**
- 本地文件：`?file=README.md`
- 远程 URL：`?file=https://example.com/file.md`

### 方式二：拖拽上传

直接将 `.md` 或 `.markdown` 文件拖拽到页面中即可查看。

### 方式三：点击输入

1. 点击页面右上角的「未选择文件」
2. 在弹出的对话框中输入文件路径或 URL
3. 点击「打开」

## ✨ 功能特性

### 阅读体验
- ✅ 实时渲染 Markdown
- ✅ 代码语法高亮（支持多种语言）
- ✅ 自动生成目录（TOC）
- ✅ 目录高亮当前阅读位置
- ✅ 深色/浅色主题切换（自动记忆）
- ✅ 阅读进度条
- ✅ 返回顶部按钮
- ✅ 响应式布局（支持移动端）

### 文件操作
- ✅ 支持本地文件
- ✅ 支持远程 URL（需要代理）
- ✅ 支持拖拽上传
- ✅ 本地文件可下载
- ✅ 目录显示/隐藏切换

### 样式设计
- ✅ 现代化 UI 设计
- ✅ 适配中文的系统字体
- ✅ 流畅的动画效果
- ✅ 支持减少动画模式（无障碍）

## 🔧 Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-server.com;

    # 静态文件目录
    root /path/to/your/html;
    index MarkdownReader.html;

    # Markdown 阅读器页面
    location = / {
        try_files /markdownReader/MarkdownReader.html =404;
    }

    # Markdown 文件目录
    location /markdown/ {
        alias /path/to/your/markdown/files/;
    }

    # Nginx 代理，用于代理外部 Markdown 文件
    # ⚠️ 暴露到公网是不安全的！
    location /proxy {
        resolver 223.5.5.5;
        proxy_pass $arg_url;
        add_header Access-Control-Allow-Origin *;
    }
}
```

### 应用配置

```bash
# 测试配置
sudo nginx -t

# 重载 Nginx
sudo nginx -s reload
```

## 📝 示例

| 文档 | 访问地址 |
|------|----------|
| 本地文件 | `?file=README.md` |
| 远程文件 | `?file=https://raw.githubusercontent.com/user/repo/main/README.md` |
| 子目录文件 | `?file=subdir/note.md` |

## ⚠️ 注意事项

1. **本地文件访问**：由于浏览器安全限制，需要通过 HTTP 服务器访问，不能直接双击 HTML 文件打开
2. **文件路径**：文件路径相对于 Web 服务器的根目录
3. **远程 URL**：需要配置 Nginx 代理 `/proxy` 才能访问外部 URL
4. **代理安全**：`/proxy` 接口暴露到公网存在安全风险，仅限内网使用
