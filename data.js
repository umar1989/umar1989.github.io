/* ============================================================
   THE ONLY FILE YOU NEED TO EDIT.
   Change text here, save, and run ./publish.sh (or let the
   Claude Code hook do it) – the website updates on GitHub Pages.

   "for": ["teacher","coordinator","principal"]
      → the line is shown only in those role views.
      Leave "for" out and the line shows in every view.
   ============================================================ */
window.RESUME = {
  name: "A. Umarmukthar",
  location: "Tiruppur, Tamil Nadu, India",
  email: "inbox@umarmukthar.in",
  phone: "+91 89032 18627",
  links: [
    // { label: "LinkedIn", url: "https://linkedin.com/in/your-id" },
  ],

  /* ---------- Role views (the "dynamic" part) ----------
     Add a new role by copying one block. It appears as a button
     automatically and works at  ?role=your-key                */
  defaultRole: "teacher",
  roles: {
    teacher: {
      label: "Teacher",
      headline: "Physics Teacher (TGT) · Classes 9 & 10 · CBSE & IIT Foundation",
      summary:
        "Experienced Physics teacher for classes 9 and 10 with a strong CBSE background. Known for engaging students through practical demonstrations, real-life applications and a focus on conceptual understanding and problem-solving. Committed to improving learning outcomes and preparing students for higher academic challenges.",
      sections: ["experience", "skills", "education", "achievements", "languages"],
    },
    coordinator: {
      label: "Coordinator",
      headline: "Physics Faculty & Grade Coordinator · Curriculum · Teacher Training",
      summary:
        "Physics educator with hands-on experience as Grade Coordinator. Has designed and rolled out curriculum strategies, trained fellow teachers through workshops, organised remedial programmes and used continuous assessment to track student progress across grades.",
      sections: ["experience", "skills", "achievements", "education", "languages"],
    },
    principal: {
      label: "Principal / Academic Head",
      headline: "Academic Leadership · Curriculum Development · Staff Mentoring",
      summary:
        "Educator with 8+ years across four CBSE/matriculation schools, combining classroom excellence with academic leadership: curriculum enhancement, teacher training, grade coordination, student mentoring and competition preparation. Holds M.Sc. Physics and B.Ed.",
      sections: ["experience", "achievements", "skills", "education", "languages"],
    },
    full: {
      label: "Full résumé",
      headline: "Physics Teacher · Grade Coordinator · Curriculum Developer",
      summary:
        "Experienced and dynamic Physics educator with a robust CBSE background, innovative teaching methods, and experience in coordination, curriculum development and teacher training.",
      sections: ["experience", "skills", "education", "achievements", "languages"],
    },
  },

  /* ---------- Experience ---------- */
  experience: [
    {
      title: "Physics Faculty & IIT Foundation Teacher",
      org: "Royal International School",
      place: "Komarapalayam, Tamil Nadu",
      from: "2023", to: "Present",
      bullets: [
        { t: "Teach Physics to classes 9 and 10, aligning lessons with CBSE standards.", for: ["teacher", "principal"] },
        { t: "Implement interactive learning strategies and continuous assessments to monitor student progress.", for: ["teacher", "coordinator"] },
        { t: "Enhance student interest and understanding through practical demonstrations and real-life applications.", for: ["teacher"] },
      ],
    },
    {
      title: "Physics Faculty",
      org: "Apple Perks International School",
      place: "Kolathur, Tamil Nadu",
      from: "2022", to: "2023",
      bullets: [
        { t: "Provided targeted instruction in Physics, significantly improving students' performance in competitive exams.", for: ["teacher", "principal"] },
        { t: "Developed and used digital resources to create a more engaging learning environment.", for: ["teacher", "coordinator"] },
      ],
    },
    {
      title: "Physics Faculty",
      org: "Vivekanandam Vidyashram CBSE School",
      place: "Thiruvarur, Tamil Nadu",
      from: "2019", to: "2021",
      bullets: [
        { t: "Led curriculum-enhancement initiatives that raised student engagement and exam scores.", for: ["coordinator", "principal"] },
        { t: "Mentored students for national-level science competitions, achieving several accolades.", for: ["teacher", "coordinator", "principal"] },
      ],
    },
    {
      title: "Physics Faculty & Grade Coordinator",
      org: "NR Public School",
      place: "Udayarpalayam, Tamil Nadu",
      from: "2017", to: "2019",
      bullets: [
        { t: "Orchestrated the development and implementation of innovative curriculum strategies.", for: ["coordinator", "principal"] },
        { t: "Conducted workshops and training sessions for fellow teachers on effective teaching techniques.", for: ["coordinator", "principal"] },
      ],
    },
  ],

  /* ---------- Skills ---------- */
  skills: [
    { name: "Physics Education", for: ["teacher", "principal"], items: [
      "Conveys complex concepts in an understandable manner",
      "Prepares students for CBSE board exams and competitive tests",
    ]},
    { name: "Curriculum Development", for: ["coordinator", "principal", "teacher"], items: [
      "Designs and updates curriculum to meet changing educational standards and student needs",
    ]},
    { name: "Teacher Training & Coordination", for: ["coordinator", "principal"], items: [
      "Workshops and training sessions for fellow teachers",
      "Grade-level coordination and planning",
    ]},
    { name: "Mentorship", items: [
      "Guides students through academic and personal development",
      "Organises remedial classes for students needing extra support",
    ]},
    { name: "Technology Integration", for: ["teacher", "coordinator"], items: [
      "Uses technology in the classroom to enhance learning experiences and outcomes",
    ]},
  ],

  /* ---------- Education ---------- */
  education: [
    { year: "2014", degree: "B.Ed. Physical Science", school: "Institute of Advanced Study in Education, Tamil Nadu", score: "73.12%" },
    { year: "2013", degree: "M.Sc. Physics", school: "Government Arts College, Udumalpet, Tamil Nadu", score: "71.95%" },
    { year: "2010", degree: "B.Sc. Physics", school: "Government Arts College, Udumalpet, Tamil Nadu", score: "68.93%" },
    { year: "2010", degree: "Diploma in Instrumentation", school: "Government Arts College, Udumalpet, Tamil Nadu", score: "70.5%", for: ["full"] },
    { year: "2007", degree: "HSC", school: "Government Higher Secondary School, Dharapuram, Tamil Nadu", score: "71.5%", for: ["full"] },
    { year: "2005", degree: "SSLC", school: "Lions Matriculation School, Dharapuram, Tamil Nadu", score: "70.18%", for: ["full"] },
  ],

  /* ---------- Certifications & achievements ---------- */
  achievements: [
    { title: "NCC Certified – A, B and C", detail: "Discipline & leadership training", for: ["coordinator", "principal", "teacher"] },
    { title: "Chess – Second place", detail: "Inter-college competition" },
  ],

  languages: [
    { name: "Tamil", level: "Fluent (read, write, speak)" },
    { name: "English", level: "Fluent (read, write, speak)" },
  ],

  /* Shown only if you fill it in. Hidden by default for privacy. */
  references: [
    // { name: "Shama Begam", role: "Ex-Principal, NR Public School, Udayarpalayam", contact: "On request" },
  ],
};
