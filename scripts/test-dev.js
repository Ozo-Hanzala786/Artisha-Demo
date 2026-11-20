const { spawn } = require('child_process');
const http = require('http');

const p = spawn('cmd.exe', ['/c', 'npm run dev'], { stdio: 'pipe' });
p.stdout.on('data', d => console.log('DEV:', d.toString().trim()));
p.stderr.on('data', d => console.error('ERR:', d.toString().trim()));

setTimeout(() => {
  http.get('http://localhost:3000/', res => {
    let html = '';
    res.on('data', c => html += c);
    res.on('end', () => {
      console.log('DEV SERVER RESPONDED:', res.statusCode);
      // In Next.js dev mode, check if page contains classes or style link
      const hasTailwindLink = html.includes('stylesheet') || html.includes('css');
      console.log('HTML length:', html.length);
      console.log('Includes Artisha text:', html.includes('Artisha'));
      p.kill();
      process.exit(0);
    });
  }).on('error', err => {
    console.error('FAIL:', err);
    p.kill();
    process.exit(1);
  });
}, 5000);
