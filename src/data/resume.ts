// Single source of truth for all portfolio content. Edit freely.

export const profile = {
  name: 'Kunal Prakash Jetwani',
  nameParts: ['KUNAL', 'PRAKASH', 'JETWANI'],
  initials: 'KP',
  handle: 'KUNAL.EXE',
  roles: ['MERN STACK DEVELOPER', 'REACT & NEXT.JS SPECIALIST', 'FULL STACK PROBLEM SOLVER'],
  tagline: '2.5+ years building fast, responsive, reliable web apps',
  summary:
    'MERN Stack Developer with 2.5+ years of experience building fast, responsive, and reliable web applications. Skilled in clean UIs with React.js and Next.js, and secure backends with Node.js, Express.js, and MongoDB. Experienced in high-traffic news websites, online verification platforms, and business workflow dashboards. Enjoys clean, maintainable code, Agile teamwork, and solving practical product challenges.',
  location: 'Ahmedabad, Gujarat, India',
  locationShort: 'AHMEDABAD, IN',
  coords: { lat: 23.0225, lng: 72.5714 },
  email: 'kunaljetwani@gmail.com',
  phone: '+91 8401292124',
  phoneHref: 'tel:+918401292124',
  // Drop your PDF into /public with this exact file name.
  resumeUrl: '/Kunal_Prakash_Jetwani_Resume.pdf',
  // Replace with your real profile URLs.
  socials: {
    linkedin: 'https://www.linkedin.com/in/kunal-jetwani',
    github: 'https://github.com/kunaljetwani',
  },
}

export const highlightWords = [
  'React.js',
  'Next.js,',
  'Node.js,',
  'Express.js,',
  'MongoDB.',
  'MERN',
  '2.5+',
  'fast,',
  'secure',
  'reliable',
]

export const stats = [
  { value: '2.5+', label: 'Years Experience' },
  { value: '6+', label: 'Projects Delivered' },
  { value: '35%', label: 'Faster Frontend Development' },
  { value: '20%', label: 'Higher User Engagement' },
]

export type Skill = { name: string; level: number }
export type SkillGroup = { id: string; code: string; title: string; skills: Skill[] }

// Levels are self-assessed (0-100) and drive the progress bars.
export const skillGroups: SkillGroup[] = [
  {
    id: 'frontend',
    code: 'MOD-01',
    title: 'Frontend',
    skills: [
      { name: 'React.js', level: 94 },
      { name: 'Next.js 14', level: 88 },
      { name: 'TypeScript', level: 84 },
      { name: 'JavaScript', level: 92 },
      { name: 'Redux', level: 86 },
      { name: 'Tailwind CSS', level: 92 },
      { name: 'Bootstrap', level: 85 },
      { name: 'HTML5', level: 95 },
      { name: 'CSS3', level: 92 },
      { name: 'Angular', level: 70 },
    ],
  },
  {
    id: 'backend',
    code: 'MOD-02',
    title: 'Backend & DB',
    skills: [
      { name: 'Node.js', level: 86 },
      { name: 'Express.js', level: 86 },
      { name: 'REST APIs', level: 90 },
      { name: 'JWT Authentication', level: 85 },
      { name: 'MongoDB', level: 84 },
      { name: 'SQL', level: 72 },
      { name: 'Supabase', level: 80 },
      { name: 'Django', level: 60 },
    ],
  },
  {
    id: 'tools',
    code: 'MOD-03',
    title: 'Tools & Practices',
    skills: [
      { name: 'Git', level: 90 },
      { name: 'GitHub', level: 90 },
      { name: 'Vercel', level: 88 },
      { name: 'Netlify', level: 84 },
      { name: 'Agile/Scrum', level: 86 },
      { name: 'Code Reviews', level: 82 },
      { name: 'SEO', level: 85 },
      { name: 'Role-Based Access Control', level: 84 },
    ],
  },
]

export const experience = [
  {
    company: 'Nichetech Computer and Solutions',
    role: 'MERN Stack / Full Stack Developer',
    location: 'Ahmedabad, Gujarat',
    period: 'Dec 2023 – Present',
    current: true,
    highlights: [
      'Made frontend development 35% faster by creating modular, reusable React components',
      'Worked with a 5-member Agile team to launch responsive web apps, improving user engagement by 20%',
    ],
    stack: ['React.js', 'Next.js', 'Node.js', 'Express.js', 'MongoDB', 'TypeScript', 'Angular', 'Supabase'],
  },
]

export type ProjectVariant = 'news' | 'verify' | 'field' | 'license' | 'business'
export type Project = {
  id: string
  code: string
  title: string
  /** Short name rendered as ASCII block letters (A-Z, 0-9, &, -). */
  asciiName: string
  category: string
  subtitle: string
  stack: string[]
  linkLabel: string
  href?: string
  summary: string
  points: string[]
  variant: ProjectVariant
}

