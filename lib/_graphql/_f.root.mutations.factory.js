#!/usr/bin/env node
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const _ = require("lodash");
const _f_process_folder_1 = require("./_f.process.folder");
const _processFile = (root, folder, file) => {
    const fullPath = path.join(folder, file);
    const mutations = require(fullPath);
    const filename = path.parse(file).name;
    const relPath = './mutations' + _.last(_.split(folder + '/' + file, 'mutations'));
    const wrong = _.filter(_.keys(mutations), (key) => !_.startsWith(key, filename));
    console.log(' - In', relPath, 'RENAMING following mutations:', _.join(wrong, ', '));
    const fixed = {};
    const keys = _.keys(mutations);
    _.each(keys, (key) => {
        if (_.startsWith(key, filename)) {
            fixed[key] = mutations[key];
        }
        else {
            fixed[filename + _.upperFirst(key)] = mutations[key];
        }
    });
    return Object.assign(Object.assign({}, root), fixed);
};
const graphQLRootMutationsFactory = (folder) => {
    return _f_process_folder_1.default({}, folder, _processFile);
};
exports.default = graphQLRootMutationsFactory;
//# sourceMappingURL=_f.root.mutations.factory.js.map