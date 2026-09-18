export const STUDIO = {
  name: "Panchi Interior",
  city: "Indore",
  state: "Madhya Pradesh",
  est: "2026",
  lat: "22.7031528° N",
  lng: "75.914977° E",
  latNum: 22.7031528,
  lngNum: 75.914977,
  mapsCid: "https://maps.google.com/?cid=10376551253055932928",
  // Placeholder studio line — replace with the real WhatsApp number.
  whatsapp: "919826000000",
  whatsappDisplay: "+91 98260 00000",
  email: "studio@panchiinterior.in",
  address: "Vijay Nagar, AB Road, Indore 452010, Madhya Pradesh",
  hours: "Mon – Sat · 10:30 – 19:30 IST",
};

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/work", label: "Our Work" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" },
  { to: "/turnkey", label: "Turnkey" },
  { to: "/studio", label: "The Studio" },
] as const;

export const PHASES = [
  {
    no: "01",
    title: "The Raw Site",
    sub: "Dust & Drills",
    coord: "N 22.7031 / E 75.9149 · LVL +0.00",
    depth: "Z −1400",
    body: "Civil layouts chalked on bare slab, structural MEP routed before a single board is cut, brickwork held to a 3 mm tolerance. Nothing decorative exists yet — only geometry and discipline.",
    items: [
      "Civil layouts & setting out",
      "Structural MEP coordination",
      "Brickwork precision & plumb",
    ],
  },
  {
    no: "02",
    title: "Materiality & Millwork",
    sub: "Grain, Stone, Light",
    coord: "N 22.7031 / E 75.9149 · LVL +1.10",
    depth: "Z −700",
    body: "Carrara marble inlays book-matched on site, fluted oak panelling milled in our Indore workshop, recessed architectural lighting warmed to 2700K and trimmed flush into plaster.",
    items: ["Carrara marble inlay", "Fluted oak panelling", "Recessed 2700K architecture lighting"],
  },
  {
    no: "03",
    title: "Turnkey Handover",
    sub: "Keys, Not Snag Lists",
    coord: "N 22.7031 / E 75.9149 · LVL +2.80",
    depth: "Z 0",
    body: "Photorealistic live spaces, styled, cleaned and commissioned. Every circuit tested, every drawer soft-close calibrated. You walk in with luggage, not a punch list.",
    items: ["Styling & art curation", "Systems commissioning", "Zero-snag handover dossier"],
  },
] as const;

export const SECTORS = [
  {
    code: "S-01",
    title: "Residential Architecture",
    body: "Villas, penthouses and apartment reworks where plan, joinery and light are designed as one instrument.",
    metric: "1,200 – 12,000 sq ft",
  },
  {
    code: "S-02",
    title: "Commercial & Workplace",
    body: "Headquarters, studios and showrooms built for brand presence and for the people who work eight hours inside them.",
    metric: "Fit-out in 90 – 150 days",
  },
  {
    code: "S-03",
    title: "Hospitality & Retail",
    body: "Restaurants, boutique stays and flagship retail — atmosphere engineered through material, acoustics and shadow.",
    metric: "Concept to opening night",
  },
  {
    code: "S-04",
    title: "Bespoke Millwork",
    body: "In-house workshop producing veneer, solid oak and stone-clad millwork to drawing, not to catalogue.",
    metric: "0.5 mm joinery tolerance",
  },
] as const;

export type Project = {
  slug: string;
  title: string;
  category: "Residential" | "Commercial" | "Hospitality" | "Retail";
  year: string;
  area: string;
  location: string;
  duration: string;
  summary: string;
  narrative: string;
  palette: string[];
  scope: string[];
};

