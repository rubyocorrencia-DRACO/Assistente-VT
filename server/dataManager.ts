import fs from "fs";
const clientsFile = "./data/clients.json";

export function loadClientData() {
  if (!fs.existsSync(clientsFile)) return [];
  return JSON.parse(fs.readFileSync(clientsFile, "utf-8"));
}

export function saveClientData(data: any) {
  fs.writeFileSync(clientsFile, JSON.stringify(data, null, 2));
}
