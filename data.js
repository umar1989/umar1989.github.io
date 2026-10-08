/* =====================================================================
   data.js - THE ONLY FILE YOU NEED TO EDIT TO CHANGE CONTENT.
   The page (script.js) renders entirely from window.RESUME below.
   Source of truth: resume.pdf. Do not add facts that are not in it.

   HOW SELECTION WORKS
   Every bullet, skill, featured item and project carries a `roles` map:
       roles: { pgt: 1, tgt: 2 }
   - A role key present  -> the item is shown for that role.
   - A role key missing  -> the item is hidden for that role.
   - The number is the PRIORITY for that role: 1 = first, bigger = later.
     Ties keep the order the items have in this file.
   - A skill may use { p: 1, name: "Other label" } to rename itself for
     one role (the description stays the same).
   The "default" role shows everything, in the order written here.
   ===================================================================== */
window.RESUME = {

  /* ---------- Fixed facts: identical in every role view ---------- */
  profile: {
    name: "A. Umarmukthar",
    initials: "AU",                         // shown in the avatar (no photo supplied)
    photo: "",                              // e.g. "assets/photo.jpg" - when set, replaces the initials
    location: "Tiruppur, Tamil Nadu, India",
    email: "inbox@umarmukthar.in",
    phone: "+91 89032 18627",
    whatsapp: "918903218627",               // digits only, with country code
    siteUrl: "https://umarmukthar.in/",     // used for canonical/Open Graph tags in index.html
    languages: [
      { name: "Tamil",   level: "Fluent (read, write, speak)" },
      { name: "English", level: "Fluent (read, write, speak)" },
    ],
  },

  education: [
    { year: "2014", degree: "B.Ed. Physical Science",     school: "Institute of Advanced Study in Education, Tamil Nadu",          score: "73.12%" },
    { year: "2013", degree: "M.Sc. Physics",              school: "Government Arts College, Udumalpet, Tamil Nadu",                score: "71.95%" },
    { year: "2010", degree: "B.Sc. Physics",              school: "Government Arts College, Udumalpet, Tamil Nadu",                score: "68.93%" },
    { year: "2010", degree: "Diploma in Instrumentation", school: "Government Arts College, Udumalpet, Tamil Nadu",                score: "70.5%"  },
    { year: "2007", degree: "HSC",                        school: "Government Higher Secondary School, Dharapuram, Tamil Nadu",    score: "71.5%"  },
    { year: "2005", degree: "SSLC",                       school: "Lions Matriculation School, Dharapuram, Tamil Nadu",            score: "70.18%" },
  ],

  certifications: [
    { title: "NCC Certified - A, B and C", issuer: "National Cadet Corps" },
    { title: "Second place, inter-college chess competition", issuer: "Chess" },
  ],

  /* ---------- Jobs: same jobs and dates in every role ----------
     Bullets live in `bullets` below and point back here via `job`.
     `duration` is optional (the resume gives years only, so it is
     left out rather than guessed) - add e.g. duration: "2 yrs" if you want it. */
  jobs: [
    { id: "royal",  title: "Physics Faculty & IIT Foundation Teacher", org: "Royal International School",          place: "Komarapalayam, Tamil Nadu", from: "2023", to: "Present" },
    { id: "apple",  title: "Physics Faculty",                          org: "Apple Perks International School",    place: "Kolathur, Tamil Nadu",      from: "2022", to: "2023" },
    { id: "viv",    title: "Physics Faculty",                          org: "Vivekanandam Vidyashram CBSE School", place: "Thiruvarur, Tamil Nadu",    from: "2019", to: "2021" },
    { id: "nr",     title: "Physics Faculty & Grade Coordinator",      org: "NR Public School",                    place: "Udayarpalayam, Tamil Nadu", from: "2017", to: "2019" },
  ],

  /* ---------- Master list: experience bullets ---------- */
  bullets: [
    { job: "royal", text: "Specialize in teaching Physics to classes 9 and 10, aligning lessons with CBSE standards.",
      roles: { tgt: 1, pgt: 2, foundation: 2, coordinator: 2, principal: 2 } },
    { job: "royal", text: "Implement interactive learning strategies and continuous assessments to monitor student progress.",
      roles: { tgt: 1, pgt: 1, foundation: 1, coordinator: 1, principal: 2, scrum: 2 } },
    { job: "royal", text: "Enhance student interest and understanding through practical demonstrations and real-life applications.",
      roles: { tgt: 1, pgt: 1, foundation: 2 } },

    { job: "apple", text: "Provided targeted instruction in Physics, significantly improving students' performance in competitive exams.",
      roles: { tgt: 2, pgt: 1, foundation: 1, coordinator: 2, principal: 2 } },
    { job: "apple", text: "Developed and utilized digital resources to facilitate a more engaging learning environment.",
      roles: { tgt: 2, pgt: 2, coordinator: 2, scrum: 2 } },

    { job: "viv",   text: "Led initiatives for curriculum enhancement that resulted in higher student engagement and improved exam scores.",
      roles: { tgt: 2, pgt: 2, foundation: 1, coordinator: 1, principal: 1, scrum: 2 } },
    { job: "viv",   text: "Mentored students in preparation for national-level science competitions, achieving several accolades.",
      roles: { tgt: 2, pgt: 1, foundation: 1, coordinator: 2, principal: 2 } },

    { job: "nr",    text: "Orchestrated the development and implementation of innovative curriculum strategies.",
      roles: { foundation: 2, coordinator: 1, principal: 1, scrum: 2 } },
    { job: "nr",    text: "Conducted workshops and training sessions for fellow teachers on effective teaching techniques.",
      roles: { foundation: 2, coordinator: 1, principal: 1, scrum: 1 } },
  ],

  /* ---------- Master list: skills ---------- */
  skills: [
    { id: "physics",   name: "Physics Education",
      desc: "Deep subject understanding; conveys complex concepts in an understandable manner.",
      roles: { tgt: 1, pgt: 1, foundation: 1, coordinator: 2, principal: 2 } },
    { id: "exam",      name: "CBSE Board & Competitive-Exam Preparation",
      desc: "Strong experience preparing students for CBSE board examinations and competitive tests.",
      roles: { tgt: 1, pgt: 1, foundation: 1, coordinator: 2, principal: 2 } },
    { id: "practical", name: "Practical Demonstrations",
      desc: "Real-life applications that build student interest and understanding.",
      roles: { tgt: 1, pgt: 2, foundation: 3 } },
    { id: "assess",    name: "Continuous Assessment",
      desc: "Interactive learning strategies and assessments to monitor student progress.",
      roles: { tgt: 2, pgt: 2, foundation: 2, coordinator: 1, principal: 2, scrum: { p: 3, name: "Progress Tracking" } } },
    { id: "found",     name: "IIT Foundation Teaching",
      desc: "Physics Faculty & IIT Foundation Teacher, Royal International School (2023 - present).",
      roles: { pgt: 3, foundation: 1 } },
    { id: "comp",      name: "Competition Mentoring",
      desc: "Mentored students for national-level science competitions, achieving several accolades.",
      roles: { tgt: 3, pgt: 2, foundation: 1, principal: 3 } },
    { id: "curr",      name: "Curriculum Development",
      desc: "Designs and updates curriculum to meet changing educational standards and student needs.",
      roles: { tgt: 3, pgt: 3, foundation: 2, coordinator: 1, principal: 1, scrum: 2 } },
    { id: "train",     name: "Teacher Training",
      desc: "Conducted workshops and training sessions for fellow teachers.",
      roles: { foundation: 3, coordinator: 1, principal: 1, scrum: { p: 1, name: "Workshop Facilitation" } } },
    { id: "grade",     name: "Grade Coordination",
      desc: "Grade Coordinator, NR Public School (2017 - 2019).",
      roles: { coordinator: 1, principal: 1, scrum: 1 } },
    { id: "mentor",    name: "Student Mentorship",
      desc: "Guides students through academic and personal development.",
      roles: { tgt: 1, pgt: 3, foundation: 3, coordinator: 2, principal: 2, scrum: 3 } },
    { id: "remedial",  name: "Remedial Classes",
      desc: "Experience organising remedial classes for students requiring additional support.",
      roles: { tgt: 2, coordinator: 3, principal: 3 } },
    { id: "tech",      name: "Technology Integration",
      desc: "Incorporates technology and digital resources into the classroom to enhance learning.",
      roles: { tgt: 3, pgt: 3, coordinator: 3, principal: 3, scrum: 3 } },
  ],

  /* ---------- Master list: Featured (top 3 per role are shown) ---------- */
  featured: [
    { id: "found",    title: "IIT Foundation Teacher",
      text: "Physics Faculty & IIT Foundation Teacher at Royal International School, 2023 - present.",
      roles: { foundation: 1, pgt: 3, tgt: 3 } },
    { id: "comp",     title: "National-level science competitions",
      text: "Mentored students for national-level science competitions, achieving several accolades. Vivekanandam Vidyashram CBSE School, 2019 - 2021.",
      roles: { tgt: 1, pgt: 1, foundation: 2 } },
    { id: "exam",     title: "Competitive-exam performance",
      text: "Targeted Physics instruction that significantly improved students' performance in competitive exams. Apple Perks International School, 2022 - 2023.",
      roles: { tgt: 1, pgt: 2, foundation: 3 } },
    { id: "grade",    title: "Grade Coordinator",
      text: "Physics Faculty & Grade Coordinator, NR Public School, 2017 - 2019.",
      roles: { coordinator: 1, principal: 1, scrum: 1 } },
    { id: "workshop", title: "Teacher-training workshops",
      text: "Conducted workshops and training sessions for fellow teachers on effective teaching techniques.",
      roles: { coordinator: 2, principal: 2, scrum: 2 } },
    { id: "curr",     title: "Curriculum enhancement",
      text: "Led curriculum-enhancement initiatives that resulted in higher student engagement and improved exam scores.",
      roles: { coordinator: 3, principal: 3, scrum: 3, foundation: 4 } },
    { id: "ncc",      title: "NCC A, B and C certified",
      text: "National Cadet Corps certifications at all three levels.",
      roles: { principal: 4 } },
  ],

  /* ---------- Projects ----------
     Empty because the resume lists none. The Projects card is hidden
     until you add some. Example:
     { title: "...", text: "...", link: "https://...", roles: { pgt: 1, principal: 2 } } */
  projects: [],

  /* ---------- Per-role configuration ----------
     To add a role: copy one block, give it a new key (the ?role= value).
     label        name in the role switcher
     aliases      other ?role= values that also work
     headline     line under the name
     about        3-4 line About text
     sections     section order: about, featured, experience, education,
                  certifications, skills, projects
     skillGroups  headings and the skills (by id) under each, in order;
                  skills tagged for the role but not listed land in "More skills"
     showAll      true -> ignore the `roles` tags and show everything       */
  defaultRole: "default",
  roles: {
    default: {
      label: "General profile",
      headline: "Physics Teacher · Grade Coordinator · Curriculum Developer",
      about:
        "Experienced and dynamic Physics educator specializing in classes 9 and 10, with a robust background in the CBSE curriculum. " +
        "Known for engaging students through innovative teaching methodologies and a strong focus on conceptual understanding and problem-solving. " +
        "Committed to enhancing student learning outcomes and preparing them for higher academic challenges.",
      sections: ["about", "featured", "experience", "education", "certifications", "skills", "projects"],
      showAll: true,
      skillGroups: [
        { title: "Teaching",    ids: ["physics", "exam", "practical", "found", "assess"] },
        { title: "Leadership",  ids: ["curr", "train", "grade", "comp"] },
        { title: "Student support", ids: ["mentor", "remedial", "tech"] },
      ],
    },

    tgt: {
      label: "TGT Physics / Physical Science",
      aliases: ["tgt-physics", "teacher"],
      headline: "Physics Teacher (TGT) · Classes 9-10 · CBSE · Practical, Concept-First Teaching",
      about:
        "Physics teacher working in CBSE schools since 2017, currently teaching classes 9 and 10. " +
        "I teach through practical demonstrations and real-life applications so students understand the concept before the formula. " +
        "Continuous assessment lets me track progress and support students who need extra help. " +
        "M.Sc. Physics and B.Ed. Physical Science.",
      sections: ["about", "featured", "experience", "skills", "education", "certifications", "projects"],
      skillGroups: [
        { title: "Classroom teaching",  ids: ["physics", "practical", "exam"] },
        { title: "Assessment & support", ids: ["assess", "remedial", "mentor"] },
        { title: "Beyond the syllabus", ids: ["comp", "curr", "tech"] },
      ],
    },

    pgt: {
      label: "PGT Physics",
      aliases: ["pgt-physics"],
      headline: "Physics Teacher · CBSE Board and Competitive-Exam Preparation",
      about:
        "M.Sc. Physics and B.Ed. graduate who has taught Physics in four schools since 2017. " +
        "I have prepared students for CBSE board examinations and competitive tests, and mentored them for national-level science competitions. " +
        "My focus is conceptual clarity and problem-solving, backed by practical demonstration and continuous assessment.",
      sections: ["about", "featured", "experience", "skills", "education", "certifications", "projects"],
      skillGroups: [
        { title: "Exam preparation", ids: ["exam", "found", "comp"] },
        { title: "Teaching",         ids: ["physics", "practical", "assess"] },
        { title: "Support",          ids: ["mentor", "curr", "tech"] },
      ],
    },

    foundation: {
      label: "IIT/NEET Foundation Coordinator",
      aliases: ["iit", "neet", "iit-neet"],
      headline: "Physics Faculty & IIT Foundation Teacher · Competitive-Exam Preparation",
      about:
        "I currently teach as Physics Faculty & IIT Foundation Teacher at Royal International School. " +
        "My earlier instruction significantly improved students' competitive-exam performance, and I have mentored students for national-level science competitions with several accolades. " +
        "I build teaching around conceptual depth and problem-solving, with continuous assessment to track progress.",
      sections: ["about", "featured", "experience", "skills", "education", "certifications", "projects"],
      skillGroups: [
        { title: "Foundation & exam preparation", ids: ["found", "exam", "comp"] },
        { title: "Teaching",                      ids: ["physics", "assess", "practical"] },
        { title: "Programme building",            ids: ["curr", "train", "mentor"] },
      ],
    },

    coordinator: {
      label: "Academic Coordinator",
      aliases: ["academic", "academic-coordinator"],
      headline: "Physics Faculty & Grade Coordinator · Curriculum · Teacher Training",
      about:
        "Physics educator who served as Grade Coordinator at NR Public School. " +
        "I developed curriculum strategies, conducted workshops and training sessions for fellow teachers, and led curriculum-enhancement initiatives that raised student engagement and exam scores. " +
        "I use continuous assessment to track student progress.",
      sections: ["about", "featured", "experience", "skills", "certifications", "education", "projects"],
      skillGroups: [
        { title: "Academic coordination", ids: ["grade", "curr", "assess"] },
        { title: "Staff development",     ids: ["train"] },
        { title: "Teaching & student support", ids: ["physics", "exam", "mentor", "remedial", "tech"] },
      ],
    },

    principal: {
      label: "Vice Principal / Principal",
      aliases: ["vp", "vice-principal", "head"],
      headline: "Educator & Academic Leader · Curriculum Development · Staff Training · Student Mentoring",
      about:
        "Physics educator with experience in four CBSE and matriculation-board schools, including a Grade Coordinator post. " +
        "My leadership experience is in curriculum development, training fellow teachers and mentoring students. " +
        "NCC A, B and C certified. M.Sc. Physics and B.Ed. Physical Science.",
      sections: ["about", "featured", "experience", "skills", "certifications", "education", "projects"],
      skillGroups: [
        { title: "Academic leadership", ids: ["grade", "curr", "train"] },
        { title: "Teaching quality",    ids: ["assess", "physics", "exam"] },
        { title: "Students",            ids: ["mentor", "comp", "remedial", "tech"] },
      ],
    },

    scrum: {
      label: "Scrum Master / Project Manager",
      aliases: ["pm", "project-manager", "scrum-master"],
      headline: "Educator & Grade Coordinator · Workshop Facilitation · Progress Tracking",
      about:
        "Teacher and former Grade Coordinator experienced in running workshops and training sessions for colleagues and tracking progress through continuous assessment. " +
        "I have led curriculum initiatives that resulted in higher engagement and improved exam scores, and developed and used digital resources for a more engaging learning environment.",
      sections: ["about", "featured", "experience", "skills", "certifications", "education", "projects"],
      skillGroups: [
        { title: "Facilitation & coordination", ids: ["train", "grade"] },
        { title: "Delivery & improvement",      ids: ["curr", "assess", "tech"] },
        { title: "People",                      ids: ["mentor"] },
      ],
    },
  },
};
