import React, { useState, useMemo, useEffect, useRef } from "react";
import { 
  GitCommit, 
  Database, 
  FileSpreadsheet, 
  Cpu, 
  Layers, 
  Code, 
  Plus, 
  Trash2, 
  Folder, 
  Calendar, 
  Check, 
  Copy, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  HardDrive, 
  Layout, 
  Presentation, 
  ExternalLink, 
  Info, 
  RefreshCw, 
  User, 
  Lock,
  Search,
  Settings,
  HelpCircle,
  Sun,
  Moon,
  Camera,
  Upload,
  Mail,
  Phone,
  MapPin,
  Award,
  BookOpen,
  Briefcase,
  ChevronDown,
  Pencil,
  Globe,
  Eye,
  PlusCircle,
  X
} from "lucide-react";
import { GAS_FILES, GasFile } from "./gasCode";
import { TBSC_TRAINING_RECORDS, TrainingRecord } from "./trainingRecords";

// Interfaces representing the portfolio structure
export interface LicenseItem {
  id: string;
  name: string;
  name_en: string;
  issuer: string;
  issuer_en: string;
  image?: string; // Base64 or direct URL
}

export interface EducationItem {
  id: string;
  degree: string;
  degree_en: string;
  school: string;
  school_en: string;
}

export interface ProfileDetails {
  name: string;
  nameThai: string;
  title: string;
  title_en: string;
  company: string;
  company_en: string;
  phone: string;
  email: string;
  address: string;
  address_en: string;
  summary: string;
  summary_en: string;
  languages: string;
  languages_en: string;
  licenses: LicenseItem[];
  education: EducationItem[];
}

export interface ProjectItem {
  id: string;
  Date: string; // YYYY-MM
  Category: string; // e.g. Safety & Compliance, IT Infrastructure & Security
  Category_EN: string;
  Title: string;
  Title_EN: string;
  Description: string;
  Description_EN: string;
  Tools: string; // Comma separated list
  Drive_Image_Link: string;
}

// Pre-seeded high-quality resume milestones of Taweesak Kompok (Bilingual)
const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: "1",
    Date: "2025-06",
    Category: "Safety & Compliance",
    Category_EN: "Safety & Compliance",
    Title: "แคมเปญโรงงานสีขาวต่อต้านยาเสพติด & การเป็นผู้นำด้านสวัสดิการพนักงาน",
    Title_EN: "White Factory Anti-Drug Campaign & Welfare Leadership",
    Description: "สวมบทบาทผู้นำรณรงค์แคมเปญต่อต้านยาเสพติดอย่างครบวงจร (White Factory Campaign) ณ บริษัท ไทยบริดจสโตน จำกัด ประสบความสำเร็จบรรลุอัตราการมีส่วนร่วม 100% จากพนักงานกว่า 500+ คน พร้อมรับผิดชอบและบริหารจัดการสิ่งอำนวยความสะดวกสันทนาการของพนักงาน (สนามฟุตซอล, ฟิตเนส) เพื่อยกระดับความเป็นอยู่ที่ดีและสร้างความผูกพันภายในองค์กรอย่างยั่งยืน",
    Description_EN: "Led the comprehensive White Factory Anti-Drug Campaign at Thai Bridgestone Co., Ltd., achieving 100% participation from 500+ employees. Managed employee recreational facilities (futsal field, fitness center) to enhance welfare and foster long-term organizational engagement.",
    Tools: "Safety Culture, Security Auditing, HR Security Policy, White Factory Standards",
    Drive_Image_Link: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "2",
    Date: "2024-11",
    Category: "IT Infrastructure & Security",
    Category_EN: "IT Infrastructure & Security",
    Title: "การบริหารจัดการระบบ SCADA ในระดับองค์กร & กลุ่มโฮสต์ VMware",
    Title_EN: "Enterprise SCADA Systems & VMware Cluster Administration",
    Description: "บริหารจัดการและดูแลสถาปัตยกรรมระบบติดตามควบคุมอัจฉริยะ (SCADA Systems) และโครงสร้างพื้นฐานเสมือนผ่าน VMware Cluster เพื่อรักษาการใช้งาน (Uptime) สูงถึง 99.9% สำหรับสายการผลิตสินค้าชิ้นส่วนวิกฤตความปลอดภัย ป้องกันปัญหาระบบล่มตลอด 24 ชั่วโมง",
    Description_EN: "Managed and maintained industrial SCADA monitoring systems and virtual infrastructure via VMware Cluster, achieving 99.9% uptime for safety-critical production lines and ensuring 24/7 high availability.",
    Tools: "SCADA Systems, VMware, Server Administration, Infrastructure Redundancy, Industrial Automation",
    Drive_Image_Link: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "3",
    Date: "2023-08",
    Category: "IT Infrastructure & Security",
    Category_EN: "IT Infrastructure & Security",
    Title: "การบูรณาการระบบกล้องวงจรปิดขนาดใหญ่ & ระบบตรวจการณ์ความจุสูง",
    Title_EN: "Megastructure CCTV & High-Capacity Surveillance Integration",
    Description: "บูรณาการและวางแผนอัปเกรดระบบเครือข่ายกล้องวงจรปิดความหนาแน่นสูง ครอบคลุมพื้นที่ปฏิบัติงานกล้อง CCTV กว่า 2,000+ ตัว ทั่วพื้นที่โรงงาน เพื่อยกระดับการตรวจการณ์ความมั่นคงของสถานประกอบการ สนับสนุนการสืบสวนคดีรักษาความปลอดภัย และผสานข้อมูลร่วมกับระบบอื่นๆ",
    Description_EN: "Integrated and planned the upgrade of high-density surveillance networks covering over 2,000 CCTV cameras factory-wide to enhance industrial physical security, support safety investigations, and connect security data streams.",
    Tools: "CCTV Systems, LPR Access Control, Security Investigation, Surveillance Architecture",
    Drive_Image_Link: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "4",
    Date: "2022-04",
    Category: "IT Infrastructure & Security",
    Category_EN: "IT Infrastructure & Security",
    Title: "การแบ่งเครือข่ายองค์กร & การตั้งรับด้วยระบบไฟร์วอลล์",
    Title_EN: "Corporate Network Segmentation & Firewall Defense",
    Description: "ออกแบบเวิร์กโหลดและติดตั้งการแบ่งส่วนงานเครือข่ายความมั่นคงสูงภายในโรงงาน (VLAN Layout Network Segments) มากกว่า 5 ส่วนงาน เพื่อเพิ่มความเสถียรของระบบเครือข่ายโรงงานขึ้น 30% พร้อมบีบอัดและจัดการความเสี่ยงด้วยเทคโนโลยี Fortigate Firewall เพื่อให้มั่นใจเรื่องความปลอดภัยจากการคุกคามทางไซเบอร์",
    Description_EN: "Designed workloads and configured high-security network segmentation (VLAN layout) into 5+ zones, improving factory network stability by 30%. Implemented Fortigate Firewall policies to mitigate risks and secure against cyber threats.",
    Tools: "Network Design, Fortigate, Firewall, VLAN Segmentation, Cyber Security",
    Drive_Image_Link: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "5",
    Date: "2025-01",
    Category: "Safety & Compliance",
    Category_EN: "Safety & Compliance",
    Title: "ใบอนุญาตผู้จัดการความปลอดภัยด้านการขนส่ง (TSM)",
    Title_EN: "Certified Transport Safety Manager (TSM) License",
    Description: "ได้รับการรับรองสิทธิบัตรอย่างเป็นทางการในฐานะผู้จัดการความปลอดภัยด้านการขนส่ง (TSM) จากกรมการขนส่งทางบก (Department of Land Transport) เสริมรากฐานแกร่งเพื่อเตรียมการบูรณาการระบบควบคุมความปลอดภัยด้านการโลจิสติกส์ การขับขี่ (Fleet Safety) และการลดอุบัติเหตุด้านการขนส่งขององค์กร",
    Description_EN: "Officially certified as a Transport Safety Manager (TSM) by the Department of Land Transport (DLT), Thailand. Strengthened foundation for logistics and fleet safety management, compliance audits, and vehicle accident prevention.",
    Tools: "Transport Safety, TSM Standards, Land Transport License, Logistics Safety",
    Drive_Image_Link: "https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=800&auto=format&fit=crop"
  }
];

const DEFAULT_PROFILE: ProfileDetails = {
  name: "Taweesak Kompok",
  nameThai: "ทวีศักดิ์ คำปก",
  title: "เจ้าหน้าที่อาวุโส (E2) - ส่วนงานธุรการและอาคารสถานที่",
  title_en: "Senior Officer (E2) - General Affairs & Building",
  company: "บริษัท ไทยบริดจสโตน จำกัด",
  company_en: "Thai Bridgestone Company Limited",
  phone: "062-3285963",
  email: "closec16522@gmail.com",
  address: "116/1 หมู่ 8 ต.ห้วยทราย อ.หนองแค จ.สระบุรี",
  address_en: "116/1 Moo 8, Huai Sai, Nong Khae, Saraburi",
  summary: "เจ้าหน้าที่อาวุโสผู้เปี่ยมด้วยประสบการณ์ยาวนานกว่า 15 ปี ณ บริษัท ไทยบริดจสโตน จำกัด (TBSC) มีความเชี่ยวชาญรอบด้านทั้งงานบริหารจัดการธุรการ อาคารสถานที่ ระบบความปลอดภัย ระบบโครงสร้างพื้นฐานไอที และระบบควบคุมอัตโนมัติในโรงงาน (SCADA, CCTV, VMware Virtualization) ล่าสุดได้รับการรับรองเป็นผู้จัดการความปลอดภัยด้านการขนส่ง (TSM) โดยกรมการขนส่งทางบก มีทักษะและความสามารถสูงในการจัดการความเสี่ยง การบังคับใช้กฎความปลอดภัย และการสนับสนุนสวัสดิการของพนักงานในองค์กร",
  summary_en: "A multifaceted professional with 15 years of dedicated experience at Thai Bridgestone Co., Ltd. (TBSC), specializing in General Affairs and Building Operations, Security Systems, IT Infrastructure, and Industrial Automation (SCADA, CCTV, VMware Virtualization). Recently certified as a Transport Safety Manager (TSM) by DLT, Thailand. Experienced in building operations management, risk compliance, personnel welfare support, and safety rules enforcement.",
  languages: "ภาษาไทย (ภาษาแม่) | ภาษาอังกฤษ (ระดับวิชาชีพ - TOEIC 470)",
  languages_en: "Thai (Native) | English (Professional Working Proficiency - TOEIC 470)",
  licenses: [
    {
      id: "lic-1",
      name: "ผู้จัดการความปลอดภัยด้านการขนส่ง (TSM)",
      name_en: "Transport Safety Manager (TSM)",
      issuer: "กรมการขนส่งทางบก, 2025",
      issuer_en: "Department of Land Transport, 2025"
    },
    {
      id: "lic-2",
      name: "การบริหารจัดการฐานข้อมูล Oracle 12c",
      name_en: "Oracle 12c: Database Administration",
      issuer: "SYS Operations, 2019",
      issuer_en: "SYS Operations, 2019",
      image: "/certs/IMG_1962.jpg"
    },
    {
      id: "lic-3",
      name: "ขยายศูนย์ข้อมูลด้วย Microsoft Azure",
      name_en: "Extend Your Datacenter with Microsoft Azure",
      issuer: "Microsoft, 2015",
      issuer_en: "Microsoft, 2015"
    },
    {
      id: "lic-powerpoint",
      name: "ใบรับรองสำเร็จหลักสูตร Microsoft PowerPoint 2010",
      name_en: "Certificate of Accomplishment - Microsoft PowerPoint 2010",
      issuer: "Bits (Thailand), 2555",
      issuer_en: "Bits (Thailand), 2012",
      image: "/certs/IMG_1955.jpg"
    },
    {
      id: "lic-access",
      name: "ใบรับรองสำเร็จหลักสูตร Microsoft Access 2010",
      name_en: "Certificate of Accomplishment - Microsoft Access 2010",
      issuer: "Bits (Thailand), 2555",
      issuer_en: "Bits (Thailand), 2012",
      image: "/certs/IMG_1956.jpg"
    },
    {
      id: "lic-english",
      name: "ใบรับรองการเข้าร่วมอบรมเชิงปฏิบัติการการเขียนภาษาอังกฤษธุรกิจ",
      name_en: "Certificate of Workshop - Business English Writing",
      issuer: "Worldwide Education Services Co., Ltd. / Bridgestone, 2557",
      issuer_en: "Worldwide Education Services Co., Ltd. / Bridgestone, 2014",
      image: "/certs/IMG_1957.jpg"
    },
    {
      id: "lic-excel-adv",
      name: "วุฒิบัตรหลักสูตรการทำงานทางด้านการคำนวณโดยใช้โปรแกรม Microsoft Excel 2010 ขั้นสูง",
      name_en: "Advanced Microsoft Excel 2010 Training Certificate",
      issuer: "สถาบัน DS Johnson Development / Bridgestone, 2559",
      issuer_en: "DS Johnson Development / Bridgestone, 2016",
      image: "/certs/IMG_1958.jpg"
    },
    {
      id: "lic-autocad-3d",
      name: "วุฒิบัตรหลักสูตรการเขียนแบบทางวิศวกรรมโดยใช้โปรแกรม AutoCAD (3 มิติ)",
      name_en: "AutoCAD 3D Engineering Drawing Training Certificate",
      issuer: "สถาบัน DS Johnson Development / Bridgestone, 2559",
      issuer_en: "DS Johnson Development / Bridgestone, 2016",
      image: "/certs/IMG_1959.jpg"
    },
    {
      id: "lic-coop-cons",
      name: "เกียรติบัตรรางวัลชมเชย โครงงานสหกิจศึกษาดีเด่น ด้านนวัตกรรม ระดับเครือข่าย",
      name_en: "Consolation Prize for Outstanding Co-operative Education Project (Innovation)",
      issuer: "เครือข่ายพัฒนาสหกิจศึกษาภาคกลางตอนบน, 2559",
      issuer_en: "Upper Central Co-operative Education Development Network, 2016",
      image: "/certs/IMG_1960.jpg"
    },
    {
      id: "lic-coop-runner",
      name: "เกียรติบัตรรางวัลรองชนะเลิศอันดับ 1 โครงงานสหกิจศึกษาดีเด่น กลุ่มวิทยาศาสตร์และเทคโนโลยี",
      name_en: "1st Runner-up for Outstanding Co-operative Education Project (Science & Technology)",
      issuer: "มหาวิทยาลัยศรีปทุม, 2559",
      issuer_en: "Sripatum University, 2016",
      image: "/certs/IMG_1961.jpg"
    },
    {
      id: "lic-toeic-470",
      name: "ใบรายงานผลคะแนนสอบ TOEIC (470 คะแนน)",
      name_en: "TOEIC Listening and Reading Test Score Report (470)",
      issuer: "ETS (Educational Testing Service), 2563",
      issuer_en: "ETS (Educational Testing Service), 2020",
      image: "/certs/IMG_1963.jpg"
    },
    {
      id: "lic-engineer-appoint",
      name: "หนังสือแต่งตั้งตำแหน่งวิศวกรชำนาญการฝ่ายวิศวกรรม",
      name_en: "Appointment of Specialist Engineer - Engineering Department",
      issuer: "บริษัท ไทยบริดจสโตน จำกัด, 2562",
      issuer_en: "Thai Bridgestone Co., Ltd., 2019",
      image: "/certs/IMG_1964.jpg"
    },
    {
      id: "lic-service-10y",
      name: "เกียรติบัตรผู้ปฏิบัติงานด้วยความเสียสละและอุตสาหะครบรอบ 10 ปี",
      name_en: "10 Years Long Service Recognition Certificate",
      issuer: "บริษัท ไทยบริดจสโตน จำกัด, 2565",
      issuer_en: "Thai Bridgestone Co., Ltd., 2022",
      image: "/certs/IMG_1965.jpg"
    },
    {
      id: "lic-boom-lift",
      name: "ใบรับรองความปลอดภัยในการปฏิบัติงานเกี่ยวกับเครื่องจักร Boom Lift 'Snorkel' รุ่น A46JE",
      name_en: "Safety Operation Certificate for Boom Lift 'Snorkel' Model A46JE",
      issuer: "ASIAFIVE Safety Solution, 2564",
      issuer_en: "ASIAFIVE Safety Solution, 2021",
      image: "/certs/IMG_1966.jpg"
    },
    {
      id: "lic-scissor-lift",
      name: "ใบรับรองความปลอดภัยในการปฏิบัติงานเกี่ยวกับเครื่องจักร Scissor Lift 'Snorkel' รุ่น S4726E",
      name_en: "Safety Operation Certificate for Scissor Lift 'Snorkel' Model S4726E",
      issuer: "ASIAFIVE Safety Solution, 2564",
      issuer_en: "ASIAFIVE Safety Solution, 2021",
      image: "/certs/IMG_1967.jpg"
    },
    {
      id: "lic-drone",
      name: "หนังสือการขึ้นทะเบียนผู้บังคับหรือปล่อยอากาศยานซึ่งไม่มีคนขับ (ใบอนุญาตขับโดรน น้ำหนักไม่เกิน 25 กิโลกรัม)",
      name_en: "Unmanned Aircraft (Drone) Pilot Certificate (Weight not exceeding 25 kg)",
      issuer: "สำนักงานการบินพลเรือนแห่งประเทศไทย (CAAT), 2568",
      issuer_en: "The Civil Aviation Authority of Thailand (CAAT), 2025",
      image: "/certs/IMG_1968.jpg"
    },
    {
      id: "lic-ev-conv",
      name: "ประกาศนียบัตรหลักสูตรอบรมยานยนต์ไฟฟ้าดัดแปลง EV Conversion รุ่นที่ 51",
      name_en: "Certificate of EV Conversion Training (Class 51)",
      issuer: "Szechter EV / บริษัท โบลส์ เซฟ คอร์ปอเรชั่น จำกัด, 2568",
      issuer_en: "Szechter EV / Boles Safe Corporation Co., Ltd., 2025",
      image: "/certs/IMG_1969.jpg"
    },
    {
      id: "lic-solar-storage",
      name: "ประกาศนียบัตรหลักสูตรอบรมการจัดการพลังงานและระบบกักเก็บพลังงานแสงอาทิตย์ (Energy Storage Solar System)",
      name_en: "Certificate of Energy Storage Solar System Training",
      issuer: "B2H Solar / LVFU, 2568",
      issuer_en: "B2H Solar / LVFU, 2025",
      image: "/certs/IMG_1970.jpg"
    },
    {
      id: "lic-elec-safety",
      name: "วุฒิบัตรหลักสูตรความปลอดภัยในการทำงานเกี่ยวกับไฟฟ้าสำหรับลูกจ้าง",
      name_en: "Electrical Safety Training Certificate for Employees",
      issuer: "บริษัท ไทยบริดจสโตน จำกัด, 2568",
      issuer_en: "Thai Bridgestone Co., Ltd., 2025",
      image: "/certs/IMG_1971.jpg"
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "ปริญญาตรี เทคโนโลยีสารสนเทศธุรกิจ",
      degree_en: "Bachelor's degree, IT for Business",
      school: "มหาวิทยาลัยศรีปทุม, 2013-2016",
      school_en: "Sripatum University, 2013-2016"
    },
    {
      id: "edu-2",
      degree: "ประกาศนียบัตรวิชาชีพชั้นสูง เทคโนโลยีสารสนเทศ",
      degree_en: "High Vocational Certificate, IT",
      school: "วิทยาลัยอาชีวศึกษาสระบุรี, 2009-2010",
      school_en: "Saraburi Vocational College, 2009-2010"
    }
  ]
};

