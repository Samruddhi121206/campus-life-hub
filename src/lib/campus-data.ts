export type EventCategory = "Technical" | "Workshop" | "Hackathon" | "Cultural";

export interface CampusEvent {
  id: string;
  title: string;
  category: EventCategory;
  description: string;
  date: string; // ISO
  endDate: string;
  venue: string;
  club: string;
  seatsLeft: number;
  free: boolean;
  image: string;
  speakers: { name: string; title: string; avatar: string }[];
  agenda: { time: string; item: string }[];
}

export interface Club {
  id: string;
  name: string;
  category: "Technical" | "Cultural" | "Sports" | "Social";
  blurb: string;
  about: string;
  members: number;
  logo: string;
  banner: string;
  gallery: string[];
  email: string;
  instagram: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  category: "Academic" | "Event" | "Deadline" | "General";
  urgent: boolean;
  pinned: boolean;
  postedAt: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  department: string;
  events: number;
  certificates: number;
  points: number;
  avatar: string;
  isMe?: boolean;
}

const img = (seed: string) => `https://picsum.photos/seed/${seed}/800/450`;
const face = (seed: string) => `https://i.pravatar.cc/150?u=${seed}`;

const day = (offset: number, hour = 10) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};
const plusHours = (iso: string, h: number) =>
  new Date(new Date(iso).getTime() + h * 3600_000).toISOString();

function mkEvent(
  id: string,
  title: string,
  category: EventCategory,
  offset: number,
  hour: number,
  venue: string,
  club: string,
  seatsLeft: number,
  free: boolean,
  description: string,
): CampusEvent {
  const date = day(offset, hour);
  return {
    id,
    title,
    category,
    description,
    date,
    endDate: plusHours(date, 4),
    venue,
    club,
    seatsLeft,
    free,
    image: img(id),
    speakers: [
      { name: "Dr. Aparna Rao", title: "Professor, CSE", avatar: face(id + "a") },
      { name: "Rohan Mehta", title: "Engineer, Infra Labs", avatar: face(id + "b") },
    ],
    agenda: [
      { time: "10:00", item: "Registration & welcome kit" },
      { time: "10:30", item: "Keynote session" },
      { time: "12:00", item: "Hands-on track" },
      { time: "14:00", item: "Closing & certificates" },
    ],
  };
}

export const events: CampusEvent[] = [
  mkEvent("ai-summit", "Campus AI Summit 2026", "Technical", 2, 10, "Main Auditorium", "IEEE Student Chapter", 42, true, "A full-day summit on applied machine learning, with talks from industry researchers and a student project showcase."),
  mkEvent("hack-48", "HackNova 48-Hour Hackathon", "Hackathon", 6, 9, "Innovation Block", "Coding Club", 18, false, "Build, break and ship in 48 hours. Themes drop at kickoff. Mentors on site all weekend."),
  mkEvent("robo-war", "RoboWars Arena Finals", "Technical", 9, 15, "Sports Complex", "Robotics Club", 60, true, "Combat robots designed by student teams battle it out in the arena finals."),
  mkEvent("ui-workshop", "UI/UX Design Sprint Workshop", "Workshop", 1, 14, "Design Studio, B-204", "Entrepreneurship Cell", 7, false, "A hands-on sprint from problem framing to clickable prototype in a single afternoon."),
  mkEvent("cloud-lab", "Cloud & DevOps Lab Day", "Workshop", 4, 11, "Lab 3, IT Block", "ISA", 25, true, "Deploy your first containerised service and set up a CI pipeline from scratch."),
  mkEvent("cultural-night", "Rhythm — Cultural Night", "Cultural", 12, 18, "Open Air Theatre", "Music & Arts Club", 200, true, "An evening of music, dance and drama performances from across departments."),
  mkEvent("startup-pitch", "Startup Pitch Arena", "Technical", 15, 13, "Seminar Hall 1", "Entrepreneurship Cell", 30, false, "Ten student startups pitch to a panel of investors and alumni founders."),
  mkEvent("iot-bootcamp", "IoT Bootcamp with ESP32", "Workshop", 8, 10, "Embedded Lab", "IEEE Student Chapter", 12, false, "Sensors, MQTT and dashboards — build a connected device end to end."),
  mkEvent("datathon", "Datathon: Campus Analytics", "Hackathon", 20, 9, "Central Library Hall", "Coding Club", 48, true, "Turn anonymised campus datasets into insights within 12 hours."),
  mkEvent("photo-walk", "Heritage Photo Walk", "Cultural", 3, 7, "College Gate", "Music & Arts Club", 15, true, "An early morning walk through the old campus quarters with a photography mentor."),
  mkEvent("sports-meet", "Inter-Department Sports Meet", "Cultural", 25, 8, "Athletics Ground", "Sports Committee", 300, true, "Track, field and team events across every department, all week long."),
  mkEvent("cyber-ctf", "CyberSec Capture The Flag", "Hackathon", 11, 16, "Network Lab", "ISA", 22, false, "Six hours, forty flags, one scoreboard. Beginners track included."),
  mkEvent("resume-clinic", "Placement Resume Clinic", "Workshop", -2, 11, "Placement Cell", "ISA", 0, true, "One-on-one resume reviews with the placement team ahead of the drive season."),
  mkEvent("quantum-talk", "Guest Talk: Quantum Computing", "Technical", 5, 17, "Seminar Hall 2", "IEEE Student Chapter", 80, true, "An accessible introduction to qubits, gates and where the field actually stands."),
  mkEvent("open-mic", "Open Mic & Poetry Slam", "Cultural", 7, 19, "Cafeteria Lawn", "Music & Arts Club", 40, true, "Sign up on the spot and take the mic — poetry, standup, acoustic sets."),
];

