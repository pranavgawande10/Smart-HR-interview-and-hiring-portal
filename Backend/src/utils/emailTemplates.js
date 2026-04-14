export const interviewMailTemplate = ({
  candidateName,
  jobTitle,
  company,
  round,
  date,
  mode,
  result,
  message
}) => {
  return `
    <h2>Hello ${candidateName},</h2>

    <p><b>Job:</b> ${jobTitle}</p>
    <p><b>Company:</b> ${company}</p>
    <p><b>Round:</b> ${round}</p>

    ${date ? `<p><b>Date:</b> ${date}</p>` : ""}
    ${mode ? `<p><b>Mode:</b> ${mode}</p>` : ""}

    ${result ? `<p><b>Result:</b> ${result}</p>` : ""}

    <p>${message}</p>

    <br/>
    <p>Best Regards,<br/>Smart Hiring Team</p>
  `;
};