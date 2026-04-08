async function generate() {
  const jobTitle = document.getElementById('jobTitle').value;
  const jobDescription = document.getElementById('jobDescription').value;
  const resumeText = document.getElementById('resumeText').value;

  const response = await fetch('/api/tailor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobTitle, jobDescription, resumeText })
  });

  const data = await response.json();

  if (!response.ok) {
    alert(data.error || 'Unable to generate tailored resume.');
    return;
  }

  document.getElementById('result').classList.remove('hidden');
  document.getElementById('sourceLine').textContent = `Skills source: ${data.source}${
    data.sourceNote ? ` (${data.sourceNote})` : ''
  }`;
  document.getElementById('summary').textContent = data.summary;

  for (const [id, values] of [
    ['skills', data.skills],
    ['bullets', data.experienceBullets],
    ['suggestions', data.suggestions]
  ]) {
    const el = document.getElementById(id);
    el.innerHTML = '';
    values.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      el.appendChild(li);
    });
  }
}

document.getElementById('generateBtn').addEventListener('click', () => {
  generate().catch((error) => alert(error.message));
});
