"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.successMiddlware = exports.logMiddleware = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dateFormat_1 = require("../utils/dateFormat");
const isSaveSuccessLog = process.env.SUCCESS_LOG == "true";
const isDevelopment = process.env.NODE_ENV === "development";
function ensureLogFileExists(logFilePath) {
    const logDir = path_1.default.dirname(logFilePath);
    // Cek apakah direktori ada, jika tidak buat direktori
    if (!fs_1.default.existsSync(logDir)) {
        fs_1.default.mkdirSync(logDir, { recursive: true });
    }
    // Cek apakah file ada, jika tidak buat file baru dengan konten array JSON kosong
    if (!fs_1.default.existsSync(logFilePath)) {
        fs_1.default.writeFileSync(logFilePath, "", "utf8");
    }
}
const logMiddleware = (error, request, reply) => {
    var _a, _b;
    let shortStack = undefined;
    const SimpleStack = `${(_b = (_a = error.stack) === null || _a === void 0 ? void 0 : _a.split("\n")[1]) === null || _b === void 0 ? void 0 : _b.replace(/^.*\/src\//, "src/")}`;
    const messageLineCode = `${SimpleStack} - ${error.message}`;
    const responseMessage = isDevelopment ? messageLineCode : error.message;
    const logFileName = `error/${new Date().toISOString().slice(0, 10)}.json`;
    const logFilePath = path_1.default.join(__dirname, "../logs", logFileName);
    ensureLogFileExists(logFilePath);
    if (error.stack) {
        shortStack = error.stack
            .split("\n")
            .map((line) => {
            const index = line.indexOf("src/");
            return index !== -1 ? line.slice(index) : line;
        })
            .join("\n");
    }
    // Membuat pesan log dalam format JSON
    const logMessage = {
        timestamp: (0, dateFormat_1.getJakartaFormattedTime)(),
        message: messageLineCode,
        method: request.method,
        url: request.url,
        stack: shortStack,
    };
    const fileContent = fs_1.default.readFileSync(logFilePath, "utf8");
    const toJSON = `[${fileContent.slice(0, -2)}]`;
    console.log(JSON.parse(toJSON));
    fs_1.default.appendFile(logFilePath, JSON.stringify(logMessage) + ",\n", (err) => {
        if (err) {
            console.error("Error logging to file:", err.stack);
        }
    });
    reply.status(500).send({
        status: false,
        message: responseMessage,
        data: null,
        errors: null,
    });
};
exports.logMiddleware = logMiddleware;
const successMiddlware = (request, reply, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const logFileName = `success/${new Date().toISOString().slice(0, 10)}.json`;
    const logFilePath = path_1.default.join(__dirname, "../logs", logFileName);
    const logMessage = {
        timestamp: (0, dateFormat_1.getJakartaFormattedTime)(),
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
        responseBody: payload,
    };
    // Write log to file
    if (JSON.parse(payload).status && isSaveSuccessLog) {
        fs_1.default.appendFile(logFilePath, JSON.stringify(logMessage) + ", \n", (err) => {
            if (err) {
                console.error("Error logging to file:", err.stack);
            }
        });
    }
    return payload;
});
exports.successMiddlware = successMiddlware;
