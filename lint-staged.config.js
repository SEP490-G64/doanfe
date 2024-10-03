/* eslint-env node */
const path = require("path");

module.exports = {
    "*.ts": ["eslint --fix", "prettier --write"],
};
