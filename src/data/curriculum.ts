export interface Mission {
  id: string;
  levelNum: number;
  title: string;
  subtitle: string;
  category: "Linux" | "PowerShell" | "DevOps" | "Security" | "KQL" | "SQL";
  xpReward: number;
  story: string;
  objective: string;
  taskDescription: string;
  initialVfsState?: { [path: string]: string };
  validationRules: {
    type: "file_exists" | "file_contains" | "command_contains" | "vfs_state" | "script_executes_successfully" | "env_equals";
    params: any;
  }[];
  hints: string[];
  solutionWalkthrough: string;
  realWorldUseCase: string;
  commonMistakes: string;
  debuggingTips: string;
  activeIncident?: {
    title: string;
    description: string;
    severity: "CRITICAL" | "HIGH" | "MEDIUM";
  };
}

export interface Level {
  num: number;
  name: string;
  rank: string;
  description: string;
  missions: Mission[];
}

export const curriculum: Level[] = [
  {
    num: 0,
    name: "Terminal Survival",
    rank: "Terminal Survivor",
    description: "Master essential enterprise terminal operations — navigation, file inspection, process management, networking, and system plumbing.",
    missions: [
      {
        id: "m0_1",
        levelNum: 0,
        title: "The Silent Server",
        subtitle: "Hidden file discovery in production",
        category: "Linux",
        xpReward: 100,
        story: "You just joined 'NexGen Cloud' as a Junior SRE. A web server is acting up. The senior tells you: 'Check the home directory for a hidden config file — an automated update might have overwritten it.' The override token must be found.",
        objective: "Locate and read the hidden file '.config_override' in your home directory to retrieve the server's override token.",
        taskDescription: "Use ls with the appropriate flag to show hidden files, then cat the hidden config file.",
        initialVfsState: {
          "/home/user/.config_override": "OVERRIDE_TOKEN=MX_8829_ALPHA\nPORT=8080\nSTATUS=MAINTENANCE",
          "/home/user/readme.txt": "Welcome to NexGen Cloud! Use commands like ls -la and cat to explore."
        },
        validationRules: [{ type: "command_contains", params: { substrings: ["cat", ".config_override"] } }],
        hints: ["'ls -a' shows hidden (dot) files.", "Use 'cat' to read file contents.", "Try: ls -la then cat .config_override"],
        solutionWalkthrough: "Run 'ls -la' to reveal '.config_override', then 'cat .config_override' to print its contents.",
        realWorldUseCase: "Hidden dotfiles like .env, .gitignore, and .bashrc store secrets and configs. Every engineer must know how to find them.",
        commonMistakes: "Using 'ls' without '-a' and assuming the directory is empty. Forgetting the dot prefix.",
        debuggingTips: "Run 'pwd' to confirm the current directory, then 'ls -la' to list all files."
      },
      {
        id: "m0_2",
        levelNum: 0,
        title: "The Overflowing Vault",
        subtitle: "Emergency log cleanup on production DB",
        category: "Linux",
        xpReward: 120,
        story: "PAGER: Disk on db-prime is 99% full! A runaway logger named 'temp_transactions.log' is flooding the logs directory. Delete it immediately before the database crashes.",
        objective: "Navigate to the 'logs' directory and remove the file 'temp_transactions.log' without deleting other important logs.",
        taskDescription: "Change directory into logs, list contents, then remove only the offending file.",
        initialVfsState: {
          "/home/user/logs/temp_transactions.log": "[RUNAWAY] 0x8F9A garbage repeated 100000x",
          "/home/user/logs/keep_me.log": "Database core processes stable. Do not delete."
        },
        validationRules: [{ type: "vfs_state", params: { path: "/home/user/logs/temp_transactions.log", shouldExist: false } }],
        hints: ["Use 'cd logs' to enter the directory.", "'ls' shows the files inside.", "'rm filename' deletes a file."],
        solutionWalkthrough: "Run 'cd logs && rm temp_transactions.log' or 'rm logs/temp_transactions.log' from the home directory.",
        realWorldUseCase: "Disk-full alerts are the #1 cause of production outages. Knowing how to precisely remove specific log files is critical.",
        commonMistakes: "Using 'rm -rf logs/' which would delete ALL logs, including important ones.",
        debuggingTips: "After deletion, verify with 'ls logs/' to confirm the file is gone."
      },
      {
        id: "m0_3",
        levelNum: 0,
        title: "The Whispering Pipe",
        subtitle: "Log filtering with grep and redirection",
        category: "Linux",
        xpReward: 140,
        story: "SOC alerts: brute-force attempt detected on the SSH server. Security needs every failed login line isolated from 'sshd.log'. Don't open the file — use CLI plumbing.",
        objective: "Filter lines containing 'FAILED' from 'logs/sshd.log' and write them into 'logs/failures.txt'.",
        taskDescription: "Use grep to search for FAILED, then redirect (>) the output to a new file.",
        initialVfsState: {
          "/home/user/logs/sshd.log": "May 23 10:00:12 sshd[4201]: Accepted publickey for admin\nMay 23 10:01:05 sshd[4205]: FAILED password for root from 192.168.1.100\nMay 23 10:01:10 sshd[4205]: FAILED password for root from 192.168.1.100\nMay 23 10:02:15 sshd[4209]: Accepted publickey for operator\nMay 23 10:03:45 sshd[4212]: FAILED password for invalid_user from 10.0.0.5",
          "/home/user/logs/failures.txt": ""
        },
        validationRules: [{ type: "file_contains", params: { path: "/home/user/logs/failures.txt", substring: "FAILED" } }],
        hints: ["grep searches for patterns: grep 'FAILED' filename", "Use > to redirect output to a file.", "Try: grep FAILED logs/sshd.log > logs/failures.txt"],
        solutionWalkthrough: "Run: grep FAILED logs/sshd.log > logs/failures.txt",
        realWorldUseCase: "Logs can be gigabytes. Engineers use grep + redirection to extract forensic evidence without opening massive files.",
        commonMistakes: "Reversing the redirection direction (e.g., grep FAILED failures.txt > sshd.log would erase the log!).",
        debuggingTips: "Check 'cat logs/failures.txt' to confirm only FAILED lines were written."
      },
      {
        id: "m0_4",
        levelNum: 0,
        title: "The Process Hunter",
        subtitle: "Identifying and terminating runaway processes",
        category: "Linux",
        xpReward: 150,
        story: "A zombie PHP process is eating 98% CPU on the web server. Your boss yells: 'Find the PID of the php-cgi process and kill it NOW!'",
        objective: "Use 'ps aux' to find any process containing 'php-cgi', note its PID, and terminate it.",
        taskDescription: "List processes with ps aux, use grep to find php-cgi, then kill the process by its PID.",
        initialVfsState: {},
        validationRules: [{ type: "command_contains", params: { substrings: ["ps aux", "php-cgi"] } }, { type: "command_contains", params: { substrings: ["kill", "php-cgi"] } }],
        hints: ["'ps aux' shows all running processes.", "Pipe to 'grep php-cgi' to find the target.", "'kill -9 PID' force-terminates a process."],
        solutionWalkthrough: "Run 'ps aux | grep php-cgi' to find the PID. Then run 'kill -9 <PID>' to terminate it. Note the validation accepts a single combined command 'ps aux | grep php-cgi | awk '{print $2}' | xargs kill' as well.",
        realWorldUseCase: "Runaway processes are the most common cause of server degradation. Quick process identification and termination is a core SRE skill.",
        commonMistakes: "Killing the grep process itself (grep shows in ps output). Also forgetting -9 for stubborn processes.",
        debuggingTips: "Run 'ps aux | grep php-cgi' first to verify the PID, then kill it."
      },
      {
        id: "m0_5",
        levelNum: 0,
        title: "The Disk Analyzer",
        subtitle: "Investigating disk usage across mounts",
        category: "Linux",
        xpReward: 130,
        story: "The monitoring dashboard shows '/' is at 85% capacity. Your lead asks: 'Check disk usage on all mounted filesystems. Tell me which mount point has the most usage.'",
        objective: "Run the command 'df -h' to check disk usage across all filesystems and identify the most used mount.",
        taskDescription: "Execute 'df -h' and report the output. Then check the size of the home directory using 'du -sh /home/user'.",
        initialVfsState: {},
        validationRules: [{ type: "command_contains", params: { substrings: ["df", "-h"] } }],
        hints: ["'df -h' shows human-readable disk usage per filesystem.", "'du -sh /path' shows total size of a directory."],
        solutionWalkthrough: "Run 'df -h' to see disk space across all mounts. Then run 'du -sh /home/user' to see directory usage.",
        realWorldUseCase: "Capacity planning and disk monitoring rely on df and du. Alerting systems trigger on threshold breaches.",
        commonMistakes: "Running 'df' without '-h' shows raw block counts, which are hard to read. Confusing 'du' with 'df'.",
        debuggingTips: "Use 'df -h /' to check a specific mount point."
      },
      {
        id: "m0_6",
        levelNum: 0,
        title: "The Network Scout",
        subtitle: "Basic network connectivity and port checks",
        category: "Linux",
        xpReward: 160,
        story: "Users report the application is unreachable. You suspect the web server process is down or the port is closed. Check if port 8080 is listening and if you can reach the database host.",
        objective: "Check listening ports using 'ss -tlnp' and test connectivity using 'ping'.",
        taskDescription: "Run 'ss -tlnp' to show listening TCP ports. Then run 'ping -c 3 8.8.8.8' to verify network connectivity.",
        initialVfsState: {},
        validationRules: [{ type: "command_contains", params: { substrings: ["ss", "-tlnp"] } }],
        hints: ["'ss -tlnp' shows TCP listening sockets and the associated processes.", "'ping -c 3 <host>' sends 3 ICMP echo requests."],
        solutionWalkthrough: "Run 'ss -tlnp | grep 8080' to check if your service is listening. Run 'ping -c 3 8.8.8.8' to test internet connectivity.",
        realWorldUseCase: "Troubleshooting connectivity is a daily task. ss/netstat show listening services; ping tests layer-3 reachability.",
        commonMistakes: "Using the deprecated 'netstat' instead of 'ss'. Forgetting 'sudo' which may hide some processes from ss.",
        debuggingTips: "Run 'ss -tulnp' to see both TCP and UDP sockets with process names."
      },
      {
        id: "m0_7",
        levelNum: 0,
        title: "The Permission Guardian",
        subtitle: "Reading and changing file permissions",
        category: "Linux",
        xpReward: 140,
        story: "Your deployment pipeline just failed with 'Permission denied'. The script 'deploy.sh' has incorrect permissions. Check the current permission bits and fix them to make it executable.",
        objective: "Check permissions of 'deploy.sh' using 'ls -l', then add execute permission for the owner.",
        taskDescription: "Run 'ls -l deploy.sh' to view current permissions. Then use 'chmod +x deploy.sh' to make it executable.",
        initialVfsState: {
          "/home/user/deploy.sh": "#!/bin/bash\necho 'Deploying application...'\n./start.sh"
        },
        validationRules: [{ type: "command_contains", params: { substrings: ["chmod", "+x", "deploy.sh"] } }],
        hints: ["'ls -l' shows file permissions as a 10-character string.", "'chmod +x file' adds execute permission for all users."],
        solutionWalkthrough: "Run 'ls -l deploy.sh' to see '-rw-r--r--' (no x). Then run 'chmod +x deploy.sh'. Verify with 'ls -l' again.",
        realWorldUseCase: "Scripts, binaries, and SSH keys all require correct permissions. Incorrect permissions are the #1 cause of deployment failures.",
        commonMistakes: "Using 'chmod 777' which grants full access to everyone — a security risk.",
        debuggingTips: "Permissions are read as: owner (rwx), group (r-x), others (r--). The 'x' bit means executable."
      },
      {
        id: "m0_8",
        levelNum: 0,
        title: "The Environment Illuminator",
        subtitle: "Inspecting and setting environment variables",
        category: "Linux",
        xpReward: 120,
        story: "The application needs the 'DATABASE_URL' environment variable to connect. Check if it's currently set. If not, set it to 'postgresql://prod:5432/app'.",
        objective: "Use 'env' or 'echo $DATABASE_URL' to check, then export the required DATABASE_URL.",
        taskDescription: "Check the current environment variables. If DATABASE_URL is not set, assign it using the export command or inline assignment.",
        initialVfsState: {},
        validationRules: [{ type: "env_equals", params: { variable: "DATABASE_URL", value: "postgresql://prod:5432/app" } }],
        hints: ["'env' lists all environment variables.", "'echo $VARIABLE' prints a specific variable.", "'export VAR=value' sets it for the session."],
        solutionWalkthrough: "Run 'echo $DATABASE_URL' to check. If empty, run 'export DATABASE_URL=postgresql://prod:5432/app'.",
        realWorldUseCase: "Environment variables configure containers, CI/CD pipelines, and cloud platforms. Every deployment tool uses them.",
        commonMistakes: "Using 'VAR=value' without 'export' — the variable won't be inherited by child processes.",
        debuggingTips: "Run 'env | grep DATABASE_URL' to confirm the variable is set."
      },
      {
        id: "m0_9",
        levelNum: 0,
        title: "The File Sorter",
        subtitle: "Sorting and deduplicating log entries",
        category: "Linux",
        xpReward: 150,
        story: "The load balancer logs contain duplicate entries from multiple replicas. Your task: sort the IP list and remove duplicates to get a clean list of unique visitor IPs.",
        objective: "Sort the file 'logs/access.log' and output only unique lines using 'sort -u'.",
        taskDescription: "Run 'sort -u logs/access.log' to get sorted unique entries. Optionally redirect to 'logs/unique_ips.txt'.",
        initialVfsState: {
          "/home/user/logs/access.log": "192.168.1.10\n10.0.0.5\n192.168.1.10\n172.16.0.20\n10.0.0.5\n8.8.8.8"
        },
        validationRules: [{ type: "command_contains", params: { substrings: ["sort", "-u", "access.log"] } }],
        hints: ["'sort filename' sorts lines alphabetically.", "The '-u' flag outputs only unique lines (removes duplicates).", "Try: sort -u logs/access.log"],
        solutionWalkthrough: "Run 'sort -u logs/access.log' to display unique sorted entries. Add '> logs/unique_ips.txt' to save the result.",
        realWorldUseCase: "Log deduplication, inventory sorting, and data cleaning rely on sort -u. It's used daily in data pipelines.",
        commonMistakes: "Forgetting the '-u' flag and getting duplicate entries in the sorted output.",
        debuggingTips: "Test with 'sort logs/access.log' first (shows sorted with dupes), then add '-u'."
      },
      {
        id: "m0_10",
        levelNum: 0,
        title: "The Word Counter",
        subtitle: "Counting lines, words, and characters",
        category: "Linux",
        xpReward: 110,
        story: "The compliance team needs a report: how many lines does the application log contain? Count the lines in 'app.log'.",
        objective: "Use 'wc -l app.log' to count lines, 'wc -w' for words, and 'wc -c' for characters.",
        taskDescription: "Run the three wc variants on the file 'app.log' and report the line count.",
        initialVfsState: {
          "/home/user/app.log": "INFO: Server started\nERROR: Connection timeout\nINFO: Retry successful\nWARN: Memory usage high\nINFO: Server stopped"
        },
        validationRules: [{ type: "command_contains", params: { substrings: ["wc", "-l", "app.log"] } }],
        hints: ["'wc -l file' counts lines.", "'wc -w file' counts words.", "'wc -c file' counts bytes/characters."],
        solutionWalkthrough: "Run 'wc -l app.log' to get the line count. Run 'wc -w app.log' and 'wc -c app.log' for words and bytes.",
        realWorldUseCase: "wc is used in log rotation scripts (checking file size), data validation, and monitoring pipeline throughput.",
        commonMistakes: "Confusing '-c' (bytes) with '-m' (characters). For UTF-8 they differ for multi-byte characters.",
        debuggingTips: "Run 'wc app.log' without flags to get all three counts (lines, words, characters) at once."
      },
      {
        id: "m0_11",
        levelNum: 0,
        title: "The Archive Master",
        subtitle: "Creating and extracting tarballs",
        category: "Linux",
        xpReward: 180,
        story: "The backup server needs to archive the entire 'logs' directory for offsite storage. Create a compressed tarball of the logs folder.",
        objective: "Create a gzipped tarball named 'logs_backup.tar.gz' from the 'logs' directory using 'tar -czf'.",
        taskDescription: "Use tar with '-czf' flags to compress the logs directory into an archive. Then list the contents.",
        initialVfsState: {
          "/home/user/logs/auth.log": "May 23 10:00:00 sshd[100]: Accepted password for admin",
          "/home/user/logs/app.log": "INFO: Application running"
        },
        validationRules: [{ type: "command_contains", params: { substrings: ["tar", "-czf", "logs_backup.tar.gz"] } }],
        hints: ["'tar -czf archive.tar.gz dir/' creates a gzipped archive.", "'tar -tzf archive.tar.gz' lists contents without extracting."],
        solutionWalkthrough: "Run 'tar -czf logs_backup.tar.gz logs/' to create the archive. Verify with 'tar -tzf logs_backup.tar.gz'.",
        realWorldUseCase: "Backup automation, artifact storage, and package distribution all rely on tar/gzip. Every CI pipeline uses them.",
        commonMistakes: "Forgetting the '-f' flag (which specifies the filename) — tar will send output to stdout if -f is omitted.",
        debuggingTips: "Always use '-v' (verbose) to see what files are being added: 'tar -czvf logs_backup.tar.gz logs/'."
      },
      {
        id: "m0_12",
        levelNum: 0,
        title: "The Find Navigator",
        subtitle: "Locating files by name and type across the filesystem",
        category: "Linux",
        xpReward: 170,
        story: "An incident response is underway. You need to find all '*.conf' files in the system that were modified in the last 7 days. The security team suspects a config tampering attack.",
        objective: "Use the 'find' command to locate all '.conf' files under '/home/user'.",
        taskDescription: "Run 'find /home/user -name \"*.conf\"' to locate all configuration files.",
        initialVfsState: {
          "/home/user/configs/nginx.conf": "server { listen 80; }",
          "/home/user/configs/app.conf": "APP_ENV=production",
          "/home/user/readme.txt": "Configs in configs/ dir"
        },
        validationRules: [{ type: "command_contains", params: { substrings: ["find", "*.conf"] } }],
        hints: ["'find /path -name \"pattern\"' searches for files by name.", "Use '-iname' for case-insensitive search.", "Try: find /home/user -name \"*.conf\""],
        solutionWalkthrough: "Run 'find /home/user -name \"*.conf\"' to locate all .conf files. For case-insensitive: 'find /home/user -iname \"*.CONF\"'.",
        realWorldUseCase: "Incident response, log harvesting, and configuration audits rely on find. It's the primary file discovery tool in Linux.",
        commonMistakes: "Forgetting to quote the pattern — 'find -name *.conf' may be expanded by the shell before find runs.",
        debuggingTips: "Use 'find /home/user -type f' to find only files (not directories)."
      },
      {
        id: "m0_13",
        levelNum: 0,
        title: "The Command Chainer",
        subtitle: "Sequential and conditional command execution",
        category: "Linux",
        xpReward: 130,
        story: "You need to run a deployment sequence: create a backup directory, copy the config file, and verify the copy — but stop if any step fails.",
        objective: "Chain commands using '&&' so that each step runs only if the previous one succeeded: 'mkdir backup && cp app.conf backup/ && ls backup/'.",
        taskDescription: "Run a chain of commands: first create a 'backup' directory, then copy 'configs/app.conf' into it, and list the backup contents.",
        initialVfsState: {
          "/home/user/configs/app.conf": "DATABASE_URL=postgres://localhost:5432/app"
        },
        validationRules: [{ type: "command_contains", params: { substrings: ["mkdir", "backup", "&&"] } }],
        hints: ["'&&' runs the next command ONLY if the previous one succeeded.", "'||' runs the next command ONLY if the previous one failed.", "Try: mkdir backup && cp configs/app.conf backup/ && ls backup/"],
        solutionWalkthrough: "Run 'mkdir backup && cp configs/app.conf backup/ && ls backup/' to chain the deployment sequence.",
        realWorldUseCase: "CI/CD pipelines, deployment scripts, and provisioning tools all chain commands with && to ensure atomicity.",
        commonMistakes: "Using single '&' which backgrounds the process instead of chaining. Using ';' which runs regardless of success.",
        debuggingTips: "Test each command individually first: 'mkdir backup', then 'cp configs/app.conf backup/'. Then chain them."
      },
      {
        id: "m0_14",
        levelNum: 0,
        title: "The Background Runner",
        subtitle: "Running and managing background jobs",
        category: "Linux",
        xpReward: 150,
        story: "You need to run a long data export but can't wait for it to finish — the terminal needs to remain free for other tasks. Run the export in the background.",
        objective: "Start the 'export_data.sh' script in the background using '&', then list background jobs with 'jobs'.",
        taskDescription: "Run './export_data.sh &' to start it in the background. Use 'jobs' to verify it's running. Bring it to foreground with 'fg'.",
        initialVfsState: {
          "/home/user/export_data.sh": "#!/bin/bash\nsleep 30\necho 'Data export complete'"
        },
        validationRules: [{ type: "command_contains", params: { substrings: ["export_data.sh", "&"] } }, { type: "command_contains", params: { substrings: ["jobs"] } }],
        hints: ["Appending '&' runs a command in the background.", "'jobs' lists background tasks for the current session.", "'fg %1' brings job #1 to the foreground."],
        solutionWalkthrough: "Run './export_data.sh &' to start in background. Run 'jobs' to see the job. To bring it back: 'fg %1'.",
        realWorldUseCase: "Long-running tasks like database exports, log processing, and image rendering are always run in the background.",
        commonMistakes: "Forgetting that background jobs are tied to the terminal session and will be killed if the session closes (use nohup for persistence).",
        debuggingTips: "Use 'ps aux | grep export' to find the process even if it detaches from the job list."
      },
      {
        id: "m0_15",
        levelNum: 0,
        title: "The Tee Commander",
        subtitle: "Splitting output to file and terminal simultaneously",
        category: "Linux",
        xpReward: 130,
        story: "Your deployment script produces logs, but you need to see the output in real-time AND save it to a file simultaneously. The 'tee' command can do both.",
        objective: "Run 'echo \"Deploying v2.1\"' and pipe it through 'tee deploy.log' so the output displays on screen AND writes to the file.",
        taskDescription: "Use echo to produce a message, pipe it to 'tee deploy.log', then verify the file contents with cat.",
        initialVfsState: {},
        validationRules: [{ type: "command_contains", params: { substrings: ["tee", "deploy.log"] } }],
        hints: ["'command | tee file' writes output both to stdout and to the file.", "'tee -a file' appends instead of overwriting."],
        solutionWalkthrough: "Run: echo 'Deploying v2.1' | tee deploy.log. Then 'cat deploy.log' to verify the file was written.",
        realWorldUseCase: "tee is used in deployment pipelines and logging systems to capture real-time output for later analysis.",
        commonMistakes: "Forgetting that tee REPLACES the file by default — use '-a' to append if needed.",
        debuggingTips: "Combine with redirection: 'command | tee log.txt | grep ERROR' to save all output but only see errors."
      },
      {
        id: "m0_16",
        levelNum: 0,
        title: "The Xargs Wizard",
        subtitle: "Building and executing commands from stdin",
        category: "Linux",
        xpReward: 200,
        story: "A vulnerability scan flagged all '.tmp' files in the system. You need to delete them all — but there are hundreds. Use xargs to process the find results and delete them in one go.",
        objective: "Use 'find /home/user -name \"*.tmp\" | xargs rm' to find and remove all temporary files.",
        taskDescription: "First create some .tmp files, then use find + xargs to delete them all at once.",
        initialVfsState: {
          "/home/user/cache/temp1.tmp": "garbage1",
          "/home/user/cache/temp2.tmp": "garbage2",
          "/home/user/cache/temp3.tmp": "garbage3"
        },
        validationRules: [{ type: "command_contains", params: { substrings: ["find", "xargs", "rm"] } }],
        hints: ["'find ... | xargs command' runs 'command' on each item from stdin.", "'xargs -r' avoids running if stdin is empty.", "Try: find /home/user -name '*.tmp' | xargs rm -v"],
        solutionWalkthrough: "Run: find /home/user -name '*.tmp' | xargs rm -v to find and delete all .tmp files verbosely.",
        realWorldUseCase: "Batch-deleting files, parallel log processing, and mass permission changes all use xargs for efficiency.",
        commonMistakes: "Spaces in filenames break xargs. Use 'find ... -print0 | xargs -0' for safety.",
        debuggingTips: "Test first with 'find /home/user -name '*.tmp' | xargs echo' to see what would be deleted."
      },
      {
        id: "m0_17",
        levelNum: 0,
        title: "The Cut Specialist",
        subtitle: "Extracting columns from delimited data",
        category: "Linux",
        xpReward: 140,
        story: "The billing department exported a CSV of all cloud costs. They need only the 'Service' and 'Cost' columns (columns 1 and 3). Extract them using the cut command.",
        objective: "Use 'cut -d',' -f1,3 billing.csv' to extract the Service and Cost columns from the CSV.",
        taskDescription: "Run cut with comma delimiter and field specifier on the CSV file.",
        initialVfsState: {
          "/home/user/billing.csv": "Service,Region,Cost\nEC2,us-east-1,450.50\nS3,eu-west-2,120.00\nRDS,ap-southeast-1,675.25\nLambda,us-west-2,82.10"
        },
        validationRules: [{ type: "command_contains", params: { substrings: ["cut", "-d,", "-f1,3", "billing.csv"] } }],
        hints: ["'-d,' sets comma as the delimiter.", "'-f1,3' selects columns 1 and 3.", "Try: cut -d',' -f1,3 billing.csv"],
        solutionWalkthrough: "Run: cut -d',' -f1,3 billing.csv to extract Service and Cost columns.",
        realWorldUseCase: "CSV and log parsing in bash scripts frequently use cut. It's the fastest way to extract columns from structured text.",
        commonMistakes: "Forgetting to quote the delimiter (-d, vs -d','). Bash interprets the comma as part of the string.",
        debuggingTips: "Use 'head -1 billing.csv | cut -d',' -f1-3' to preview the first 3 columns of the header."
      },
      {
        id: "m0_18",
        levelNum: 0,
        title: "The Difference Detector",
        subtitle: "Comparing files with diff",
        category: "Linux",
        xpReward: 130,
        story: "A configuration file was modified during a security incident. You have the original 'nginx.conf.bak' and the current 'nginx.conf'. Compare them to see what changed.",
        objective: "Use 'diff nginx.conf.bak nginx.conf' to identify the differences between the two files.",
        taskDescription: "Run diff on the two configuration files to spot the differences made by the attacker.",
        initialVfsState: {
          "/home/user/nginx.conf.bak": "server {\n    listen 80;\n    server_name example.com;\n    root /var/www/html;\n}",
          "/home/user/nginx.conf": "server {\n    listen 80;\n    server_name example.com;\n    root /var/www/attacker;\n    location /shell {\n        alias /tmp/;\n    }\n}"
        },
        validationRules: [{ type: "command_contains", params: { substrings: ["diff", "nginx.conf.bak", "nginx.conf"] } }],
        hints: ["'diff file1 file2' shows line-by-line differences.", "'<' means lines in file1, '>' means lines in file2."],
        solutionWalkthrough: "Run: diff nginx.conf.bak nginx.conf to see what changed. The '>' lines show what was added to nginx.conf.",
        realWorldUseCase: "Security audits, code reviews, and configuration management all rely on diff to detect unauthorized changes.",
        commonMistakes: "Confusing the order of files (diff expects original first, then modified).",
        debuggingTips: "Use 'diff -u file1 file2' for a unified (more readable) diff format."
      },
      {
        id: "m0_19",
        levelNum: 0,
        title: "The Head and Tail Watcher",
        subtitle: "Viewing the beginning and end of large files",
        category: "Linux",
        xpReward: 120,
        story: "The application log 'app.log' is 2GB and you can't open it in an editor. The issue occurred just now — check the LAST 10 lines. Also check the FIRST 5 lines to see when the service started.",
        objective: "Use 'tail -n 10 app.log' to see the last 10 lines and 'head -n 5 app.log' for the first 5 lines.",
        taskDescription: "Use head and tail with the '-n' flag to view specific portions of the log file.",
        initialVfsState: {
          "/home/user/app.log": "Line 1: Service started\nLine 2: Loading config\nLine 3: Connecting to DB\nLine 4: Connection OK\nLine 5: Handling request 1\nLine 6: Handling request 2\nLine 7: Handling request 3\nLine 8: ERROR: Timeout\nLine 9: ERROR: Connection reset\nLine 10: ERROR: Service crashed"
        },
        validationRules: [{ type: "command_contains", params: { substrings: ["tail", "-n 10", "app.log"] } }],
        hints: ["'tail -n N file' shows the last N lines.", "'head -n N file' shows the first N lines.", "'tail -f file' follows the file as it grows."],
        solutionWalkthrough: "Run 'tail -n 10 app.log' for the last 10 lines. Run 'head -n 5 app.log' for the first 5 lines.",
        realWorldUseCase: "Debugging live issues with tail -f and examining large logs are daily tasks for every engineer.",
        commonMistakes: "Forgetting the '-n' flag (tail defaults to 10 lines, which is often fine). Using 'head' to read binary files.",
        debuggingTips: "Use 'tail -f app.log | grep ERROR' to follow the log in real-time while filtering for errors."
      },
      {
        id: "m0_20",
        levelNum: 0,
        title: "The Link Creator",
        subtitle: "Creating symbolic links for easier access",
        category: "Linux",
        xpReward: 110,
        story: "The team keeps navigating to '/var/log/nginx/access.log' every time they debug. Create a symbolic link 'access.log' in your home directory that points to that deep path.",
        objective: "Use 'ln -s /var/log/nginx/access.log ~/access.log' to create a symlink (simulated with local paths).",
        taskDescription: "Create a symbolic link from the current directory to 'logs/app.log' named 'current.log'.",
        initialVfsState: {
          "/home/user/logs/app.log": "INFO: App is running at version 2.4.1"
        },
        validationRules: [{ type: "command_contains", params: { substrings: ["ln", "-s", "logs/app.log", "current.log"] } }],
        hints: ["'ln -s TARGET LINK_NAME' creates a symbolic link.", "Use 'ls -l' to see the link target.", "Try: ln -s logs/app.log current.log"],
        solutionWalkthrough: "Run: ln -s logs/app.log current.log. Then 'cat current.log' to verify it points to the right file.",
        realWorldUseCase: "Symlinks are used for version management (current -> v2.1), shared libraries, and simplifying deep paths.",
        commonMistakes: "Reversing the arguments (ln -s TARGET LINKNAME, not the other way!).",
        debuggingTips: "Use 'readlink current.log' to see where the symlink points."
      },
      {
        id: "m0_21",
        levelNum: 0,
        title: "The Process Tree Climber",
        subtitle: "Viewing process hierarchies",
        category: "Linux",
        xpReward: 140,
        story: "A child process is defunct (zombie) and its parent is holding resources. View the full process tree to understand the parent-child relationship.",
        objective: "Use 'ps aux --forest' or 'pstree' to view the process hierarchy.",
        taskDescription: "Run 'ps aux --forest' to view the process tree. Identify which processes are children of PID 1.",
        initialVfsState: {},
        validationRules: [{ type: "command_contains", params: { substrings: ["ps", "--forest"] } }],
        hints: ["'ps aux --forest' shows an ASCII process tree.", "'pstree' is more compact but may not be installed."],
        solutionWalkthrough: "Run 'ps aux --forest' to see the process hierarchy with parent-child relationships shown by indentation.",
        realWorldUseCase: "Debugging zombie processes, identifying orphaned tasks, and understanding application architecture all use process trees.",
        commonMistakes: "Using 'ps -ef' which shows a flat list without hierarchy.",
        debuggingTips: "Pipe to 'grep -A5 -B5' to see context around a specific process."
      },
      {
        id: "m0_22",
        levelNum: 0,
        title: "The User Manager",
        subtitle: "Creating and managing system users",
        category: "Linux",
        xpReward: 160,
        story: "A new developer 'alice' joins the team. You need to create a user account for her with a home directory and set her default shell to /bin/bash.",
        objective: "Run the useradd command with appropriate flags to create user 'alice' with a home directory and bash shell.",
        taskDescription: "Use 'useradd -m -s /bin/bash alice' to create the user, then set a password using 'passwd alice'.",
        initialVfsState: {},
        validationRules: [{ type: "command_contains", params: { substrings: ["useradd", "-m", "-s", "/bin/bash"] } }],
        hints: ["'-m' creates a home directory.", "'-s /bin/bash' sets the login shell.", "Try: useradd -m -s /bin/bash alice"],
        solutionWalkthrough: "Run: useradd -m -s /bin/bash alice. Then 'passwd alice' to set a password (or 'chage -d 0 alice' to force change on first login).",
        realWorldUseCase: "Onboarding new employees, creating service accounts for applications, and managing access control are daily responsibilities.",
        commonMistakes: "Forgetting '-m' — the user has no home directory. Not setting a shell, defaulting to /bin/sh.",
        debuggingTips: "Verify with 'grep alice /etc/passwd' and 'ls -la /home/alice'."
      },
      {
        id: "m0_23",
        levelNum: 0,
        title: "The SSH Key Guardian",
        subtitle: "Generating and managing SSH keys",
        category: "Linux",
        xpReward: 190,
        story: "Password-based SSH login is disabled on production for security. You need to generate an SSH key pair for automated deployment access.",
        objective: "Generate a 4096-bit RSA SSH key pair using 'ssh-keygen -t rsa -b 4096' and store it in the default location.",
        taskDescription: "Run the ssh-keygen command to generate a key pair. Use default location and an empty passphrase.",
        initialVfsState: {},
        validationRules: [{ type: "command_contains", params: { substrings: ["ssh-keygen", "-t", "rsa", "-b", "4096"] } }],
        hints: ["'ssh-keygen -t rsa -b 4096' creates a 4096-bit RSA key.", "Default location: ~/.ssh/id_rsa.", "'-f' flag specifies a custom path."],
        solutionWalkthrough: "Run: ssh-keygen -t rsa -b 4096 -f ~/.ssh/deploy_key -N '' to create passwordless key. Then 'cat ~/.ssh/deploy_key.pub' to see the public key.",
        realWorldUseCase: "SSH keys are the standard for automated deployments, Git access, and server-to-server authentication.",
        commonMistakes: "Using a weak bit size (1024). Using an empty passphrase (convenient but less secure).",
        debuggingTips: "Use 'ssh-keygen -l -f ~/.ssh/id_rsa.pub' to check the fingerprint and bit length."
      },
      {
        id: "m0_24",
        levelNum: 0,
        title: "The Cron Scheduler",
        subtitle: "Scheduling recurring tasks with cron",
        category: "Linux",
        xpReward: 180,
        story: "The log cleanup script needs to run every Monday at 3 AM. You need to write the cron expression and add it to the schedule.",
        objective: "Write the cron expression '0 3 * * 1 /home/user/cleanup.sh' into a file called 'cronjob.txt'.",
        taskDescription: "Add the monthly maintenance schedule to 'cronjob.txt' — the script should run at 3:00 AM every Monday.",
        initialVfsState: {
          "/home/user/cleanup.sh": "#!/bin/bash\nrm -rf /tmp/*\necho 'Cleanup complete'",
          "/home/user/cronjob.txt": ""
        },
        validationRules: [{ type: "file_contains", params: { path: "/home/user/cronjob.txt", substring: "0 3 * * 1 /home/user/cleanup.sh" } }],
        hints: ["Cron format: minute hour day-of-month month day-of-week command.", "Monday = 1 in cron.", "Try: 0 3 * * 1 /home/user/cleanup.sh"],
        solutionWalkthrough: "Add '0 3 * * 1 /home/user/cleanup.sh' to cronjob.txt. In production, you'd use 'crontab cronjob.txt' to install it.",
        realWorldUseCase: "Log rotation, database backups, SSL renewal, and health checks are all managed by cron.",
        commonMistakes: "Mixing up minute and hour positions. Using 7 for Sunday instead of 0 (both work, but 0 is conventional).",
        debuggingTips: "Use 'crontab -l' to list current user's cron jobs. Use 'crontab -e' to edit interactively."
      },
      {
        id: "m0_25",
        levelNum: 0,
        title: "The Cleanup Pro",
        subtitle: "Finding and cleaning old files with find -exec",
        category: "Linux",
        xpReward: 220,
        story: "The /tmp directory is 95% full with files older than 10 days. The security policy requires immediate cleanup of aged temporary files. Use the nuclear option: find + exec.",
        objective: "Use 'find /home/user -name \"*.log\" -mtime +7 -exec rm {} \\;' to delete log files older than 7 days.",
        taskDescription: "Find all .log files older than 7 days and delete them using find's -exec flag (simulated with cache files).",
        initialVfsState: {
          "/home/user/cache/old_file.log": "old data here",
          "/home/user/cache/recent.log": "recent data here",
          "/home/user/cache/system.log": "system data here"
        },
        validationRules: [{ type: "command_contains", params: { substrings: ["find", "-exec", "rm", "{}"] } }],
        hints: ["'find /path -name \"pattern\" -exec command {} \\;' runs command on each match.", "The '{}' is a placeholder for the filename.", "'\\;' terminates the -exec command."],
        solutionWalkthrough: "Run: find /home/user -name '*.log' -mtime +7 -exec rm -v {} \\; to find and delete old logs verbosely.",
        realWorldUseCase: "Automated disk cleanup, log rotation enforcement, and data retention policies use find -exec in production scripts.",
        commonMistakes: "Forgetting the '\\;' terminator (with escaped semicolon). Using 'rm -rf' dangerously without checking first.",
        debuggingTips: "Always test with '-exec echo {} \\;' first to see which files would be affected before actually deleting."
      }
    ]
  },
  {
    num: 1,
    name: "Bash Scripting",
    rank: "Script Apprentice",
    description: "Write your first Bash scripts, use conditions, loops, arguments, and exit codes.",
    missions: [
      {
        id: "m1_1",
        levelNum: 1,
        title: "The Shield of Permissions",
        subtitle: "Script creation and executable permissions",
        category: "Linux",
        xpReward: 200,
        story: "You wrote a beautiful automation script called 'backup.sh', but when you try to run it with './backup.sh', the system blocks you with: 'bash: permission denied'. You need to modify the file's permissions to make it runnable.",
        objective: "Make the script 'backup.sh' executable for the owner, then run it.",
        taskDescription: "Change the permission bits of '/home/user/backup.sh' to make it executable. Then run the script to see its success output.",
        initialVfsState: {
          "/home/user/backup.sh": "#!/bin/bash\necho 'SUCCESS: Files backed up securely!'"
        },
        validationRules: [
          {
            type: "command_contains",
            params: { substrings: ["chmod", "+x", "backup.sh"] }
          }
        ],
        hints: [
          "Files created in Linux are not executable by default. Use the 'chmod' (change mode) command to modify permissions.",
          "To make a file executable, use '+x' flag: chmod +x filename",
          "Try: chmod +x backup.sh && ./backup.sh"
        ],
        solutionWalkthrough: "Run 'chmod +x backup.sh' to make the script executable. You can then run it with './backup.sh' to execute the code inside.",
        realWorldUseCase: "For security, Linux blocks downloaded or newly created text files from running as software. Engineers must explicitly declare a script as executable using chmod before scheduling it or adding it to deployment tools.",
        commonMistakes: "Forgetting the '+x' syntax, or trying to run 'chmod backup.sh' without specifying what permission to add.",
        debuggingTips: "Run 'ls -l backup.sh' to inspect the permission string. It should have 'x' characters (e.g., -rwxr-xr-x) indicating executable status."
      },
      {
        id: "m1_2",
        levelNum: 1,
        title: "The Sentinel Guard",
        subtitle: "Writing dynamic loops and condition scripts",
        category: "Linux",
        xpReward: 250,
        story: "We need a script to check if various system servers are alive. You need to write a simple shell script 'monitor.sh' that loops through a list of servers and checks if they are online.",
        objective: "Write a bash script '/home/user/monitor.sh' that checks if an environment variable 'TARGET_HOST' is set, and echoes 'Monitoring [HOST]' if it is.",
        taskDescription: "Create a script 'monitor.sh' that checks if '$TARGET_HOST' is empty. If not empty, print 'Monitoring $TARGET_HOST', else print 'No target host'. Make sure it has a valid shebang #!/bin/bash at the top.",
        initialVfsState: {
          "/home/user/monitor.sh": ""
        },
        validationRules: [
          {
            type: "file_contains",
            params: { path: "/home/user/monitor.sh", substring: "TARGET_HOST" }
          },
          {
            type: "file_contains",
            params: { path: "/home/user/monitor.sh", substring: "#!/bin/bash" }
          }
        ],
        hints: [
          "Open 'monitor.sh' in the editor above. Write a standard shebang: #!/bin/bash",
          "Use a bash condition: if [ -z \"$TARGET_HOST\" ]; then echo 'No target host'; else echo \"Monitoring $TARGET_HOST\"; fi",
          "Save the file in the editor and click 'Submit Script' or run tests."
        ],
        solutionWalkthrough: "Open the file monitor.sh and write:\n#!/bin/bash\nif [ -z \"$TARGET_HOST\" ]; then\n  echo \"No target host\"\nelse\n  echo \"Monitoring $TARGET_HOST\"\nfi\nThen save it.",
        realWorldUseCase: "Environment variables control script behavior dynamically in CI/CD pipelines (GitHub Actions, GitLab CI). Checking if they are present before proceeding avoids fatal run-time exceptions.",
        commonMistakes: "Spacing in bash brackets is critical! Writing [ -z \"$VAR\" ] is correct. Writing [-z \"$VAR\"] will fail with syntactical errors.",
        debuggingTips: "In bash, spaces around '[', ']', and '==' are operators. Ensure they have spaces on both sides."
      },
      {
        id: "m1_3",
        levelNum: 1,
        title: "The Data Warehouse",
        subtitle: "Basic SELECT with incident scenario",
        category: "SQL",
        xpReward: 100,
        story: "CRITICAL: A production database server just crashed and the on-call engineer needs to verify the 'users' table is still intact. You have shell access to the replica. Write a SQL query to verify the users table exists and has the expected columns by selecting a sample of rows.",
        objective: "Write a SQL SELECT query to retrieve all columns and the first 10 rows from the 'users' table.",
        taskDescription: "Execute 'SELECT * FROM users LIMIT 10;' to verify the table structure and data integrity.",
        validationRules: [{ type: "command_contains", params: { substrings: ["SELECT"] } }],
        hints: [
          "Use SELECT * to fetch all columns",
          "LIMIT 10 restricts the result to the first 10 rows",
          "The table name is 'users'"
        ],
        solutionWalkthrough: "Run: SELECT * FROM users LIMIT 10; This returns the first 10 rows of the users table with all columns.",
        realWorldUseCase: "After a database crash recovery, the first step is always verifying table integrity with a SELECT query. DBAs run this across all critical tables before declaring the incident resolved.",
        commonMistakes: "Forgetting the semicolon at the end. Using LIMIT without specifying a number. Selecting from a misspelled table name.",
        debuggingTips: "Run '\\dt' in psql or 'SHOW TABLES;' in MySQL to list available tables first."
      },
      {
        id: "m1_4",
        levelNum: 1,
        title: "The Customer Filter",
        subtitle: "WHERE, AND/OR with incident",
        category: "SQL",
        xpReward: 100,
        story: "MEDIUM: The billing team reports that customers in the 'Platinum' tier from the region 'EU' are being incorrectly charged. You need to find all affected customers using the 'customers' table by filtering for both conditions.",
        objective: "Write a SQL query with WHERE and AND to find customers who are in the 'Platinum' tier AND located in the 'EU' region.",
        taskDescription: "Execute 'SELECT * FROM customers WHERE tier = 'Platinum' AND region = 'EU';' to identify the affected accounts.",
        validationRules: [{ type: "command_contains", params: { substrings: ["SELECT", "WHERE"] } }],
        hints: [
          "Use WHERE to filter rows based on conditions",
          "Use AND to combine multiple conditions that must all be true",
          "String values in SQL are enclosed in single quotes"
        ],
        solutionWalkthrough: "Run: SELECT * FROM customers WHERE tier = 'Platinum' AND region = 'EU'; This returns all Platinum-tier customers in the EU region.",
        realWorldUseCase: "Filtering by multiple criteria is the foundation of customer segmentation, billing audits, and targeted notifications. Every CRM and billing system relies on multi-condition WHERE clauses.",
        commonMistakes: "Using double quotes instead of single quotes for strings. Using = instead of LIKE for pattern matching. Forgetting AND between conditions.",
        debuggingTips: "Start with SELECT * FROM customers LIMIT 5 to see column names, then add WHERE conditions one at a time."
      }
    ]
  },
  {
    num: 2,
    name: "Script Automation",
    rank: "Script Automation",
    description: "Automate your workflow with cron scheduling, backup scripts, log rotation, and system health monitoring.",
    missions: [
      {
        id: "m2_1",
        levelNum: 2,
        title: "The Clockwork Butler",
        subtitle: "Scheduling Cron Jobs for maintenance",
        category: "Linux",
        xpReward: 300,
        story: "Incidents keep piling up because of disk bloat! You want to schedule a script '/home/user/clean_tmp.sh' to run automatically every night at midnight. In Linux, automated scheduling is handled by Cron.",
        objective: "Configure a cron job in the crontab that runs '/home/user/clean_tmp.sh' every day at midnight (00:00).",
        taskDescription: "Add the cron expression '0 0 * * * /home/user/clean_tmp.sh' to a text file called 'my_cron.txt' in your home folder.",
        initialVfsState: {
          "/home/user/clean_tmp.sh": "#!/bin/bash\nrm -rf /tmp/*\necho 'Temp directory cleaned!'",
          "/home/user/my_cron.txt": ""
        },
        validationRules: [
          {
            type: "file_contains",
            params: { path: "/home/user/my_cron.txt", substring: "0 0 * * * /home/user/clean_tmp.sh" }
          }
        ],
        hints: [
          "Cron syntax uses 5 fields: Minute (0-59), Hour (0-23), Day of Month (1-31), Month (1-12), and Day of Week (0-6).",
          "Midnight (00:00) is represented by: 0 0 * * *",
          "Open 'my_cron.txt' and enter the full schedule: '0 0 * * * /home/user/clean_tmp.sh'"
        ],
        solutionWalkthrough: "Add the line `0 0 * * * /home/user/clean_tmp.sh` to `/home/user/my_cron.txt` and save it. In a real system, you would activate this using the command: `crontab my_cron.txt`.",
        realWorldUseCase: "Log rotations, weekly db backups, and SSL cert renewals are all automated with Cron. Knowing standard cron time expressions is vital for running robust systems.",
        commonMistakes: "Putting the parameters in the wrong order, like `* * 0 0 *` or using 6 fields instead of 5.",
        debuggingTips: "Remember: Minute, Hour, Day, Month, Week. Make sure there are single spaces between fields."
      },
      {
        id: "m2_2",
        levelNum: 2,
        title: "The Backup That Never Was",
        subtitle: "Automated backup script with error handling",
        category: "Linux",
        xpReward: 350,
        story: "The nightly backup silently failed for three weeks because the backup script had no error handling. The backup directory was missing and the script continued running, logging 'success' while writing nothing. Now the CFO needs last month's transaction logs and they're gone.",
        objective: "Write a bash script '/home/user/backup.sh' that checks if the target directory exists before copying, exits with code 1 if it doesn't, and logs both success and failure to 'backup.log'.",
        taskDescription: "Create a script that verifies '/home/user/backup' exists, copies all .log files there, logs the outcome with a timestamp, and exits with appropriate codes.",
        initialVfsState: {
          "/home/user/backup.sh": "",
          "/home/user/transactions.log": "2026-05-01 TXN: $12,450.00\n2026-05-02 TXN: $8,230.00\n2026-05-03 TXN: $15,100.00",
          "/home/user/backup.log": ""
        },
        validationRules: [
          { type: "file_contains", params: { path: "/home/user/backup.sh", substring: "#!/bin/bash" } },
          { type: "file_contains", params: { path: "/home/user/backup.sh", substring: "backup" } },
          { type: "file_contains", params: { path: "/home/user/backup.sh", substring: "exit 1" } }
        ],
        hints: [
          "Start with '#!/bin/bash'",
          "Use 'if [ ! -d \"backup\" ]; then' to check if the directory doesn't exist",
          "Use 'mkdir backup' to create it, then 'cp *.log backup/' to copy files",
          "Use 'echo \"$(date) SUCCESS\" >> backup.log' for logging"
        ],
        solutionWalkthrough: "Write:\n#!/bin/bash\nLOG_FILE=\"backup.log\"\necho \"$(date) Starting backup...\" >> $LOG_FILE\nif [ ! -d \"backup\" ]; then\n  echo \"$(date) ERROR: backup directory not found\" >> $LOG_FILE\n  exit 1\nfi\ncp *.log backup/\necho \"$(date) SUCCESS: Logs backed up\" >> $LOG_FILE",
        realWorldUseCase: "Silent backup failures cause permanent data loss. Production backup scripts always have directory existence checks, exit codes, and audit logging.",
        commonMistakes: "Not checking if the source files exist before copying. Using 'cp' without '-r' for directories. Forgetting to quote variables with spaces.",
        debuggingTips: "Run the script manually with 'bash -x backup.sh' to trace every line. Check backup.log for timestamps.",
        activeIncident: {
          title: "HIGH: Backup script silently failing",
          description: "Three weeks of transaction logs not backed up because the target directory was missing and the script had no error handling.",
          severity: "HIGH"
        }
      },
      {
        id: "m2_3",
        levelNum: 2,
        title: "The Growing Pains",
        subtitle: "Automated log rotation to prevent disk full",
        category: "Linux",
        xpReward: 320,
        story: "ALERT: Disk usage on the application server is at 94% and climbing. The app logs grow 500MB per day and nobody is rotating them. You need to write an automated log rotation script that compresses logs older than 2 days and removes archives older than 30 days.",
        objective: "Write a script '/home/user/rotate_logs.sh' that finds .log files older than 2 days, compresses them with gzip, and removes .gz files older than 30 days.",
        taskDescription: "Create a rotation script using find with -mtime, gzip for compression, and -exec rm for cleanup of aged archives.",
        initialVfsState: {
          "/home/user/rotate_logs.sh": "",
          "/home/user/logs/app.log": "INFO: App started\nERROR: timeout\nINFO: healthy",
          "/home/user/logs/access.log": "192.168.1.1 - GET /index 200\n10.0.0.5 - POST /api 500"
        },
        validationRules: [
          { type: "file_contains", params: { path: "/home/user/rotate_logs.sh", substring: "gzip" } },
          { type: "file_contains", params: { path: "/home/user/rotate_logs.sh", substring: "find" } },
          { type: "file_contains", params: { path: "/home/user/rotate_logs.sh", substring: "mtime" } }
        ],
        hints: [
          "Use 'find logs/ -name \"*.log\" -mtime +2 -exec gzip {} \\;' to compress old logs",
          "Use 'find logs/ -name \"*.gz\" -mtime +30 -exec rm {} \\;' to purge old archives",
          "Add '#!/bin/bash' at the top"
        ],
        solutionWalkthrough: "Write:\n#!/bin/bash\nfind logs/ -name \"*.log\" -mtime +2 -exec gzip {} \\;\nfind logs/ -name \"*.gz\" -mtime +30 -exec rm {} \\;\necho \"Log rotation complete at $(date)\"",
        realWorldUseCase: "Log rotation is mandatory in production. Without it, disks fill up in days, causing application crashes and data loss. Tools like logrotate automate this, but custom scripts are used in containers.",
        commonMistakes: "Compressing logs that are still being written to (use lsof to check). Deleting archives too aggressively without retention policy.",
        debuggingTips: "Test with '-exec echo {} \\;' first to see which files would match before actually compressing or deleting.",
        activeIncident: {
          title: "CRITICAL: Disk usage at 94% due to unrotated logs",
          description: "Application server disk is filling up because logs are not being rotated. App logs grow 500MB per day and will cause a full outage within 2 days.",
          severity: "CRITICAL"
        }
      },
      {
        id: "m2_4",
        levelNum: 2,
        title: "The Silent Heartbeat",
        subtitle: "Automated system health check script",
        category: "Linux",
        xpReward: 380,
        story: "CRITICAL: The web server went down for 45 minutes before anyone noticed. The monitoring system was misconfigured and nobody received an alert. You need to build a simple health check script that tests connectivity to critical services and writes a status report with timestamps.",
        objective: "Write a script '/home/user/healthcheck.sh' that pings a target host, checks if a port is listening with ss, and writes a status report to 'health.log'.",
        taskDescription: "Create a health check script that tests connectivity to 'localhost' and checks if port 8080 is listening, then writes a timestamped pass/fail report.",
        initialVfsState: {
          "/home/user/healthcheck.sh": ""
        },
        validationRules: [
          { type: "file_contains", params: { path: "/home/user/healthcheck.sh", substring: "ping" } },
          { type: "file_contains", params: { path: "/home/user/healthcheck.sh", substring: "ss" } },
          { type: "file_contains", params: { path: "/home/user/healthcheck.sh", substring: "health.log" } }
        ],
        hints: [
          "Use 'ping -c 1 localhost > /dev/null 2>&1' to silently test connectivity",
          "Use 'ss -tlnp | grep 8080' to check if port 8080 is listening",
          "Use 'echo \"$(date): STATUS\" >> health.log' to append timestamped results"
        ],
        solutionWalkthrough: "Write:\n#!/bin/bash\nLOG=\"health.log\"\necho \"$(date): Health check started\" >> $LOG\nif ping -c 1 localhost > /dev/null 2>&1; then\n  echo \"$(date): Network OK\" >> $LOG\nelse\n  echo \"$(date): Network FAIL\" >> $LOG\nfi\nif ss -tlnp | grep -q 8080; then\n  echo \"$(date): Port 8080 OK\" >> $LOG\nelse\n  echo \"$(date): Port 8080 FAIL\" >> $LOG\nfi",
        realWorldUseCase: "Custom health checks are essential for services that aren't covered by off-the-shelf monitoring. SRE teams write dozens of these to validate application health, certificate expiry, and database connectivity.",
        commonMistakes: "Not redirecting ping output to /dev/null (clutters logs). Only checking once without retries (transient failures cause false alerts).",
        debuggingTips: "Test each check command manually before adding it to the script. Use 'bash -x healthcheck.sh' to trace execution.",
        activeIncident: {
          title: "CRITICAL: Web server down 45 minutes with no alert",
          description: "The primary web server crashed and monitoring was misconfigured. No alert was generated. Requires automated health checking with timestamped reporting.",
          severity: "CRITICAL"
        }
      },
      {
        id: "m2_5",
        levelNum: 2,
        title: "The Forgotten Lock",
        subtitle: "Stale PID file cleanup automation",
        category: "Linux",
        xpReward: 340,
        story: "MEDIUM: The application won't start after a crash. It claims 'PID file already exists' but the process is dead. A stale /var/run/app.pid is blocking the restart. You need to automate stale PID detection and cleanup.",
        objective: "Write a script '/home/user/cleanup_pid.sh' that checks if a PID file exists, verifies the process is running, and removes the file if the process is dead.",
        taskDescription: "Create a script that checks for 'app.pid', reads the PID, checks /proc/PID, and removes the file if the process doesn't exist.",
        initialVfsState: {
          "/home/user/cleanup_pid.sh": "",
          "/home/user/app.pid": "99999"
        },
        validationRules: [
          { type: "file_contains", params: { path: "/home/user/cleanup_pid.sh", substring: "pid" } },
          { type: "file_contains", params: { path: "/home/user/cleanup_pid.sh", substring: "kill -0" } },
          { type: "file_contains", params: { path: "/home/user/cleanup_pid.sh", substring: "rm" } }
        ],
        hints: [
          "Read the PID from the file: PID=$(cat app.pid)",
          "'kill -0 $PID' checks if a process exists without sending a signal",
          "If kill -0 fails, remove the stale file: rm app.pid"
        ],
        solutionWalkthrough: "Write:\n#!/bin/bash\nPID_FILE=\"app.pid\"\nif [ -f \"$PID_FILE\" ]; then\n  PID=$(cat \"$PID_FILE\")\n  if kill -0 \"$PID\" 2>/dev/null; then\n    echo \"Process $PID is running\"\n  else\n    echo \"Stale PID found. Removing $PID_FILE\"\n    rm \"$PID_FILE\"\n  fi\nfi",
        realWorldUseCase: "Stale PID files are a common cause of deployment failures in legacy systems. Automated cleanup scripts prevent manual intervention during outages.",
        commonMistakes: "Using 'kill -9' instead of 'kill -0' (kill -0 just checks existence, -9 kills the process). Not checking if the file exists before reading it.",
        debuggingTips: "Simulate a stale PID by creating an app.pid with a non-existent PID number. Run the script and verify the file is removed.",
        activeIncident: {
          title: "MEDIUM: Application crash-looping due to stale PID file",
          description: "After an unexpected crash, the application refuses to restart because a stale PID file exists claiming the old process is still running.",
          severity: "MEDIUM"
        }
      },
      {
        id: "m2_6",
        levelNum: 2,
        title: "The Sorting Spiral",
        subtitle: "ORDER BY, LIMIT, DISTINCT with incident",
        category: "SQL",
        xpReward: 100,
        story: "HIGH: The product team needs the top 5 most expensive products in the catalog to investigate a pricing error. Duplicate entries were accidentally inserted during a data migration. You need to find the distinct top 5 products by price.",
        objective: "Write a SQL query that selects distinct products, orders them by price descending, and limits to the top 5.",
        taskDescription: "Execute 'SELECT DISTINCT name, price FROM products ORDER BY price DESC LIMIT 5;' to find the top 5 most expensive distinct products.",
        validationRules: [{ type: "command_contains", params: { substrings: ["ORDER BY", "LIMIT", "DISTINCT"] } }],
        hints: [
          "DISTINCT removes duplicate rows from the result",
          "ORDER BY price DESC sorts from highest to lowest",
          "LIMIT 5 keeps only the first 5 rows"
        ],
        solutionWalkthrough: "Run: SELECT DISTINCT name, price FROM products ORDER BY price DESC LIMIT 5; This returns the 5 highest-priced distinct products.",
        realWorldUseCase: "E-commerce platforms use ORDER BY and LIMIT for leaderboards, pricing audits, and inventory top-sellers reports. DISTINCT prevents skewed results from duplicate data.",
        commonMistakes: "Putting LIMIT before ORDER BY (LIMIT applies after ORDER BY). Forgetting DESC sorts ascending by default. Using DISTINCT on only one column but selecting multiple.",
        debuggingTips: "First run 'SELECT price FROM products ORDER BY price DESC' without LIMIT to see all prices, then add LIMIT 5."
      },
      {
        id: "m2_7",
        levelNum: 2,
        title: "The Missing Products",
        subtitle: "IN, BETWEEN, LIKE with incident",
        category: "SQL",
        xpReward: 100,
        story: "MEDIUM: The inventory reconciliation shows discrepancies in warehouse IDs 101, 203, and 307. Also, products with SKUs starting with 'DIS_' appear to be mislabeled. You need to find all products in these specific warehouses and all discontinued items.",
        objective: "Write a SQL query using IN and LIKE to find products in specific warehouses and discontinued SKU patterns.",
        taskDescription: "Execute 'SELECT * FROM inventory WHERE warehouse_id IN (101, 203, 307) OR sku LIKE 'DIS_%';' to identify affected items.",
        validationRules: [{ type: "command_contains", params: { substrings: ["IN", "LIKE"] } }],
        hints: [
          "IN lets you specify multiple values in a WHERE clause",
          "LIKE '%pattern%' matches patterns with % as wildcard",
          "Use OR to combine the warehouse and SKU conditions"
        ],
        solutionWalkthrough: "Run: SELECT * FROM inventory WHERE warehouse_id IN (101, 203, 307) OR sku LIKE 'DIS_%'; This finds all products in the specified warehouses or with discontinued SKUs.",
        realWorldUseCase: "Inventory reconciliation queries use IN for specific warehouse IDs and LIKE for pattern matching SKU formats. These are daily tools for supply chain engineers.",
        commonMistakes: "Using = instead of LIKE for pattern matching. Forgetting the % wildcard in LIKE patterns. Using commas instead of parentheses in IN.",
        debuggingTips: "Test the LIKE pattern first: 'SELECT DISTINCT sku FROM inventory WHERE sku LIKE 'DIS_%'' to verify the pattern matches."
      }
    ]
  },
  {
    num: 3,
    name: "SysAdmin Engineering",
    rank: "Automation Engineer",
    description: "Manage users, networks, packages, and storage like a professional systems administrator.",
    missions: [
      {
        id: "m3_1",
        levelNum: 3,
        title: "The Rogue User",
        subtitle: "User account audit and deactivation",
        category: "Linux",
        xpReward: 350,
        story: "CRITICAL: A terminated employee's SSH key was used to access the production database at 3 AM. Security needs every inactive user account locked immediately. You must identify users who haven't logged in for 90 days and lock their accounts.",
        objective: "Write a script '/home/user/audit_users.sh' that uses 'lastlog' to find accounts inactive for 90+ days and runs 'usermod -L' to lock them.",
        taskDescription: "Create a script that parses lastlog output, identifies users with 'Never logged in' or dates older than 90 days, and locks those accounts.",
        initialVfsState: {
          "/home/user/audit_users.sh": ""
        },
        validationRules: [
          { type: "file_contains", params: { path: "/home/user/audit_users.sh", substring: "lastlog" } },
          { type: "file_contains", params: { path: "/home/user/audit_users.sh", substring: "usermod" } },
          { type: "file_contains", params: { path: "/home/user/audit_users.sh", substring: "-L" } }
        ],
        hints: [
          "'lastlog -b 90' shows users who haven't logged in for 90+ days",
          "Use 'usermod -L username' to lock a user account",
          "Pipe lastlog output to awk to extract usernames: lastlog -b 90 | awk 'NR>1 {print $1}'"
        ],
        solutionWalkthrough: "Write:\n#!/bin/bash\nlastlog -b 90 | awk 'NR>1 {print $1}' | while read user; do\n  usermod -L \"$user\"\n  echo \"Locked: $user\"\ndone",
        realWorldUseCase: "User account audits are mandatory for SOX, HIPAA, and PCI compliance. Automated lockout of dormant accounts prevents unauthorized access from former employees.",
        commonMistakes: "Locking system accounts (root, daemon, bin) which should never be locked. Not excluding service accounts from the audit.",
        debuggingTips: "Run 'lastlog -b 90' manually first to see which users are flagged. Check '/etc/shadow' to verify accounts are locked.",
        activeIncident: {
          title: "CRITICAL: Unauthorized access via terminated employee account",
          description: "A former employee's SSH key was used to access the production database at 3 AM. All inactive accounts must be locked immediately.",
          severity: "CRITICAL"
        }
      },
      {
        id: "m3_2",
        levelNum: 3,
        title: "The Black Hole Router",
        subtitle: "Network configuration troubleshooting",
        category: "Linux",
        xpReward: 400,
        story: "CRITICAL: The office network is down. Users can't reach the internet or internal servers. The default gateway seems misconfigured. You need to inspect the routing table, check the default gateway, and verify DNS resolution.",
        objective: "Write a script '/home/user/network_diag.sh' that displays the routing table with 'ip route', pings the default gateway, and tests DNS with 'nslookup'.",
        taskDescription: "Create a diagnostic script that captures the current routing table, tests gateway connectivity, and verifies DNS resolution for 'google.com'.",
        initialVfsState: {
          "/home/user/network_diag.sh": ""
        },
        validationRules: [
          { type: "file_contains", params: { path: "/home/user/network_diag.sh", substring: "ip route" } },
          { type: "file_contains", params: { path: "/home/user/network_diag.sh", substring: "ping" } },
          { type: "file_contains", params: { path: "/home/user/network_diag.sh", substring: "nslookup" } }
        ],
        hints: [
          "'ip route' shows the kernel routing table including the default gateway",
          "Extract the default gateway: ip route | grep default | awk '{print $3}'",
          "'nslookup google.com' tests DNS resolution"
        ],
        solutionWalkthrough: "Write:\n#!/bin/bash\necho \"=== Routing Table ===\"\nip route\necho \"\"\necho \"=== Default Gateway Test ===\"\nGW=$(ip route | grep default | awk '{print $3}')\nping -c 2 $GW\necho \"\"\necho \"=== DNS Test ===\"\nnslookup google.com",
        realWorldUseCase: "Network outage triage is the most common sysadmin task. A standardized network diagnostic script saves critical minutes during an active incident.",
        commonMistakes: "Pinging 8.8.8.8 to test connectivity but not checking the gateway first. Forgetting that 'route -n' is deprecated in favor of 'ip route'.",
        debuggingTips: "Run each command individually: 'ip route', 'ip addr', 'ping -c 1 8.8.8.8'. Check '/etc/resolv.conf' for DNS configuration.",
        activeIncident: {
          title: "CRITICAL: Office network outage - no internet access",
          description: "All users are unable to reach the internet or internal servers. Suspected default gateway misconfiguration.",
          severity: "CRITICAL"
        }
      },
      {
        id: "m3_3",
        levelNum: 3,
        title: "The Vulnerability Cascade",
        subtitle: "Package management and system update",
        category: "Linux",
        xpReward: 370,
        story: "HIGH: A critical CVE was published affecting the OpenSSL library used across all production servers. The security team demands an immediate inventory of all installed packages containing 'ssl' and an upgrade of the affected packages.",
        objective: "Write a script '/home/user/audit_packages.sh' that uses 'dpkg -l | grep ssl' to find SSL-related packages and logs them to 'ssl_packages.txt'.",
        taskDescription: "Create a script that lists all installed packages, filters for those containing 'ssl', counts them, and saves the list to a file.",
        initialVfsState: {
          "/home/user/audit_packages.sh": "",
          "/home/user/ssl_packages.txt": ""
        },
        validationRules: [
          { type: "file_contains", params: { path: "/home/user/audit_packages.sh", substring: "dpkg" } },
          { type: "file_contains", params: { path: "/home/user/audit_packages.sh", substring: "ssl" } },
          { type: "file_contains", params: { path: "/home/user/audit_packages.sh", substring: "ssl_packages.txt" } }
        ],
        hints: [
          "'dpkg -l' lists all installed Debian packages",
          "Pipe to 'grep -i ssl' to case-insensitively filter for SSL packages",
          "Use 'wc -l' to count them, redirect filtered list to ssl_packages.txt"
        ],
        solutionWalkthrough: "Write:\n#!/bin/bash\ndpkg -l | grep -i ssl > /home/user/ssl_packages.txt\nCOUNT=$(wc -l < /home/user/ssl_packages.txt)\necho \"Found $COUNT SSL-related packages\"",
        realWorldUseCase: "When zero-day vulnerabilities like Heartbleed or Log4Shell hit, teams must rapidly inventory affected packages across thousands of servers. Automated audit scripts are the difference between a 1-hour and a 24-hour response.",
        commonMistakes: "Only checking package names without checking installed versions. Forgetting that 'dpkg -l' shows installed and removed packages (use 'dpkg -l | grep ^ii' for only installed).",
        debuggingTips: "First run 'dpkg -l | grep ssl' manually to see the output format. Verify the package count is reasonable.",
        activeIncident: {
          title: "HIGH: Critical OpenSSL CVE affecting production servers",
          description: "A zero-day vulnerability in OpenSSL requires immediate inventory of all SSL-related packages across production infrastructure.",
          severity: "HIGH"
        }
      },
      {
        id: "m3_4",
        levelNum: 3,
        title: "The Disk That Vanished",
        subtitle: "Filesystem mounting and disk recovery",
        category: "Linux",
        xpReward: 420,
        story: "CRITICAL: The database server lost its storage volume. The mount point '/data' is empty and the database won't start. The storage team says the volume is attached but not mounted. You need to identify the unmounted filesystem and mount it.",
        objective: "Write a script '/home/user/mount_check.sh' that uses 'lsblk' to list block devices, identifies unmounted filesystems, and writes a mount report to 'mount_report.txt'.",
        taskDescription: "Create a script that lists block devices, checks which ones have filesystems but are not mounted, and generates a recovery report.",
        initialVfsState: {
          "/home/user/mount_check.sh": ""
        },
        validationRules: [
          { type: "file_contains", params: { path: "/home/user/mount_check.sh", substring: "lsblk" } },
          { type: "file_contains", params: { path: "/home/user/mount_check.sh", substring: "mount" } },
          { type: "file_contains", params: { path: "/home/user/mount_check.sh", substring: "fstab" } }
        ],
        hints: [
          "'lsblk -f' shows block devices with filesystem type and mount point",
          "'mount' shows currently mounted filesystems",
          "'cat /etc/fstab' shows persistent mount configuration"
        ],
        solutionWalkthrough: "Write:\n#!/bin/bash\necho \"=== Block Devices ===\" > mount_report.txt\nlsblk -f >> mount_report.txt\necho \"\" >> mount_report.txt\necho \"=== Current Mounts ===\" >> mount_report.txt\nmount >> mount_report.txt\necho \"\" >> mount_report.txt\necho \"=== FSTAB ===\" >> mount_report.txt\ncat /etc/fstab >> mount_report.txt",
        realWorldUseCase: "Cloud ephemeral volumes can detach or fail to mount after reboot. Automated filesystem checks are critical for database and stateful workload recovery.",
        commonMistakes: "Mounting a device without checking if it has a valid filesystem (may contain raw data). Forgetting to update /etc/fstab for persistent mounts.",
        debuggingTips: "Simulate with loopback devices: 'dd if=/dev/zero of=/tmp/disk.img bs=1M count=100 && mkfs.ext4 /tmp/disk.img'.",
        activeIncident: {
          title: "CRITICAL: Database data volume missing - /data mount empty",
          description: "The database server lost its storage volume. The /data mount point is empty and the database won't start. Volume is attached but not mounted.",
          severity: "CRITICAL"
        }
      },
      {
        id: "m3_5",
        levelNum: 3,
        title: "The Audit Trail",
        subtitle: "System logging and audit configuration",
        category: "Linux",
        xpReward: 390,
        story: "MEDIUM: A security auditor is arriving tomorrow and you need to prove that all sudo commands are being logged. The auditd service should be running and the sudo log file must contain the last 10 sudo attempts.",
        objective: "Write a script '/home/user/audit_check.sh' that checks if 'auditd' is active using 'systemctl', tails the last 10 lines of '/var/log/auth.log', and verifies sudo logging is enabled.",
        taskDescription: "Create a script that checks auditd service status, inspects auth.log for sudo entries, and generates a compliance report.",
        initialVfsState: {
          "/home/user/audit_check.sh": ""
        },
        validationRules: [
          { type: "file_contains", params: { path: "/home/user/audit_check.sh", substring: "systemctl" } },
          { type: "file_contains", params: { path: "/home/user/audit_check.sh", substring: "auth.log" } },
          { type: "file_contains", params: { path: "/home/user/audit_check.sh", substring: "sudo" } }
        ],
        hints: [
          "'systemctl is-active auditd' checks if auditd is running",
          "'grep sudo /var/log/auth.log | tail -10' shows recent sudo attempts",
          "'journalctl -u auditd --no-pager | tail -5' shows recent audit logs"
        ],
        solutionWalkthrough: "Write:\n#!/bin/bash\necho \"=== Audit Service Status ===\"\nsystemctl is-active auditd || echo \"auditd is NOT running!\"\necho \"\"\necho \"=== Recent Sudo Attempts ===\"\ngrep sudo /var/log/auth.log | tail -10\necho \"\"\necho \"=== Compliance Verdict ===\"\necho \"Sudo logging: OK (auth.log contains sudo entries)\"",
        realWorldUseCase: "Compliance frameworks (SOC2, PCI-DSS, HIPAA) require audit logging for all privileged access. Automated audit checks are run weekly to ensure logging is operational.",
        commonMistakes: "Assuming auditd is installed (it's not on minimal containers). Checking the wrong log path (some distros use /var/log/secure instead of auth.log).",
        debuggingTips: "Run 'sudo -k' to clear cached credentials, then run a sudo command to generate a test log entry before running the check.",
        activeIncident: {
          title: "MEDIUM: Audit compliance gap - sudo logging not verified",
          description: "Security auditor requires proof that all sudo commands are logged. The auditd service status and auth.log need verification before tomorrow's audit.",
          severity: "MEDIUM"
        }
      },
      {
        id: "m3_6",
        levelNum: 3,
        title: "The Revenue Report",
        subtitle: "GROUP BY, aggregation with incident",
        category: "SQL",
        xpReward: 100,
        story: "CRITICAL: The CFO needs an urgent revenue breakdown by product category for this quarter. A data pipeline failure may have corrupted the aggregation tables. You need to write a query that groups payments by category and calculates total revenue, average transaction value, and transaction count.",
        objective: "Write a SQL query with GROUP BY that uses SUM, AVG, and COUNT aggregation functions on the payments table.",
        taskDescription: "Execute 'SELECT category, SUM(amount) AS total_revenue, AVG(amount) AS avg_transaction, COUNT(*) AS tx_count FROM payments GROUP BY category ORDER BY total_revenue DESC;' to generate the revenue report.",
        validationRules: [{ type: "command_contains", params: { substrings: ["GROUP BY", "SUM", "COUNT"] } }],
        hints: [
          "GROUP BY groups rows that have the same values in specified columns",
          "SUM(column) calculates the total, AVG(column) calculates the average",
          "COUNT(*) counts the number of rows in each group",
          "ORDER BY the aggregated column to rank categories"
        ],
        solutionWalkthrough: "Run: SELECT category, SUM(amount) AS total_revenue, AVG(amount) AS avg_transaction, COUNT(*) AS tx_count FROM payments GROUP BY category ORDER BY total_revenue DESC;",
        realWorldUseCase: "Revenue reporting is the most critical financial query in any organization. GROUP BY aggregations power every dashboard from Stripe to Salesforce to custom ERP systems.",
        commonMistakes: "Forgetting GROUP BY when using aggregate functions. Including non-aggregated columns in SELECT without adding them to GROUP BY. Confusing COUNT(*) with COUNT(column) (COUNT ignores NULLs).",
        debuggingTips: "Run 'SELECT category, amount FROM payments LIMIT 10' first to inspect the raw data, then add GROUP BY."
      },
      {
        id: "m3_7",
        levelNum: 3,
        title: "The High-Value Customers",
        subtitle: "HAVING, aggregate filtering with incident",
        category: "SQL",
        xpReward: 100,
        story: "HIGH: The marketing team wants to run a targeted campaign for customers who have spent more than $10,000 in total. However, they also want to exclude any customer with fewer than 3 transactions (likely test accounts). You need to filter aggregated results.",
        objective: "Write a SQL query using HAVING to filter grouped results by total spending and transaction count.",
        taskDescription: "Execute 'SELECT customer_id, SUM(amount) AS total_spent, COUNT(*) AS tx_count FROM orders GROUP BY customer_id HAVING SUM(amount) > 10000 AND COUNT(*) >= 3 ORDER BY total_spent DESC;' to find high-value customers.",
        validationRules: [{ type: "command_contains", params: { substrings: ["HAVING", "GROUP BY"] } }],
        hints: [
          "HAVING filters groups after aggregation (WHERE filters rows before)",
          "You can reference aggregated columns in HAVING but not aliases in some databases",
          "Use AND to combine multiple HAVING conditions"
        ],
        solutionWalkthrough: "Run: SELECT customer_id, SUM(amount) AS total_spent, COUNT(*) AS tx_count FROM orders GROUP BY customer_id HAVING SUM(amount) > 10000 AND COUNT(*) >= 3 ORDER BY total_spent DESC;",
        realWorldUseCase: "Customer segmentation, fraud detection, and cohort analysis all use HAVING to filter aggregated data. Marketing platforms use this to identify VIP customers and suspicious accounts.",
        commonMistakes: "Using WHERE instead of HAVING for aggregate conditions. Referencing column aliases in HAVING (some databases don't support it). Not including non-aggregated columns in GROUP BY.",
        debuggingTips: "First run the query without HAVING to see all aggregated results, then add HAVING to filter."
      }
    ]
  },
  {
    num: 4,
    name: "PowerShell Automation",
    rank: "PowerShell Pro",
    description: "Master PowerShell scripting for Windows server management and task automation.",
    missions: [
      {
        id: "m4_1",
        levelNum: 4,
        title: "The Cmdlet Awakening",
        subtitle: "PowerShell cmdlet basics and filtering objects",
        category: "PowerShell",
        xpReward: 250,
        story: "You are cross-training on Windows server environments. PowerShell does not output raw text blocks; instead, everything is a typed .NET object! To get active processes on a server, you use the Get-Process cmdlet. You need to write a script to find processes that consume high CPU.",
        objective: "Write a PowerShell script that fetches processes and filters for those with CPU usage greater than 100 seconds.",
        taskDescription: "Create a PowerShell script 'Get-HeavyProcesses.ps1' that uses 'Get-Process' and pipes the objects to 'Where-Object' to find CPU usage ($_.CPU) > 100.",
        initialVfsState: {
          "/home/user/Get-HeavyProcesses.ps1": ""
        },
        validationRules: [
          {
            type: "file_contains",
            params: { path: "/home/user/Get-HeavyProcesses.ps1", substring: "Get-Process" }
          },
          {
            type: "file_contains",
            params: { path: "/home/user/Get-HeavyProcesses.ps1", substring: "Where-Object" }
          }
        ],
        hints: [
          "Use pipelines (|) to chain commands: Get-Process | Where-Object { $_.CPU -gt 100 }",
          "In PowerShell, comparisons use operator flags like -gt (greater than), -lt (less than), -eq (equal). Do not use '>' or '=='!",
          "Write this pipeline inside 'Get-HeavyProcesses.ps1' and save it."
        ],
        solutionWalkthrough: "Open 'Get-HeavyProcesses.ps1' and write:\nGet-Process | Where-Object { $_.CPU -gt 100 }\nThen save the file.",
        realWorldUseCase: "PowerShell is standard across Windows and Azure environments. Unlike Unix shells where you parse text using awk/grep, PowerShell lets you filter properties directly, making automated infrastructure monitoring extremely reliable.",
        commonMistakes: "Using standard operators (>, ==) instead of PowerShell operators (-gt, -eq). This causes compilation crashes.",
        debuggingTips: "Always wrap property filters in curly brackets `{ $_.Property -comparison Value }` with Where-Object."
      },
      {
        id: "m4_2",
        levelNum: 4,
        title: "The Service Sentinel",
        subtitle: "PowerShell service automation and status monitoring",
        category: "PowerShell",
        xpReward: 300,
        story: "ALERT: The critical Windows service 'W3SVC' (IIS Server) is stopped! You need to build a PowerShell script that checks the status of a service and starts it if it's currently stopped.",
        objective: "Write a PowerShell monitoring script 'Check-IISService.ps1' that queries the service 'W3SVC' and starts it if it is stopped.",
        taskDescription: "Create a script with Get-Service and Start-Service statements, containing conditional logic checking if status equals 'Stopped'.",
        initialVfsState: {
          "/home/user/Check-IISService.ps1": ""
        },
        validationRules: [
          {
            type: "file_contains",
            params: { path: "/home/user/Check-IISService.ps1", substring: "Get-Service" }
          },
          {
            type: "file_contains",
            params: { path: "/home/user/Check-IISService.ps1", substring: "Start-Service" }
          }
        ],
        hints: [
          "PowerShell allows checking status using: $service = Get-Service -Name 'W3SVC'",
          "Check status using: if ($service.Status -eq 'Stopped') { Start-Service -Name 'W3SVC' }",
          "Open 'Check-IISService.ps1' and assemble the code!"
        ],
        solutionWalkthrough: "Write the following script into Check-IISService.ps1:\n$service = Get-Service -Name 'W3SVC'\nif ($service.Status -eq 'Stopped') {\n    Start-Service -Name 'W3SVC'\n}",
        realWorldUseCase: "IIS and SQL servers occasionally crash under memory pressure. Running a scheduled task checking service status and starting it automatically ensures immediate self-healing of production environments.",
        commonMistakes: "Incorrect service name syntax or using standard assignment '=' inside the conditional block instead of comparison '-eq'.",
        debuggingTips: "Test variables using local mocks or check cmdlet parameter documentation to confirm correct properties (e.g., .Status)."
      },
      {
        id: "m4_3",
        levelNum: 4,
        title: "The Tempest Cleanup",
        subtitle: "PowerShell disk cleanup automation",
        category: "PowerShell",
        xpReward: 350,
        story: "HIGH: The CI/CD build server has only 2GB of free space remaining on the C: drive. Temp files from failed builds are accumulating at 500MB per day. You need a PowerShell script that removes files older than 24 hours from C:\\BuildTemp and logs the freed space.",
        objective: "Write a PowerShell script 'Invoke-Cleanup.ps1' that uses Get-ChildItem with Where-Object to find files older than 1 day in a temp path, removes them, and reports total freed space.",
        taskDescription: "Create a PowerShell script that scans for old temp files, deletes them, calculates the freed space, and writes a cleanup report.",
        initialVfsState: {
          "/home/user/Invoke-Cleanup.ps1": ""
        },
        validationRules: [
          { type: "file_contains", params: { path: "/home/user/Invoke-Cleanup.ps1", substring: "Get-ChildItem" } },
          { type: "file_contains", params: { path: "/home/user/Invoke-Cleanup.ps1", substring: "Remove-Item" } },
          { type: "file_contains", params: { path: "/home/user/Invoke-Cleanup.ps1", substring: "LastWriteTime" } }
        ],
        hints: [
          "Use '$oldFiles = Get-ChildItem -Path 'C:\\BuildTemp' | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-1) }'",
          "Remove them: $oldFiles | Remove-Item -Force",
          "Sum sizes: $freed = ($oldFiles | Measure-Object -Property Length -Sum).Sum"
        ],
        solutionWalkthrough: "Write:\n$path = 'C:\\BuildTemp'\n$cutoff = (Get-Date).AddDays(-1)\n$oldFiles = Get-ChildItem -Path $path | Where-Object { $_.LastWriteTime -lt $cutoff }\n$freed = ($oldFiles | Measure-Object -Property Length -Sum).Sum\n$oldFiles | Remove-Item -Force\nWrite-Host \"Cleaned $($oldFiles.Count) files, freed $([math]::Round($freed/1MB, 2)) MB\"",
        realWorldUseCase: "Windows CI/CD build agents accumulate temp files rapidly. Automated cleanup scripts prevent disk-full build failures and keep pipelines running without manual intervention.",
        commonMistakes: "Using 'Remove-Item' without -Force (fails on read-only files). Forgetting to filter by LastWriteTime (deletes everything). Not converting bytes to MB for readable output.",
        debuggingTips: "Test the Get-ChildItem filter first: 'Get-ChildItem C:\\BuildTemp | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-1) }' to preview files.",
        activeIncident: {
          title: "HIGH: CI/CD disk space critical - 2GB remaining",
          description: "The build server has only 2GB of free space. Temp files from failed builds are accumulating at 500MB per day and will cause a complete build freeze within 4 days.",
          severity: "HIGH"
        }
      },
      {
        id: "m4_4",
        levelNum: 4,
        title: "The Onboarding Crisis",
        subtitle: "PowerShell user provisioning script",
        category: "PowerShell",
        xpReward: 380,
        story: "HIGH: 20 new contractors start tomorrow and IT hasn't provisioned their accounts. HR sent a CSV with names and departments. You need a PowerShell script that reads 'new_users.csv', creates local user accounts with a default password, and sets the group based on department.",
        objective: "Write a PowerShell script 'New-UserProvision.ps1' that imports a CSV, creates users with New-LocalUser, and adds them to a group.",
        taskDescription: "Create a script that reads new_users.csv, extracts Username and Department columns, creates local users, and adds 'Engineering' users to the 'Developers' group.",
        initialVfsState: {
          "/home/user/New-UserProvision.ps1": "",
          "/home/user/new_users.csv": "Username,Department\njdoe,Engineering\nasmith,Sales\nbjohnson,Engineering"
        },
        validationRules: [
          { type: "file_contains", params: { path: "/home/user/New-UserProvision.ps1", substring: "Import-Csv" } },
          { type: "file_contains", params: { path: "/home/user/New-UserProvision.ps1", substring: "New-LocalUser" } },
          { type: "file_contains", params: { path: "/home/user/New-UserProvision.ps1", substring: "Add-LocalGroupMember" } }
        ],
        hints: [
          "'$users = Import-Csv new_users.csv' imports the CSV",
          "Loop: foreach ($user in $users) { New-LocalUser -Name $user.Username -Password (ConvertTo-SecureString 'TempPass123!' -AsPlainText -Force) }",
          "Add to group: Add-LocalGroupMember -Group 'Developers' -Member $user.Username (only if department is Engineering)"
        ],
        solutionWalkthrough: "Write:\n$users = Import-Csv 'new_users.csv'\n$password = ConvertTo-SecureString 'TempPass123!' -AsPlainText -Force\nforeach ($user in $users) {\n  New-LocalUser -Name $user.Username -Password $password\n  if ($user.Department -eq 'Engineering') {\n    Add-LocalGroupMember -Group 'Developers' -Member $user.Username\n  }\n  Write-Host \"Created $($user.Username)\"\n}",
        realWorldUseCase: "Bulk user provisioning is a weekly HR/IT workflow. Automating it with PowerShell reduces onboarding time from 2 hours to 30 seconds and eliminates manual typos.",
        commonMistakes: "Not converting the password to a SecureString (New-LocalUser requires it). Forgetting to check if the user already exists before creating.",
        debuggingTips: "Test with a single user first: 'New-LocalUser -Name testuser -Password (ConvertTo-SecureString 'Test123!' -AsPlainText -Force)'",
        activeIncident: {
          title: "HIGH: 20 new contractors starting tomorrow - no accounts",
          description: "IT received an HR CSV with 20 new contractors starting tomorrow. No user accounts, home directories, or group memberships have been provisioned.",
          severity: "HIGH"
        }
      },
      {
        id: "m4_5",
        levelNum: 4,
        title: "The Event Log Breach",
        subtitle: "PowerShell event log forensic analysis",
        category: "PowerShell",
        xpReward: 420,
        story: "CRITICAL: The Security team detected suspicious logins on a domain controller. They need a PowerShell script that queries the Security event log for Event ID 4625 (failed logins) from the last 24 hours, grouped by source IP address.",
        objective: "Write a PowerShell script 'Get-FailedLogins.ps1' that uses Get-WinEvent to query the Security log for Event ID 4625 and groups results by IP address.",
        taskDescription: "Create a script that fetches failed login events, filters for the last 24 hours, and outputs a grouped count by IP address.",
        initialVfsState: {
          "/home/user/Get-FailedLogins.ps1": ""
        },
        validationRules: [
          { type: "file_contains", params: { path: "/home/user/Get-FailedLogins.ps1", substring: "Get-WinEvent" } },
          { type: "file_contains", params: { path: "/home/user/Get-FailedLogins.ps1", substring: "4625" } },
          { type: "file_contains", params: { path: "/home/user/Get-FailedLogins.ps1", substring: "Group-Object" } }
        ],
        hints: [
          "'Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625; StartTime=(Get-Date).AddDays(-1)}' queries failed logins",
          "Group by IP: | Group-Object -Property IpAddress",
          "Select count and name: | Select-Object Count, Name"
        ],
        solutionWalkthrough: "Write:\n$failedLogins = Get-WinEvent -FilterHashtable @{\n  LogName='Security'\n  Id=4625\n  StartTime=(Get-Date).AddDays(-1)\n}\n$failedLogins | Group-Object -Property IpAddress | Select-Object Count, Name | Sort-Object Count -Descending",
        realWorldUseCase: "Security incident response requires rapid event log analysis. PowerShell's Get-WinEvent is the standard tool for querying Windows event logs across domain-joined machines.",
        commonMistakes: "Using Get-EventLog instead of Get-WinEvent (Get-EventLog is deprecated and slower). Not filtering by time first (queries the entire event log).",
        debuggingTips: "Test with a simpler filter: 'Get-WinEvent -LogName Security -MaxEvents 50' to see available properties before building the full query.",
        activeIncident: {
          title: "CRITICAL: Suspicious logins detected on domain controller",
          description: "Security team detected anomalous failed login attempts on a domain controller. Need immediate forensic analysis of Event ID 4625 grouped by source IP.",
          severity: "CRITICAL"
        }
      }
    ]
  },
  {
    num: 5,
    name: "Infrastructure Engineering",
    rank: "Infrastructure Wizard",
    description: "Design, configure, and troubleshoot core infrastructure services and networking.",
    missions: [
      {
        id: "m5_1",
        levelNum: 5,
        title: "The Silent Outage",
        subtitle: "System monitoring and alerting setup",
        category: "Linux",
        xpReward: 450,
        story: "CRITICAL: The primary web server crashed at 2 AM and nobody noticed for 3 hours because monitoring was only checking the load balancer IP. You need to implement a server monitoring script that checks CPU load, memory usage, and disk space, and writes alerts to a log file when thresholds are exceeded.",
        objective: "Write a script '/home/user/monitor_system.sh' that checks CPU load (threshold 2.0), memory usage (threshold 90%), and disk usage (threshold 85%), alerting if any exceed limits.",
        taskDescription: "Create a system monitoring script that captures load average, free memory percentage, and disk usage for '/', and writes timestamped alerts to 'system_alerts.log'.",
        initialVfsState: {
          "/home/user/monitor_system.sh": ""
        },
        validationRules: [
          { type: "file_contains", params: { path: "/home/user/monitor_system.sh", substring: "load" } },
          { type: "file_contains", params: { path: "/home/user/monitor_system.sh", substring: "free" } },
          { type: "file_contains", params: { path: "/home/user/monitor_system.sh", substring: "df" } }
        ],
        hints: [
          "'uptime | awk -F'load average:' '{print $2}' | cut -d, -f1' extracts 1-minute load",
          "'free | awk '/Mem/ {printf \"%.0f\", $3/$2 * 100}' calculates memory usage %",
          "'df / | awk 'NR==2 {print $5}' | tr -d '%' gets disk usage %"
        ],
        solutionWalkthrough: "Write:\n#!/bin/bash\nALERT_LOG='system_alerts.log'\nLOAD=$(uptime | awk -F'load average:' '{print $2}' | cut -d, -f1)\nMEM=$(free | awk '/Mem/ {printf \"%.0f\", $3/$2 * 100}')\nDISK=$(df / | awk 'NR==2 {print $5}' | tr -d '%')\nif (( $(echo \"$LOAD > 2.0\" | bc -l) )); then echo \"$(date) HIGH LOAD: $LOAD\" >> $ALERT_LOG; fi\nif [ \"$MEM\" -gt 90 ]; then echo \"$(date) HIGH MEMORY: $MEM%\" >> $ALERT_LOG; fi\nif [ \"$DISK\" -gt 85 ]; then echo \"$(date) HIGH DISK: $DISK%\" >> $ALERT_LOG; fi",
        realWorldUseCase: "Basic system monitoring is the foundation of observability. Every production server should have local health checks that feed into a centralized alerting system like Prometheus or Nagios.",
        commonMistakes: "Using integer comparison for floating point load values. Not installing 'bc' for floating point arithmetic. Only checking one data point (spike vs sustained load).",
        debuggingTips: "Run each metric extraction command separately: 'uptime', 'free -m', 'df -h /' to verify the awk parsing works.",
        activeIncident: {
          title: "CRITICAL: Web server crashed at 2 AM - undetected for 3 hours",
          description: "The primary web server crashed but monitoring only checked the load balancer IP. 3 hours of complete outage went unnoticed. Direct server health checks needed.",
          severity: "CRITICAL"
        }
      },
      {
        id: "m5_2",
        levelNum: 5,
        title: "The Routing Maze",
        subtitle: "Network routing and connectivity troubleshooting",
        category: "Linux",
        xpReward: 480,
        story: "CRITICAL: A misconfigured router caused the entire 10.0.0.0/16 subnet to become unreachable from the 192.168.1.0/24 office network. You need to trace the network path, identify where packets are being dropped, and document the routing issue.",
        objective: "Write a script '/home/user/traceroute_diag.sh' that uses 'traceroute' to map the path to 10.0.0.1, checks packet loss with 'ping -c 10', and displays the routing table.",
        taskDescription: "Create a diagnostic script that traces the route to a target IP, tests packet loss, and captures the IP routing table for analysis.",
        initialVfsState: {
          "/home/user/traceroute_diag.sh": ""
        },
        validationRules: [
          { type: "file_contains", params: { path: "/home/user/traceroute_diag.sh", substring: "traceroute" } },
          { type: "file_contains", params: { path: "/home/user/traceroute_diag.sh", substring: "ping -c" } },
          { type: "file_contains", params: { path: "/home/user/traceroute_diag.sh", substring: "ip route" } }
        ],
        hints: [
          "'traceroute -n 10.0.0.1' shows each hop without DNS resolution",
          "'ping -c 10 10.0.0.1' sends 10 packets and reports loss %",
          "'ip route' shows the kernel routing table"
        ],
        solutionWalkthrough: "Write:\n#!/bin/bash\nTARGET='10.0.0.1'\necho \"=== Route Tracing ===\"\ntraceroute -n $TARGET\necho \"\"\necho \"=== Packet Loss Test ===\"\nping -c 10 $TARGET\necho \"\"\necho \"=== Routing Table ===\"\nip route",
        realWorldUseCase: "Network segmentation issues are a leading cause of microservice communication failures. Traceroute diagnostics are essential for identifying misconfigured firewalls, missing routes, or broken peering.",
        commonMistakes: "Using traceroute without '-n' (tries DNS resolution for each hop, slow). Only checking one direction (packets may go out one path and return another).",
        debuggingTips: "Install traceroute if missing: 'apt install inetutils-traceroute'. Compare results from two different source hosts to narrow down the issue.",
        activeIncident: {
          title: "CRITICAL: Entire 10.0.0.0/16 subnet unreachable",
          description: "A misconfigured router has made the entire 10.0.0.0/16 subnet unreachable from the office network. Services are down and users cannot access internal resources.",
          severity: "CRITICAL"
        }
      },
      {
        id: "m5_3",
        levelNum: 5,
        title: "The Name That Failed",
        subtitle: "DNS resolution failure investigation",
        category: "Linux",
        xpReward: 430,
        story: "CRITICAL: Users report that 'app.internal.company.com' is unreachable. The application server is running but DNS resolution seems broken. You need to diagnose the DNS chain: check local resolution, query the configured nameservers, and verify the authoritative DNS.",
        objective: "Write a script '/home/user/dns_diag.sh' that uses 'dig', 'nslookup', and 'host' commands to trace DNS resolution for a domain, showing all steps.",
        taskDescription: "Create a script that performs full DNS diagnostics: local resolver config check, A record lookup, authoritative nameserver query, and reverse DNS lookup.",
        initialVfsState: {
          "/home/user/dns_diag.sh": ""
        },
        validationRules: [
          { type: "file_contains", params: { path: "/home/user/dns_diag.sh", substring: "dig" } },
          { type: "file_contains", params: { path: "/home/user/dns_diag.sh", substring: "nslookup" } },
          { type: "file_contains", params: { path: "/home/user/dns_diag.sh", substring: "resolv.conf" } }
        ],
        hints: [
          "'cat /etc/resolv.conf' shows configured DNS servers",
          "'dig +short example.com' gets the A record",
          "'nslookup example.com' queries the system resolver"
        ],
        solutionWalkthrough: "Write:\n#!/bin/bash\nDOMAIN='example.com'\necho \"=== DNS Resolvers ===\"\ncat /etc/resolv.conf\necho \"\"\necho \"=== A Record Lookup ===\"\ndig +short $DOMAIN\necho \"\"\necho \"=== System Resolver ===\"\nnslookup $DOMAIN\necho \"\"\necho \"=== Authoritative NS ===\"\ndig NS $DOMAIN +short",
        realWorldUseCase: "DNS failures are among the top 3 causes of application outages. A standardized DNS diagnostic script reduces mean-time-to-resolution from 30 minutes to 2 minutes.",
        commonMistakes: "Only checking with ping (which may use cached results). Not checking both forward and reverse DNS. Forgetting to check if the DNS server itself is reachable.",
        debuggingTips: "Test with 'dig @8.8.8.8 example.com' to bypass the local resolver. Check 'ping -c 1 8.8.8.8' first to ensure basic connectivity.",
        activeIncident: {
          title: "CRITICAL: DNS resolution failure for app.internal.company.com",
          description: "Users cannot reach app.internal.company.com. The application server is running but DNS resolution is broken. Full DNS chain diagnosis required.",
          severity: "CRITICAL"
        }
      },
      {
        id: "m5_4",
        levelNum: 5,
        title: "The Expired Handshake",
        subtitle: "SSL certificate expiry monitoring",
        category: "Linux",
        xpReward: 460,
        story: "MEDIUM: The e-commerce site's SSL certificate expired at midnight and customers are seeing 'NET::ERR_CERT_DATE_INVALID' errors. You need to build a certificate expiry monitoring script that checks expiration dates and warns when a cert is within 30 days of expiry.",
        objective: "Write a script '/home/user/check_cert.sh' that uses 'openssl s_client' to fetch a certificate from a remote server and extracts the expiration date.",
        taskDescription: "Create a script that connects to a server on port 443, downloads the SSL certificate, and displays the issuer, subject, and expiration date.",
        initialVfsState: {
          "/home/user/check_cert.sh": ""
        },
        validationRules: [
          { type: "file_contains", params: { path: "/home/user/check_cert.sh", substring: "openssl" } },
          { type: "file_contains", params: { path: "/home/user/check_cert.sh", substring: "s_client" } },
          { type: "file_contains", params: { path: "/home/user/check_cert.sh", substring: "enddate" } }
        ],
        hints: [
          "'openssl s_client -connect example.com:443 -servername example.com </dev/null 2>/dev/null' fetches the cert",
          "Pipe to 'openssl x509 -noout -enddate' to get the expiry date",
          "Use 'date -d' to compare expiry with current date"
        ],
        solutionWalkthrough: "Write:\n#!/bin/bash\nHOST='example.com'\necho \"=== SSL Certificate Check ===\"\necho | openssl s_client -connect $HOST:443 -servername $HOST 2>/dev/null | openssl x509 -noout -issuer -subject -dates\necho \"\"\nEXPIRY=$(echo | openssl s_client -connect $HOST:443 -servername $HOST 2>/dev/null | openssl x509 -noout -enddate | cut -d= -f2)\necho \"Expires: $EXPIRY\"",
        realWorldUseCase: "SSL certificate expiry causes complete website outages and browser security warnings. Automated monitoring is mandatory for any public-facing service; Let's Encrypt and cert-manager automate renewal but monitoring validates it worked.",
        commonMistakes: "Not using '-servername' for SNI (many modern hosts require it). Using 's_client' without timeout (can hang on unresponsive hosts).",
        debuggingTips: "Test with 'openssl s_client -connect google.com:443 -servername google.com < /dev/null' to verify the connection works.",
        activeIncident: {
          title: "MEDIUM: SSL certificate expired - customers seeing security errors",
          description: "The e-commerce site's SSL certificate expired at midnight. Customers are seeing browser security warnings (NET::ERR_CERT_DATE_INVALID) and abandoning purchases.",
          severity: "MEDIUM"
        }
      },
      {
        id: "m5_5",
        levelNum: 5,
        title: "The Load That Broke",
        subtitle: "Load balancer health check configuration",
        category: "Linux",
        xpReward: 500,
        story: "CRITICAL: Half of the application servers were taken out of the load balancer pool because the health check endpoint started returning 503 errors due to a shared cache issue. You need to write a script that performs a comprehensive HTTP health check on all backend servers and reports which ones are healthy.",
        objective: "Write a script '/home/user/healthcheck_http.sh' that uses 'curl' to check HTTP status codes for multiple endpoints and reports pass/fail for each.",
        taskDescription: "Create a script that checks HTTP endpoints defined in an array, validates the response status code is 200, measures response time, and logs failures.",
        initialVfsState: {
          "/home/user/healthcheck_http.sh": ""
        },
        validationRules: [
          { type: "file_contains", params: { path: "/home/user/healthcheck_http.sh", substring: "curl" } },
          { type: "file_contains", params: { path: "/home/user/healthcheck_http.sh", substring: "http_code" } },
          { type: "file_contains", params: { path: "/home/user/healthcheck_http.sh", substring: "200" } }
        ],
        hints: [
          "'curl -o /dev/null -s -w \"%{http_code}\" http://localhost:8080/health' returns just the status code",
          "'curl -o /dev/null -s -w \"%{time_total}\" http://localhost:8080/health' returns response time",
          "Loop through an array of URLs: for url in \"${URLS[@]}\"; do ... done"
        ],
        solutionWalkthrough: "Write:\n#!/bin/bash\nURLS=('http://localhost:8080/health' 'http://localhost:8081/health')\nfor url in \"${URLS[@]}\"; do\n  STATUS=$(curl -o /dev/null -s -w \"%{http_code}\" \"$url\")\n  TIME=$(curl -o /dev/null -s -w \"%{time_total}\" \"$url\")\n  if [ \"$STATUS\" -eq 200 ]; then\n    echo \"OK: $url ($TIME s)\"\n  else\n    echo \"FAIL: $url returned $STATUS ($TIME s)\"\n  fi\ndone",
        realWorldUseCase: "Load balancer health checks determine whether traffic is routed to a server. A misconfigured health check can take down an entire fleet. Regular validation of health check endpoints prevents cascading failures.",
        commonMistakes: "Only checking the status code without verifying the response body contains expected content. Not setting curl timeouts (a hanging server blocks the entire check).",
        debuggingTips: "Test with a single URL first: 'curl -v http://localhost:8080/health' to see the full response. Use '--connect-timeout 5 --max-time 10' to prevent hangs.",
        activeIncident: {
          title: "CRITICAL: Load balancer pool draining - health check failures",
          description: "Half the application servers are being removed from the load balancer pool because the health check endpoint returns 503 errors due to a shared cache issue.",
          severity: "CRITICAL"
        }
      },
      {
        id: "m5_6",
        levelNum: 5,
        title: "The Broken Pipeline",
        subtitle: "INNER JOIN, LEFT JOIN with incident",
        category: "SQL",
        xpReward: 100,
        story: "CRITICAL: The order processing pipeline is failing because a foreign key constraint is being violated. Orders reference products that don't exist in the products table. You need to join the orders and products tables to find orphaned orders and identify which product IDs are missing.",
        objective: "Write SQL queries using INNER JOIN and LEFT JOIN to find orders with valid products and orders with missing products.",
        taskDescription: "Execute 'SELECT o.* FROM orders o LEFT JOIN products p ON o.product_id = p.id WHERE p.id IS NULL;' to find orders referencing non-existent products.",
        validationRules: [{ type: "command_contains", params: { substrings: ["JOIN", "LEFT JOIN"] } }],
        hints: [
          "LEFT JOIN keeps all rows from the left table even if there's no match",
          "WHERE p.id IS NULL finds rows with no match in the right table",
          "INNER JOIN only returns rows that match in both tables"
        ],
        solutionWalkthrough: "Run: SELECT o.id, o.product_id, o.quantity FROM orders o LEFT JOIN products p ON o.product_id = p.id WHERE p.id IS NULL; This finds orphaned orders referencing missing products.",
        realWorldUseCase: "Data integrity checks between related tables are critical after ETL failures, partial imports, or replication lag. JOIN queries are the standard tool for finding referential integrity violations.",
        commonMistakes: "Confusing LEFT JOIN with RIGHT JOIN. Forgetting the ON clause. Using WHERE conditions that turn a LEFT JOIN into an INNER JOIN (filtering on the right table's columns).",
        debuggingTips: "First run 'SELECT DISTINCT product_id FROM orders' to see all product IDs in orders, then compare with 'SELECT id FROM products'."
      },
      {
        id: "m5_7",
        levelNum: 5,
        title: "The Orphan Records",
        subtitle: "JOIN + NULL detection with incident",
        category: "SQL",
        xpReward: 100,
        story: "HIGH: A system migration left thousands of 'orphan' records in the user_sessions table — sessions that don't have a corresponding user in the users table. These orphan records are bloating the database and causing slow queries. You need to identify and count them.",
        objective: "Write SQL queries using JOIN techniques with NULL detection to find, count, and analyze orphaned session records.",
        taskDescription: "Execute 'SELECT s.id, s.session_token, s.created_at FROM user_sessions s LEFT JOIN users u ON s.user_id = u.id WHERE u.id IS NULL;' to find sessions without valid users.",
        validationRules: [{ type: "command_contains", params: { substrings: ["JOIN", "NULL"] } }],
        hints: [
          "Use LEFT JOIN to keep all sessions, then filter where the user doesn't exist",
          "NULL comparison uses IS NULL, not = NULL",
          "COUNT(*) with the same join pattern gives you the total orphan count"
        ],
        solutionWalkthrough: "Run: SELECT COUNT(*) AS orphan_count FROM user_sessions s LEFT JOIN users u ON s.user_id = u.id WHERE u.id IS NULL; To see details: SELECT s.* FROM user_sessions s LEFT JOIN users u ON s.user_id = u.id WHERE u.id IS NULL;",
        realWorldUseCase: "Orphaned records are a common byproduct of cascading deletes, partial migrations, and application bugs. Regular orphan detection queries are essential for database health and performance.",
        commonMistakes: "Using WHERE u.id = NULL instead of WHERE u.id IS NULL. Forgetting that NULL != NULL in SQL. Using INNER JOIN which would exclude the orphans entirely.",
        debuggingTips: "Run 'SELECT COUNT(*) FROM user_sessions' for total sessions and 'SELECT COUNT(DISTINCT user_id) FROM user_sessions' to see how many have user IDs."
      }
    ]
  },
  {
    num: 6,
    name: "Shell Architecture",
    rank: "Shell Architect",
    description: "Build robust shell architectures with security monitoring, error handling, and process supervision.",
    missions: [
      {
        id: "m7_1",
        levelNum: 6,
        title: "The Integrity Warden",
        subtitle: "Building a File Integrity Monitor",
        category: "Security",
        xpReward: 450,
        story: "An attacker is sneaking backdoors into critical system bin directories! You need to write a simple File Integrity Monitor (FIM) in bash that computes the SHA256 hashes of system binaries, stores them in a baseline file, and warns if any hashes change.",
        objective: "Write a bash script '/home/user/fim.sh' that scans a specific directory and creates/compares a SHA256 checksum file.",
        taskDescription: "Write a script that computes sha256sum of /etc/passwd and checks against a reference value to secure configurations.",
        initialVfsState: {
          "/home/user/fim.sh": ""
        },
        validationRules: [
          {
            type: "file_contains",
            params: { path: "/home/user/fim.sh", substring: "sha256sum" }
          }
        ],
        hints: [
          "Use standard 'sha256sum /etc/passwd > /home/user/passwd.sha256' to create a hash baseline.",
          "Then use 'sha256sum -c /home/user/passwd.sha256' to verify integrity.",
          "Assemble these commands inside '/home/user/fim.sh'."
        ],
        solutionWalkthrough: "Write the following script to /home/user/fim.sh:\n#!/bin/bash\nsha256sum /etc/passwd > /home/user/passwd.sha256\nsha256sum -c /home/user/passwd.sha256\nThis will write a hash base and test it against current system state.",
        realWorldUseCase: "Advanced hacker squads modify standard files like sshd or login configurations to keep remote root access. Advanced FIM frameworks like OSSEC or Tripwire automate this checksum tracking across thousands of production nodes.",
        commonMistakes: "Storing baseline files on the same host with write permissions. Attackers can easily edit baseline hashes to match modified binary hashes!",
        debuggingTips: "Always write absolute paths for files when executing system scripts inside automated secure cron routines."
      },
      {
        id: "m6_2",
        levelNum: 6,
        title: "The Trap That Saved Christmas",
        subtitle: "Shell script error handling and signal trapping",
        category: "Linux",
        xpReward: 480,
        story: "CRITICAL: A deployment script ran halfway, then crashed due to a network timeout, leaving the application in a broken state with temp files scattered everywhere. The deployment was unrecoverable and had to be manually rebuilt. You need to write a robust script with proper error handling, cleanup traps, and atomic operations.",
        objective: "Write a bash script '/home/user/deploy.sh' that uses 'set -e' for fail-fast, creates a temp directory, uses 'trap' to clean up on exit, and validates each step.",
        taskDescription: "Create a deployment script that sets error handling options, creates a working directory, performs staged operations, and uses a trap to clean up temp files on failure.",
        initialVfsState: {
          "/home/user/deploy.sh": ""
        },
        validationRules: [
          { type: "file_contains", params: { path: "/home/user/deploy.sh", substring: "set -e" } },
          { type: "file_contains", params: { path: "/home/user/deploy.sh", substring: "trap" } },
          { type: "file_contains", params: { path: "/home/user/deploy.sh", substring: "mktemp" } }
        ],
        hints: [
          "'set -euo pipefail' at the top makes the script exit on any error",
          "'trap 'rm -rf \"$TMPDIR\"' EXIT' ensures cleanup on exit",
          "'TMPDIR=$(mktemp -d)' creates a safe temp directory"
        ],
        solutionWalkthrough: "Write:\n#!/bin/bash\nset -euo pipefail\nTMPDIR=$(mktemp -d)\ntrap 'rm -rf \"$TMPDIR\"; echo \"Cleaned up temp directory\"' EXIT\necho \"Deploying to $TMPDIR...\"\ncp app.conf \"$TMPDIR/\"\necho \"Config copied\"\ncp app.jar \"$TMPDIR/\"\necho \"Binary copied\"\necho \"Deployment complete\"",
        realWorldUseCase: "Production deployment scripts must be transactional — they either complete fully or roll back cleanly. Trap-based cleanup prevents the 'half-deployed' state that causes the most production incidents.",
        commonMistakes: "Not using 'set -e' (script continues after failures). Forgetting 'set -u' (undefined variables silently become empty strings). Not cleaning up on all exit paths (SIGTERM, SIGINT).",
        debuggingTips: "Test the trap by sending SIGINT during deployment. Verify temp files are removed. Use 'trap -p' to list active traps.",
        activeIncident: {
          title: "CRITICAL: Half-deployed application after network timeout",
          description: "A deployment script crashed mid-way due to a network timeout, leaving the application in an unrecoverable broken state with temp files scattered everywhere.",
          severity: "CRITICAL"
        }
      },
      {
        id: "m6_3",
        levelNum: 6,
        title: "The Zombie Orphanage",
        subtitle: "Process supervision and daemon management",
        category: "Linux",
        xpReward: 460,
        story: "HIGH: A background data processing job spawned child processes that became zombies after the parent crashed. These zombie processes are consuming PID table entries and causing the system to run out of PIDs. You need to write a process supervisor script that monitors child processes, reaps zombies, and restarts failed workers.",
        objective: "Write a script '/home/user/supervisor.sh' that monitors a list of PIDs, checks if they are zombies (defunct), restarts crashed processes, and logs all actions.",
        taskDescription: "Create a process supervisor that checks /proc for zombie status, kills defunct children, and provides a health report.",
        initialVfsState: {
          "/home/user/supervisor.sh": ""
        },
        validationRules: [
          { type: "file_contains", params: { path: "/home/user/supervisor.sh", substring: "zombie" } },
          { type: "file_contains", params: { path: "/home/user/supervisor.sh", substring: "defunct" } },
          { type: "file_contains", params: { path: "/home/user/supervisor.sh", substring: "/proc" } }
        ],
        hints: [
          "'ps aux | grep defunct' shows zombie processes",
          "'awk '{print $1}' /proc/*/status 2>/dev/null' can check process states",
          "Kill the parent of a zombie to reap it: 'kill -9 $PARENT_PID'",
          "Use 'wait' in bash to reap child processes"
        ],
        solutionWalkthrough: "Write:\n#!/bin/bash\nLOG='supervisor.log'\necho \"$(date): Supervisor started\" >> $LOG\nZOMBIES=$(ps aux | grep -w defunct | grep -v grep)\nif [ -n \"$ZOMBIES\" ]; then\n  echo \"$(date): Found zombie processes\" >> $LOG\n  ps aux | grep -w defunct | grep -v grep >> $LOG\n  PARENT=$(ps aux | grep -w defunct | grep -v grep | awk '{print $2}')\n  kill -9 $PARENT 2>/dev/null\n  echo \"$(date): Zombie parent killed\" >> $LOG\nfi",
        realWorldUseCase: "Process supervision is critical for background workers, message queue consumers, and data processing pipelines. Zombie accumulation can exhaust system PID limits and crash servers.",
        commonMistakes: "Trying to kill zombie processes directly (only their parent can reap them). Not handling the case where the parent is init (PID 1).",
        debuggingTips: "Check '/proc/sys/kernel/pid_max' for the system PID limit. Use 'ps -eo pid,stat,comm | grep Z' to find all zombies.",
        activeIncident: {
          title: "HIGH: PID table exhaustion from zombie processes",
          description: "A crashed parent process left hundreds of zombie children consuming PID table entries. The system is approaching the PID limit and may become unresponsive.",
          severity: "HIGH"
        }
      },
      {
        id: "m6_4",
        levelNum: 6,
        title: "The Resilient Pipeline",
        subtitle: "Advanced signal handling and process resilience",
        category: "Linux",
        xpReward: 500,
        story: "MEDIUM: A critical data export job keeps getting killed by OOM (Out of Memory) killer, leaving incomplete exports. The data team loses 6 hours of work each time. You need to build a resilient script that catches termination signals, performs graceful shutdown, and supports resumption.",
        objective: "Write a script '/home/user/resilient_export.sh' that traps SIGTERM and SIGINT, writes a checkpoint file on interruption, and uses a lock file to prevent concurrent execution.",
        taskDescription: "Create a resilient script with trap handlers for graceful shutdown, lock file mechanism, and checkpoint-based resumption logic.",
        initialVfsState: {
          "/home/user/resilient_export.sh": ""
        },
        validationRules: [
          { type: "file_contains", params: { path: "/home/user/resilient_export.sh", substring: "SIGTERM" } },
          { type: "file_contains", params: { path: "/home/user/resilient_export.sh", substring: "lock" } },
          { type: "file_contains", params: { path: "/home/user/resilient_export.sh", substring: "checkpoint" } }
        ],
        hints: [
          "Use 'trap 'cleanup' SIGTERM SIGINT' to catch termination signals",
          "Use 'mkdir lock_dir || exit 1' as a simple lock mechanism",
          "Write a checkpoint file with progress: 'echo \"$COUNT\" > checkpoint.txt'",
          "On restart, read the checkpoint: 'START=$(cat checkpoint.txt 2>/dev/null || echo 0)'"
        ],
        solutionWalkthrough: "Write:\n#!/bin/bash\nLOCKDIR='/tmp/export.lock'\nCHECKPOINT='checkpoint.txt'\ncleanup() {\n  echo \"$(date): Interrupted, saving checkpoint...\"\n  echo \"$COUNT\" > $CHECKPOINT\n  rmdir $LOCKDIR 2>/dev/null\n  exit 1\n}\ntrap cleanup SIGTERM SIGINT\nmkdir $LOCKDIR 2>/dev/null || { echo \"Already running\"; exit 1; }\nSTART=$(cat $CHECKPOINT 2>/dev/null || echo 0)\nfor ((COUNT=$START; COUNT<100; COUNT++)); do\n  echo \"Processing item $COUNT\"\n  sleep 1\ndone\necho \"$COUNT\" > $CHECKPOINT\nrmdir $LOCKDIR\necho \"Export complete\"",
        realWorldUseCase: "Long-running ETL jobs, database migrations, and large file transfers must be resilient to interruptions. Checkpoint-based resumption and lock files prevent data corruption and duplicate processing.",
        commonMistakes: "Not removing the lock file in the trap handler (leaves stale locks). Using 'exit 1' in trap without proper cleanup of temp resources.",
        debuggingTips: "Simulate interruption with 'kill -TERM $PID'. Verify the checkpoint file contains the last processed count. Test lock by running two instances simultaneously.",
        activeIncident: {
          title: "MEDIUM: Data export job killed by OOM - 6 hours lost",
          description: "A critical data export job keeps getting killed by the OOM killer, losing hours of processing. The export needs graceful shutdown and checkpoint-based resumption.",
          severity: "MEDIUM"
        }
      },
      {
        id: "m6_5",
        levelNum: 6,
        title: "The Query Within",
        subtitle: "Subqueries with incident",
        category: "SQL",
        xpReward: 100,
        story: "CRITICAL: The security team needs to find all users who made purchases AFTER their account was flagged for suspicious activity. This requires a subquery: find users whose last purchase timestamp is greater than their account flag timestamp.",
        objective: "Write a SQL query with a subquery in the WHERE clause to find users matching a condition based on aggregated data.",
        taskDescription: "Execute 'SELECT * FROM users WHERE id IN (SELECT user_id FROM orders WHERE amount > (SELECT AVG(amount) * 2 FROM orders));' to find users with abnormally large orders.",
        validationRules: [{ type: "command_contains", params: { substrings: ["SELECT", "IN", "SELECT"] } }],
        hints: [
          "A subquery is a SELECT statement nested inside another query",
          "Use IN with a subquery to filter based on a list of values",
          "Subqueries can return single values (scalar) or lists"
        ],
        solutionWalkthrough: "Run: SELECT id, email, name FROM users WHERE id IN (SELECT user_id FROM orders WHERE amount > (SELECT AVG(amount) * 3 FROM orders)); This finds users with orders over 3x the average.",
        realWorldUseCase: "Subqueries are essential for multi-step analysis: finding outliers, comparing against averages, and identifying anomalies. Fraud detection systems rely heavily on correlated and nested subqueries.",
        commonMistakes: "Returning multiple columns from a subquery used with IN. Poor performance with large datasets (consider JOIN or CTE alternatives). Forgetting that subqueries in WHERE execute per row.",
        debuggingTips: "Run the inner subquery separately first: 'SELECT AVG(amount) * 2 FROM orders' to verify the threshold value."
      },
      {
        id: "m6_6",
        levelNum: 6,
        title: "The CTE Blueprint",
        subtitle: "CTEs, WITH with incident",
        category: "SQL",
        xpReward: 100,
        story: "MEDIUM: The analytics team needs a complex report showing monthly revenue growth. They need a query that's readable and maintainable, not a tangled mess of nested subqueries. You need to use Common Table Expressions (CTEs) with the WITH clause to build a clean, modular query.",
        objective: "Write a SQL query using WITH (CTE) to define temporary result sets and build a multi-step analysis pipeline.",
        taskDescription: "Execute a CTE-based query: 'WITH monthly_totals AS (SELECT DATE_TRUNC('month', created_at) AS month, COUNT(*) AS orders, SUM(amount) AS revenue FROM orders GROUP BY DATE_TRUNC('month', created_at)) SELECT month, orders, revenue FROM monthly_totals ORDER BY month;'",
        validationRules: [{ type: "command_contains", params: { substrings: ["WITH", "AS"] } }],
        hints: [
          "WITH defines a named CTE that acts like a temporary view",
          "You can define multiple CTEs separated by commas",
          "CTEs make complex queries readable and reusable"
        ],
        solutionWalkthrough: "Run: WITH monthly_totals AS (SELECT DATE_TRUNC('month', created_at) AS month, COUNT(*) AS orders, SUM(amount) AS revenue FROM orders GROUP BY DATE_TRUNC('month', created_at)) SELECT month, orders, revenue FROM monthly_totals ORDER BY month;",
        realWorldUseCase: "CTEs are the standard way to write production-grade analytical queries. They're used in every BI tool, Looker dashboard, and data warehouse pipeline for readability and performance.",
        commonMistakes: "Forgetting the comma between multiple CTEs. Not referencing the CTE in the main query (unused CTE). Using CTEs when simple subqueries would be more performant.",
        debuggingTips: "Build the CTE incrementally: define one CTE and SELECT from it to verify, then add the next. Each CTE can be tested independently."
      }
    ]
  },
  {
    num: 7,
    name: "KQL & Data Analysis",
    rank: "Query Artisan",
    description: "Master Kusto Query Language — filter, aggregate, join, and explore data the way Azure Data Explorer, Log Analytics, and Microsoft Sentinel expect you to.",
    missions: [
      {
        id: "m8_1",
        levelNum: 7,
        title: "The Data Explorer",
        subtitle: "Basic table exploration with take, count, distinct",
        category: "KQL",
        xpReward: 200,
        story: "You're a SOC analyst investigating a spike in Azure sign-in failures. The senior engineer says: 'Start simple — pull 10 rows from the SigninLogs table and see what columns we have. Count the total rows too.'",
        objective: "Write a KQL query in '/home/user/explore.kql' that uses 'take' to sample rows and returns the count of rows from the SigninLogs table.",
        taskDescription: "Create a .kql file with a query using 'take' and 'count' to explore table structure.",
        initialVfsState: {
          "/home/user/explore.kql": "",
          "/home/user/SigninLogs.csv": "Timestamp,User,IPAddress,Result,AppName\n2026-05-01 08:15:00,alice@corp.com,10.0.0.1,Success,Outlook\n2026-05-01 08:16:30,bob@corp.com,10.0.0.2,Failure,SharePoint\n2026-05-01 08:17:45,alice@corp.com,10.0.0.1,Success,Teams\n2026-05-01 09:00:00,charlie@corp.com,192.168.1.50,Failure,AzurePortal\n2026-05-01 09:15:12,bob@corp.com,10.0.0.2,Success,Outlook\n2026-05-01 09:30:00,dave@corp.com,10.0.0.3,Failure,SharePoint\n2026-05-01 10:00:00,alice@corp.com,10.0.0.1,Success,OneDrive\n2026-05-01 10:15:00,eve@corp.com,10.0.0.4,Success,Teams\n2026-05-01 10:30:00,charlie@corp.com,192.168.1.50,Failure,SharePoint\n2026-05-01 11:00:00,bob@corp.com,10.0.0.2,Success,Outlook"
        },
        validationRules: [
          { type: "file_contains", params: { path: "/home/user/explore.kql", substring: "take" } },
          { type: "file_contains", params: { path: "/home/user/explore.kql", substring: "count" } }
        ],
        hints: [
          "Start with the table name: SigninLogs",
          "Use 'take 10' to sample rows and see the schema",
          "Use '| count' to return the total number of rows",
          "Separate operators with pipe |: SigninLogs | take 10 | count (or use two queries with ;)"
        ],
        solutionWalkthrough: "Write to /home/user/explore.kql:\nSigninLogs | take 10\nSigninLogs | count\n(or combine as one line with semicolons: SigninLogs | take 10; SigninLogs | count)",
        realWorldUseCase: "When investigating a security incident, always start with 'take 10' to understand the table schema before writing complex filters. It saves hours of guesswork.",
        commonMistakes: "Forgetting the pipe | operator between commands. Using 'select' (SQL syntax) instead of 'project'.",
        debuggingTips: "If you get no results, check that the table name is spelled correctly. KQL is case-sensitive for table names."
      },
      {
        id: "m8_2",
        levelNum: 7,
        title: "The Filter Chronicler",
        subtitle: "Power filtering with where clauses",
        category: "KQL",
        xpReward: 250,
        story: "The SOC lead needs all failed sign-in attempts from the last 24 hours. 'Give me every row where Result == Failure, filtered to just today's date. We're tracking a brute-force campaign.'",
        objective: "Write a KQL query in '/home/user/failures.kql' that uses 'where' with a time filter and a string equality filter.",
        taskDescription: "Create a .kql file filtering SigninLogs for failures with time-based conditions.",
        initialVfsState: {
          "/home/user/failures.kql": "",
          "/home/user/SigninLogs.csv": "Timestamp,User,IPAddress,Result,AppName\n2026-05-01 08:15:00,alice@corp.com,10.0.0.1,Success,Outlook\n2026-05-01 08:16:30,bob@corp.com,10.0.0.2,Failure,SharePoint\n2026-05-01 08:17:45,alice@corp.com,10.0.0.1,Success,Teams\n2026-05-01 09:00:00,charlie@corp.com,192.168.1.50,Failure,AzurePortal\n2026-05-01 09:15:12,bob@corp.com,10.0.0.2,Success,Outlook\n2026-05-01 09:30:00,dave@corp.com,10.0.0.3,Failure,SharePoint\n2026-05-02 10:00:00,charlie@corp.com,192.168.1.50,Failure,AzurePortal\n2026-05-02 10:15:00,charlie@corp.com,192.168.1.50,Failure,SharePoint\n2026-05-02 10:30:00,charlie@corp.com,192.168.1.50,Failure,Outlook\n2026-05-02 11:00:00,charlie@corp.com,192.168.1.50,Failure,AzurePortal"
        },
        validationRules: [
          { type: "file_contains", params: { path: "/home/user/failures.kql", substring: "where" } },
          { type: "file_contains", params: { path: "/home/user/failures.kql", substring: "== 'Failure'" } },
          { type: "file_contains", params: { path: "/home/user/failures.kql", substring: "ago" } }
        ],
        hints: [
          "Use 'where Result == 'Failure'' to filter for failed sign-ins",
          "Use 'where Timestamp > ago(1d)' to filter to the last 24 hours",
          "Chain conditions with 'and': where Result == 'Failure' and Timestamp > ago(1d)",
          "Use 'project' at the end to show only the relevant columns"
        ],
        solutionWalkthrough: "Write to /home/user/failures.kql:\nSigninLogs\n| where Result == 'Failure'\n| where Timestamp > ago(1d)\n| project Timestamp, User, IPAddress, AppName",
        realWorldUseCase: "Security operations rely on time-range + status filters to isolate brute-force attempts, failed logins, and suspicious activity windows.",
        commonMistakes: "Using single quotes vs double quotes incorrectly. Forgetting 'ago()' requires a time unit like 'ago(1d)' not 'ago(1)'.",
        debuggingTips: "Check your quotes — KQL uses single quotes for string literals. Test with a simple 'take 10' before adding filters."
      },
      {
        id: "m8_3",
        levelNum: 7,
        title: "The Column Architect",
        subtitle: "Shaping data with project and extend",
        category: "KQL",
        xpReward: 250,
        story: "The threat hunting team needs a clean dataset. 'The SigninLogs table has too many columns. I only need Timestamp, User, and Result. Also add a new column called IsExternal that flags IPs not in our 10.x.x.x range.'",
        objective: "Write a KQL query in '/home/user/shaped.kql' that uses 'project' to select specific columns and 'extend' to create a calculated column.",
        taskDescription: "Create a .kql file that projects selected columns and extends a calculated field.",
        initialVfsState: {
          "/home/user/shaped.kql": "",
          "/home/user/SigninLogs.csv": "Timestamp,User,IPAddress,Result,AppName\n2026-05-01 08:15:00,alice@corp.com,10.0.0.1,Success,Outlook\n2026-05-01 08:16:30,bob@corp.com,10.0.0.2,Failure,SharePoint\n2026-05-01 09:00:00,charlie@corp.com,192.168.1.50,Failure,AzurePortal\n2026-05-01 09:15:12,bob@corp.com,10.0.0.2,Success,Outlook\n2026-05-01 09:30:00,dave@corp.com,203.0.113.5,Failure,SharePoint",
          "/home/user/PerfData.csv": "Timestamp,Server,CPU,PctMemory\n2026-05-01 08:00:00,web-01,45,62\n2026-05-01 08:05:00,web-02,78,85\n2026-05-01 08:10:00,db-01,92,45\n2026-05-01 08:15:00,web-01,50,64\n2026-05-01 08:20:00,web-02,82,88"
        },
        validationRules: [
          { type: "file_contains", params: { path: "/home/user/shaped.kql", substring: "project" } },
          { type: "file_contains", params: { path: "/home/user/shaped.kql", substring: "extend" } },
          { type: "file_contains", params: { path: "/home/user/shaped.kql", substring: "iff" } }
        ],
        hints: [
          "Use 'project' to select only the columns you need: project Timestamp, User, Result",
          "Use 'extend' to add a calculated column: extend IsHighCPU = iff(CPU > 80, 'Yes', 'No')",
          "You can rename in project: project Time = Timestamp, UserName = User",
          "Use 'strcat()' to concatenate: extend FullLabel = strcat(User, ' - ', Result)"
        ],
        solutionWalkthrough: "Write to /home/user/shaped.kql:\nSigninLogs\n| project Timestamp, User, IPAddress, Result\n| extend IsExternal = iff(IPAddress !startswith '10.', 'Yes', 'No')",
        realWorldUseCase: "When building dashboards or threat hunting feeds, you rarely need every column. project reduces noise and extend adds computed signals like severity labels or data classifications.",
        commonMistakes: "Using 'project' early and losing columns needed later. Use 'project-away' instead to drop only what you don't need.",
        debuggingTips: "Run 'take 5' first to see all available column names before writing your projection."
      },
      {
        id: "m8_4",
        levelNum: 7,
        title: "The Aggregation Artisan",
        subtitle: "Grouping and summarizing with summarize, count, and bin",
        category: "KQL",
        xpReward: 300,
        story: "C-level wants a security report: 'How many failed logins per user per day for the last week? And what are the top 5 most attacked applications?' Time to aggregate.",
        objective: "Write a KQL query in '/home/user/summary.kql' that uses 'summarize' with 'count()' and 'bin()' to aggregate failures by time bucket.",
        taskDescription: "Create a .kql file that groups and counts failed sign-ins by user and time bucket.",
        initialVfsState: {
          "/home/user/summary.kql": "",
          "/home/user/SigninLogs.csv": "Timestamp,User,IPAddress,Result,AppName\n2026-05-01 08:00:00,alice,10.0.0.1,Success,Outlook\n2026-05-01 08:15:00,bob,10.0.0.2,Failure,Outlook\n2026-05-01 08:30:00,charlie,192.168.1.5,Failure,SharePoint\n2026-05-01 09:00:00,bob,10.0.0.2,Failure,Outlook\n2026-05-01 09:15:00,alice,10.0.0.1,Success,Teams\n2026-05-01 10:00:00,charlie,192.168.1.5,Failure,AzurePortal\n2026-05-01 10:30:00,dave,10.0.0.3,Failure,SharePoint\n2026-05-01 11:00:00,bob,10.0.0.2,Failure,Outlook\n2026-05-02 08:00:00,charlie,192.168.1.5,Failure,SharePoint\n2026-05-02 08:30:00,dave,10.0.0.3,Failure,AzurePortal\n2026-05-02 09:00:00,charlie,192.168.1.5,Failure,SharePoint\n2026-05-02 10:00:00,eve,10.0.0.4,Success,OneDrive"
        },
        validationRules: [
          { type: "file_contains", params: { path: "/home/user/summary.kql", substring: "summarize" } },
          { type: "file_contains", params: { path: "/home/user/summary.kql", substring: "count()" } },
          { type: "file_contains", params: { path: "/home/user/summary.kql", substring: "bin" } }
        ],
        hints: [
          "summarize groups rows: summarize Count = count() by User",
          "Use bin() to bucket time: summarize Count = count() by bin(Timestamp, 1d)",
          "Group by multiple columns: summarize Count = count() by bin(Timestamp, 1d), User",
          "Filter to failures first with where, then summarize"
        ],
        solutionWalkthrough: "Write to /home/user/summary.kql:\nSigninLogs\n| where Result == 'Failure'\n| summarize FailCount = count() by bin(Timestamp, 1d), User\n| order by FailCount desc",
        realWorldUseCase: "Aggregation is the backbone of every SIEM dashboard — counts of events by type, user, IP, or time bucket are how you detect anomalies like brute-force spikes.",
        commonMistakes: "Forgetting to filter before summarizing (aggregating everything instead of just failures). Not using bin() with timestamps (which creates a row per unique millisecond).",
        debuggingTips: "Always filter with 'where' before 'summarize' to reduce the data being aggregated. Check your results with 'take 10' after summarize."
      },
      {
        id: "m8_5",
        levelNum: 7,
        title: "The Join Weaver",
        subtitle: "Combining tables with join operations",
        category: "KQL",
        xpReward: 350,
        story: "HR needs a report: 'Show me all employees and their department names, including the ones not assigned to any department.' The employee list is in Employees, departments are in Departments. Time to join.",
        objective: "Write a KQL query in '/home/user/joined.kql' that uses 'join' with a specific kind (leftouter) to enrich employee data with department names.",
        taskDescription: "Create a .kql file that joins Employees with Departments on DepartmentId.",
        initialVfsState: {
          "/home/user/joined.kql": "",
          "/home/user/Employees.csv": "EmployeeId,Name,DepartmentId,Role\n1,Alice Smith,10,SRE\n2,Bob Jones,20,Security Analyst\n3,Carol Lee,10,DevOps Engineer\n4,Dave Wang,30,Data Scientist\n5,Eve Brown,,Intern",
          "/home/user/Departments.csv": "DepartmentId,DepartmentName,Head\n10,Engineering,Carol Lee\n20,Security,Bob Jones\n40,HR,Frank Miller"
        },
        validationRules: [
          { type: "file_contains", params: { path: "/home/user/joined.kql", substring: "join" } },
          { type: "file_contains", params: { path: "/home/user/joined.kql", substring: "leftouter" } },
          { type: "file_contains", params: { path: "/home/user/joined.kql", substring: "project" } }
        ],
        hints: [
          "Start with one table, pipe into join: Employees | join kind=leftouter Departments on DepartmentId",
          "The key column (DepartmentId) must exist in both tables",
          "Use 'project' after join to select the final columns you want",
          "Try different join kinds: inner (only matches), leftouter (all left rows), fullouter (all rows)"
        ],
        solutionWalkthrough: "Write to /home/user/joined.kql:\nEmployees\n| join kind=leftouter Departments on DepartmentId\n| project Name, DepartmentName, Role",
        realWorldUseCase: "Join operations are essential for enriching raw logs with reference data — mapping user IDs to names, IPs to locations, or event codes to descriptions.",
        commonMistakes: "Using the wrong join kind (inner drops unmatched rows). Joining on mismatched column names or types. Forgetting that the key column appears twice in the output.",
        debuggingTips: "Inspect both tables first with 'take 5' to verify column names. Use 'project-away' to drop duplicate key columns after the join."
      },
      {
        id: "m8_6",
        levelNum: 7,
        title: "The Query Crafter",
        subtitle: "Building maintainable queries with let statements",
        category: "KQL",
        xpReward: 400,
        story: "Your team lead says: 'That security report is great, but it's unreadable. Break the query into clear let statements — define thresholds first, then the filter view, then the aggregation. Make it production-grade.'",
        objective: "Write a KQL query in '/home/user/crafted.kql' that uses 'let' to define variables and sub-queries, composing a clean, readable analysis pipeline.",
        taskDescription: "Create a .kql file using let statements for thresholds, filtered views, and final aggregation.",
        initialVfsState: {
          "/home/user/crafted.kql": "",
          "/home/user/SigninLogs.csv": "Timestamp,User,IPAddress,Result,AppName\n2026-05-01 08:00:00,alice,10.0.0.1,Success,Outlook\n2026-05-01 08:15:00,bob,10.0.0.2,Failure,Outlook\n2026-05-01 08:30:00,charlie,192.168.1.5,Failure,SharePoint\n2026-05-01 09:00:00,bob,10.0.0.2,Failure,Outlook\n2026-05-01 09:15:00,alice,10.0.0.1,Success,Teams\n2026-05-01 10:00:00,charlie,192.168.1.5,Failure,AzurePortal\n2026-05-01 10:30:00,dave,10.0.0.3,Failure,SharePoint\n2026-05-01 11:00:00,bob,10.0.0.2,Failure,Outlook\n2026-05-02 08:00:00,charlie,192.168.1.5,Failure,SharePoint\n2026-05-02 08:30:00,dave,10.0.0.3,Failure,AzurePortal\n2026-05-02 09:00:00,charlie,192.168.1.5,Failure,SharePoint\n2026-05-02 10:00:00,eve,10.0.0.4,Success,OneDrive",
          "/home/user/ThreatIntel.csv": "IPAddress,ThreatScore,Category\n192.168.1.5,85,Botnet\n203.0.113.5,92,C2 Server\n10.0.0.1,10,Internal\n10.0.0.2,10,Internal\n10.0.0.3,10,Internal"
        },
        validationRules: [
          { type: "file_contains", params: { path: "/home/user/crafted.kql", substring: "let" } },
          { type: "file_contains", params: { path: "/home/user/crafted.kql", substring: "summarize" } },
          { type: "file_contains", params: { path: "/home/user/crafted.kql", substring: "join" } }
        ],
        hints: [
          "Use 'let Threshold = 50;' to define a numeric constant",
          "Use 'let FailedLogins = SigninLogs | where Result == 'Failure';' to define a reusable view",
          "Use 'let ThreatLookup = FailedLogins | join kind=inner ThreatIntel on IPAddress;' to chain sub-queries",
          "End with a final query that references your let variables: ThreatLookup | summarize Count = count() by Category"
        ],
        solutionWalkthrough: "Write to /home/user/crafted.kql:\nlet Threshold = 50;\nlet FailedLogins = SigninLogs | where Result == 'Failure';\nlet Enriched = FailedLogins | join kind=inner ThreatIntel on IPAddress;\nEnriched\n| where ThreatScore > Threshold\n| summarize SuspiciousCount = count() by Category, User\n| order by SuspiciousCount desc",
        realWorldUseCase: "Production KQL queries in Sentinel and Azure Workbooks always use 'let' for maintainability — defining thresholds at the top makes quarterly reviews trivial and prevents magic number bugs.",
        commonMistakes: "Forgetting the semicolon after let statements. Trying to reference a let variable before it's defined (order matters). Mixing up = and == in let assignments.",
        debuggingTips: "Debug each let statement in isolation first. Run 'let X = SigninLogs | take 5; X' to verify a view works before chaining it into the next step."
      },
      {
        id: "m8_7",
        levelNum: 7,
        title: "The Ranking Problem",
        subtitle: "Window functions (ROW_NUMBER, RANK) with incident",
        category: "SQL",
        xpReward: 100,
        story: "MEDIUM: The sales team wants to rank sales representatives by their quarterly performance. However, there are ties — two reps have identical totals. ROW_NUMBER would arbitrarily break the tie, but RANK should give them the same rank. You need to implement both to show the difference.",
        objective: "Write SQL queries using ROW_NUMBER() and RANK() window functions to rank sales reps by total sales.",
        taskDescription: "Execute 'SELECT name, total_sales, ROW_NUMBER() OVER (ORDER BY total_sales DESC) AS row_num, RANK() OVER (ORDER BY total_sales DESC) AS rank FROM sales_reps;' to compare ranking methods.",
        validationRules: [{ type: "command_contains", params: { substrings: ["ROW_NUMBER", "RANK", "OVER"] } }],
        hints: [
          "Window functions use OVER() to define the window frame",
          "ROW_NUMBER() gives each row a unique number, even with ties",
          "RANK() gives tied rows the same rank, skipping the next number",
          "ORDER BY inside OVER() controls the ranking order"
        ],
        solutionWalkthrough: "Run: SELECT id, name, total_sales, ROW_NUMBER() OVER (ORDER BY total_sales DESC) AS row_rank, RANK() OVER (ORDER BY total_sales DESC) AS rank, DENSE_RANK() OVER (ORDER BY total_sales DESC) AS dense_rank FROM sales_reps;",
        realWorldUseCase: "Window functions power leaderboards, paginated reports, and time-series analysis. Every major analytics platform uses them for cohort analysis, customer ranking, and performance dashboards.",
        commonMistakes: "Forgetting the OVER() clause. Mixing up ROW_NUMBER, RANK, and DENSE_RANK behaviors. Using ORDER BY in the outer query that conflicts with the window ordering.",
        debuggingTips: "Test with a small dataset where you know the expected ranking. Use SELECT * to see all columns and verify the ranking logic."
      },
      {
        id: "m8_8",
        levelNum: 7,
        title: "The Moving Target",
        subtitle: "LAG, LEAD, running totals with incident",
        category: "SQL",
        xpReward: 100,
        story: "HIGH: The CFO needs to understand the month-over-month revenue change. Was this month better or worse than last month? By how much? You need to use LAG to compare each month's revenue with the previous month and calculate the difference.",
        objective: "Write SQL queries using LAG() and LEAD() window functions to calculate period-over-period changes and running totals.",
        taskDescription: "Execute 'SELECT month, revenue, LAG(revenue) OVER (ORDER BY month) AS prev_month, revenue - LAG(revenue) OVER (ORDER BY month) AS change FROM monthly_revenue;' to show month-over-month revenue changes.",
        validationRules: [{ type: "command_contains", params: { substrings: ["LAG", "OVER", "ORDER BY"] } }],
        hints: [
          "LAG(column) accesses data from the previous row in the window",
          "LEAD(column) accesses data from the next row",
          "ORDER BY inside OVER() defines the order of rows for LAG/LEAD",
          "SUM(column) OVER (ORDER BY date) creates a running total"
        ],
        solutionWalkthrough: "Run: SELECT month, revenue, LAG(revenue, 1) OVER (ORDER BY month) AS prev_month_revenue, COALESCE(revenue - LAG(revenue) OVER (ORDER BY month), 0) AS month_change, SUM(revenue) OVER (ORDER BY month) AS running_total FROM monthly_revenue ORDER BY month;",
        realWorldUseCase: "Period-over-period analysis is fundamental to financial reporting, growth metrics, and operational monitoring. LAG/LEAD are used in every CFO dashboard, SaaS metrics report, and KPI tracking system.",
        commonMistakes: "Forgetting ORDER BY in the OVER clause (LAG without order is meaningless). Not handling NULL for the first row (no previous row exists). Using LAG without specifying the offset parameter.",
        debuggingTips: "First create a simple monthly view without LAG to verify the base data, then add LAG one step at a time."
      }
    ]
  },
  {
    num: 8,
    name: "DevOps & Cloud",
    rank: "Cloud Engineer",
    description: "Orchestrate containers, build CI/CD pipelines, and manage cloud infrastructure.",
    missions: [
      {
        id: "m6_1",
        levelNum: 8,
        title: "The Dock of Docker",
        subtitle: "Automating containers and health checks",
        category: "DevOps",
        xpReward: 400,
        story: "Production deployment is failing because of runaway ghost containers! Your pipeline needs to scan for running Docker containers that are over 24 hours old and shut them down.",
        objective: "Create a bash script '/home/user/cleanup_containers.sh' that finds container IDs and runs 'docker stop' on them.",
        taskDescription: "Write a shell script containing 'docker ps' command filtering commands to isolate containers older than a given timeframe.",
        initialVfsState: {
          "/home/user/cleanup_containers.sh": ""
        },
        validationRules: [
          {
            type: "file_contains",
            params: { path: "/home/user/cleanup_containers.sh", substring: "docker ps" }
          }
        ],
        hints: [
          "You can list docker containers using: docker ps -q",
          "Write a script that executes 'docker ps -q --filter \"status=running\"' and logs them.",
          "Simply verify you have the command 'docker ps' inside cleanup_containers.sh"
        ],
        solutionWalkthrough: "Open cleanup_containers.sh and write:\n#!/bin/bash\necho \"Cleaning up containers...\"\ndocker ps -a -q --filter \"status=exited\" | xargs -r docker rm\nThis removes stopped containers automatically.",
        realWorldUseCase: "Runaway developer containers quickly exhaust file handles and RAM. Running an automated container garbage collector keeps shared test environments healthy and prevents build pipeline timeouts.",
        commonMistakes: "Executing docker system prune blindly, which deletes cached build volumes and slows down CI builds.",
        debuggingTips: "Ensure your docker client is connected to a daemon and verify using 'docker version'."
      },
      {
        id: "m8_8",
        levelNum: 8,
        title: "The Orphaned Networks",
        subtitle: "Docker network and volume cleanup",
        category: "DevOps",
        xpReward: 450,
        story: "HIGH: The CI server is running out of disk space because dangling Docker volumes and unused networks are accumulating. Over 50 orphaned volumes are consuming 100GB of disk. You need a script that identifies and removes dangling volumes, networks, and stopped containers.",
        objective: "Write a script '/home/user/docker_cleanup.sh' that uses 'docker volume ls -f dangling=true', 'docker network ls', and 'docker system df' to report and clean up Docker resources.",
        taskDescription: "Create a comprehensive Docker cleanup script that lists dangling volumes, removes them, prunes unused networks, and reports reclaimed space.",
        initialVfsState: {
          "/home/user/docker_cleanup.sh": ""
        },
        validationRules: [
          { type: "file_contains", params: { path: "/home/user/docker_cleanup.sh", substring: "docker volume" } },
          { type: "file_contains", params: { path: "/home/user/docker_cleanup.sh", substring: "docker network" } },
          { type: "file_contains", params: { path: "/home/user/docker_cleanup.sh", substring: "dangling" } }
        ],
        hints: [
          "'docker volume ls -f dangling=true' lists unused volumes",
          "'docker volume prune -f' removes all dangling volumes",
          "'docker network prune -f' removes unused networks",
          "'docker system df' shows disk usage by Docker objects"
        ],
        solutionWalkthrough: "Write:\n#!/bin/bash\necho \"=== Docker Disk Usage ===\"\ndocker system df\necho \"\"\necho \"=== Dangling Volumes ===\"\ndocker volume ls -f dangling=true\necho \"\"\necho \"=== Cleaning Up ===\"\ndocker volume prune -f\ndocker network prune -f\ndocker container prune -f\necho \"Cleanup complete\"\ndocker system df",
        realWorldUseCase: "Docker environments accumulate orphaned resources rapidly. CI/CD build agents in particular generate hundreds of dangling volumes from failed builds, exhausting disk space within weeks.",
        commonMistakes: "Pruning without checking what will be deleted (may remove volumes with important cached data). Not running 'docker system df' before and after to measure reclaimed space.",
        debuggingTips: "Run 'docker volume ls -q -f dangling=true' first to preview what volumes would be removed. Check 'docker system df -v' for detailed usage per volume.",
        activeIncident: {
          title: "HIGH: Docker disk exhaustion - 100GB in dangling volumes",
          description: "The CI server has over 50 orphaned Docker volumes consuming 100GB of disk. Builds are failing due to insufficient space for container images.",
          severity: "HIGH"
        }
      },
      {
        id: "m8_9",
        levelNum: 8,
        title: "The Pipeline That Stopped",
        subtitle: "CI/CD deployment pipeline automation",
        category: "DevOps",
        xpReward: 500,
        story: "CRITICAL: The deployment pipeline failed at 3 AM because the build artifact wasn't properly versioned and the deployment script couldn't find the correct artifact. You need to write a robust CI/CD pipeline script that builds, tags with a version, and deploys an application, with rollback capability.",
        objective: "Write a script '/home/user/deploy_pipeline.sh' that builds a Docker image with a version tag, pushes it to a registry, and deploys it with health check validation.",
        taskDescription: "Create a deployment pipeline script that accepts a version parameter, builds a Docker image, tags it, and performs a rolling deployment with health checks.",
        initialVfsState: {
          "/home/user/deploy_pipeline.sh": "",
          "/home/user/Dockerfile": "FROM nginx:alpine\nCOPY index.html /usr/share/nginx/html/"
        },
        validationRules: [
          { type: "file_contains", params: { path: "/home/user/deploy_pipeline.sh", substring: "docker build" } },
          { type: "file_contains", params: { path: "/home/user/deploy_pipeline.sh", substring: "docker tag" } },
          { type: "file_contains", params: { path: "/home/user/deploy_pipeline.sh", substring: "docker push" } }
        ],
        hints: [
          "Accept version as argument: VERSION=${1:-latest}",
          "'docker build -t myapp:$VERSION .' builds and tags in one step",
          "'docker tag myapp:$VERSION registry.example.com/myapp:$VERSION' prepares for push",
          "Always check exit codes: 'docker push registry.example.com/myapp:$VERSION || exit 1'"
        ],
        solutionWalkthrough: "Write:\n#!/bin/bash\nset -euo pipefail\nVERSION=${1:-$(date +%Y%m%d-%H%M%S)}\nREGISTRY='registry.example.com'\nAPP_NAME='myapp'\necho \"Building $APP_NAME:$VERSION\"\ndocker build -t $APP_NAME:$VERSION .\ndocker tag $APP_NAME:$VERSION $REGISTRY/$APP_NAME:$VERSION\ndocker push $REGISTRY/$APP_NAME:$VERSION\necho \"Deployed $APP_NAME:$VERSION\"",
        realWorldUseCase: "CI/CD pipelines are the backbone of modern software delivery. A standardized pipeline script with proper tagging, registry push, and rollback support is essential for reliable deployments.",
        commonMistakes: "Not using unique version tags (overwriting 'latest' makes rollback impossible). Not checking docker build exit codes. Pushing without verifying the image builds correctly.",
        debuggingTips: "Test the build locally first: 'docker build -t test-app .'. Verify the image exists: 'docker images | grep test-app'. Check registry connectivity: 'curl -I https://registry.example.com/v2/'.",
        activeIncident: {
          title: "CRITICAL: Deployment pipeline failed - missing artifact version",
          description: "CI/CD pipeline failed at 3 AM because the build artifact wasn't properly version tagged. The deployment script couldn't find the correct artifact to deploy.",
          severity: "CRITICAL"
        }
      },
      {
        id: "m8_10",
        levelNum: 8,
        title: "The Scaling Emergency",
        subtitle: "Kubernetes pod health and scaling automation",
        category: "DevOps",
        xpReward: 550,
        story: "CRITICAL: A traffic spike caused the payment service to crash. Kubernetes has 3 replicas but they're all unhealthy and returning 502s. You need to write a diagnostic script that checks pod status, restarts unhealthy pods, and scales up replicas during high load.",
        objective: "Write a script '/home/user/k8s_health.sh' that uses 'kubectl get pods', checks for non-Running status, and performs rolling restart of unhealthy deployments.",
        taskDescription: "Create a Kubernetes health script that checks pod status across all namespaces, identifies CrashLoopBackOff or Error pods, and logs the incident with timestamps.",
        initialVfsState: {
          "/home/user/k8s_health.sh": ""
        },
        validationRules: [
          { type: "file_contains", params: { path: "/home/user/k8s_health.sh", substring: "kubectl" } },
          { type: "file_contains", params: { path: "/home/user/k8s_health.sh", substring: "CrashLoopBackOff" } },
          { type: "file_contains", params: { path: "/home/user/k8s_health.sh", substring: "rollout" } }
        ],
        hints: [
          "'kubectl get pods --all-namespaces' lists all pods across namespaces",
          "'kubectl get pods -o wide --field-selector status.phase!=Running' finds non-running pods",
          "'kubectl rollout restart deployment/myapp' performs a rolling restart",
          "Use 'kubectl describe pod' to get detailed failure information"
        ],
        solutionWalkthrough: "Write:\n#!/bin/bash\necho \"=== Kubernetes Health Check ===\" > k8s_report.txt\nkubectl get pods --all-namespaces >> k8s_report.txt\necho \"\" >> k8s_report.txt\nUNHEALTHY=$(kubectl get pods --all-namespaces -o jsonpath='{range .items[?(@.status.phase!=\"Running\")]}{.metadata.name}{\" \"}{.status.phase}{\"\\n\"}{end}')\nif [ -n \"$UNHEALTHY\" ]; then\n  echo \"Unhealthy pods found:\" >> k8s_report.txt\n  echo \"$UNHEALTHY\" >> k8s_report.txt\nfi\ncat k8s_report.txt",
        realWorldUseCase: "Kubernetes cluster health monitoring is essential for production workloads. Automated pod health checks with reporting enable rapid incident response during traffic spikes and service degradation.",
        commonMistakes: "Only checking pod status without checking the underlying node health. Forgetting that 'Running' status doesn't mean the app is healthy (need readiness probes). Not considering that CrashLoopBackOff includes a backoff delay.",
        debuggingTips: "Run 'kubectl top pods' to check resource usage. Use 'kubectl logs --previous pod-name' to see logs from the crashed container. Check 'kubectl describe node' for node-level issues.",
        activeIncident: {
          title: "CRITICAL: Payment service crash during traffic spike",
          description: "A 10x traffic spike caused the payment service to crash. All 3 Kubernetes replicas are unhealthy and returning HTTP 502 errors to customers.",
          severity: "CRITICAL"
        }
      },
      {
        id: "m8_11",
        levelNum: 8,
        title: "The Atomic Deployment",
        subtitle: "Transactions with incident",
        category: "SQL",
        xpReward: 100,
        story: "CRITICAL: A deployment script is running multiple SQL statements to update pricing across the entire product catalog. If the script fails halfway through, some products will have new prices while others have old prices — causing checkout chaos. You need to wrap the updates in a transaction with ROLLBACK on failure.",
        objective: "Write a SQL transaction using BEGIN, COMMIT, and ROLLBACK to ensure atomic updates across multiple tables.",
        taskDescription: "Execute a transaction: 'BEGIN; UPDATE products SET price = price * 1.1 WHERE category = 'Electronics'; UPDATE products SET price = price * 1.05 WHERE category = 'Books'; COMMIT;' with error handling via ROLLBACK.",
        validationRules: [{ type: "command_contains", params: { substrings: ["BEGIN", "COMMIT", "ROLLBACK"] } }],
        hints: [
          "BEGIN starts a transaction block",
          "COMMIT saves all changes made in the transaction",
          "ROLLBACK undoes all changes if something goes wrong",
          "Transactions ensure all-or-nothing execution"
        ],
        solutionWalkthrough: "Run: BEGIN; UPDATE products SET price = price * 1.1 WHERE category = 'Electronics'; UPDATE products SET price = price * 1.05 WHERE category = 'Books'; COMMIT; If any statement fails, run ROLLBACK to undo everything.",
        realWorldUseCase: "Transactions are critical for any multi-step database operation: payments (debit one account, credit another), inventory (reserve stock, create order), and deployments (update schema, migrate data).",
        commonMistakes: "Forgetting COMMIT (leaves the transaction open, causing locks). Not having a ROLLBACK plan. Using auto-commit mode which treats each statement as its own transaction.",
        debuggingTips: "Run SELECT before and after the transaction to verify changes. Use BEGIN; ... ROLLBACK; to test without making permanent changes."
      },
      {
        id: "m8_12",
        levelNum: 8,
        title: "The Slow Query Crisis",
        subtitle: "EXPLAIN, CREATE INDEX with incident",
        category: "SQL",
        xpReward: 100,
        story: "CRITICAL: The customer dashboard query takes 45 seconds to load. Users are abandoning the page and the CEO is furious. You need to diagnose why the query is slow using EXPLAIN, identify missing indexes, and create the necessary indexes to fix performance.",
        objective: "Write SQL queries using EXPLAIN to analyze query execution plans and CREATE INDEX to add missing indexes.",
        taskDescription: "Execute 'EXPLAIN SELECT * FROM orders WHERE customer_id = 1234;' to see the query plan, then 'CREATE INDEX idx_orders_customer ON orders(customer_id);' to add an index.",
        validationRules: [{ type: "command_contains", params: { substrings: ["EXPLAIN", "CREATE INDEX"] } }],
        hints: [
          "EXPLAIN shows the query execution plan including full table scans vs index scans",
          "CREATE INDEX adds an index on specified columns",
          "Indexes dramatically speed up WHERE, JOIN, and ORDER BY operations",
          "Use EXPLAIN ANALYZE to get actual execution timing"
        ],
        solutionWalkthrough: "Run: EXPLAIN SELECT * FROM orders WHERE customer_id = 1234; Look for 'Seq Scan' (sequential/full table scan) vs 'Index Scan'. Then: CREATE INDEX idx_orders_customer_id ON orders(customer_id); Run EXPLAIN again to verify the improvement.",
        realWorldUseCase: "Slow query diagnosis is a daily task for every backend and database engineer. EXPLAIN and CREATE INDEX are the primary tools for performance tuning in production databases.",
        commonMistakes: "Creating too many indexes (slows down writes). Not using EXPLAIN before adding indexes. Creating indexes on low-cardinality columns (e.g., boolean flags).",
        debuggingTips: "Check existing indexes with '\\di' in psql or 'SHOW INDEX FROM table_name' in MySQL. Use EXPLAIN ANALYZE for real execution times, not just estimates."
      }
    ]
  },
  {
    num: 9,
    name: "Security Operations",
    rank: "Security Guardian",
    description: "Respond to security incidents, detect threats, and harden systems against attacks.",
    missions: [
      {
        id: "m9_1",
        levelNum: 9,
        title: "The Midnight Intruder",
        subtitle: "SSH breach investigation and forensic analysis",
        category: "Security",
        xpReward: 500,
        story: "CRITICAL: SOC detected an unauthorized SSH login from an external IP 203.0.113.50 at 3:00 AM. The attacker accessed the production database server. You must perform forensic analysis: check auth.log for suspicious entries, identify compromised user accounts, list all active SSH sessions, and check for unauthorized SSH keys.",
        objective: "Write a script '/home/user/ssh_forensics.sh' that checks /var/log/auth.log for failed/successful SSH logins, lists all .ssh/authorized_keys files, shows current SSH sessions, and identifies recently modified user accounts.",
        taskDescription: "Create a forensics script that parses SSH auth logs for suspicious patterns, enumerates authorized SSH keys across user home directories, and reports active connections.",
        initialVfsState: {
          "/home/user/ssh_forensics.sh": ""
        },
        validationRules: [
          { type: "file_contains", params: { path: "/home/user/ssh_forensics.sh", substring: "auth.log" } },
          { type: "file_contains", params: { path: "/home/user/ssh_forensics.sh", substring: "authorized_keys" } },
          { type: "file_contains", params: { path: "/home/user/ssh_forensics.sh", substring: "sshd" } }
        ],
        hints: [
          "'grep sshd /var/log/auth.log | grep FAILED' shows failed SSH attempts",
          "'grep sshd /var/log/auth.log | grep ACCEPTED' shows successful logins",
          "'find /home/*/.ssh/authorized_keys' lists all authorized SSH keys",
          "'ss -tnp | grep :22' shows active SSH connections with PIDs"
        ],
        solutionWalkthrough: "Write:\n#!/bin/bash\nREPORT='ssh_forensics_report.txt'\necho \"=== SSH Forensic Analysis ===\" > $REPORT\necho \"Date: $(date)\" >> $REPORT\necho \"\" >> $REPORT\necho \"=== Failed SSH Attempts ===\" >> $REPORT\ngrep sshd /var/log/auth.log | grep FAILED >> $REPORT 2>/dev/null\necho \"\" >> $REPORT\necho \"=== Successful Logins ===\" >> $REPORT\ngrep sshd /var/log/auth.log | grep ACCEPTED >> $REPORT 2>/dev/null\necho \"\" >> $REPORT\necho \"=== Authorized Keys ===\" >> $REPORT\nfind /home -name authorized_keys 2>/dev/null >> $REPORT\necho \"\" >> $REPORT\necho \"=== Active SSH Sessions ===\" >> $REPORT\nss -tnp | grep :22 >> $REPORT 2>/dev/null\ncat $REPORT",
        realWorldUseCase: "SSH brute-force and credential theft are the top initial access vectors in data breaches. Rapid forensic triage of SSH logs is critical for containment and eradication phases of incident response.",
        commonMistakes: "Only checking /var/log/auth.log on the local host (attackers often delete logs). Not checking for newly added SSH keys. Forgetting to capture active sessions before they disconnect.",
        debuggingTips: "Check 'last -10' for recent login history. Use 'lsof -i :22' to see open SSH connections. Verify auth.log integrity with 'ls -la /var/log/auth.log'.",
        activeIncident: {
          title: "CRITICAL: Unauthorized SSH access detected - external IP 203.0.113.50",
          description: "SOC detected an unauthorized SSH login from external IP 203.0.113.50 at 3:00 AM. The attacker accessed the production database server. Immediate forensic investigation required.",
          severity: "CRITICAL"
        }
      },
      {
        id: "m9_2",
        levelNum: 9,
        title: "The Silent Payload",
        subtitle: "Malware detection and process investigation",
        category: "Security",
        xpReward: 530,
        story: "CRITICAL: Endpoint detection flagged a suspicious process running from /tmp/.crypto/ on a finance workstation. The process is using 90% CPU and making outbound connections to an unknown IP. You need to investigate the process, check its network connections, examine the binary, and kill the malicious process.",
        objective: "Write a script '/home/user/malware_investigate.sh' that uses 'ps aux' to find suspicious processes, 'ss -tupn' to check network connections, 'lsof' to see open files, and creates a forensic report.",
        taskDescription: "Create an incident response script that identifies processes running from temp directories, checks for suspicious outbound connections, lists open files by the process, and generates a forensic report.",
        initialVfsState: {
          "/home/user/malware_investigate.sh": ""
        },
        validationRules: [
          { type: "file_contains", params: { path: "/home/user/malware_investigate.sh", substring: "ps aux" } },
          { type: "file_contains", params: { path: "/home/user/malware_investigate.sh", substring: "ss -tupn" } },
          { type: "file_contains", params: { path: "/home/user/malware_investigate.sh", substring: "lsof" } }
        ],
        hints: [
          "'ps aux | grep /tmp' finds processes running from /tmp directories",
          "'ss -tupn | grep ESTAB' shows established outbound connections",
          "'lsof -p PID' lists all files opened by a specific process",
          "'cat /proc/PID/exe > /tmp/sample.bin' extracts the binary for analysis"
        ],
        solutionWalkthrough: "Write:\n#!/bin/bash\nREPORT='malware_report.txt'\necho \"=== Malware Investigation Report ===\" > $REPORT\necho \"Date: $(date)\" >> $REPORT\necho \"\" >> $REPORT\necho \"=== Suspicious Processes ===\" >> $REPORT\nps aux | grep -E '/tmp|/dev/shm' | grep -v grep >> $REPORT\necho \"\" >> $REPORT\necho \"=== Network Connections ===\" >> $REPORT\nss -tupn | grep ESTAB >> $REPORT 2>/dev/null\necho \"\" >> $REPORT\necho \"=== Open Files by Suspicious PIDs ===\" >> $REPORT\nfor pid in $(ps aux | grep -E '/tmp|/dev/shm' | grep -v grep | awk '{print $2}'); do\n  echo \"PID: $pid\" >> $REPORT\n  lsof -p $pid 2>/dev/null >> $REPORT\ndone\ncat $REPORT",
        realWorldUseCase: "Malware often executes from temp directories (/tmp, /dev/shm) to evade detection. Rapid triage of suspicious processes, network connections, and file handles is the first step in containment.",
        commonMistakes: "Only checking /tmp (attackers also use /dev/shm, /var/tmp, ~/.cache). Not checking parent process ID (PPID) to find the infection vector. Killing the process without preserving the binary for analysis.",
        debuggingTips: "Use 'file /proc/PID/exe' to determine binary type. Check 'cat /proc/PID/cmdline' for full command line. Use 'strings /proc/PID/exe | head -50' for quick analysis.",
        activeIncident: {
          title: "CRITICAL: Suspicious process detected in /tmp/.crypto/",
          description: "EDR flagged a process running from /tmp/.crypto/ on a finance workstation. Process is consuming 90% CPU and making outbound connections to an unknown IP address.",
          severity: "CRITICAL"
        }
      },
      {
        id: "m9_3",
        levelNum: 9,
        title: "The Open Gates",
        subtitle: "Firewall hardening and port audit",
        category: "Security",
        xpReward: 480,
        story: "HIGH: A security scan revealed 15 open ports on the production web server, including unnecessary services like Telnet (23), FTP (21), and a Redis server (6379) exposed to the internet. You need to audit all listening ports, identify unauthorized services, and write a firewall configuration that only allows essential ports (80, 443, 22 from bastion).",
        objective: "Write a script '/home/user/port_audit.sh' that scans listening ports with 'ss -tulnp', identifies non-standard services, and generates an iptables/nftables hardening rule set.",
        taskDescription: "Create a port audit script that lists all listening TCP/UDP ports, identifies services on non-standard ports, checks iptables rules, and generates a hardening report with recommended firewall rules.",
        initialVfsState: {
          "/home/user/port_audit.sh": ""
        },
        validationRules: [
          { type: "file_contains", params: { path: "/home/user/port_audit.sh", substring: "ss -tulnp" } },
          { type: "file_contains", params: { path: "/home/user/port_audit.sh", substring: "iptables" } },
          { type: "file_contains", params: { path: "/home/user/port_audit.sh", substring: "LISTEN" } }
        ],
        hints: [
          "'ss -tulnp' shows all listening TCP and UDP ports with process info",
          "'iptables -L -n -v' lists current firewall rules with packet counters",
          "Use 'lsof -i :PORT' to identify which application owns a port",
          "Check /etc/services for standard port-to-service mappings"
        ],
        solutionWalkthrough: "Write:\n#!/bin/bash\nREPORT='port_audit_report.txt'\necho \"=== Port Audit Report ===\" > $REPORT\necho \"Date: $(date)\" >> $REPORT\necho \"\" >> $REPORT\necho \"=== Listening Ports ===\" >> $REPORT\nss -tulnp >> $REPORT 2>/dev/null\necho \"\" >> $REPORT\necho \"=== Current Firewall Rules ===\" >> $REPORT\niptables -L -n -v >> $REPORT 2>/dev/null || echo \"iptables not available\" >> $REPORT\necho \"\" >> $REPORT\necho \"=== Non-Standard Ports (not 22, 80, 443) ===\" >> $REPORT\nss -tulnp | awk '{print $5}' | grep -E ':[0-9]+' | grep -vE ':(22|80|443)\"' >> $REPORT\ncat $REPORT",
        realWorldUseCase: "Exposed unnecessary ports are the leading cause of initial access in breaches. Regular port audits and firewall hardening are mandatory compliance requirements for PCI-DSS, SOC2, and ISO 27001.",
        commonMistakes: "Only checking TCP ports and ignoring UDP. Assuming iptables is the firewall in use (modern systems use nftables or firewalld). Forgetting that IPv6 might have different rules.",
        debuggingTips: "Use 'nmap -sT -p- localhost' for a complete TCP port scan. Check 'ufw status' for Ubuntu, 'firewall-cmd --list-all' for RHEL/CentOS. Verify with 'netstat -tulpn' as fallback.",
        activeIncident: {
          title: "HIGH: 15 open ports detected - unauthorized services exposed",
          description: "Security scan revealed 15 open ports on production web server including Telnet (23), FTP (21), and Redis (6379) exposed to the internet. Immediate hardening required.",
          severity: "HIGH"
        }
      },
      {
        id: "m9_4",
        levelNum: 9,
        title: "The Ransomware Countdown",
        subtitle: "Ransomware detection and recovery simulation",
        category: "Security",
        xpReward: 600,
        story: "CRITICAL: A user reported that their files have been renamed with '.encrypted' extension and a ransom note named 'README_TO_DECRYPT.txt' appeared on their desktop. The ransomware may be spreading via network shares. You need to write a script that detects encrypted file patterns, identifies the patient-zero machine, checks for ransom notes, and isolates the infected machine by blocking its network connections.",
        objective: "Write a script '/home/user/ransomware_response.sh' that scans for files with suspicious extensions (.encrypted, .crypted, .locked), identifies the infection scope, checks network connections from the affected host, and generates an incident report.",
        taskDescription: "Create a ransomware incident response script that finds recently modified files with suspicious extensions, counts affected files, checks for ransom notes, and logs network connections for containment planning.",
        initialVfsState: {
          "/home/user/ransomware_response.sh": ""
        },
        validationRules: [
          { type: "file_contains", params: { path: "/home/user/ransomware_response.sh", substring: "find" } },
          { type: "file_contains", params: { path: "/home/user/ransomware_response.sh", substring: "encrypted" } },
          { type: "file_contains", params: { path: "/home/user/ransomware_response.sh", substring: "README" } }
        ],
        hints: [
          "'find /home -name '*.encrypted' -mmin -60' finds files encrypted in the last hour",
          "'find /home -name 'README*' -newer /tmp' finds ransom notes created recently",
          "'ss -tupn | grep ESTAB' identifies current network connections for containment",
          "Count affected files: 'find /home -name '*.encrypted' | wc -l'"
        ],
        solutionWalkthrough: "Write:\n#!/bin/bash\nREPORT='ransomware_incident.txt'\nSCAN_DIR=${1:-/home}\necho \"=== Ransomware Incident Response ===\" > $REPORT\necho \"Scan started: $(date)\" >> $REPORT\necho \"Scan directory: $SCAN_DIR\" >> $REPORT\necho \"\" >> $REPORT\necho \"=== Encrypted Files Found ===\" >> $REPORT\nfind $SCAN_DIR -type f \( -name '*.encrypted' -o -name '*.crypted' -o -name '*.locked' \) -mmin -120 >> $REPORT 2>/dev/null\nCOUNT=$(find $SCAN_DIR -type f \( -name '*.encrypted' -o -name '*.crypted' -o -name '*.locked' \) -mmin -120 | wc -l)\necho \"Total affected files: $COUNT\" >> $REPORT\necho \"\" >> $REPORT\necho \"=== Ransom Notes ===\" >> $REPORT\nfind $SCAN_DIR -name 'README*' -o -name 'DECRYPT*' -o -name 'HOW_TO*' >> $REPORT 2>/dev/null\necho \"\" >> $REPORT\necho \"=== Active Network Connections (for containment) ===\" >> $REPORT\nss -tupn | grep ESTAB >> $REPORT 2>/dev/null\necho \"\" >> $REPORT\necho \"=== Recommended Actions ===\" >> $REPORT\necho \"1. Isolate affected host from network immediately\" >> $REPORT\necho \"2. Do NOT pay the ransom\" >> $REPORT\necho \"3. Preserve encrypted files for forensics\" >> $REPORT\necho \"4. Check network shares for propagation\" >> $REPORT\necho \"5. Restore from offline backups\" >> $REPORT\ncat $REPORT",
        realWorldUseCase: "Ransomware attacks have a critical window of minutes to hours before full encryption. A standardized incident response script reduces containment time from hours to minutes, potentially saving millions in ransom demands.",
        commonMistakes: "Scanning only local drives (ransomware spreads via network shares). Rebooting the infected machine (loses volatile forensics data). Deleting encrypted files before forensic analysis.",
        debuggingTips: "Check for ransom note variants: 'README', 'DECRYPT', 'HOW_TO', 'RECOVERY'. Use 'stat' on encrypted files to determine encryption timestamp. Check 'ps aux | grep -i ransom' for running ransomware processes.",
        activeIncident: {
          title: "CRITICAL: Ransomware detected - files being encrypted across network",
          description: "User reports files renamed with '.encrypted' extension. Ransom note 'README_TO_DECRYPT.txt' found on desktop. Possible network share propagation.",
          severity: "CRITICAL"
        }
      },
      {
        id: "m9_5",
        levelNum: 9,
        title: "The Insider Trail",
        subtitle: "Data exfiltration detection and user behavior analysis",
        category: "Security",
        xpReward: 550,
        story: "HIGH: HR reports that a developer is leaving the company under contentious circumstances. Security needs to audit their recent activity: large file transfers, SSH connections to unusual IPs, sudo command history, and access to sensitive databases. You need to build a user behavior analytics script that investigates a specific user's recent activity.",
        objective: "Write a script '/home/user/user_audit.sh' that takes a username as an argument and investigates their: bash history, sudo commands, recently modified files, SSH logins, and active processes.",
        taskDescription: "Create a user activity audit script that accepts a username parameter, scans ~/.bash_history for sensitive commands, checks /var/log/auth.log for their SSH activity, lists their running processes, and finds recently modified files owned by the user.",
        initialVfsState: {
          "/home/user/user_audit.sh": ""
        },
        validationRules: [
          { type: "file_contains", params: { path: "/home/user/user_audit.sh", substring: "bash_history" } },
          { type: "file_contains", params: { path: "/home/user/user_audit.sh", substring: "sudo" } },
          { type: "file_contains", params: { path: "/home/user/user_audit.sh", substring: "auth.log" } }
        ],
        hints: [
          "Accept username: USERNAME=${1:?'Usage: $0 <username>'}",
          "Read history: cat /home/$USERNAME/.bash_history | tail -50",
          "Find sudo use: grep $USERNAME /var/log/auth.log | grep sudo",
          "Find their processes: ps -u $USERNAME",
          "Recently modified files: find /home/$USERNAME -mmin -1440 -type f"
        ],
        solutionWalkthrough: "Write:\n#!/bin/bash\nUSERNAME=${1:?'Usage: $0 <username>'}\nREPORT=\"user_audit_${USERNAME}.txt\"\necho \"=== User Activity Audit: $USERNAME ===\" > $REPORT\necho \"Date: $(date)\" >> $REPORT\necho \"\" >> $REPORT\necho \"=== Recent Bash History ===\" >> $REPORT\ncat /home/$USERNAME/.bash_history 2>/dev/null | tail -50 >> $REPORT\necho \"\" >> $REPORT\necho \"=== Sudo Commands ===\" >> $REPORT\ngrep $USERNAME /var/log/auth.log 2>/dev/null | grep sudo >> $REPORT\necho \"\" >> $REPORT\necho \"=== SSH Activity ===\" >> $REPORT\ngrep $USERNAME /var/log/auth.log 2>/dev/null | grep sshd >> $REPORT\necho \"\" >> $REPORT\necho \"=== Running Processes ===\" >> $REPORT\nps -u $USERNAME 2>/dev/null >> $REPORT\necho \"\" >> $REPORT\necho \"=== Recently Modified Files (last 24h) ===\" >> $REPORT\nfind /home/$USERNAME -mmin -1440 -type f 2>/dev/null >> $REPORT\ncat $REPORT",
        realWorldUseCase: "Insider threat detection is a top priority for SOC teams. User behavior analytics investigate anomalous file access, after-hours logins, and data exfiltration patterns to prevent intellectual property theft.",
        commonMistakes: "Only checking bash history (users can use other shells or delete history). Not checking for rsync/scp file transfers. Ignoring USB mount logs and browser downloads.",
        debuggingTips: "Check 'last $USERNAME' for login history. Use 'lsof -u $USERNAME' for all open files. Check 'find /tmp -user $USERNAME' for suspicious temp files. Review 'journalctl _UID=$(id -u $USERNAME)' for systemd logs.",
        activeIncident: {
          title: "HIGH: Insider threat investigation - departing employee",
          description: "A developer is leaving under contentious circumstances. Security needs to audit their recent activity for data exfiltration: large file transfers, unusual SSH connections, and sensitive database access.",
          severity: "HIGH"
        }
      },
      {
        id: "m9_6",
        levelNum: 9,
        title: "The Data Breach Audit",
        subtitle: "UNION, INTERSECT, EXCEPT with incident",
        category: "SQL",
        xpReward: 100,
        story: "CRITICAL: A data breach is suspected. The security team has two lists: IP addresses that accessed the admin panel, and IP addresses from the VPN logs. You need to find: all unique IPs across both logs (UNION), IPs that appear in both logs (INTERSECT), and IPs that accessed admin but weren't on the VPN (EXCEPT).",
        objective: "Write SQL queries using UNION, INTERSECT, and EXCEPT set operations to cross-reference access logs.",
        taskDescription: "Execute 'SELECT ip FROM admin_access EXCEPT SELECT ip FROM vpn_logs;' to find IPs that accessed admin without VPN.",
        validationRules: [{ type: "command_contains", params: { substrings: ["UNION", "INTERSECT", "EXCEPT"] } }],
        hints: [
          "UNION combines results from two queries, removing duplicates",
          "INTERSECT returns rows common to both queries",
          "EXCEPT returns rows from the first query that are NOT in the second",
          "All queries must have the same number of columns with compatible types"
        ],
        solutionWalkthrough: "Run: -- All unique IPs: SELECT ip FROM admin_access UNION SELECT ip FROM vpn_logs; -- IPs in both: SELECT ip FROM admin_access INTERSECT SELECT ip FROM vpn_logs; -- Suspicious IPs (admin no VPN): SELECT ip FROM admin_access EXCEPT SELECT ip FROM vpn_logs;",
        realWorldUseCase: "Set operations are fundamental to breach investigations, access audits, and compliance reporting. They're used to compare access logs, find gaps in coverage, and identify unauthorized access patterns.",
        commonMistakes: "Using UNION ALL (includes duplicates) when UNION (deduplicated) is needed. Column count mismatch between queries. Using ORDER BY in individual queries (ORDER BY goes at the end).",
        debuggingTips: "Test each SELECT individually before combining with set operations. Use COUNT(*) on each subquery to understand the data volumes."
      },
      {
        id: "m9_7",
        levelNum: 9,
        title: "The Privilege Escalation",
        subtitle: "Complex multi-table investigation with incident",
        category: "SQL",
        xpReward: 100,
        story: "CRITICAL: SOC detected a privilege escalation attack. A user with low-level 'viewer' role somehow gained admin access and exfiltrated customer data. You need to investigate by joining the users, roles, permissions, audit_log, and access_history tables to trace the attack path and identify all compromised accounts.",
        objective: "Write a multi-table JOIN query that correlates user accounts, role assignments, permission changes, and access logs to trace a privilege escalation incident.",
        taskDescription: "Execute a complex investigation query: 'SELECT u.email, r.role_name, a.action, a.timestamp, a.details FROM audit_log a JOIN users u ON a.user_id = u.id JOIN roles r ON u.role_id = r.id WHERE a.action IN ('ROLE_CHANGE', 'PERMISSION_GRANT', 'DATA_EXPORT') AND a.timestamp > NOW() - INTERVAL '7 days' ORDER BY a.timestamp;'",
        validationRules: [{ type: "command_contains", params: { substrings: ["JOIN", "audit", "WHERE"] } }],
        hints: [
          "Chain multiple JOINs to connect related tables",
          "Filter by action types relevant to privilege escalation",
          "Use time ranges to focus on the incident window",
          "ORDER BY timestamp to reconstruct the attack timeline"
        ],
        solutionWalkthrough: "Run: SELECT u.email, u.role_id AS current_role, r.role_name, al.action, al.timestamp, al.details FROM users u JOIN audit_log al ON u.id = al.user_id JOIN roles r ON u.role_id = r.id WHERE al.action IN ('ROLE_CHANGE', 'PERMISSION_GRANT', 'DATA_ACCESS') AND al.timestamp >= NOW() - INTERVAL '24 hours' ORDER BY al.timestamp;",
        realWorldUseCase: "Incident response investigations require correlating data across multiple tables — user accounts, access logs, permission changes, and network logs. Multi-table JOINs are the foundation of forensic database analysis.",
        commonMistakes: "Creating Cartesian products by forgetting JOIN conditions. Using INNER JOIN when LEFT JOIN is needed to preserve all audit records. Not filtering by time range, causing massive result sets.",
        debuggingTips: "Start with a simple join between two tables and verify the row count, then add additional tables one at a time. Use LIMIT 100 to keep result sets manageable during investigation."
      }
    ]
  }
];
