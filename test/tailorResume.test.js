const test = require('node:test');
const assert = require('node:assert/strict');
const { tailorResume, topTerms } = require('../lib/tailorResume');

test('topTerms returns frequent meaningful terms', () => {
  const terms = topTerms('JavaScript JavaScript APIs testing and delivery with APIs');
  assert.equal(terms[0], 'javascript');
  assert.ok(terms.includes('apis'));
});

test('tailorResume produces summary, bullets, and skills', () => {
  const result = tailorResume({
    resumeText: `
- Built internal dashboards for leadership
- Automated reporting process for sales team
- Worked with APIs and JavaScript
`,
    jobDescription: 'Need JavaScript developer with API experience and automated testing',
    onetSkills: ['Communication', 'Problem Solving']
  });

  assert.match(result.summary, /Results-driven candidate/);
  assert.ok(result.skills.length > 0);
  assert.ok(result.experienceBullets.length > 0);
  assert.ok(Array.isArray(result.suggestions));
});
