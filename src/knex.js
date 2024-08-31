"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/knex.ts
const knex_1 = __importDefault(require("knex"));
const knexfile_1 = __importDefault(require("./knexfile"));
// Inisialisasi Knex dengan konfigurasi dari `knexfile`
const mysqlConn = (0, knex_1.default)(knexfile_1.default);
// mysqlConn['db'] = db;
exports.default = mysqlConn;
