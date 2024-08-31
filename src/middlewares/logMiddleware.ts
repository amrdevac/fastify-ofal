import { FastifyReply, FastifyRequest } from "fastify";
import fs from "fs";
import path from "path";
import { getJakartaFormattedTime } from "../utils/dateFormat";

const isSaveSuccessLog = process.env.SUCCESS_LOG == "true";
const isDevelopment = process.env.NODE_ENV === "development";

function ensureLogFileExists(logFilePath: string): void {
  const logDir = path.dirname(logFilePath);

  // Cek apakah direktori ada, jika tidak buat direktori
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  // Cek apakah file ada, jika tidak buat file baru dengan konten array JSON kosong
  if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, "", "utf8");
  }
}
export const logMiddleware = (
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  let shortStack: string | undefined = undefined;
  const SimpleStack = `${error.stack
    ?.split("\n")[1]
    ?.replace(/^.*\/src\//, "src/")}`;

  const messageLineCode = `${SimpleStack} - ${error.message}`;
  const responseMessage = isDevelopment ? messageLineCode : error.message;
  const logFileName = `error/${new Date().toISOString().slice(0, 10)}.json`;
  const logFilePath = path.join(__dirname, "../logs", logFileName);
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
    timestamp: getJakartaFormattedTime(),
    message: messageLineCode,
    method: request.method,
    url: request.url,
    stack: shortStack,
  };

  const fileContent = fs.readFileSync(logFilePath, "utf8");
  const toJSON = `[${fileContent.slice(0, -2)}]`;
  console.log(JSON.parse(toJSON));

  fs.appendFile(logFilePath, JSON.stringify(logMessage) + ",\n", (err) => {
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

export const successMiddlware = async (
  request: FastifyRequest,
  reply: FastifyReply,
  payload: any
) => {
  const logFileName = `success/${new Date().toISOString().slice(0, 10)}.json`;
  const logFilePath = path.join(__dirname, "../logs", logFileName);

  const logMessage = {
    timestamp: getJakartaFormattedTime(),
    method: request.method,
    url: request.url,
    statusCode: reply.statusCode,
    responseBody: payload,
  };

  // Write log to file
  if (JSON.parse(payload).status && isSaveSuccessLog) {
    fs.appendFile(logFilePath, JSON.stringify(logMessage) + ", \n", (err) => {
      if (err) {
        console.error("Error logging to file:", err.stack);
      }
    });
  }

  return payload;
};
