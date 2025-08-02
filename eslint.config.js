import js from "@eslint/js";
import globals from "globals";
import nodePlugin from "eslint-plugin-n";

export default [
  js.configs.recommended,

  // Node.js specific configuration
  {
    plugins: {
      n: nodePlugin
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.es2022
      }
    },
    settings: {
      node: {
        version: ">=16.0.0"
      }
    },
    rules: {
      // Code style rules
      indent: [
        "error",
        2,
        { SwitchCase: 1, ignoredNodes: ["ConditionalExpression"] }
      ],
      "linebreak-style": ["error", "unix"],
      quotes: ["error", "double", { avoidEscape: true }],
      semi: ["error", "always"],
      "comma-dangle": ["error", "never"],
      "comma-spacing": ["error", { before: false, after: true }],
      "comma-style": ["error", "last"],
      "key-spacing": ["error", { beforeColon: false, afterColon: true }],
      "keyword-spacing": ["error", { before: true, after: true }],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      "space-before-blocks": ["error", "always"],
      "space-before-function-paren": [
        "error",
        {
          anonymous: "always",
          named: "never",
          asyncArrow: "always"
        }
      ],
      "space-in-parens": ["error", "never"],
      "space-infix-ops": "error",
      "space-unary-ops": ["error", { words: true, nonwords: false }],

      // Variables and functions
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_"
        }
      ],
      "no-console": "off",
      "prefer-const": "error",
      "no-var": "error",
      "one-var": ["error", "never"],

      // ES6+ features
      "object-shorthand": "error",
      "prefer-arrow-callback": "error",
      "prefer-template": "error",
      "template-curly-spacing": "error",
      "arrow-spacing": "error",
      "arrow-parens": ["error", "always"],
      "arrow-body-style": ["error", "as-needed"],
      "no-duplicate-imports": "error",
      "no-useless-rename": "error",
      "rest-spread-spacing": "error",
      "prefer-destructuring": [
        "warn",
        {
          array: false,
          object: true
        },
        {
          enforceForRenamedProperties: false
        }
      ],
      "prefer-spread": "error",
      "prefer-rest-params": "error",

      // Error prevention
      "no-magic-numbers": [
        "warn",
        {
          ignore: [-1, 0, 1, 2, 10, 100, 1000, 1024, 2048, 60000, 3600000],
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
          enforceConst: true,
          detectObjects: false
        }
      ],
      "no-throw-literal": "error",
      "prefer-promise-reject-errors": "error",
      "require-await": "warn",
      "no-return-await": "error",

      // Best practices
      "consistent-return": "warn",
      "default-case": "warn",
      "default-case-last": "error",
      eqeqeq: ["error", "always"],
      "guard-for-in": "error",
      "no-caller": "error",
      "no-empty-function": ["error", { allow: ["constructors"] }],
      "no-eval": "error",
      "no-extend-native": "error",
      "no-extra-bind": "error",
      "no-floating-decimal": "error",
      "no-implicit-coercion": "error",
      "no-lone-blocks": "error",
      "no-loop-func": "error",
      "no-multi-spaces": "error",
      "no-new": "error",
      "no-new-func": "error",
      "no-new-wrappers": "error",
      "no-param-reassign": [
        "error",
        {
          props: true,
          ignorePropertyModificationsFor: ["options", "config", "state"]
        }
      ],
      "no-return-assign": "error",
      "no-script-url": "error",
      "no-self-compare": "error",
      "no-sequences": "error",
      "no-unmodified-loop-condition": "error",
      "no-unused-expressions": "error",
      "no-useless-call": "error",
      "no-useless-concat": "error",
      "no-useless-return": "error",
      "no-void": "error",
      radix: "error",
      "require-unicode-regexp": "warn",
      "wrap-iife": ["error", "inside"],
      yoda: "error",

      // Node.js specific rules
      "n/no-deprecated-api": ["error", { version: ">=16.0.0" }],
      "n/no-unsupported-features/es-syntax": ["error", { version: ">=16.0.0" }],
      "n/no-unsupported-features/node-builtins": [
        "error",
        {
          version: ">=16.17.0"
        }
      ],
      "n/prefer-global/buffer": ["error", "always"],
      "n/prefer-global/console": ["error", "always"],
      "n/prefer-global/process": ["error", "always"],
      "n/prefer-global/url": ["error", "always"],
      "n/prefer-promises/dns": "error",
      "n/prefer-promises/fs": "error",
      "n/no-process-env": [
        "error",
        {
          allowedVariables: ["NODE_ENV", "CI", "DEBUG", "TERM"]
        }
      ],
      "n/exports-style": ["error", "module.exports"],
      "n/file-extension-in-import": "off", // Too strict for this project
      "n/no-missing-import": "error",
      "n/no-missing-require": "error",
      "n/no-extraneous-import": "error",
      "n/no-extraneous-require": "error"
    }
  },

  // Test files configuration
  {
    files: ["**/*.test.js", "**/*.spec.js", "**/__tests__/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.jest
      }
    },
    rules: {
      "no-unused-expressions": "off",
      "no-magic-numbers": "off",
      "prefer-arrow-callback": "off",
      "require-await": "off",
      "require-unicode-regexp": "off",
      "consistent-return": "off",
      "default-case": "off",
      "n/no-unpublished-require": "off",
      "n/no-unpublished-import": "off",
      "n/no-process-env": "off",
      "no-empty-function": [
        "error",
        { "allow": ["arrowFunctions", "constructors"] }
      ]
    }
  },

  // CLI and executable files
  {
    files: ["src/cli.js"],
    rules: {
      "n/hashbang": "error",
      "n/no-process-exit": "off",
      "no-magic-numbers": "off"
    }
  }
];
