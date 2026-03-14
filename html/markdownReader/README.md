# Markdown Reader

一个简单的 Markdown 阅读器，支持本地文件、远程 URL 和拖拽打开 Markdown 文件。

## 🚀 快速开始

### 方式一：本地使用（推荐）

1. 下载 `MarkdownReader.html` 文件到本地
2. 双击文件，用浏览器打开即可使用
3. 支持拖拽本地 Markdown 文件到页面中查看

### 方式二：部署到服务器

将 `MarkdownReader.html` 文件放到 Web 服务器的任意目录下，通过浏览器访问即可。

**示例部署位置：**
- Nginx: `/var/www/html/markdownReader/MarkdownReader.html`
- Apache: `/var/www/html/markdownReader/MarkdownReader.html`
- 访问地址: `http://your-server.com/markdownReader/MarkdownReader.html`

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

### 方式三：点击选择

1. 点击页面左上角的「打开文件」
2. 在弹出的对话框中选择：
   - **本地文件**：点击「选择文件」按钮，从电脑中选择 Markdown 文件
   - **远程地址**：切换到「远程地址」标签，输入文件 URL
3. 点击「打开」

## ✨ 功能特性

### 阅读体验
- ✅ 实时渲染 Markdown
- ✅ 代码语法高亮（支持多种语言）
- ✅ 自动生成目录（TOC）
- ✅ 目录高亮当前阅读位置
- ✅ 深色/浅色主题切换（自动记忆）
- ✅ 阅读宽度调节（窄/中/宽/更宽/全宽）
- ✅ 阅读进度条
- ✅ 返回顶部按钮
- ✅ 响应式布局（支持移动端）

### 文件操作
- ✅ 支持本地文件
- ✅ 支持远程 URL
- ✅ 支持拖拽上传
- ✅ 下载当前 Markdown 文件
- ✅ 目录显示/隐藏切换

> **💡 关于远程 URL**：由于浏览器的跨域安全限制（CORS），直接访问外部 URL 通常会被阻止。因此需要通过服务器代理来中转请求，具体配置见下方 Nginx 配置。

## 🛠️ 技术栈

### 核心库
- **[Marked.js](https://marked.js.org/)** - Markdown 解析和渲染
- **[Highlight.js](https://highlightjs.org/)** (v11.9.0) - 代码语法高亮，支持 180+ 种编程语言

### 字体
- **[JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)** - 代码等宽字体
- **[Source Serif 4](https://fonts.google.com/specimen/Source+Serif+4)** - 正文字体

### 主题样式
- **GitHub Dark** - 深色模式代码高亮主题
- **GitHub** - 浅色模式代码高亮主题

### 技术特性
- 纯 HTML/CSS/JavaScript，无需构建工具
- 响应式设计，支持桌面和移动端
- 本地存储主题偏好

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
