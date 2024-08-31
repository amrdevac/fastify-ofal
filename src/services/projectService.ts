import { randomUUID } from "crypto";
import { FastifyReply, FastifyRequest } from "fastify";
import knex from "knex";
import mysqlConn from "../knex";

export const listProjects = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { offset = 0, limit = 5 } = request.body as {
      offset?: number;
      limit?: number;
    };

    const projects = await mysqlConn("projects")
      .select("*")
      .offset(offset)
      .limit(limit);

    reply.send({
      status: true,
      message: "Data berhasil diambil",
      data: projects,
      errors: null,
    });
  } catch (error) {
    throw error;
  }
};

export const addProject = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { name, description } = request.body as {
    name: string;
    description: string;
  };

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
      id: randomUUID(),
      user_id: "some-user-id", // Replace this with actual user_id from the authenticated user
      name,
      description,
    };
    await knex("projects").insert(newProject);
    reply.send({
      status: true,
      message: "Data berhasil ditambahkan",
      data: newProject,
      errors: null,
    });
  } catch (error) {
    reply.status(500).send({
      status: false,
      message: "Terjadi kesalahan",
      data: null,
      errors: error,
    });
  }
};

export const updateProject = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };
  const { name, description } = request.body as {
    name: string;
    description: string;
  };

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
    const project = await knex("projects").where({ id }).first();

    if (!project) {
      return reply.status(400).send({
        status: false,
        message: "Data tidak ditemukan",
        data: null,
        errors: null,
      });
    }

    const updatedProject = { name, description };
    await knex("projects").where({ id }).update(updatedProject);
    reply.send({
      status: true,
      message: "Data berhasil diupdate",
      data: updatedProject,
      errors: null,
    });
  } catch (error) {
    reply.status(500).send({
      status: false,
      message: "Terjadi kesalahan",
      data: null,
      errors: error,
    });
  }
};

export const deleteProject = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };

  try {
    const project = await knex("projects").where({ id }).first();

    if (!project) {
      return reply.status(400).send({
        status: false,
        message: "Data tidak ditemukan",
        data: null,
        errors: null,
      });
    }

    await knex("projects").where({ id }).delete();
    reply.send({
      status: true,
      message: "Data berhasil dihapus",
      data: project,
      errors: null,
    });
  } catch (error) {
    reply.status(500).send({
      status: false,
      message: "Terjadi kesalahan",
      data: null,
      errors: error,
    });
  }
};
