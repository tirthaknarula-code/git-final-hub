import { spawn } from "child_process";
import path from "path";

const rootDir = process.cwd();
const backendDir = path.join(rootDir, "backend");
const frontendDir = path.join(rootDir, "frontend");

function run(name, command, args, cwd) {
  const child = spawn(command, args, { cwd, shell: true, stdio: "inherit" });
  child.on("exit", (code) => {
    if (code !== 0 && code !== null) console.log(`${name} stopped with code ${code}`);
  });

  return child;
}

console.clear();
console.log("Starting Stationery Hub");
console.log("Frontend: http://127.0.0.1:5173");
console.log("Backend:  http://127.0.0.1:3001");
console.log("Press Ctrl+C to stop.\n");

const backend = run("backend", "node", ["server.js"], backendDir);
const frontend = run("frontend", "npx", ["vite", "--host", "127.0.0.1"], frontendDir);

process.on("SIGINT", () => {
  backend.kill();
  frontend.kill();
  console.log("\nStationery Hub stopped.");
  process.exit();
});
