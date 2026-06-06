export interface FileSystem {
  [path: string]: string; // full absolute path -> file content
}

export interface TerminalLine {
  text: string;
  type: "input" | "stdout" | "stderr" | "success" | "warning" | "system";
  timestamp: string;
}

export interface ShellState {
  cwd: string;
  env: { [key: string]: string };
  vfs: FileSystem;
  history: string[];
}

export const initialVfs: FileSystem = {
  "/home/user/readme.txt": "Welcome to TermQuest! Type 'help' or 'ls' to begin your adventure.",
  "/home/user/logs/auth.log": "May 23 08:12:00 web-server-1 sshd[1245]: Accepted publickey for user\nMay 23 09:30:15 web-server-1 sshd[1301]: Failed password for root from 192.168.1.50\nMay 23 10:45:22 web-server-1 sshd[1345]: Accepted password for admin from 192.168.1.2",
  "/home/user/backup.sh": "#!/bin/bash\necho \"Backing up system...\"\ntar -czf backup.tar.gz /home/user/logs\necho \"Backup completed!\"",
};

export const initialShellState = (): ShellState => ({
  cwd: "/home/user",
  env: {
    "USER": "user",
    "HOME": "/home/user",
    "PATH": "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
    "TARGET_HOST": "",
  },
  vfs: { ...initialVfs },
  history: [],
});

// Helper: resolve relative path to absolute path
export function resolvePath(cwd: string, targetPath: string): string {
  if (!targetPath) return cwd;
  
  let absolute = "";
  if (targetPath.startsWith("/")) {
    absolute = targetPath;
  } else if (targetPath.startsWith("~")) {
    absolute = "/home/user" + targetPath.slice(1);
  } else {
    absolute = cwd === "/" ? "/" + targetPath : cwd + "/" + targetPath;
  }

  const parts = absolute.split("/").filter(Boolean);
  const resolvedParts: string[] = [];
  
  for (const part of parts) {
    if (part === ".") continue;
    if (part === "..") {
      resolvedParts.pop();
    } else {
      resolvedParts.push(part);
    }
  }
  
  return "/" + resolvedParts.join("/");
}

// Shell Interpreter
export class ShellInterpreter {
  state: ShellState;

  constructor(state: ShellState) {
    this.state = state;
  }

  // Parses env variable references like $VAR or ${VAR}
  expandVariables(input: string): string {
    let expanded = input;
    // Simple $VAR replacement
    const varRegex = /\$(\w+)/g;
    expanded = expanded.replace(varRegex, (_, varName) => {
      return this.state.env[varName] !== undefined ? this.state.env[varName] : "";
    });
    return expanded;
  }

