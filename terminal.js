class MurderMysteryTerminal {
  constructor() {
    this.currentPath = '/home/joe-vallen';
    this.gameState   = { cluesFound: [], filesAccessed: [], solved: false, timeStarted: Date.now() };
    this.output      = document.getElementById('output');
    this.input       = document.getElementById('cmd');
    this.promptEl    = document.getElementById('prompt');
    this.history     = [];
    this.histIdx     = 0;

    this.init();
  }

  init() {
    this.bindEvents();
    this.startClock();
    this.displayWelcome();
  }

  bindEvents() {
    this.input.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'Enter':
          this.handleEnter();
          break;
        case 'ArrowUp':
          e.preventDefault(); this.navigateHistory(-1);
          break;
        case 'ArrowDown':
          e.preventDefault(); this.navigateHistory(1);
          break;
        case 'Tab':
          e.preventDefault(); this.complete();
          break;
      }
    });
  }

 startClock() {
  const tick = () => {
    const t = new Date().toLocaleTimeString();
    const p = this.currentPath.replace('/home/joe-vallen', '~');
    this.promptEl.innerHTML =
      `<span style="color:#8be9fd">${t}</span> <span style="color:#50fa7b">detective</span>@<span style="color:#ffb86c">joe-vallen-laptop</span>:<span style="color:#f1fa8c">${p}</span>$ `;
    setTimeout(tick, 1000);
  };
  tick();
}

  displayWelcome() {
    this.echo(this.getNeofetch(), 'neofetch');
    this.echo('\n<span style="color:#ff79c6;font-weight:bold">Welcome to the Murder Investigation Terminal</span>');
    this.echo('<span style="color:#8be9fd">Case #0420 – "The Digital Suicide"</span>');
    this.echo('<span style="color:#f1fa8c">Type "help" to begin investigating...</span>\n');
  }

  echo(msg, cls = '') {
    const div = document.createElement('div');
    div.className = cls;
    div.innerHTML = msg;
    this.output.appendChild(div);
    this.scrollBottom();
  }
  scrollBottom() {
    document.getElementById('viewport').scrollTop = document.getElementById('viewport').scrollHeight;
  }

  handleEnter() {
    const cmd = this.input.value.trim();
    if (!cmd) return;
    this.echo(this.promptEl.innerHTML + cmd, 'command-line');
    this.history.push(cmd);
    this.histIdx = this.history.length;
    this.execute(cmd);
    this.input.value = '';
  }
  navigateHistory(dir) {
    this.histIdx = Math.max(0, Math.min(this.history.length - 1, this.histIdx + dir));
    this.input.value = this.history[this.histIdx] || '';
  }
  complete() {
    const tokens = this.input.value.trim().split(/\s+/);
    const partial = tokens.pop() || '';
    const cmds = ['ls', 'cd', 'cat', 'pwd', 'help', 'neofetch', 'clear', 'whoami', 'date', 'history', 'grep', 'find', 'file'];
    const match = cmds.find(c => c.startsWith(partial));
    if (match) {
      tokens.push(match);
      this.input.value = tokens.join(' ') + ' ';
    }
  }

  execute(raw) {
    const [cmd, ...args] = raw.split(/\s+/);
    switch (cmd.toLowerCase()) {
      case 'help': this.showHelp(); break;
      case 'clear': this.output.innerHTML = ''; break;
      case 'neofetch': this.echo(this.getNeofetch(), 'neofetch'); break;
      case 'whoami': this.echo('<span style="color:#50fa7b">detective</span>'); break;
      case 'date': this.echo(`<span style="color:#8be9fd">${new Date().toString()}</span>`); break;
      case 'ls': this.handleLs(args); break;
      case 'cd': this.handleCd(args); break;
      case 'cat': this.handleCat(args); break;
      case 'pwd': this.echo(`<span style="color:#f1fa8c">${this.currentPath}</span>`); break;
      case 'history': this.handleHistory(); break;
      case 'grep': this.handleGrep(args); break;
      case 'find': this.handleFind(args); break;
      case 'file': this.handleFile(args); break;
      default: this.echo(`<span style="color:#ff5555">Command not found: ${cmd}</span>`);
    }
  }

  resolvePath(path) {
    if (path.startsWith('/')) return path;
    return `${this.currentPath}/${path}`.replace('//', '/');
  }
  getNode(path) {
    const parts = path.split('/').filter(Boolean);
    let node = fileSystem;
    for (const p of parts) {
      const next = node.find(n => n.name === p);
      if (!next || next.type !== 'directory') return next;
      node = next.contents;
    }
    return node;
  }

  handleLs(args) {
    const node = this.getNode(this.resolvePath(args[0] || this.currentPath));
    if (!Array.isArray(node)) return this.echo('<span class="error">ls: No such directory</span>');
    const list = node
      .filter(n => !n.hidden || args.includes('-a') || args.includes('-la'))
      .map(n => `<span style="color:${n.type==='directory'?'#8be9fd':'#f8f8f2'}">${n.name}${n.type==='directory'?'/':''}</span>`)
      .join('  ');
    this.echo(list || '<span style="color:#6272a4">No files</span>');
  }

  handleCd(args) {
    if (!args[0]) return this.currentPath = '/home/victim';
    const target = args[0];
    let newPath;
    if (target === '..') {
      const parts = this.currentPath.split('/'); parts.pop();
      newPath = parts.join('/') || '/';
    } else {
      newPath = this.resolvePath(target);
    }
    const node = this.getNode(newPath);
    if (Array.isArray(node)) this.currentPath = newPath;
    else this.echo('<span style="color:#ff5555">cd: No such directory</span>');
  }

  handleCat(args) {
    if (!args[0]) return this.echo('<span style="color:#ff5555">cat: missing file</span>');
    const file = this.getNode(this.resolvePath(args[0]));
    if (!file || file.type === 'directory') return this.echo('<span style="color:#ff5555">cat: No such file</span>');
    this.echo(file.content.replace(/\n/g, '<br>'));
    this.checkClue(args[0]);
  }

  handleGrep(args) {
    if (args.length < 2) return this.echo('<span style="color:#ff5555">grep: usage: grep pattern file</span>');
    const file = this.getNode(this.resolvePath(args[1]));
    if (!file || file.type === 'directory') return this.echo('<span style="color:#ff5555">grep: No such file</span>');
    const lines = file.content.split('\n')
      .filter(l => l.toLowerCase().includes(args[0].toLowerCase()))
      .join('<br>');
    this.echo(lines || '<span style="color:#6272a4">No matches</span>');
  }

  handleFind(args) {
    const term = args[0] || '';
    const hits = [];
    const walk = (node, path) => node.forEach(n => {
      if (n.type === 'directory') walk(n.contents, `${path}/${n.name}`);
      else if (n.name.includes(term)) hits.push(`${path}/${n.name}`);
    });
    walk(fileSystem, '');
    this.echo(hits.join('<br>') || '<span style="color:#6272a4">No files found</span>');
  }

  handleFile(args) {
    if (!args[0]) return this.echo('<span style="color:#ff5555">file: missing operand</span>');
    const file = this.getNode(this.resolvePath(args[0]));
    if (!file) return this.echo('<span style="color:#ff5555">file: No such file</span>');
    this.echo(`<span style="color:#8be9fd">${args[0]}: ${file.mimeType}</span>`);
  }

  handleHistory() {
    this.history.forEach((h, i) => this.echo(`${i + 1}  <span style="color:#6272a4">${h}</span>`));
  }

  checkClue(file) {
    const clues = {
      'diary.txt': 'Diary entries mention Project Nightfall',
      'meeting_notes.txt': 'Meeting notes reference The Circle',
      'email_draft.txt': 'Email draft reveals blackmail attempt',
      'death_note.jpg': 'Hidden photo with encrypted message',
      'bank_statement.pdf': 'Suspicious $50k transfer',
      'auth.log': 'Log shows remote access from darknet IP'
    };
    const key = file.split('/').pop();
    if (clues[key] && !this.gameState.cluesFound.includes(key)) {
      this.gameState.cluesFound.push(key);
      this.echo(`<span style="color:#50fa7b;font-weight:bold">🔍 CLUE UNLOCKED: ${clues[key]}</span>`);
      if (this.gameState.cluesFound.length === 6) this.showSolution();
    }
  }

  showSolution() {
    this.echo(`
<span style="color:#ff5555;font-size:16px;font-weight:bold;text-shadow:0 0 8px #ff5555">
██╗    ██╗███████╗██╗      ██████╗ ██████╗ ███╗   ███╗███████╗
╚███╔███╔╝███████╗███████╗╚██████╗╚██████╔╝██║ ╚═╝ ██║███████╗
</span>
<span style="color:#50fa7b;font-size:16px;font-weight:bold">
Congratulations, Detective! You have uncovered the truth.
The staged suicide is exposed. Report to case-0420@cyber-crimes.gov
</span>
`);
  }

  getNeofetch() {
  const uptime = Date.now() - this.gameState.timeStarted;
  const m = Math.floor(uptime / 60000);
  const s = Math.floor((uptime % 60000) / 1000);
  const res = `${window.screen.width}x${window.screen.height}`;

  return `
<span style="color:#e95420;text-shadow:0 0 8px #e95420">
⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⠋⠉⠁⠀⠀⠀⠀⠈⠉⠙⠛⠿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⠿⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠿⣿⣿⣿⣿⣿
⣿⣿⣿⡟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣾⣿⣦⠀⠀⠀⠈⢻⣿⣿⣿
⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⢠⣶⣶⣾⣷⣶⣆⠸⣿⣿⡟⠀⠀⠀⠀⠀⠹⣿⣿
⣿⠃⠀⠀⠀⠀⠀⠀⣠⣾⣷⡈⠻⠿⠟⠻⠿⢿⣷⣤⣤⣄⠀⠀⠀⠀⠀⠀⠘⣿
⡏⠀⠀⠀⠀⠀⠀⣴⣿⣿⠟⠁⠀⠀⠀⠀⠀⠀⠈⠻⣿⣿⣦⠀⠀⠀⠀⠀⠀⢹
⠁⠀⠀⢀⣤⣤⡘⢿⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⣿⡇⠀⠀⠀⠀⠀⠈
⠀⠀⠀⣿⣿⣿⡇⢸⣿⡁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢈⣉⣉⡁⠀⠀⠀⠀⠀⠀
⡀⠀⠀⠈⠛⠛⢡⣾⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⡇⠀⠀⠀⠀⠀⢀
⣇⠀⠀⠀⠀⠀⠀⠻⣿⣿⣦⡀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⠟⠀⠀⠀⠀⠀⠀⣸
⣿⡄⠀⠀⠀⠀⠀⠀⠙⢿⡿⢁⣴⣶⣦⣴⣶⣾⡿⠛⠛⠋⠀⠀⠀⠀⠀⠀⢠⣿
⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠘⠿⠿⢿⡿⠿⠏⢰⣿⣿⣧⠀⠀⠀⠀⠀⣰⣿⣿
⣿⣿⣿⣧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⠟⠀⠀⠀⢀⣼⣿⣿⣿
⣿⣿⣿⣿⣿⣶⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣶⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣶⣤⣄⣀⡀⠀⠀⠀⠀⢀⣀⣠⣤⣶⣿⣿⣿⣿⣿⣿⣿⣿
</span>

<span style="color:#fff7f7;font-weight:bold;text-shadow:0 0 8px #fff7f7">detective@joe-vallen-laptop</span>
<span style="color:#f8f8f2;text-shadow:0 0 4px #f8f8f2">────────────────────────────────────</span>

<span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">OS      :</span> <span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">Ubuntu 22.04.3 LTS x86_64</span>
<span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">Host    :</span> <span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">Joe-Vallen-Laptop 1.0</span>
<span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">Kernel  :</span> <span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">5.15.0-76-generic</span>
<span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">Uptime  :</span> <span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">${m}m ${s}s</span>
<span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">Packages:</span> <span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">1337 (dpkg)</span>
<span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">Shell   :</span> <span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">bash 5.1.16</span>
<span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">Resolution:</span> <span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">${res}</span>
<span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">DE      :</span> <span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">GNOME 42.5</span>
<span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">WM      :</span> <span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">Mutter</span>
<span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">Theme   :</span> <span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">Dracula [GTK2/3]</span>
<span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">Icons   :</span> <span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">Papirus-Dark [GTK2/3]</span>
<span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">Terminal:</span> <span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">custom</span>
<span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">CPU     :</span> <span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">Intel i7-12700KF (12) @ 5.000 GHz</span>
<span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">GPU     :</span> <span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">NVIDIA RTX 3080 Ti</span>
<span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">Memory  :</span> <span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">32 GB / 64 GB</span>
<span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">Disk    :</span> <span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">512 GB NVMe SSD</span>
<span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">Battery :</span> <span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">100 % [Full]</span>
<span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">Temp    :</span> <span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">32 °C</span>
<span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">Locale  :</span> <span style="color:#e95420;font-weight:bold;text-shadow:0 0 5px #e95420">en_US.UTF-8</span>
  `;
}

  showHelp() {
    this.echo(`
<span style="color:#bd93f9;font-weight:bold">Available Commands:</span>
<span style="color:#50fa7b">ls</span>       <span style="color:#f8f8f2">- List directory contents</span>
<span style="color:#50fa7b">cd</span>       <span style="color:#f8f8f2">- Change directory</span>
<span style="color:#50fa7b">cat</span>      <span style="color:#f8f8f2">- Display file contents</span>
<span style="color:#50fa7b">pwd</span>      <span style="color:#f8f8f2">- Print working directory</span>
<span style="color:#50fa7b">grep</span>     <span style="color:#f8f8f2">- Search file contents</span>
<span style="color:#50fa7b">find</span>     <span style="color:#f8f8f2">- Find files</span>
<span style="color:#50fa7b">file</span>     <span style="color:#f8f8f2">- Determine file type</span>
<span style="color:#50fa7b">clear</span>    <span style="color:#f8f8f2">- Clear terminal</span>
<span style="color:#50fa7b">neofetch</span> <span style="color:#f8f8f2">- Display system information</span>
<span style="color:#50fa7b">help</span>     <span style="color:#f8f8f2">- Show this help message</span>
`);
  }
}

document.addEventListener('DOMContentLoaded', () => new MurderMysteryTerminal());