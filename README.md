# terminal-blog

把终端风博客做成的 Hugo 主题。深色底、绿色强调、`user@host:~#` 提示符、终端窗口卡片。主题在 `themes/terminal-blog`，这个目录是可以直接跑的示例站。

## 预览

```bash
cd ~/terminal-hugo
hugo server
```

打开 http://localhost:1313 。`hugo` 会把静态站写到 `public/`。

## 改成你的站

站点配置在根目录 `hugo.toml`：名字、handle、邮箱、社交链接、首页终端里打出来的那几行。导航提示符是 `handle@host:~#`。

- 文章：`content/blog/*.md`
- 证书：`data/certs.yaml`
- 工具：`data/tools.yaml`
- CVE 卡片：`data/cves.yaml`
- 颜色：`themes/terminal-blog/static/css/main.css` 顶部的变量

## 只拿走主题

把 `themes/terminal-blog` 拷到你自己的 Hugo 站点的 `themes/` 里，然后在站点 `hugo.toml` 写上：

```toml
theme = "terminal-blog"
```

代码高亮（One Dark）写在主题的 `hugo.toml` 里。首页搜索要在站点配置里打开，示例站已经写了：

```toml
[outputs]
  home = ["HTML", "RSS", "SearchIndex"]
```

这会生成 `/search.json`，导航上的 ⌘K 用它。About / Tools / CVEs 三个页面在 front matter 里用 `layout: about`、`layout: tools`、`layout: cves`，数据分别读 `data/certs.yaml`、`data/tools.yaml`、`data/cves.yaml`。
