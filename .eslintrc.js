module.exports = {
    extends: ["@lusito/eslint-config"],
    rules: {
        // fixme:
        "@typescript-eslint/no-non-null-assertion": "off",
        "max-classes-per-file": "off",
    },
    env: {
        browser: true,
    },
};
