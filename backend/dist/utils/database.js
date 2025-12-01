"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDB = void 0;
const factory_1 = require("../database/factory");
// Utility to get the database adapter instance
// This is used by controllers to access the database
const getDB = () => {
    return (0, factory_1.getDatabaseAdapterSync)();
};
exports.getDB = getDB;
