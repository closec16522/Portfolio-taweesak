/**
 * =========================================================================
 * Taweesak Khampok - Executive Portfolio Backend (Google Apps Script)
 * =========================================================================
 * Connected to Google Sheet ID: 1UMNzeywtTkZ4jdMdurBnFEWVmNdJulsv58wq0krftCA
 * Provides Realtime JSON API for Read and Write operations.
 */

var SPREADSHEET_ID = "1UMNzeywtTkZ4jdMdurBnFEWVmNdJulsv58wq0krftCA";
var ADMIN_PASSWORD = "NUTza067668141";

function getSpreadsheet() {
  try {
    if (SPREADSHEET_ID && SPREADSHEET_ID !== "") {
      return SpreadsheetApp.openById(SPREADSHEET_ID);
    }
  } catch (err) {
    Logger.log("Could not open by ID, falling back to active: " + err);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Handle GET Requests (Read from Google Sheet)
 */
function doGet(e) {
  try {
    ensureAllSheetsInitialized();
    var payload = {
      status: "success",
      timestamp: new Date().toISOString(),
      profile: getProfileFromSheet(),
      kpis: getKpisFromSheet(),
      trainings: getTrainingsFromSheet(),
      licenses: getLicensesFromSheet(),
      slides: getSlidesFromSheet()
    };
    
    return ContentService.createTextOutput(JSON.stringify(payload))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle POST Requests (Save/Write to Google Sheet)
 */
function doPost(e) {
  try {
    var rawData = e.postData ? e.postData.contents : "";
    var body = {};
    if (rawData) {
      body = JSON.parse(rawData);
    } else if (e.parameter) {
      body = e.parameter;
    }
    
    // Verify password
    if (body.password !== ADMIN_PASSWORD) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "รหัสผ่านไม่ถูกต้อง (Unauthorized)"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var ss = getSpreadsheet();
    var action = body.action || "save_all";
    
    // Save Profile
    if (body.profile) {
      saveProfileToSheet(ss, body.profile);
    }
    
    // Save Trainings
    if (Array.isArray(body.trainings)) {
      saveTrainingsToSheet(ss, body.trainings);
    }
    
    // Save KPIs
    if (Array.isArray(body.kpis)) {
      saveKpisToSheet(ss, body.kpis);
    }

    // Save Slides
    if (Array.isArray(body.slides)) {
      saveSlidesToSheet(ss, body.slides);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "บันทึกข้อมูลลง Google Sheet สำเร็จแล้ว",
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Read Profile Key-Values
 */
function getProfileFromSheet() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName("Profile");
  if (!sheet) return {};
  var rows = sheet.getDataRange().getValues();
  var profile = {};
  for (var i = 1; i < rows.length; i++) {
    var key = rows[i][0];
    var val = rows[i][1];
    if (key) {
      profile[key.toString().trim()] = val !== undefined ? val.toString().trim() : "";
    }
  }
  return profile;
}

/**
 * Save Profile Key-Values
 */
function saveProfileToSheet(ss, profile) {
  var sheet = ss.getSheetByName("Profile");
  if (!sheet) {
    sheet = ss.insertSheet("Profile");
    sheet.appendRow(["Key", "Value"]);
    sheet.getRange(1, 1, 1, 2).setFontWeight("bold").setBackground("#0f172a").setFontColor("#ffffff");
  }
  
  var existing = sheet.getDataRange().getValues();
  var keyRowMap = {};
  for (var i = 1; i < existing.length; i++) {
    if (existing[i][0]) {
      keyRowMap[existing[i][0].toString().trim()] = i + 1; // 1-based row index
    }
  }
  
  for (var key in profile) {
    var val = profile[key];
    if (keyRowMap[key]) {
      sheet.getRange(keyRowMap[key], 2).setValue(val);
    } else {
      sheet.appendRow([key, val]);
      keyRowMap[key] = sheet.getLastRow();
    }
  }
}

/**
 * Read KPIs
 */
function getKpisFromSheet() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName("KPIs");
  if (!sheet) return [];
  var rows = sheet.getDataRange().getValues();
  var kpis = [];
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0]) {
      kpis.push({
        value: rows[i][0],
        title: rows[i][1] || "",
        desc: rows[i][2] || ""
      });
    }
  }
  return kpis;
}

/**
 * Save KPIs
 */
function saveKpisToSheet(ss, kpis) {
  var sheet = ss.getSheetByName("KPIs");
  if (sheet) ss.deleteSheet(sheet);
  sheet = ss.insertSheet("KPIs");
  sheet.appendRow(["Value", "Title", "Description"]);
  sheet.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#0f172a").setFontColor("#ffffff");
  kpis.forEach(function(k) {
    sheet.appendRow([k.value || "", k.title || "", k.desc || ""]);
  });
  sheet.autoResizeColumns(1, 3);
}

/**
 * Read Trainings
 */
function getTrainingsFromSheet() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName("Trainings");
  if (!sheet) return [];
  var rows = sheet.getDataRange().getValues();
  var trainings = [];
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][2]) { // Title exists
      trainings.push({
        id: "tr_" + i,
        code: rows[i][0] ? rows[i][0].toString().trim() : "",
        classId: rows[i][1] ? rows[i][1].toString().trim() : "",
        title: rows[i][2] ? rows[i][2].toString().trim() : "",
        dateRange: rows[i][3] ? rows[i][3].toString().trim() : "",
        category: rows[i][4] ? rows[i][4].toString().trim() : "Safety & Compliance",
        status: rows[i][5] ? rows[i][5].toString().trim() : "ผ่าน (Passed)"
      });
    }
  }
  return trainings;
}

