#!/usr/bin/env node
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const lodash_1 = require("lodash");
const processFolder = (root, folder, fileProcessor) => {
    const fileNames = fs.readdirSync(folder);
    const files = lodash_1.filter(fileNames, (fileName) => !fs.lstatSync(path.join(folder, fileName)).isDirectory());
    files.forEach((file) => {
        const ext = path.extname(file);
        if (ext !== '.ts' && ext !== '.js')
            return;
        root = fileProcessor(root, folder, file);
    });
    const folders = lodash_1.filter(fileNames, (fileName) => fs.lstatSync(path.join(folder, fileName)).isDirectory());
    folders.forEach((subfolder) => {
        root = processFolder(root, subfolder, fileProcessor);
    });
    return root;
};
exports.default = processFolder;
//# sourceMappingURL=_f.process.folder.js.map