export interface CommandEntry {
  command: string;
  description: string;
  syntax: string;
  syntaxParts: { label: string; value: string; color: string }[];
  example: string;
  exampleOutput?: string;
  stepByStep: string[];
  tryIt: string;
  commonFlags: { flag: string; description: string }[];
}

export interface WizardModule {
  id: string;
  title: string;
  description: string;
  commands: CommandEntry[];
}

export interface WizardTrack {
  id: "linux" | "powershell" | "kql";
  title: string;
  description: string;
  modules: WizardModule[];
}

export const wizardTracks: WizardTrack[] = [
  {
    id: "linux",
    title: "Linux Shell Wizard",
    description: "Master the Bash command line from the ground up. Each module builds on the last.",
    modules: [
      {
        id: "linux-nav",
        title: "File Navigation",
        description: "Move around the filesystem like a pro.",
        commands: [
          {
            command: "pwd",
            description: "Print Working Directory — shows your current location in the filesystem tree.",
            syntax: "pwd",
            syntaxParts: [{ label: "command", value: "pwd", color: "text-cyber-primary" }],
            example: "$ pwd\n/home/user",
            exampleOutput: "/home/user",
            stepByStep: [
              "Type pwd and press Enter",
              "The shell prints the absolute path of your current directory",
              "Use this anytime you feel lost in the filesystem"
            ],
            tryIt: "Run pwd to see where you are right now",
            commonFlags: []
          },
          {
            command: "ls",
            description: "List directory contents — the primary way to explore what's in a folder.",
            syntax: "ls [options] [path]",
            syntaxParts: [
              { label: "command", value: "ls", color: "text-cyber-primary" },
              { label: "options", value: "[options]", color: "text-cyber-accent" },
              { label: "path", value: "[path]", color: "text-cyber-purple" }
            ],
            example: "$ ls -la /home/user\ntotal 12\ndrwxr-xr-x  2 user user 4096 May 23 10:00 .\n-rw-r--r--  1 user user   45 May 23 10:00 file.txt",
            stepByStep: [
              "Start with ls to see files in the current directory",
              "Add -l for a detailed (long) listing with permissions, size, and date",
              "Add -a to show hidden files (those starting with a dot)",
              "Combine flags: ls -la shows everything with full details",
              "Specify a path: ls /some/directory to list elsewhere"
            ],
            tryIt: "Run ls -la to see all files including hidden ones",
            commonFlags: [
              { flag: "-l", description: "Long format with permissions, size, date" },
              { flag: "-a", description: "Show all files including hidden (dot) files" },
              { flag: "-h", description: "Human-readable file sizes (with -l)" },
              { flag: "-S", description: "Sort by file size (largest first)" },
              { flag: "-t", description: "Sort by modification time (newest first)" },
              { flag: "-r", description: "Reverse sort order" }
            ]
          },
          {
            command: "cd",
            description: "Change Directory — move to a different folder in the filesystem.",
            syntax: "cd [directory]",
            syntaxParts: [
              { label: "command", value: "cd", color: "text-cyber-primary" },
              { label: "directory", value: "[directory]", color: "text-cyber-purple" }
            ],
            example: "$ cd /var/log\n$ pwd\n/var/log",
            stepByStep: [
              "Type cd followed by the directory you want to enter",
              "Use cd .. to go up one level (to the parent directory)",
              "Use cd ~ or just cd to go to your home directory",
              "Use cd - to go back to the previous directory",
              "Tab-complete partial paths: cd /va[Tab] completes to cd /var"
            ],
            tryIt: "Run cd /tmp then pwd to confirm you moved",
            commonFlags: []
          },
          {
            command: "mkdir",
            description: "Make Directory — create a new empty folder.",
            syntax: "mkdir [options] <directory>",
            syntaxParts: [
              { label: "command", value: "mkdir", color: "text-cyber-primary" },
              { label: "options", value: "[options]", color: "text-cyber-accent" },
              { label: "dir", value: "<directory>", color: "text-cyber-purple" }
            ],
            example: "$ mkdir -p projects/backend/src\n$ ls projects/backend/\nsrc",
            stepByStep: [
              "Start with mkdir foldername to create a single directory",
              "Use -p to create parent directories automatically (mkdir -p a/b/c creates all three)",
              "Use -v for verbose output to confirm creation",
              "Combine mkdir with cd to create and enter in one flow: mkdir newdir && cd newdir"
            ],
            tryIt: "Run mkdir -p test/devops then ls test/ to verify",
            commonFlags: [
              { flag: "-p", description: "Create parent directories as needed" },
              { flag: "-v", description: "Print a message for each created directory" },
              { flag: "-m", description: "Set permissions mode (e.g., -m 755)" }
            ]
          }
        ]
      },
      {
        id: "linux-files",
        title: "File Operations",
        description: "Create, copy, move, and delete files with precision.",
        commands: [
          {
            command: "touch",
            description: "Create an empty file or update a file's timestamp.",
            syntax: "touch [options] <file>",
            syntaxParts: [
              { label: "command", value: "touch", color: "text-cyber-primary" },
              { label: "options", value: "[options]", color: "text-cyber-accent" },
              { label: "file", value: "<file>", color: "text-cyber-purple" }
            ],
            example: "$ touch config.yml\n$ ls -l config.yml\n-rw-r--r-- 1 user user 0 May 23 10:00 config.yml",
            stepByStep: [
              "Type touch filename to create an empty file",
              "If the file already exists, touch updates its last-modified timestamp",
              "Use touch file1 file2 file3 to create multiple files at once",
              "Great for creating placeholder files before writing content"
            ],
            tryIt: "Run touch newfile.txt then ls to confirm it exists",
            commonFlags: [
              { flag: "-a", description: "Change only the access time" },
              { flag: "-m", description: "Change only the modification time" },
              { flag: "-t", description: "Set a specific timestamp (e.g., -t 202401011200)" }
            ]
          },
          {
            command: "cp",
            description: "Copy — duplicate files or directories from one location to another.",
            syntax: "cp [options] <source> <destination>",
            syntaxParts: [
              { label: "command", value: "cp", color: "text-cyber-primary" },
              { label: "options", value: "[options]", color: "text-cyber-accent" },
              { label: "source", value: "<source>", color: "text-cyber-purple" },
              { label: "dest", value: "<destination>", color: "text-cyber-warning" }
            ],
            example: "$ cp config.yml config.yml.bak\n$ ls *.bak\nconfig.yml.bak",
            stepByStep: [
              "cp source destination copies source to destination",
              "If destination is a directory, the file is copied inside with the same name",
              "Use -r to copy directories recursively (cp -r folder/ backup/)",
              "Use -i for interactive prompt before overwriting",
              "Use -v to see each file as it's copied"
            ],
            tryIt: "Run touch original.txt then cp original.txt copy.txt && ls",
            commonFlags: [
              { flag: "-r", description: "Recursive — copy directories and their contents" },
              { flag: "-i", description: "Interactive — prompt before overwriting" },
              { flag: "-v", description: "Verbose — show each file being copied" },
              { flag: "-u", description: "Update — copy only when source is newer" },
              { flag: "-p", description: "Preserve file attributes (permissions, timestamps)" }
            ]
          },
          {
            command: "mv",
            description: "Move — relocate or rename files and directories.",
            syntax: "mv [options] <source> <destination>",
            syntaxParts: [
              { label: "command", value: "mv", color: "text-cyber-primary" },
              { label: "options", value: "[options]", color: "text-cyber-accent" },
              { label: "source", value: "<source>", color: "text-cyber-purple" },
              { label: "dest", value: "<destination>", color: "text-cyber-warning" }
            ],
            example: "$ mv oldname.txt newname.txt\n$ ls\nnewname.txt",
            stepByStep: [
              "mv oldname newname renames a file (same directory)",
              "mv file.txt /some/dir/ moves the file to another directory",
              "mv file.txt /some/dir/newname.txt moves AND renames",
              "Use -i for confirmation before overwriting",
              "Use -v to see each operation as it happens"
            ],
            tryIt: "Run touch temp.txt && mv temp.txt renamed.txt && ls",
            commonFlags: [
              { flag: "-i", description: "Interactive — prompt before overwriting" },
              { flag: "-v", description: "Verbose — show each file being moved" },
              { flag: "-u", description: "Update — move only when source is newer" },
              { flag: "-n", description: "No overwrite — do not overwrite existing files" }
            ]
          },
          {
            command: "rm",
            description: "Remove — permanently delete files. There is no trash bin in the terminal!",
            syntax: "rm [options] <file>",
            syntaxParts: [
              { label: "command", value: "rm", color: "text-cyber-primary" },
              { label: "options", value: "[options]", color: "text-cyber-accent" },
              { label: "file", value: "<file>", color: "text-cyber-purple" }
            ],
            example: "$ rm oldfile.txt\n$ ls oldfile.txt\nls: cannot access 'oldfile.txt': No such file or directory",
            stepByStep: [
              "rm filename permanently deletes the file (no recycle bin!)",
              "Use rm -r directory to delete a directory and everything inside",
              "Use rm -f to force delete without confirmation prompts",
              "CRITICAL: Always double-check before running rm -rf / (deletes entire system)",
              "Safe practice: use rm -i for interactive confirmation"
            ],
            tryIt: "Run touch deleteme.txt && rm -i deleteme.txt (type y to confirm)",
            commonFlags: [
              { flag: "-r", description: "Recursive — delete directories and their contents" },
              { flag: "-f", description: "Force — ignore nonexistent files, never prompt" },
              { flag: "-i", description: "Interactive — prompt before every removal" },
              { flag: "-v", description: "Verbose — explain what is being done" }
            ]
          }
        ]
      },
      {
        id: "linux-text",
        title: "Text Processing",
        description: "Search, filter, and transform text data like a data engineer.",
        commands: [
          {
            command: "grep",
            description: "Global Regular Expression Print — search for patterns in files or output.",
            syntax: "grep [options] <pattern> [file]",
            syntaxParts: [
              { label: "command", value: "grep", color: "text-cyber-primary" },
              { label: "options", value: "[options]", color: "text-cyber-accent" },
              { label: "pattern", value: "<pattern>", color: "text-cyber-warning" },
              { label: "file", value: "[file]", color: "text-cyber-purple" }
            ],
            example: "$ grep 'ERROR' app.log\n2024-05-23 10:01:05 ERROR: Connection timeout\n2024-05-23 10:03:45 ERROR: Database unreachable",
            stepByStep: [
              "grep 'word' file finds lines containing 'word' in the file",
              "Use grep -i for case-insensitive search (e.g., grep -i 'error' log)",
              "Use grep -r to search recursively through directories",
              "Use grep -v to INVERT the match (show lines NOT matching)",
              "Use grep -c to count matches instead of showing lines",
              "Pipe output into grep: ps aux | grep nginx"
            ],
            tryIt: "Run echo -e 'apple\nbanana\nAPPLE' | grep -i apple to see case-insensitive matching",
            commonFlags: [
              { flag: "-i", description: "Case-insensitive search" },
              { flag: "-r", description: "Recursive search through directories" },
              { flag: "-v", description: "Invert match — show non-matching lines" },
              { flag: "-c", description: "Count matching lines instead of displaying" },
              { flag: "-n", description: "Show line numbers with output" },
              { flag: "-E", description: "Extended regex (egrep) — supports +, ?, |, ()" }
            ]
          },
          {
            command: "sort",
            description: "Sort lines of text alphabetically or numerically.",
            syntax: "sort [options] [file]",
            syntaxParts: [
              { label: "command", value: "sort", color: "text-cyber-primary" },
              { label: "options", value: "[options]", color: "text-cyber-accent" },
              { label: "file", value: "[file]", color: "text-cyber-purple" }
            ],
            example: "$ cat ips.txt\n192.168.1.5\n10.0.0.1\n192.168.1.2\n$ sort -n ips.txt\n10.0.0.1\n192.168.1.2\n192.168.1.5",
            stepByStep: [
              "sort file displays sorted lines (alphabetical by default)",
              "Use sort -n for NUMERIC sorting (10 comes after 2, not after 1)",
              "Use sort -r for REVERSE order",
              "Use sort -u to sort AND remove duplicates",
              "Use sort -k to sort by a specific column/field",
              "Combine with uniq: sort file | uniq to remove adjacent duplicates"
            ],
            tryIt: "Run echo -e '3\n1\n2\n1' | sort -n to see numeric sorted output",
            commonFlags: [
              { flag: "-n", description: "Numeric sort instead of alphabetic" },
              { flag: "-r", description: "Reverse sort order" },
              { flag: "-u", description: "Unique — output only the first of equal lines" },
              { flag: "-k", description: "Sort by a specific column (e.g., -k 2)" },
              { flag: "-t", description: "Field separator (e.g., -t: for /etc/passwd)" }
            ]
          },
          {
            command: "wc",
            description: "Word Count — count lines, words, and characters in a file.",
            syntax: "wc [options] [file]",
            syntaxParts: [
              { label: "command", value: "wc", color: "text-cyber-primary" },
              { label: "options", value: "[options]", color: "text-cyber-accent" },
              { label: "file", value: "[file]", color: "text-cyber-purple" }
            ],
            example: "$ cat data.txt\nhello world\nfoo bar baz\n$ wc data.txt\n2 5 23 data.txt",
            stepByStep: [
              "wc file shows line, word, and character counts",
              "Use wc -l for just the LINE count (most common use)",
              "Use wc -w for just the WORD count",
              "Use wc -c for just the BYTE count",
              "Pipe into wc -l to count output lines: ls | wc -l"
            ],
            tryIt: "Run ls -la | wc -l to count how many files are in the current directory",
            commonFlags: [
              { flag: "-l", description: "Print only the line count" },
              { flag: "-w", description: "Print only the word count" },
              { flag: "-c", description: "Print only the byte count" },
              { flag: "-m", description: "Print only the character count" }
            ]
          },
          {
            command: "cut",
            description: "Remove sections from each line of files — extract columns from structured data.",
            syntax: "cut [options] [file]",
            syntaxParts: [
              { label: "command", value: "cut", color: "text-cyber-primary" },
              { label: "options", value: "[options]", color: "text-cyber-accent" },
              { label: "file", value: "[file]", color: "text-cyber-purple" }
            ],
            example: "$ echo 'John,DevOps,50000' | cut -d',' -f2\nDevOps",
            stepByStep: [
              "cut -d',' -f2 file extracts the 2nd column from a CSV",
              "-d sets the DELIMITER (comma, space, tab, etc.)",
              "-f selects which FIELD(s) to extract (e.g., -f1,3 for columns 1 and 3)",
              "Use cut -c1-5 to extract the first 5 CHARACTERS of each line",
              "Combine with grep and sort in a pipeline: grep 'ERROR' log | cut -d' ' -f1"
            ],
            tryIt: "Run echo 'a,b,c' | cut -d',' -f1,3 to extract first and third columns",
            commonFlags: [
              { flag: "-d", description: "Delimiter (e.g., -d',' for comma, -d' ' for space)" },
              { flag: "-f", description: "Fields to extract (e.g., -f1,3-5)" },
              { flag: "-c", description: "Character positions (e.g., -c1-10)" },
              { flag: "--complement", description: "Invert — select all EXCEPT specified fields" }
            ]
          }
        ]
      },
      {
        id: "linux-permissions",
        title: "Permissions & Ownership",
        description: "Control who can read, write, and execute your files.",
        commands: [
          {
            command: "chmod",
            description: "Change Mode — modify file read/write/execute permissions.",
            syntax: "chmod [options] <mode> <file>",
            syntaxParts: [
              { label: "command", value: "chmod", color: "text-cyber-primary" },
              { label: "options", value: "[options]", color: "text-cyber-accent" },
              { label: "mode", value: "<mode>", color: "text-cyber-warning" },
              { label: "file", value: "<file>", color: "text-cyber-purple" }
            ],
            example: "$ ls -l script.sh\n-rw-r--r-- 1 user user 0 May 23 10:00 script.sh\n$ chmod +x script.sh\n$ ls -l script.sh\n-rwxr-xr-x 1 user user 0 May 23 10:00 script.sh",
            stepByStep: [
              "chmod +x file adds EXECUTE permission (makes a file runnable)",
              "chmod -x file REMOVES execute permission",
              "Numeric mode: chmod 755 file (rwxr-xr-x)",
              "  7=r+w+x (owner), 5=r+x (group), 5=r+x (others)",
              "Symbolic mode: chmod u=rwx,g=rx,o=rx file is the same as 755",
              "Use chmod -R to change permissions RECURSIVELY on directories"
            ],
            tryIt: "Run touch test.sh && chmod +x test.sh && ls -l test.sh to see the x added",
            commonFlags: [
              { flag: "+x", description: "Add execute permission" },
              { flag: "-R", description: "Recursive — apply to directory and all contents" },
              { flag: "755", description: "Common numeric: rwxr-xr-x (owner all, group/others read+execute)" },
              { flag: "644", description: "Common numeric: rw-r--r-- (owner read+write, others read-only)" },
              { flag: "600", description: "Numeric: rw------- (owner only, used for SSH keys)" }
            ]
          },
          {
            command: "chown",
            description: "Change Owner — change which user and group owns a file.",
            syntax: "chown [options] <user>:<group> <file>",
            syntaxParts: [
              { label: "command", value: "chown", color: "text-cyber-primary" },
              { label: "options", value: "[options]", color: "text-cyber-accent" },
              { label: "user:group", value: "<user>:<group>", color: "text-cyber-warning" },
              { label: "file", value: "<file>", color: "text-cyber-purple" }
            ],
            example: "# chown alice:developers app.py\n# ls -l app.py\n-rw-r--r-- 1 alice developers 1024 May 23 10:00 app.py",
            stepByStep: [
              "chown user file changes the file's OWNER to 'user'",
              "chown user:group file changes both owner and group",
              "chown :group file changes ONLY the group (leave user blank)",
              "Use sudo (or run as root) — chown requires superuser privileges",
              "Use -R to recursively change ownership on directories"
            ],
            tryIt: "chown typically requires sudo, so check with: ls -l /tmp",
            commonFlags: [
              { flag: "-R", description: "Recursive — apply to directory and all contents" },
              { flag: "-v", description: "Verbose — show every file processed" },
              { flag: "--reference", description: "Copy ownership from another file" }
            ]
          }
        ]
      },
      {
        id: "linux-processes",
        title: "Process Management",
        description: "Monitor, manage, and terminate running programs.",
        commands: [
          {
            command: "ps",
            description: "Process Status — view currently running processes.",
            syntax: "ps [options]",
            syntaxParts: [
              { label: "command", value: "ps", color: "text-cyber-primary" },
              { label: "options", value: "[options]", color: "text-cyber-accent" }
            ],
            example: "$ ps aux | head -3\nUSER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\nroot         1  0.0  0.5 102456  5432 ?        Ss   10:00   0:05 /sbin/init\nuser      1234  0.1  2.0 204890 20456 ?        S    10:01   0:02 nginx: worker",
            stepByStep: [
              "ps aux shows ALL processes from ALL users with detailed info",
              "Columns: USER PID %CPU %MEM VSZ RSS TTY STAT START TIME COMMAND",
              "ps -ef shows a different format with PPID (Parent PID)",
              "ps aux --forest shows a process TREE (parent-child hierarchy)",
              "Pipe to grep to find a specific process: ps aux | grep nginx",
              "Use top or htop for real-time monitoring"
            ],
            tryIt: "Run ps aux | grep $$ to find your current shell process",
            commonFlags: [
              { flag: "aux", description: "All processes, user format, extended (most common)" },
              { flag: "-ef", description: "All processes, full format (alternative syntax)" },
              { flag: "-u", description: "Processes for a specific user (ps -u username)" },
              { flag: "--forest", description: "ASCII art process tree" },
              { flag: "-o", description: "Custom output format (ps -o pid,cmd,%cpu)" }
            ]
          },
          {
            command: "kill",
            description: "Send a signal to a process — most commonly to terminate it.",
            syntax: "kill [options] <PID>",
            syntaxParts: [
              { label: "command", value: "kill", color: "text-cyber-primary" },
              { label: "options", value: "[options]", color: "text-cyber-accent" },
              { label: "PID", value: "<PID>", color: "text-cyber-purple" }
            ],
            example: "$ ps aux | grep bad_process\nuser      5678  99.0  2.0 102456 20456 ?        R    10:05   5:00 bad_process\n$ kill -9 5678\n$ echo $?\n0",
            stepByStep: [
              "kill PID sends SIGTERM (signal 15) — asks process to terminate gracefully",
              "kill -9 PID sends SIGKILL — force-kills immediately (process can't ignore)",
              "kill -15 PID sends SIGTERM — default if no signal specified",
              "kill -2 PID sends SIGINT — same as Ctrl+C",
              "Use killall processname to kill by NAME (e.g., killall nginx)",
              "Find PIDs first with ps, pgrep, or pidof"
            ],
            tryIt: "Run kill -l to list all available signals",
            commonFlags: [
              { flag: "-9", description: "SIGKILL — force kill (process can't ignore)" },
              { flag: "-15", description: "SIGTERM — graceful termination (default)" },
              { flag: "-2", description: "SIGINT — interrupt (same as Ctrl+C)" },
              { flag: "-1", description: "SIGHUP — reload configuration (e.g., kill -1 nginx)" },
              { flag: "-l", description: "List all signal names" }
            ]
          }
        ]
      },
      {
        id: "linux-networking",
        title: "Networking",
        description: "Inspect network connections, test reachability, and fetch remote data.",
        commands: [
          {
            command: "ss",
            description: "Socket Statistics — investigate network sockets (modern replacement for netstat).",
            syntax: "ss [options]",
            syntaxParts: [
              { label: "command", value: "ss", color: "text-cyber-primary" },
              { label: "options", value: "[options]", color: "text-cyber-accent" }
            ],
            example: "$ ss -tlnp\nState   Recv-Q  Send-Q  Local Address:Port   Peer Address:Port  Process\nLISTEN  0       128     0.0.0.0:80           0.0.0.0:*         users:((nginx))\nLISTEN  0       128     0.0.0.0:22           0.0.0.0:*         users:((sshd))",
            stepByStep: [
              "ss -tlnp shows TCP sockets that are LISTENING with process info",
              "Add '-u' for UDP: ss -tulnp shows both TCP and UDP",
              "Use ss -s for a SUMMARY of socket statistics",
              "Use ss -t -o to show TCP sockets with timer info",
              "Use ss state established to show only established connections"
            ],
            tryIt: "Run ss -tlnp to see which services are listening on your machine",
            commonFlags: [
              { flag: "-t", description: "TCP sockets only" },
              { flag: "-u", description: "UDP sockets only" },
              { flag: "-l", description: "Show only LISTENING sockets" },
              { flag: "-n", description: "Numeric output (don't resolve hostnames)" },
              { flag: "-p", description: "Show process using the socket" }
            ]
          },
          {
            command: "curl",
            description: "Client URL — transfer data from or to a server (HTTP, FTP, and more).",
            syntax: "curl [options] <URL>",
            syntaxParts: [
              { label: "command", value: "curl", color: "text-cyber-primary" },
              { label: "options", value: "[options]", color: "text-cyber-accent" },
              { label: "URL", value: "<URL>", color: "text-cyber-purple" }
            ],
            example: "$ curl -s https://api.example.com/health | head -3\n{\"status\": \"ok\",\n  \"uptime\": 123456,\n  \"version\": \"2.1.0\"",
            stepByStep: [
              "curl URL fetches the content and prints it to stdout",
              "Use curl -s for SILENT mode (no progress bars or errors)",
              "Use curl -o file to save output to a FILE instead of stdout",
              "Use curl -I to fetch only the HTTP HEADERS",
              "Use curl -X POST -d 'data' URL to send POST requests",
              "Use curl -H 'Authorization: Bearer TOKEN' for API authentication"
            ],
            tryIt: "Run curl -s https://httpbin.org/ip to see your public IP",
            commonFlags: [
              { flag: "-s", description: "Silent mode — no progress output" },
              { flag: "-o", description: "Write output to file instead of stdout" },
              { flag: "-I", description: "Fetch headers only (HEAD request)" },
              { flag: "-L", description: "Follow redirects" },
              { flag: "-X", description: "HTTP method (GET, POST, PUT, DELETE)" },
              { flag: "-H", description: "Set a request header" },
              { flag: "-d", description: "Send data in POST/PUT request body" }
            ]
          }
        ]
      },
      {
        id: "linux-system",
        title: "System Information",
        description: "Check disk usage, memory, system uptime, and hardware info.",
        commands: [
          {
            command: "df",
            description: "Disk Free — report filesystem disk space usage.",
            syntax: "df [options] [mount_point]",
            syntaxParts: [
              { label: "command", value: "df", color: "text-cyber-primary" },
              { label: "options", value: "[options]", color: "text-cyber-accent" },
              { label: "mount", value: "[mount_point]", color: "text-cyber-purple" }
            ],
            example: "$ df -h\nFilesystem      Size  Used Avail Use% Mounted on\n/dev/sda1       100G   85G   15G  85% /",
            stepByStep: [
              "df -h shows ALL mount points with human-readable sizes",
              "df -h / shows only the root filesystem",
              "Use df -i to check INODE usage (can run out of inodes even with free space)",
              "Use df -T to show filesystem TYPE (ext4, xfs, tmpfs, etc.)"
            ],
            tryIt: "Run df -h / to see how full your root partition is",
            commonFlags: [
              { flag: "-h", description: "Human-readable sizes (K, M, G)" },
              { flag: "-i", description: "Show inode usage instead of block usage" },
              { flag: "-T", description: "Show filesystem type" },
              { flag: "--total", description: "Show grand total line" }
            ]
          },
          {
            command: "du",
            description: "Disk Usage — estimate file and directory space usage.",
            syntax: "du [options] [path]",
            syntaxParts: [
              { label: "command", value: "du", color: "text-cyber-primary" },
              { label: "options", value: "[options]", color: "text-cyber-accent" },
              { label: "path", value: "[path]", color: "text-cyber-purple" }
            ],
            example: "$ du -sh /var/log\n2.5G    /var/log",
            stepByStep: [
              "du -sh /path shows the TOTAL size of a directory (summary)",
              "du -h /path shows sizes of EACH subdirectory (recursive)",
              "du -sh * | sort -rh shows largest items in the current directory",
              "Use --exclude to skip certain files/directories",
              "Combine with sort to find space hogs: du -sh /* | sort -rh | head -5"
            ],
            tryIt: "Run du -sh ~ to check your home directory size",
            commonFlags: [
              { flag: "-s", description: "Summary — show only total for each argument" },
              { flag: "-h", description: "Human-readable sizes" },
              { flag: "-d", description: "Max depth (e.g., -d 1 limits to one level)" },
              { flag: "--exclude", description: "Exclude files matching a pattern" },
              { flag: "-c", description: "Produce a grand total" }
            ]
          }
        ]
      },
      {
        id: "linux-archives",
        title: "Archives & Compression",
        description: "Package files into archives and compress them for storage or transfer.",
        commands: [
          {
            command: "tar",
            description: "Tape Archive — create and extract archive files (the standard Linux archiver).",
            syntax: "tar [options] <archive> [files]",
            syntaxParts: [
              { label: "command", value: "tar", color: "text-cyber-primary" },
              { label: "options", value: "[options]", color: "text-cyber-accent" },
              { label: "archive", value: "<archive>", color: "text-cyber-purple" },
              { label: "files", value: "[files]", color: "text-cyber-warning" }
            ],
            example: "$ tar -czvf backup.tar.gz /home/user/data\n/home/user/data/\n/home/user/data/file1.txt\n/home/user/data/file2.txt",
            stepByStep: [
              "tar -czvf archive.tar.gz dir/ — CREATE a compressed archive",
              "  c = create, z = gzip, v = verbose, f = filename",
              "tar -xzvf archive.tar.gz — EXTRACT an archive",
              "  x = extract, z = gzip, v = verbose, f = filename",
              "tar -tzvf archive.tar.gz — LIST contents without extracting",
              "  t = list contents",
              "For .tar.bz2 files, use -j instead of -z (bzip2 compression)"
            ],
            tryIt: "Run tar -czf test.tar.gz . && tar -tzf test.tar.gz to create and list an archive",
            commonFlags: [
              { flag: "-c", description: "Create a new archive" },
              { flag: "-x", description: "Extract from an archive" },
              { flag: "-t", description: "List archive contents" },
              { flag: "-z", description: "Compress with gzip (.tar.gz)" },
              { flag: "-j", description: "Compress with bzip2 (.tar.bz2)" },
              { flag: "-v", description: "Verbose — list files being processed" },
              { flag: "-f", description: "Specify the archive filename" }
            ]
          }
        ]
      },
      {
        id: "linux-jobs",
        title: "Job Control",
        description: "Run tasks in the background, bring them forward, and manage multiple jobs.",
        commands: [
          {
            command: "&",
            description: "Run a command in the background, freeing the terminal for other tasks.",
            syntax: "<command> &",
            syntaxParts: [
              { label: "command", value: "<command>", color: "text-cyber-purple" },
              { label: "background", value: "&", color: "text-cyber-primary" }
            ],
            example: "$ sleep 30 &\n[1] 12345\n$ jobs\n[1]+  Running                 sleep 30 &",
            stepByStep: [
              "Append & to any command to run it in the BACKGROUND",
              "The shell shows [job#] PID immediately",
              "Use jobs to list all background jobs for the current terminal",
              "Use fg %1 to bring job #1 to the FOREGROUND",
              "Use bg %1 to resume a stopped job in the BACKGROUND",
              "Use Ctrl+Z to SUSPEND (pause) the current foreground job"
            ],
            tryIt: "Run sleep 10 & then jobs to see the background job",
            commonFlags: []
          },
          {
            command: "nohup",
            description: "No Hang Up — run a command that survives terminal closure.",
            syntax: "nohup <command> &",
            syntaxParts: [
              { label: "command", value: "nohup", color: "text-cyber-primary" },
              { label: "cmd", value: "<command>", color: "text-cyber-purple" },
              { label: "bg", value: "&", color: "text-cyber-accent" }
            ],
            example: "$ nohup long_running_task.sh &\nnohup: ignoring input and appending output to 'nohup.out'",
            stepByStep: [
              "nohup command & runs a command immune to SIGHUP",
              "Output is saved to nohup.out in the current directory",
              "Use nohup command > mylog.log 2>&1 & to redirect output to a custom log",
              "Essential for remote SSH sessions — keeps running even if you disconnect"
            ],
            tryIt: "Run nohup sleep 30 & to see how nohup captures output",
            commonFlags: []
          }
        ]
      },
      {
    id: "linux-systemd",
    title: "System & Service Management",
    description: "Manage services, check system resources, and inspect logs — every sysadmin's daily toolkit.",
    commands: [
      {
        command: "systemctl",
        description: "Control the systemd system and service manager — the standard for managing services on modern Linux distros.",
        syntax: "systemctl <action> [service]",
        syntaxParts: [
          { label: "command", value: "systemctl", color: "text-cyber-primary" },
          { label: "action", value: "<action>", color: "text-cyber-accent" },
          { label: "service", value: "[service]", color: "text-cyber-purple" }
        ],
        example: "$ systemctl status nginx\n● nginx.service - A high performance web server and a reverse proxy server\n   Loaded: loaded (/usr/lib/systemd/system/nginx.service; enabled; vendor preset: disabled)\n   Active: active (running) since Mon 2026-05-25 08:30:15 UTC\n   Main PID: 1234 (nginx)\n   Tasks: 2 (limit: 2345)\n   Memory: 15.2M\n   CGroup: /system.slice/nginx.service\n           ├─1234 nginx: master process /usr/sbin/nginx\n           └─1235 nginx: worker process",
        stepByStep: [
          "systemctl status <service> — check if a service is running, enabled, and see recent log entries",
          "systemctl start <service> — start a service immediately",
          "systemctl stop <service> — stop a service immediately",
          "systemctl restart <service> — stop then start (picks up config changes)",
          "systemctl reload <service> — reload config without stopping (if supported)",
          "systemctl enable <service> — configure service to start on boot",
          "systemctl disable <service> — remove auto-start on boot",
          "systemctl daemon-reload — reload systemd unit files after editing them",
          "systemctl list-units --type=service --state=running — show all running services",
          "systemctl is-active <service> — quick check, returns 'active' or 'inactive'"
        ],
        tryIt: "Run systemctl status to see the status of the system (no args shows system status)",
        commonFlags: [
          { flag: "start", description: "Start a service immediately" },
          { flag: "stop", description: "Stop a service immediately" },
          { flag: "restart", description: "Restart a service (stop + start)" },
          { flag: "reload", description: "Reload configuration without stopping" },
          { flag: "enable", description: "Enable service to start at boot" },
          { flag: "disable", description: "Disable service from starting at boot" },
          { flag: "status", description: "Show service status, logs, and process info" },
          { flag: "daemon-reload", description: "Reload systemd manager configuration" },
          { flag: "list-units", description: "List loaded units, filtered by type/state" }
        ]
      },
      {
        command: "journalctl",
        description: "Query the systemd journal — the central logging system for all services and the kernel.",
        syntax: "journalctl [options] [matches]",
        syntaxParts: [
          { label: "command", value: "journalctl", color: "text-cyber-primary" },
          { label: "options", value: "[options]", color: "text-cyber-accent" },
          { label: "matches", value: "[matches]", color: "text-cyber-purple" }
        ],
        example: "$ journalctl -u nginx --since '5 min ago' --no-pager\nMay 25 08:30:15 web-01 nginx[1234]: Starting nginx...\nMay 25 08:30:15 web-01 nginx[1234]: nginx started successfully",
        stepByStep: [
          "journalctl — show all logs from oldest to newest (opens in pager by default)",
          "journalctl -u <service> — show logs for a specific systemd unit",
          "journalctl -f — follow logs in real-time (like tail -f)",
          "journalctl --since '1 hour ago' — filter logs by time",
          "journalctl --until yesterday — filter logs until a specific time",
          "journalctl -p err — filter by priority: emerg, alert, crit, err, warning, notice, info, debug",
          "journalctl -k — show only kernel messages",
          "journalctl --no-pager — output without pager (useful for scripting)",
          "journalctl --disk-usage — check how much space logs are using",
          "journalctl --vacuum-time=7d — delete logs older than 7 days"
        ],
        tryIt: "Run journalctl -n 10 to see the last 10 log entries",
        commonFlags: [
          { flag: "-u", description: "Filter by systemd unit (e.g., -u nginx)" },
          { flag: "-f", description: "Follow new log entries in real-time" },
          { flag: "--since", description: "Show entries since a specific time" },
          { flag: "--until", description: "Show entries until a specific time" },
          { flag: "-p", description: "Filter by priority (emerg, alert, crit, err, warning, notice, info, debug)" },
          { flag: "-k", description: "Show only kernel messages (same as dmesg)" },
          { flag: "-n", description: "Show the last N entries" },
          { flag: "--no-pager", description: "Output without pager for scripting" },
          { flag: "--vacuum-time", description: "Delete logs older than specified duration" }
        ]
      },
      {
        command: "free",
        description: "Display system memory usage — RAM and swap, used/free/available, in human-readable form.",
        syntax: "free [options]",
        syntaxParts: [
          { label: "command", value: "free", color: "text-cyber-primary" },
          { label: "options", value: "[options]", color: "text-cyber-accent" }
        ],
        example: "$ free -h\n              total        used        free      shared  buff/cache   available\nMem:           31Gi        19Gi       2.5Gi       1.2Gi       8.9Gi        10Gi\nSwap:         8.0Gi       1.2Gi       6.8Gi",
        stepByStep: [
          "free — show memory in kibibytes (default)",
          "free -h — human-readable output (GiB, MiB)",
          "free -m — output in mebibytes",
          "The 'available' column is the most useful — it estimates how much memory is available for new processes",
          "High 'buff/cache' is normal on Linux — the kernel uses free RAM for caching",
          "Watch for swap usage > 0 on a production server — it often indicates memory pressure",
          "Combine with watch: watch -n 5 free -h to monitor in real-time"
        ],
        tryIt: "Run free -h to see your system memory in human-readable format",
        commonFlags: [
          { flag: "-h", description: "Human-readable output (GiB, MiB)" },
          { flag: "-m", description: "Output in mebibytes" },
          { flag: "-g", description: "Output in gibibytes" },
          { flag: "-s", description: "Repeat every N seconds (like watch)" },
          { flag: "-t", description: "Show total line (sum of RAM + swap)" }
        ]
      },
      {
        command: "uptime",
        description: "Show how long the system has been running, load average, and number of logged-in users.",
        syntax: "uptime [options]",
        syntaxParts: [
          { label: "command", value: "uptime", color: "text-cyber-primary" },
          { label: "options", value: "[options]", color: "text-cyber-accent" }
        ],
        example: "$ uptime\n 10:15:30 up 34 days,  2:45,  3 users,  load average: 0.08, 0.03, 0.01",
        stepByStep: [
          "uptime — one-line summary of system runtime and load",
          "The load average shows 1, 5, and 15-minute averages of processes waiting to run",
          "Load < number of CPU cores = system is healthy (e.g., load < 4 on a 4-core machine)",
          "Load >> number of CPU cores = system is overloaded or a process is stuck",
          "High load with low CPU usage often means I/O wait (disk or network bottleneck)",
          "Check with lscpu or nproc to see how many cores your machine has"
        ],
        tryIt: "Run uptime to check your system's uptime and load average",
        commonFlags: [
          { flag: "-p", description: "Pretty-print uptime in human-readable form" },
          { flag: "-s", description: "Show the timestamp when the system was started" }
        ]
      }
    ]
      },
      {
    id: "linux-users",
    title: "User & Access Control",
    description: "Create and manage users, control privileges, and audit who's on the system.",
    commands: [
      {
        command: "sudo",
        description: "Superuser Do — execute a command as another user (typically root). The gatekeeper of system administration.",
        syntax: "sudo [options] <command>",
        syntaxParts: [
          { label: "command", value: "sudo", color: "text-cyber-primary" },
          { label: "options", value: "[options]", color: "text-cyber-accent" },
          { label: "cmd", value: "<command>", color: "text-cyber-purple" }
        ],
        example: "$ sudo systemctl restart nginx\n[sudo] password for user:\n$ sudo -l\nMatching Defaults entries for user on host:\n    !visiblepw, always_set_home, env_reset\nUser user may run the following commands on host:\n    (ALL) ALL",
        stepByStep: [
          "sudo <command> — run a command as root (prompts for YOUR password, not root's)",
          "sudo -u alice <command> — run a command as a specific user (not root)",
          "sudo -l — list what commands you're allowed to run (sudoers policy)",
          "sudo -k — invalidate cached credentials (forces password prompt next time)",
          "sudo -i — start an interactive root shell (use with caution!)",
          "sudo -s — start a shell with root privileges (keeps your environment)",
          "NEVER run 'sudo' on untrusted commands or scripts",
          "Always use the principle of least privilege — only sudo what you need"
        ],
        tryIt: "Run sudo -l to check what sudo permissions you have",
        commonFlags: [
          { flag: "-u", description: "Run as a specific user (not root)" },
          { flag: "-l", description: "List allowed commands for the current user" },
          { flag: "-k", description: "Invalidate cached credentials (force re-auth)" },
          { flag: "-i", description: "Start an interactive login shell as root" },
          { flag: "-s", description: "Start a shell as root (preserves environment)" },
          { flag: "-E", description: "Preserve environment variables when running command" },
          { flag: "-H", description: "Set HOME environment to target user's home" }
        ]
      },
      {
        command: "useradd",
        description: "Create a new user account with home directory, shell, and group membership.",
        syntax: "useradd [options] <username>",
        syntaxParts: [
          { label: "command", value: "useradd", color: "text-cyber-primary" },
          { label: "options", value: "[options]", color: "text-cyber-accent" },
          { label: "username", value: "<username>", color: "text-cyber-purple" }
        ],
        example: "# useradd -m -s /bin/bash -G docker,sudo -c 'Alice DevOps' alice\n# ls -la /home/alice/\ndrwxr-xr-x  2 alice alice 4096 May 25 10:00 .\n# id alice\nuid=1001(alice) gid=1001(alice) groups=1001(alice),27(sudo),993(docker)",
        stepByStep: [
          "useradd alice — create a basic user (no home dir, default shell)",
          "useradd -m alice — create user WITH a home directory (/home/alice)",
          "useradd -m -s /bin/bash alice — set the login shell to bash",
          "useradd -m -G docker,sudo alice — add user to supplemental groups",
          "useradd -c 'Full Name' alice — add a comment (full name) field",
          "After creating a user, immediately set a password: passwd alice",
          "User IDs (UIDs) are auto-assigned starting at 1000 (system users < 1000)",
          "User config is stored in /etc/passwd, passwords in /etc/shadow",
          "Use usermod to modify an existing user (e.g., usermod -aG docker alice)"
        ],
        tryIt: "Run id to see your own user identity",
        commonFlags: [
          { flag: "-m", description: "Create the user's home directory" },
          { flag: "-s", description: "Login shell (e.g., -s /bin/bash)" },
          { flag: "-G", description: "Supplemental groups (e.g., -G sudo,docker)" },
          { flag: "-c", description: "Comment field (usually full name)" },
          { flag: "-d", description: "Custom home directory path" },
          { flag: "-e", description: "Account expiry date (YYYY-MM-DD)" },
          { flag: "-u", description: "Specify a custom UID" },
          { flag: "-r", description: "Create a system account (UID < 1000)" }
        ]
      },
      {
        command: "passwd",
        description: "Change user passwords — set, expire, or lock passwords for any user (with sudo).",
        syntax: "passwd [options] [username]",
        syntaxParts: [
          { label: "command", value: "passwd", color: "text-cyber-primary" },
          { label: "options", value: "[options]", color: "text-cyber-accent" },
          { label: "username", value: "[username]", color: "text-cyber-purple" }
        ],
        example: "$ passwd\nCurrent password: \nNew password: \nRetype new password: \npasswd: password updated successfully\n\n# sudo passwd alice\nNew password: \nRetype new password: \npasswd: password updated successfully",
        stepByStep: [
          "passwd — change YOUR password (you must know the current one)",
          "sudo passwd alice — change another user's password (need sudo)",
          "sudo passwd -l alice — lock a user's account (prevents login)",
          "sudo passwd -u alice — unlock a locked account",
          "sudo passwd -e alice — expire a password (user must change on next login)",
          "sudo passwd -S alice — show password status (locked, hashed, etc.)",
          "Strong passwords: 12+ chars, mix of cases, numbers, and symbols",
          "In production, use SSH keys instead of passwords for service accounts"
        ],
        tryIt: "Run passwd -S to check your own password status",
        commonFlags: [
          { flag: "-l", description: "Lock the account (disable login)" },
          { flag: "-u", description: "Unlock the account" },
          { flag: "-e", description: "Expire password (force change on next login)" },
          { flag: "-S", description: "Show password status" },
          { flag: "-d", description: "Delete the password (no password login)" },
          { flag: "-x", description: "Maximum days between password changes" },
          { flag: "-w", description: "Warning days before password expires" }
        ]
      },
      {
        command: "id",
        description: "Display user identity — UID, GID, and all group memberships of a user.",
        syntax: "id [options] [username]",
        syntaxParts: [
          { label: "command", value: "id", color: "text-cyber-primary" },
          { label: "options", value: "[options]", color: "text-cyber-accent" },
          { label: "username", value: "[username]", color: "text-cyber-purple" }
        ],
        example: "$ id\nuid=1000(user) gid=1000(user) groups=1000(user),27(sudo),44(video),993(docker)\n\n$ id root\nuid=0(root) gid=0(root) groups=0(root)",
        stepByStep: [
          "id — show your own UID, GID, and group memberships",
          "id alice — show info for another user",
          "id -u — show only the numeric UID",
          "id -g — show only the numeric primary GID",
          "id -G — show all numeric group IDs (supplemental groups)",
          "id -n — show names instead of numbers (combine: id -nG shows group NAMES)",
          "UID 0 = root (superuser). Regular users get UIDs >= 1000",
          "Use groups <user> as a simpler alternative to show group memberships"
        ],
        tryIt: "Run id to see your current user identity and group memberships",
        commonFlags: [
          { flag: "-u", description: "Show only the numeric UID" },
          { flag: "-g", description: "Show only the numeric primary GID" },
          { flag: "-G", description: "Show all numeric group IDs" },
          { flag: "-n", description: "Display names instead of numbers" },
          { flag: "-r", description: "Show real ID instead of effective ID" }
        ]
      },
      {
        command: "who",
        description: "Show who is logged in — displays user sessions, terminals, login times, and originating IPs.",
        syntax: "who [options]",
        syntaxParts: [
          { label: "command", value: "who", color: "text-cyber-primary" },
          { label: "options", value: "[options]", color: "text-cyber-accent" }
        ],
        example: "$ who\nuser     pts/0        2026-05-25 08:30 (192.168.1.50)\nalice    pts/1        2026-05-25 09:15 (10.0.0.15)\nbob      pts/2        2026-05-25 09:45 (10.0.0.20)",
        stepByStep: [
          "who — list currently logged-in users, terminals, login times, and remote IPs",
          "who -a — show all available information (dead processes, run-level, etc.)",
          "who -b — show the time of the last system boot",
          "who -r — show the current runlevel",
          "w — more detailed version of who (shows what each user is doing)",
          "last — show login history (reads /var/log/wtmp)",
          "lastb — show failed login attempts (reads /var/log/btmp)",
          "In incident response, always check who is currently on the system"
        ],
        tryIt: "Run who to see which user sessions are currently active",
        commonFlags: [
          { flag: "-a", description: "Show all information (dead processes, runlevel, etc.)" },
          { flag: "-b", description: "Show time of last system boot" },
          { flag: "-r", description: "Show current runlevel" },
          { flag: "-q", description: "Show only usernames and count (quick)" },
          { flag: "-H", description: "Print column headers" }
        ]
      }
    ]
      },
      {
    id: "linux-remote",
    title: "Remote Access & File Transfer",
    description: "Connect to remote servers, transfer files securely, and test network connectivity — essential for managing infrastructure.",
    commands: [
      {
        command: "ssh",
        description: "Secure Shell — connect to a remote machine securely over an encrypted network connection.",
        syntax: "ssh [options] <user>@<host>",
        syntaxParts: [
          { label: "command", value: "ssh", color: "text-cyber-primary" },
          { label: "options", value: "[options]", color: "text-cyber-accent" },
          { label: "user@host", value: "<user>@<host>", color: "text-cyber-purple" }
        ],
        example: "$ ssh alice@web01.example.com\nThe authenticity of host 'web01 (10.0.0.5)' can't be established.\nECDSA key fingerprint is SHA256:abc123...\nAre you sure you want to continue connecting? yes\nWarning: Permanently added 'web01' (ECDSA) to the list of known hosts.\nalice@web01:~$",
        stepByStep: [
          "ssh user@host — connect with password authentication",
          "ssh -i ~/.ssh/deploy_key user@host — connect with an SSH private key",
          "ssh -p 2222 user@host — connect on a non-standard port (default is 22)",
          "ssh -J bastion@jumpbox.com user@target — jump through a bastion host",
          "ssh -v user@host — verbose mode (debug connection issues)",
          "On first connection, verify the host key fingerprint before accepting",
          "For automation: use key-based auth (ssh-keygen + ssh-copy-id)",
          "Key files should have 600 permissions: chmod 600 ~/.ssh/id_rsa",
          "Use ~/.ssh/config to store host aliases, keys, and ports"
        ],
        tryIt: "Run ssh -V to check your SSH client version",
        commonFlags: [
          { flag: "-i", description: "Identity file (private key path)" },
          { flag: "-p", description: "Port number (default: 22)" },
          { flag: "-J", description: "Jump host (bastion) connection" },
          { flag: "-v", description: "Verbose mode (add -vv for more detail)" },
          { flag: "-N", description: "Don't execute remote command (port forwarding only)" },
          { flag: "-L", description: "Local port forwarding (ssh -L 8080:localhost:80 host)" },
          { flag: "-R", description: "Remote port forwarding" },
          { flag: "-o", description: "Set an SSH option (e.g., -o StrictHostKeyChecking=no)" }
        ]
      },
      {
        command: "scp",
        description: "Secure Copy — copy files between local and remote machines over SSH with full encryption.",
        syntax: "scp [options] <source> <destination>",
        syntaxParts: [
          { label: "command", value: "scp", color: "text-cyber-primary" },
          { label: "options", value: "[options]", color: "text-cyber-accent" },
          { label: "source", value: "<source>", color: "text-cyber-purple" },
          { label: "dest", value: "<destination>", color: "text-cyber-warning" }
        ],
        example: "$ scp -i ~/.ssh/deploy_key deploy.tar.gz user@web01:/var/www/\ndeploy.tar.gz               100%   12MB  5.2MB/s   00:02\n\n$ scp -r user@web01:/var/log/app/ ./logs/\napp.log                     100%   45KB   1.2MB/s   00:00\nerror.log                   100%   12KB 856KB/s   00:00",
        stepByStep: [
          "scp file user@host:/remote/path — copy file TO a remote server",
          "scp user@host:/remote/path/file ./ — copy file FROM a remote server",
          "scp -r dir/ user@host:/remote/ — copy directories recursively",
          "scp -P 2222 file user@host: — use non-standard port (CAPITAL -P!)",
          "scp -i ~/.ssh/key file user@host: — use a specific SSH key",
          "scp -C file user@host: — enable compression for faster transfers",
          "scp -3 user1@host1:file user2@host2: — copy between two remotes via local",
          "rsync is better for large or repeated transfers (resume, delta, permissions)"
        ],
        tryIt: "Run scp --help or man scp to see all available options",
        commonFlags: [
          { flag: "-r", description: "Recursive copy (directories)" },
          { flag: "-P", description: "Port number (CAPITAL P — different from ssh!)" },
          { flag: "-i", description: "Identity file (SSH private key)" },
          { flag: "-C", description: "Enable compression" },
          { flag: "-p", description: "Preserve file modification times and permissions" },
          { flag: "-v", description: "Verbose mode for debugging" },
          { flag: "-3", description: "Copy between two remote hosts via local machine" },
          { flag: "-q", description: "Quiet mode (suppresses progress meter)" }
        ]
      },
      {
        command: "wget",
        description: "Web Get — download files from the internet via HTTP, HTTPS, or FTP. Handles retries, resumes, and recursion.",
        syntax: "wget [options] <URL>",
        syntaxParts: [
          { label: "command", value: "wget", color: "text-cyber-primary" },
          { label: "options", value: "[options]", color: "text-cyber-accent" },
          { label: "URL", value: "<URL>", color: "text-cyber-purple" }
        ],
        example: "$ wget -q -O backup.sql.gz https://storage.example.com/db-backup-2026-05-25.sql.gz\n\n$ wget -c https://releases.example.com/app-v2.0.tar.gz\n--2026-05-25 10:00:00--  https://releases.example.com/app-v2.0.tar.gz\nResolving releases.example.com... 10.0.0.100\nConnecting to releases.example.com:443... connected.\nHTTP request sent, awaiting response... 200 OK\nLength: 52428800 (50M) [application/gzip]\nSaving to: 'app-v2.0.tar.gz'\n 35% [==============>                     ] 18.5M  2.5MB/s    eta 13s",
        stepByStep: [
          "wget URL — download a file to the current directory with original filename",
          "wget -O filename URL — save with a custom filename",
          "wget -q URL — quiet mode (no progress bars or output, useful in scripts)",
          "wget -c URL — CONTINUE a partial download (resume capability)",
          "wget -P /target/dir URL — save files to a specific directory",
          "wget --limit-rate=1m URL — limit download speed to 1 MB/s",
          "wget --mirror -p --convert-links URL — mirror an entire website",
          "wget --retry-connrefused URL — retry even if connection is refused",
          "wget -i urls.txt — download all URLs listed in a file",
          "curl is preferred over wget for APIs; wget is better for recursive/mirror downloads"
        ],
        tryIt: "Run wget --version to verify wget is installed and see capabilities",
        commonFlags: [
          { flag: "-O", description: "Write to a specific file (custom filename)" },
          { flag: "-q", description: "Quiet mode — suppress output" },
          { flag: "-c", description: "Continue/resume a partial download" },
          { flag: "-P", description: "Save files to a specific directory prefix" },
          { flag: "--limit-rate", description: "Limit download speed (e.g., --limit-rate=1m)" },
          { flag: "--retry-connrefused", description: "Retry even on connection refused" },
          { flag: "-i", description: "Read URLs from a file" },
          { flag: "--mirror", description: "Mirror an entire website (recursive)" },
          { flag: "-nH", description: "No host-prefixed directories (with --mirror)" }
        ]
      },
      {
        command: "ping",
        description: "Send ICMP echo requests to test network connectivity and measure round-trip latency to a host.",
        syntax: "ping [options] <host>",
        syntaxParts: [
          { label: "command", value: "ping", color: "text-cyber-primary" },
          { label: "options", value: "[options]", color: "text-cyber-accent" },
          { label: "host", value: "<host>", color: "text-cyber-purple" }
        ],
        example: "$ ping -c 4 8.8.8.8\nPING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.\n64 bytes from 8.8.8.8: icmp_seq=1 ttl=118 time=12.3 ms\n64 bytes from 8.8.8.8: icmp_seq=2 ttl=118 time=11.8 ms\n64 bytes from 8.8.8.8: icmp_seq=3 ttl=118 time=13.1 ms\n64 bytes from 8.8.8.8: icmp_seq=4 ttl=118 time=11.5 ms\n\n--- 8.8.8.8 ping statistics ---\n4 packets transmitted, 4 received, 0% packet loss, time 3004ms\nrtt min/avg/max/mdev = 11.526/12.175/13.100/0.597 ms",
        stepByStep: [
          "ping google.com — ping indefinitely until Ctrl+C",
          "ping -c 4 host — send exactly 4 packets, then stop",
          "ping -i 2 host — send one packet every 2 seconds (default is 1)",
          "ping -W 5 host — timeout after 5 seconds if no response",
          "ping -4 host — force IPv4 (some hosts have both A and AAAA records)",
          "ping -6 host — force IPv6",
          "High latency (>100ms) suggests geographic distance or network congestion",
          "Packet loss > 0% indicates network issues (bad cable, congestion, firewall)",
          "ping localhost (127.0.0.1) tests your own machine's TCP/IP stack"
        ],
        tryIt: "Run ping -c 1 localhost to test your local network stack",
        commonFlags: [
          { flag: "-c", description: "Stop after sending N packets" },
          { flag: "-i", description: "Interval between packets in seconds (default: 1)" },
          { flag: "-W", description: "Timeout in seconds before considering host dead" },
          { flag: "-4", description: "Force IPv4" },
          { flag: "-6", description: "Force IPv6" },
          { flag: "-s", description: "Packet size in bytes (default: 56)" },
          { flag: "-q", description: "Quiet mode (show only summary)" },
          { flag: "-D", description: "Print timestamps before each output line" }
        ]
      }
    ]
      },
      {
    id: "linux-monitoring",
    title: "Monitoring & Troubleshooting",
    description: "Monitor system performance, inspect running processes, identify file access patterns, and debug kernel issues.",
    commands: [
      {
        command: "top",
        description: "Table of Processes — real-time, interactive view of running processes, CPU/memory usage, and system load.",
        syntax: "top [options]",
        syntaxParts: [
          { label: "command", value: "top", color: "text-cyber-primary" },
          { label: "options", value: "[options]", color: "text-cyber-accent" }
        ],
        example: "top - 10:15:30 up 34 days,  2:45,  3 users,  load average: 0.08, 0.03, 0.01\nTasks: 123 total,   1 running, 122 sleeping,   0 stopped,   0 zombie\n%Cpu(s):  2.5 us,  0.8 sy,  0.0 ni, 96.4 id,  0.2 wa,  0.0 hi,  0.1 si,  0.0 st\nMiB Mem :  32000.0 total,   2048.0 free,  15200.0 used,  14752.0 buff/cache\nMiB Swap:   8192.0 total,      0.0 free,      0.0 used.  15200.0 avail Mem\n\n  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND\n 1234 root      20   0  500000  25000   8000 S   5.0   0.8   125:30 nginx\n 5678 alice     20   0  300000  15000   6000 S   2.0   0.5    45:12 node\n 9012 bob       20   0   80000  12000   4000 R   1.0   0.4     2:30 python3",
        stepByStep: [
          "top — launch the interactive process viewer",
          "Press Shift+P — sort by CPU usage (find CPU hogs)",
          "Press Shift+M — sort by memory usage (find memory hogs)",
          "Press k — kill a process (prompts for PID and signal)",
          "Press r — renice a process (change priority)",
          "Press 1 — toggle per-CPU/core usage display",
          "Press q — quit top",
          "top -u alice — show only processes owned by a specific user",
          "top -p 1234,5678 — monitor only specific PIDs",
          "The 'load average' shows run queue length — > #cores means overloaded"
        ],
        tryIt: "Run top -n 1 -b to get a one-shot snapshot of processes",
        commonFlags: [
          { flag: "-u", description: "Show only processes for a specific user" },
          { flag: "-p", description: "Monitor only specific PIDs" },
          { flag: "-n", description: "Number of iterations (batch mode)" },
          { flag: "-b", description: "Batch mode (non-interactive, for scripts)" },
          { flag: "-H", description: "Show individual threads (not just processes)" },
          { flag: "-o", description: "Sort by a specific column (e.g., -o %MEM)" }
        ]
      },
      {
        command: "ps",
        description: "Process Snapshot — a point-in-time view of running processes with detailed column selection.",
        syntax: "ps [options]",
        syntaxParts: [
          { label: "command", value: "ps", color: "text-cyber-primary" },
          { label: "options", value: "[options]", color: "text-cyber-accent" }
        ],
        example: "$ ps aux --forest | head -10\nUSER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\nroot         1  0.0  0.5 102456  5432 ?        Ss   May25   0:05 /sbin/init\nroot       456  0.0  0.3  50000  3200 ?        Ss   May25   0:00  \\_ /usr/sbin/sshd\nroot      1234  0.0  0.8  70000  8000 ?        Ss   May25   0:00      \\_ sshd: user\nuser      1235  0.1  2.0 204890 20456 pts/0    Ss   May25   0:02          \\_ -bash\nuser      5678  1.0  4.5 500000 45000 pts/0    Sl   May25   5:30              \\_ node app.js",
        stepByStep: [
          "ps aux — all processes from all users (BSD syntax, most common)",
          "ps -ef — all processes with full-format listing (System V syntax)",
          "ps aux --forest — show process tree (parent-child hierarchy)",
          "ps -u alice — show processes for a specific user",
          "ps -p PID — show info for a specific process ID",
          "ps -eo pid,ppid,cmd,%cpu,%mem --sort=-%cpu — custom columns, sorted by CPU",
          "ps -eo pid,etimes,cmd — show elapsed time since process started",
          "STAT column: R=running, S=sleeping, Z=zombie, D=uninterruptible sleep (bad!)",
          "VSZ = virtual memory size, RSS = resident set size (actual RAM used)",
          "Pipe to grep: ps aux | grep -i nginx to find specific processes"
        ],
        tryIt: "Run ps aux | head -5 to see your system's first 5 processes",
        commonFlags: [
          { flag: "aux", description: "All processes, user format, extended (BSD syntax)" },
          { flag: "-ef", description: "All processes, full format (System V syntax)" },
          { flag: "-u", description: "Processes for a specific user" },
          { flag: "-p", description: "Filter by specific PIDs" },
          { flag: "--forest", description: "ASCII process tree" },
          { flag: "-eo", description: "Custom output columns (e.g., -eo pid,cmd,%mem)" },
          { flag: "--sort", description: "Sort by column (e.g., --sort=-%cpu)" },
          { flag: "-L", description: "Show threads (light-weight processes)" }
        ]
      },
      {
        command: "lsof",
        description: "List Open Files — identify which processes have which files, sockets, pipes, and devices open.",
        syntax: "lsof [options]",
        syntaxParts: [
          { label: "command", value: "lsof", color: "text-cyber-primary" },
          { label: "options", value: "[options]", color: "text-cyber-accent" }
        ],
        example: "$ lsof -i :8080\nCOMMAND  PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME\njava    1234 user   56u  IPv4 123456      0t0  TCP *:8080 (LISTEN)\ncurl    5678 user    3u  IPv4 123789      0t0  TCP localhost:8080->localhost:45678 (ESTABLISHED)\n\n$ lsof -u alice\nCOMMAND  PID  USER   FD   TYPE     DEVICE  SIZE/OFF  NODE NAME\nbash    1235 alice  cwd    DIR        8,1      4096  home/alice\nnode    5678 alice  txt    REG        8,1   25000000  /usr/bin/node",
        stepByStep: [
          "lsof — list ALL open files (will produce a LOT of output)",
          "lsof -i :8080 — find which process is listening on port 8080",
          "lsof -i :80 — check what's running on port 80",
          "lsof -u user — show open files for a specific user",
          "lsof -p PID — show open files for a specific process",
          "lsof +D /path — list processes that have files open in a directory",
          "lsof -iTCP -sTCP:LISTEN — show only TCP listening sockets",
          "lsof -c nginx — show open files for all processes named 'nginx'",
          "lsof /var/log/syslog — find which process is currently writing to a file",
          "When 'device or resource busy' on umount, run lsof +D /mountpoint to find the culprit"
        ],
        tryIt: "Run lsof -i to see all network connections and listening ports",
        commonFlags: [
          { flag: "-i", description: "Show network connections/filters (e.g., -i :80, -iTCP)" },
          { flag: "-u", description: "Show files for a specific user" },
          { flag: "-p", description: "Show files for a specific PID" },
          { flag: "-c", description: "Show files for processes matching a command name" },
          { flag: "+D", description: "Recursively search a directory" },
          { flag: "-t", description: "Output only PIDs (useful for scripting with xargs)" },
          { flag: "-s", description: "Filter by protocol state (e.g., -sTCP:LISTEN)" }
        ]
      },
      {
        command: "which",
        description: "Locate the executable file path of a command — find where a program is installed in the system PATH.",
        syntax: "which [options] <command>",
        syntaxParts: [
          { label: "command", value: "which", color: "text-cyber-primary" },
          { label: "options", value: "[options]", color: "text-cyber-accent" },
          { label: "command", value: "<command>", color: "text-cyber-purple" }
        ],
        example: "$ which nginx\n/usr/sbin/nginx\n\n$ which -a python\n/usr/bin/python\n/usr/local/bin/python\n\n$ which nonexistent\nwhich: no nonexistent in (/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin)",
        stepByStep: [
          "which nginx — find the full path of the nginx executable",
          "which -a python — show ALL matching paths (not just the first)",
          "Useful when you have multiple versions of a tool installed",
          "Combined with: file $(which nginx) to see what type of binary it is",
          "Combined with: ls -la $(which nginx) to check permissions",
          "type <command> is a bash builtin alternative that also shows aliases",
          "command -v <cmd> is the POSIX-compliant way (works in all shells)",
          "whereis <command> shows binary, source, and man page paths"
        ],
        tryIt: "Run which bash to find the path of your shell executable",
        commonFlags: [
          { flag: "-a", description: "Show all matching paths, not just the first" },
          { flag: "-s", description: "Silent mode — only return exit code (0 if found)" }
        ]
      },
      {
        command: "dmesg",
        description: "Display kernel ring buffer messages — hardware errors, driver issues, disk errors, and OOM killer activity.",
        syntax: "dmesg [options]",
        syntaxParts: [
          { label: "command", value: "dmesg", color: "text-cyber-primary" },
          { label: "options", value: "[options]", color: "text-cyber-accent" }
        ],
        example: "$ dmesg -T | tail -20\n[Wed May 25 10:00:00 2026] nginx[1234]: process started\n[Wed May 25 10:00:01 2026] device eth0 entered promiscuous mode\n[Wed May 25 09:55:30 2026] Out of memory: Killed process 5678 (node) total-vm:500000kB\n[Wed May 25 09:45:00 2026] ata1.00: exception Emask 0x0 SAct 0x0 SErr 0x0 action 0x0\n[Wed May 25 09:30:00 2026] EXT4-fs (sda1): mounted filesystem with ordered data mode",
        stepByStep: [
          "dmesg — dump kernel ring buffer (use dmesg | less for navigation)",
          "dmesg -T — show human-readable timestamps (not seconds since boot)",
          "dmesg -H — human-readable output with color",
          "dmesg -l err — show only error-level messages",
          "dmesg | grep -i oom — check for Out-Of-Memory killer events",
          "dmesg | grep -i 'usb\|ata\|sd[a-z]' — check for disk/USB errors",
          "dmesg | grep -i 'call trace' — look for kernel panics or driver crashes",
          "journalctl -k is an alternative that pulls kernel messages from systemd journal",
          "Critical when diagnosing: random crashes, hardware failures, disk I/O errors"
        ],
        tryIt: "Run dmesg -T | tail -10 to see the last 10 kernel messages with timestamps",
        commonFlags: [
          { flag: "-T", description: "Show human-readable timestamps" },
          { flag: "-H", description: "Human-readable output (colorized)" },
          { flag: "-l", description: "Filter by log level (e.g., -l err, -l warn)" },
          { flag: "-f", description: "Filter by facility (e.g., -f kern)" },
          { flag: "-k", description: "Show kernel messages only" },
          { flag: "-w", description: "Wait for new messages (like tail -f)" },
          { flag: "-n", description: "Set the log level for console output" }
        ]
      }
        ]
      }
    ]
  },
  {
    id: "powershell",
    title: "PowerShell Wizard",
    description: "Learn PowerShell from the ground up — objects, pipelines, and automation.",
    modules: [
      {
        id: "ps-getting-started",
        title: "Getting Started",
        description: "Learn the basics of PowerShell — cmdlets, help, and discovering commands.",
        commands: [
          {
            command: "Get-Command",
            description: "Discover all available commands on the system.",
            syntax: "Get-Command [-Name <string>] [-Module <string>] [-CommandType <type>]",
            syntaxParts: [
              { label: "cmdlet", value: "Get-Command", color: "text-cyber-primary" },
              { label: "flag", value: "-Name", color: "text-cyber-accent" },
              { label: "value", value: "<string>", color: "text-cyber-purple" }
            ],
            example: "PS> Get-Command -Name *service*\nCommandType  Name                  Version  Source\n-----------  ----                  -------  ------\nCmdlet       Get-Service           3.1.0.0  Microsoft.PowerShell.Management\nCmdlet       New-Service           3.1.0.0  Microsoft.PowerShell.Management",
            stepByStep: [
              "Get-Command lists EVERY available command",
              "Use -Name with wildcards: Get-Command -Name *process*",
              "Use -Module to see commands in a specific module",
              "Use -CommandType Cmdlet to see only cmdlets (not aliases or functions)",
              "Use Get-Command | Group-Object CommandType to see a summary"
            ],
            tryIt: "Run Get-Command -Name *process* to find all process-related commands",
            commonFlags: [
              { flag: "-Name", description: "Filter by name (supports wildcards like *process*)" },
              { flag: "-Module", description: "List commands from a specific module" },
              { flag: "-CommandType", description: "Filter by type: Cmdlet, Function, Alias, Application" },
              { flag: "-Syntax", description: "Show syntax for matching commands" }
            ]
          },
          {
            command: "Get-Help",
            description: "Get detailed help for any command — the most important cmdlet to know.",
            syntax: "Get-Help [-Name] <string> [-Detailed] [-Examples] [-Online]",
            syntaxParts: [
              { label: "cmdlet", value: "Get-Help", color: "text-cyber-primary" },
              { label: "flag", value: "[-Name]", color: "text-cyber-accent" },
              { label: "cmd", value: "<command>", color: "text-cyber-purple" }
            ],
            example: "PS> Get-Help Get-Process -Examples\nNAME\n    Get-Process\nEXAMPLE 1\n    Get-Process -Name note*",
            stepByStep: [
              "Get-Help Get-Process shows the full help page for Get-Process",
              "Use -Examples to see only the example section",
              "Use -Detailed for parameter descriptions and examples",
              "Use -Online to open the full Microsoft docs in your browser",
              "First run Update-Help to download the latest help files"
            ],
            tryIt: "Run Get-Help Get-Service -Examples to see examples for service management",
            commonFlags: [
              { flag: "-Examples", description: "Show only usage examples" },
              { flag: "-Detailed", description: "Show detailed parameter info and examples" },
              { flag: "-Full", description: "Show complete help content" },
              { flag: "-Online", description: "Open online Microsoft documentation" }
            ]
          },
          {
            command: "Get-Member",
            description: "Discover properties and methods of any PowerShell object.",
            syntax: "<object> | Get-Member [-MemberType <type>]",
            syntaxParts: [
              { label: "object", value: "<object>", color: "text-cyber-purple" },
              { label: "pipe", value: "|", color: "text-cyber-warning" },
              { label: "cmdlet", value: "Get-Member", color: "text-cyber-primary" }
            ],
            example: "PS> Get-Process | Get-Member -MemberType Property\n   TypeName: System.Diagnostics.Process\nName             MemberType Definition\n----             ---------- ----------\nCPU              Property   double CPU { get; }\nId               Property   int Id { get; }\nProcessName      Property   string ProcessName { get; }",
            stepByStep: [
              "Pipe any command to Get-Member to see what's inside the object",
              "Use -MemberType Property to see only properties (attributes)", 
              "Use -MemberType Method to see available actions",
              "This is how you discover property names for Where-Object and Select-Object",
              "Knowing the TypeName helps you understand what type of data you have"
            ],
            tryIt: "Run Get-Process | Get-Member -MemberType Property to see process object properties",
            commonFlags: [
              { flag: "-MemberType", description: "Filter by type: Property, Method, Event, etc." },
              { flag: "-Name", description: "Filter by name pattern" },
              { flag: "-InputObject", description: "Specify the object directly (instead of piping)" }
            ]
          }
        ]
      },
      {
        id: "ps-navigation",
        title: "Navigation & Files",
        description: "Navigate the filesystem and manage files and folders.",
        commands: [
          {
            command: "Get-ChildItem",
            description: "List files and folders (equivalent to ls / dir).",
            syntax: "Get-ChildItem [-Path] <string> [-Recurse] [-Filter <string>] [-File] [-Directory]",
            syntaxParts: [
              { label: "cmdlet", value: "Get-ChildItem", color: "text-cyber-primary" },
              { label: "flag", value: "[-Path]", color: "text-cyber-accent" },
              { label: "path", value: "<string>", color: "text-cyber-purple" }
            ],
            example: "PS> Get-ChildItem C:\\Logs -Recurse -Filter *.log | Select-Object Name, Length",
            stepByStep: [
              "Get-ChildItem lists files and folders (alias: ls, dir)",
              "Use -Recurse to search ALL subdirectories",
              "Use -Filter to narrow by name (faster than Where-Object)",
              "Use -File to show only files, -Directory for only folders",
              "Use -Hidden to show hidden files and folders"
            ],
            tryIt: "Run Get-ChildItem -File to see only files (not folders) in the current directory",
            commonFlags: [
              { flag: "-Recurse", description: "Search through all subdirectories" },
              { flag: "-Filter", description: "Filter by name (e.g., -Filter *.ps1)" },
              { flag: "-File", description: "Show only files" },
              { flag: "-Directory", description: "Show only directories" },
              { flag: "-Hidden", description: "Show hidden files" },
              { flag: "-Depth", description: "Limit recursion depth (e.g., -Depth 2)" }
            ]
          },
          {
            command: "Set-Location",
            description: "Change the current working directory (equivalent to cd).",
            syntax: "Set-Location [-Path] <string>",
            syntaxParts: [
              { label: "cmdlet", value: "Set-Location", color: "text-cyber-primary" },
              { label: "flag", value: "[-Path]", color: "text-cyber-accent" },
              { label: "path", value: "<string>", color: "text-cyber-purple" }
            ],
            example: "PS> Set-Location C:\\Projects\\DevOps\nPS> Get-Location\n\nPath\n----\nC:\\Projects\\DevOps",
            stepByStep: [
              "Set-Location C:\\path changes directory (alias: cd)",
              "Set-Location .. goes up one level (parent directory)",
              "Set-Location ~ goes to your home directory",
              "Set-Location - goes back to the previous directory",
              "Get-Location shows your current path (alias: pwd)"
            ],
            tryIt: "Run Set-Location .. then Get-Location to move up and check",
            commonFlags: [
              { flag: "-Path", description: "Path to navigate to" },
              { flag: "-PassThru", description: "Also output the new location" },
              { flag: "-UseTransaction", description: "Run within an active transaction" }
            ]
          },
          {
            command: "New-Item",
            description: "Create a new file, directory, registry key, or symlink.",
            syntax: "New-Item [-Path] <string> [-ItemType <type>] [-Name <string>] [-Value <string>]",
            syntaxParts: [
              { label: "cmdlet", value: "New-Item", color: "text-cyber-primary" },
              { label: "flag", value: "[-Path]", color: "text-cyber-accent" },
              { label: "path", value: "<string>", color: "text-cyber-purple" },
              { label: "opt", value: "[-ItemType]", color: "text-cyber-warning" }
            ],
            example: "PS> New-Item -Path C:\\Temp -Name \"config.json\" -ItemType File\nPS> New-Item -Path C:\\Projects -Name \"src\" -ItemType Directory",
            stepByStep: [
              "New-Item -ItemType File creates a new empty file",
              "New-Item -ItemType Directory creates a folder (like mkdir)",
              "Use -Value to write initial content: New-Item file.txt -Value \"hello\"",
              "Use -Force to overwrite existing items without prompting",
              "Can also create symbolic links: -ItemType SymbolicLink"
            ],
            tryIt: "Run New-Item -Path . -Name \"test.txt\" -ItemType File -Value \"hello\" -Force",
            commonFlags: [
              { flag: "-ItemType", description: "File, Directory, SymbolicLink, etc." },
              { flag: "-Value", description: "Initial content for the new item" },
              { flag: "-Force", description: "Create even if item already exists (overwrites)" },
              { flag: "-Name", description: "Specify name separately from path" }
            ]
          }
        ]
      },
      {
        id: "ps-pipeline",
        title: "Objects & Pipeline",
        description: "PowerShell's superpower — piping real objects, not text.",
        commands: [
          {
            command: "Where-Object",
            description: "Filter objects from the pipeline based on property conditions.",
            syntax: "<command> | Where-Object { <condition> }",
            syntaxParts: [
              { label: "cmd", value: "<command>", color: "text-cyber-purple" },
              { label: "pipe", value: "|", color: "text-cyber-warning" },
              { label: "cmdlet", value: "Where-Object", color: "text-cyber-primary" },
              { label: "script", value: "{ <condition> }", color: "text-cyber-accent" }
            ],
            example: "PS> Get-Process | Where-Object { $_.CPU -gt 100 -and $_.WorkingSet -gt 100MB }\nHandles  NPM(K)  PM(K)   WS(K)  CPU(s)  Id ProcessName\n-------  ------  -----   -----  ------  -- -----------\n   451      32  95200  110244  240.12 3421 chrome",
            stepByStep: [
              "Where-Object filters items using a script block condition",
              "$_ represents the CURRENT OBJECT in the pipeline",
              "Use comparison operators: -gt, -lt, -eq, -ne, -like, -match",
              "Combine conditions with -and, -or, -not",
              "Short syntax: Where-Object Property -gt Value (without script block)"
            ],
            tryIt: "Run Get-Service | Where-Object { $_.Status -eq 'Running' } to see running services",
            commonFlags: [
              { flag: "{-gt}", description: "Greater than" },
              { flag: "{-lt}", description: "Less than" },
              { flag: "{-eq}", description: "Equal to" },
              { flag: "{-like}", description: "Wildcard match (supports * and ?)" },
              { flag: "{-match}", description: "Regex match" }
            ]
          },
          {
            command: "Select-Object",
            description: "Pick specific properties from objects or take the first/last N items.",
            syntax: "<command> | Select-Object [-Property <string[]>] [-First <int>] [-Last <int>] [-Unique]",
            syntaxParts: [
              { label: "cmd", value: "<command>", color: "text-cyber-purple" },
              { label: "pipe", value: "|", color: "text-cyber-warning" },
              { label: "cmdlet", value: "Select-Object", color: "text-cyber-primary" },
              { label: "flags", value: "[-Property ...]", color: "text-cyber-accent" }
            ],
            example: "PS> Get-Process | Select-Object -Property Name, CPU, WorkingSet -First 5\nName    CPU  WorkingSet\n----    ---  ---------\nsystem   0.0      40960\nchrome 240.1  110244480",
            stepByStep: [
              "Select-Object -Property Name,CPU picks only those properties",
              "Select-Object -First 10 takes the first 10 items",
              "Select-Object -Last 5 takes the last 5 items",
              "Select-Object -Unique removes duplicates (comparison by string)",
              "Select-Object -ExpandProperty PropertyName extracts the property values"
            ],
            tryIt: "Run Get-ChildItem | Select-Object -First 3 to see the first 3 files",
            commonFlags: [
              { flag: "-Property", description: "Properties to include in output" },
              { flag: "-First", description: "Take the first N items" },
              { flag: "-Last", description: "Take the last N items" },
              { flag: "-Unique", description: "Remove duplicates" },
              { flag: "-ExpandProperty", description: "Extract a single property's value" }
            ]
          },
          {
            command: "Sort-Object",
            description: "Sort items by one or more properties in ascending or descending order.",
            syntax: "<command> | Sort-Object [-Property <string>] [-Descending] [-Unique]",
            syntaxParts: [
              { label: "cmd", value: "<command>", color: "text-cyber-purple" },
              { label: "pipe", value: "|", color: "text-cyber-warning" },
              { label: "cmdlet", value: "Sort-Object", color: "text-cyber-primary" },
              { label: "flags", value: "[-Property ...]", color: "text-cyber-accent" }
            ],
            example: "PS> Get-ChildItem -Recurse -File | Sort-Object -Property Length -Descending | Select-Object -First 5\n    Directory: C:\\Logs\nMode      Length Name\n----      ------ ----\n-a---    5000000 bigfile.log\n-a---    2000000 medium.log",
            stepByStep: [
              "Sort-Object -Property Size sorts by Size (ascending)",
              "Add -Descending for largest-first ordering",
              "Sort-Object -Unique sorts AND removes duplicates",
              "Sort by MULTIPLE properties: Sort-Object Status, Name",
              "Pipe to Select-Object -First to get top N results"
            ],
            tryIt: "Run Get-Process | Sort-Object -Property CPU -Descending | Select-Object -First 5",
            commonFlags: [
              { flag: "-Property", description: "Property to sort by" },
              { flag: "-Descending", description: "Sort from largest to smallest" },
              { flag: "-Unique", description: "Remove duplicates after sorting" },
              { flag: "-CaseSensitive", description: "Case-sensitive sorting" }
            ]
          }
        ]
      },
      {
        id: "ps-variables",
        title: "Variables & Data Types",
        description: "Store and manipulate data using variables typed by the .NET type system.",
        commands: [
          {
            command: "Variables",
            description: "Store values in variables and work with strongly-typed .NET objects.",
            syntax: "$variable = <value>",
            syntaxParts: [
              { label: "var", value: "$variable", color: "text-cyber-warning" },
              { label: "assign", value: "=", color: "text-cyber-accent" },
              { label: "value", value: "<value>", color: "text-cyber-purple" }
            ],
            example: "PS> $name = \"Alice\"\nPS> $port = 8080\nPS> $services = Get-Service\nPS> $config = @{host='localhost'; port=5432}\nPS> Write-Output \"$name connects to $($config.host):$port\"\nAlice connects to localhost:5432",
            stepByStep: [
              "$variable = value assigns a value to a variable",
              "Variables can hold any .NET type — strings, ints, arrays, hashtables, objects",
              "Use Get-Variable to list all current variables",
              "Use Get-Member on a variable to see its properties: $var | Get-Member",
              "Double-quoted strings expand variables: \"Hello $name\"",
              "Use $() to embed expressions: \"Port: $($service.Port)\""
            ],
            tryIt: "Run $now = Get-Date; Write-Output \"Today is $($now.DayOfWeek)\"",
            commonFlags: []
          },
          {
            command: "Arrays",
            description: "Store collections of items and access them by index.",
            syntax: "$array = @(item1, item2, item3)",
            syntaxParts: [
              { label: "var", value: "$array", color: "text-cyber-warning" },
              { label: "assign", value: "=", color: "text-cyber-accent" },
              { label: "value", value: "@(item1, item2, item3)", color: "text-cyber-purple" }
            ],
            example: "PS> $servers = @('web01', 'db01', 'cache01')\nPS> $servers[0]\nweb01\nPS> $servers.Count\n3",
            stepByStep: [
              "@() creates an array (collection of items)",
              "Access items by index starting at 0: $array[0], $array[1]",
              "Loop through arrays: foreach ($s in $servers) { $s }",
              "Add items: $array += 'newitem'",
              "Filter arrays: $servers | Where-Object { $_ -like '*01' }",
              "Use .Count for the number of items"
            ],
            tryIt: "Run $colors = @('red','green','blue'); Write-Output $colors[1]",
            commonFlags: []
          },
          {
            command: "Hashtables",
            description: "Store key-value pairs for structured data (like dictionaries or objects).",
            syntax: "$hashtable = @{ key1 = 'value1'; key2 = 'value2' }",
            syntaxParts: [
              { label: "var", value: "$hashtable", color: "text-cyber-warning" },
              { label: "assign", value: "=", color: "text-cyber-accent" },
              { label: "value", value: "@{ key = 'value' }", color: "text-cyber-purple" }
            ],
            example: "PS> $server = @{Name='web01'; IP='10.0.0.5'; Port=80}\nPS> $server['Name']\nweb01\nPS> $server.Name\nweb01",
            stepByStep: [
              "@{} creates a hashtable (key-value dictionary)",
              "Access by key: $hash['key'] or $hash.key",
              "Add or modify: $hash['newkey'] = 'value'",
              "Hashtables are used everywhere in PowerShell for splatting and config",
              "Convert hashtable to custom object: [PSCustomObject]$hash",
              "Use .Keys and .Values to enumerate"
            ],
            tryIt: "Run $h = @{Name='Alice'; Role='DevOps'}; Write-Output $h.Name",
            commonFlags: []
          }
        ]
      },
      {
        id: "ps-control",
        title: "Control Flow",
        description: "Add logic to your scripts with conditions and loops.",
        commands: [
          {
            command: "if/else",
            description: "Execute code conditionally based on boolean logic.",
            syntax: "if (<condition>) { <code> } elseif (<condition>) { <code> } else { <code> }",
            syntaxParts: [
              { label: "keyword", value: "if", color: "text-cyber-primary" },
              { label: "condition", value: "(<condition>)", color: "text-cyber-warning" },
              { label: "body", value: "{ <code> }", color: "text-cyber-accent" }
            ],
            example: "PS> $cpu = (Get-Process).CPU | Measure-Object -Sum | Select-Object -ExpandProperty Sum\nPS> if ($cpu -gt 500) {\n>>     Write-Warning 'High CPU usage!'\n>> } else {\n>>     Write-Output 'CPU usage normal'\n>> }",
            stepByStep: [
              "if (condition) { code } runs code only when condition is TRUE",
              "Comparison operators: -eq, -ne, -gt, -lt, -ge, -le, -like, -match",
              "elseif adds additional conditions (any number)",
              "else catches everything that didn't match",
              "Logical operators: -and, -or, -not, ! (not)"
            ],
            tryIt: "Run $val = Get-Random -Max 100; if ($val -gt 50) { 'High' } else { 'Low' }",
            commonFlags: []
          },
          {
            command: "foreach",
            description: "Iterate over each item in a collection.",
            syntax: "foreach ($item in $collection) { <code> }",
            syntaxParts: [
              { label: "keyword", value: "foreach", color: "text-cyber-primary" },
              { label: "loop-var", value: "($item in $collection)", color: "text-cyber-warning" },
              { label: "body", value: "{ <code> }", color: "text-cyber-accent" }
            ],
            example: "PS> $services = Get-Service | Where-Object Status -eq 'Stopped'\nPS> foreach ($svc in $services) {\n>>     Write-Output \"Starting $($svc.Name)...\"\n>>     Start-Service $svc.Name\n>> }",
            stepByStep: [
              "foreach ($item in $collection) iterates over each element",
              "$item takes the value of each element one at a time",
              "Use foreach with arrays, hashtables, or piped objects",
              "Use break to exit the loop early",
              "Use continue to skip to the next iteration",
              "Pipeline equivalent: $collection | ForEach-Object { $_ }"
            ],
            tryIt: "Run foreach ($i in 1..5) { 'Number: ' + $i }",
            commonFlags: []
          }
        ]
      },
      {
        id: "ps-functions",
        title: "Functions & Scripts",
        description: "Package reusable code into functions and scripts.",
        commands: [
          {
            command: "Function",
            description: "Define a reusable block of code with a name.",
            syntax: "function <name> { <code> }",
            syntaxParts: [
              { label: "keyword", value: "function", color: "text-cyber-primary" },
              { label: "name", value: "<name>", color: "text-cyber-purple" },
              { label: "body", value: "{ <code> }", color: "text-cyber-accent" }
            ],
            example: "PS> function Get-ServerStatus {\n>>     param([string]$ServerName)\n>>     $alive = Test-Connection $ServerName -Quiet -Count 1\n>>     if ($alive) { \"$ServerName is ONLINE\" } else { \"$ServerName is OFFLINE\" }\n>> }\nPS> Get-ServerStatus localhost\nlocalhost is ONLINE",
            stepByStep: [
              "function Name { code } defines a named block of code",
              "Use param() to define input parameters with optional types",
              "Return values by just outputting them (PowerShell returns ALL output)",
              "Use [Parameter(Mandatory)] for required parameters",
              "Save functions in .ps1 files or script modules (.psm1)",
              "Use Get-ChildItem Function: to see all loaded functions"
            ],
            tryIt: "Run function hi { 'Hello ' + $args[0] }; hi 'World'",
            commonFlags: [
              { flag: "[Parameter()]", description: "Advanced parameter attributes" },
              { flag: "[string]", description: "Type-constrain a parameter" },
              { flag: "$args", description: "Automatic array of unbound arguments" }
            ]
          }
        ]
      },
      {
        id: "ps-remote",
        title: "Remoting & Modules",
        description: "Run commands on remote machines and extend PowerShell with modules.",
        commands: [
          {
            command: "Invoke-Command",
            description: "Run commands on one or many remote computers via WinRM.",
            syntax: "Invoke-Command -ComputerName <string[]> -ScriptBlock { <code> }",
            syntaxParts: [
              { label: "cmdlet", value: "Invoke-Command", color: "text-cyber-primary" },
              { label: "flag", value: "-ComputerName", color: "text-cyber-accent" },
              { label: "target", value: "<string>", color: "text-cyber-purple" },
              { label: "script", value: "{ <code> }", color: "text-cyber-warning" }
            ],
            example: "PS> Invoke-Command -ComputerName web01, db01 -ScriptBlock {\n>>     Get-Service | Where-Object Status -eq 'Running'\n>> } | Select-Object PSComputerName, Name, Status",
            stepByStep: [
              "Invoke-Command -ComputerName SRV -ScriptBlock { cmd } runs on remote",
              "The script block runs on the REMOTE machine, but output comes back",
              "Use -Credential to connect as a different user",
              "Use -ComputerName (comma-separated list) for MULTIPLE machines",
              "Requires WinRM to be enabled: Enable-PSRemoting",
              "For one-off commands, use Enter-PSSession for interactive remote control"
            ],
            tryIt: "Invoke-Command -ComputerName localhost -ScriptBlock { Get-Date }",
            commonFlags: [
              { flag: "-ComputerName", description: "Target computer(s) to run on" },
              { flag: "-ScriptBlock", description: "Code to execute remotely" },
              { flag: "-Credential", description: "Run as a different user" },
              { flag: "-FilePath", description: "Run a local script file remotely" },
              { flag: "-AsJob", description: "Run as a background job" }
            ]
          },
          {
            command: "Import-Module",
            description: "Load a PowerShell module to access additional commands.",
            syntax: "Import-Module [-Name] <string> [-Force] [-PassThru]",
            syntaxParts: [
              { label: "cmdlet", value: "Import-Module", color: "text-cyber-primary" },
              { label: "flag", value: "[-Name]", color: "text-cyber-accent" },
              { label: "module", value: "<string>", color: "text-cyber-purple" }
            ],
            example: "PS> Import-Module ActiveDirectory\nPS> Get-Command -Module ActiveDirectory | Measure-Object | Select-Object Count\nCount\n-----\n  147",
            stepByStep: [
              "Import-Module Name loads a module so its commands are available",
              "List installed modules: Get-Module -ListAvailable",
              "List loaded modules: Get-Module",
              "Modules auto-load in PowerShell 5+ (just use the command directly)",
              "Common modules: ActiveDirectory, DhcpServer, IISAdministration",
              "Install community modules: Install-Module -Name <name> from PowerShell Gallery"
            ],
            tryIt: "Run Get-Module -ListAvailable | Select-Object Name, Version | Sort-Object Name",
            commonFlags: [
              { flag: "-Name", description: "Name or path of the module to load" },
              { flag: "-Force", description: "Reload even if already loaded" },
              { flag: "-PassThru", description: "Output the module object" },
              { flag: "-RequiredVersion", description: "Load a specific version" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "kql",
    title: "KQL Query Wizard",
    description: "Learn Kusto Query Language — filter, aggregate, join, and visualize data from Azure Data Explorer, Log Analytics, and Microsoft Sentinel.",
    modules: [
      {
        id: "kql-basics",
        title: "Getting Started",
        description: "Understand the pipe-forward query structure and learn basic table exploration operators.",
        commands: [
          {
            command: "Basic Query Structure",
            description: "KQL queries are built by piping tabular data through operators — every query starts with a table name and pipes (|) operators left to right.",
            syntax: "TableName | operator1 | operator2 | ...",
            syntaxParts: [
              { label: "table", value: "TableName", color: "text-cyber-purple" },
              { label: "pipe", value: " | ", color: "text-cyber-accent" },
              { label: "op", value: "operator1", color: "text-cyber-primary" },
              { label: "pipe", value: " | ", color: "text-cyber-accent" },
              { label: "op", value: "operator2", color: "text-cyber-warning" }
            ],
            example: "StormEvents\n| where StartTime > ago(30d)\n| take 10\n| project EventType, State, DamageProperty\n\nEventType          | State       | DamageProperty\n-------------------|-------------|---------------\nThunderstorm Wind  | TEXAS       | 5000\nFlash Flood        | CALIFORNIA  | 12000\nHail               | COLORADO    | 8000",
            stepByStep: [
              "Every KQL query starts with a table name (like StormEvents, Perf, or a custom table)",
              "Use | (pipe) to pass the result of one operator into the next operator",
              "Operators are applied in order — think of it like a pipeline where data flows left to right",
              "A semicolon ; ends a query; you can write multiple queries separated by ;",
              "Comments use // for single line or /* ... */ for multi-line blocks",
              "Queries are case-insensitive for keywords, but table/column names may be case-sensitive depending on the source",
              "Always start small — take a few rows first, then add filters and aggregations"
            ],
            tryIt: "Try writing: StormEvents | take 5 | project EventType, State",
            commonFlags: []
          },
          {
            command: "take / limit",
            description: "Return up to the specified number of rows — useful for a quick peek at your data without loading everything.",
            syntax: "TableName | take <N>",
            syntaxParts: [
              { label: "table", value: "TableName", color: "text-cyber-purple" },
              { label: "pipe", value: " | ", color: "text-cyber-accent" },
              { label: "op", value: "take", color: "text-cyber-primary" },
              { label: "count", value: "<N>", color: "text-cyber-warning" }
            ],
            example: "StormEvents\n| take 3\n\nStartTime           | EventType         | State    | DamageProperty\n--------------------|-------------------|----------|---------------\n2007-01-01 00:00:00 | Thunderstorm Wind | TEXAS    | 5000\n2007-01-01 00:05:00 | Flash Flood       | CALIFORNIA| 12000\n2007-01-01 00:10:00 | Hail              | COLORADO | 8000",
            stepByStep: [
              "take N returns any N rows (not guaranteed to be the first N — it's an optimization hint)",
              "Use take 10 to quickly see the schema (columns and data types)",
              "take is great for exploration — never write a heavy aggregation before checking your data with take first",
              "limit is an alias for take — they work identically",
              "For deterministic first N rows, use top N by <column> instead of take",
              "take after a where clause is efficient — filtering happens before the limit"
            ],
            tryIt: "Run: StormEvents | take 5",
            commonFlags: []
          },
          {
            command: "count",
            description: "Return the number of rows in the table (or after all previous filters are applied).",
            syntax: "TableName | count",
            syntaxParts: [
              { label: "table", value: "TableName", color: "text-cyber-purple" },
              { label: "pipe", value: " | ", color: "text-cyber-accent" },
              { label: "op", value: "count", color: "text-cyber-primary" }
            ],
            example: "StormEvents\n| where State == \"TEXAS\"\n| count\n\nCount\n-----\n2456",
            stepByStep: [
              "count returns a single row with a single column named 'Count'",
              "Place count at the end of a query to see how many rows made it through your filters",
              "Use count before expensive operations like sort or join to estimate the data volume",
              "Combine with summarize: StormEvents | summarize Count = count() by State to get counts per group",
              "dcount() is an approximate distinct count that's much faster on large datasets"
            ],
            tryIt: "Run: StormEvents | where State == \"FLORIDA\" | count",
            commonFlags: []
          },
          {
            command: "distinct",
            description: "Return unique combinations of the specified columns — removes duplicate rows.",
            syntax: "TableName | distinct <column1>, <column2>, ...",
            syntaxParts: [
              { label: "table", value: "TableName", color: "text-cyber-purple" },
              { label: "pipe", value: " | ", color: "text-cyber-accent" },
              { label: "op", value: "distinct", color: "text-cyber-primary" },
              { label: "cols", value: "<column1>, <column2>, ...", color: "text-cyber-purple" }
            ],
            example: "StormEvents\n| distinct State\n| take 5\n\nState\n-----\nTEXAS\nCALIFORNIA\nCOLORADO\nFLORIDA\nNEW YORK",
            stepByStep: [
              "distinct returns unique rows based on the selected columns",
              "With no columns specified, it returns unique combinations of ALL columns (expensive!)",
              "Always specify the columns you care about: distinct State, EventType",
              "distinct is the KQL equivalent of SQL's SELECT DISTINCT",
              "For a quick list of unique values in a column, use: Table | summarize make_set(Column)",
              "distinct followed by count gives you the unique count: distinct State | count"
            ],
            tryIt: "Run: StormEvents | distinct EventType | take 10",
            commonFlags: []
          }
        ]
      },
      {
        id: "kql-filter",
        title: "Filtering & Projection",
        description: "Narrow down rows with conditions, select specific columns, and create calculated fields.",
        commands: [
          {
            command: "where",
            description: "Filter rows based on one or more conditions — the most heavily used operator in KQL.",
            syntax: "TableName | where <condition>",
            syntaxParts: [
              { label: "table", value: "TableName", color: "text-cyber-purple" },
              { label: "pipe", value: " | ", color: "text-cyber-accent" },
              { label: "op", value: "where", color: "text-cyber-primary" },
              { label: "condition", value: "<condition>", color: "text-cyber-warning" }
            ],
            example: "StormEvents\n| where State == \"FLORIDA\"\n| where DamageProperty > 0\n| where StartTime > datetime(2007-06-01)\n| take 5\n\nStartTime           | EventType      | State    | DamageProperty\n--------------------|----------------|----------|---------------\n2007-06-15 14:30:00 | Thunderstorm Wind | FLORIDA | 15000\n2007-07-04 09:15:00 | Hurricane      | FLORIDA | 500000",
            stepByStep: [
              "Use == for equality, != for inequality, > < >= <= for comparisons",
              "String operators: contains (substring match), has (exact word match), startswith, endswith",
              "Combine conditions with and / or: where State == 'TEXAS' and DamageProperty > 10000",
              "For time filters: where Timestamp > ago(7d) or where Timestamp between (datetime(2024-01-01) .. datetime(2024-12-31))",
              "Use in() for list matching: where State in ('TEXAS', 'FLORIDA', 'CALIFORNIA')",
              "Use ! for negation: where State !contains 'Storm'",
              "Performance tip: put the most selective filter first — KQL is smart about short-circuiting"
            ],
            tryIt: "Run: StormEvents | where State == 'TEXAS' and DamageProperty > 10000 | take 10",
            commonFlags: [
              { flag: "==", description: "Equality (case-sensitive for strings)" },
              { flag: "!=", description: "Not equal" },
              { flag: "contains", description: "Substring match (e.g., where Name contains 'web')" },
              { flag: "has", description: "Exact whole-word match (e.g., where Name has 'web')" },
              { flag: "startswith", description: "Matches prefix" },
              { flag: "endswith", description: "Matches suffix" },
              { flag: "in()", description: "Match any value in a list" },
              { flag: "between", description: "Range check (inclusive, e.g., x between (1 .. 10))" }
            ]
          },
          {
            command: "project",
            description: "Select a specific set of columns to keep in the output — drops all others. Like SQL's SELECT.",
            syntax: "TableName | project <column1>, <column2>, ...",
            syntaxParts: [
              { label: "table", value: "TableName", color: "text-cyber-purple" },
              { label: "pipe", value: " | ", color: "text-cyber-accent" },
              { label: "op", value: "project", color: "text-cyber-primary" },
              { label: "cols", value: "<column1>, <column2>, ...", color: "text-cyber-purple" }
            ],
            example: "StormEvents\n| where State == \"TEXAS\"\n| project EventType, StartTime, DamageProperty\n| take 5\n\nEventType           | StartTime           | DamageProperty\n--------------------|---------------------|---------------\nThunderstorm Wind   | 2007-03-12 14:00:00 | 5000\nFlash Flood         | 2007-04-05 08:30:00 | 12000",
            stepByStep: [
              "project keeps ONLY the columns you list and drops everything else",
              "Use project to reduce data size and focus on relevant fields",
              "You can rename columns inline: project EventType, Cost = DamageProperty",
              "You can reorder columns by listing them in the order you want",
              "project-away drops specific columns (the inverse of project)",
              "project-rename renames columns without changing the schema",
              "Performance: projecting early reduces the amount of data carried through the pipeline"
            ],
            tryIt: "Run: StormEvents | take 10 | project State, EventType, DamageProperty",
            commonFlags: [
              { flag: "project-away", description: "Drop specific columns, keep the rest" },
              { flag: "project-rename", description: "Rename columns without dropping others" },
              { flag: "project-reorder", description: "Reorder columns without dropping any" }
            ]
          },
          {
            command: "extend",
            description: "Create new calculated columns based on expressions — keeps all existing columns.",
            syntax: "TableName | extend <newColumn> = <expression>, ...",
            syntaxParts: [
              { label: "table", value: "TableName", color: "text-cyber-purple" },
              { label: "pipe", value: " | ", color: "text-cyber-accent" },
              { label: "op", value: "extend", color: "text-cyber-primary" },
              { label: "new", value: "<newColumn> = <expression>", color: "text-cyber-warning" }
            ],
            example: "StormEvents\n| where DamageProperty > 0\n| extend DamageCategory = case(\n    DamageProperty > 100000, \"Severe\",\n    DamageProperty > 10000,  \"Moderate\",\n    \"Minor\"\n  )\n| project EventType, DamageProperty, DamageCategory\n| take 5\n\nEventType        | DamageProperty | DamageCategory\n-----------------|---------------|----------------\nHurricane        | 500000        | Severe\nThunderstorm Wind| 15000         | Moderate\nFlash Flood      | 8000          | Minor",
            stepByStep: [
              "extend adds new columns without removing existing ones (unlike project which replaces all)",
              "Use extend for transformations: tostring(), todouble(), toint(), format_datetime()",
              "Use extend for string operations: strcat(), substring(), replace(), toupper()",
              "Use extend for math: round(), floor(), ceiling(), pow(), sqrt()",
              "You can chain extends: ... | extend Total = A + B | extend Tax = Total * 0.08",
              "For conditional logic: extend Tier = iff(Value > 100, 'High', 'Low')",
              "Use case() for multi-condition logic: case(condition1, result1, condition2, result2, fallback)"
            ],
            tryIt: "Run: StormEvents | take 10 | extend Season = strcat('Q', datetime_part('quarter', StartTime)) | project EventType, Season",
            commonFlags: [
              { flag: "iff()", description: "Inline if-then-else: iff(condition, trueVal, falseVal)" },
              { flag: "case()", description: "Multi-condition switch: case(cond1, val1, cond2, val2, fallback)" },
              { flag: "strcat()", description: "Concatenate strings" },
              { flag: "tostring()", description: "Cast to string type" },
              { flag: "todouble()", description: "Cast to numeric type" },
              { flag: "format_datetime()", description: "Format datetime as string" },
              { flag: "datetime_part()", description: "Extract year, month, day, hour, etc." }
            ]
          }
        ]
      },
      {
        id: "kql-aggregate",
        title: "Aggregation & Grouping",
        description: "Summarize, group, and bin data to extract patterns and metrics at scale.",
        commands: [
          {
            command: "summarize",
            description: "Group rows by one or more columns and compute aggregation functions — the heart of KQL analytics.",
            syntax: "TableName | summarize <aggregation> by <groupColumn>",
            syntaxParts: [
              { label: "table", value: "TableName", color: "text-cyber-purple" },
              { label: "pipe", value: " | ", color: "text-cyber-accent" },
              { label: "op", value: "summarize", color: "text-cyber-primary" },
              { label: "agg", value: "<aggregation>", color: "text-cyber-warning" },
              { label: "by", value: " by ", color: "text-cyber-accent" },
              { label: "group", value: "<groupColumn>", color: "text-cyber-purple" }
            ],
            example: "StormEvents\n| summarize \n    TotalDamage = sum(DamageProperty),\n    AvgDamage = avg(DamageProperty),\n    EventCount = count()\n  by State\n| top 5 by TotalDamage desc\n\nState       | TotalDamage | AvgDamage | EventCount\n------------|-------------|-----------|------------\nFLORIDA     | 12500000    | 48320     | 258\nTEXAS       | 9800000     | 32100     | 305\nLOUISIANA   | 7200000     | 56700     | 127\nCALIFORNIA  | 5100000     | 28900     | 176\nMISSISSIPPI | 3800000     | 45200     | 84",
            stepByStep: [
              "summarize groups data by the 'by' columns and applies aggregation functions",
              "Common aggregations: count(), sum(), avg(), min(), max(), dcount(), make_list(), make_set()",
              "Group by multiple columns: summarize ... by State, EventType",
              "Use bin() for time bucketing: summarize Count = count() by bin(Timestamp, 1h)",
              "Multiple aggregations are comma-separated: summarize Total=sum(X), Avg=avg(X) by Group",
              "Results are NOT sorted by default — add order by or top after summarize",
              "Use dcount() for approximate distinct counts (much faster than distinct | count on large data)"
            ],
            tryIt: "Run: StormEvents | summarize Count = count() by State | top 5 by Count desc",
            commonFlags: [
              { flag: "count()", description: "Count of rows in each group" },
              { flag: "sum()", description: "Sum of a numeric column" },
              { flag: "avg()", description: "Average of a numeric column" },
              { flag: "min() / max()", description: "Minimum or maximum value" },
              { flag: "dcount()", description: "Approximate distinct count (fast, ~1% error)" },
              { flag: "make_list()", description: "Create a JSON array of values" },
              { flag: "make_set()", description: "Create a JSON array of distinct values" },
              { flag: "percentiles()", description: "Percentile calculation (e.g., percentiles(Latency, 50, 95, 99))" }
            ]
          },
          {
            command: "bin",
            description: "Group continuous values (especially timestamps and numbers) into discrete buckets for aggregation.",
            syntax: "summarize ... by bin(<column>, <bucketSize>)",
            syntaxParts: [
              { label: "op", value: "summarize", color: "text-cyber-primary" },
              { label: "agg", value: "<aggregation>", color: "text-cyber-warning" },
              { label: "by", value: " by ", color: "text-cyber-accent" },
              { label: "func", value: "bin(", color: "text-cyber-primary" },
              { label: "col", value: "<column>", color: "text-cyber-purple" },
              { label: "comma", value: ", ", color: "text-cyber-text" },
              { label: "size", value: "<bucketSize>", color: "text-cyber-warning" },
              { label: "close", value: ")", color: "text-cyber-primary" }
            ],
            example: "StormEvents\n| summarize Events = count() by bin(StartTime, 7d)\n| take 10\n\nStartTime           | Events\n--------------------|-------\n2007-01-01 00:00:00 | 42\n2007-01-08 00:00:00 | 58\n2007-01-15 00:00:00 | 35\n2007-01-22 00:00:00 | 61",
            stepByStep: [
              "bin() rounds values down to the nearest multiple of the bucket size",
              "Common time buckets: bin(Timestamp, 1h), bin(Timestamp, 1d), bin(Timestamp, 30m)",
              "Common numeric buckets: bin(Age, 10), bin(ResponseTime, 50)",
              "bin() is almost always used inside summarize: summarize Count = count() by bin(Time, 1h)",
              "You can bin by multiple dimensions: bin(Time, 1d), bin(Age, 10)",
              "For non-time binning, use the bucket size that makes sense for your data",
              "Always order by the bin column after summarizing to get chronological results"
            ],
            tryIt: "Run: StormEvents | summarize Count = count() by bin(StartTime, 30d) | order by StartTime asc",
            commonFlags: [
              { flag: "bin(Time, 1h)", description: "Hourly buckets" },
              { flag: "bin(Time, 1d)", description: "Daily buckets" },
              { flag: "bin(Time, 7d)", description: "Weekly buckets" },
              { flag: "bin(Num, 10)", description: "Buckets of 10 units" },
              { flag: "bin(Num, 100)", description: "Buckets of 100 units" }
            ]
          },
          {
            command: "make_list / make_set",
            description: "Collect values into an array — make_list keeps duplicates, make_set keeps distinct values.",
            syntax: "summarize ... make_list(<column>) by <groupColumn>",
            syntaxParts: [
              { label: "op", value: "summarize", color: "text-cyber-primary" },
              { label: "agg", value: "make_list(<column>)", color: "text-cyber-warning" },
              { label: "by", value: " by ", color: "text-cyber-accent" },
              { label: "group", value: "<groupColumn>", color: "text-cyber-purple" }
            ],
            example: "StormEvents\n| summarize States = make_set(State) by EventType\n| take 5\n\nEventType          | States\n-------------------|--------------------------------------------------\nThunderstorm Wind  | [\"TEXAS\", \"FLORIDA\", \"COLORADO\", \"NEW YORK\", ...]\nFlash Flood        | [\"CALIFORNIA\", \"TEXAS\", \"MISSISSIPPI\", ...]\nHail               | [\"COLORADO\", \"TEXAS\", \"KANSAS\", ...]",
            stepByStep: [
              "make_list() creates a JSON array with all values (including duplicates)",
              "make_set() creates a JSON array with only distinct values",
              "Useful for pivoting or collecting details per group without exploding rows",
              "Use mv-expand to do the inverse — expand an array back into multiple rows",
              "Combine with take: make_list(DamageProperty, 10) limits the list to top 10 values",
              "Use array_length() to count items: extend Count = array_length(States)"
            ],
            tryIt: "Run: StormEvents | summarize Types = make_set(EventType) by State | take 5",
            commonFlags: [
              { flag: "make_list()", description: "Create array (keeps duplicates)" },
              { flag: "make_set()", description: "Create array (distinct values only)" },
              { flag: "make_list(col, N)", description: "Limit list to N items" },
              { flag: "mv-expand", description: "Expand an array column into multiple rows" },
              { flag: "array_length()", description: "Count items in an array" }
            ]
          }
        ]
      },
      {
        id: "kql-advanced",
        title: "Sorting, Joins & Visualization",
        description: "Sort results, join multiple tables, and render visualizations directly in your KQL queries.",
        commands: [
          {
            command: "order by / sort by",
            description: "Sort the result set by one or more columns in ascending or descending order.",
            syntax: "TableName | order by <column> [asc | desc], <column2> [asc | desc]",
            syntaxParts: [
              { label: "table", value: "TableName", color: "text-cyber-purple" },
              { label: "pipe", value: " | ", color: "text-cyber-accent" },
              { label: "op", value: "order by", color: "text-cyber-primary" },
              { label: "col", value: "<column>", color: "text-cyber-purple" },
              { label: "dir", value: "[asc | desc]", color: "text-cyber-accent" }
            ],
            example: "StormEvents\n| where DamageProperty > 0\n| top 10 by DamageProperty desc\n\nEventType          | State    | DamageProperty\n-------------------|----------|---------------\nHurricane          | FLORIDA  | 2500000\nHurricane          | LOUISIANA| 1800000\nFlash Flood        | TEXAS    | 850000\nThunderstorm Wind  | MISSISSIPPI | 500000",
            stepByStep: [
              "order by col desc sorts from largest to smallest (most common)",
              "order by col asc sorts from smallest to largest (default if not specified)",
              "sort by is an alias for order by — they work identically",
              "Sort by multiple columns: order by State asc, DamageProperty desc",
              "Use top N by col instead of order by + take — it's more efficient (the engine optimizes it)",
              "Always put order by near the end of the query, after filtering and aggregation",
              "For string sorting, use tolower() for case-insensitive sort: order by tolower(Name)"
            ],
            tryIt: "Run: StormEvents | where DamageProperty > 0 | top 5 by DamageProperty desc | project EventType, State, DamageProperty",
            commonFlags: [
              { flag: "desc", description: "Descending (largest/highest first)" },
              { flag: "asc", description: "Ascending (smallest/lowest first)" },
              { flag: "top N by", description: "Return top N rows sorted by column (optimized)" },
              { flag: "top-nested", description: "Hierarchical top N (top by group within top by group)" }
            ]
          },
          {
            command: "join",
            description: "Combine rows from two tables based on a matching key — supports inner, outer, semi, anti, and more.",
            syntax: "Table1 | join kind=<kind> Table2 on <key>",
            syntaxParts: [
              { label: "t1", value: "Table1", color: "text-cyber-purple" },
              { label: "pipe", value: " | ", color: "text-cyber-accent" },
              { label: "op", value: "join", color: "text-cyber-primary" },
              { label: "kind", value: "kind=<kind>", color: "text-cyber-accent" },
              { label: "t2", value: "Table2", color: "text-cyber-purple" },
              { label: "on", value: " on ", color: "text-cyber-warning" },
              { label: "key", value: "<key>", color: "text-cyber-text" }
            ],
            example: "// Find employees in departments\nEmployees\n| join kind=inner Departments on DepartmentId\n| project EmployeeName, DepartmentName\n\nEmployeeName  | DepartmentName\n------------- |---------------\nAlice Smith   | Engineering\nBob Jones     | Marketing\nCarol Lee     | Engineering",
            stepByStep: [
              "join kind=inner — keeps rows that match in BOTH tables (most common)",
              "join kind=leftouter — keeps ALL rows from left table, nulls for unmatched right",
              "join kind=rightouter — keeps ALL rows from right table, nulls for unmatched left",
              "join kind=fullouter — keeps ALL rows from both tables",
              "join kind=leftsemi — keeps rows from left table that have ANY match in right (like SQL EXISTS)",
              "join kind=leftanti — keeps rows from left table with NO match in right (like SQL NOT EXISTS)",
              "The 'on' key must exist in both tables — rename with project if needed before joining",
              "For performance: ensure the smaller table is on the left side of the join",
              "Use lookup instead of join when the right table is small and static (more efficient)"
            ],
            tryIt: "Run: Employees | join kind=inner Departments on DepartmentId | project EmployeeName, DepartmentName",
            commonFlags: [
              { flag: "kind=inner", description: "Only matching rows from both sides" },
              { flag: "kind=leftouter", description: "All left, matching right (nulls for no match)" },
              { flag: "kind=fullouter", description: "All rows from both sides" },
              { flag: "kind=leftsemi", description: "Left rows that have a match in right" },
              { flag: "kind=leftanti", description: "Left rows with NO match in right" },
              { flag: "kind=rightanti", description: "Right rows with NO match in left" }
            ]
          },
          {
            command: "render",
            description: "Visualize query results as a chart — timechart, barchart, piechart, columnchart, and more.",
            syntax: "TableName | render <chartType> [with (property=value)]",
            syntaxParts: [
              { label: "table", value: "<query>", color: "text-cyber-purple" },
              { label: "pipe", value: " | ", color: "text-cyber-accent" },
              { label: "op", value: "render", color: "text-cyber-primary" },
              { label: "type", value: "<chartType>", color: "text-cyber-warning" }
            ],
            example: "StormEvents\n| summarize EventCount = count() by bin(StartTime, 30d)\n| render timechart\n\n(Renders a time-series line chart showing storm events over time)",
            stepByStep: [
              "render timechart — line chart with time on X-axis (most common for time-series data)",
              "render barchart — horizontal bars (good for comparing categories)",
              "render columnchart — vertical bars (good for comparing categories)",
              "render piechart — proportional slices (use sparingly — hard to compare)",
              "render table — default tabular output (same as no render)",
              "Customize with: render timechart with (title='My Chart', xtitle='Date', ytitle='Count')",
              "For timechart, ensure the first column is a datetime and the second is the metric",
              "render works in Azure Data Explorer web UI, Azure Monitor workbooks, and Kusto.Explorer"
            ],
            tryIt: "Run: StormEvents | summarize Count = count() by bin(StartTime, 30d) | render timechart",
            commonFlags: [
              { flag: "timechart", description: "Time-series line chart" },
              { flag: "barchart", description: "Horizontal bar chart" },
              { flag: "columnchart", description: "Vertical column chart" },
              { flag: "piechart", description: "Pie chart for proportions" },
              { flag: "areachart", description: "Area chart (filled line chart)" },
              { flag: "scatterchart", description: "Scatter plot for correlations" },
              { flag: "with (title=)", description: "Set chart title and axis labels" }
            ]
          },
          {
            command: "let",
            description: "Define variables, functions, or views to reuse throughout your query — essential for readable, maintainable KQL.",
            syntax: "let <name> = <expression>;",
            syntaxParts: [
              { label: "keyword", value: "let", color: "text-cyber-primary" },
              { label: "name", value: "<name>", color: "text-cyber-purple" },
              { label: "assign", value: " = ", color: "text-cyber-accent" },
              { label: "expr", value: "<expression>", color: "text-cyber-warning" },
              { label: "semi", value: ";", color: "text-cyber-text" }
            ],
            example: "let Threshold = 100000;\nlet SevereEvents = StormEvents | where DamageProperty > Threshold;\nlet StateCounts = SevereEvents | summarize Count = count() by State;\nStateCounts\n| top 5 by Count desc\n\nState       | Count\n------------|------\nFLORIDA     | 45\nTEXAS       | 38\nLOUISIANA   | 22",
            stepByStep: [
              "let assigns a name to a value, table expression, or function",
              "Use let for constants: let MaxLatency = 500; ... where LatencyMs > MaxLatency",
              "Use let for subqueries: let HighValue = StormEvents | where DamageProperty > 100000;",
              "Use let for scalar functions: let Square = (x: long) { x * x };",
              "Multiple let statements are separated by semicolons (;)",
              "The final statement is the query that produces the output (no semicolon)",
              "let follows lexical scoping — inner let can reference outer let but not vice versa",
              "Using let makes complex queries readable, testable, and reusable"
            ],
            tryIt: "Run: let TopStates = StormEvents | summarize Count = count() by State | top 3 by Count desc; TopStates | project State, Count",
            commonFlags: [
              { flag: "let X = value;", description: "Define a scalar constant" },
              { flag: "let X = Table | ...;", description: "Define a tabular view (subquery)" },
              { flag: "let F = (x: T) { expr };", description: "Define a reusable function" },
              { flag: "let X = view() { ... };", description: "Define a view usable across union clauses" }
            ]
          }
        ]
      }
    ]
  }
];