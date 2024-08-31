
export function getJakartaFormattedTime(): string {
  const jakartaTime: string = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });
  const date: Date = new Date(jakartaTime);

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}`;
}

function pad(number: number): string {
  return (number < 10 ? "0" : "") + number;
}
