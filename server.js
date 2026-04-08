const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { tailorResume } = require('./lib/tailorResume');
const { getSkillsForJob } = require('./lib/onet');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

function serveFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1e6) {
        reject(new Error('Payload too large'));
        req.destroy();
      }
    });

    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch (error) {
        reject(error);
      }
    });

    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    serveFile(res, path.join(PUBLIC_DIR, 'index.html'), 'text/html; charset=utf-8');
    return;
  }

  if (req.method === 'GET' && req.url === '/app.js') {
    serveFile(res, path.join(PUBLIC_DIR, 'app.js'), 'application/javascript; charset=utf-8');
    return;
  }

  if (req.method === 'GET' && req.url === '/styles.css') {
    serveFile(res, path.join(PUBLIC_DIR, 'styles.css'), 'text/css; charset=utf-8');
    return;
  }

  if (req.method === 'POST' && req.url === '/api/tailor') {
    try {
      const { resumeText, jobDescription, jobTitle } = await parseJsonBody(req);
      if (!resumeText || !jobDescription) {
        sendJson(res, 400, { error: 'resumeText and jobDescription are required' });
        return;
      }

      const skillsResult = await getSkillsForJob(jobTitle || '');
      const tailored = tailorResume({
        resumeText,
        jobDescription,
        onetSkills: skillsResult.skills
      });

      sendJson(res, 200, {
        source: skillsResult.source,
        sourceNote: skillsResult.note,
        ...tailored
      });
    } catch (error) {
      sendJson(res, 500, { error: error.message });
    }
    return;
  }

  sendJson(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Resume tailoring app listening on http://localhost:${PORT}`);
});
