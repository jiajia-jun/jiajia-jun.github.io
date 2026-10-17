# Blog

基于Hugo构建的一个静态博客，通过Github Action进行渲染

---

## 一、写一篇新文章

一篇文章 = 一个文件夹 + 里面一个 `index.md`。**文件夹名必须是英文**，它会成为网址

```bash
hugo new content posts/my-new-post/index.md
```

这会在 `content/posts/my-new-post/index.md` 生成一个带模板的文件，填好就能写：

```toml
+++
title = "我的新文章"          # 标题，中文没问题
date = 2026-09-19
categories = ["技术"]          # 决定首页分到哪个区
tags = ["Hugo", "教程"]        # 跨分类的细标签
description = "一句话说清这篇文章讲什么。"   # 显示在首页卡片上
draft = true                   # true = 只在本地预览，不会发布
+++

正文从这里开始 （Markdown格式）
```

写完预览：

```bash
hugo server -D          # -D 表示连草稿一起显示
```

打开 <http://localhost:1313/>。改内容会自动刷新。

**满意后把 `draft = true` 改成 `false`**，否则推上去也不会出现在线上——但本地因为有 `-D`，是能看到的

### 文章配图

图片放在文章自己的文件夹里，Markdown 里用相对路径引用：

```text
content/posts/my-new-post/
├── index.md
└── screenshot.png
```

```markdown
![截图](screenshot.png)
```

这样图片路径和文章绑定，以后改文章网址图片也不会断

### 跳转

系列文章之间互链用 Hugo 的 `relref`，参数填目标文章的**文件夹名**：

```markdown
- [链接名]({{< relref "文件夹名" >}}) 概括
```

`relref` 会在构建时解析成实际网址，以后文章改文件夹名或移动位置，链接会自动更新

>注意：**`relref` 指向的文章必须已经发布（`draft = false`）**。  
>指向草稿时，本地用 `-D` 能正常预览，但推送后 CI 构建会因为找不到该页面而失败，
>所以链接要和目标文章的 `draft = false` 放在同一次提交里。

---

## 二、发布

```bash
git add .
git commit -m "一些话"
git push
```

推完等 1~2 分钟。在仓库的 **Actions** 标签页能看到进度，绿勾就是发布成功

---

## 三、改站点的样子

所有能改的东西集中在两个文件：

### `hugo.toml` — 文字与站点参数

| 改动对象 | 改动位置 |
| --- | --- |
| 浏览器标题栏的站名 | `title = "jiajia-jun"` |
| 首页那句自我介绍 | `[params]` 下的 `bio` |
| 分享到社交平台时的描述 | `[parms]` 下的 `description` |
| GitHub 链接 | `[params]` 下的 `github` |
| 首页每个分类显示几篇 | `[params]` 下的 `homePostsPerCategory` |
| 列表页每页几篇 | `[pagination]` 下的 `pagerSize` |
| 评论区的 ID | `[params.giscus]` 下的 `categoryId`（怎么拿见第五节） |

### `assets/css/main.css` — 配色

文件开头有一段注释，记录了每个颜色的对比度实测值，以及为什么必须用
`light-dark()` 而不是写两份声明

**改颜色时，只需要动文件开头的两处**，不用碰下面的样式规则：

1. `:root` 里的浅色兜底值
2. 下面 `@supports` 块里的 `light-dark(浅色, 深色)`

可以改的变量：

```css
--bg        /*页面底色*/
--fg        /*正文颜色*/
--fg-muted  /*次要文字（日期、摘要）*/
--link      /*链接颜色*/
--accent    /*按钮、边框、高亮的品牌色*/
--mark-bg   /*选中文字的背景*/
--card-bg   /*卡片背景*/
--code-bg   /*代码块和行内代码的底色*/
```

