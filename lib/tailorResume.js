const ACTION_VERBS = [
  'Led',
  'Built',
  'Developed',
  'Improved',
  'Designed',
  'Implemented',
  'Automated',
  'Delivered'
];

function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2);
}

function topTerms(text, limit = 25) {
  const stopWords = new Set(['the', 'and', 'for', 'with', 'that', 'you', 'are', 'this', 'your', 'our', 'from', 'will']);
  const counts = new Map();

  for (const word of tokenize(text)) {
    if (stopWords.has(word)) {
      continue;
    }
    counts.set(word, (counts.get(word) || 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([term]) => term);
}

function extractBullets(resumeText) {
  return (resumeText || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('-') || line.startsWith('•'))
    .map((line) => line.replace(/^[-•]\s*/, ''));
}

function scoreBullet(bullet, keywords) {
  const lower = bullet.toLowerCase();
  let score = 0;
  for (const word of keywords) {
    if (lower.includes(word)) {
      score += 1;
    }
  }
  return score;
}

function rewriteBullet(original, matchedSkill, index) {
  const verb = ACTION_VERBS[index % ACTION_VERBS.length];
  if (!matchedSkill) {
    return `${verb} ${original}`;
  }
  return `${verb} ${original} with focus on ${matchedSkill}.`;
}

function tailorResume({ resumeText, jobDescription, onetSkills = [] }) {
  const jdTerms = topTerms(jobDescription);
  const bullets = extractBullets(resumeText);

  const ranked = bullets
    .map((bullet, index) => ({
      bullet,
      index,
      score: scoreBullet(bullet, jdTerms)
    }))
    .sort((a, b) => b.score - a.score);

  const selected = ranked.slice(0, 6);
  const skillSet = [...new Set([...onetSkills, ...jdTerms])].slice(0, 12);

  const tailoredBullets = selected.map((item, idx) => rewriteBullet(item.bullet, skillSet[idx], idx));

  const summary = `Results-driven candidate aligned to role needs in ${skillSet.slice(0, 4).join(', ')}.`;

  const missingSkills = skillSet.filter((skill) => !resumeText.toLowerCase().includes(skill.toLowerCase())).slice(0, 8);

  return {
    summary,
    skills: skillSet,
    experienceBullets: tailoredBullets,
    suggestions: missingSkills.map((skill) => `Consider adding a bullet that demonstrates ${skill}.`)
  };
}

module.exports = {
  tailorResume,
  topTerms,
  extractBullets
};
