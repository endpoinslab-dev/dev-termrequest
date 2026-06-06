export interface Mission {
  id: string;
  levelNum: number;
  title: string;
  subtitle: string;
  category: "Linux" | "PowerShell" | "DevOps" | "Security" | "KQL";
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
    name: "Bash Scripting Fundamentals",
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
      }
    ]
  },
  {
    num: 2,
    name: "Real Linux Automation",
    rank: "Automation Engineer",
    description: "Automate system monitoring, log rotations, scheduled tasks (cron), and JSON parsing with jq.",
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
      }
    ]
  },
  {
    num: 3,
    name: "Advanced Bash Engineering",
    rank: "DevOps Operator",
    description: "Master text processing with awk, sed, advanced regex, error trapping, and building custom CLI utilities.",
    missions: [
      {
        id: "m3_1",
        levelNum: 3,
        title: "The Awk Alchemist",
        subtitle: "Parsing reports with awk",
        category: "Linux",
        xpReward: 350,
        story: "Our cloud billing engine exported a CSV containing usage metrics for various virtual machines. Your manager needs a list of VM IDs and their respective RAM usage, but ONLY for VMs that are exceeding 80% usage.",
        objective: "Write a command that processes '/home/user/metrics.csv' and extracts matching columns using 'awk'.",
        taskDescription: "Extract columns for VM_ID and usage ratio where usage exceeds 80%. Create a file '/home/user/alerts.txt' with columns extracted from rows where the usage (3rd column) is > 80.",
        initialVfsState: {
          "/home/user/metrics.csv": "VM_ID,CPU,RAM_USAGE\nvm-101,45,65\nvm-102,90,88\nvm-103,12,34\nvm-104,81,85\nvm-105,75,50",
          "/home/user/alerts.txt": ""
        },
        validationRules: [
          {
            type: "file_contains",
            params: { path: "/home/user/alerts.txt", substring: "vm-102" }
          },
          {
            type: "file_contains",
            params: { path: "/home/user/alerts.txt", substring: "vm-104" }
          }
        ],
        hints: [
          "Use awk with comma delimiter: awk -F, '$3 > 80 {print $1, $3}' metrics.csv",
          "Redirect the output to alerts.txt.",
          "Try running: awk -F, '$3 > 80 {print $1, $3}' metrics.csv > alerts.txt"
        ],
        solutionWalkthrough: "Run `awk -F, '$3 > 80 {print $1, $3}' metrics.csv > alerts.txt` to filter records with RAM usage > 80% and print VM_ID alongside usage details, writing results to alerts.txt.",
        realWorldUseCase: "AWK is a complete Turing-complete programming language built for text stream processing. It is used inside legacy logs and database records parsing to build instant reports without needing heavy languages like Python.",
        commonMistakes: "Using standard spaces instead of specifying a comma delimiter `-F,`. Forgetting single quotes around the awk statement.",
        debuggingTips: "If you get empty results, double check that column 3 values are numeric and compared accurately without spaces in strings."
      }
    ]
  },
  {
    num: 4,
    name: "PowerShell Fundamentals",
    rank: "Script Apprentice",
    description: "Learn the power of object-oriented pipelines, cmdlets, variables, and Windows command execution.",
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
      }
    ]
  },
  {
    num: 5,
    name: "PowerShell Automation",
    rank: "Infrastructure Wizard",
    description: "Automate Windows services, remote systems, parse registry entries, XML/JSON APIs, and manage processes.",
    missions: [
      {
        id: "m5_1",
        levelNum: 5,
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
      }
    ]
  },
  {
    num: 6,
    name: "DevOps + Infrastructure Automation",
    rank: "DevOps Operator",
    description: "Write deployment engines, manage Docker containers and Kubernetes clusters, and automate CI/CD workflows.",
    missions: [
      {
        id: "m6_1",
        levelNum: 6,
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
      }
    ]
  },
  {
    num: 7,
    name: "Security & Red Team Automation",
    rank: "Shell Architect",
    description: "Analyze audit logs, write secure file integrity checkers, detect threat indicators (IOCs), and secure SSH servers.",
    missions: [
      {
        id: "m7_1",
        levelNum: 7,
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
      }
    ]
  },
  {
    num: 8,
    name: "KQL & Data Analysis",
    rank: "Query Artisan",
    description: "Master Kusto Query Language — filter, aggregate, join, and explore data the way Azure Data Explorer, Log Analytics, and Microsoft Sentinel expect you to.",
    missions: [
      {
        id: "m8_1",
        levelNum: 8,
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
        levelNum: 8,
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
        levelNum: 8,
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
        levelNum: 8,
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
        levelNum: 8,
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
        levelNum: 8,
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
      }
    ]
  }
];
