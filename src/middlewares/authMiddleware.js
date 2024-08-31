"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const authMiddleware = (request, reply, done) => {
    var _a;
    const key = request.headers['key'];
    const validKeys = (_a = process.env.KEY_EXIST) === null || _a === void 0 ? void 0 : _a.split(',');
    if (!key || !(validKeys === null || validKeys === void 0 ? void 0 : validKeys.includes(key))) {
        reply.status(401).send({
            status: false,
            message: 'Unauthorized',
            data: null,
            errors: null,
        });
        return;
    }
    done();
};
exports.authMiddleware = authMiddleware;
