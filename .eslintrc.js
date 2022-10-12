module.exports = {
  env: {
        browser: true,
        es6: true,
        node: true,
  },
    plugins: [
        '@babel'
    ],
    extends: [
        '@vue/standard',
        'plugin:vue/recommended'
    ],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
    rules: {
        'no-var': ['error'],
        'vue/html-indent': ['error', 4, {
            attribute: 1,
            closeBracket: 0,
            switchCase: 0,
            ignores: []
        }],
        indent: ['error', 4],
        'vue/component-name-in-template-casing': ['error', 'kebab-case'],
        'vue/script-indent': [
            'error',
            4,
            { baseIndent: 1 }
        ],
        'no-useless-escape': 'off',
        "space-before-function-paren": ["error", {
            "anonymous": "never",
            "named": "never",
            "asyncArrow": "always"
        }],
        semi: [2, 'never'],
        'vue/singleline-html-element-content-newline': 'off',
        'vue/multiline-html-element-content-newline': 'off'
    },
    overrides: [
        {
            files: ['*.vue'],
            rules: {
                indent: 'off'
            }
        }
    ]
}
