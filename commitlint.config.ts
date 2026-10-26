import { RuleConfigSeverity, type UserConfig } from "@commitlint/types";

const commitlintConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      RuleConfigSeverity.Error,
      "always",
      // https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional#type-enum
      [
        "build",
        "chore",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
        "test",
      ],
    ],
  },
} satisfies UserConfig;

export default commitlintConfig;
