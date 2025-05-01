#!/usr/bin/env node

import { execa } from 'execa';
import fs from 'fs-extra';
import os from 'node:os';
import path from 'node:path';

const HOME_DIR = os.homedir();
const HUSKY_INIT_PATH = path.join(HOME_DIR, '.config', 'husky', 'init.sh');
const NVM_PATTERN = '.nvm';
const VOLTA_PATTERN = '.volta';
const NVM_INIT_TEMPLATE_PATH = path.join(process.cwd(), 'scripts', 'husky-templates', 'nvm-init.mustache');
const VOLTA_INIT_TEMPLATE_PATH = path.join(process.cwd(), 'scripts', 'husky-templates', 'volta-init.mustache');

async function main() {
  try {
    // 检测pnpm是否通过volta或nvm安装
    const pnpmPath = (await execa('which', ['pnpm'])).stdout;
    console.log(`👉 pnpm path: ${pnpmPath}`);

    let isNvm = false;
    let isVolta = false;

    if (pnpmPath.includes(NVM_PATTERN)) {
      isNvm = true;
      console.log('👉 pnpm is installed via nvm');
    } else if (pnpmPath.includes(VOLTA_PATTERN)) {
      isVolta = true;
      console.log('👉 pnpm is installed via volta');
    } else {
      console.log('👉 pnpm is not installed via nvm or volta, no action needed');
      return;
    }

    // 处理husky init文件
    const huskyDirPath = path.dirname(HUSKY_INIT_PATH);
    if (!fs.existsSync(huskyDirPath)) {
      console.log(`👉 Creating husky config directory: ${huskyDirPath}`);
      fs.mkdirpSync(huskyDirPath);
    }

    if (fs.existsSync(HUSKY_INIT_PATH)) {
      // 文件存在，检查内容
      const content = fs.readFileSync(HUSKY_INIT_PATH, 'utf-8');

      if (isNvm && !content.includes('export NVM_DIR')) {
        console.log('👉 Adding nvm init to husky init file');
        const nvmInitContent = fs.readFileSync(NVM_INIT_TEMPLATE_PATH, 'utf-8');
        fs.appendFileSync(HUSKY_INIT_PATH, '\n' + nvmInitContent);
      } else if (isVolta && !content.includes('export VOLTA_HOME')) {
        console.log('👉 Adding volta init to husky init file');
        const voltaInitContent = fs.readFileSync(VOLTA_INIT_TEMPLATE_PATH, 'utf-8');
        fs.appendFileSync(HUSKY_INIT_PATH, '\n' + voltaInitContent);
      } else {
        console.log('👉 Husky init file already contains required configuration');
      }
    } else {
      // 文件不存在，创建文件
      if (isNvm) {
        console.log(`👉 Creating husky init file with nvm configuration: ${HUSKY_INIT_PATH}`);
        const nvmInitContent = fs.readFileSync(NVM_INIT_TEMPLATE_PATH, 'utf-8');
        fs.writeFileSync(HUSKY_INIT_PATH, nvmInitContent);
      } else if (isVolta) {
        console.log(`👉 Creating husky init file with volta configuration: ${HUSKY_INIT_PATH}`);
        const voltaInitContent = fs.readFileSync(VOLTA_INIT_TEMPLATE_PATH, 'utf-8');
        fs.writeFileSync(HUSKY_INIT_PATH, voltaInitContent);
      }
    }

    // 确保文件有执行权限
    fs.chmodSync(HUSKY_INIT_PATH, '755');
    console.log('✅ Husky init file setup completed');
  } catch (error) {
    console.error('❌ Error setting up husky init file:', error);
    process.exit(1);
  }
}

main();