export const PROJECTS: Project[] = [
  {
    slug: "the-brass-courtyard",
    title: "The Brass Courtyard",
    category: "Residential",
    year: "2026",
    area: "6,400 sq ft",
    location: "Vijay Nagar, Indore",
    duration: "142 days",
    summary:
      "A four-bedroom villa organised around a double-height courtyard lined in brushed brass fins.",
    narrative:
      "The brief asked for privacy without darkness. We carved a courtyard through the centre of the plan and clad its return walls in vertical brushed brass fins, so western light is broken into warm bands by four in the afternoon. Floors are honed Kota, joinery is fumed oak, and every service line was rerouted before the first panel was set.",
    palette: ["#1b1a18", "#3d3a34", "#b4914f", "#d9d2c5"],
    scope: [
      "Civil & structural rework",
      "Bespoke brass facade fins",
      "Full millwork package",
      "Lighting design",
    ],
  },
  {
    slug: "obsidian-house",
    title: "Obsidian House",
    category: "Residential",
    year: "2025",
    area: "3,800 sq ft",
    location: "Rau, Indore",
    duration: "118 days",
    summary: "A dark-palette penthouse where smoked glass partitions replace every internal door.",
    narrative:
      "Nine smoked glass partitions in blackened steel frames divide the plan without ever closing it. The living volume is finished in micro-cement, the kitchen in matte graphite lacquer with a single slab of Nero Marquina bridging it. Lighting is entirely indirect — there is not one downlight in the public rooms.",
    palette: ["#111214", "#22252a", "#6f7378", "#c7a06a"],
    scope: [
      "Smoked glass partition system",
      "Micro-cement application",
      "Stone fabrication",
      "Indirect lighting",
    ],
  },
  {
    slug: "the-ledger-office",
    title: "The Ledger Office",
    category: "Commercial",
    year: "2025",
    area: "11,500 sq ft",
    location: "AB Road, Indore",
    duration: "96 days",
    summary:
      "A financial firm's headquarters built as a sequence of quiet, acoustically separated chambers.",
    narrative:
      "Confidentiality drove the plan. Thirty-two acoustic chambers were built with double-stud partitions and 48 mm laminated glass, achieving 42 dB attenuation between adjacent rooms. Fluted oak runs continuously through the circulation spine so the eye reads one material even as the programme changes.",
    palette: ["#181715", "#2e2b26", "#8c7a5c", "#e4ded1"],
    scope: [
      "Acoustic partition engineering",
      "Workstation millwork",
      "HVAC coordination",
      "Signage & wayfinding",
    ],
  },
  {
    slug: "atelier-56",
    title: "Atelier 56",
    category: "Retail",
    year: "2026",
    area: "2,100 sq ft",
    location: "56 Dukan, Indore",
    duration: "64 days",
    summary: "A jewellery flagship lit entirely by 2700K grazing light on Carrara.",
    narrative:
      "Product is small, so the architecture had to be still. Walls are Carrara with a 6 mm reveal at the floor, grazed from a concealed cove. Display vitrines are solid brass with internal dimming, calibrated so each piece sits at 1,800 lux while the room stays at 90.",
    palette: ["#f2efe9", "#cfc6b6", "#9a7c45", "#1c1b19"],
    scope: [
      "Stone cladding",
      "Brass vitrine fabrication",
      "Lighting calibration",
      "Security integration",
    ],
  },
  {
    slug: "saffron-table",
    title: "Saffron Table",
    category: "Hospitality",
    year: "2025",
    area: "4,700 sq ft",
    location: "New Palasia, Indore",
    duration: "88 days",
    summary:
      "A 96-cover restaurant with a terracotta vaulted ceiling and a fully open fire kitchen.",
    narrative:
      "Ninety-six covers, one open flame kitchen, and an acoustic problem solved by vaulting. Handmade terracotta vaults were set over a steel grid, dropping reverberation to 0.7 seconds while carrying the warmth of the cuisine. Banquettes are oxblood leather on solid teak frames built in our workshop.",
    palette: ["#2a1d17", "#7c422a", "#c98a4b", "#efe3d2"],
    scope: [
      "Vaulted ceiling system",
      "Commercial kitchen fit-out",
      "Banquette fabrication",
      "Acoustic treatment",
    ],
  },
  {
    slug: "the-quiet-clinic",
    title: "The Quiet Clinic",
    category: "Commercial",
    year: "2026",
    area: "5,200 sq ft",
    location: "Scheme 54, Indore",
    duration: "104 days",
    summary: "A dental practice detailed to read as a hotel lobby, not a hospital.",
    narrative:
      "Every clinical requirement was met behind a domestic language: seamless antibacterial surfaces disguised as lime plaster, medical gas lines buried in oak-lined service walls, and a reception with no counter — just a table. Patient anxiety scores dropped measurably after opening.",
    palette: ["#1f1e1c", "#403b33", "#a3906f", "#e8e3d9"],
    scope: [
      "Clinical compliance detailing",
      "Service integration",
      "Custom oak walls",
      "Furniture curation",
    ],
  },
];

