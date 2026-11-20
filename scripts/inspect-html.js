const fs = require('fs');
const http = require('http');

http.get('http://localhost:3000/', res => {
  let html = '';
  res.on('data', c => html += c);
  res.on('end', () => {
    fs.writeFileSync('scripts/dev-dump.html', html);
    console.log('SAVED dev-dump.html, size:', html.length);
    const styleMatches = html.match(/<style[^>]*>[\s\S]*?<\/style>/g);
    console.log('Style tags count:', styleMatches ? styleMatches.length : 0);
    const scripts = html.match(/src="([^"]+)"/g);
    console.log('Scripts:', scripts ? scripts.slice(0, 5) : 0);
  });
}).on('error', console.error);
