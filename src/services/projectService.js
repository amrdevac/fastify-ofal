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
exports.deleteProject = exports.updateProject = exports.addProject = exports.listProjects = void 0;
const crypto_1 = require("crypto");
const knex_1 = __importDefault(require("knex"));
const knex_2 = __importDefault(require("../knex"));
const listProjects = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { offset = 0, limit = 5 } = request.body;
        const projects = yield (0, knex_2.default)("projects")
            .select("*")
            .offset(offset)
            .limit(limit);
        reply.send({
            status: true,
            message: "Data berhasil diambil",
            data: projects,
            errors: null,
        });
    }
    catch (error) {
        throw error;
    }
});
exports.listProjects = listProjects;
const addProject = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = request.body;
    if (!name || name.length < 3) {
        return reply.status(400).send({
            status: false,
            message: "Validasi error",
            data: null,
            errors: { name: ["Nama minimal 3 karakter"] },
        });
    }
    if (!description || description.length > 255) {
        return reply.status(400).send({
            status: false,
            message: "Validasi error",
            data: null,
            errors: { description: ["Deskripsi maksimal 255 karakter"] },
        });
    }
    try {
        const newProject = {
            id: (0, crypto_1.randomUUID)(),
            user_id: "some-user-id", // Replace this with actual user_id from the authenticated user
            name,
            description,
        };
        yield (0, knex_1.default)("projects").insert(newProject);
        reply.send({
            status: true,
            message: "Data berhasil ditambahkan",
            data: newProject,
            errors: null,
        });
    }
    catch (error) {
        reply.status(500).send({
            status: false,
            message: "Terjadi kesalahan",
            data: null,
            errors: error,
        });
    }
});
exports.addProject = addProject;
const updateProject = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    const { name, description } = request.body;
    if (!name || name.length < 3) {
        return reply.status(400).send({
            status: false,
            message: "Validasi error",
            data: null,
            errors: { name: ["Nama minimal 3 karakter"] },
        });
    }
    if (!description || description.length > 255) {
        return reply.status(400).send({
            status: false,
            message: "Validasi error",
            data: null,
            errors: { description: ["Deskripsi maksimal 255 karakter"] },
        });
    }
    try {
        const project = yield (0, knex_1.default)("projects").where({ id }).first();
        if (!project) {
            return reply.status(400).send({
                status: false,
                message: "Data tidak ditemukan",
                data: null,
                errors: null,
            });
        }
        const updatedProject = { name, description };
        yield (0, knex_1.default)("projects").where({ id }).update(updatedProject);
        reply.send({
            status: true,
            message: "Data berhasil diupdate",
            data: updatedProject,
            errors: null,
        });
    }
    catch (error) {
        reply.status(500).send({
            status: false,
            message: "Terjadi kesalahan",
            data: null,
            errors: error,
        });
    }
});
exports.updateProject = updateProject;
const deleteProject = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    try {
        const project = yield (0, knex_1.default)("projects").where({ id }).first();
        if (!project) {
            return reply.status(400).send({
                status: false,
                message: "Data tidak ditemukan",
                data: null,
                errors: null,
            });
        }
        yield (0, knex_1.default)("projects").where({ id }).delete();
        reply.send({
            status: true,
            message: "Data berhasil dihapus",
            data: project,
            errors: null,
        });
    }
    catch (error) {
        reply.status(500).send({
            status: false,
            message: "Terjadi kesalahan",
            data: null,
            errors: error,
        });
    }
});
exports.deleteProject = deleteProject;
