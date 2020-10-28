#!/usr/bin/env node
import { Model } from 'mongoose';
import { GraphQLObjectType } from 'graphql';
export declare type GraphQLTypeFactoryFieldType = {
    name: string;
    target: string;
    type: GraphQLObjectType | [GraphQLObjectType];
    model: Model<any>;
    through?: string;
};
declare const typeComposerFieldsFactory: (fields: GraphQLTypeFactoryFieldType[]) => {};
export default typeComposerFieldsFactory;