可以使用[这个网站](https://webaim.org/resources/contrastchecker/)来配置自己喜欢的颜色😋😋

同一个颜色在这两处各写了一次。第一处只有浅色，留给不认识 `light-dark()` 的旧浏览器；第二处写成 `light-dark(浅色, 深色)`，现代浏览器实际用的是这一份

所以：

- **改浅色**：两处一起改（`:root` 的值，和 `light-dark()` 的第一个颜色）
- **改深色**：只改 `light-dark()` 括号里的后一个颜色

### 首页头像

首页最上面那个圆形头像，图片在 **`assets/avatar.jpg`**。想换就直接覆盖这个文件
（`.jpg` / `.png` / `.webp` 都行，文件名保持以 `avatar` 开头就好），不用改任何配置

它是**存在仓库里**的，不是直接链到 GitHub 的（因为GitHub 头像的服务器
（`avatars.githubusercontent.com`）在国内经常很慢甚至连不上😭）

- 原图建议不小于 **288×288** 的正方形。不是正方形也没关系，会自动按中心裁成正方形
- 页面里显示成 144px，用 2 倍图（288px），所以高清屏上是清楚的
- **把这张图删掉**，首页会自动退回原来那条薄荷色小横条，不会有破图

---

## 四、目录结构

```markdown
.
├── hugo.toml                  站点总配置
├── content/                   所有内容（你写东西只动这里）
│   ├── _index.md              首页的配置
│   ├── about/index.md         关于页
│   ├── archives/_index.md     归档页
│   └── posts/                 文章
│       ├── _index.md          文章列表页的配置
│       └── blogName/index.md  文章目录
│
├── layouts/                   页面模板（HTML）
│   ├── baseof.html            所有页面的外壳
│   ├── index.html             首页（身份区 + 按分类分区）
│   ├── posts/single.html      文章页（带日期/分类/标签/导航）
│   ├── _default/              列表页、归档页、独立页（关于）等
│   └── partials/              页头、页脚、卡片、评论、分页等零件
├── assets/                    需要被加工的资源
│   ├── avatar.jpg             首页头像（换头像就覆盖这个文件）
│   ├── css/main.css           样式（会被压缩 + 加指纹）
│   └── js/                    主题切换、卡片倾斜、评论主题同步、代码复制
├── static/                    原样搬到网站根目录的文件（图标就在这里）
└── .github/workflows/hugo.yml 自动部署
```

`public/` 是渲染产物，**不要提交，也不要手动改**——每次构建都会被覆盖，已经写进 `.gitignore`。

---

## 五、首次发布需要做的事情

这些配置需要自己手动来完成了

### 1. 让 Actions 能发布

> 仓库 **Settings → Pages → Build and deployment → Source** 选 **"GitHub Actions"**

不选的话，Actions 会跑成功但站点不更新

### 2. 开通评论（giscus）

评论存在**这个仓库的 GitHub Discussions** 里，页面上那个框是 giscus 提供的 iframe。
不用服务器、不用数据库，评论数据也是你自己的

发表评论需要 GitHub 账号；未登录或没有账号的读者可以阅读评论，但不能发言

三步：

#### (1) 打开 Discussions

> 仓库 **Settings → General → Features** → 勾上 **Discussions**

#### (2) 给仓库装上 giscus

进 <https://github.com/apps/giscus>，点 **Install**，选中 `yourname/yourname.github.io`。
giscus 靠这个授权去读写你仓库里的 Discussions

#### (3) 把 `categoryId` 抄进 `hugo.toml`

打开 <https://giscus.app/>，**Repository** 填 `yourname/yourname.github.io`，
**Category** 选 `Announcements`（第 (1) 步之后 GitHub 自动建好的，不用自己新建；
它只有维护者能**新建**讨论，别人没法往你 Discussions 里灌无关的帖子，读者照样能评论）。

再往下生成的代码里有两行：

```html
data-repo-id="R_kgDOxxxxxxx"
data-category-id="DIC_kwDOxxxxxxx"
```

`repoId` 已经填好了，把 `data-category-id` 的值抄进 `hugo.toml` 的 `[params.giscus]`。
存盘刷新，评论区就出现了。

> **注意**：这两个 ID 是 `R_kgDO...` / `DIC_kwDO...` 这种**字符串**，不是纯数字

**之后管评论**都在仓库的 [Discussions](https://github.com/yourname/yourname.github.io/discussions)
页面：一篇文章对应一条讨论，回复、删除、锁定都在那儿。

---

## 七、本地环境

- Hugo 版本 `0.163.0`
  （和 `.github/workflows/hugo.yml` 里的 `HUGO_VERSION` 保持一致）
- **标准版即可，不需要 extended 版**。主题只用到内置的 CSS 压缩与指纹
  （`minify` / `fingerprint`）和头像裁剪（`.Fill`），标准版都支持
- CI 里安装的是 extended 版，但构建并不依赖它

检查：

```bash
hugo version
```

如果没有就去安装一下`hugo`
