import { spawn } from "child_process";

function run(name, command, args) {
  const child = spawn(command, args, { shell: true, stdio: "inherit" });

  child.on("exit", (code) => {
    if (code !== 0 && code !== null) console.log(`${name} stopped with code ${code}`);
  });

  return child;
}

console.log("Starting Stationery Hub...");
console.log("Frontend: http://127.0.0.1:5173");
console.log("Backend:  http://127.0.0.1:3001/api/health");
console.log("Press Ctrl+C to stop both servers.\n");

const backend = run("backend", "npm", ["run", "backend"]);
const frontend = run("frontend", "npm", ["run", "frontend"]);

process.on("SIGINT", () => {
  backend.kill();
  frontend.kill();
  process.exit();
});
