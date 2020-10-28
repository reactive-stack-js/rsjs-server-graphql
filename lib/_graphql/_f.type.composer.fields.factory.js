#!/usr/bin/env node
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const mongoose_1 = require("mongoose");
const typeComposerFieldsFactory = (fields) => {
    const typeComposerFields = {};
    _.each(fields, (field) => {
        let { model, type } = field;
        const { name, target, through } = field;
        if (!through) {
            typeComposerFields[target] = { type };
            if (!_.isArray(type)) {
                typeComposerFields[target].resolve = (instance) => {
                    return instance[name] ? model.findOne(instance[name]) : null;
                };
            }
            else {
                typeComposerFields[target].resolve = (instance) => {
                    if (_.isEmpty(instance[name]))
                        return [];
                    return model.find({ _id: instance[name] });
                };
            }
        }
        else {
            if (_.isFunction(type))
                type = type();
            if (_.isFunction(model))
                model = model();
            typeComposerFields[target] = { type };
            typeComposerFields[target].resolve = (instance) => __awaiter(void 0, void 0, void 0, function* () {
                const query = {};
                query[through] = { $in: [mongoose_1.Types.ObjectId(instance._id)] };
                if (!_.isArray(type)) {
                    return yield model.findOne(query);
                }
                else {
                    return yield model.find(query);
                }
            });
        }
    });
    return typeComposerFields;
};
exports.default = typeComposerFieldsFactory;
//# sourceMappingURL=_f.type.composer.fields.factory.js.map