export const projects: Project[] = [
  {
    id: 'sandesh',
    code: 'MSN-01',
    title: 'Sandesh',
    asciiName: 'SANDESH',
    category: 'NEWS / MEDIA',
    subtitle: 'News Publishing Website',
    stack: ['React.js', 'SEO', 'REST APIs', 'Payment Gateway', 'Admin Dashboard'],
    linkLabel: 'sandesh.com',
    href: 'https://sandesh.com',
    summary: 'High-traffic news platform with fast article reading and a full publishing admin.',
    points: [
      'Built responsive article reading interfaces and improved page speed for better Google rankings.',
      'Developed a full Admin Panel to manage news events, track payments, filter transaction reports, and handle user permissions.',
    ],
    variant: 'news',
  },
  {
    id: 'brightcheck',
    code: 'MSN-02',
    title: 'BrightCheck',
    asciiName: 'BRIGHTCHECK',
    category: 'VERIFICATION / SAAS',
    subtitle: 'Online Background Verification Platform',
    stack: ['React.js', 'Redux', 'TypeScript', 'Tailwind CSS'],
    linkLabel: 'Admin & User Apps',
    summary: 'Verification platform covering identity, contact traces and fraud checks.',
    points: [
      'Built real-time background check screens with identity verification, contact traces, and fraud checks.',
      'Created dynamic forms with instant validation, autofill, and Redux-managed state.',
    ],
    variant: 'verify',
  },
  {
    id: 'smartonsite',
    code: 'MSN-03',
    title: 'SmartOnSite',
    asciiName: 'SMARTONSITE',
    category: 'FIELD OPERATIONS',
    subtitle: 'Field Staff & Service Management',
    stack: ['Angular', 'TypeScript', 'Node.js', 'REST APIs', 'JWT'],
    linkLabel: 'smartonsite.in',
    href: 'https://smartonsite.in',
    summary: 'Field operations suite with live GPS attendance and a secure CMS dashboard.',
    points: [
      'Implemented live GPS attendance, daily check-in/out, and field worker expense tracking.',
      'Built a secure CMS admin dashboard with JWT auth to monitor tickets, tasks, and field operations.',
    ],
    variant: 'field',
  },
  {
    id: 'litmus',
    code: 'MSN-04',
    title: 'Litmus',
    asciiName: 'LITMUS',
    category: 'ENTERPRISE PLATFORM',
    subtitle: 'Organisation & License Management Platform',
    stack: ['Next.js 14', 'React.js', 'TypeScript', 'Supabase', 'Vercel'],
    linkLabel: 'Live Platform',
    summary: 'Enterprise platform for domains, software licenses and office locations.',
    points: [
      'Delivered enterprise features to classify company domains, manage software licenses, and track office locations.',
      'Implemented secure auth, role-based access, audit logs, and automated Vercel deployments.',
    ],
    variant: 'license',
  },
  {
    id: 'business',
    code: 'MSN-05',
    title: 'Heal Construct & Khatri Engineering',
    asciiName: 'HEAL & KHATRI',
    category: 'CLIENT WEBSITES',
    subtitle: 'Business Websites',
    stack: ['MongoDB', 'Express.js', 'React.js', 'Node.js'],
    linkLabel: 'Client Websites',
    summary: 'Complete MERN business websites with custom admin panels.',
    points: [
      'Built complete business websites with custom admin panels to update projects, showcase reviews, and capture inquiries.',
    ],
    variant: 'business',
  },
]

export const education = [
  {
    code: 'DATASET-01',
    title: 'MCA',
    full: 'Master of Computer Applications',
    institute: 'Dr. Babasaheb Ambedkar Open University',
    period: '2025 – 2027',
    status: 'PURSUING',
    detail: 'Advanced computer applications, software engineering and systems.',
  },
  {
    code: 'DATASET-02',
    title: 'B.Com',
    full: 'Bachelor of Commerce',
    institute: 'Asia Pacific Institute of Management',
    period: 'Graduated Apr 2021',
    status: '60%',
    detail: 'Business fundamentals that inform product and workflow thinking.',
  },
  {
    code: 'DATASET-03',
    title: 'Full Stack',
    full: 'Full Stack Web Development Certification',
    institute: 'Coding Invaders',
    period: 'Certification',
    status: 'CERTIFIED',
    detail: 'End-to-end MERN development: UI, APIs, databases and deployment.',
  },
]

export const marqueeA = ['REACT.JS', 'NEXT.JS 14', 'TYPESCRIPT', 'NODE.JS', 'EXPRESS.JS', 'MONGODB', 'REDUX', 'TAILWIND CSS', 'SUPABASE', 'REST APIS', 'JWT']
export const marqueeB = ['ANGULAR', 'SQL', 'DJANGO', 'GIT', 'VERCEL', 'NETLIFY', 'AGILE / SCRUM', 'SEO', 'RBAC', 'CODE REVIEWS']

export const navLinks = [
  { id: 'about', label: 'Profile' },
  { id: 'skills', label: 'Modules' },
  { id: 'experience', label: 'Mission Log' },
  { id: 'projects', label: 'Deployments' },
  { id: 'education', label: 'Training' },
  { id: 'contact', label: 'Connect' },
]
