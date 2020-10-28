#!/usr/bin/env node
import { Model } from 'mongoose';
import { GraphQLObjectType } from 'graphql';
declare const graphQLQueryFactory: (name: string, model: Model<any>, type: GraphQLObjectType) => any;
export default graphQLQueryFactory;