const CATEGORY_UNSPLASH_IMAGES: { [key: string]: string } = {
  "Safety & Compliance": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop",
  "IT Infrastructure & Security": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop",
  "Management & Tools": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop",
  "General": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop"
};

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"preview" | "code" | "export" | "trainings">("preview");
  const [selectedGasFile, setSelectedGasFile] = useState<number>(0);
  

  // Dynamic language state
  const [lang, setLang] = useState<"TH" | "EN">(() => {
    return (localStorage.getItem("portfolio_lang") as "TH" | "EN") || "TH";
  });

  // Persist language setting
  useEffect(() => {
    localStorage.setItem("portfolio_lang", lang);
  }, [lang]);

  // Persistent States
  const [profile, setProfile] = useState<ProfileDetails>(() => {
    const saved = localStorage.getItem("portfolio_profile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          // Auto-migrate TOEIC score if it matches the old default
          const rawLanguages = parsed.languages || DEFAULT_PROFILE.languages;
          const languages = rawLanguages === "ภาษาไทย (ภาษาแม่) | ภาษาอังกฤษ (ระดับวิชาชีพ - TOEIC 450)"
            ? "ภาษาไทย (ภาษาแม่) | ภาษาอังกฤษ (ระดับวิชาชีพ - TOEIC 470)"
            : rawLanguages;

          const rawLanguagesEn = parsed.languages_en || DEFAULT_PROFILE.languages_en;
          const languages_en = rawLanguagesEn === "Thai (Native) | English (Professional Working Proficiency - TOEIC 450)"
            ? "Thai (Native) | English (Professional Working Proficiency - TOEIC 470)"
            : rawLanguagesEn;

          // Auto-migrate/merge licenses from DEFAULT_PROFILE
          const parsedLicenses = Array.isArray(parsed.licenses) ? parsed.licenses : [];
          const mergedLicenses = [
            ...parsedLicenses.map((l: any, i: number) => {
              const defaultLic = DEFAULT_PROFILE.licenses.find(dl => dl.id === l.id);
              return {
                id: l.id || `lic-${i}`,
                name: l.name || (defaultLic ? defaultLic.name : ""),
                name_en: l.name_en || (defaultLic ? defaultLic.name_en : l.name || ""),
                issuer: l.issuer || (defaultLic ? defaultLic.issuer : ""),
                issuer_en: l.issuer_en || (defaultLic ? defaultLic.issuer_en : l.issuer || ""),
                image: l.image || (defaultLic ? defaultLic.image : "")
              };
            }),
            ...DEFAULT_PROFILE.licenses.filter(dl => !parsedLicenses.some((pl: any) => pl.id === dl.id))
          ];

          return {
            ...DEFAULT_PROFILE,
            ...parsed,
            languages,
            languages_en,
            licenses: mergedLicenses,
            education: Array.isArray(parsed.education) ? parsed.education.map((ed: any, i: number) => ({
              id: ed.id || `edu-${i}`,
              degree: ed.degree || "",
              degree_en: ed.degree_en || ed.degree || "",
              school: ed.school || "",
              school_en: ed.school_en || ed.school || ""
            })) : []
          };
        }
      } catch (e) {}
    }
    return DEFAULT_PROFILE;
  });

  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    const saved = localStorage.getItem("portfolio_projects");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((p: any, idx: number) => ({
            id: p.id || `gas-${idx}-${Date.now()}`,
            Date: p.Date || p.date || "2025-06",
            Category: p.Category || p.category || "General",
            Category_EN: p.Category_EN || p.category_en || p.Category || "General",
            Title: p.Title || p.title || "",
            Title_EN: p.Title_EN || p.title_en || p.Title || "",
            Description: p.Description || p.description || "",
            Description_EN: p.Description_EN || p.description_en || p.Description || "",
            Tools: p.Tools || p.tools || "",
            Drive_Image_Link: p.Drive_Image_Link || p.drive_image_link || ""
          }));
        }
      } catch (e) {}
    }
    return INITIAL_PROJECTS;
  });

  const [trainings, setTrainings] = useState<TrainingRecord[]>(() => {
    const saved = localStorage.getItem("portfolio_trainings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((t: any) => ({
            id: t.id || `tr-${Date.now()}-${Math.random()}`,
            code: t.code || "",
            classId: t.classId || "",
            title: t.title || "",
            dateRange: t.dateRange || "",
            category: t.category || "Safety & Compliance",
            status: t.status || "ผ่าน (Passed)"
          }));
        }
      } catch (e) {}
    }
    return TBSC_TRAINING_RECORDS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("portfolio_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("portfolio_projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("portfolio_trainings", JSON.stringify(trainings));
  }, [trainings]);

  // UI States
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // TBSC training records state
  const [trainingSearch, setTrainingSearch] = useState<string>("");
  const [trainingCategory, setTrainingCategory] = useState<string>("All");

  // Google Sheets Dynamic Sync State
  const [gasAppUrl, setGasAppUrl] = useState<string>(() => {
    return localStorage.getItem("portfolio_gas_api_url") || "";
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<{type: "success" | "error" | "idle", message: string}>({
    type: "idle",
    message: ""
  });
  
  // Theme state
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("portfolio_theme") as "light" | "dark") || "dark";
  });

  // Profile Image state
  const [profileImage, setProfileImage] = useState<string | null>(() => {
    return localStorage.getItem("portfolio_profile_image") || "/profile.jpg";
  });

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeEditModal, setActiveEditModal] = useState<"profile" | "summary" | "licenses" | "education" | "training" | null>(null);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [editingTraining, setEditingTraining] = useState<TrainingRecord | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Password verification state
  const [passwordModal, setPasswordModal] = useState<{
    isOpen: boolean;
    onSuccess: (() => void) | null;
    error: string;
    inputValue: string;
  }>({
    isOpen: false,
    onSuccess: onSuccess => {}, // type helper placeholder
    error: "",
    inputValue: ""
  });

  const handleActionWithPassword = (onSuccess: () => void) => {
    setPasswordModal({
      isOpen: true,
      onSuccess: onSuccess,
      error: "",
      inputValue: ""
    });
  };

  // Temporary edit states for modals
  const [tempProfile, setTempProfile] = useState<ProfileDetails>(profile);
  const [tempLicenses, setTempLicenses] = useState<LicenseItem[]>(profile.licenses);
  const [tempEdu, setTempEdu] = useState<EducationItem[]>(profile.education);
  const [tempLanguages, setTempLanguages] = useState(profile.languages);
  const [tempLanguagesEn, setTempLanguagesEn] = useState(profile.languages_en);

  // Sync theme class to document element
  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("portfolio_theme", nextTheme);
  };

  const handleProfileImageUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert(lang === "TH" ? "กรุณาเลือกไฟล์รูปภาพเท่านั้น" : "Please select image files only");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === "string") {
        setProfileImage(e.target.result);
        localStorage.setItem("portfolio_profile_image", e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProfileImageUpload(e.dataTransfer.files[0]);
    }
  };
  
  // Google Drive url helper tool state
  const [rawDriveUrl, setRawDriveUrl] = useState<string>("https://drive.google.com/file/d/1ABCDE12345_XYZ/view?usp=sharing");
  const [convertedDirectLink, setConvertedDirectLink] = useState<string>("https://drive.google.com/uc?export=view&id=1ABCDE12345_XYZ");
  const [driveNotification, setDriveNotification] = useState<string>("");

  // Copy success animation states
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedCodeFilename, setCopiedCodeFilename] = useState<string>("");
  const [copiedPhone, setCopiedPhone] = useState<boolean>(false);
  const [copiedMail, setCopiedMail] = useState<boolean>(false);

  // New Project Form Inputs states (For local live customization)
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newDate, setNewDate] = useState<string>("2025-06");
  const [newCategory, setNewCategory] = useState<string>("Safety & Compliance");
  const [newCategoryEn, setNewCategoryEn] = useState<string>("Safety & Compliance");
  const [newTitle, setNewTitle] = useState<string>("");
  const [newTitleEn, setNewTitleEn] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");
  const [newDescriptionEn, setNewDescriptionEn] = useState<string>("");
  const [newTools, setNewTools] = useState<string>("");
  const [newDriveLink, setNewDriveLink] = useState<string>("");

  // Dynamic Categories Collated
  const categoriesList = useMemo(() => {
    const list = new Set(projects.map(p => lang === "TH" ? (p.Category || "").trim() : (p.Category_EN || p.Category || "").trim()));
    return ["All", ...Array.from(list)];
  }, [projects, lang]);

  // Filtering Logic
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    if (filterCategory !== "All") {
      result = result.filter(p => (lang === "TH" ? p.Category : (p.Category_EN || p.Category)) === filterCategory);
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p => 
          (p.Title || "").toLowerCase().includes(q) || 
          (p.Title_EN || p.Title || "").toLowerCase().includes(q) ||
          (p.Description || "").toLowerCase().includes(q) || 
          (p.Description_EN || p.Description || "").toLowerCase().includes(q) ||
          (p.Tools || "").toLowerCase().includes(q)
      );
    }

    // Sort newer date to oldest date
    return result.sort((a, b) => (b.Date || "").localeCompare(a.Date || ""));
  }, [projects, filterCategory, searchQuery, lang]);

  // Filtering Logic for TBSC Training Records
  const filteredTrainings = useMemo(() => {
    let result = [...trainings];

    if (trainingCategory !== "All") {
      result = result.filter(t => t.category === trainingCategory);
    }

    if (trainingSearch.trim() !== "") {
      const q = trainingSearch.toLowerCase();
      result = result.filter(
        t => 
          t.code.toLowerCase().includes(q) || 
          t.classId.toLowerCase().includes(q) || 
          t.title.toLowerCase().includes(q)
      );
    }

    return result;
  }, [trainings, trainingCategory, trainingSearch]);

  // Handle Regex conversion for Google Drive links
  const handleDriveUrlChange = (val: string) => {
    setRawDriveUrl(val);
    if (!val) {
      setConvertedDirectLink("");
      return;
    }
    
    const regexes = [
      /\/file\/d\/([a-zA-Z0-9_-]+)/,
      /id=([a-zA-Z0-9_-]+)/,
      /open\?id=([a-zA-Z0-9_-]+)/,
      /drive\.google\.com\/uc\?id=([a-zA-Z0-9_-]+)/,
      /\/folders\/([a-zA-Z0-9_-]+)/
    ];
    
    let id = "";
    for (let r of regexes) {
      const match = val.match(r);
      if (match && match[1]) {
        id = match[1];
        break;
      }
    }
    
    if (id) {
      setConvertedDirectLink(`https://drive.google.com/uc?export=view&id=${id}`);
    } else {
      setConvertedDirectLink(val); // Fallback
    }
  };

  // Add Project helper
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    const newItem: ProjectItem = {
      id: Date.now().toString(),
      Date: newDate,
      Category: newCategory,
      Category_EN: newCategoryEn || newCategory,
      Title: newTitle,
      Title_EN: newTitleEn || newTitle,
      Description: newDescription,
      Description_EN: newDescriptionEn || newDescription,
      Tools: newTools,
      Drive_Image_Link: newDriveLink || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop"
    };

    setProjects([newItem, ...projects]);
    
    // Reset Form
    setNewTitle("");
    setNewTitleEn("");
    setNewDescription("");
    setNewDescriptionEn("");
    setNewTools("");
    setNewDriveLink("");
    setShowAddForm(false);
  };

  // Reset demo back to default values
  const handleResetDemo = () => {
    if (window.confirm(lang === "TH" ? "ต้องการรีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้นใช่หรือไม่?" : "Are you sure you want to reset all data to default?")) {
      setProjects(INITIAL_PROJECTS);
      setProfile(DEFAULT_PROFILE);
      setTrainings(TBSC_TRAINING_RECORDS);
      setProfileImage("/profile.jpg");
      setFilterCategory("All");
      setSearchQuery("");
      localStorage.removeItem("portfolio_profile_image");
      localStorage.removeItem("portfolio_profile");
      localStorage.removeItem("portfolio_projects");
      localStorage.removeItem("portfolio_trainings");
      setSyncStatus({ type: "idle", message: "" });
    }
  };

  // Handle synchronizing live portfolio data from Google Sheets deployment URL
  const handleSyncSheets = async () => {
    if (!gasAppUrl.trim()) {
      setSyncStatus({
        type: "error",
        message: lang === "TH" ? "กรุณาระบุ URL ของ Google Web App ก่อนกดดึงข้อมูล" : "Please specify Google Web App URL before syncing"
      });
      return;
    }

    setIsSyncing(true);
    setSyncStatus({ type: "idle", message: lang === "TH" ? "กำลังติดต่อ Google Apps Script..." : "Connecting to Google Apps Script..." });
    localStorage.setItem("portfolio_gas_api_url", gasAppUrl.trim());

    try {
      const connectorChar = gasAppUrl.includes("?") ? "&" : "?";
      const fetchUrl = `${gasAppUrl.trim()}${connectorChar}api=json`;
      
      const response = await fetch(fetchUrl);
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        // Old format (projects array only)
        const validated: ProjectItem[] = data.map((item: any, idx: number) => ({
          id: item.id || `gas-${idx}-${Date.now()}`,
          Date: item.Date || item.date || "2025-06",
          Category: item.Category || item.category || "General",
          Category_EN: item.Category_EN || item.category_en || item.Category || "General",
          Title: item.Title || item.title || "",
          Title_EN: item.Title_EN || item.title_en || item.Title || "",
          Description: item.Description || item.description || "",
          Description_EN: item.Description_EN || item.description_en || item.Description || "",
          Tools: item.Tools || item.tools || "",
          Drive_Image_Link: item.Drive_Image_Link || item.drive_image_link || ""
        }));

        setProjects(validated);
        setSyncStatus({
          type: "success",
          message: lang === "TH" 
            ? `เชื่อมต่อสำเร็จ! ดึงผลงานล่าสุดได้ ${validated.length} รายการจาก Google Sheets` 
            : `Sync Success! Loaded ${validated.length} projects from Google Sheets`
        });
      } else if (data && typeof data === "object") {
        // New format (profile, projects, trainings object)
        let projectCount = 0;
        
        if (data.projects && Array.isArray(data.projects)) {
          const validated: ProjectItem[] = data.projects.map((item: any, idx: number) => ({
            id: item.id || `gas-${idx}-${Date.now()}`,
            Date: item.Date || item.date || "2025-06",
            Category: item.Category || item.category || "General",
            Category_EN: item.Category_EN || item.category_en || item.Category || "General",
            Title: item.Title || item.title || "",
            Title_EN: item.Title_EN || item.title_en || item.Title || "",
            Description: item.Description || item.description || "",
            Description_EN: item.Description_EN || item.description_en || item.Description || "",
            Tools: item.Tools || item.tools || "",
            Drive_Image_Link: item.Drive_Image_Link || item.drive_image_link || ""
          }));
          setProjects(validated);
          projectCount = validated.length;
        }
        
        if (data.profile) {
          const validatedProfile: ProfileDetails = {
            name: data.profile.name || "Taweesak Kompok",
            nameThai: data.profile.nameThai || "ทวีศักดิ์ คำปก",
            title: data.profile.title || "",
            title_en: data.profile.title_en || data.profile.title || "",
            company: data.profile.company || "",
            company_en: data.profile.company_en || data.profile.company || "",
            phone: data.profile.phone || "",
            email: data.profile.email || "",
            address: data.profile.address || "",
            address_en: data.profile.address_en || data.profile.address || "",
            summary: data.profile.summary || "",
            summary_en: data.profile.summary_en || data.profile.summary || "",
            languages: data.profile.languages || "",
            languages_en: data.profile.languages_en || data.profile.languages || "",
            licenses: Array.isArray(data.profile.licenses) ? data.profile.licenses.map((l: any, i: number) => ({
              id: l.id || `lic-${i}`,
              name: l.name || "",
              name_en: l.name_en || l.name || "",
              issuer: l.issuer || "",
              issuer_en: l.issuer_en || l.issuer || "",
              image: l.image || ""
            })) : [],
            education: Array.isArray(data.profile.education) ? data.profile.education.map((ed: any, i: number) => ({
              id: ed.id || `edu-${i}`,
              degree: ed.degree || "",
              degree_en: ed.degree_en || ed.degree || "",
              school: ed.school || "",
              school_en: ed.school_en || ed.school || ""
            })) : []
          };
          setProfile(validatedProfile);
          
          if (data.profile.profileImage) {
            setProfileImage(data.profile.profileImage);
            localStorage.setItem("portfolio_profile_image", data.profile.profileImage);
          }
        }
        
        if (data.trainings && Array.isArray(data.trainings)) {
          setTrainings(data.trainings);
        }

        setSyncStatus({
          type: "success",
          message: lang === "TH"
            ? `เชื่อมต่อสำเร็จ! ดึงข้อมูลโปรไฟล์และผลงานล่าสุดสำเร็จจาก Google Sheets`
            : `Sync Success! Updated profile and training history dynamically from Google Sheets`
        });
      } else {
        throw new Error("โครงสร้างข้อมูลในชีตไม่ตรงกับระบบ");
      }
    } catch (err: any) {
      console.error("Sheets sync error:", err);
      setSyncStatus({
        type: "error",
        message: lang === "TH"
          ? "เชื่อมต่อไม่สำเร็จ: กรุณาตั้งค่าสิทธิ์เว็บแอปเป็น \"Anyone\" (ทุกคน) บน Apps Script"
          : "Sync Failed: Please ensure your Apps Script is deployed with Access: 'Anyone'"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const copyToClipboard = (text: string, identifier: string, index?: number) => {
    navigator.clipboard.writeText(text);
    if (index !== undefined) {
      setCopiedCodeIndex(index);
      setTimeout(() => setCopiedCodeIndex(null), 2000);
    } else {
      setCopiedCodeFilename(identifier);
      setTimeout(() => setCopiedCodeFilename(""), 2000);
    }
  };

  const copyDirectLink = () => {
    navigator.clipboard.writeText(convertedDirectLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Check Category Badge Theme matching Taweesak Kompok's resume
  const getCategoryTheme = (cat: string) => {
    const term = cat.toLowerCase();
    if (term.includes("safety") || term.includes("compliance") || term.includes("security") || term.includes("ความปลอดภัย") || term.includes("กฎเกณฑ์")) {
      return {
        bg: "bg-rose-500/10 text-rose-500 border border-rose-500/25 light:bg-rose-50 light:text-rose-600 light:border-rose-200",
        pill: "bg-rose-500",
        textSide: "text-rose-500 light:text-rose-600",
        border: "border-rose-950/40 light:border-rose-100",
        dotBg: "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)]",
        gradient: "from-rose-950/20 to-brand-card",
        avatar: "bg-gradient-to-tr from-rose-500 to-amber-500",
        icon: <ShieldCheck className="w-5 h-5 text-rose-500 light:text-rose-600" />
      };
    }
    if (term.includes("infrastructure") || term.includes("it") || term.includes("network") || term.includes("ไอที") || term.includes("ระบบ")) {
      return {
        bg: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 light:bg-cyan-50 light:text-cyan-600 light:border-cyan-200",
        pill: "bg-cyan-500",
        textSide: "text-cyan-400 light:text-cyan-600",
        border: "border-cyan-950/40 light:border-cyan-100",
        dotBg: "bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.6)]",
        gradient: "from-cyan-950/20 to-brand-card",
        avatar: "bg-gradient-to-tr from-cyan-500 to-blue-500",
        icon: <HardDrive className="w-5 h-5 text-cyan-400 light:text-cyan-600" />
      };
    }
    return {
      bg: "bg-slate-500/10 text-slate-400 border border-slate-500/25 light:bg-slate-100 light:text-slate-600 light:border-slate-200",
      pill: "bg-slate-500",
      textSide: "text-slate-400 light:text-slate-600",
      border: "border-slate-800 light:border-slate-100",
      dotBg: "bg-slate-500 shadow-[0_0_12px_rgba(100,116,139,0.6)]",
      gradient: "from-slate-900 to-brand-card",
      avatar: "bg-gradient-to-tr from-slate-400 to-slate-600",
      icon: <Layers className="w-5 h-5 text-slate-400 light:text-slate-600" />
    };
  };

  // Open Modals handlers
  const openProfileEdit = () => {
    handleActionWithPassword(() => {
      setTempProfile({ ...profile });
      setActiveEditModal("profile");
    });
  };

  const openSummaryEdit = () => {
    handleActionWithPassword(() => {
      setTempProfile({ ...profile });
      setActiveEditModal("summary");
    });
  };

  const openLicensesEdit = () => {
    handleActionWithPassword(() => {
      setTempLicenses(profile.licenses.map(l => ({ ...l })));
      setActiveEditModal("licenses");
    });
  };

  const openEduEdit = () => {
    handleActionWithPassword(() => {
      setTempEdu(profile.education.map(e => ({ ...e })));
      setTempLanguages(profile.languages);
      setTempLanguagesEn(profile.languages_en);
      setActiveEditModal("education");
    });
  };

  // Save Modal handlers
  const saveProfileEdit = () => {
    setProfile(tempProfile);
    setActiveEditModal(null);
  };

  const saveSummaryEdit = () => {
    setProfile(tempProfile);
    setActiveEditModal(null);
  };

  const saveLicensesEdit = () => {
    setProfile({
      ...profile,
      licenses: tempLicenses
    });
    setActiveEditModal(null);
  };

  const saveEduEdit = () => {
    setProfile({
      ...profile,
      education: tempEdu,
      languages: tempLanguages,
      languages_en: tempLanguagesEn
    });
    setActiveEditModal(null);
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text antialiased font-sans flex flex-col transition-colors duration-300">
      {/* ================= HEADER BRANDING ================= */}
      <nav className="bg-brand-card/95 border-b border-brand-border sticky top-0 z-40 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-cyan-500 text-slate-950 p-2 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <GitCommit className="w-6 h-6 rotate-90" />
              </div>
              <div className="hidden sm:block">
                <span className="font-semibold text-brand-text-heading tracking-tight text-lg block font-display">Taweesak Portfolio</span>
              </div>
            </div>

            {/* Main Tabs Navigation */}
            <div className="flex bg-brand-card-sec p-1 rounded-xl border border-brand-border font-medium gap-1">
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-3 py-1.5 rounded-lg text-xs transition duration-200 flex items-center gap-1.5 font-sans cursor-pointer ${
                  activeTab === "preview" 
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-sm" 
                    : "text-brand-text-muted hover:text-brand-text-heading"
                }`}
              >
                <Layout className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang === "TH" ? "หน้าหลักผลงาน" : "Timeline Portfolio"}</span>
                <span className="sm:hidden">{lang === "TH" ? "ประวัติ" : "Timeline"}</span>
              </button>
              
              <button
                onClick={() => setActiveTab("trainings")}
                className={`px-3 py-1.5 rounded-lg text-xs transition duration-200 flex items-center gap-1.5 font-sans cursor-pointer ${
                  activeTab === "trainings" 
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-sm" 
                    : "text-brand-text-muted hover:text-brand-text-heading"
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>{lang === "TH" ? `ประวัติอบรม (${trainings.length})` : `Trainings (${trainings.length})`}</span>
              </button>
            </div>
            
            <div className="flex items-center gap-2.5">
              {/* Language Switcher */}
              <button
                onClick={() => setLang(lang === "TH" ? "EN" : "TH")}
                className="px-2.5 py-1.5 rounded-xl bg-brand-card-sec hover:bg-brand-card-hover border border-brand-border text-cyan-400 hover:text-cyan-300 font-bold font-mono text-xs cursor-pointer transition flex items-center gap-1"
                title={lang === "TH" ? "Switch to English" : "สลับเป็นภาษาไทย"}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{lang}</span>
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-brand-card-sec hover:bg-brand-card-hover border border-brand-border text-brand-text hover:text-brand-text-heading cursor-pointer transition duration-150"
                title={theme === "dark" ? "สวิตช์เป็นโหมดสว่าง (Light Mode)" : "สวิตช์เป็นโหมดมืด (Dark Mode)"}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-cyan-400" />
                ) : (
                  <Moon className="w-4 h-4 text-cyan-400" />
                )}
              </button>

              <span className="hidden lg:inline bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full text-[11px] font-mono">
                ● Ready for Production
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ================= 1. LIVE PREVIEW MODE ================= */}
        {activeTab === "preview" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LATEST CONTROLS & MANAGEMENT INTERACTIVE PANEL */}
            <div className="lg:col-span-4 space-y-6 w-full">
              
              {/* Profile Card Mockup */}
              <div className="relative overflow-hidden bg-brand-card rounded-2xl border border-brand-border text-brand-text shadow-[0_4px_20px_rgba(0,0,0,0.3)] p-6 transition-colors duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500 rounded-full filter blur-[60px] opacity-15 pointer-events-none -mr-10 -mt-10"></div>
                
                <div className="relative flex items-center gap-4">
                  {/* Edit profile trigger */}
                  <button 
                    onClick={openProfileEdit}
                    className="absolute -top-2 right-0 p-1.5 rounded-lg bg-brand-card-sec hover:bg-brand-card-hover border border-brand-border text-cyan-400 hover:text-cyan-300 cursor-pointer transition"
                    title={lang === "TH" ? "แก้ไขข้อมูลส่วนตัว" : "Edit profile info"}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>

                  {/* Avatar Uploadable Area */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    className={`group relative w-16 h-16 rounded-full overflow-hidden border-2 shrink-0 cursor-pointer transition-all duration-300 flex items-center justify-center font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)] ${
                      isDragging 
                        ? "border-cyan-450 bg-cyan-500/20 scale-105" 
                        : "border-cyan-500 hover:border-cyan-400 bg-gradient-to-tr from-blue-600 to-cyan-400"
                    }`}
                    title="คลิกสลักรูปภาพหรือลากไฟล์ภาพมาที่นี่เพื่ออัปโหลดรูปโปรไฟล์"
                  >
                    {profileImage ? (
                      <img 
                        src={profileImage} 
                        alt="โปรไฟล์ผู้ใช้" 
                        className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <User className="w-8 h-8 text-slate-900" />
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-[10px] text-white">
                      <Camera className="w-4 h-4 mb-0.5 text-cyan-400" />
                      <span>{lang === "TH" ? "อัปโหลด" : "Upload"}</span>
                    </div>
                  </div>
                  
                  {/* Hidden Input File */}
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleProfileImageUpload(e.target.files[0]);
                      }
                    }}
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="pr-6">
                    <h2 className="text-lg font-bold font-display tracking-tight text-brand-text-heading truncate">
                      {lang === "TH" ? profile.nameThai : profile.name}
                    </h2>
                    <p className="text-[11px] text-cyan-400 font-mono font-bold">
                      {lang === "TH" ? profile.name : profile.nameThai}
                    </p>
                    <p className="text-xs text-amber-500 light:text-amber-600 font-sans font-semibold mt-0.5">
                      {lang === "TH" ? profile.title : profile.title_en}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-brand-text-muted">
                      <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                      <span className="font-medium text-brand-text-heading">
                        {lang === "TH" ? profile.company : profile.company_en}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Interactive Contact block */}
                <div className="mt-5 pt-4 border-t border-brand-border/60 space-y-2.5 text-xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-display flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    {lang === "TH" ? "ข้อมูลการติดต่อ" : "Contact Details"}
                  </h3>
                  
                  {/* Phone */}
                  <div className="flex items-center justify-between gap-2 bg-brand-card-sec border border-brand-border/60 rounded-xl p-2.5">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="font-mono text-xs text-brand-text-heading shrink-0">{profile.phone}</span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(profile.phone);
                        setCopiedPhone(true);
                        setTimeout(() => setCopiedPhone(false), 2000);
                      }}
                      className="text-[10px] bg-brand-bg hover:bg-brand-card-hover border border-brand-border px-2 py-1 rounded text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer shrink-0"
                    >
                      {copiedPhone ? (lang === "TH" ? "คัดลอกแล้ว!" : "Copied!") : (lang === "TH" ? "คัดลอก" : "Copy")}
                    </button>
                  </div>

                  {/* Email */}
                  <div className="flex items-center justify-between gap-2 bg-brand-card-sec border border-brand-border/60 rounded-xl p-2.5">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="font-mono text-[11px] text-brand-text-heading truncate">{profile.email}</span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(profile.email);
                        setCopiedMail(true);
                        setTimeout(() => setCopiedMail(false), 2000);
                      }}
                      className="text-[10px] bg-brand-bg hover:bg-brand-card-hover border border-brand-border px-2 py-1 rounded text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer shrink-0"
                    >
                      {copiedMail ? (lang === "TH" ? "คัดลอกแล้ว!" : "Copied!") : (lang === "TH" ? "คัดลอก" : "Copy")}
                    </button>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-2 bg-brand-card-sec border border-brand-border/60 rounded-xl p-2.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-relaxed text-brand-text font-sans">
                      {lang === "TH" ? profile.address : profile.address_en}
                    </span>
                  </div>
                </div>

                {/* Professional Summary block */}
                <div className="mt-5 pt-4 border-t border-brand-border/60 space-y-2 relative">
                  <button 
                    onClick={openSummaryEdit}
                    className="absolute top-2 right-0 p-1 rounded-lg bg-brand-card-sec hover:bg-brand-card-hover border border-brand-border text-cyan-400 hover:text-cyan-300 cursor-pointer transition"
                    title={lang === "TH" ? "แก้ไขคำสรุปสายอาชีพ" : "Edit summary"}
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-display pr-6">
                    {lang === "TH" ? "บทสรุปสายอาชีพ (Professional Summary)" : "Professional Summary"}
                  </h3>
                  <p className="text-[11.5px] text-brand-text font-light leading-relaxed font-sans text-justify">
                    {lang === "TH" ? profile.summary : profile.summary_en}
                  </p>
                </div>

                {/* Licenses & Certifications block */}
                <div className="mt-5 pt-4 border-t border-brand-border/60 space-y-2.5 relative">
                  <button 
                    onClick={openLicensesEdit}
                    className="absolute top-2.5 right-0 p-1 rounded-lg bg-brand-card-sec hover:bg-brand-card-hover border border-brand-border text-cyan-400 hover:text-cyan-300 cursor-pointer transition"
                    title={lang === "TH" ? "แก้ไขใบอนุญาต" : "Edit licenses"}
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-display flex items-center gap-1 pr-6">
                    <Award className="w-3.5 h-3.5" />
                    {lang === "TH" ? "ใบอนุญาตและใบรับรอง" : "Licenses & Certifications"}
                  </h3>
                  <div className="space-y-3">
                    {profile.licenses.map((l) => (
                      <div key={l.id} className="flex gap-3 items-center p-2.5 bg-brand-card-sec border-l-2 border-cyan-500 rounded-r-xl group">
                        <div 
                          onClick={() => l.image && setLightboxImage(l.image)}
                          className={`w-14 h-10 rounded border border-brand-border shrink-0 overflow-hidden flex items-center justify-center bg-brand-bg ${l.image ? "cursor-zoom-in relative group/img" : ""}`}
                          title={l.image ? (lang === "TH" ? "กดเพื่อดูรูปภาพใบรับรอง" : "Click to view certificate") : undefined}
                        >
                          {l.image ? (
                            <>
                              <img src={l.image} alt={l.name} className="w-full h-full object-cover group-hover/img:scale-105 transition" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition">
                                <Eye className="w-3 h-3 text-white" />
                              </div>
                            </>
                          ) : (
                            <Award className="w-5 h-5 text-cyan-400 opacity-60" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-bold text-brand-text-heading text-[11px] block font-sans truncate" title={lang === "TH" ? l.name : l.name_en}>
                            {lang === "TH" ? l.name : l.name_en}
                          </span>
                          <span className="text-[10px] text-brand-text-muted font-sans block truncate" title={lang === "TH" ? l.issuer : l.issuer_en}>
                            {lang === "TH" ? l.issuer : l.issuer_en}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education block */}
                <div className="mt-5 pt-4 border-t border-brand-border/60 space-y-2.5 relative">
                  <button 
                    onClick={openEduEdit}
                    className="absolute top-2.5 right-0 p-1 rounded-lg bg-brand-card-sec hover:bg-brand-card-hover border border-brand-border text-cyan-400 hover:text-cyan-300 cursor-pointer transition"
                    title={lang === "TH" ? "แก้ไขการศึกษาและภาษา" : "Edit education and languages"}
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-display flex items-center gap-1 pr-6">
                    <BookOpen className="w-3.5 h-3.5" />
                    {lang === "TH" ? "การศึกษา & ระดับภาษา" : "Education & Languages"}
                  </h3>
                  <div className="space-y-2.5 font-sans text-[11px]">
                    {profile.education.map((e) => (
                      <div key={e.id} className="relative pl-3.5 before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:bg-cyan-400 before:rounded-full">
                        <strong className="text-brand-text-heading">
                          {lang === "TH" ? e.degree : e.degree_en}
                        </strong>
                        <span className="text-brand-text-muted block text-[10px]">
                          {lang === "TH" ? e.school : e.school_en}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-2 bg-brand-bg rounded-xl text-[10px] leading-relaxed border border-brand-border/60 text-brand-text-muted font-sans font-light mt-2.5">
                    🌐 <span className="font-semibold text-brand-text-heading">
                      {lang === "TH" ? "ภาษา:" : "Languages:"}
                    </span> {lang === "TH" ? profile.languages : profile.languages_en}
                  </div>
                </div>

                {/* Tip section */}
                <div className="mt-5 bg-cyan-500/5 p-2.5 rounded-xl border border-cyan-500/10 text-[10px] font-sans text-brand-text-muted leading-relaxed">
                  💡 <span className="font-semibold text-brand-text-heading">{lang === "TH" ? "เคล็ดลับ:" : "Tip:"}</span> {lang === "TH" ? "คุณสามารถกดปุ่มดินสอที่หัวข้อแต่ละส่วนเพื่อเข้าไปแก้ไขข้อความได้ทันที หรือกดที่รูปโปรไฟล์เพื่อเปลี่ยนภาพ" : "You can click the pencil icons to edit details, or click the profile image to upload a new one."}
                </div>

              </div>

              {/* Simulation Controller */}
              <div className="bg-brand-card rounded-2xl border border-brand-border shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted flex items-center gap-1.5 font-display">
                    <Settings className="w-4 h-4 text-cyan-400" />
                    Interactive Customization
                  </span>
                  <button 
                    onClick={() => handleActionWithPassword(handleResetDemo)}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition duration-150 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    {lang === "TH" ? "รีเซ็ตค่าทั้งหมด" : "Reset All Data"}
                  </button>
                </div>

                <div className="h-px bg-brand-border"></div>

                {/* Live adding mock trigger */}
                {!showAddForm ? (
                  <button
                    onClick={() => handleActionWithPassword(() => setShowAddForm(true))}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-xl text-xs font-bold transition duration-150 shadow-lg shadow-cyan-500/10 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    {lang === "TH" ? "เพิ่มผลงานใหม่เข้า Timeline" : "Add New Milestone"}
                  </button>
                ) : (
                  <form onSubmit={handleAddProject} className="space-y-3.5 pt-1">
                    <h4 className="text-xs font-bold text-brand-text-heading font-display">
                      {lang === "TH" ? "ฟอร์มเพิ่มโครงการใหม่" : "Add New Milestone"}
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-brand-text-muted mb-1 font-sans">
                          {lang === "TH" ? "วันที่" : "Date"} (YYYY-MM)
                        </label>
                        <input 
                          type="month" 
                          value={newDate} 
                          onChange={(e) => setNewDate(e.target.value)}
                          className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-lg p-2 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-brand-text-muted mb-1 font-sans">
                          {lang === "TH" ? "หมวดหมู่" : "Category"}
                        </label>
                        <select 
                          value={newCategory} 
                          onChange={(e) => {
                            setNewCategory(e.target.value);
                            setNewCategoryEn(e.target.value);
                          }}
                          className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-lg p-2 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none"
                        >
                          <option value="Safety & Compliance" className="bg-brand-card text-brand-text">Safety & Compliance</option>
                          <option value="IT Infrastructure & Security" className="bg-brand-card text-brand-text">IT Infrastructure & Security</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-brand-text-muted mb-1 font-sans">
                        {lang === "TH" ? "หัวข้อผลงาน (ภาษาไทย)" : "Milestone Title (Thai)"}
                      </label>
                      <input 
                        type="text" 
                        placeholder="เช่น ระบบกล้อง CCTV ด่านความปลอดภัย" 
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-lg p-2 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                        required 
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-brand-text-muted mb-1 font-sans">
                        {lang === "TH" ? "หัวข้อผลงาน (ภาษาอังกฤษ)" : "Milestone Title (English)"}
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. CCTV Surveillance Integration" 
                        value={newTitleEn}
                        onChange={(e) => setNewTitleEn(e.target.value)}
                        className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-lg p-2 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                        required 
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-brand-text-muted mb-1 font-sans">
                        {lang === "TH" ? "รายละเอียด (ภาษาไทย)" : "Description (Thai)"}
                      </label>
                      <textarea 
                        placeholder="อธิบายสรุปโครงการและหน้าที่รับผิดชอบ" 
                        rows={2}
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-lg p-2 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 resize-none"
                        required 
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-brand-text-muted mb-1 font-sans">
                        {lang === "TH" ? "รายละเอียด (ภาษาอังกฤษ)" : "Description (English)"}
                      </label>
                      <textarea 
                        placeholder="Explain project scope and results briefly" 
                        rows={2}
                        value={newDescriptionEn}
                        onChange={(e) => setNewDescriptionEn(e.target.value)}
                        className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-lg p-2 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 resize-none"
                        required 
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-brand-text-muted mb-1 font-sans">
                        {lang === "TH" ? "เครื่องมือ/เทคโนโลยี (แยกด้วยจุลภาค ,)" : "Tools Used (comma separated)"}
                      </label>
                      <input 
                        type="text" 
                        placeholder="เช่น CCTV, SCADA, VLAN, VMware" 
                        value={newTools}
                        onChange={(e) => setNewTools(e.target.value)}
                        className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-lg p-2 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-brand-text-muted mb-1 font-sans">
                        {lang === "TH" ? "รูปภาพผลงาน" : "Project Image"}
                      </label>
                      <div className="flex gap-2 items-center">
                        <input 
                          type="text" 
                          placeholder="https://example.com/image.jpg หรืออัปโหลดไฟล์" 
                          value={newDriveLink}
                          onChange={(e) => setNewDriveLink(e.target.value)}
                          className="flex-1 text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-lg p-2 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                        />
                        <label className="bg-brand-card-sec hover:bg-brand-card-hover border border-brand-border px-3 py-2 rounded-lg text-[11px] text-cyan-400 font-bold cursor-pointer transition shrink-0">
                          {lang === "TH" ? "อัปโหลด" : "Upload"}
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                const file = e.target.files[0];
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  if (event.target?.result && typeof event.target.result === "string") {
                                    setNewDriveLink(event.target.result);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                      {newDriveLink && (
                        <div className="mt-2 w-20 h-14 border border-brand-border rounded-lg overflow-hidden relative group">
                          <img src={newDriveLink} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                            type="button" 
                            onClick={() => setNewDriveLink("")}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-rose-500 font-bold transition"
                          >
                            {lang === "TH" ? "ลบรูป" : "Remove"}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button 
                        type="button" 
                        onClick={() => setShowAddForm(false)} 
                        className="flex-1 text-center py-2 bg-brand-border hover:bg-brand-card-hover rounded-lg text-xs font-semibold text-brand-text transition cursor-pointer"
                      >
                        {lang === "TH" ? "ยกเลิก" : "Cancel"}
                      </button>
                      <button 
                        type="submit" 
                        className="flex-1 text-center py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-xs font-bold text-slate-950 transition cursor-pointer"
                      >
                        {lang === "TH" ? "เพิ่มลงไทม์ไลน์" : "Add Milestone"}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Real Google Sheets Live Synchronizer */}
              <div className="bg-brand-card-sec rounded-2xl border border-brand-border p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-cyan-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-brand-text-heading font-display">
                      {lang === "TH" ? "ศูนย์เชื่อมต่อข้อมูลสด (Live Sheets Sync)" : "Live Sheets Sync Center"}
                    </h4>
                    <p className="text-[10px] text-brand-text-muted">
                      {lang === "TH" ? "แก้ไขข้อมูลในชีตแล้วกดดึงแอปพลิเคชันจะอัปเดตทันที!" : "Edit Google Sheet cells, then sync to reload dynamically!"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[9px] uppercase font-bold text-brand-text-muted tracking-wider font-sans">
                    URL ของ Google Web App (Deploy as Web App)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={gasAppUrl}
                      onChange={(e) => setGasAppUrl(e.target.value)}
                      placeholder="https://script.google.com/macros/s/.../exec"
                      className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl pl-3 pr-20 py-2.5 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none placeholder-brand-text-muted/40 font-mono"
                    />
                    <button
                      onClick={handleSyncSheets}
                      disabled={isSyncing}
                      className="absolute right-1.5 top-1.5 bg-cyan-500 hover:bg-cyan-450 disabled:bg-cyan-500/30 text-slate-950 px-3 py-1 rounded-lg text-[10px] font-bold font-sans transition cursor-pointer flex items-center gap-1"
                    >
                      {isSyncing ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          {lang === "TH" ? "ดึงข้อมูล..." : "Syncing..."}
                        </>
                      ) : (
                        lang === "TH" ? "Sync ข้อมูล" : "Sync"
                      )}
                    </button>
                  </div>
                </div>

                {/* Status Messages */}
                {syncStatus.message && (
                  <div className={`p-2.5 rounded-xl border text-[11px] leading-relaxed font-sans ${
                    syncStatus.type === "success" 
                      ? "bg-cyan-500/5 border-cyan-500/20 text-cyan-400" 
                      : syncStatus.type === "error"
                      ? "bg-rose-500/5 border-rose-500/20 text-rose-555"
                      : "bg-blue-500/5 border-blue-500/20 text-blue-300"
                  }`}>
                    {syncStatus.message}
                  </div>
                )}
              </div>

            </div>

            {/* TIMELINE VISUAL DESIGN - MAIN SECTION */}
            <div className="lg:col-span-8 bg-brand-card rounded-3xl border border-brand-border shadow-[0_4px_24px_rgba(0,0,0,0.3)] p-6 sm:p-8 w-full">
              
              {/* Filters Header Section */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-lg font-bold text-brand-text-heading flex items-center gap-2 font-display">
                    <GitCommit className="w-5 h-5 text-cyan-400" />
                    {lang === "TH" ? "ประวัติการทำงานและผลงาน" : "Career Timeline & Project Archive"}
                  </h3>
                  <p className="text-xs text-brand-text-muted font-light mt-0.5 font-sans">
                    {lang === "TH" ? "แสดงประวัติผลงานแบบ Timeline เรียงลำดับจากล่าสุด" : "Visual career milestones and archives sorted chronologically"}
                  </p>
                </div>

                {/* Simple Live Search */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-4 w-4 text-brand-text-muted/60" />
                  </span>
                  <input
                    type="text"
                    placeholder={lang === "TH" ? "ค้นหาชื่อผลงาน, เครื่องมือ..." : "Search milestone title, tools..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 w-full md:w-56 text-xs bg-brand-bg border border-brand-border rounded-xl text-brand-text-heading focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500 focus:outline-none placeholder-brand-text-muted/50"
                  />
                </div>
              </div>

              {/* Dynamic Category Tabs */}
              <div className="flex flex-wrap gap-2 mb-8 bg-brand-card-sec p-2 rounded-2xl border border-brand-border/60">
                {categoriesList.map((category) => (
                  <button
                    key={category}
                    onClick={() => setFilterCategory(category)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition duration-200 cursor-pointer ${
                      filterCategory === category
                        ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                        : "text-brand-text-muted hover:text-brand-text-heading bg-brand-bg hover:bg-brand-card-hover border border-brand-border/60"
                    }`}
                  >
                    {category === "All" ? (lang === "TH" ? "ทั้งหมด" : "All") : category}
                    {category !== "All" && (
                      <span className="ml-1.5 px-1.5 py-0.5 text-[10px] rounded-md bg-brand-card-sec border border-brand-border text-cyan-400 font-mono">
                        {projects.filter(p => (lang === "TH" ? p.Category : (p.Category_EN || p.Category)) === category).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* If no items match */}
              {filteredProjects.length === 0 ? (
                <div className="text-center py-20 bg-brand-card-sec rounded-2xl border border-dashed border-brand-border">
                  <div className="w-12 h-12 rounded-full bg-brand-bg text-brand-text-muted flex items-center justify-center mx-auto mb-3">
                    <Info className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h4 className="text-sm font-bold text-brand-text font-display">
                    {lang === "TH" ? "ไม่พบข้อมูลที่ระบุ" : "No results found"}
                  </h4>
                  <p className="text-xs text-brand-text-muted mt-1 font-sans">
                    {lang === "TH" ? "กรุณาลองเปลี่ยนคำค้นหาหรือเพิ่มข้อมูลใหม่" : "Try revising your search query or add a mock milestone."}
                  </p>
                </div>
              ) : (
                <div className="relative pl-6 sm:pl-12">
                  
                  {/* Timeline central vertical track */}
                  <div className="absolute left-[11px] sm:left-[21px] top-4 bottom-4 w-1 bg-brand-border rounded-full pointer-events-none"></div>

                  {/* Mapping Timeline Cards */}
                  <div className="space-y-12">
                    {filteredProjects.map((project) => {
                      const theme = getCategoryTheme(project.Category);
                      
                      // Unsplash image or link
                      const isDemo = project.Drive_Image_Link.includes("_demo_image") || project.Drive_Image_Link.includes("fill_with_folders");
                      const directImageUrl = isDemo 
                         ? (CATEGORY_UNSPLASH_IMAGES[project.Category] || CATEGORY_UNSPLASH_IMAGES["General"])
                        : project.Drive_Image_Link;

                      return (
                        <div key={project.id} className="relative group">
                          
                          {/* Left node dot point */}
                          <div className={`absolute -left-[20px] sm:-left-[37px] top-[14px] w-6 sm:w-8 h-8 rounded-full border-4 border-brand-bg ${theme.dotBg} shadow-slate-950 shadow-md z-10 flex items-center justify-center`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                          </div>

                          {/* Chronology Card body layout */}
                          <div className="bg-brand-card rounded-2xl border border-brand-border hover:border-brand-border/90 shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all duration-300 overflow-hidden">
                            
                            <div className="grid grid-cols-1 md:grid-cols-12">
                              
                              {/* Visual side block */}
                              <div className="md:col-span-5 relative aspect-video md:aspect-auto overflow-hidden bg-slate-950">
                                <img 
                                  src={directImageUrl} 
                                  alt={lang === "TH" ? project.Title : project.Title_EN} 
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                                  referrerPolicy="no-referrer"
                                />
                                
                                <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide border shadow-md backdrop-blur-md bg-opacity-95 ${theme.bg}`}>
                                    {lang === "TH" ? project.Category : (project.Category_EN || project.Category)}
                                  </span>
                                </div>

                                <div className="absolute bottom-3 right-3">
                                  <span className="px-2.5 py-1 rounded-lg text-[10px] bg-[#0c0c10]/80 text-slate-200 font-medium backdrop-blur-sm flex items-center gap-1 font-mono border border-brand-border/40">
                                    <Calendar className="w-3 h-3 text-cyan-400" />
                                    {project.Date}
                                  </span>
                                </div>
                              </div>

                              {/* Descriptive Content side block */}
                              <div className="md:col-span-7 p-6 flex flex-col justify-between bg-brand-card-sec/30">
                                <div>
                                  <div className="flex items-center justify-between gap-2 mb-2">
                                    <span className={`text-[10px] font-bold tracking-wider uppercase ${theme.textSide}`}>
                                      {(lang === "TH" ? project.Category : (project.Category_EN || project.Category))}
                                    </span>
                                    <div className="flex items-center gap-1">
                                      <button 
                                        onClick={() => handleActionWithPassword(() => setEditingProject(project))}
                                        className="text-slate-500 hover:text-cyan-450 p-1 rounded-lg hover:bg-brand-card-sec transition duration-155 cursor-pointer"
                                        title={lang === "TH" ? "แก้ไขผลงาน" : "Edit milestone"}
                                      >
                                        <Pencil className="w-3.5 h-3.5" />
                                      </button>
                                      <button 
                                        onClick={() => {
                                          handleActionWithPassword(() => {
                                            const confirmed = window.confirm(lang === "TH" ? "ต้องการลบโปรเจคนี้ใช่หรือไม่?" : "Are you sure you want to delete this project?");
                                            if (confirmed) {
                                              setProjects(projects.filter(p => p.id !== project.id));
                                            }
                                          });
                                        }}
                                        className="text-slate-500 hover:text-rose-500 p-1 rounded-lg hover:bg-rose-950/20 transition duration-150 cursor-pointer"
                                        title={lang === "TH" ? "ลบผลงาน" : "Delete milestone"}
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                  
                                  <h4 className="text-base font-bold text-brand-text-heading font-display leading-snug hover:text-cyan-400 transition duration-200">
                                    {lang === "TH" ? project.Title : project.Title_EN}
                                  </h4>
                                  
                                  <p className="text-xs text-brand-text font-light mt-2.5 leading-relaxed font-sans">
                                    {lang === "TH" ? project.Description : project.Description_EN}
                                  </p>
                                </div>

                                <div className="mt-5 pt-4 border-t border-brand-border/80">
                                  <div className="flex flex-wrap gap-1.5">
                                    {project.Tools.split(",").map((tool, i) => {
                                      const trimmed = tool.trim();
                                      if (!trimmed) return null;
                                      return (
                                        <span 
                                          key={i} 
                                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-card-sec border border-brand-border text-brand-text text-[10px] font-medium font-sans animate-fade-in"
                                        >
                                          <Cpu className="w-2.5 h-2.5 text-cyan-400" />
                                          {trimmed}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>

                              </div>

                            </div>

                          </div>

                        </div>
                      );
                    })}
                  </div>

                </div>
              )}

            </div>

          </div>
        )}

        {/* ================= 1.5. TBSC TRAINING RECORDS MODE ================= */}
        {activeTab === "trainings" && (
          <div className="space-y-6 animate-fade-in">
            {/* Header / Stats Summary Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-brand-card rounded-2xl border border-brand-border p-5 relative overflow-hidden transition-all duration-300 hover:border-cyan-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500 rounded-full filter blur-[30px] opacity-10 pointer-events-none -mr-4 -mt-4"></div>
                <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1">TOTAL COMPLETED</div>
                <div className="text-3xl font-bold text-brand-text-heading font-display">63 <span className="text-xs text-brand-text-muted font-normal">{lang === "TH" ? "หลักสูตร" : "Courses"}</span></div>
                <div className="text-[10px] text-brand-text-muted mt-2 font-sans">{lang === "TH" ? "ผ่านการฝึกอบรม (100% Passed)" : "All courses completed successfully"}</div>
              </div>
              
              <div className="bg-brand-card rounded-2xl border border-brand-border p-5 relative overflow-hidden transition-all duration-300 hover:border-blue-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500 rounded-full filter blur-[30px] opacity-10 pointer-events-none -mr-4 -mt-4"></div>
                <div className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider mb-1">DEDICATED SERVICE</div>
                <div className="text-3xl font-bold text-brand-text-heading font-display">15 <span className="text-xs text-brand-text-muted font-normal">{lang === "TH" ? "ปี" : "Years"}</span></div>
                <div className="text-[10px] text-brand-text-muted mt-2 font-sans">{lang === "TH" ? "พัฒนาองค์กรที่ บริดจสโตน (TBSC)" : "Tenure at Bridgestone (TBSC)"}</div>
              </div>

              <div className="bg-brand-card rounded-2xl border border-brand-border p-5 relative overflow-hidden transition-all duration-300 hover:border-amber-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500 rounded-full filter blur-[30px] opacity-10 pointer-events-none -mr-4 -mt-4"></div>
                <div className="text-[10px] font-mono font-bold text-amber-500 light:text-amber-600 uppercase tracking-wider mb-1">DLT CERTIFICATION</div>
                <div className="text-2xl font-bold text-brand-text-heading font-display mt-1">TSM <span className="text-[10px] bg-amber-500/10 text-amber-500 light:bg-amber-50 light:text-amber-600 border border-amber-500/20 px-1.5 py-0.5 rounded font-mono">ACTIVE</span></div>
                <div className="text-[10px] text-brand-text-muted mt-1.5 font-sans">{lang === "TH" ? "ผู้จัดการความปลอดภัยด้านการขนส่ง" : "Transport Safety Manager"}</div>
              </div>

              <div className="bg-brand-card rounded-2xl border border-brand-border p-5 relative overflow-hidden transition-all duration-300 hover:border-indigo-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500 rounded-full filter blur-[30px] opacity-10 pointer-events-none -mr-4 -mt-4"></div>
                <div className="text-[10px] font-mono font-bold text-indigo-400 light:text-indigo-600 uppercase tracking-wider mb-1">CAREER LEVEL</div>
                <div className="text-2xl font-bold text-brand-text-heading font-display mt-1">E2 <span className="text-xs text-brand-text-muted font-normal">Senior Officer</span></div>
                <div className="text-[10px] text-brand-text-muted mt-1.5 font-sans">{lang === "TH" ? "ส่วนงานธุรการและอาคารสถานที่" : "General Affairs & Building Dept."}</div>
              </div>
            </div>

            {/* Filter and Search Panel */}
            <div className="bg-brand-card rounded-2xl border border-brand-border p-4 shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-colors duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Search box input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-brand-text-muted" />
                  <input
                    type="text"
                    value={trainingSearch}
                    onChange={(e) => setTrainingSearch(e.target.value)}
                    placeholder={lang === "TH" ? "ค้นหารหัสคอร์ส, Class ID, หรือหัวข้อการฝึกอบรม..." : "Search course code, title..."}
                    className="w-full bg-brand-bg text-xs text-brand-text-heading border border-brand-border rounded-xl pl-9 pr-4 py-2.5 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 focus:outline-none placeholder-brand-text-muted/50"
                  />
                  {trainingSearch && (
                    <button 
                      onClick={() => setTrainingSearch("")}
                      className="absolute right-3 top-2.5 text-xs text-brand-text-muted hover:text-brand-text-heading font-sans cursor-pointer"
                    >
                      {lang === "TH" ? "ล้าง" : "Clear"}
                    </button>
                  )}
                </div>

                {/* Category selectors */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { key: "All", label: lang === "TH" ? `ทั้งหมด (${trainings.length})` : `All (${trainings.length})` },
                    { key: "Safety & Compliance", label: lang === "TH" ? `ความปลอดภัย (${trainings.filter(x => x.category === "Safety & Compliance").length})` : `Safety (${trainings.filter(x => x.category === "Safety & Compliance").length})` },
                    { key: "Production & Quality", label: lang === "TH" ? `การผลิต/คุณภาพ (${trainings.filter(x => x.category === "Production & Quality").length})` : `Production (${trainings.filter(x => x.category === "Production & Quality").length})` },
                    { key: "IT & Technical", label: lang === "TH" ? `ไอที/เทคนิค (${trainings.filter(x => x.category === "IT & Technical").length})` : `IT/Tech (${trainings.filter(x => x.category === "IT & Technical").length})` },
                    { key: "Management & General", label: lang === "TH" ? `ทั่วไป (${trainings.filter(x => x.category === "Management & General").length})` : `General (${trainings.filter(x => x.category === "Management & General").length})` }
                  ].map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => setTrainingCategory(cat.key)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-sans transition duration-200 cursor-pointer ${
                        trainingCategory === cat.key
                          ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                          : "bg-brand-card-sec hover:bg-brand-card-hover text-brand-text border border-brand-border hover:text-brand-text-heading"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

              </div>
            </div>

            {/* Main Records Table view */}
            <div className="bg-brand-card rounded-2xl border border-brand-border shadow-[0_4px_24px_rgba(0,0,0,0.3)] overflow-hidden">
              <div className="p-4 bg-brand-card-sec border-b border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-brand-text-heading font-display">
                    {lang === "TH" ? "ประวัติบันทึกการฝึกอบรมพนักงาน (TBSC HR Training Matrix)" : "Employee Training Matrix Records (TBSC HR)"}
                  </h3>
                  <p className="text-[11px] text-brand-text-muted">
                    {lang === "TH" ? "ข้อมูลจากการฝึกอบรมอย่างเป็นทางการตลอดระยะเวลาปฏิบัติงาน 15 ปี" : "Official HR training details gathered during 15 years of operations."}
                  </p>
                </div>
                <div className="flex items-center gap-3.5 self-end sm:self-auto">
                  <button
                    onClick={() => {
                      handleActionWithPassword(() => {
                        setEditingTraining({
                          id: "tr-" + Date.now(),
                          code: "",
                          classId: "",
                          title: "",
                          dateRange: "",
                          category: "Safety & Compliance",
                          status: "ผ่าน (Passed)"
                        });
                        setActiveEditModal("training");
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-xl text-xs font-bold transition cursor-pointer shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {lang === "TH" ? "เพิ่มประวัติอบรม" : "Add Record"}
                  </button>
                  <div className="text-xs text-cyan-400 font-mono">
                    {lang === "TH" ? `แสดงผลตรงกัน ${filteredTrainings.length} จาก ${trainings.length} รายการ` : `Showing ${filteredTrainings.length} of ${trainings.length} items`}
                  </div>
                </div>
              </div>

              {filteredTrainings.length === 0 ? (
                <div className="p-12 text-center text-brand-text-muted font-sans space-y-2">
                  <Award className="w-8 h-8 mx-auto text-brand-text-muted/40" />
                  <p className="text-xs">{lang === "TH" ? "ไม่พบหลักสูตรฝึกอบรมที่ค้นหา" : "No courses match the criteria."}</p>
                  <button 
                    onClick={() => { setTrainingSearch(""); setTrainingCategory("All"); }}
                    className="text-xs text-cyan-400 hover:underline font-semibold cursor-pointer"
                  >
                    {lang === "TH" ? "ล้างตัวกรองทั้งหมด" : "Clear Filters"}
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse font-sans">
                    <thead>
                      <tr className="bg-brand-bg border-b border-brand-border text-brand-text-muted font-medium">
                        <th className="p-3.5 pl-6 font-mono font-medium tracking-wide">Course Code</th>
                        <th className="p-3.5 font-mono font-medium tracking-wide">Class ID</th>
                        <th className="p-3.5">{lang === "TH" ? "หัวข้อฝึกอบรม / Course Title" : "Course Title"}</th>
                        <th className="p-3.5">{lang === "TH" ? "หมวดหมู่" : "Category"}</th>
                        <th className="p-3.5">{lang === "TH" ? "วันที่อบรม" : "Completion Date"}</th>
                        <th className="p-3.5 text-center">{lang === "TH" ? "ผลการฝึก" : "Status"}</th>
                        <th className="p-3.5 pr-6 text-center">{lang === "TH" ? "การจัดการ" : "Actions"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border/40 text-[11.5px]">
                      {filteredTrainings.map((t, index) => {
                        let badgeColor = "bg-slate-500/10 text-slate-400 border-slate-500/25 light:bg-slate-100 light:text-slate-600";
                        if (t.category === "Safety & Compliance") badgeColor = "bg-rose-500/10 text-rose-455 border-rose-500/20 light:bg-rose-50 light:text-rose-600";
                        else if (t.category === "Production & Quality") badgeColor = "bg-blue-500/10 text-blue-400 border-blue-500/20 light:bg-blue-50 light:text-blue-600";
                        else if (t.category === "IT & Technical") badgeColor = "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 light:bg-cyan-50 light:text-cyan-600";
                        else if (t.category === "Management & General") badgeColor = "bg-purple-500/10 text-purple-400 border-purple-500/20 light:bg-purple-50 light:text-purple-600";

                        return (
                          <tr key={index} className="hover:bg-brand-card-hover/40 transition duration-100">
                            <td className="p-3.5 pl-6 font-mono font-semibold text-brand-text">{t.code}</td>
                            <td className="p-3.5 font-mono text-brand-text-muted">{t.classId}</td>
                            <td className="p-3.5 font-medium text-brand-text-heading">
                              <div className="max-w-md break-words leading-relaxed font-sans">
                                {t.title}
                              </div>
                            </td>
                            <td className="p-3.5">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${badgeColor}`}>
                                {t.category}
                              </span>
                            </td>
                            <td className="p-3.5 font-mono text-brand-text-muted">{t.dateRange}</td>
                            <td className="p-3.5 text-center">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 text-[10px] font-bold font-sans">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                                {t.status || (lang === "TH" ? "ผ่าน (Passed)" : "Passed")}
                              </span>
                            </td>
                            <td className="p-3.5 pr-6 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => {
                                    handleActionWithPassword(() => {
                                      setEditingTraining({ ...t });
                                      setActiveEditModal("training");
                                    });
                                  }}
                                  className="text-slate-500 hover:text-cyan-400 p-1 rounded-lg hover:bg-brand-card-sec transition duration-155 cursor-pointer"
                                  title={lang === "TH" ? "แก้ไขข้อมูล" : "Edit record"}
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    handleActionWithPassword(() => {
                                      const confirmed = window.confirm(
                                        lang === "TH" 
                                          ? `ต้องการลบประวัติการอบรมหลักสูตร ${t.code} ใช่หรือไม่?` 
                                          : `Are you sure you want to delete training record ${t.code}?`
                                      );
                                      if (confirmed) {
                                        setTrainings(trainings.filter(x => x.id !== t.id));
                                      }
                                    });
                                  }}
                                  className="text-slate-500 hover:text-rose-500 p-1 rounded-lg hover:bg-rose-950/20 transition duration-150 cursor-pointer"
                                  title={lang === "TH" ? "ลบข้อมูล" : "Delete record"}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= 2. GAS CODE EXPORTER MODE ================= */}
        {activeTab === "code" && (
          <div className="bg-brand-card rounded-3xl border border-brand-border shadow-[0_4px_24px_rgba(0,0,0,0.3)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px] transition-colors duration-300">
            
            {/* Left selector menu column */}
            <div className="lg:col-span-3 bg-brand-card-sec p-5 border-b lg:border-b-0 lg:border-r border-brand-border space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 font-sans">
                  GAS File Structure
                </h3>
                <p className="text-[11px] text-slate-500 leading-snug font-sans">
                  โครงสร้าง 4 ไฟล์ที่นำไปวางใน Editor ของ Apps Script ได้ทันที
                </p>
              </div>

              <div className="space-y-1.5">
                {GAS_FILES.map((file, idx) => (
                  <button
                    key={file.filename}
                    onClick={() => {
                      setSelectedGasFile(idx);
                      setDriveNotification("");
                    }}
                    className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-medium transition duration-150 flex items-center justify-between border cursor-pointer ${
                      selectedGasFile === idx
                        ? "bg-[#1b1b24] text-cyan-400 border-brand-border shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-[#1b1b24]/40 border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Code className={`w-4 h-4 ${selectedGasFile === idx ? "text-cyan-400" : "text-slate-500"}`} />
                      <span className="font-semibold font-mono">{file.filename}</span>
                    </div>
                    <span className={`text-[9px] uppercase px-2 py-0.5 rounded-md font-sans font-semibold border ${
                      file.filename.includes('html') 
                        ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' 
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {file.filename.split('.').pop()}
                    </span>
                  </button>
                ))}
              </div>

              <div className="h-px bg-brand-border"></div>

              {/* Tips */}
              <div className="bg-amber-500/5 rounded-xl p-3.5 border border-amber-500/10 space-y-1.5 text-amber-250">
                <span className="text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 font-display">
                  <Info className="w-3.5 h-3.5 text-amber-500" />
                  ข้อแนะนำความปลอดภัย
                </span>
                <p className="text-[10px] leading-relaxed font-light font-sans text-slate-400">
                  ใน Apps Script Editor ควรรันฟังก์ชัน <code className="bg-[#18181f] px-1 py-0.5 rounded font-bold font-mono text-cyan-400 border border-brand-border/40">setupInitialData</code> หนึ่งครั้งตอนแรกสุดเพื่อสร้างชาร์ดชีต พร้อม Seed ข้อมูลจำลองลง Spreadsheet
                </p>
              </div>

            </div>

            {/* Right code viewer column */}
            <div className="lg:col-span-9 flex flex-col bg-brand-bg text-slate-150">
              
              {/* File details banner */}
              <div className="bg-[#0e0e12] p-4 border-b border-brand-border flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-cyan-400 font-mono block">Selected File:</span>
                  <span className="text-sm font-bold text-white font-mono block">
                    {GAS_FILES[selectedGasFile].filename}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(GAS_FILES[selectedGasFile].code, GAS_FILES[selectedGasFile].filename, selectedGasFile)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-xl text-xs font-bold transition duration-150 shadow-md shadow-cyan-500/10 cursor-pointer"
                  >
                    {copiedCodeIndex === selectedGasFile ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        คัดลอกโค้ดไฟล์นี้
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Snippet Header explanation */}
              <div className="bg-brand-card-sec px-5 py-3 text-brand-text-muted text-xs border-b border-brand-border font-sans font-light italic">
                {GAS_FILES[selectedGasFile].description}
              </div>

              {/* Code display text */}
              <div className="flex-1 overflow-auto p-5 font-mono text-[11.5px] leading-relaxed text-brand-text bg-brand-bg border-t border-brand-border/20">
                <pre className="whitespace-pre">{GAS_FILES[selectedGasFile].code}</pre>
              </div>

            </div>

          </div>
        )}

        {/* ================= 3. HELPERS AND GUIDES ================= */}
        {activeTab === "export" && (
          <div className="space-y-8">
            <div className="bg-brand-card rounded-3xl border border-brand-border shadow-[0_4px_24px_rgba(0,0,0,0.3)] p-6 sm:p-8">
              <h3 className="text-lg font-bold text-brand-text-heading font-display mb-1.5 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                ขั้นตอนการ "Deploy as Web app" ใน Google Apps Script
              </h3>
              <p className="text-xs text-brand-text-muted font-light mb-6 font-sans">
                ทำตามขั้นตอนด้านล่างหลังจากวางโค้ดครบทั้ง 4 ไฟล์แล้ว เพื่อเผยแพร่พอร์ตโฟลิโอของคุณให้ใช้งานได้
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Step 1 */}
                <div className="bg-brand-card-sec rounded-2xl border border-brand-border p-5 space-y-3 relative overflow-hidden group">
                  <div className="absolute -top-6 -right-6 w-20 h-20 bg-cyan-500/5 rounded-full flex items-center justify-center font-bold text-white/5 text-6xl select-none group-hover:scale-110 transition duration-300">
                    1
                  </div>
                  <div className="text-cyan-400 font-bold font-display text-sm uppercase tracking-wide">
                    ขั้นตอนแรก: จัดเตรียมไฟล์
                  </div>
                  <h4 className="font-bold text-brand-text-heading text-sm font-sans">วางโค้ดและสร้างโครงสร้าง</h4>
                  <p className="text-xs text-brand-text-muted font-light leading-relaxed font-sans">
                    สร้างไฟล์ในหน้า Apps Script Editor ให้ครบ 4 ไฟล์โดยตั้งชื่อให้ถูกตามที่เราระบุไว้: Code.gs, index.html, style.html, script.html
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-brand-card-sec rounded-2xl border border-brand-border p-5 space-y-3 relative overflow-hidden group">
                  <div className="absolute -top-6 -right-6 w-20 h-20 bg-cyan-500/5 rounded-full flex items-center justify-center font-bold text-white/5 text-6xl select-none group-hover:scale-110 transition duration-300">
                    2
                  </div>
                  <div className="text-cyan-400 font-bold font-display text-sm uppercase tracking-wide">
                    ขั้นตอนสอง: Deploy ครั้งแรก
                  </div>
                  <h4 className="font-bold text-brand-text-heading text-sm font-sans">การ Deploy เป็นเว็บแอป (Web App)</h4>
                  <p className="text-xs text-brand-text-muted font-light leading-relaxed font-sans">
                    คลิกที่ปุ่ม "การทำให้ใช้งานได้" (Deploy) ด้านขวาบน ➔ เลือก "การทำให้ใช้งานได้ใหม่" (New Deployment) ➔ ระบุชนิดประเภทเป็น "เว็บแอป" (Web app)
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-brand-card-sec rounded-2xl border border-brand-border p-5 space-y-3 relative overflow-hidden group">
                  <div className="absolute -top-6 -right-6 w-20 h-20 bg-cyan-500/5 rounded-full flex items-center justify-center font-bold text-white/5 text-6xl select-none group-hover:scale-110 transition duration-300">
                    3
                  </div>
                  <div className="text-cyan-400 font-bold font-display text-sm uppercase tracking-wide">
                    ขั้นตอนสุดท้าย: ตั้งสิทธิ์และ Sync
                  </div>
                  <h4 className="font-bold text-brand-text-heading text-sm font-sans">ตั้งเป็น "Anyone" (ทุกคน)</h4>
                  <p className="text-xs text-brand-text-muted font-light leading-relaxed font-sans">
                    กำหนดสิทธิ์การเข้าถึงให้เป็น "Anyone" (ทุกคน) เพื่อให้ Client ดึงผลงานผ่าน URL ของคุณได้ จากนั้นนำ Web App URL มาใส่หน้าหลักผลงานและกดเชื่อมต่อ
                  </p>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>


      {/* ================= 4. ALL EDITING MODALS ================= */}

      {/* 4.1 EDIT PROFILE MODAL */}
      {activeEditModal === "profile" && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-card border border-brand-border rounded-3xl w-full max-w-lg p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
            <button 
              onClick={() => setActiveEditModal(null)} 
              className="absolute top-4 right-4 p-1.5 rounded-lg text-brand-text-muted hover:text-brand-text-heading hover:bg-brand-card-sec transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-brand-text-heading font-display mb-4 flex items-center gap-2">
              <Pencil className="w-4 h-4 text-cyan-400" />
              {lang === "TH" ? "แก้ไขข้อมูลส่วนตัว" : "Edit Personal Info"}
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-brand-text-muted mb-1">ชื่อ (ภาษาไทย)</label>
                  <input 
                    type="text" 
                    value={tempProfile.nameThai} 
                    onChange={(e) => setTempProfile({ ...tempProfile, nameThai: e.target.value })}
                    className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2.5 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-brand-text-muted mb-1">Name (English)</label>
                  <input 
                    type="text" 
                    value={tempProfile.name} 
                    onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                    className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2.5 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-brand-text-muted mb-1">ตำแหน่งงาน (ภาษาไทย)</label>
                <input 
                  type="text" 
                  value={tempProfile.title} 
                  onChange={(e) => setTempProfile({ ...tempProfile, title: e.target.value })}
                  className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2.5 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-brand-text-muted mb-1">Job Title (English)</label>
                <input 
                  type="text" 
                  value={tempProfile.title_en} 
                  onChange={(e) => setTempProfile({ ...tempProfile, title_en: e.target.value })}
                  className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2.5 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-brand-text-muted mb-1">บริษัท (ภาษาไทย)</label>
                  <input 
                    type="text" 
                    value={tempProfile.company} 
                    onChange={(e) => setTempProfile({ ...tempProfile, company: e.target.value })}
                    className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2.5 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-brand-text-muted mb-1">Company (English)</label>
                  <input 
                    type="text" 
                    value={tempProfile.company_en} 
                    onChange={(e) => setTempProfile({ ...tempProfile, company_en: e.target.value })}
                    className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2.5 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-brand-text-muted mb-1">เบอร์โทรศัพท์ (Phone)</label>
                  <input 
                    type="text" 
                    value={tempProfile.phone} 
                    onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                    className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2.5 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-brand-text-muted mb-1">อีเมล (Email)</label>
                  <input 
                    type="text" 
                    value={tempProfile.email} 
                    onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                    className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2.5 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-brand-text-muted mb-1">ที่อยู่ (ภาษาไทย)</label>
                <input 
                  type="text" 
                  value={tempProfile.address} 
                  onChange={(e) => setTempProfile({ ...tempProfile, address: e.target.value })}
                  className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2.5 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-brand-text-muted mb-1">Address (English)</label>
                <input 
                  type="text" 
                  value={tempProfile.address_en} 
                  onChange={(e) => setTempProfile({ ...tempProfile, address_en: e.target.value })}
                  className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2.5 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => setActiveEditModal(null)} 
                  className="flex-1 text-center py-2 bg-brand-border hover:bg-brand-card-hover rounded-xl text-xs font-semibold text-brand-text transition cursor-pointer"
                >
                  {lang === "TH" ? "ยกเลิก" : "Cancel"}
                </button>
                <button 
                  onClick={saveProfileEdit} 
                  className="flex-1 text-center py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  {lang === "TH" ? "บันทึก" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4.2 EDIT SUMMARY MODAL */}
      {activeEditModal === "summary" && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-card border border-brand-border rounded-3xl w-full max-w-lg p-6 relative shadow-2xl animate-fade-in">
            <button 
              onClick={() => setActiveEditModal(null)} 
              className="absolute top-4 right-4 p-1.5 rounded-lg text-brand-text-muted hover:text-brand-text-heading hover:bg-brand-card-sec transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-brand-text-heading font-display mb-4 flex items-center gap-2">
              <Pencil className="w-4 h-4 text-cyan-400" />
              {lang === "TH" ? "แก้ไขบทสรุปสายอาชีพ" : "Edit Professional Summary"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-brand-text-muted mb-1">บทสรุปสายอาชีพ (ภาษาไทย)</label>
                <textarea 
                  rows={5}
                  value={tempProfile.summary} 
                  onChange={(e) => setTempProfile({ ...tempProfile, summary: e.target.value })}
                  className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2.5 focus:ring-1 focus:ring-cyan-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-brand-text-muted mb-1">Professional Summary (English)</label>
                <textarea 
                  rows={5}
                  value={tempProfile.summary_en} 
                  onChange={(e) => setTempProfile({ ...tempProfile, summary_en: e.target.value })}
                  className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2.5 focus:ring-1 focus:ring-cyan-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => setActiveEditModal(null)} 
                  className="flex-1 text-center py-2 bg-brand-border hover:bg-brand-card-hover rounded-xl text-xs font-semibold text-brand-text transition cursor-pointer"
                >
                  {lang === "TH" ? "ยกเลิก" : "Cancel"}
                </button>
                <button 
                  onClick={saveSummaryEdit} 
                  className="flex-1 text-center py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  {lang === "TH" ? "บันทึก" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4.3 EDIT LICENSES MODAL */}
      {activeEditModal === "licenses" && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-card border border-brand-border rounded-3xl w-full max-w-xl p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
            <button 
              onClick={() => setActiveEditModal(null)} 
              className="absolute top-4 right-4 p-1.5 rounded-lg text-brand-text-muted hover:text-brand-text-heading hover:bg-brand-card-sec transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-brand-text-heading font-display mb-4 flex items-center gap-2">
              <Pencil className="w-4 h-4 text-cyan-400" />
              {lang === "TH" ? "แก้ไขใบอนุญาตและใบรับรอง" : "Edit Licenses & Certifications"}
            </h3>

            <div className="space-y-6">
              {tempLicenses.map((lic, idx) => (
                <div key={lic.id} className="p-4 bg-brand-card-sec border border-brand-border rounded-2xl relative space-y-3">
                  <button
                    onClick={() => {
                      setTempLicenses(tempLicenses.filter(l => l.id !== lic.id));
                    }}
                    className="absolute top-3 right-3 text-rose-500 hover:text-rose-405 hover:bg-rose-500/10 p-1 rounded-lg transition"
                    title={lang === "TH" ? "ลบใบอนุญาต" : "Delete license"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-brand-text-muted mb-0.5">ชื่อใบอนุญาต (ไทย)</label>
                      <input 
                        type="text"
                        value={lic.name}
                        onChange={(e) => {
                          const updated = [...tempLicenses];
                          updated[idx].name = e.target.value;
                          setTempLicenses(updated);
                        }}
                        className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-brand-text-muted mb-0.5">License Name (EN)</label>
                      <input 
                        type="text"
                        value={lic.name_en}
                        onChange={(e) => {
                          const updated = [...tempLicenses];
                          updated[idx].name_en = e.target.value;
                          setTempLicenses(updated);
                        }}
                        className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-brand-text-muted mb-0.5">หน่วยงานผู้รับผิดชอบ / ปี (ไทย)</label>
                      <input 
                        type="text"
                        value={lic.issuer}
                        onChange={(e) => {
                          const updated = [...tempLicenses];
                          updated[idx].issuer = e.target.value;
                          setTempLicenses(updated);
                        }}
                        className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-brand-text-muted mb-0.5">Issuer / Year (EN)</label>
                      <input 
                        type="text"
                        value={lic.issuer_en}
                        onChange={(e) => {
                          const updated = [...tempLicenses];
                          updated[idx].issuer_en = e.target.value;
                          setTempLicenses(updated);
                        }}
                        className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] uppercase font-bold text-brand-text-muted">รูปภาพไฟล์ใบรับรอง (Certificate Image File)</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (event.target?.result && typeof event.target.result === "string") {
                                const updated = [...tempLicenses];
                                updated[idx].image = event.target.result;
                                setTempLicenses(updated);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="text-[10px] text-brand-text-muted cursor-pointer shrink"
                      />
                      {lic.image && (
                        <div className="relative group w-14 h-10 border border-brand-border rounded overflow-hidden">
                          <img src={lic.image} alt="preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...tempLicenses];
                              delete updated[idx].image;
                              setTempLicenses(updated);
                            }}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[8px] text-rose-400 font-bold transition"
                          >
                            ลบรูป
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  setTempLicenses([
                    ...tempLicenses,
                    {
                      id: "lic-" + Date.now(),
                      name: "",
                      name_en: "",
                      issuer: "",
                      issuer_en: ""
                    }
                  ]);
                }}
                className="w-full py-2.5 border border-dashed border-cyan-500/40 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                {lang === "TH" ? "เพิ่มใบอนุญาตชิ้นใหม่" : "Add New Certificate"}
              </button>

              <div className="flex gap-2 pt-2 border-t border-brand-border">
                <button 
                  onClick={() => setActiveEditModal(null)} 
                  className="flex-1 text-center py-2 bg-brand-border hover:bg-brand-card-hover rounded-xl text-xs font-semibold text-brand-text transition cursor-pointer"
                >
                  {lang === "TH" ? "ยกเลิก" : "Cancel"}
                </button>
                <button 
                  onClick={saveLicensesEdit} 
                  className="flex-1 text-center py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  {lang === "TH" ? "บันทึก" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4.4 EDIT EDUCATION & LANGUAGES MODAL */}
      {activeEditModal === "education" && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-card border border-brand-border rounded-3xl w-full max-w-xl p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
            <button 
              onClick={() => setActiveEditModal(null)} 
              className="absolute top-4 right-4 p-1.5 rounded-lg text-brand-text-muted hover:text-brand-text-heading hover:bg-brand-card-sec transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-brand-text-heading font-display mb-4 flex items-center gap-2">
              <Pencil className="w-4 h-4 text-cyan-400" />
              {lang === "TH" ? "แก้ไขการศึกษาและระดับภาษา" : "Edit Education & Languages"}
            </h3>

            <div className="space-y-6">
              {tempEdu.map((edu, idx) => (
                <div key={edu.id} className="p-4 bg-brand-card-sec border border-brand-border rounded-2xl relative space-y-3">
                  <button
                    onClick={() => {
                      setTempEdu(tempEdu.filter(e => e.id !== edu.id));
                    }}
                    className="absolute top-3 right-3 text-rose-500 hover:text-rose-455 hover:bg-rose-500/10 p-1 rounded-lg transition"
                    title={lang === "TH" ? "ลบประวัติการศึกษา" : "Delete education"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-brand-text-muted mb-0.5">ระดับการศึกษา/วิชาเอก (ไทย)</label>
                      <input 
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const updated = [...tempEdu];
                          updated[idx].degree = e.target.value;
                          setTempEdu(updated);
                        }}
                        className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-brand-text-muted mb-0.5">Degree/Major (EN)</label>
                      <input 
                        type="text"
                        value={edu.degree_en}
                        onChange={(e) => {
                          const updated = [...tempEdu];
                          updated[idx].degree_en = e.target.value;
                          setTempEdu(updated);
                        }}
                        className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-brand-text-muted mb-0.5">สถาบัน / ปี (ไทย)</label>
                      <input 
                        type="text"
                        value={edu.school}
                        onChange={(e) => {
                          const updated = [...tempEdu];
                          updated[idx].school = e.target.value;
                          setTempEdu(updated);
                        }}
                        className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-brand-text-muted mb-0.5">School / Years (EN)</label>
                      <input 
                        type="text"
                        value={edu.school_en}
                        onChange={(e) => {
                          const updated = [...tempEdu];
                          updated[idx].school_en = e.target.value;
                          setTempEdu(updated);
                        }}
                        className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  setTempEdu([
                    ...tempEdu,
                    {
                      id: "edu-" + Date.now(),
                      degree: "",
                      degree_en: "",
                      school: "",
                      school_en: ""
                    }
                  ]);
                }}
                className="w-full py-2.5 border border-dashed border-cyan-500/40 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                {lang === "TH" ? "เพิ่มประวัติการศึกษาใหม่" : "Add Education Record"}
              </button>

              <div className="h-px bg-brand-border"></div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-brand-text-heading font-display">
                  {lang === "TH" ? "ระดับความเชี่ยวชาญภาษา" : "Language Proficiency Details"}
                </h4>
                
                <div>
                  <label className="block text-[9px] uppercase font-bold text-brand-text-muted mb-1">ข้อมูลทักษะภาษา (ภาษาไทย)</label>
                  <input 
                    type="text" 
                    value={tempLanguages} 
                    onChange={(e) => setTempLanguages(e.target.value)}
                    className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2.5 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase font-bold text-brand-text-muted mb-1">Languages (English)</label>
                  <input 
                    type="text" 
                    value={tempLanguagesEn} 
                    onChange={(e) => setTempLanguagesEn(e.target.value)}
                    className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-brand-border">
                <button 
                  onClick={() => setActiveEditModal(null)} 
                  className="flex-1 text-center py-2 bg-brand-border hover:bg-brand-card-hover rounded-xl text-xs font-semibold text-brand-text transition cursor-pointer"
                >
                  {lang === "TH" ? "ยกเลิก" : "Cancel"}
                </button>
                <button 
                  onClick={saveEduEdit} 
                  className="flex-1 text-center py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  {lang === "TH" ? "บันทึก" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4.5 EDIT SPECIFIC PROJECT MODAL */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-card border border-brand-border rounded-3xl w-full max-w-lg p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
            <button 
              onClick={() => setEditingProject(null)} 
              className="absolute top-4 right-4 p-1.5 rounded-lg text-brand-text-muted hover:text-brand-text-heading hover:bg-brand-card-sec transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-brand-text-heading font-display mb-4 flex items-center gap-2">
              <Pencil className="w-4 h-4 text-cyan-400" />
              {lang === "TH" ? "แก้ไขข้อมูลผลงานในไทม์ไลน์" : "Edit Career Milestone"}
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-brand-text-muted mb-1">วันที่ (Date)</label>
                  <input 
                    type="month" 
                    value={editingProject.Date} 
                    onChange={(e) => setEditingProject({ ...editingProject, Date: e.target.value })}
                    className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2.5 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-brand-text-muted mb-1">หมวดหมู่ (Category)</label>
                  <select 
                    value={editingProject.Category} 
                    onChange={(e) => {
                      setEditingProject({
                        ...editingProject,
                        Category: e.target.value,
                        Category_EN: e.target.value
                      });
                    }}
                    className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2.5 focus:outline-none"
                  >
                    <option value="Safety & Compliance">Safety & Compliance</option>
                    <option value="IT Infrastructure & Security">IT Infrastructure & Security</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-brand-text-muted mb-1">หัวข้อผลงาน (ภาษาไทย)</label>
                <input 
                  type="text" 
                  value={editingProject.Title} 
                  onChange={(e) => setEditingProject({ ...editingProject, Title: e.target.value })}
                  className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2.5 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-brand-text-muted mb-1">Milestone Title (English)</label>
                <input 
                  type="text" 
                  value={editingProject.Title_EN} 
                  onChange={(e) => setEditingProject({ ...editingProject, Title_EN: e.target.value })}
                  className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2.5 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-brand-text-muted mb-1">รายละเอียดโครงการ (ภาษาไทย)</label>
                <textarea 
                  rows={3}
                  value={editingProject.Description} 
                  onChange={(e) => setEditingProject({ ...editingProject, Description: e.target.value })}
                  className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2.5 focus:outline-none resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-brand-text-muted mb-1">Description (English)</label>
                <textarea 
                  rows={3}
                  value={editingProject.Description_EN} 
                  onChange={(e) => setEditingProject({ ...editingProject, Description_EN: e.target.value })}
                  className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2.5 focus:outline-none resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-brand-text-muted mb-1">เทคโนโลยีที่ใช้ (เครื่องหมายจุลภาคคั่น ,)</label>
                <input 
                  type="text" 
                  value={editingProject.Tools} 
                  onChange={(e) => setEditingProject({ ...editingProject, Tools: e.target.value })}
                  className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-brand-text-muted mb-1">
                  {lang === "TH" ? "รูปภาพผลงาน" : "Project Image"}
                </label>
                <div className="flex gap-2 items-center">
                  <input 
                    type="text" 
                    value={editingProject.Drive_Image_Link} 
                    onChange={(e) => setEditingProject({ ...editingProject, Drive_Image_Link: e.target.value })}
                    className="flex-1 text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2.5 focus:outline-none"
                    placeholder="https://example.com/image.jpg หรืออัปโหลดไฟล์"
                  />
                  <label className="bg-brand-card-sec hover:bg-brand-card-hover border border-brand-border px-3 py-2.5 rounded-xl text-[11px] text-cyan-400 font-bold cursor-pointer transition shrink-0">
                    {lang === "TH" ? "อัปโหลด" : "Upload"}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result && typeof event.target.result === "string") {
                              setEditingProject({
                                ...editingProject,
                                Drive_Image_Link: event.target.result
                              });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
                {editingProject.Drive_Image_Link && (
                  <div className="mt-2 w-24 h-16 border border-brand-border rounded-lg overflow-hidden relative group">
                    <img src={editingProject.Drive_Image_Link} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => setEditingProject({ ...editingProject, Drive_Image_Link: "" })}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-rose-500 font-bold transition"
                    >
                      {lang === "TH" ? "ลบรูป" : "Remove"}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => setEditingProject(null)} 
                  className="flex-1 text-center py-2 bg-brand-border hover:bg-brand-card-hover rounded-xl text-xs font-semibold text-brand-text transition cursor-pointer"
                >
                  {lang === "TH" ? "ยกเลิก" : "Cancel"}
                </button>
                <button 
                  onClick={() => {
                    setProjects(projects.map(p => p.id === editingProject.id ? editingProject : p));
                    setEditingProject(null);
                  }} 
                  className="flex-1 text-center py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  {lang === "TH" ? "บันทึก" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4.6 LIGHTBOX FOR CERTIFICATE IMAGES */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
          title={lang === "TH" ? "คลิกพื้นที่ใดก็ได้เพื่อปิดหน้าต่างพรีวิว" : "Click anywhere to close"}
        >
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden flex flex-col items-center justify-center">
            <img 
              src={lightboxImage} 
              alt="Certificate Full size preview" 
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl border border-brand-border/40"
            />
            <p className="mt-3.5 text-xs text-slate-350 font-sans pointer-events-none">
              {lang === "TH" ? "คลิกพื้นที่เพื่อออก / Click to dismiss" : "Click anywhere to close"}
            </p>
          </div>
        </div>
      )}

      {/* 4.7 EDIT TRAINING RECORD MODAL */}
      {activeEditModal === "training" && editingTraining && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-card border border-brand-border rounded-3xl w-full max-w-md p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
            <button 
              onClick={() => { setActiveEditModal(null); setEditingTraining(null); }} 
              className="absolute top-4 right-4 p-1.5 rounded-lg text-brand-text-muted hover:text-brand-text-heading hover:bg-brand-card-sec transition cursor-pointer"
              title={lang === "TH" ? "ปิด" : "Close"}
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-sm font-bold text-brand-text-heading font-display mb-4 border-b border-brand-border pb-2">
              {lang === "TH" ? "จัดการข้อมูลการฝึกอบรมพนักงาน" : "Manage Employee Training Record"}
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-brand-text-muted mb-1 font-sans">Course Code</label>
                  <input 
                    type="text" 
                    value={editingTraining.code} 
                    onChange={(e) => setEditingTraining({ ...editingTraining, code: e.target.value })}
                    className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2.5 focus:outline-none"
                    placeholder="e.g. INENG00880"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-brand-text-muted mb-1 font-sans">Class ID</label>
                  <input 
                    type="text" 
                    value={editingTraining.classId} 
                    onChange={(e) => setEditingTraining({ ...editingTraining, classId: e.target.value })}
                    className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2.5 focus:outline-none"
                    placeholder="e.g. INENG00880250N"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-brand-text-muted mb-1 font-sans">
                  {lang === "TH" ? "หัวข้อการฝึกอบรม (Course Title)" : "Course Title"}
                </label>
                <input 
                  type="text" 
                  value={editingTraining.title} 
                  onChange={(e) => setEditingTraining({ ...editingTraining, title: e.target.value })}
                  className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2.5 focus:outline-none"
                  placeholder={lang === "TH" ? "เช่น ความปลอดภัยในการทำงานเกี่ยวกับไฟฟ้า" : "e.g. Electrical Safety"}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-brand-text-muted mb-1 font-sans">
                    {lang === "TH" ? "หมวดหมู่ (Category)" : "Category"}
                  </label>
                  <select 
                    value={editingTraining.category} 
                    onChange={(e) => setEditingTraining({ ...editingTraining, category: e.target.value as any })}
                    className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2.5 focus:outline-none"
                  >
                    <option value="Safety & Compliance">Safety & Compliance</option>
                    <option value="IT & Technical">IT & Technical</option>
                    <option value="Production & Quality">Production & Quality</option>
                    <option value="Management & General">Management & General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-brand-text-muted mb-1 font-sans">
                    {lang === "TH" ? "ผลการฝึกอบรม (Status)" : "Status"}
                  </label>
                  <input 
                    type="text" 
                    value={editingTraining.status} 
                    onChange={(e) => setEditingTraining({ ...editingTraining, status: e.target.value })}
                    className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2.5 focus:outline-none"
                    placeholder="e.g. ผ่าน (Passed)"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-brand-text-muted mb-1 font-sans">
                  {lang === "TH" ? "วันที่อบรม (Completion Date / Date Range)" : "Completion Date / Date Range"}
                </label>
                <input 
                  type="text" 
                  value={editingTraining.dateRange} 
                  onChange={(e) => setEditingTraining({ ...editingTraining, dateRange: e.target.value })}
                  className="w-full text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2.5 focus:outline-none"
                  placeholder="e.g. 30-01-2025"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-brand-border/40 mt-4">
                <button 
                  type="button"
                  onClick={() => { setActiveEditModal(null); setEditingTraining(null); }} 
                  className="flex-1 text-center py-2 bg-brand-border hover:bg-brand-card-hover rounded-xl text-xs font-semibold text-brand-text transition cursor-pointer"
                >
                  {lang === "TH" ? "ยกเลิก" : "Cancel"}
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    if (!editingTraining.code.trim() || !editingTraining.classId.trim() || !editingTraining.title.trim() || !editingTraining.dateRange.trim()) {
                      alert(lang === "TH" ? "กรุณากรอกข้อมูลให้ครบถ้วน" : "Please fill in all fields.");
                      return;
                    }
                    const exists = trainings.some(t => t.id === editingTraining.id);
                    if (exists) {
                      setTrainings(trainings.map(t => t.id === editingTraining.id ? editingTraining : t));
                    } else {
                      setTrainings([editingTraining, ...trainings]);
                    }
                    setActiveEditModal(null);
                    setEditingTraining(null);
                  }} 
                  className="flex-1 text-center py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  {lang === "TH" ? "บันทึก" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4.8 PASSWORD VERIFICATION MODAL */}
      {passwordModal.isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-card border border-brand-border rounded-3xl w-full max-w-sm p-6 relative shadow-2xl animate-fade-in text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-brand-text-heading font-display">
                {lang === "TH" ? "ต้องการรหัสผ่านเพื่อดำเนินการ" : "Password Required"}
              </h3>
              <p className="text-[11px] text-brand-text-muted mt-1 leading-relaxed">
                {lang === "TH" ? "กรุณากรอกรหัสผ่านเพื่อยืนยันสิทธิ์ในการเพิ่ม แก้ไข หรือลบข้อมูล" : "Please enter the password to modify the portfolio data."}
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (passwordModal.inputValue === "NUTza067668141") {
                  const callback = passwordModal.onSuccess;
                  setPasswordModal({ isOpen: false, onSuccess: null, error: "", inputValue: "" });
                  if (callback) callback();
                } else {
                  setPasswordModal({ ...passwordModal, error: lang === "TH" ? "รหัสผ่านไม่ถูกต้อง" : "Incorrect Password" });
                }
              }}
              className="space-y-4"
            >
              <div>
                <input
                  type="password"
                  autoFocus
                  placeholder="Password"
                  value={passwordModal.inputValue}
                  onChange={(e) => setPasswordModal({ ...passwordModal, inputValue: e.target.value, error: "" })}
                  className="w-full text-center text-xs text-brand-text-heading bg-brand-bg border border-brand-border rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                  required
                />
                {passwordModal.error && (
                  <p className="text-[10px] text-rose-500 mt-1.5 font-sans font-medium">{passwordModal.error}</p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPasswordModal({ isOpen: false, onSuccess: null, error: "", inputValue: "" })}
                  className="flex-1 text-center py-2 bg-brand-border hover:bg-brand-card-hover rounded-xl text-xs font-semibold text-brand-text transition cursor-pointer"
                >
                  {lang === "TH" ? "ยกเลิก" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="flex-1 text-center py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  {lang === "TH" ? "ยืนยัน" : "Confirm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