/**
 * Save Trainings
 */
function saveTrainingsToSheet(ss, trainings) {
  var sheet = ss.getSheetByName("Trainings");
  if (sheet) ss.deleteSheet(sheet);
  sheet = ss.insertSheet("Trainings");
  sheet.appendRow(["Code", "ClassId", "Title", "DateRange", "Category", "Status"]);
  sheet.getRange(1, 1, 1, 6).setFontWeight("bold").setBackground("#0f172a").setFontColor("#ffffff");
  trainings.forEach(function(t) {
    sheet.appendRow([
      t.code || "",
      t.classId || "",
      t.title || "",
      t.dateRange || "",
      t.category || "Safety & Compliance",
      t.status || "ผ่าน (Passed)"
    ]);
  });
  sheet.autoResizeColumns(1, 6);
}

/**
 * Read Licenses
 */
function getLicensesFromSheet() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName("Licenses");
  if (!sheet) return [];
  var rows = sheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0]) {
      list.push({
        name: rows[i][0].toString().trim(),
        name_en: rows[i][1] ? rows[i][1].toString().trim() : "",
        issuer: rows[i][2] ? rows[i][2].toString().trim() : "",
        image: rows[i][3] ? rows[i][3].toString().trim() : ""
      });
    }
  }
  return list;
}

/**
 * Read Slides
 */
function getSlidesFromSheet() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName("Slides");
  if (!sheet) return [];
  var rows = sheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][1]) {
      list.push({
        badge: rows[i][0] ? rows[i][0].toString() : "",
        title: rows[i][1] ? rows[i][1].toString() : "",
        subtitle: rows[i][2] ? rows[i][2].toString() : "",
        highlights: rows[i][3] ? rows[i][3].toString().split("\n") : [],
        metrics: rows[i][4] ? rows[i][4].toString() : "",
        imageUrl: rows[i][5] ? rows[i][5].toString() : ""
      });
    }
  }
  return list;
}

/**
 * Save Slides
 */
function saveSlidesToSheet(ss, slides) {
  var sheet = ss.getSheetByName("Slides");
  if (sheet) ss.deleteSheet(sheet);
  sheet = ss.insertSheet("Slides");
  sheet.appendRow(["Badge", "Title", "Subtitle", "Highlights", "Metrics", "ImageUrl"]);
  sheet.getRange(1, 1, 1, 6).setFontWeight("bold").setBackground("#0f172a").setFontColor("#ffffff");
  slides.forEach(function(s) {
    var hlText = Array.isArray(s.highlights) ? s.highlights.join("\n") : (s.highlights || "");
    sheet.appendRow([s.badge || "", s.title || "", s.subtitle || "", hlText, s.metrics || "", s.imageUrl || ""]);
  });
  sheet.autoResizeColumns(1, 6);
}

/**
 * Automatically sets up all initial sheets with real default data if not present.
 */
