const https = require('node:https');
const fallbackSkills = require('../data/fallback-skills.json');

const ONET_HOST = 'services.onetcenter.org';

function requestJson(pathname, username, password) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${username}:${password}`).toString('base64');

    const req = https.request(
      {
        hostname: ONET_HOST,
        path: pathname,
        method: 'GET',
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: 'application/json'
        }
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });

        res.on('end', () => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            reject(new Error(`O*NET request failed (${res.statusCode}): ${body.slice(0, 300)}`));
            return;
          }

          try {
            resolve(JSON.parse(body));
          } catch (error) {
            reject(new Error(`Unable to parse O*NET response: ${error.message}`));
          }
        });
      }
    );

    req.on('error', reject);
    req.end();
  });
}

async function fetchOnetSkills(jobTitle) {
  const username = process.env.ONET_USERNAME;
  const password = process.env.ONET_PASSWORD;

  if (!username || !password || !jobTitle) {
    return [];
  }

  const keyword = encodeURIComponent(jobTitle);
  const search = await requestJson(`/ws/mnm/careers/${keyword}`, username, password);
  const firstCareer = search?.career?.[0];
  if (!firstCareer?.code) {
    return [];
  }

  const details = await requestJson(`/ws/online/occupations/${firstCareer.code}/summary`, username, password);
  const elements = details?.element || [];

  return elements
    .filter((entry) => typeof entry?.name === 'string')
    .map((entry) => entry.name.trim())
    .filter(Boolean)
    .slice(0, 20);
}

function lookupFallbackSkills(jobTitle = '') {
  const normalized = jobTitle.toLowerCase();
  const exact = fallbackSkills[normalized];
  if (exact) {
    return exact;
  }

  const partial = Object.entries(fallbackSkills).find(([title]) => normalized.includes(title));
  return partial ? partial[1] : [];
}

async function getSkillsForJob(jobTitle) {
  try {
    const onetSkills = await fetchOnetSkills(jobTitle);
    if (onetSkills.length > 0) {
      return { source: 'O*NET', skills: onetSkills };
    }
  } catch (error) {
    return { source: 'fallback', skills: lookupFallbackSkills(jobTitle), note: error.message };
  }

  return { source: 'fallback', skills: lookupFallbackSkills(jobTitle) };
}

module.exports = {
  getSkillsForJob,
  lookupFallbackSkills
};
