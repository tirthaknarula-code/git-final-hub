import { spawn } from "child_process";

function run(name, command, args) {
  const child = spawn(command, args, { shell: true, stdio: ["ignore", "pipe", "pipe"] });

  child.stdout.on("data", (data) => {
    const text = data.toString();
    if (/mysql|database|backend api|running on|error|failed|refused/i.test(text)) {
      process.stdout.write(text);
    }
  });

  child.stderr.on("data", (data) => {
    const text = data.toString();
    if (/error|failed|refused|in use|mysql/i.test(text)) {
      process.stderr.write(text);
    }
  });

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

const backend = run("backend", "npm", ["run", "backend"]);
const frontend = run("frontend", "npm", ["run", "frontend"]);

process.on("SIGINT", () => {
  backend.kill();
  frontend.kill();
  console.log("\nStationery Hub stopped.");
  process.exit();
});
