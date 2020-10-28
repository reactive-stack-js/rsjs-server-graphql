#!/usr/bin/env node
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_type_json_1 = require("graphql-type-json");
const graphql_1 = require("graphql");
const graphQLQueryFactory = (name, model, type) => {
    const queries = {};
    queries[name] = {
        type,
        args: { id: { type: graphql_1.GraphQLID }, query: { type: graphql_type_json_1.GraphQLJSONObject } },
        resolve: (parent, args) => {
            const { id, query } = args;
            if (id)
                return model.findOne({ _id: args.id });
            return model.findOne(query);
        }
    };
    queries[name + 's'] = {
        type: new graphql_1.GraphQLList(type),
        args: {
            pageSize: { type: graphql_1.GraphQLInt },
            page: { type: graphql_1.GraphQLInt },
            filter: { type: graphql_type_json_1.GraphQLJSONObject },
            sort: { type: graphql_type_json_1.GraphQLJSONObject }
        },
        resolve: (parent, args) => {
            const { page, pageSize, filter = {}, sort = {} } = args;
            if (page && pageSize) {
                return model
                    .find(filter)
                    .sort(sort)
                    .limit(pageSize)
                    .skip((page - 1) * pageSize);
            }
            return model.find(filter).sort(sort);
        }
    };
    queries[name + 'sCount'] = {
        type: graphql_1.GraphQLInt,
        args: {
            filter: { type: graphql_type_json_1.GraphQLJSONObject }
        },
        resolve: (parent, args) => {
            const { filter = {} } = args;
            return model.countDocuments(filter);
        }
    };
    return queries;
};
exports.default = graphQLQueryFactory;
//# sourceMappingURL=_f.query.factory.js.map