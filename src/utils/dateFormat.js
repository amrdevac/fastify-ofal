"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJakartaFormattedTime = getJakartaFormattedTime;
function getJakartaFormattedTime() {
    const jakartaTime = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });
    const date = new Date(jakartaTime);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
function pad(number) {
    return (number < 10 ? "0" : "") + number;
}
