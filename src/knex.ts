// src/knex.ts
import knex from 'knex';
import config from './knexfile';

// Inisialisasi Knex dengan konfigurasi dari `knexfile`
const mysqlConn = knex(config);

// mysqlConn['db'] = db;

export default mysqlConn;
