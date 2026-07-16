import { spawn } from "child_process";

function run(name, command, args) {
  const child = spawn(command, args, {
    shell: true,
    stdio: "inherit",
  });

  child.on("exit", (code) => {
    if (code !== 0) console.log(`${name} stopped with code ${code}`);
  });

  return child;
}

const backend = run("backend", "npm", ["run", "backend"]);
const frontend = run("frontend", "npm", ["run", "frontend"]);

process.on("SIGINT", () => {
  backend.kill();
  frontend.kill();
  process.exit();
});
