#!/usr/bin/env node
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const graphql_compose_mongoose_1 = require("graphql-compose-mongoose");
const _f_type_composer_fields_factory_1 = require("./_f.type.composer.fields.factory");
const _createTargetName = (name) => {
    const parts = _.split(name, 'Id');
    return _.join(parts, 'Document');
};
const graphQLTypeComposerFactory = (model, name, additionalFields) => {
    const tc = graphql_compose_mongoose_1.composeWithMongoose(model, { name });
    const type = tc.getType();
    if (!_.isEmpty(additionalFields))
        tc.addFields(additionalFields);
    const schemaFields = [];
    _.each(model.schema.obj, (value, key) => {
        const targetName = _createTargetName(key);
        if (_.isPlainObject(value.graphql)) {
            if (!_.get(value, 'graphql.target', false)) {
                _.set(value, 'graphql.target', targetName);
            }
            schemaFields.push(Object.assign({ name: key }, value.graphql));
        }
        else if (_.isString(value.graphql)) {
            schemaFields.push({ name: key, target: value.graphql, type, model });
        }
        else if (_.isBoolean(value.graphql)) {
            schemaFields.push({ name: key, target: targetName, type, model });
        }
    });
    if (!_.isEmpty(schemaFields)) {
        tc.addFields(_f_type_composer_fields_factory_1.default(schemaFields));
    }
    return tc;
};
exports.default = graphQLTypeComposerFactory;
//# sourceMappingURL=_f.type.composer.factory.js.map