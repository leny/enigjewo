/* leny/enigjewo
 *
 * /.eslintrc.js - ESLint config
 *
 * coded by leny@BeCode
 * started at 01/02/2021
 */

const OFF = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {
    extends: "@becode",
    parser: "@babel/eslint-parser",
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
        babelOptions: {
            presets: ["@babel/preset-react"],
        },
    },
    plugins: ["react-hooks"],
    rules: {
        "no-confusing-arrow": WARNING,
        "react-hooks/rules-of-hooks": ERROR,
        "react-hooks/exhaustive-deps": WARNING,
        // cf. https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html
        "react/jsx-uses-react": OFF,
        "react/react-in-jsx-scope": OFF,
    },
};
