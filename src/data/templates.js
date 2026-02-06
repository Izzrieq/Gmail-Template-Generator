export const templates = [
  {
    id: "official-email",
    title: "Official Email",
    description: "Professional email for business correspondence.",
    fields: [
      { name: "recipientName", label: "Recipient Name", type: "text" },
      { name: "companyName", label: "Company Name", type: "text" },
      { name: "subject", label: "Subject", type: "text" },
      { name: "message", label: "Message Body", type: "textarea" },
      { name: "senderName", label: "Your Name", type: "text" },
      { name: "senderTitle", label: "Your Job Title", type: "text" },
    ],
    generate: (data) => `Write a professional email with the following details:

Recipient: ${data.recipientName}
Company: ${data.companyName}
Subject: ${data.subject}
Message: ${data.message}
Sender: ${data.senderName}, ${data.senderTitle}`,
  },

  {
    id: "emergency-leave",
    title: "Emergency Leave Request",
    description: "Formal emergency leave email.",
    fields: [
      { name: "managerName", label: "Manager Name", type: "text" },
      { name: "startDate", label: "Start Date", type: "date" },
      { name: "endDate", label: "End Date", type: "date" },
      { name: "reason", label: "Reason", type: "textarea" },
      { name: "senderName", label: "Your Name", type: "text" },
    ],
    generate: (data) => `Write a formal emergency leave email:

Manager: ${data.managerName}
From: ${data.senderName}
Leave period: ${data.startDate} to ${data.endDate}
Reason: ${data.reason}`,
  },

  {
    id: "annual-leave",
    title: "Annual Leave Request",
    description: "Formal request for planned annual leave.",
    fields: [
      { name: "managerName", label: "Manager Name", type: "text" },
      { name: "startDate", label: "Start Date", type: "date" },
      { name: "endDate", label: "End Date", type: "date" },
      { name: "reason", label: "Reason (Optional)", type: "textarea" },
      { name: "senderName", label: "Your Name", type: "text" },
    ],
    generate: (data) => `Write a formal annual leave request email:

Manager: ${data.managerName}
From: ${data.senderName}
Leave period: ${data.startDate} to ${data.endDate}
Reason: ${data.reason || "N/A"}`,
  },

  {
    id: "medical-leave",
    title: "Medical Leave Submission",
    description: "Email to submit a medical certificate and request leave.",
    fields: [
      { name: "managerName", label: "Manager Name", type: "text" },
      { name: "mcDate", label: "Date of MC", type: "date" },
      {
        name: "diagnosis",
        label: "Diagnosis / Reason (Optional)",
        type: "text",
      },
      { name: "senderName", label: "Your Name", type: "text" },
    ],
    generate: (data) => `Write a medical leave email:

Manager: ${data.managerName}
From: ${data.senderName}
MC Date: ${data.mcDate}
Diagnosis / Reason: ${data.diagnosis || "N/A"}`,
  },

  {
    id: "meeting-minutes",
    title: "Meeting Minutes",
    description: "Record notes and decisions from a meeting.",
    fields: [
      { name: "meetingTitle", label: "Meeting Title", type: "text" },
      { name: "date", label: "Date", type: "date" },
      { name: "attendees", label: "Attendees", type: "textarea" },
      { name: "agenda", label: "Agenda Items", type: "textarea" },
      { name: "decisions", label: "Key Decisions", type: "textarea" },
      { name: "actionItems", label: "Action Items", type: "textarea" },
    ],
    generate: (data) => `Write meeting minutes:

Meeting: ${data.meetingTitle}
Date: ${data.date}
Attendees: ${data.attendees}
Agenda: ${data.agenda}
Decisions: ${data.decisions}
Action Items: ${data.actionItems}`,
  },

  {
    id: "project-update",
    title: "Project Update",
    description: "Send a quick update on project progress.",
    fields: [
      { name: "recipientName", label: "Recipient Name", type: "text" },
      { name: "projectName", label: "Project Name", type: "text" },
      { name: "progress", label: "Progress Summary", type: "textarea" },
      { name: "nextSteps", label: "Next Steps", type: "textarea" },
      { name: "senderName", label: "Your Name", type: "text" },
    ],
    generate: (data) => `Write a project update email:

To: ${data.recipientName}
Project: ${data.projectName}
Progress: ${data.progress}
Next Steps: ${data.nextSteps}
From: ${data.senderName}`,
  },
];