export const clubs: Club[] = [
  { id: "ieee", name: "IEEE Student Chapter", category: "Technical", blurb: "Research talks, paper writing and technical certifications.", about: "The IEEE Student Chapter connects students with the global engineering community through talks, workshops, publications and competitions across every branch.", members: 412, logo: img("ieee-logo"), banner: img("ieee-banner"), gallery: [img("ieee1"), img("ieee2"), img("ieee3")], email: "ieee@campus.edu", instagram: "@ieee.campus" },
  { id: "isa", name: "ISA — Instrumentation Society", category: "Technical", blurb: "Automation, control systems and industry visits.", about: "ISA runs the automation and control systems community on campus, with lab days, plant visits and a strong placement-prep track.", members: 268, logo: img("isa-logo"), banner: img("isa-banner"), gallery: [img("isa1"), img("isa2"), img("isa3")], email: "isa@campus.edu", instagram: "@isa.campus" },
  { id: "coding", name: "Coding Club", category: "Technical", blurb: "Weekly contests, hackathons and open source sprints.", about: "From your first for-loop to shipping open source, the Coding Club runs contests, peer mentoring circles and the flagship HackNova hackathon.", members: 630, logo: img("coding-logo"), banner: img("coding-banner"), gallery: [img("cc1"), img("cc2"), img("cc3")], email: "code@campus.edu", instagram: "@coding.campus" },
  { id: "robotics", name: "Robotics Club", category: "Technical", blurb: "Combat bots, drones and autonomous rovers.", about: "The Robotics Club builds competitive machines year round — combat bots, line followers, drones and an autonomous rover team.", members: 194, logo: img("robo-logo"), banner: img("robo-banner"), gallery: [img("rb1"), img("rb2"), img("rb3")], email: "robotics@campus.edu", instagram: "@robotics.campus" },
  { id: "music-arts", name: "Music & Arts Club", category: "Cultural", blurb: "Bands, theatre, dance and the annual cultural night.", about: "Home to the campus band, theatre troupe and dance crews. If it happens on a stage here, this club built it.", members: 355, logo: img("music-logo"), banner: img("music-banner"), gallery: [img("ma1"), img("ma2"), img("ma3")], email: "arts@campus.edu", instagram: "@arts.campus" },
  { id: "sports", name: "Sports Committee", category: "Sports", blurb: "Inter-department leagues, fitness and the annual meet.", about: "The Sports Committee runs leagues across eight disciplines and organises the inter-department sports meet each semester.", members: 288, logo: img("sports-logo"), banner: img("sports-banner"), gallery: [img("sp1"), img("sp2"), img("sp3")], email: "sports@campus.edu", instagram: "@sports.campus" },
  { id: "ecell", name: "Entrepreneurship Cell", category: "Social", blurb: "Startup mentorship, pitch nights and design sprints.", about: "E-Cell helps student founders go from idea to first users, with mentorship circles, pitch arenas and an alumni investor network.", members: 221, logo: img("ecell-logo"), banner: img("ecell-banner"), gallery: [img("ec1"), img("ec2"), img("ec3")], email: "ecell@campus.edu", instagram: "@ecell.campus" },
  { id: "green", name: "Green Campus Initiative", category: "Social", blurb: "Sustainability drives, campus gardens and clean-ups.", about: "A volunteer-led group working on waste segregation, the campus garden and an annual sustainability audit.", members: 143, logo: img("green-logo"), banner: img("green-banner"), gallery: [img("gr1"), img("gr2"), img("gr3")], email: "green@campus.edu", instagram: "@green.campus" },
];

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

