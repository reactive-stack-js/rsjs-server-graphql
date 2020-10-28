#!/usr/bin/env node
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const _ = require("lodash");
const graphql_compose_mongoose_1 = require("graphql-compose-mongoose");
const _f_process_folder_1 = require("./_f.process.folder");
const _f_query_factory_1 = require("./_f.query.factory");
const rsjs_server_1 = require("rsjs-server");
const _f_type_composer_fields_factory_1 = require("./_f.type.composer.fields.factory");
const _metaData = (model) => {
    const modelName = model.modelName;
    const words = _.join(_.map(_.words(modelName), (w) => _.upperFirst(_.toLower(w))), '');
    const name = _.lowerFirst(words);
    const typeName = _.join(['GraphQL', words, 'Type'], '');
    const tc = graphql_compose_mongoose_1.composeWithMongoose(model, { name: typeName });
    return {
        name,
        model,
        tc,
        type: tc.getType()
    };
};
const _generateGraphQLMetaData = (fullPath) => {
    const model = require(fullPath).default;
    return _metaData(model);
};
const _processFile = (root, folder, file) => {
    const fullPath = path.join(folder, file);
    let { graphQLMetaData } = require(fullPath);
    if (!graphQLMetaData)
        graphQLMetaData = _generateGraphQLMetaData(fullPath);
    const { name, model, type } = graphQLMetaData;
    _addToReverseRefs(graphQLMetaData, fullPath);
    rsjs_server_1.CollectionsModelsMap.addCollectionToModelMapping(model);
    const fields = _f_query_factory_1.default(name, model, type);
    return Object.assign(Object.assign({}, root), fields);
};
let reverseRefs = [];
const _addToReverseRefs = (graphQLMetaData, fullPath) => {
    if (!_.isEmpty(graphQLMetaData.graphql))
        reverseRefs.push(fullPath);
};
const _processReverseRefs = () => {
    _.each(reverseRefs, (fullPath) => {
        const { graphQLMetaData } = require(fullPath);
        const { name, model, tc, type, graphql } = graphQLMetaData;
        const schemaFields = [];
        _.each(graphql, (value, key) => {
            if (_.isPlainObject(value)) {
                schemaFields.push(Object.assign({ name: key, target: key }, value));
            }
            else if (_.isBoolean(value)) {
                const fields = _.keys(tc.getFields());
                const hasItemId = _.includes(fields, 'itemId');
                const through = hasItemId ? 'sourceDocumentItemId' : 'sourceDocumentId';
                schemaFields.push({
                    name,
                    target: name,
                    type,
                    model,
                    through
                });
            }
        });
        if (!_.isEmpty(schemaFields)) {
            tc.addFields(_f_type_composer_fields_factory_1.default(schemaFields));
        }
    });
};
const graphQLRootQueryFactory = (folder) => {
    reverseRefs = [];
    const rootQuery = _f_process_folder_1.default({}, folder, _processFile);
    _processReverseRefs();
    return rootQuery;
};
exports.default = graphQLRootQueryFactory;
//# sourceMappingURL=_f.root.query.factory.js.map