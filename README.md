# Resume Builder for Skills

This project is now a JavaScript web app where a user can paste:

1. A job description
2. Their current resume
3. (Optional) a job title for O*NET skills lookup

…and get back a tailored resume draft with:

- A targeted summary
- Suggested skills
- Rewritten experience bullets
- Suggestions for missing skills

## Why O*NET

If you provide O*NET Web Services credentials, the app will try to pull occupation-related skill data from O*NET and blend those skills into the output.

If credentials are not provided (or the lookup fails), the app automatically falls back to local skill lists.

## Run locally

```bash
npm install
npm start
```

Open: `http://localhost:3000`

## Optional O*NET setup

Set these environment variables before starting the app:

```bash
export ONET_USERNAME="your_onet_username"
export ONET_PASSWORD="your_onet_password"
```

Then run:

```bash
npm start
```

## API endpoint

`POST /api/tailor`

Body:

```json
{
  "jobTitle": "software developer",
  "jobDescription": "...",
  "resumeText": "..."
}
```

## Tests

```bash
npm test
```