export const announcements: Announcement[] = [
  { id: "a1", title: "Mid-semester exam timetable released", body: "The mid-semester examination schedule for all departments is now available on the student portal. Check your seating allocation before the first paper.", category: "Academic", urgent: true, pinned: true, postedAt: daysAgo(0) },
  { id: "a2", title: "HackNova registrations close Friday", body: "Team registrations for the 48-hour hackathon close at 11:59 PM on Friday. Teams of 2–4, cross-department teams encouraged.", category: "Deadline", urgent: true, pinned: true, postedAt: daysAgo(1) },
  { id: "a3", title: "Library extended hours during exams", body: "The central library will remain open until 1 AM through the examination period. Bring your ID card for late entry.", category: "General", urgent: false, pinned: false, postedAt: daysAgo(2) },
  { id: "a4", title: "Cultural Night auditions open", body: "Auditions for Rhythm 2026 begin next week at the Open Air Theatre. Slots are first come, first served.", category: "Event", urgent: false, pinned: false, postedAt: daysAgo(3) },
  { id: "a5", title: "Scholarship application deadline", body: "Merit-cum-means scholarship forms must be submitted to the accounts office by the end of this month with income proof.", category: "Deadline", urgent: true, pinned: false, postedAt: daysAgo(4) },
  { id: "a6", title: "New elective courses added", body: "Three new electives — Applied Cryptography, Product Design and Climate Systems — are open for registration this semester.", category: "Academic", urgent: false, pinned: false, postedAt: daysAgo(6) },
  { id: "a7", title: "Campus Wi-Fi maintenance window", body: "Network services will be intermittent on Sunday between 2 AM and 6 AM due to scheduled switch upgrades.", category: "General", urgent: false, pinned: false, postedAt: daysAgo(7) },
  { id: "a8", title: "Industrial visit slots for final year", body: "Final year students can sign up for the manufacturing plant visit. Limited to 60 seats across two buses.", category: "Event", urgent: false, pinned: false, postedAt: daysAgo(9) },
  { id: "a9", title: "Project synopsis submission", body: "Capstone project synopses are due to your guide by the 20th. Late submissions will not be accepted for evaluation.", category: "Deadline", urgent: false, pinned: false, postedAt: daysAgo(11) },
  { id: "a10", title: "Blood donation camp on campus", body: "The health centre is hosting a donation camp in association with the city blood bank. Walk-ins welcome all day.", category: "General", urgent: false, pinned: false, postedAt: daysAgo(13) },
];

export const me = {
  id: "me",
  name: "Samruddhi Shinde",
  department: "Computer Engineering",
  year: "Third Year",
  bio: "Building things for the web, occasionally for robots. Coding Club core team, part-time coffee optimiser.",
  avatar: face("samruddhi"),
  points: 340,
  certificates: 5,
};

export const leaderboard: LeaderboardEntry[] = [
  { id: "l1", name: "Aditya Kulkarni", department: "Computer Engineering", events: 28, certificates: 11, points: 720, avatar: face("l1") },
  { id: "l2", name: "Neha Iyer", department: "Electronics", events: 25, certificates: 10, points: 680, avatar: face("l2") },
  { id: "l3", name: "Rahul Deshmukh", department: "Mechanical", events: 24, certificates: 9, points: 655, avatar: face("l3") },
  { id: "l4", name: "Fatima Sheikh", department: "Information Technology", events: 22, certificates: 8, points: 610, avatar: face("l4") },
  { id: "l5", name: "Karan Patel", department: "Computer Engineering", events: 21, certificates: 7, points: 585, avatar: face("l5") },
  { id: "l6", name: "Ishita Nair", department: "Civil", events: 19, certificates: 8, points: 540, avatar: face("l6") },
  { id: "l7", name: "Om Bhosale", department: "Electronics", events: 18, certificates: 6, points: 505, avatar: face("l7") },
  { id: "l8", name: "Sanya Kapoor", department: "Information Technology", events: 17, certificates: 6, points: 480, avatar: face("l8") },
  { id: "l9", name: "Vikram Joshi", department: "Mechanical", events: 16, certificates: 5, points: 445, avatar: face("l9") },
  { id: "l10", name: "Priya Menon", department: "Computer Engineering", events: 15, certificates: 6, points: 420, avatar: face("l10") },
  { id: "l11", name: "Arjun Rane", department: "Civil", events: 14, certificates: 4, points: 390, avatar: face("l11") },
  { id: "me", name: me.name, department: me.department, events: 13, certificates: 5, points: me.points, avatar: me.avatar, isMe: true },
  { id: "l13", name: "Meera Pillai", department: "Electronics", events: 12, certificates: 4, points: 320, avatar: face("l13") },
  { id: "l14", name: "Zaid Ansari", department: "Information Technology", events: 10, certificates: 3, points: 275, avatar: face("l14") },
  { id: "l15", name: "Tanvi Gokhale", department: "Mechanical", events: 8, certificates: 2, points: 230, avatar: face("l15") },
];

