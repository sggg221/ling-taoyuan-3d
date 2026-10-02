const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');
const root = path.resolve(__dirname, '..');
const source = path.join(root, 'dist/index.html');
const backup = path.join(root, 'evidence/offline-before.html');
const template = path.join(root,'src/index.template.html');
const html = fs.readFileSync(fs.existsSync(template) ? template : (fs.existsSync(backup) ? backup : source), 'utf8');
if (!html.includes('<script type="importmap">')) throw new Error('Unexpected source');
fs.mkdirSync(path.join(root, 'artifacts'), {recursive:true});
const result = esbuild.buildSync({
  stdin: {
    contents: "import * as THREE from 'three'; import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'; import { Reflector } from 'three/addons/objects/Reflector.js'; export { THREE, OrbitControls, mergeGeometries, Reflector };",
    resolveDir: __dirname,
    sourcefile: 'taoyuan-engine.js',
    loader: 'js'
  },
  bundle: true, minify: true, format: 'iife', globalName: 'TaoyuanEngine',
  target: 'es2020', legalComments: 'inline', write: false
});
const engine = result.outputFiles[0].text;
if (/<\/script/i.test(engine)) throw new Error('Unsafe inline delimiter in engine');
const license = fs.readFileSync(require.resolve('three').replace(/build[\\/]three\.cjs$/, 'LICENSE'), 'utf8');
let next = html.replace(/<script type="importmap">[\s\S]*?<\/script>/,
  () => '<!-- Three.js 0.160.0 and addons, bundled for offline use.\n' + license + '\n-->\n<script>\n' + engine + '\n</script>');
next = next.replace(/import \* as THREE from 'three';\s*import \{ OrbitControls \} from 'three\/addons\/controls\/OrbitControls\.js';\s*import \{ mergeGeometries \} from 'three\/addons\/utils\/BufferGeometryUtils\.js';\s*import \{ Reflector \} from 'three\/addons\/objects\/Reflector\.js';/,
  'const { THREE, OrbitControls, mergeGeometries, Reflector } = TaoyuanEngine;');
if (next.includes("from 'three")) throw new Error('External import survived');
fs.writeFileSync(source, next);
fs.writeFileSync(path.join(root, 'THIRD-PARTY-LICENSES.txt'), 'Three.js 0.160.0 and its addons\n\n' + license);
fs.writeFileSync(path.join(root, 'artifacts/桃源-离线版.html'), next);
const readmeFile = path.join(root, 'README.md');
const readme = fs.readFileSync(readmeFile, 'utf8').replace('也可直接打开 HTML，Three.js 0.160.0 的固定版本模块需要网络。', '也可直接双击 HTML 离线打开；Three.js 0.160.0 及三个 addon 已打包在 HTML 中，无需联网下载。第三方许可见 THIRD-PARTY-LICENSES.txt。');
fs.writeFileSync(readmeFile, readme);
console.log(JSON.stringify({bytes: Buffer.byteLength(next), engineBytes: Buffer.byteLength(engine), file: source}));

