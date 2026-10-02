# 桃源 · 豁然开朗

基于陶渊明《桃花源记》的交互式三维网页，使用 Ling-3.1-flash 生成场景代码，由 Codex 辅助整合、修改与测试。

视觉与交互组织参考 [宝玉的桃花源页面](https://s.baoyu.io/files/peach-blossom-land-v2/index.html)。本项目重新实现场景和交互，未打包参考页源码或音频。

## 体验内容

- 五个观景机位，清晨、晴日、暮色、春雨四种天气与光照。
- 《桃花源记》完整原文，七幕、二十四段循文游历，支持白话切换和章节选择。
- 程序化山体、村舍、桃树、五瓣桃花、落花、水面与雨滴涟漪。
- 暂停、慢读、进度拖动、环境停驻、设备中文朗读与可选环境音。
- 手机默认轻量画质，可切换高画质。

## 本地运行

`dist/index.html` 是可直接托管的单文件页面，Three.js 0.160.0 与所需插件已打包在文件中，页面加载无需下载外部脚本或素材。

在项目目录运行以下命令，再访问 `http://127.0.0.1:8765/`：

```sh
python -m http.server 8765 --bind 127.0.0.1 --directory dist
```

页面需要支持 WebGL 的浏览器。中文朗读使用设备提供的语音，实际表现随系统和浏览器而变化。

## 修改与构建

可读源码位于 `src/index.template.html`，构建脚本位于 `scripts/build.cjs`。使用 Node.js 安装固定版本开发依赖并重建：

```sh
npm install
npm run build
```

构建会更新 `dist/index.html`，并生成 `artifacts/桃源-离线版.html`。

## GitHub Pages

仓库包含 `.github/workflows/pages.yml`。在仓库的 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**，然后运行 **Deploy webpage to GitHub Pages** 工作流。

后续提交到 `main` 后会自动发布 `dist/` 中的成品。修改源码后，请先运行 `npm run build`，将更新的源码和 `dist/index.html` 一起提交。

## 第三方许可

Three.js 及其插件遵循 MIT 许可，完整许可保留在页面及 `THIRD-PARTY-LICENSES.txt` 中。