export const certificates = [
  { id: "c1", title: "Cloud & DevOps Lab Day", issuer: "ISA", date: daysAgo(20) },
  { id: "c2", title: "Intro to Machine Learning", issuer: "IEEE Student Chapter", date: daysAgo(45) },
  { id: "c3", title: "HackNova 2025 — Finalist", issuer: "Coding Club", date: daysAgo(80) },
  { id: "c4", title: "Design Sprint Workshop", issuer: "E-Cell", date: daysAgo(120) },
  { id: "c5", title: "Embedded Systems Bootcamp", issuer: "Robotics Club", date: daysAgo(160) },
];

export const timetable = {
  slots: ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00"],
  days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  grid: {
    Mon: ["Data Structures", "Operating Systems", "DBMS Lab", "DBMS Lab", "Maths III", ""],
    Tue: ["Operating Systems", "Maths III", "Computer Networks", "", "DS Lab", "DS Lab"],
    Wed: ["DBMS", "Data Structures", "Elective: AI", "Computer Networks", "", "Seminar"],
    Thu: ["Computer Networks", "DBMS", "Maths III", "Elective: AI", "Networks Lab", "Networks Lab"],
    Fri: ["Elective: AI", "Data Structures", "Operating Systems", "Mini Project", "Mini Project", ""],
  } as Record<string, string[]>,
};

export const subjectColors: Record<string, string> = {
  "Data Structures": "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  "Operating Systems": "bg-violet-500/20 text-violet-300 border-violet-500/30",
  DBMS: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  "DBMS Lab": "bg-sky-500/20 text-sky-300 border-sky-500/30",
  "Maths III": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "Computer Networks": "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "Networks Lab": "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "Elective: AI": "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30",
  "DS Lab": "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  "Mini Project": "bg-rose-500/20 text-rose-300 border-rose-500/30",
  Seminar: "bg-teal-500/20 text-teal-300 border-teal-500/30",
};

export const assignments = [
  { id: "t1", title: "DBMS ER diagram submission", course: "DBMS", due: day(1), status: "todo" as const },
  { id: "t2", title: "OS scheduling assignment", course: "Operating Systems", due: day(3), status: "todo" as const },
  { id: "t3", title: "Capstone synopsis draft", course: "Mini Project", due: day(5), status: "progress" as const },
  { id: "t4", title: "Networks packet trace report", course: "Computer Networks", due: day(2), status: "progress" as const },
  { id: "t5", title: "Maths III problem set 4", course: "Maths III", due: day(-1), status: "done" as const },
  { id: "t6", title: "AI elective paper review", course: "Elective: AI", due: day(-3), status: "done" as const },
];

export const notes = [
  { id: "n1", folder: "Semester 5", title: "Operating Systems — Deadlocks", updated: daysAgo(1), body: "# Deadlocks\n\n- Coffman conditions: mutual exclusion, hold and wait, no preemption, circular wait\n- Prevention vs avoidance (Banker's algorithm)\n- Detection: wait-for graph cycles" },
  { id: "n2", folder: "Semester 5", title: "DBMS — Normalization", updated: daysAgo(3), body: "# Normalization\n\n1NF → atomic values\n2NF → no partial dependency\n3NF → no transitive dependency\nBCNF → every determinant is a candidate key" },
  { id: "n3", folder: "Clubs", title: "HackNova planning", updated: daysAgo(5), body: "# HackNova\n\n- Sponsor deck due Monday\n- Mentor list: 12 confirmed\n- Judging rubric: impact 40, craft 30, demo 30" },
  { id: "n4", folder: "Career", title: "Placement prep tracker", updated: daysAgo(8), body: "# Prep\n\n- DSA: arrays, graphs done; DP in progress\n- System design basics\n- Resume reviewed at clinic" },
];
