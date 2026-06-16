import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 💡 1. 抹平 ES Module 环境下的 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 💡 2. 严格指向你的 221 个 SVG 存放的真实文件夹（请根据实际结构微调，比如 'public/svgs' 或 'src/assets'）
const ASSETS_DIR = path.join(__dirname, 'public', 'assets', 'jianzipu_svgs');

// 💡 3. 指向你的映射配置文件
const MAPPING_FILE_PATH = path.join(__dirname, 'src', 'guqinKeyMapping.ts');

function checkAssetCoverage() {
  // 检查资源文件夹是否存在
  if (!fs.existsSync(ASSETS_DIR)) {
    console.error(`❌ 错误：找不到资产文件夹，请检查路径是否正确: ${ASSETS_DIR}`);
    return;
  }

  // 检查映射文件是否存在
  if (!fs.existsSync(MAPPING_FILE_PATH)) {
    console.error(`❌ 错误：找不到映射配置文件，请检查路径: ${MAPPING_FILE_PATH}`);
    return;
  }

  // A. 读取本地文件夹内真实的 SVG 文件列表
  const allRealFiles = fs.readdirSync(ASSETS_DIR).filter(f => f.endsWith('.svg'));

  // B. 动态解析 .ts 文件内容，提取里面所有被注册的 .svg 字符串
  const mappingContent = fs.readFileSync(MAPPING_FILE_PATH, 'utf-8');
  // 使用全局正则匹配所有以 .svg 结尾的字符串（包含单双引号或反引号内的内容）
  const svgRegex = /[\'\"\`]([^'"`]+\.svg)[\'\"\`]/g;
  const mappedKeys = [];
  let match;
  while ((match = svgRegex.exec(mappingContent)) !== null) {
    // 避免重复加入
    if (!mappedKeys.includes(match[1])) {
      mappedKeys.push(match[1]);
    }
  }

  // C. 开始打印交叉比对报告
  console.log('\n=============================================');
  console.log('       🎵 古琴 221 全量资产文件核对报告 🎵       ');
  console.log('=============================================');
  console.log(` 📂 本地文件夹内实际包含的 SVG 总数: ${allRealFiles.length}`);
  console.log(` 📝 映射代码中检测到已配置的 SVG 数量: ${mappedKeys.length}`);
  console.log('---------------------------------------------');

  // D. 计算缺失（本地有，但代码没配）
  const missingInCode = allRealFiles.filter(file => !mappedKeys.includes(file));
  if (missingInCode.length > 0) {
    console.log(`\n⚠️  警告：以下 ${missingInCode.length} 个本地文件【未在映射代码中注册】:`);
    console.table(missingInCode);
  } else {
    console.log('\n✅ 表现完美：本地所有 SVG 文件均已在代码中注册！');
  }

  // E. 计算冗余（代码配了，但本地文件夹找不到物理文件）
  const missingInFolder = mappedKeys.filter(key => !allRealFiles.includes(key));
  if (missingInFolder.length > 0) {
    console.log(`\n❌ 错误：以下 ${missingInFolder.length} 个代码中的配置在文件夹里【找不到真实文件】:`);
    console.table(missingInFolder);
  } else {
    console.log('✅ 表现完美：代码中没有指向任何不存在的空假文件！');
  }
  console.log('=============================================\n');
}

checkAssetCoverage();