import getESLintConfig from '@antfu/eslint-config'

export default getESLintConfig(
  {},
  {
    name: 'common',
    rules: {
      'no-console': 'off',
      'unused-imports/no-unused-imports': 'error',
    },
  },
)
