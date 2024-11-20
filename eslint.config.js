import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tsEslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import importPlugin from "eslint-plugin-import";

export default tsEslint.config(
  { ignores: ["dist"] },
  {
    extends: [
      js.configs.recommended,
      ...tsEslint.configs.recommended,
      eslintConfigPrettier,
      eslintPluginPrettierRecommended,
      importPlugin.flatConfigs.recommended,
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "off",
        { allowConstantExport: true },
      ],
      "react-hooks/exhaustive-deps": "off",
      "prettier/prettier": "warn",
      "arrow-body-style": "off",
      "prefer-arrow-callback": "off",
      "@typescript-eslint/no-explicit-any": "off",
      // 模块
      "import/no-unresolved": "off", // 禁止无法解析的模块
      "import/named": "off", // 确保导入的命名成员存在
      "import/namespace": "error", // 确保从命名空间导入的成员存在
      "import/default": "error", // 确保默认导入的成员存在
      "import/export": "error", // 确保导出的成员存在
      "import/extensions": "off", // 禁止省略文件扩展名
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
        },
      ], // 导入顺序
      "import/newline-after-import": "error", // 导入后必须有一个空行
    },
  },
);