  execute(commandLine: string): { output: TerminalLine[]; newState: ShellState } {
    const trimmed = commandLine.trim();
    if (!trimmed) {
      return { output: [], newState: this.state };
    }

    const outputLines: TerminalLine[] = [];
    const timestamp = new Date().toLocaleTimeString();

    // 1. Add to history
    this.state.history.push(trimmed);

    // 2. Handle variable assignments (e.g. TARGET_HOST=10.0.0.1)
    const assignRegex = /^([a-zA-Z_]\w*)=(.*)$/;
    const assignMatch = trimmed.match(assignRegex);
    if (assignMatch) {
      const varName = assignMatch[1];
      const rawValue = assignMatch[2];
      // strip quotes if present
      const val = rawValue.replace(/^["']|["']$/g, "");
      this.state.env[varName] = this.expandVariables(val);
      outputLines.push({
        text: `${varName} set to: ${this.state.env[varName]}`,
        type: "system",
        timestamp
      });
      return { output: outputLines, newState: this.state };
    }

    // 3. Handle pipelines: command1 | command2 | command3
    if (trimmed.includes("|")) {
      return this.executePipeline(trimmed, timestamp);
    }

    // 4. Handle standard file output redirections: > and >>
    if (trimmed.includes(">")) {
      return this.executeRedirection(trimmed, timestamp);
    }

    // 5. Normal single command execution
    const expandedCmd = this.expandVariables(trimmed);
    const parts = expandedCmd.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    const { stdout, stderr } = this.runCommand(command, args);

    if (stdout) {
      stdout.split("\n").forEach(line => {
        outputLines.push({ text: line, type: "stdout", timestamp });
      });
    }
    if (stderr) {
      stderr.split("\n").forEach(line => {
        outputLines.push({ text: line, type: "stderr", timestamp });
      });
    }

    return { output: outputLines, newState: this.state };
  }

  private runCommand(command: string, args: string[]): { stdout?: string; stderr?: string } {
    switch (command) {
      case "help":
        return {
          stdout: `Available Commands:
  ls [-la]             List files and directories
  cd [dir]             Change working directory
  pwd                  Print working directory
  cat [file]           Display file content
  touch [file]         Create an empty file
  mkdir [dir]          Create a new directory
  rm [-rf] [file/dir]  Remove a file or directory
  echo [text]          Print text to the terminal
  grep [pattern] [f]   Search for pattern in files
  awk                  Extract columns (e.g. awk -F, '$3 > 80 {print $1}')
  chmod [+x] [file]    Modify execution permissions
  whoami               Show current user
  clear/cls            Clear the console screen
  history              Show command history

PowerShell Cmdlets (Level 4-5):
  Get-Process          Retrieve processes on the server
  Get-Service          Retrieve system services
  Start-Service        Start a stopped system service
  Where-Object         Filter objects in pipeline (using -gt, -eq)`
        };

      case "pwd":
        return { stdout: this.state.cwd };

      case "whoami":
        return { stdout: this.state.env["USER"] || "user" };

      case "history":
        return { stdout: this.state.history.map((cmd, i) => `  ${i + 1}  ${cmd}`).join("\n") };

      case "clear":
      case "cls":
        // Handled in UI directly, but return success
        return { stdout: "" };

      case "ls": {
        const showAll = args.includes("-a") || args.includes("-la") || args.includes("-al");
        const isLongList = args.includes("-l") || args.includes("-la") || args.includes("-al");
        
        const pathArg = args.filter(a => !a.startsWith("-"))[0];
        const targetAbs = resolvePath(this.state.cwd, pathArg || ".");

        // Gather children
        const directChildren = new Set<string>();

        // Find immediately lower folders/files
        const relPrefixLength = targetAbs === "/" ? 1 : targetAbs.length + 1;
        
        let hasDirectMatch = false;
        if (this.state.vfs[targetAbs] !== undefined) {
          hasDirectMatch = true;
        }

        if (hasDirectMatch) {
          // It's a file, list it
          const parts = targetAbs.split("/");
          return { stdout: parts[parts.length - 1] };
        }

        // Gather children
        Object.keys(this.state.vfs).forEach(p => {
          if (p.startsWith(targetAbs === "/" ? "" : targetAbs)) {
            const rel = p.slice(relPrefixLength);
            const part = rel.split("/")[0];
            if (part) directChildren.add(part);
          }
        });

        if (directChildren.size === 0 && targetAbs !== "/home/user" && targetAbs !== "/") {
          return { stderr: `ls: cannot access '${pathArg || "."}': No such file or directory` };
        }

        const visibleChildren = Array.from(directChildren).filter(name => {
          if (showAll) return true;
          return !name.startsWith(".");
        }).sort();

        if (isLongList) {
          const lines = visibleChildren.map(name => {
            const isDir = !Object.keys(this.state.vfs).some(p => p === resolvePath(targetAbs, name));
            const perms = isDir ? "drwxr-xr-x" : "-rw-r--r--";
            const owner = "user";
            const size = isDir ? "4096" : (this.state.vfs[resolvePath(targetAbs, name)]?.length || 0).toString();
            const date = "May 23 10:24";
            return `${perms}  1 ${owner}  staff  ${size.padStart(5)} ${date} ${name}`;
          });
          return { stdout: lines.join("\n") };
        }

        return { stdout: visibleChildren.join("   ") };
      }

      case "cd": {
        const target = args[0] || "~";
        const targetAbs = resolvePath(this.state.cwd, target);

        // Check if there is any file under this prefix to verify folder existence
        const folderExists = Object.keys(this.state.vfs).some(p => p.startsWith(targetAbs === "/" ? "/" : targetAbs + "/"));
        const fileExists = this.state.vfs[targetAbs] !== undefined;

        if (fileExists) {
          return { stderr: `bash: cd: ${target}: Not a directory` };
        }

        if (!folderExists && targetAbs !== "/" && targetAbs !== "/home/user") {
          return { stderr: `bash: cd: ${target}: No such file or directory` };
        }

        this.state.cwd = targetAbs;
        return { stdout: "" };
      }

      case "cat": {
        if (args.length === 0) {
          return { stderr: "cat: missing file operand" };
        }
        const targetAbs = resolvePath(this.state.cwd, args[0]);
        if (this.state.vfs[targetAbs] === undefined) {
          return { stderr: `cat: ${args[0]}: No such file or directory` };
        }
        return { stdout: this.state.vfs[targetAbs] };
      }

      case "touch": {
        if (args.length === 0) {
          return { stderr: "touch: missing file operand" };
        }
        const targetAbs = resolvePath(this.state.cwd, args[0]);
        if (this.state.vfs[targetAbs] === undefined) {
          this.state.vfs[targetAbs] = "";
        }
        return { stdout: "" };
      }

      case "mkdir": {
        if (args.length === 0) {
          return { stderr: "mkdir: missing operand" };
        }
        return { stdout: "" };
      }

      case "rm": {
        if (args.length === 0) {
          return { stderr: "rm: missing operand" };
        }
        const isRecursive = args.includes("-r") || args.includes("-rf") || args.includes("-fr");
        const pathArg = args.filter(a => !a.startsWith("-"))[0];
        if (!pathArg) {
          return { stderr: "rm: missing operand" };
        }

        const targetAbs = resolvePath(this.state.cwd, pathArg);

        if (this.state.vfs[targetAbs] !== undefined) {
          delete this.state.vfs[targetAbs];
          return { stdout: "" };
        }

        if (isRecursive) {
          // Delete all files matching path directory prefix
          const targetPrefix = targetAbs === "/" ? "/" : targetAbs + "/";
          const keysToDelete = Object.keys(this.state.vfs).filter(p => p.startsWith(targetPrefix));
          if (keysToDelete.length > 0) {
            keysToDelete.forEach(k => delete this.state.vfs[k]);
            return { stdout: "" };
          }
        }

        return { stderr: `rm: cannot remove '${pathArg}': No such file or directory` };
      }

      case "echo": {
        return { stdout: args.join(" ").replace(/^["']|["']$/g, "") };
      }

      case "chmod": {
        if (args.length < 2) {
          return { stderr: "chmod: missing operand" };
        }
        const targetFile = args[args.length - 1];
        const targetAbs = resolvePath(this.state.cwd, targetFile);
        if (this.state.vfs[targetAbs] === undefined) {
          return { stderr: `chmod: cannot access '${targetFile}': No such file or directory` };
        }
        // Success placeholder (we don't store separate permissions in mock unless long-list, which we can simulate)
        return { stdout: "" };
      }

      case "grep": {
        if (args.length < 2) {
          return { stderr: "Usage: grep [PATTERN] [FILE]" };
        }
        const pattern = args[0].replace(/^["']|["']$/g, "");
        const targetFile = args[1];
        const targetAbs = resolvePath(this.state.cwd, targetFile);

        if (this.state.vfs[targetAbs] === undefined) {
          return { stderr: `grep: ${targetFile}: No such file or directory` };
        }

        const content = this.state.vfs[targetAbs];
        const regex = new RegExp(pattern, "i");
        const lines = content.split("\n");
        const matched = lines.filter(line => regex.test(line));
        
        return { stdout: matched.join("\n") };
      }

      case "awk": {
        // Simple mock of awk -F, '$3 > 80 {print $1, $3}' metrics.csv
        const fullExpr = args.join(" ");
        const delimiterArg = fullExpr.match(/-F\s*([^\s']+)/);
        const delimiter = delimiterArg ? delimiterArg[1] : " ";
        
        const fileArg = args[args.length - 1];
        const targetAbs = resolvePath(this.state.cwd, fileArg);

        if (this.state.vfs[targetAbs] === undefined) {
          return { stderr: `awk: cannot open file ${fileArg}` };
        }

        const lines = this.state.vfs[targetAbs].split("\n").filter(Boolean);

        // Custom simple logic: parse standard columns if expression is standard $3 > 80
        const result: string[] = [];

        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(delimiter);
          
          if (fullExpr.includes("$3 > 80") || fullExpr.includes("$3>80")) {
            const val = parseFloat(cols[2]);
            if (val > 80) {
              if (fullExpr.includes("print $1, $3") || fullExpr.includes("print $1,$3")) {
                result.push(`${cols[0]} ${cols[2]}`);
              } else {
                result.push(cols[0]);
              }
            }
          } else {
            // default output if match simple print
            result.push(cols.join(" "));
          }
        }
        return { stdout: result.join("\n") };
      }

      // PowerShell Mock Cmdlets
      case "get-process": {
        return {
          stdout: `Handles  NPM(K)    PM(K)      WS(K)     CPU(s)     Id  SI ProcessName
-------  ------    -----      -----     ------     --  -- -----------
    240      15    24050      32044     124.50   1402   1  explorer
    451      32    95200     110244     240.12   3421   1  chrome
     90       8     5420       8204       0.15   2010   1  notepad
    180      12    12400      18204       1.24   4410   1  svchost`
        };
      }

      case "get-service": {
        return {
          stdout: `Status   Name               DisplayName
------   ----               -----------
Stopped  W3SVC              World Wide Web Publishing Service
Running  Spooler            Print Spooler
Running  EventLog           Windows Event Log
Stopped  AppIDSvc           Application Identity`
        };
      }

      case "start-service": {
        const nameArg = args.includes("-Name") ? args[args.indexOf("-Name") + 1] : args[0];
        if (!nameArg) {
          return { stderr: "Start-Service: Cannot validate argument on parameter 'Name'." };
        }
        return { stdout: `Service '${nameArg}' starting...\nService '${nameArg}' status set to Running.` };
      }

      default:
        // Try executing running custom executable script if starts with ./
        if (command.startsWith("./")) {
          const scriptName = command.slice(2);
          const targetAbs = resolvePath(this.state.cwd, scriptName);
          if (this.state.vfs[targetAbs] !== undefined) {
            const scriptContent = this.state.vfs[targetAbs];
            // Check for valid shebang
            if (scriptContent.startsWith("#!/bin/bash")) {
              // Parse simple commands in script
              const cmdLines = scriptContent.split("\n").filter(l => !l.startsWith("#") && l.trim() !== "");
              const outputs: string[] = [];
              let hasVarCheck = false;
              
              for (const line of cmdLines) {
                // If it contains simple bash checking of environment variables
                if (line.includes("-z \"$TARGET_HOST\"")) {
                  hasVarCheck = true;
                  if (!this.state.env["TARGET_HOST"]) {
                    outputs.push("No target host");
                  } else {
                    outputs.push(`Monitoring ${this.state.env["TARGET_HOST"]}`);
                  }
                } else if (line.startsWith("echo ")) {
                  if (!hasVarCheck) {
                    const cleanEcho = line.slice(5).replace(/^["']|["']$/g, "");
                    outputs.push(this.expandVariables(cleanEcho));
                  }
                }
              }
              return { stdout: outputs.join("\n") };
            }
          }
          return { stderr: `bash: ${command}: permission denied or executable not found` };
        }

        return { stderr: `bash: ${command}: command not found. Type 'help' to see valid utilities.` };
    }
  }

  // Multi-command Pipeline Simulator
  private executePipeline(pipeline: string, timestamp: string): { output: TerminalLine[]; newState: ShellState } {
    const segments = pipeline.split("|").map(s => s.trim());
    let currentStdout = "";
    let currentStderr = "";

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      const expandedSeg = this.expandVariables(seg);
      const parts = expandedSeg.split(/\s+/);
      const cmd = parts[0].toLowerCase();
      let args = parts.slice(1);

      // If we are not the first command, we pipe the previous stdout in!
      // In high-fidelity simulation, we can intercept where the input goes:
      // - For grep/Where-Object/awk, they normally read the second arg as file. If missing, they read stdin.
      // - We will mock standard stdin capture:
      if (i > 0) {
        if (cmd === "grep") {
          // grep search matching lines of piped output
          const pattern = args[0]?.replace(/^["']|["']$/g, "") || "";
          const regex = new RegExp(pattern, "i");
          const lines = currentStdout.split("\n");
          currentStdout = lines.filter(line => regex.test(line)).join("\n");
          currentStderr = "";
          continue;
        }

        if (cmd === "where-object") {
          // PowerShell Where-Object { $_.CPU -gt 100 }
          const filterStr = seg.substring(seg.indexOf("{") + 1, seg.lastIndexOf("}")).trim();
          const lines = currentStdout.split("\n");
          const header = lines[0];
          const divider = lines[1];
          const dataRows = lines.slice(2);

          const matchedRows = dataRows.filter(row => {
            const cols = row.trim().split(/\s+/);
            // Process search filter: CPU -gt 100
            if (filterStr.includes("-gt 100") && cols[4]) {
              return parseFloat(cols[4]) > 100;
            }
            if (filterStr.includes("-gt 80") && cols[2]) {
              return parseFloat(cols[2]) > 80;
            }
            return true;
          });

          currentStdout = [header, divider, ...matchedRows].join("\n");
          currentStderr = "";
          continue;
        }

        if (cmd === "awk") {
          // Simple awk column extraction from stdin
          const lines = currentStdout.split("\n").filter(Boolean);
          const result: string[] = [];
          for (const line of lines) {
            const cols = line.trim().split(/\s+/);
            if (cols.length > 0) {
              result.push(cols[0]); // print $1
            }
          }
          currentStdout = result.join("\n");
          currentStderr = "";
          continue;
        }
      }

      // First run or regular run
      const res = this.runCommand(cmd, args);
      currentStdout = res.stdout || "";
      currentStderr = res.stderr || "";

      if (currentStderr) {
        break; // Pipeline broken by error
      }
    }

    const outputLines: TerminalLine[] = [];
    if (currentStdout) {
      currentStdout.split("\n").forEach(line => {
        outputLines.push({ text: line, type: "stdout", timestamp });
      });
    }
    if (currentStderr) {
      currentStderr.split("\n").forEach(line => {
        outputLines.push({ text: line, type: "stderr", timestamp });
      });
    }

    return { output: outputLines, newState: this.state };
  }

  // Output Redirection (>) Simulator
  private executeRedirection(commandLine: string, timestamp: string): { output: TerminalLine[]; newState: ShellState } {
    const isAppend = commandLine.includes(">>");
    const delimiter = isAppend ? ">>" : ">";
    const parts = commandLine.split(delimiter);
    const commandPart = parts[0].trim();
    const filePart = parts[1].trim().replace(/^["']|["']$/g, "");

    const targetAbs = resolvePath(this.state.cwd, filePart);

    // Run the command to get stdout
    const expandedCmd = this.expandVariables(commandPart);
    const cmdParts = expandedCmd.split(/\s+/);
    const cmd = cmdParts[0].toLowerCase();
    const args = cmdParts.slice(1);

    const res = this.runCommand(cmd, args);
    const stdout = res.stdout || "";
    const stderr = res.stderr || "";

    const outputLines: TerminalLine[] = [];

    if (stderr) {
      stderr.split("\n").forEach(line => {
        outputLines.push({ text: line, type: "stderr", timestamp });
      });
      return { output: outputLines, newState: this.state };
    }

    // Write stdout to virtual file
    if (isAppend) {
      const existing = this.state.vfs[targetAbs] || "";
      this.state.vfs[targetAbs] = existing + (existing ? "\n" : "") + stdout;
    } else {
      this.state.vfs[targetAbs] = stdout;
    }

    // Success line in system trace
    outputLines.push({
      text: `Output successfully ${isAppend ? 'appended' : 'written'} to ${filePart}`,
      type: "system",
      timestamp
    });

    return { output: outputLines, newState: this.state };
  }
}
