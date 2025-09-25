/**
 * 之所以每个配置都自己手动安装、导入，而不使用一些集成好的插件，原因主要是为了学习 eslint 的配置方式，以及一些插件的配置方式。
 */

import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import { defineConfig } from 'eslint/config'
import html from 'eslint-plugin-html'
import importPlugin from 'eslint-plugin-import'
import unusedImports from 'eslint-plugin-unused-imports'
import vuePlugin from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

export default defineConfig([
  {
    name: 'common-rules',
    files: [
      '**/*.html', '**/*.js', '**/*.ts',
    ],
    plugins: {
      html, // HTML 插件用于解析 script 标签
      'unused-imports': unusedImports, // 未使用的导入语句
      import: importPlugin, // 导入语句
    },
    rules: {
      semi: ['error', 'never'], // 禁止使用分号
      eqeqeq: ['error', 'smart'], // 要求使用 === 和 !==（智能模式）
      'comma-dangle': ['error', 'always-multiline'], // 要求对象、数组等的拖尾逗号
      'quote-props': ['error', 'as-needed'], // 对象字面量属性名仅在需要时使用引号
      'object-shorthand': ['error', 'always'], // 要求对象字面量使用简写语法（即：key 和 value 相同的时候只要写一次即可）
      'max-len': [
        'error', { 
          code: 120, // 一行最大字符数
          tabWidth: 2, // tab 宽度
          ignoreUrls: true, // 忽略包含 URL 的行
          ignoreStrings: true, // 忽略字符串
          ignoreTemplateLiterals: true, // 忽略模板字符串
          ignoreComments: true, // 忽略注释
        },
      ], // 强制一行的最大长度
      indent: [
        'error', 2, {
          SwitchCase: 1, // switch case 缩进
          VariableDeclarator: 1, // 变量声明缩进
          outerIIFEBody: 1, // 外层 IIFE 缩进
          MemberExpression: 1, // 成员表达式缩进
          FunctionDeclaration: { parameters: 1, body: 1 }, // 函数声明缩进
          FunctionExpression: { parameters: 1, body: 1 }, // 函数表达式缩进
          CallExpression: { arguments: 1 }, // 函数调用缩进
          ArrayExpression: 1, // 数组表达式缩进
          ObjectExpression: 1, // 对象表达式缩进
          ImportDeclaration: 1, // import 声明缩进
          flatTernaryExpressions: false, // 不允许扁平化三元表达式
          offsetTernaryExpressions: false, // 三元表达式不偏移
          ignoreComments: false, // 不忽略注释的缩进
        },
      ], // 强制使用一致的缩进
      'object-curly-newline': [
        'error', {
          ObjectExpression: { multiline: true, consistent: true }, // 对象表达式换行规则
          ObjectPattern: { multiline: true, consistent: true }, // 对象模式换行规则
          ImportDeclaration: { multiline: true, consistent: true }, // import 声明换行规则
          ExportDeclaration: { multiline: true, consistent: true }, // export 声明换行规则
        },
      ], // 强制大括号内换行符的一致性
      'array-bracket-newline': ['error', { multiline: true, minItems: 3 }], // 数组括号内换行符规则
      'function-paren-newline': ['error', 'multiline-arguments'], // 函数参数换行规则
      'import/first': 'error', // 确保导入语句在文件的顶部
      'import/newline-after-import': 'error', // 确保导入语句后有空行
      'import/no-duplicates': 'error', // 确保导入语句不重复
      'prefer-const': 'error', // 要求使用 const 声明那些声明后不再被修改的变量
      'no-unused-vars': [
        'error',
        {
          vars: 'all', // 检查所有变量（包括全局变量）
          args: 'none', // 不检查函数参数（允许未使用的参数）
          ignoreRestSiblings: true, // 忽略剩余和解构中未使用的变量
        },
      ], // 禁止出现未使用过的变量
      'no-var': 'error', // 要求使用 let 或 const 而不是 var
      quotes: ['error', 'single'], // 强制使用单引号
      'unused-imports/no-unused-imports': 'error', // 自动删除未使用的导入语句
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all', // 检查所有变量（包括全局变量）
          args: 'after-used', // 只检查最后一个被使用的参数之后的参数
          varsIgnorePattern: '^_', // 忽略以下划线开头的变量名
          argsIgnorePattern: '^_', // 忽略以下划线开头的参数名
          ignoreRestSiblings: true, // 忽略剩余和解构中未使用的变量
        },
      ], // 禁止出现未使用过的变量
    },
  },
  {
    files: ['**/*.ts'], // TypeScript 文件
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin, // TypeScript 支持
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports', // 优先使用 type 导入
          fixStyle: 'separate-type-imports', // 将类型导入分离到单独的语句
        },
      ], // 强制类型导入和值导入分离
      '@typescript-eslint/consistent-type-exports': [
        'error',
        {
          fixMixedExportsWithInlineTypeSpecifier: false, // 不允许混合导出
        },
      ], // 强制类型导出的一致性
    },
  },
  {
    files: ['**/*.vue'], // Vue 单文件组件
    languageOptions: {
      parser: vueParser, // 使用 Vue 解析器
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        parser: tsParser, // <script> 标签中使用 TypeScript 解析器
        ecmaFeatures: {
          jsx: true, // 支持 JSX
        },
      },
    },
    plugins: {
      vue: vuePlugin, // Vue 插件
    },
    rules: {
      // 继承 Vue 官方推荐配置
      ...vuePlugin.configs.base.rules, // Vue 基础规则
      ...{
        ...vuePlugin.configs['flat/essential'].map(c => c.rules).reduce((acc, c) => ({ ...acc, ...c }), {}), // Vue 必要规则
        ...vuePlugin.configs['flat/strongly-recommended'].map(c => c.rules).reduce((acc, c) => ({ ...acc, ...c }), {}), // Vue 强烈推荐规则
        ...vuePlugin.configs['flat/recommended'].map(c => c.rules).reduce((acc, c) => ({ ...acc, ...c }), {}), // Vue 推荐规则
      },

      // Vue 组件结构规则
      'vue/component-tags-order': 'off', // 关闭默认的组件标签顺序检查（已经废弃）
      'vue/block-order': [
        'error', {
          order: [
            'template', 'script', 'style', // 要求标签顺序：template -> script -> style
          ],
        },
      ], // 强制单文件组件中块的顺序
      'vue/component-name-in-template-casing': ['error', 'PascalCase'], // 模板中组件名使用 PascalCase
      'vue/component-options-name-casing': ['error', 'PascalCase'], // 组件选项中 name 属性使用 PascalCase
      'vue/custom-event-name-casing': ['error', 'camelCase'], // 自定义事件名使用 camelCase
      'vue/define-macros-order': [
        'error', {
          order: [
            'defineOptions', 'defineProps', 'defineEmits', 'defineSlots', // 宏定义顺序
          ],
        },
      ], // 强制 defineXxx 宏的顺序

      // Vue 语法规则
      'vue/dot-location': ['error', 'property'], // 点操作符位置在属性前
      'vue/dot-notation': ['error', { allowKeywords: true }], // 尽可能使用点表示法访问属性
      'vue/eqeqeq': ['error', 'smart'], // 要求使用 === 和 !==（智能模式）
      'vue/html-indent': ['error', 2], // HTML 模板缩进 2 个空格
      'vue/html-quotes': ['error', 'double'], // HTML 属性使用双引号
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: 3, // 单行最大属性数
          multiline: 1, // 多行最大属性数
        },
      ], // 每行最大属性数限制
      'vue/multi-word-component-names': 'off', // 关闭组件名必须多单词的要求
      'vue/no-dupe-keys': 'off', // 关闭重复键检查（由 TypeScript 处理）

      // Vue 错误预防规则
      'vue/no-empty-pattern': 'error', // 禁止空解构模式
      'vue/no-irregular-whitespace': 'error', // 禁止不规则的空白
      'vue/no-loss-of-precision': 'error', // 禁止数字字面量失去精度
      'vue/no-restricted-syntax': [
        'error',
        'DebuggerStatement', // 禁止 debugger 语句
        'LabeledStatement', // 禁止标签语句
        'WithStatement', // 禁止 with 语句
      ], // 禁止指定的语法
      'vue/no-restricted-v-bind': ['error', '/^v-/'], // 禁止使用以 v- 开头的动态指令名
      'vue/no-setup-props-reactivity-loss': 'error', // 禁止 setup 中 props 响应性丢失
      'vue/no-sparse-arrays': 'error', // 禁止稀疏数组（[,,] 这种是不允许的）
      'vue/no-unused-refs': 'error', // 禁止未使用的 refs
      'vue/no-useless-v-bind': 'error', // 禁止无用的 v-bind
      'vue/no-v-html': 'off', // 允许使用 v-html

      // Vue 最佳实践规则
      'vue/object-shorthand': [
        'error',
        'always',
        {
          avoidQuotes: true, // 避免引号
          ignoreConstructors: false, // 不忽略构造函数
        },
      ], // 要求对象字面量使用简写语法
      'vue/prefer-separate-static-class': 'error', // 优先将静态 class 分离
      'vue/prefer-template': 'error', // 优先使用模板字符串
      'vue/prop-name-casing': ['error', 'camelCase'], // prop 名使用 camelCase
      'vue/require-default-prop': 'error', // 必须提供默认 prop 值的要求
      'vue/require-prop-types': 'error', // 必须定义 prop 类型的要求

      // Vue 代码风格规则
      'vue/space-infix-ops': 'error', // 要求中缀操作符周围有空格
      'vue/space-unary-ops': ['error', { nonwords: false, words: true }], // 一元操作符空格规则
      'vue/array-bracket-spacing': ['error', 'never'], // 数组括号内不允许空格
      'vue/arrow-spacing': ['error', { after: true, before: true }], // 箭头函数空格规则
      'vue/block-spacing': ['error', 'always'], // 块级作用域括号内必须有空格
      'vue/block-tag-newline': [
        'error', {
          multiline: 'always', // 多行块标签必须换行
          singleline: 'always', // 单行块标签也必须换行
        },
      ], // 块标签换行规则
      'vue/brace-style': [
        'error', 'stroustrup', { allowSingleLine: true }, // Stroustrup 大括号风格，允许单行
      ], // 大括号风格
      'vue/comma-dangle': ['error', 'always-multiline'], // 多行时要求拖尾逗号
      'vue/comma-spacing': ['error', { after: true, before: false }], // 逗号后有空格，前无空格
      'vue/comma-style': ['error', 'last'], // 逗号在行尾
      'vue/html-comment-content-spacing': [
        'error', 'always', {
          exceptions: ['-'], // HTML 注释内容空格规则，除了 - 开头
        },
      ], // HTML 注释内容间距
      'vue/key-spacing': ['error', { afterColon: true, beforeColon: false }], // 对象键值间距
      'vue/keyword-spacing': ['error', { after: true, before: true }], // 关键字前后空格
      'vue/object-curly-newline': [
        'error', {
          ObjectExpression: { multiline: true, consistent: true }, // 对象表达式换行规则
          ObjectPattern: { multiline: true, consistent: true }, // 对象模式换行规则
          ImportDeclaration: { multiline: true, consistent: true }, // import 声明换行规则
          ExportDeclaration: { multiline: true, consistent: true }, // export 声明换行规则
        },
      ], // 对象大括号换行规则
      'vue/object-curly-spacing': ['error', 'always'], // 对象大括号内必须有空格
      'vue/object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }], // 对象属性换行规则
      'vue/operator-linebreak': ['error', 'before'], // 操作符在行首
      'vue/padding-line-between-blocks': ['error', 'always'], // 块之间必须有空行
      'vue/quote-props': ['error', 'consistent-as-needed'], // 对象属性引号一致性
      'vue/space-in-parens': ['error', 'never'], // 圆括号内不允许空格
      'vue/template-curly-spacing': 'error', // 模板字符串大括号间距
    },
  },
])