export const CATEGORIES = ["All", "Residential", "Commercial", "Hospitality", "Retail"] as const;

export const STAGES = [
  {
    no: "01",
    title: "Survey & Spatial Brief",
    days: "Days 1 – 14",
    body: "Laser site survey, structural audit, lifestyle interrogation. We produce a measured drawing set and a written spatial brief before any visual is shown.",
    deliverables: [
      "Measured drawing set",
      "Structural & MEP audit",
      "Written spatial brief",
      "Indicative budget band",
    ],
  },
  {
    no: "02",
    title: "Design & Material Resolution",
    days: "Days 15 – 45",
    body: "Plans, sections and photoreal views resolved alongside physical material boards. Nothing enters the tender until it exists as a sample you have held.",
    deliverables: [
      "Concept & GA drawings",
      "Photoreal views",
      "Physical material board",
      "Lighting layout",
    ],
  },
  {
    no: "03",
    title: "Execution & Millwork",
    days: "Days 46 – 120",
    body: "Single-contract execution. Civil, MEP, millwork and finishes run under one project manager with weekly site photography shared to your phone.",
    deliverables: [
      "Single-point contract",
      "Weekly site reporting",
      "Workshop millwork",
      "Quality checkpoints",
    ],
  },
  {
    no: "04",
    title: "Styling & Zero-Snag Handover",
    days: "Days 121 – 150",
    body: "Commissioning, deep clean, styling and the handover dossier — warranties, circuit maps, material care notes, and a 12-month defect cover.",
    deliverables: [
      "Systems commissioning",
      "Styling & art",
      "Handover dossier",
      "12-month defect cover",
    ],
  },
] as const;

export const SWATCHES = [
  { name: "Carrara Honed", code: "MT-01", hex: "#e6e2da", note: "Italian marble, 20 mm, honed" },
  { name: "Fumed Oak", code: "WD-04", hex: "#5a4531", note: "Fluted solid oak, 18 mm pitch" },
  { name: "Brushed Brass", code: "MT-09", hex: "#b4914f", note: "Unlacquered, left to patina" },
  { name: "Nero Marquina", code: "ST-02", hex: "#1d1c1b", note: "Book-matched, filled & honed" },
  { name: "Smoked Glass", code: "GL-03", hex: "#3b3f44", note: "8 mm toughened, grey tint" },
  { name: "Lime Plaster", code: "FN-06", hex: "#cfc6b6", note: "Three-coat, burnished finish" },
  { name: "Micro-cement", code: "FN-11", hex: "#8b8781", note: "Seamless, matte sealed" },
  { name: "Oxblood Leather", code: "UP-07", hex: "#6b2c26", note: "Full-grain, hand-stitched" },
] as const;

export const METRICS = [
  { value: "148", label: "Turnkey projects delivered", unit: "since 2026" },
  { value: "0.5", label: "Millwork tolerance", unit: "millimetres" },
  { value: "94%", label: "Handover on committed date", unit: "last 36 months" },
  { value: "41", label: "In-house craftsmen & site staff", unit: "Indore workshop" },
  { value: "12", label: "Defect cover on every handover", unit: "months" },
  { value: "3.2", label: "Average site visits per week", unit: "per live project" },
];
