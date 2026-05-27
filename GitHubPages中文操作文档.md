# Retro Rewind GitHub Pages 预览操作文档

## 一、项目已经做好的发布适配

本文件夹已经补好了 GitHub Pages 需要的根目录入口：

- 外层 `index.html`：GitHub Pages 打开仓库首页时会自动跳转到游戏页面。
- `.nojekyll`：避免 GitHub Pages 对静态文件做额外处理。
- 内层游戏页面：`retro-rewind-the-80s-arcade-experience-team-main/index.html`。
- 游戏脚本与素材：`sketch.js`、`face.png`、`dead.png`、`tree.png`、`gift.png`。

游戏符合 PDF 作业中的核心要求：使用 JavaScript 和 q5play，包含标题界面、游玩状态、结束/得分界面、2D 精灵、得分系统，以及失败和胜利条件。

## 二、上传到 GitHub

1. 打开 GitHub，新建一个仓库。
2. 将整个外层文件夹中的内容上传到仓库根目录。
3. 确认仓库根目录能看到这些内容：
   - `index.html`
   - `.nojekyll`
   - `GitHubPages中文操作文档.md`
   - `retro-rewind-the-80s-arcade-experience-team-main/`
4. 提交上传内容。

注意：不要只上传内层文件夹本身，也不要把项目再套一层文件夹。GitHub Pages 需要在仓库根目录找到 `index.html`。

## 三、开启 GitHub Pages

1. 进入仓库页面。
2. 点击 `Settings`。
3. 在左侧菜单点击 `Pages`。
4. 在 `Build and deployment` 中选择：
   - `Source`：`Deploy from a branch`
   - `Branch`：`main`
   - 文件夹：`/ (root)`
5. 点击 `Save`。
6. 等待 1 到 3 分钟，GitHub 会生成预览网址。

生成的网址通常类似：

```text
https://你的用户名.github.io/仓库名/
```

打开这个网址后，会自动进入游戏页面。

## 四、本地预览方法

如果只是本地检查，可以直接双击外层 `index.html`。更推荐使用 VS Code 的 Live Server 插件打开，因为它更接近 GitHub Pages 的运行方式。

游戏操作：

- 空格键：开始游戏
- 方向键：移动角色
- 收集礼物：增加分数
- 撞到树：减少分数
- 分数到 0：游戏失败
- 分数到 1200：游戏胜利
- R 键：失败或胜利后重新开始

## 五、作业灵感说明

可以在提交时使用下面这段 3-5 句说明：

This project was inspired by Pac-Man, one of the most famous arcade games from the 1980s. I adapted the idea of moving through a maze, collecting objects, and avoiding danger into a holiday-themed game called Grinch Gift Grab. Instead of pellets and ghosts, the player collects gifts while avoiding trees that reduce the score. The simple controls, score goal, and fast arcade-style movement are meant to capture the feeling of classic 80s games.

## 六、常见问题

如果 GitHub Pages 打开是 404，请检查 Pages 设置是否选择了 `main` 分支和 `/ (root)` 文件夹。

如果页面能打开但游戏没有显示，请等待几秒钟，q5play 需要从网络加载；也请确认浏览器没有拦截外部脚本。

如果素材没有显示，请确认 `face.png`、`dead.png`、`tree.png`、`gift.png` 和 `sketch.js` 都在内层游戏文件夹中。
