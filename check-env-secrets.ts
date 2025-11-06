#!/usr/bin/env ts-node

import { execSync } from 'child_process'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

/**
 * 检查 Git 中已修改的 .env 文件，确保包含 API_KEY 的环境变量值为空字符串
 * 
 * 逻辑流程：
 * 1. 获取 Git 中所有已修改的文件（包括已暂存和未暂存的）
 * 2. 筛选出所有 .env 相关的文件
 * 3. 解析这些文件，找到所有包含 "API_KEY" 的键
 * 4. 检查这些键的值是否为空字符串
 * 5. 如果发现非空值，收集所有错误并报告
 */

interface EnvViolation {
  key: string;
  value: string;
}

/**
 * 获取 Git 中已修改的文件列表
 * 包括：
 * - 已暂存的修改 (staged)
 * - 未暂存的修改 (modified)
 * - 新添加的文件 (untracked)
 */
function getModifiedFiles(): string[] {
  try {
    // 获取已暂存和未暂存的修改文件
    const diffFiles = execSync('git diff --name-only HEAD', { encoding: 'utf-8' })
      .trim()
      .split('\n')
      .filter(Boolean)
    
    // 获取未跟踪的文件
    const untrackedFiles = execSync('git ls-files --others --exclude-standard', { encoding: 'utf-8' })
      .trim()
      .split('\n')
      .filter(Boolean)
    
    // 合并并去重
    const allFiles = [...new Set([...diffFiles, ...untrackedFiles])]
    
    console.log(`📋 找到 ${allFiles.length} 个已修改的文件`)
    return allFiles
  } catch (error) {
    console.error('❌ 获取 Git 修改文件列表失败:', error)
    process.exit(1)
  }
}

/**
 * 筛选出所有 .env 文件
 * 匹配模式：.env, .env.local, .env.development, .env.production 等
 */
function filterEnvFiles(files: string[]): string[] {
  const envFiles = files.filter(file => {
    const filename = file.split('/').pop() || ''
    return filename.startsWith('.env')
  })
  
  console.log(`🔍 找到 ${envFiles.length} 个 .env 文件:`, envFiles)
  return envFiles
}

/**
 * 解析 .env 文件内容，找到所有包含 "API_KEY" 的键值对
 * 
 * @param filePath - .env 文件路径
 * @returns 违规项列表（值不为空字符串的项）
 */
function checkEnvFile(filePath: string): EnvViolation[] {
  const violations: EnvViolation[] = []
  const absolutePath = resolve(process.cwd(), filePath)
  
  // 检查文件是否存在
  if (!existsSync(absolutePath)) {
    console.warn(`⚠️  文件不存在: ${filePath}`)
    return violations
  }
  
  try {
    const content = readFileSync(absolutePath, 'utf-8')
    const lines = content.split('\n')
    
    lines.forEach((line) => {
      const trimmedLine = line.trim()
      
      // 跳过空行和注释行
      if (!trimmedLine || trimmedLine.startsWith('#')) {
        return
      }
      
      // 解析键值对：KEY=VALUE
      const match = trimmedLine.match(/^([^=]+)=(.*)$/)
      if (!match) {
        return
      }
      
      const [
        , key, value,
      ] = match
      const trimmedKey = key.trim()
      const trimmedValue = value.trim()
      
      // 检查 key 是否包含 "API_KEY"
      if (trimmedKey.includes('API_KEY')) {
        // 处理带引号的值
        let actualValue = trimmedValue
        
        // 移除首尾的单引号或双引号
        if ((actualValue.startsWith('"') && actualValue.endsWith('"')) ||
            (actualValue.startsWith('\'') && actualValue.endsWith('\''))) {
          actualValue = actualValue.slice(1, -1)
        }
        
        // 如果值不为空字符串，记录违规
        if (actualValue !== '') {
          violations.push({
            key: trimmedKey,
            value: actualValue,
          })
        }
      }
    })
  } catch (error) {
    console.error(`❌ 读取文件失败 ${filePath}:`, error)
  }
  
  return violations
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 开始检查 .env 文件中的 API_KEY...\n')
  
  // 1. 获取已修改的文件
  const modifiedFiles = getModifiedFiles()
  
  if (modifiedFiles.length === 0) {
    console.log('✅ 没有已修改的文件，检查完成')
    process.exit(0)
  }
  
  // 2. 筛选 .env 文件
  const envFiles = filterEnvFiles(modifiedFiles)
  
  if (envFiles.length === 0) {
    console.log('✅ 没有已修改的 .env 文件，检查完成')
    process.exit(0)
  }
  
  console.log('\n📝 开始检查文件内容...\n')
  
  // 3. 检查每个 .env 文件
  let sumViolations = 0
  // 按文件分组
  const violationsByFile = new Map<string, EnvViolation[]>()
  envFiles.forEach(file => {
    const violations = checkEnvFile(file)
    if (!violations.length) return
    violationsByFile.set(file, violations)
    sumViolations += violations.length
  })
  
  // 4. 报告结果
  console.log('\n' + '='.repeat(60))
  
  if (sumViolations === 0) {
    console.log('✅ 检查完成！所有包含 API_KEY 的环境变量值都为空字符串')
    console.log('='.repeat(60))
    process.exit(0)
  } else {
    console.log('❌ 检查失败！发现以下问题：\n')
    
    // 按文件输出
    const files = Array.from(violationsByFile.keys())
    files.forEach((file, index) => {
      console.log(`文件: ${file}`)
      const violations = violationsByFile.get(file)!
      violations.forEach(violation => {
        console.log(`${violation.key}=${violation.value}`)
      })
      
      // 文件之间空一行（最后一个文件后不空行）
      if (index < files.length - 1) {
        console.log('')
      }
    })
    
    console.log(`\n🚨 共发现 ${sumViolations} 个违规项`)
    console.log('⚠️  包含 "API_KEY" 的环境变量必须为空字符串！（避免被泄露）')
    console.log('='.repeat(60))
    process.exit(1)
  }
}

// 执行主函数
main()

