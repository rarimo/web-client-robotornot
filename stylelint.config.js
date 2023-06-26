// https://stylelint.io/user-guide/rules/

module.exports = {
  plugins: ['stylelint-scss', 'stylelint-declaration-strict-value'],
  extends: ['stylelint-config-standard-scss'],
  rules: {
    /* disable unnecessary rules from recommended extends */
    'function-no-unknown': null,
    'at-rule-no-unknown': null,
    'no-empty-first-line': null,
    'selector-class-pattern': null,
    'function-name-case': null,
    'selector-no-vendor-prefix': null,
    'custom-property-empty-line-before': null,
    'no-empty-source': null,
    'scss/at-else-empty-line-before': null,
    'scss/at-if-closing-brace-space-after': null,
    'scss/at-if-closing-brace-newline-after': null,
    'scss/at-else-closing-brace-newline-after': null,
    'scss/at-else-closing-brace-space-after': null,
    'declaration-colon-newline-after': null,
    'scss/at-function-pattern': null,
    'scss/at-rule-no-unknown': null,
    'scss/selector-no-redundant-nesting-selector': null,
    'max-nesting-depth': null,

    'color-no-invalid-hex': [true, { severity: 'warning' }],
    'font-family-no-duplicate-names': [true, { severity: 'warning' }],
    'font-family-no-missing-generic-family-keyword': [
      true,
      { severity: 'warning' },
    ],
    'function-calc-no-unspaced-operator': [true, { severity: 'warning' }],
    'function-linear-gradient-no-nonstandard-direction': [
      true,
      { severity: 'warning' },
    ],
    'string-no-newline': [true, { severity: 'warning' }],
    'unit-no-unknown': [true, { severity: 'warning' }],
    'property-no-unknown': [
      true,
      {
        severity: 'warning',
        checkPrefixed: true,
      },
    ],
    'keyframe-declaration-no-important': [true, { severity: 'warning' }],
    'declaration-block-no-duplicate-properties': [
      true,
      { severity: 'warning' },
    ],
    'declaration-block-no-shorthand-property-overrides': [
      true,
      { severity: 'warning' },
    ],
    'block-no-empty': [true, { severity: 'warning' }],
    'selector-type-no-unknown': [true, { severity: 'warning' }],
    'media-feature-name-no-unknown': [true, { severity: 'warning' }],
    'comment-no-empty': [true, { severity: 'warning' }],
    'no-duplicate-at-import-rules': [true, { severity: 'warning' }],
    'number-max-precision': [6, { severity: 'warning' }],
    'time-min-milliseconds': [100, { severity: 'warning' }],
    'unit-disallowed-list': [
      ['px', 'cm', 'mm', 'pt', 'in', 'pc'],
      {
        severity: 'warning',
        /**
         * it's not working with '["px", "dpi"]' syntax
         * as in example in the docs
         * so we need to use this hack with regex.
         */
        ignoreMediaFeatureNames: {
          px: [/a-zA-Z0-9/],
          dpi: [/a-zA-Z0-9/],
        },
        /**
         * allow to use 'px' and 'dpi' in variables that has prefix 'media-'
         *
         * we need to use "." (dot) at the beginning of the regex to prevent
         * handle variables values because linter doesn't read '$' value in the
         * "/^\$media-/" regex, so we try not to match the first character
         */
        ignoreProperties: {
          px: ['/^.media-/'],
          dpi: ['/^.media-/'],
        },
      },
    ],
    'shorthand-property-no-redundant-values': [true, { severity: 'warning' }],
    'value-no-vendor-prefix': [
      true,
      {
        severity: 'warning',
        ignoreValues: ['inline-box'],
      },
    ],
    'property-no-vendor-prefix': [
      true,
      {
        severity: 'warning',
        ignoreProperties: [
          'background-clip',
          'box-decoration-break',
          'box-orient',
          'transition-property',
          'appearance',
        ],
      },
    ],
    'declaration-block-no-redundant-longhand-properties': [
      true,
      { severity: 'warning' },
    ],
    'declaration-no-important': [true, { severity: 'warning' }],
    'declaration-block-single-line-max-declarations': [
      1,
      { severity: 'warning' },
    ],
    'at-rule-no-vendor-prefix': [true, { severity: 'warning' }],
    'no-unknown-animations': [true, { severity: 'warning' }],
    'color-hex-length': ['long', { severity: 'warning' }],
    'font-family-name-quotes': [
      'always-unless-keyword',
      { severity: 'warning' },
    ],
    'font-weight-notation': ['numeric', { severity: 'warning' }],
    'function-url-quotes': ['always', { severity: 'warning' }],
    'length-zero-no-unit': [true, { severity: 'warning' }],
    'value-keyword-case': ['lower', { severity: 'warning' }],
    'selector-attribute-quotes': ['always', { severity: 'warning' }],
    'selector-pseudo-element-colon-notation': [
      'single',
      { severity: 'warning' },
    ],
    'selector-type-case': ['lower', { severity: 'warning' }],
    'rule-empty-line-before': [
      'always-multi-line',
      {
        severity: 'warning',
        ignore: ['after-comment', 'first-nested'],
      },
    ],
    'at-rule-empty-line-before': [
      'always',
      {
        severity: 'warning',
        ignore: ['after-comment', 'first-nested'],
      },
    ],
    'comment-whitespace-inside': ['always', { severity: 'warning' }],
    /**
     * disallow to use defined properties without variables
     */
    'scale-unlimited/declaration-strict-value': [
      ['/color/', 'z-index', 'fill', 'stroke'],
      {
        ignoreFunctions: false,
        ignoreKeywords: {
          // '' means default, for all
          '': ['currentColor', 'transparent', 'inherit', 'initial'],
          fill: ['none'],
          stroke: ['none'],
        },
      },
    ],
    'selector-pseudo-class-no-unknown': [true, { severity: 'warning' }],
    'selector-pseudo-element-no-unknown': [
      true,
      { ignorePseudoElements: ['v-deep', 'v-global'], severity: 'warning' },
    ],
    'no-duplicate-selectors': [true, { severity: 'warning' }],
    'no-descending-specificity': [true, { severity: 'warning' }],
    'color-function-notation': 'legacy',
    'scss/at-mixin-parentheses-space-before': 'always',
    'alpha-value-notation': 'number',
    'selector-not-notation': 'simple',
  },
}