function ensureAllSheetsInitialized() {
  var ss = getSpreadsheet();
  
  // 1. Profile Sheet
  var profileSheet = ss.getSheetByName("Profile");
  if (!profileSheet || profileSheet.getLastRow() <= 1) {
    if (!profileSheet) profileSheet = ss.insertSheet("Profile");
    profileSheet.clear();
    profileSheet.appendRow(["Key", "Value"]);
    profileSheet.getRange(1, 1, 1, 2).setFontWeight("bold").setBackground("#0f172a").setFontColor("#ffffff");
    
    var defaultProfile = [
      ["name", "ทวีศักดิ์ คำปก (Taweesak Khampok)"],
      ["title", "ผู้เชี่ยวชาญด้านการบริหารระบบโครงสร้างพื้นฐานไอที ระบบรักษาความปลอดภัยอัจฉริยะ (LPR / CCTV) และการจัดการจราจรระดับองค์กร"],
      ["badge", "IT INFRASTRUCTURE • SMART SECURITY (LPR/CCTV) • OPERATIONS MANAGEMENT"],
      ["bio1", "ผู้เชี่ยวชาญด้านการบริหารงานปฏิบัติการโครงสร้างพื้นฐานไอที ระบบรักษาความปลอดภัย และการจัดการจราจร (IT Infrastructure & Security Operations Specialist) ด้วยประสบการณ์ระดับองค์กรรวมกว่า 13 ปี เชี่ยวชาญเฉพาะทางในการผสานเทคโนโลยี License Plate Recognition (LPR) และโครงข่ายกล้องวงจรปิด CCTV Surveillance ขนาดใหญ่กว่า 2,000+ กล้อง เข้ากับระบบบริหารทรัพยากรบุคคลและระบบบริหารจัดการองค์กรอย่างเป็นรูปธรรม"],
      ["bio2", "ออกแบบและติดตั้งระบบ LPR บริหารจัดการยานพาหนะมากกว่า 5,000+ คัน เชื่อมโยงผ่านแพลตฟอร์ม HikCentral Professional และ ZKBio CVSecurity พร้อมกำกับดูแลตัวชี้วัดด้วย Microsoft Power BI Dashboard และถือใบอนุญาต ผู้จัดการความปลอดภัยด้านการขนส่ง (Transport Safety Manager - TSM 2025) จากกรมการขนส่งทางบก"],
      ["phone", "062-3285963"],
      ["email", "closec16522@gmail.com"],
      ["address", "116/1 ม.8 ต.ห้วยทราย อ.หนองแค จ.สระบุรี"],
      ["driveDocId", "16ZL5Xl3TY6mKT3Pt16jkmaMmiL98c5fM"]
    ];
    for (var i = 0; i < defaultProfile.length; i++) {
      profileSheet.appendRow(defaultProfile[i]);
    }
    profileSheet.autoResizeColumns(1, 2);
  }

  // 2. KPIs Sheet
  var kpiSheet = ss.getSheetByName("KPIs");
  if (!kpiSheet || kpiSheet.getLastRow() <= 1) {
    if (!kpiSheet) kpiSheet = ss.insertSheet("KPIs");
    kpiSheet.clear();
    kpiSheet.appendRow(["Value", "Title", "Description"]);
    kpiSheet.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#0f172a").setFontColor("#ffffff");
    
    var defaultKpis = [
      ["5,000+ คัน", "LPR Fleet Management", "บริหารฐานข้อมูลทะเบียนรถและสิทธิ์เข้า-ออก"],
      ["2,000+ โหนด", "Enterprise CCTV", "ดูแลโครงข่ายกล้องและระบบ VMware 99.9%"],
      ["0.5% Error", "High LPR Accuracy", "จูนพารามิเตอร์ลด Error จาก 4.37% เหลือ 0.5%"],
      ["< 30 วินาที", "Fast Gate Processing", "ลดเวลาผ่านป้อมจาก 3-5 นาที เร็วขึ้น 6-10 เท่า"],
      ["64,980 ฿", "100% Cost Avoidance", "ประหยัดงบลงทุนเครื่องและบัตรผ่าน (Zero Cost)"],
      ["100% Auto", "HR & Power BI Sync", "เชื่อมเวลาเข้า-ออกงานและสรุปรายงานอัตโนมัติ"]
    ];
    for (var j = 0; j < defaultKpis.length; j++) {
      kpiSheet.appendRow(defaultKpis[j]);
    }
    kpiSheet.autoResizeColumns(1, 3);
  }

  // 3. Trainings Sheet
  var trainingsSheet = ss.getSheetByName("Trainings");
  if (!trainingsSheet || trainingsSheet.getLastRow() <= 1) {
    if (!trainingsSheet) trainingsSheet = ss.insertSheet("Trainings");
    trainingsSheet.clear();
    trainingsSheet.appendRow(["Code", "ClassId", "Title", "DateRange", "Category", "Status"]);
    trainingsSheet.getRange(1, 1, 1, 6).setFontWeight("bold").setBackground("#0f172a").setFontColor("#ffffff");
    var defaultTrainings = [{"id":"tr1","code":"INENG00880","classId":"INENG00880250N","title":"ความปลอดภัยในการทำงานเกี่ยวกับไฟฟ้า (Electrical Safety)","dateRange":"30-01-2025","category":"Safety & Compliance","status":"ผ่าน (Passed)"},{"id":"tr2","code":"INPRO01870","classId":"INPRO018701024N","title":"การวิเคราะห์การสั่นสะเทือนของเครื่องจักร (Machine Vibration Analysis)","dateRange":"30-10-2024","category":"IT & Technical","status":"ผ่าน (Passed)"},{"id":"tr3","code":"INPRO00170","classId":"INPRO001702408N","title":"ความรู้ด้านการบริหารการผลิต (IE - Industrial Engineering)","dateRange":"23-08-2024","category":"Production & Quality","status":"ผ่าน (Passed)"},{"id":"tr4","code":"INPRO01970","classId":"INPRO019700424N","title":"เทคนิคการผลิต (กระบวนการผสมยาง) (Rubber Mixing Process Techniques)","dateRange":"23-04-2024","category":"Production & Quality","status":"ผ่าน (Passed)"},{"id":"tr5","code":"INLAW00010","classId":"INLAW000102301N","title":"สิทธิประโยชน์ตาม พรบ.ประกันสังคม (Social Security Law)","dateRange":"09-06-2023","category":"Management & General","status":"ผ่าน (Passed)"},{"id":"tr6","code":"INSAF01900","classId":"INSAF019002101N","title":"การใช้งานและการบำรุงรักษา รถ Boom Lift 14m อย่างถูกต้องและปลอดภัย (Boom Lift Operation & Safety)","dateRange":"10-11-2021","category":"Safety & Compliance","status":"ผ่าน (Passed)"},{"id":"tr7","code":"INSAF02000","classId":"INSAF020002101N","title":"การอบรม Scissor lift car (Scissor Lift Safety Training)","dateRange":"26-10-2021","category":"Safety & Compliance","status":"ผ่าน (Passed)"},{"id":"tr8","code":"ELTIR00040","classId":"ELTIR000402101C","title":"เรียนรู้และเข้าใจง่าย ๆ ไปกับ มอก.ยางล้อฯ (TIS Tire Standards)","dateRange":"01-09-2021 - 10-10-2021","category":"Production & Quality","status":"ผ่าน (Passed)"},{"id":"tr9","code":"INENG00020","classId":"INENG000202101N","title":"จิตสำนึกด้านการอนุรักษ์พลังงาน (Energy Conservation Awareness)","dateRange":"09-06-2021","category":"Management & General","status":"ผ่าน (Passed)"},{"id":"tr10","code":"ELCOM0001B","classId":"ELCOM0001B2101C","title":"การบริหารการสื่อสารในภาวะวิกฤต สำหรับพนักงาน (Crisis Communication for Employees)","dateRange":"01-05-2021 - 30-06-2021","category":"Management & General","status":"ผ่าน (Passed)"},{"id":"tr11","code":"INLAW00060","classId":"INLAW000602101N","title":"อบรมการป้องกันการเลือกปฏิบัติและการล่วงละเมิดในที่ทำงาน (Anti-Discrimination & Harassment Prevention)","dateRange":"01-04-2021 - 30-06-2021","category":"Safety & Compliance","status":"ผ่าน (Passed)"},{"id":"tr12","code":"ELCPL00010","classId":"ELCPL000012101C","title":"การต่อต้านการทุจริต: กรณีการจ่ายเงินที่ไม่เหมาะสม (Corporate Anti-Corruption Guidelines)","dateRange":"01-03-2021 - 31-03-2021","category":"Safety & Compliance","status":"ผ่าน (Passed)"},{"id":"tr13","code":"ELCCV00010","classId":"ELCCV000102001C","title":"อัตลักษณ์ของแบรนด์และสโลแกนของบริดจสโตน (Global Brand & Slogan Launch)","dateRange":"20-10-2020 - 01-12-2020","category":"Management & General","status":"ผ่าน (Passed)"},{"id":"tr14","code":"INTIR00020","classId":"TIR0002020202C","title":"ความรู้พื้นฐานเกี่ยวกับยางรถยนต์ 14 (Basic Tire Knowledge 14)","dateRange":"01-08-2020 - 31-10-2020","category":"Production & Quality","status":"ผ่าน (Passed)"},{"id":"tr15","code":"INSAF0003A","classId":"SAF0003A201959N","title":"Re-Training แบบจำลองเครื่องจักรและการบ่งชี้อันตราย (Machine Simulation & Hazard ID)","dateRange":"25-12-2019","category":"Safety & Compliance","status":"ผ่าน (Passed)"},{"id":"tr16","code":"INITI00310","classId":"ITI00310201901N","title":"Oracle 12c Database Administration (อบรมการดูแลฐานข้อมูล Oracle 12c)","dateRange":"09-09-2019 - 19-09-2019","category":"IT & Technical","status":"ผ่าน (Passed)"},{"id":"tr17","code":"INCCV00090","classId":"CCV00090201809M","title":"อบรมความสามารถหลักเพื่อการขับเคลื่อนองค์กร (Core Competency Integration)","dateRange":"14-11-2018 - 04-12-2018","category":"Management & General","status":"ผ่าน (Passed)"},{"id":"tr17b","code":"OTITI00050","classId":"ITI00050201801C","title":"การฝึกอบรมเทคโนโลยีสารสนเทศภายนอก (External IT Training)","dateRange":"11-09-2018 - 12-09-2018","category":"IT & Technical","status":"ผ่าน (Passed)"},{"id":"tr18","code":"PBITI00360","classId":"ITI00360201801N","title":"เปิดโลกอนาคตด้วย IoT: ยุคใหม่แห่งการผลิต (IoT-New Era of Manufacturing)","dateRange":"11-07-2018","category":"IT & Technical","status":"ผ่าน (Passed)"},{"id":"tr19","code":"Z000006362","classId":"Z000006362","title":"Re-Training KYT & Safety Simulation Machine Preparation # 28 / 2560","dateRange":"15-03-2017","category":"Safety & Compliance","status":"ผ่าน (Passed)"},{"id":"tr20","code":"Z000006467","classId":"Z000006467","title":"Compliance (กฎปฏิบัติตามกฎหมายและแนวทางปฏิบัติทางธุรกิจ) # 1 / 2016","dateRange":"23-12-2016","category":"Safety & Compliance","status":"ผ่าน (Passed)"},{"id":"tr21","code":"Z000009575","classId":"Z000009575","title":"VMware vForum 2016 (Hit the Town - System Virtualization)","dateRange":"30-11-2016","category":"IT & Technical","status":"ผ่าน (Passed)"},{"id":"tr22","code":"Z000009540","classId":"Z000009540","title":"ช่างไฟฟ้าภายในอาคาร รุ่นที่ 2 / 2559 (Certified Building Electrician)","dateRange":"08-08-2016 - 10-08-2016","category":"IT & Technical","status":"ผ่าน (Passed)"},{"id":"tr23","code":"Z000006492","classId":"Z000006492","title":"AutoCAD (แบบ 3 มิติ) # 1 / 2016 (3D CAD Modelling)","dateRange":"13-06-2016 - 15-06-2016","category":"IT & Technical","status":"ผ่าน (Passed)"},{"id":"tr24","code":"Z000006541","classId":"Z000006541","title":"Microsoft Excel Advanced 2010 รุ่นที่ 1 / 2559","dateRange":"30-05-2016 - 01-06-2016","category":"IT & Technical","status":"ผ่าน (Passed)"},{"id":"tr25","code":"Z000006578","classId":"Z000006578","title":"การประเมินความเสี่ยงและมาตรการป้องกันเครื่องจักร รุ่นที่ 3 / 2560 (Machine Risk Assessment)","dateRange":"01-03-2016 - 02-03-2016","category":"Safety & Compliance","status":"ผ่าน (Passed)"},{"id":"tr26","code":"Z000006962","classId":"Z000006962","title":"QCC : Quality Control Circle รุ่นที่ 5 / 2558 กรุ๊ป C (กิจกรรมการปรับปรุงคุณภาพกลุ่มย่อย)","dateRange":"26-11-2015","category":"Production & Quality","status":"ผ่าน (Passed)"},{"id":"tr27","code":"Z000007006","classId":"Z000007006","title":"Common Manufacturing Standard (Safety & Hygienic) # 13 / 2558","dateRange":"11-08-2015","category":"Production & Quality","status":"ผ่าน (Passed)"},{"id":"tr28","code":"Z000007007","classId":"Z000007007","title":"Common Manufacturing Standard (Disaster Prevention & Fire Prevention) # 13 / 2558","dateRange":"11-08-2015","category":"Safety & Compliance","status":"ผ่าน (Passed)"},{"id":"tr29","code":"Z000007024","classId":"Z000007024","title":"Common Manufacturing Standard (Standardization Suru Raku) # 12 / 2558","dateRange":"20-07-2015","category":"Production & Quality","status":"ผ่าน (Passed)"},{"id":"tr30","code":"Z000007023","classId":"Z000007023","title":"Common Manufacturing Standard (Autonomous Facility Maintenance) TPM # 12 / 2558","dateRange":"20-07-2015","category":"Production & Quality","status":"ผ่าน (Passed)"},{"id":"tr31","code":"Z000007004","classId":"Z000007004","title":"Common Manufacturing Standard (Quality Control & Improvement) # 12 / 2558","dateRange":"13-07-2015","category":"Production & Quality","status":"ผ่าน (Passed)"},{"id":"tr32","code":"Z000007005","classId":"Z000007005","title":"Common Manufacturing Standard (Quality Assurance) # 12 / 2558","dateRange":"13-07-2015","category":"Production & Quality","status":"ผ่าน (Passed)"},{"id":"tr33","code":"Z000006981","classId":"Z000006981","title":"KYT & Safety Simulation Machine Training Preparation 57 / 2558 for Group A","dateRange":"26-06-2015","category":"Safety & Compliance","status":"ผ่าน (Passed)"},{"id":"tr34","code":"Z000009619","classId":"Z000009619","title":"Implementing a Mobile-First World with Microsoft Enterprise Device Infrastructure 1 / 2558","dateRange":"26-03-2015","category":"IT & Technical","status":"ผ่าน (Passed)"},{"id":"tr35","code":"Z000009599","classId":"Z000009599","title":"การป้องกันและแก้ไขปัญหายาเสพติด รุ่นที่ 2 / 2557 (Anti-Drug Workplace Campaign)","dateRange":"25-03-2015","category":"Safety & Compliance","status":"ผ่าน (Passed)"},{"id":"tr36","code":"Z000009618","classId":"Z000009618","title":"Extend your Datacenter with Microsoft Azure 1 / 2558 (การขยายระบบเซิร์ฟเวอร์ร่วมกับคลาวด์ Azure)","dateRange":"19-03-2015","category":"IT & Technical","status":"ผ่าน (Passed)"},{"id":"tr37","code":"Z000006756","classId":"Z000006756","title":"Zen-Z-Bi มาตรฐานเครื่องจักร รุ่นที่ 4 / 2558 (Zen-Z-Bi Machine Standards)","dateRange":"13-02-2015","category":"Production & Quality","status":"ผ่าน (Passed)"},{"id":"tr38","code":"Z000007131","classId":"Z000007131","title":"การอบรมเชิงปฏิบัติการหลักสูตรการเขียน E-mail ภาษาอังกฤษธุรกิจ รุ่นที่ 2 / 2557 (Business E-mail Writing)","dateRange":"16-10-2014","category":"Management & General","status":"ผ่าน (Passed)"},{"id":"tr39","code":"Z000009643","classId":"Z000009643","title":"Azure and Windows Server Training for Customers (อบรมการดูแลระบบเซิร์ฟเวอร์ระบบปฏิบัติการ Windows)","dateRange":"26-09-2014","category":"IT & Technical","status":"ผ่าน (Passed)"},{"id":"tr40","code":"Z000007292","classId":"Z000007292","title":"Common Manufacturing Standard # 3 / 2557 (มาตรฐานกลางประกอบโรงงาน)","dateRange":"25-06-2014 - 10-07-2014","category":"Production & Quality","status":"ผ่าน (Passed)"},{"id":"tr41","code":"Z000007499","classId":"Z000007499","title":"3S, KY, RA, Safety Rules Training # 116 / 2013 (การวิเคราะห์ความเสี่ยงและกฎความปลอดภัย)","dateRange":"11-12-2013","category":"Safety & Compliance","status":"ผ่าน (Passed)"},{"id":"tr42","code":"Z000007423","classId":"Z000007423","title":"Compliance (กฎปฏิบัติทางธุรกิจและจริยธรรม) สำหรับ Staff / Administrator # 5 / 2013","dateRange":"07-10-2013","category":"Safety & Compliance","status":"ผ่าน (Passed)"},{"id":"tr43","code":"Z000006136","classId":"Z000006136","title":"การใช้สัญญาณมือในการสื่อสารระหว่างผู้ปฏิบัติงานเกี่ยวกับปั้นจั่น (Signal Hand Communication for Crane)","dateRange":"16-08-2013","category":"Safety & Compliance","status":"ผ่าน (Passed)"},{"id":"tr44","code":"Z000006137","classId":"Z000006137","title":"ข้อกำหนดหลักเกณฑ์การใช้ป้ายแท็กหยุดเครื่องจักร (LOTO - Lock Out Tag Out)","dateRange":"16-08-2013","category":"Safety & Compliance","status":"ผ่าน (Passed)"},{"id":"tr45","code":"Z000006135","classId":"Z000006135","title":"การอบรมกฎความปลอดภัยโรงงานเบื้องต้น (General Safety Rules)","dateRange":"08-08-2013","category":"Safety & Compliance","status":"ผ่าน (Passed)"},{"id":"tr46","code":"Z000007396","classId":"Z000007396","title":"มาตรฐานการปรับระยะห่าง Gap TL (Proximity Switch Adjustments)","dateRange":"30-07-2013","category":"IT & Technical","status":"ผ่าน (Passed)"},{"id":"tr47","code":"Z000007516","classId":"Z000007516","title":"Microsoft Excel 2010 Foundations & Intermediate # 1 / 2013","dateRange":"16-07-2013 - 18-07-2013","category":"Management & General","status":"ผ่าน (Passed)"},{"id":"tr48","code":"Z000007348","classId":"Z000007348","title":"TBSC-N Tire Security Gate (TSG System) - การติดตั้งและดูแลรักษาประตูด่านความมั่นคง","dateRange":"19-06-2013","category":"IT & Technical","status":"ผ่าน (Passed)"},{"id":"tr49","code":"Z000007394","classId":"Z000007394","title":"การใช้งานใบ 3S กับการตรวจสอบและบำรุงรักษาอุปกรณ์เพื่อมาตรฐานความปลอดภัย","dateRange":"14-06-2013","category":"Safety & Compliance","status":"ผ่าน (Passed)"},{"id":"tr50","code":"Z000007388","classId":"Z000007388","title":"One Point Lesson: Side Tread Open (FM) (Toyota Claim Standars)","dateRange":"21-05-2013","category":"Production & Quality","status":"ผ่าน (Passed)"},{"id":"tr51","code":"Z000007389","classId":"Z000007389","title":"มาตรฐานสำคัญด้านความคุมคุณภาพ: ข้อห้ามนำไม้เข้ามาปฏิบัติงานในกระบวนการผลิต (FOD Prevention)","dateRange":"21-05-2013","category":"Production & Quality","status":"ผ่าน (Passed)"},{"id":"tr52","code":"Z000007387","classId":"Z000007387","title":"การหยุดระบบเครื่องจักร 4 ขั้นตอนเพื่อความปลอดภัยสูงสุด (4-Step Machinery Emergency Stops)","dateRange":"21-05-2013","category":"Safety & Compliance","status":"ผ่าน (Passed)"},{"id":"tr53","code":"Z000007386","classId":"Z000007386","title":"การตรวจสอบหารอยแตกร้าวของเครื่องจักรกลโดยใช้สารเคมีสีน้ำยาพ่นตรวจสอบ (Non-Destructive Spray Testing)","dateRange":"30-04-2013","category":"IT & Technical","status":"ผ่าน (Passed)"},{"id":"tr54","code":"Z000007364","classId":"Z000007364","title":"การสื่อสารและประสานงานความร่วมมือในการทำงาน 2 คนขึ้นไป REV.NO.2","dateRange":"08-02-2013","category":"Management & General","status":"ผ่าน (Passed)"},{"id":"tr55","code":"Z000007897","classId":"Z000007897","title":"Microsoft PowerPoint 2010 Core Foundations Workshop #1 / 2012","dateRange":"17-07-2012 - 19-07-2012","category":"Management & General","status":"ผ่าน (Passed)"},{"id":"tr56","code":"Z000007896","classId":"Z000007896","title":"Microsoft Access 2010 Core Relational Databases #1 / 2012","dateRange":"10-07-2012 - 12-07-2012","category":"IT & Technical","status":"ผ่าน (Passed)"},{"id":"tr57","code":"Z000007846","classId":"Z000007846","title":"ความรู้ความเข้าใจเรื่องทิศทางนโยบายองค์กร ปรัชญาการทำงาน และสิทธิมนุษยชน รุ่นที่ 5 / 2555","dateRange":"13-06-2012","category":"Management & General","status":"ผ่าน (Passed)"},{"id":"tr58","code":"Z000007907","classId":"Z000007907","title":"มาตรฐานความปลอดภัยความมั่นคงระดับโรงงานและการฝึกซ้อมระงับอัคคีภัย (Safety, Fire, Suru Raku # 35 / 2555)","dateRange":"01-06-2012","category":"Safety & Compliance","status":"ผ่าน (Passed)"},{"id":"tr59","code":"Z000007889","classId":"Z000007889","title":"ความรู้ระดับเทคโนโลยีเทคนิคเพื่อการผลิตยางล้อขั้นสูง รุ่นที่ 1 / 2555 (Advanced Tire Engineering)","dateRange":"04-04-2012 - 05-04-2012","category":"Production & Quality","status":"ผ่าน (Passed)"},{"id":"tr60","code":"Z000008244","classId":"Z000008244","title":"การปฐมนิเทศพนักงานเข้าทำงานใหม่ (สำนักงานใหญ่) รุ่นที่ 2 / 2554 (TBSC Employee Orientation)","dateRange":"20-09-2011 - 23-09-2011","category":"Management & General","status":"ผ่าน (Passed)"},{"id":"tr61","code":"Z000008185","classId":"Z000008185","title":"หลักสูตรพัฒนาทักษะการใช้ไวยากรณ์ภาษาอังกฤษเพื่อการสื่อสารธุรกิจ ระดับ 1 (English Grammar Level 1)","dateRange":"13-09-2011 - 01-11-2011","category":"Management & General","status":"ผ่าน (Passed)"},{"id":"tr62","code":"Z000008233","classId":"Z000008233","title":"ความรู้ความเข้าใจพื้นฐานหลักสูตรผลิตภัณฑ์ยางรถยนต์ทั่วไป รุ่นที่ 2 / 2554 (Basic Tire Knowledge)","dateRange":"23-06-2011 - 24-06-2011","category":"Production & Quality","status":"ผ่าน (Passed)"},{"id":"tr63","code":"Z000008251","classId":"Z000008251","title":"การป้องกันการเกิดและการระงับอัคคีภัยขั้นต้นระดับแผนกงาน รุ่นที่ 8 / 2544 (Primary Fire Fighting Class)","dateRange":"09-06-2011","category":"Safety & Compliance","status":"ผ่าน (Passed)"},{"id":"tr64","code":"Z000007363","classId":"Z000007363","title":"สารจาก MD (MD Message)","dateRange":"01-01-1900","category":"Management & General","status":"ผ่าน (Passed)"}];
    for (var t = 0; t < defaultTrainings.length; t++) {
      var item = defaultTrainings[t];
      trainingsSheet.appendRow([item.code || "", item.classId || "", item.title || "", item.dateRange || "", item.category || "Safety & Compliance", item.status || "ผ่าน (Passed)"]);
    }
    trainingsSheet.autoResizeColumns(1, 6);
  }

  // 4. Licenses Sheet
  var licSheet = ss.getSheetByName("Licenses");
  if (!licSheet || licSheet.getLastRow() <= 1) {
    if (!licSheet) licSheet = ss.insertSheet("Licenses");
    licSheet.clear();
    licSheet.appendRow(["Name", "Name_EN", "Issuer", "Image"]);
    licSheet.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#0f172a").setFontColor("#ffffff");
    var defaultLicenses = [{"id":"lic-1","name":"ผู้จัดการความปลอดภัยด้านการขนส่ง (TSM)","name_en":"Transport Safety Manager (TSM)","issuer":"กรมการขนส่งทางบก, 2025","issuer_en":"Department of Land Transport, 2025"},{"id":"lic-2","name":"การบริหารจัดการฐานข้อมูล Oracle 12c","name_en":"Oracle 12c: Database Administration","issuer":"SYS Operations, 2019","issuer_en":"SYS Operations, 2019","image":"/certs/IMG_1962.jpg"},{"id":"lic-3","name":"ขยายศูนย์ข้อมูลด้วย Microsoft Azure","name_en":"Extend Your Datacenter with Microsoft Azure","issuer":"Microsoft, 2015","issuer_en":"Microsoft, 2015"},{"id":"lic-powerpoint","name":"ใบรับรองสำเร็จหลักสูตร Microsoft PowerPoint 2010","name_en":"Certificate of Accomplishment - Microsoft PowerPoint 2010","issuer":"Bits (Thailand), 2555","issuer_en":"Bits (Thailand), 2012","image":"/certs/IMG_1955.jpg"},{"id":"lic-access","name":"ใบรับรองสำเร็จหลักสูตร Microsoft Access 2010","name_en":"Certificate of Accomplishment - Microsoft Access 2010","issuer":"Bits (Thailand), 2555","issuer_en":"Bits (Thailand), 2012","image":"/certs/IMG_1956.jpg"},{"id":"lic-english","name":"ใบรับรองการเข้าร่วมอบรมเชิงปฏิบัติการการเขียนภาษาอังกฤษธุรกิจ","name_en":"Certificate of Workshop - Business English Writing","issuer":"Worldwide Education Services Co., Ltd. / Bridgestone, 2557","issuer_en":"Worldwide Education Services Co., Ltd. / Bridgestone, 2014","image":"/certs/IMG_1957.jpg"},{"id":"lic-excel-adv","name":"วุฒิบัตรหลักสูตรการทำงานทางด้านการคำนวณโดยใช้โปรแกรม Microsoft Excel 2010 ขั้นสูง","name_en":"Advanced Microsoft Excel 2010 Training Certificate","issuer":"สถาบัน DS Johnson Development / Bridgestone, 2559","issuer_en":"DS Johnson Development / Bridgestone, 2016","image":"/certs/IMG_1958.jpg"},{"id":"lic-autocad-3d","name":"วุฒิบัตรหลักสูตรการเขียนแบบทางวิศวกรรมโดยใช้โปรแกรม AutoCAD (3 มิติ)","name_en":"AutoCAD 3D Engineering Drawing Training Certificate","issuer":"สถาบัน DS Johnson Development / Bridgestone, 2559","issuer_en":"DS Johnson Development / Bridgestone, 2016","image":"/certs/IMG_1959.jpg"},{"id":"lic-coop-cons","name":"เกียรติบัตรรางวัลชมเชย โครงงานสหกิจศึกษาดีเด่น ด้านนวัตกรรม ระดับเครือข่าย","name_en":"Consolation Prize for Outstanding Co-operative Education Project (Innovation)","issuer":"เครือข่ายพัฒนาสหกิจศึกษาภาคกลางตอนบน, 2559","issuer_en":"Upper Central Co-operative Education Development Network, 2016","image":"/certs/IMG_1960.jpg"},{"id":"lic-coop-runner","name":"เกียรติบัตรรางวัลรองชนะเลิศอันดับ 1 โครงงานสหกิจศึกษาดีเด่น กลุ่มวิทยาศาสตร์และเทคโนโลยี","name_en":"1st Runner-up for Outstanding Co-operative Education Project (Science & Technology)","issuer":"มหาวิทยาลัยศรีปทุม, 2559","issuer_en":"Sripatum University, 2016","image":"/certs/IMG_1961.jpg"},{"id":"lic-toeic-470","name":"ใบรายงานผลคะแนนสอบ TOEIC (470 คะแนน)","name_en":"TOEIC Listening and Reading Test Score Report (470)","issuer":"ETS (Educational Testing Service), 2563","issuer_en":"ETS (Educational Testing Service), 2020","image":"/certs/IMG_1963.jpg"},{"id":"lic-engineer-appoint","name":"หนังสือแต่งตั้งตำแหน่งวิศวกรชำนาญการฝ่ายวิศวกรรม","name_en":"Appointment of Specialist Engineer - Engineering Department","issuer":"บริษัท ไทยบริดจสโตน จำกัด, 2562","issuer_en":"Thai Bridgestone Co., Ltd., 2019","image":"/certs/IMG_1964.jpg"},{"id":"lic-service-10y","name":"เกียรติบัตรผู้ปฏิบัติงานด้วยความเสียสละและอุตสาหะครบรอบ 10 ปี","name_en":"10 Years Long Service Recognition Certificate","issuer":"บริษัท ไทยบริดจสโตน จำกัด, 2565","issuer_en":"Thai Bridgestone Co., Ltd., 2022","image":"/certs/IMG_1965.jpg"},{"id":"lic-boom-lift","name":"ใบรับรองความปลอดภัยในการปฏิบัติงานเกี่ยวกับเครื่องจักร Boom Lift 'Snorkel' รุ่น A46JE","name_en":"Safety Operation Certificate for Boom Lift 'Snorkel' Model A46JE","issuer":"ASIAFIVE Safety Solution, 2564","issuer_en":"ASIAFIVE Safety Solution, 2021","image":"/certs/IMG_1966.jpg"},{"id":"lic-scissor-lift","name":"ใบรับรองความปลอดภัยในการปฏิบัติงานเกี่ยวกับเครื่องจักร Scissor Lift 'Snorkel' รุ่น S4726E","name_en":"Safety Operation Certificate for Scissor Lift 'Snorkel' Model S4726E","issuer":"ASIAFIVE Safety Solution, 2564","issuer_en":"ASIAFIVE Safety Solution, 2021","image":"/certs/IMG_1967.jpg"},{"id":"lic-drone","name":"หนังสือการขึ้นทะเบียนผู้บังคับหรือปล่อยอากาศยานซึ่งไม่มีคนขับ (ใบอนุญาตขับโดรน น้ำหนักไม่เกิน 25 กิโลกรัม)","name_en":"Unmanned Aircraft (Drone) Pilot Certificate (Weight not exceeding 25 kg)","issuer":"สำนักงานการบินพลเรือนแห่งประเทศไทย (CAAT), 2568","issuer_en":"The Civil Aviation Authority of Thailand (CAAT), 2025","image":"/certs/IMG_1968.jpg"},{"id":"lic-ev-conv","name":"ประกาศนียบัตรหลักสูตรอบรมยานยนต์ไฟฟ้าดัดแปลง EV Conversion รุ่นที่ 51","name_en":"Certificate of EV Conversion Training (Class 51)","issuer":"Szechter EV / บริษัท โบลส์ เซฟ คอร์ปอเรชั่น จำกัด, 2568","issuer_en":"Szechter EV / Boles Safe Corporation Co., Ltd., 2025","image":"/certs/IMG_1969.jpg"},{"id":"lic-solar-storage","name":"ประกาศนียบัตรหลักสูตรอบรมการจัดการพลังงานและระบบกักเก็บพลังงานแสงอาทิตย์ (Energy Storage Solar System)","name_en":"Certificate of Energy Storage Solar System Training","issuer":"B2H Solar / LVFU, 2568","issuer_en":"B2H Solar / LVFU, 2025","image":"/certs/IMG_1970.jpg"},{"id":"lic-elec-safety","name":"วุฒิบัตรหลักสูตรความปลอดภัยในการทำงานเกี่ยวกับไฟฟ้าสำหรับลูกจ้าง","name_en":"Electrical Safety Training Certificate for Employees","issuer":"บริษัท ไทยบริดจสโตน จำกัด, 2568","issuer_en":"Thai Bridgestone Co., Ltd., 2025","image":"/certs/IMG_1971.jpg"}];
    for (var l = 0; l < defaultLicenses.length; l++) {
      var lic = defaultLicenses[l];
      licSheet.appendRow([lic.name || "", lic.name_en || "", lic.issuer || "", lic.image || ""]);
    }
    licSheet.autoResizeColumns(1, 4);
  }
}
