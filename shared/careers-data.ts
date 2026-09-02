export interface JobOpening {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  experience: string;
  overview: string;
  responsibilities: string[];
  requirements: string[];
}

export const JOB_OPENINGS: JobOpening[] = [
  {
    id: "ui-ux-designer",
    title: "UI / UX Designer",
    department: "Design",
    type: "Full-Time",
    location: "Madurai / Hybrid",
    experience: "1 - 3 Years",
    overview: "Seeking a creative UI/UX designer to create clean, modern web and mobile interface designs for our clients.",
    responsibilities: [
      "Design website layouts, wireframes, and prototypes in Figma.",
      "Create brand assets, logos, and visual graphics.",
      "Work closely with developers during the design handoff process.",
      "Improve existing website user flows and usability."
    ],
    requirements: [
      "Proficient in Figma and Adobe Photoshop/Illustrator.",
      "Solid understanding of typography, color theory, and layout structure.",
      "A portfolio demonstrating website or app UI design work.",
      "Ability to explain design choices clearly."
    ]
  },
  {
    id: "digital-marketing-executive",
    title: "Digital Marketing Executive",
    department: "Marketing",
    type: "Full-Time",
    location: "Madurai",
    experience: "1 - 2 Years",
    overview: "Looking for a digital marketer to handle SEO, social media marketing, and lead generation campaigns.",
    responsibilities: [
      "Manage on-page and local SEO for client websites.",
      "Create and schedule social media content across platforms.",
      "Set up and monitor Google Ads and Meta Ads campaigns.",
      "Prepare monthly traffic and engagement reports."
    ],
    requirements: [
      "Hands-on experience with SEO, Google Search Console, and Google Analytics.",
      "Experience running social media campaigns.",
      "Good written communication skills in English and Tamil.",
      "Basic knowledge of graphic design tools (Canva/Photoshop) is helpful."
    ]
  },
  {
    id: "software-trainee",
    title: "Software Developer Trainee (Intern)",
    department: "Engineering",
    type: "Internship / Fresher",
    location: "Madurai (On-site)",
    experience: "Freshers (2024 / 2025)",
    overview: "An opportunity for fresh graduates to learn and work on real-world web development projects under senior mentorship.",
    responsibilities: [
      "Learn and assist in frontend and backend web development tasks.",
      "Build reusable UI components and assist with testing.",
      "Participate in daily team standups and code reviews."
    ],
    requirements: [
      "Degree in Computer Science, IT, BCA, MCA, or self-taught coding skills.",
      "Basic understanding of JavaScript, HTML, and CSS.",
      "Eager to learn modern web frameworks like React and Node.js.",
      "Good logical thinking and dedication."
    ]
  }
];
