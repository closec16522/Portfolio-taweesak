export interface TrainingRecord {
  id: string;
  code: string;
  classId: string;
  title: string;
  dateRange: string;
  category: "Safety & Compliance" | "IT & Technical" | "Production & Quality" | "Management & General";
  status: "ผ่าน" | "Passed" | string;
}

export const TBSC_TRAINING_RECORDS: TrainingRecord[] = [
  {
    id: "tr1",
    code: "INENG00880",
    classId: "INENG00880250N",
    title: "ความปลอดภัยในการทำงานเกี่ยวกับไฟฟ้า (Electrical Safety)",
    dateRange: "30-01-2025",
    category: "Safety & Compliance",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr2",
    code: "INPRO01870",
    classId: "INPRO018701024N",
    title: "การวิเคราะห์การสั่นสะเทือนของเครื่องจักร (Machine Vibration Analysis)",
    dateRange: "30-10-2024",
    category: "IT & Technical",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr3",
    code: "INPRO00170",
    classId: "INPRO001702408N",
    title: "ความรู้ด้านการบริหารการผลิต (IE - Industrial Engineering)",
    dateRange: "23-08-2024",
    category: "Production & Quality",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr4",
    code: "INPRO01970",
    classId: "INPRO019700424N",
    title: "เทคนิคการผลิต (กระบวนการผสมยาง) (Rubber Mixing Process Techniques)",
    dateRange: "23-04-2024",
    category: "Production & Quality",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr5",
    code: "INLAW00010",
    classId: "INLAW000102301N",
    title: "สิทธิประโยชน์ตาม พรบ.ประกันสังคม (Social Security Law)",
    dateRange: "09-06-2023",
    category: "Management & General",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr6",
    code: "INSAF01900",
    classId: "INSAF019002101N",
    title: "การใช้งานและการบำรุงรักษา รถ Boom Lift 14m อย่างถูกต้องและปลอดภัย (Boom Lift Operation & Safety)",
    dateRange: "10-11-2021",
    category: "Safety & Compliance",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr7",
    code: "INSAF02000",
    classId: "INSAF020002101N",
    title: "การอบรม Scissor lift car (Scissor Lift Safety Training)",
    dateRange: "26-10-2021",
    category: "Safety & Compliance",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr8",
    code: "ELTIR00040",
    classId: "ELTIR000402101C",
    title: "เรียนรู้และเข้าใจง่าย ๆ ไปกับ มอก.ยางล้อฯ (TIS Tire Standards)",
    dateRange: "01-09-2021 - 10-10-2021",
    category: "Production & Quality",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr9",
    code: "INENG00020",
    classId: "INENG000202101N",
    title: "จิตสำนึกด้านการอนุรักษ์พลังงาน (Energy Conservation Awareness)",
    dateRange: "09-06-2021",
    category: "Management & General",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr10",
    code: "ELCOM0001B",
    classId: "ELCOM0001B2101C",
    title: "การบริหารการสื่อสารในภาวะวิกฤต สำหรับพนักงาน (Crisis Communication for Employees)",
    dateRange: "01-05-2021 - 30-06-2021",
    category: "Management & General",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr11",
    code: "INLAW00060",
    classId: "INLAW000602101N",
    title: "อบรมการป้องกันการเลือกปฏิบัติและการล่วงละเมิดในที่ทำงาน (Anti-Discrimination & Harassment Prevention)",
    dateRange: "01-04-2021 - 30-06-2021",
    category: "Safety & Compliance",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr12",
    code: "ELCPL00010",
    classId: "ELCPL000012101C",
    title: "การต่อต้านการทุจริต: กรณีการจ่ายเงินที่ไม่เหมาะสม (Corporate Anti-Corruption Guidelines)",
    dateRange: "01-03-2021 - 31-03-2021",
    category: "Safety & Compliance",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr13",
    code: "ELCCV00010",
    classId: "ELCCV000102001C",
    title: "อัตลักษณ์ของแบรนด์และสโลแกนของบริดจสโตน (Global Brand & Slogan Launch)",
    dateRange: "20-10-2020 - 01-12-2020",
    category: "Management & General",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr14",
    code: "INTIR00020",
    classId: "TIR0002020202C",
    title: "ความรู้พื้นฐานเกี่ยวกับยางรถยนต์ 14 (Basic Tire Knowledge 14)",
    dateRange: "01-08-2020 - 31-10-2020",
    category: "Production & Quality",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr15",
    code: "INSAF0003A",
    classId: "SAF0003A201959N",
    title: "Re-Training แบบจำลองเครื่องจักรและการบ่งชี้อันตราย (Machine Simulation & Hazard ID)",
    dateRange: "25-12-2019",
    category: "Safety & Compliance",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr16",
    code: "INITI00310",
    classId: "ITI00310201901N",
    title: "Oracle 12c Database Administration (อบรมการดูแลฐานข้อมูล Oracle 12c)",
    dateRange: "09-09-2019 - 19-09-2019",
    category: "IT & Technical",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr17",
    code: "INCCV00090",
    classId: "CCV00090201809M",
    title: "อบรมความสามารถหลักเพื่อการขับเคลื่อนองค์กร (Core Competency Integration)",
    dateRange: "14-11-2018 - 04-12-2018",
    category: "Management & General",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr17b",
    code: "OTITI00050",
    classId: "ITI00050201801C",
    title: "การฝึกอบรมเทคโนโลยีสารสนเทศภายนอก (External IT Training)",
    dateRange: "11-09-2018 - 12-09-2018",
    category: "IT & Technical",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr18",
    code: "PBITI00360",
    classId: "ITI00360201801N",
    title: "เปิดโลกอนาคตด้วย IoT: ยุคใหม่แห่งการผลิต (IoT-New Era of Manufacturing)",
    dateRange: "11-07-2018",
    category: "IT & Technical",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr19",
    code: "Z000006362",
    classId: "Z000006362",
    title: "Re-Training KYT & Safety Simulation Machine Preparation # 28 / 2560",
    dateRange: "15-03-2017",
    category: "Safety & Compliance",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr20",
    code: "Z000006467",
    classId: "Z000006467",
    title: "Compliance (กฎปฏิบัติตามกฎหมายและแนวทางปฏิบัติทางธุรกิจ) # 1 / 2016",
    dateRange: "23-12-2016",
    category: "Safety & Compliance",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr21",
    code: "Z000009575",
    classId: "Z000009575",
    title: "VMware vForum 2016 (Hit the Town - System Virtualization)",
    dateRange: "30-11-2016",
    category: "IT & Technical",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr22",
    code: "Z000009540",
    classId: "Z000009540",
    title: "ช่างไฟฟ้าภายในอาคาร รุ่นที่ 2 / 2559 (Certified Building Electrician)",
    dateRange: "08-08-2016 - 10-08-2016",
    category: "IT & Technical",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr23",
    code: "Z000006492",
    classId: "Z000006492",
    title: "AutoCAD (แบบ 3 มิติ) # 1 / 2016 (3D CAD Modelling)",
    dateRange: "13-06-2016 - 15-06-2016",
    category: "IT & Technical",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr24",
    code: "Z000006541",
    classId: "Z000006541",
    title: "Microsoft Excel Advanced 2010 รุ่นที่ 1 / 2559",
    dateRange: "30-05-2016 - 01-06-2016",
    category: "IT & Technical",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr25",
    code: "Z000006578",
    classId: "Z000006578",
    title: "การประเมินความเสี่ยงและมาตรการป้องกันเครื่องจักร รุ่นที่ 3 / 2560 (Machine Risk Assessment)",
    dateRange: "01-03-2016 - 02-03-2016",
    category: "Safety & Compliance",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr26",
    code: "Z000006962",
    classId: "Z000006962",
    title: "QCC : Quality Control Circle รุ่นที่ 5 / 2558 กรุ๊ป C (กิจกรรมการปรับปรุงคุณภาพกลุ่มย่อย)",
    dateRange: "26-11-2015",
    category: "Production & Quality",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr27",
    code: "Z000007006",
    classId: "Z000007006",
    title: "Common Manufacturing Standard (Safety & Hygienic) # 13 / 2558",
    dateRange: "11-08-2015",
    category: "Production & Quality",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr28",
    code: "Z000007007",
    classId: "Z000007007",
    title: "Common Manufacturing Standard (Disaster Prevention & Fire Prevention) # 13 / 2558",
    dateRange: "11-08-2015",
    category: "Safety & Compliance",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr29",
    code: "Z000007024",
    classId: "Z000007024",
    title: "Common Manufacturing Standard (Standardization Suru Raku) # 12 / 2558",
    dateRange: "20-07-2015",
    category: "Production & Quality",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr30",
    code: "Z000007023",
    classId: "Z000007023",
    title: "Common Manufacturing Standard (Autonomous Facility Maintenance) TPM # 12 / 2558",
    dateRange: "20-07-2015",
    category: "Production & Quality",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr31",
    code: "Z000007004",
    classId: "Z000007004",
    title: "Common Manufacturing Standard (Quality Control & Improvement) # 12 / 2558",
    dateRange: "13-07-2015",
    category: "Production & Quality",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr32",
    code: "Z000007005",
    classId: "Z000007005",
    title: "Common Manufacturing Standard (Quality Assurance) # 12 / 2558",
    dateRange: "13-07-2015",
    category: "Production & Quality",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr33",
    code: "Z000006981",
    classId: "Z000006981",
    title: "KYT & Safety Simulation Machine Training Preparation 57 / 2558 for Group A",
    dateRange: "26-06-2015",
    category: "Safety & Compliance",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr34",
    code: "Z000009619",
    classId: "Z000009619",
    title: "Implementing a Mobile-First World with Microsoft Enterprise Device Infrastructure 1 / 2558",
    dateRange: "26-03-2015",
    category: "IT & Technical",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr35",
    code: "Z000009599",
    classId: "Z000009599",
    title: "การป้องกันและแก้ไขปัญหายาเสพติด รุ่นที่ 2 / 2557 (Anti-Drug Workplace Campaign)",
    dateRange: "25-03-2015",
    category: "Safety & Compliance",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr36",
    code: "Z000009618",
    classId: "Z000009618",
    title: "Extend your Datacenter with Microsoft Azure 1 / 2558 (การขยายระบบเซิร์ฟเวอร์ร่วมกับคลาวด์ Azure)",
    dateRange: "19-03-2015",
    category: "IT & Technical",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr37",
    code: "Z000006756",
    classId: "Z000006756",
    title: "Zen-Z-Bi มาตรฐานเครื่องจักร รุ่นที่ 4 / 2558 (Zen-Z-Bi Machine Standards)",
    dateRange: "13-02-2015",
    category: "Production & Quality",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr38",
    code: "Z000007131",
    classId: "Z000007131",
    title: "การอบรมเชิงปฏิบัติการหลักสูตรการเขียน E-mail ภาษาอังกฤษธุรกิจ รุ่นที่ 2 / 2557 (Business E-mail Writing)",
    dateRange: "16-10-2014",
    category: "Management & General",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr39",
    code: "Z000009643",
    classId: "Z000009643",
    title: "Azure and Windows Server Training for Customers (อบรมการดูแลระบบเซิร์ฟเวอร์ระบบปฏิบัติการ Windows)",
    dateRange: "26-09-2014",
    category: "IT & Technical",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr40",
    code: "Z000007292",
    classId: "Z000007292",
    title: "Common Manufacturing Standard # 3 / 2557 (มาตรฐานกลางประกอบโรงงาน)",
    dateRange: "25-06-2014 - 10-07-2014",
    category: "Production & Quality",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr41",
    code: "Z000007499",
    classId: "Z000007499",
    title: "3S, KY, RA, Safety Rules Training # 116 / 2013 (การวิเคราะห์ความเสี่ยงและกฎความปลอดภัย)",
    dateRange: "11-12-2013",
    category: "Safety & Compliance",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr42",
    code: "Z000007423",
    classId: "Z000007423",
    title: "Compliance (กฎปฏิบัติทางธุรกิจและจริยธรรม) สำหรับ Staff / Administrator # 5 / 2013",
    dateRange: "07-10-2013",
    category: "Safety & Compliance",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr43",
    code: "Z000006136",
    classId: "Z000006136",
    title: "การใช้สัญญาณมือในการสื่อสารระหว่างผู้ปฏิบัติงานเกี่ยวกับปั้นจั่น (Signal Hand Communication for Crane)",
    dateRange: "16-08-2013",
    category: "Safety & Compliance",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr44",
    code: "Z000006137",
    classId: "Z000006137",
    title: "ข้อกำหนดหลักเกณฑ์การใช้ป้ายแท็กหยุดเครื่องจักร (LOTO - Lock Out Tag Out)",
    dateRange: "16-08-2013",
    category: "Safety & Compliance",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr45",
    code: "Z000006135",
    classId: "Z000006135",
    title: "การอบรมกฎความปลอดภัยโรงงานเบื้องต้น (General Safety Rules)",
    dateRange: "08-08-2013",
    category: "Safety & Compliance",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr46",
    code: "Z000007396",
    classId: "Z000007396",
    title: "มาตรฐานการปรับระยะห่าง Gap TL (Proximity Switch Adjustments)",
    dateRange: "30-07-2013",
    category: "IT & Technical",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr47",
    code: "Z000007516",
    classId: "Z000007516",
    title: "Microsoft Excel 2010 Foundations & Intermediate # 1 / 2013",
    dateRange: "16-07-2013 - 18-07-2013",
    category: "Management & General",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr48",
    code: "Z000007348",
    classId: "Z000007348",
    title: "TBSC-N Tire Security Gate (TSG System) - การติดตั้งและดูแลรักษาประตูด่านความมั่นคง",
    dateRange: "19-06-2013",
    category: "IT & Technical",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr49",
    code: "Z000007394",
    classId: "Z000007394",
    title: "การใช้งานใบ 3S กับการตรวจสอบและบำรุงรักษาอุปกรณ์เพื่อมาตรฐานความปลอดภัย",
    dateRange: "14-06-2013",
    category: "Safety & Compliance",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr50",
    code: "Z000007388",
    classId: "Z000007388",
    title: "One Point Lesson: Side Tread Open (FM) (Toyota Claim Standars)",
    dateRange: "21-05-2013",
    category: "Production & Quality",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr51",
    code: "Z000007389",
    classId: "Z000007389",
    title: "มาตรฐานสำคัญด้านความคุมคุณภาพ: ข้อห้ามนำไม้เข้ามาปฏิบัติงานในกระบวนการผลิต (FOD Prevention)",
    dateRange: "21-05-2013",
    category: "Production & Quality",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr52",
    code: "Z000007387",
    classId: "Z000007387",
    title: "การหยุดระบบเครื่องจักร 4 ขั้นตอนเพื่อความปลอดภัยสูงสุด (4-Step Machinery Emergency Stops)",
    dateRange: "21-05-2013",
    category: "Safety & Compliance",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr53",
    code: "Z000007386",
    classId: "Z000007386",
    title: "การตรวจสอบหารอยแตกร้าวของเครื่องจักรกลโดยใช้สารเคมีสีน้ำยาพ่นตรวจสอบ (Non-Destructive Spray Testing)",
    dateRange: "30-04-2013",
    category: "IT & Technical",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr54",
    code: "Z000007364",
    classId: "Z000007364",
    title: "การสื่อสารและประสานงานความร่วมมือในการทำงาน 2 คนขึ้นไป REV.NO.2",
    dateRange: "08-02-2013",
    category: "Management & General",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr55",
    code: "Z000007897",
    classId: "Z000007897",
    title: "Microsoft PowerPoint 2010 Core Foundations Workshop #1 / 2012",
    dateRange: "17-07-2012 - 19-07-2012",
    category: "Management & General",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr56",
    code: "Z000007896",
    classId: "Z000007896",
    title: "Microsoft Access 2010 Core Relational Databases #1 / 2012",
    dateRange: "10-07-2012 - 12-07-2012",
    category: "IT & Technical",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr57",
    code: "Z000007846",
    classId: "Z000007846",
    title: "ความรู้ความเข้าใจเรื่องทิศทางนโยบายองค์กร ปรัชญาการทำงาน และสิทธิมนุษยชน รุ่นที่ 5 / 2555",
    dateRange: "13-06-2012",
    category: "Management & General",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr58",
    code: "Z000007907",
    classId: "Z000007907",
    title: "มาตรฐานความปลอดภัยความมั่นคงระดับโรงงานและการฝึกซ้อมระงับอัคคีภัย (Safety, Fire, Suru Raku # 35 / 2555)",
    dateRange: "01-06-2012",
    category: "Safety & Compliance",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr59",
    code: "Z000007889",
    classId: "Z000007889",
    title: "ความรู้ระดับเทคโนโลยีเทคนิคเพื่อการผลิตยางล้อขั้นสูง รุ่นที่ 1 / 2555 (Advanced Tire Engineering)",
    dateRange: "04-04-2012 - 05-04-2012",
    category: "Production & Quality",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr60",
    code: "Z000008244",
    classId: "Z000008244",
    title: "การปฐมนิเทศพนักงานเข้าทำงานใหม่ (สำนักงานใหญ่) รุ่นที่ 2 / 2554 (TBSC Employee Orientation)",
    dateRange: "20-09-2011 - 23-09-2011",
    category: "Management & General",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr61",
    code: "Z000008185",
    classId: "Z000008185",
    title: "หลักสูตรพัฒนาทักษะการใช้ไวยากรณ์ภาษาอังกฤษเพื่อการสื่อสารธุรกิจ ระดับ 1 (English Grammar Level 1)",
    dateRange: "13-09-2011 - 01-11-2011",
    category: "Management & General",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr62",
    code: "Z000008233",
    classId: "Z000008233",
    title: "ความรู้ความเข้าใจพื้นฐานหลักสูตรผลิตภัณฑ์ยางรถยนต์ทั่วไป รุ่นที่ 2 / 2554 (Basic Tire Knowledge)",
    dateRange: "23-06-2011 - 24-06-2011",
    category: "Production & Quality",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr63",
    code: "Z000008251",
    classId: "Z000008251",
    title: "การป้องกันการเกิดและการระงับอัคคีภัยขั้นต้นระดับแผนกงาน รุ่นที่ 8 / 2544 (Primary Fire Fighting Class)",
    dateRange: "09-06-2011",
    category: "Safety & Compliance",
    status: "ผ่าน (Passed)"
  },
  {
    id: "tr64",
    code: "Z000007363",
    classId: "Z000007363",
    title: "สารจาก MD (MD Message)",
    dateRange: "01-01-1900",
    category: "Management & General",
    status: "ผ่าน (Passed)"
  }
];
