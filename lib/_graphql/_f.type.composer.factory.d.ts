#!/usr/bin/env node
import { Model } from 'mongoose';
import { ObjectTypeComposer } from 'graphql-compose';
declare const graphQLTypeComposerFactory: (model: Model<any>, name: string, additionalFields?: any) => ObjectTypeComposer<any, any>;
export default graphQLTypeComposerFactory;
