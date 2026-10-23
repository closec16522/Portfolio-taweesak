export interface GasFile {
  filename: string;
  language: string;
  code: string;
  description: string;
}

export const GAS_FILES: GasFile[] = [
  {
    filename: "Code.gs",
    language: "javascript",
    description: "The backend script handles App routing (doGet), direct image link translation, and initial spreadsheet set up.",
    code: `/**
 * =========================================================================
 * Vertical Timeline Portfolio - Core Controller (Code.gs)
 * =========================================================================
 * Designed & Built by Senior Developer & Google Apps Script Expert.
 * Works seamlessly with Google Sheets and Google Drive Image direct linking.
 */

function doGet(e) {
  // Check if requested as JSON API (For Cloudflare Pages dynamic syncing)
  if (e && e.parameter && (e.parameter.api === 'json' || e.parameter.action === 'json')) {
    var data = {
      profile: getProfileData(),
      projects: getPortfolioData(),
      trainings: getTrainingsData()
    };
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var template = HtmlService.createTemplateFromFile('index');
  template.profile = getProfileData();
  
  return template.evaluate()
    .setTitle(template.profile.name || 'Professional Portfolio')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Standard utility function to include sub-HTML files (style and script) in index.html
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Automatically converts shared Google Drive links to static direct raw-image endpoints.
 * Example: https://drive.google.com/file/d/1A2B3C/view?usp=sharing --> https://drive.google.com/uc?export=view&id=1A2B3C
 */
function convertDriveLink(url) {
  if (!url) return '';
  var urlString = url.toString().trim();
  
  var regexes = [
    /\\/file\\/d\\/([a-zA-Z0-9_-]+)/,                     // Standard share URL
    /id=([a-zA-Z0-9_-]+)/,                            // Direct id parameters
    /open\\?id=([a-zA-Z0-9_-]+)/,                      // Open url
    /drive\\.google\\.com\\/uc\\?id=([a-zA-Z0-9_-]+)/,   // Export raw link
    /\\/folders\\/([a-zA-Z0-9_-]+)/                   // Folders fallback
  ];
  
  var fileId = '';
  for (var i = 0; i < regexes.length; i++) {
    var match = urlString.match(regexes[i]);
    if (match && match[1]) {
      fileId = match[1];
      break;
    }
  }
  
  if (fileId) {
    return 'https://drive.google.com/uc?export=view&id=' + fileId;
  }
  return urlString;
}

/**
 * Fetch and construct profile details (Profile, Licenses, Education, Documents)
 */
function getProfileData() {
  setupInitialData();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Read Profile sheet
  var profileSheet = ss.getSheetByName('Profile');
  var profileRange = profileSheet.getDataRange().getValues();
  var profile = {};
  for (var i = 1; i < profileRange.length; i++) {
    var key = profileRange[i][0];
    var val = profileRange[i][1];
    if (key) {
      profile[key.toString().trim()] = val !== undefined ? val.toString().trim() : '';
    }
  }
  
  // Convert profileImage drive link if it's set
  if (profile.profileImage) {
    profile.profileImage = convertDriveLink(profile.profileImage);
  }
  
  // 2. Read Licenses
  var licensesSheet = ss.getSheetByName('Licenses');
  var licensesRange = licensesSheet.getDataRange().getValues();
  var licenses = [];
  for (var i = 1; i < licensesRange.length; i++) {
    if (licensesRange[i][0]) {
      licenses.push({
        name: licensesRange[i][0].toString().trim(),
        issuer: licensesRange[i][1] ? licensesRange[i][1].toString().trim() : ''
      });
    }
  }
  profile.licenses = licenses;
  
  // 3. Read Education
  var educationSheet = ss.getSheetByName('Education');
  var educationRange = educationSheet.getDataRange().getValues();
  var education = [];
  for (var i = 1; i < educationRange.length; i++) {
    if (educationRange[i][0]) {
      education.push({
        degree: educationRange[i][0].toString().trim(),
        school: educationRange[i][1] ? educationRange[i][1].toString().trim() : ''
      });
    }
  }
  profile.education = education;
  
  // 4. Read Documents
  var docsSheet = ss.getSheetByName('Documents');
  var docsRange = docsSheet.getDataRange().getValues();
  var documents = [];
  for (var i = 1; i < docsRange.length; i++) {
    if (docsRange[i][0]) {
      documents.push({
        name: docsRange[i][0].toString().trim(),
        url: docsRange[i][1] ? convertDriveLink(docsRange[i][1].toString().trim()) : ''
      });
    }
  }
  profile.documents = documents;
  
  return profile;
}

/**
 * Core function to query table data from 'Portfolio' sheet.
 */
function getPortfolioData() {
  setupInitialData();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Portfolio');
  var data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return [];
  }
  
  var headers = data[0];
  var result = [];
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var obj = {};
    var hasValues = false;
    
    for (var j = 0; j < headers.length; j++) {
      var key = headers[j].toString().trim();
      if (!key) continue;
      
      var val = row[j];
      if (val !== undefined && val !== null && val !== '') {
        hasValues = true;
      }
      
      if (key === 'Date' && val instanceof Date) {
        var year = val.getFullYear();
        var month = ('0' + (val.getMonth() + 1)).slice(-2);
        obj[key] = year + '-' + month;
      } else if (key === 'Drive_Image_Link') {
        obj[key] = convertDriveLink(val);
      } else {
        obj[key] = val !== undefined ? val.toString().trim() : '';
      }
    }
    
    if (hasValues) {
      // Ensure it has an id
      if (!obj.id) {
        obj.id = 'gas-proj-' + i;
      }
      result.push(obj);
    }
  }
  
  // Sort projects alphabetically/chronologically starting with latest Date
  result.sort(function(a, b) {
    var dateA = a.Date || '';
    var dateB = b.Date || '';
    return dateB.localeCompare(dateA);
  });
  
  return result;
}

/**
 * Fetch trainings history from 'Trainings' sheet
 */
function getTrainingsData() {
  setupInitialData();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Trainings');
  var data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return [];
  }
  
  var result = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (row[0]) {
      result.push({
        id: 'gas-tr-' + i,
        code: row[0].toString().trim(),
        classId: row[1] ? row[1].toString().trim() : '',
        title: row[2] ? row[2].toString().trim() : '',
        dateRange: row[3] ? row[3].toString().trim() : '',
        category: row[4] ? row[4].toString().trim() : 'Management & General',
        status: row[5] ? row[5].toString().trim() : 'Passed'
      });
    }
  }
  return result;
}

/**
 * Automatically provisions all necessary sheets inside active Spreadsheet.
 */
function setupInitialData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Portfolio Sheet
  var portfolioSheet = ss.getSheetByName('Portfolio');
  if (!portfolioSheet) {
    portfolioSheet = ss.insertSheet('Portfolio');
    var headers = ['Date', 'Category', 'Title', 'Description', 'Tools', 'Drive_Image_Link'];
    portfolioSheet.appendRow(headers);
    portfolioSheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#0f172a') // Slate 900
      .setFontColor('#ffffff')
      .setHorizontalAlignment('center');
      
    // Generic placeholder data for portfolio
    var mockProjects = [
      [
        '2026-06',
        'IT Infrastructure & Security',
        'Enterprise Network Segmentation Project',
        'Designed and implemented secure network zones using VLANs and Fortigate firewalls, reducing attack vectors by 40% and increasing routing stability.',
        'Network Design, VLAN Segmentation, Fortigate Firewall, Cybersecurity',
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop'
      ],
      [
        '2025-12',
        'IT Infrastructure & Security',
        'High-Availability VMware Cluster Deploy',
        'Configured a redundant server cluster using VMware ESXi and vCenter, achieving a 99.99% infrastructure uptime for business-critical SCADA databases.',
        'VMware vSphere, Server administration, Disaster Recovery, Infrastructure Redundancy',
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop'
      ]
    ];
    for (var i = 0; i < mockProjects.length; i++) {
      portfolioSheet.appendRow(mockProjects[i]);
    }
    portfolioSheet.autoResizeColumns(1, headers.length);
  }
  
  // 2. Profile Sheet
  var profileSheet = ss.getSheetByName('Profile');
  if (!profileSheet) {
    profileSheet = ss.insertSheet('Profile');
    var headers = ['Key', 'Value'];
    profileSheet.appendRow(headers);
    profileSheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#0f172a')
      .setFontColor('#ffffff')
      .setHorizontalAlignment('center');
      
    var defaultProfile = [
      ['name', 'John Doe'],
      ['nameThai', 'จอห์น โด'],
      ['title', 'Senior IT Infrastructure Specialist'],
      ['company', 'Global Tech Solutions Co., Ltd.'],
      ['phone', '080-1234567'],
      ['email', 'john.doe@example.com'],
      ['address', 'Bangkok, Thailand'],
      ['summary', 'Experienced systems administrator and network engineer specializing in enterprise server deployments, virtualization (VMware), cloud systems, and network security.'],
      ['languages', 'Thai (Native) | English (Professional Working Proficiency)'],
      ['profileImage', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop']
    ];
    for (var i = 0; i < defaultProfile.length; i++) {
      profileSheet.appendRow(defaultProfile[i]);
    }
    profileSheet.autoResizeColumns(1, headers.length);
  }
  
  // 3. Licenses Sheet
  var licensesSheet = ss.getSheetByName('Licenses');
  if (!licensesSheet) {
    licensesSheet = ss.insertSheet('Licenses');
    var headers = ['Name', 'Issuer'];
    licensesSheet.appendRow(headers);
    licensesSheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#0f172a')
      .setFontColor('#ffffff')
      .setHorizontalAlignment('center');
      
    var defaultLicenses = [
      ['Cisco Certified Network Associate (CCNA)', 'Cisco, 2025'],
      ['VMware Certified Professional - NV', 'VMware, 2024']
    ];
    for (var i = 0; i < defaultLicenses.length; i++) {
      licensesSheet.appendRow(defaultLicenses[i]);
    }
    licensesSheet.autoResizeColumns(1, headers.length);
  }
  
  // 4. Education Sheet
  var educationSheet = ss.getSheetByName('Education');
  if (!educationSheet) {
    educationSheet = ss.insertSheet('Education');
    var headers = ['Degree', 'School'];
    educationSheet.appendRow(headers);
    educationSheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#0f172a')
      .setFontColor('#ffffff')
      .setHorizontalAlignment('center');
      
    var defaultEdu = [
      ['Bachelor of Science in Information Technology', 'Kasetsart University, 2018-2022'],
      ['High Vocational Certificate in Network Technology', 'Bangkok Technical College, 2016-2018']
    ];
    for (var i = 0; i < defaultEdu.length; i++) {
      educationSheet.appendRow(defaultEdu[i]);
    }
    educationSheet.autoResizeColumns(1, headers.length);
  }
  
  // 5. Trainings Sheet
  var trainingsSheet = ss.getSheetByName('Trainings');
  if (!trainingsSheet) {
    trainingsSheet = ss.insertSheet('Trainings');
    var headers = ['Code', 'ClassId', 'Title', 'DateRange', 'Category', 'Status'];
    trainingsSheet.appendRow(headers);
    trainingsSheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#0f172a')
      .setFontColor('#ffffff')
      .setHorizontalAlignment('center');
      
    var defaultTrainings = [
      ['INENG00880', 'INENG00880250N', 'ความปลอดภัยในการทำงานเกี่ยวกับไฟฟ้า (Electrical Safety)', '30-01-2025', 'Safety & Compliance', 'Passed'],
      ['INPRO01870', 'INPRO018701024N', 'การวิเคราะห์การสั่นสะเทือนของเครื่องจักร (Machine Vibration Analysis)', '30-10-2024', 'IT & Technical', 'Passed'],
      ['OTITI00050', 'ITI00050201801C', 'การฝึกอบรมเทคโนโลยีสารสนเทศภายนอก (External IT Training)', '11-09-2018 - 12-09-2018', 'IT & Technical', 'Passed'],
      ['Z000007363', 'Z000007363', 'สารจาก MD (MD Message)', '01-01-1900', 'Management & General', 'Passed']
    ];
    for (var i = 0; i < defaultTrainings.length; i++) {
      trainingsSheet.appendRow(defaultTrainings[i]);
    }
    trainingsSheet.autoResizeColumns(1, headers.length);
  }
  
  // 6. Documents Sheet
  var docsSheet = ss.getSheetByName('Documents');
  if (!docsSheet) {
    docsSheet = ss.insertSheet('Documents');
    var headers = ['Name', 'DriveUrl'];
    docsSheet.appendRow(headers);
    docsSheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#0f172a')
      .setFontColor('#ffffff')
      .setHorizontalAlignment('center');
      
    var defaultDocs = [
      ['Resume / CV (PDF)', 'https://drive.google.com/file/d/demo-resume-id/view'],
      ['Certificates Bundle (PDF)', 'https://drive.google.com/file/d/demo-cert-id/view']
    ];
    for (var i = 0; i < defaultDocs.length; i++) {
      docsSheet.appendRow(defaultDocs[i]);
    }
    docsSheet.autoResizeColumns(1, headers.length);
  }
}
`
  },
  {
    filename: "index.html",
    language: "html",
    description: "The primary vertical timeline portfolio layout template designed for recruitment agencies and managers.",
    code: `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Professional Timeline Portfolio</title>
  
  <!-- Modern Tailwind CSS CDN v3 -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Font Integrations: Prompt and Sarabun for professional Thai/English UI -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&family=Sarabun:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
  
  <!-- Phosphor Icons for smooth graphical representation -->
  <script src="https://unpkg.com/@phosphor-icons/web"></script>

  <?!= include('style'); ?>
</head>
<body class="bg-[#fafbfd] text-gray-800 font-['Sarabun'] antialiased selection:bg-cyan-100 min-h-screen pb-24">

  <!-- ==================== HERO SECTION ==================== -->
  <header class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#1e293b] to-cyan-950 text-white min-h-[340px] flex items-center mb-10 shadow-lg">
    <!-- Decorative Ambient Blobs -->
    <div class="absolute top-0 right-0 w-80 h-80 bg-cyan-500 rounded-full filter blur-[100px] opacity-15 pointer-events-none -mr-20 -mt-20"></div>
    <div class="absolute bottom-0 left-0 w-80 h-80 bg-blue-500 rounded-full filter blur-[100px] opacity-10 pointer-events-none -ml-20 -mb-20"></div>
    
    <div class="max-w-4xl mx-auto px-4 py-12 w-full relative z-10">
      <div class="flex flex-col md:flex-row items-center gap-6 md:gap-8">
        <!-- Profile Frame with Elegant Border -->
        <div class="relative group">
          <div class="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
          <div class="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-white bg-slate-800 flex items-center justify-center">
            <!-- Replace with direct picture. Default falls back to custom elegant letter icon -->
            <img id="profile-img" src="<?= profile.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop' ?>" alt="Profile" class="w-full h-full object-cover" onerror="this.classList.add('hidden'); document.getElementById('profile-init').classList.remove('hidden');" />
            <div id="profile-init" class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-cyan-600 to-blue-500 text-white font-['Prompt'] font-bold text-3xl hidden">
              <i class="ph-bold ph-user text-4xl"></i>
            </div>
          </div>
        </div>

        <!-- Bio Content Details -->
        <div class="text-center md:text-left flex-1">
          <h1 class="text-3xl md:text-4xl font-extrabold font-['Prompt'] tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-blue-200">
            <?= profile.name || 'Your Name' ?>
          </h1>
          <p class="text-cyan-200 font-light font-['Prompt'] text-lg mb-3">
            <?= profile.nameThai || '' ?><? if (profile.nameThai && profile.title) { ?> | <? } ?><?= profile.title || '' ?>
          </p>
          <p class="text-slate-300 font-light max-w-xl text-sm leading-relaxed mb-4">
            <?= profile.summary || '' ?>
          </p>
          
          <!-- Social Contact Badges -->
          <div class="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs font-['Prompt']">
            <? if (profile.email) { ?>
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-slate-200 backdrop-blur-md font-mono">
              <i class="ph ph-envelope text-cyan-300 text-sm"></i> <?= profile.email ?>
            </span>
            <? } ?>
            <? if (profile.phone) { ?>
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-slate-200 backdrop-blur-md font-mono">
              <i class="ph ph-phone text-cyan-300 text-sm"></i> <?= profile.phone ?>
            </span>
            <? } ?>
            <? if (profile.address) { ?>
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-slate-200 backdrop-blur-md">
              <i class="ph ph-map-pin text-cyan-300 text-sm"></i> <?= profile.address ?>
            </span>
            <? } ?>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- ==================== MAIN CONTAINER ==================== -->
  <main class="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
    
    <!-- ==================== LEFT SIDEBAR ==================== -->
    <div class="md:col-span-4 space-y-6">
      
      <!-- ==================== FILTERS CONTAINER ==================== -->
      <section class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3.5 font-['Prompt'] flex items-center gap-1.5">
          <i class="ph-bold ph-funnel text-slate-500 text-sm"></i> คัดกรองหมวดหมู่
        </h2>
        <div id="filter-buttons" class="flex flex-wrap gap-2 font-['Prompt']">
          <button onclick="filterCategory('All')" class="category-btn active px-4 py-2 text-sm font-medium rounded-xl transition duration-200 hover:scale-[1.02] focus:outline-none">
            ทั้งหมด
          </button>
        </div>
      </section>

      <!-- ==================== ATTACHED DOCUMENTS ==================== -->
      <? if (profile.documents && profile.documents.length > 0) { ?>
      <section class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3.5 font-['Prompt'] flex items-center gap-1.5">
          <i class="ph-bold ph-file-text text-slate-500 text-sm"></i> เอกสารแนบ (Documents)
        </h2>
        <div class="space-y-2.5 font-['Prompt'] text-xs">
          <? for (var i = 0; i < profile.documents.length; i++) { ?>
          <div class="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-xl">
            <span class="font-medium text-slate-700 truncate max-w-[130px]" title="<?= profile.documents[i].name ?>"><?= profile.documents[i].name ?></span>
            <a href="<?= profile.documents[i].url ?>" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 px-2.5 py-1 bg-cyan-50 hover:bg-cyan-100 border border-cyan-100 rounded text-[10px] text-cyan-600 font-semibold transition">
              เปิดดู <i class="ph-bold ph-arrow-square-out text-[10px]"></i>
            </a>
          </div>
          <? } ?>
        </div>
      </section>
      <? } ?>

      <!-- ==================== LICENSES & CERTIFICATIONS ==================== -->
      <? if (profile.licenses && profile.licenses.length > 0) { ?>
      <section class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3.5 font-['Prompt'] flex items-center gap-1.5">
          <i class="ph-bold ph-award text-slate-500 text-sm"></i> ใบประกอบวิชาชีพ & Cert
        </h2>
        <div class="space-y-3 font-['Prompt'] text-xs">
          <? for (var i = 0; i < profile.licenses.length; i++) { ?>
          <div class="relative pl-3.5 before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:bg-cyan-500 before:rounded-full">
            <strong class="text-slate-800 block"><?= profile.licenses[i].name ?></strong>
            <span class="text-slate-400 block text-[10px]"><?= profile.licenses[i].issuer ?></span>
          </div>
          <? } ?>
        </div>
      </section>
      <? } ?>

      <!-- ==================== EDUCATION ==================== -->
      <? if (profile.education && profile.education.length > 0) { ?>
      <section class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3.5 font-['Prompt'] flex items-center gap-1.5">
          <i class="ph-bold ph-book-open text-slate-500 text-sm"></i> ประวัติการศึกษา
        </h2>
        <div class="space-y-3 font-['Prompt'] text-xs">
          <? for (var i = 0; i < profile.education.length; i++) { ?>
          <div class="relative pl-3.5 before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:bg-cyan-500 before:rounded-full">
            <strong class="text-slate-800 block"><?= profile.education[i].degree ?></strong>
            <span class="text-slate-400 block text-[10px]"><?= profile.education[i].school ?></span>
          </div>
          <? } ?>
        </div>
      </section>
      <? } ?>

    </div>

    <!-- ==================== RIGHT TIMELINE SECTION ==================== -->
    <div class="md:col-span-8 space-y-6">
      
      <!-- ==================== TIMELINE AREA ==================== -->
      <section class="relative">
        <!-- Loading Spinner Interface -->
        <div id="loader" class="flex flex-col items-center justify-center py-20 text-cyan-600 transition">
          <div class="w-12 h-12 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p class="font-['Prompt'] text-slate-500 text-sm font-light">กำลังประมวลฐานข้อมูล Google Sheets...</p>
        </div>

        <!-- Empty State Graphic -->
        <div id="empty-state" class="hidden text-center py-16 px-4 bg-white rounded-2xl border border-slate-100 shadow-sm max-w-lg mx-auto">
          <div class="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="ph-bold ph-tray text-3xl"></i>
          </div>
          <h3 class="font-['Prompt'] font-bold text-slate-700 mb-1 text-lg">ไม่พบข้อมูลในหมวดหมู่นี้</h3>
          <p class="text-slate-400 font-light text-sm">โปรดระบุเกณฑ์การคัดกรองหรือลองเลือกหัวข้ออื่นอีกครั้ง</p>
        </div>

        <!-- Main Visual Timeline Track Line -->
        <div id="timeline-track" class="hidden absolute left-5 md:left-1/2 top-4 bottom-4 w-[3px] bg-cyan-100 transform md:-translate-x-1/2 pointer-events-none"></div>

        <!-- Vertical Timeline Output Wrapper -->
        <div id="timeline-container" class="relative min-h-[100px]">
          <!-- Cards loaded dynamically via script -->
        </div>
      </section>

    </div>

  </main>

  <!-- Include Client Script Logic -->
  <?!= include('script'); ?>
</body>
</html>
`
  },
  {
    filename: "style.html",
    language: "html",
    description: "Contains Tailwind modifications, global styling overrides, and timeline track graphics stylesheet.",
    code: `<style>
  /* Base custom reset styling & Custom Fonts definition */
  body {
    font-family: 'Sarabun', 'Segoe UI', system-ui, -apple-system, sans-serif;
  }
  
  h1, h2, h3, h4, button, .font-prompt {
    font-family: 'Prompt', sans-serif;
  }

  /* Core custom definitions for clean UI filters button style */
  .category-btn {
    color: #4b5563;
    background-color: #f3f4f6;
    border: 1px solid #e5e7eb;
  }

  .category-btn.active {
    color: #ffffff;
    background-color: #0891b2;
    border-color: #0891b2;
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.2);
  }

  /* Fancy fading anims */
  .fade-in-up {
    animation: fadeInUp 0.5s ease-out forwards;
    opacity: 0;
    transform: translateY(16px);
  }

  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Direct Image Loader effect */
  .image-hover-zoom {
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .image-hover-zoom:hover {
    transform: scale(1.035);
  }

  /* Custom line point styles */
  .timeline-dot {
    box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.15);
  }
</style>
`
  },
  {
    filename: "script.html",
    language: "html",
    description: "Frontend scripts handling sheets data fetch, filtering triggers, and chronological card node generation.",
    code: `<script>
  // Global State Variable variables
  let allPortfolioItems = [];
  let currentCategory = 'All';

  // Bootstrapping operations, runs when window loaded
  window.addEventListener('load', function() {
    retrieveData();
  });

  /**
   * Fetches latest record values from Google Sheets via Code.gs
   */
  function retrieveData() {
    document.getElementById('loader').classList.remove('hidden');
    document.getElementById('timeline-track').classList.add('hidden');
    document.getElementById('empty-state').classList.add('hidden');
    
    google.script.run
      .withSuccessHandler(function(response) {
        allPortfolioItems = response || [];
        initializeFilters();
        renderTimeline();
      })
      .withFailureHandler(function(err) {
        console.error("Retrieve error: ", err);
        document.getElementById('loader').innerHTML = \`
          <div class="text-red-500 text-center font-['Prompt']">
            <i class="ph-bold ph-warning-circle text-4xl mb-2"></i>
            <h4 class="font-bold">เกิดข้อผิดพลาดในการโหลดข้อมูล</h4>
            <p class="text-xs font-light text-slate-400 mt-1">\${err.message || err}</p>
          </div>
        \`;
      })
      .getPortfolioData();
  }

  /**
   * Generates dynamic filter lists using Category field found inside the database
   */
  function initializeFilters() {
    const listContainer = document.getElementById('filter-buttons');
    if (!listContainer) return;

    // Collate all unique categories present in sheet response
    const categoriesSet = new Set();
    allPortfolioItems.forEach(item => {
      if (item.Category) {
        categoriesSet.add(item.Category.trim());
      }
    });

    const categoryList = ['All', ...Array.from(categoriesSet)];
    
    // Clear structure
    listContainer.innerHTML = '';

    categoryList.forEach(categoryName => {
      const isSelected = categoryName === currentCategory;
      const labelText = categoryName === 'All' ? 'ทั้งหมด' : categoryName;
      
      const button = document.createElement('button');
      button.className = \`category-btn px-4 py-2 text-xs font-medium rounded-xl transition duration-200 hover:scale-[1.02] focus:outline-none \${isSelected ? 'active' : ''}\`;
      button.innerText = labelText;
      button.onclick = function() {
        filterCategory(categoryName);
      };
      
      listContainer.appendChild(button);
    });
  }

  /**
   * Modifies dynamic filter selection and redraws cards list
   */
  function filterCategory(categoryName) {
    currentCategory = categoryName;
    
    // Update active visual tags
    const buttons = document.querySelectorAll('#filter-buttons button');
    buttons.forEach(btn => {
      if (btn.innerText === (categoryName === 'All' ? 'ทั้งหมด' : categoryName)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    renderTimeline();
  }

  /**
   * Master render method to construct the vertical timeline
   */
  function renderTimeline() {
    const container = document.getElementById('timeline-container');
    const track = document.getElementById('timeline-track');
    const loader = document.getElementById('loader');
    const emptyState = document.getElementById('empty-state');
    
    // Hide loading screen
    loader.classList.add('hidden');
    
    // Filter array to current selection
    const filteredItems = allPortfolioItems.filter(item => {
      if (currentCategory === 'All') return true;
      return item.Category === currentCategory;
    });

    if (filteredItems.length === 0) {
      container.innerHTML = '';
      track.classList.add('hidden');
      emptyState.classList.remove('hidden');
      return;
    }

    emptyState.classList.add('hidden');
    track.classList.remove('hidden');
    
    let htmlContent = '';
    
    filteredItems.forEach((item, index) => {
      const isLeft = index % 2 === 0; // alternates sides under desktop grids
      
      // Split Tools field and create badge tags
      let badgesHtml = '';
      if (item.Tools) {
        const toolsArr = item.Tools.split(',').map(t => t.trim());
        toolsArr.forEach(toolName => {
          if (toolName) {
            badgesHtml += \`
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-50 border border-cyan-100/50 text-cyan-700 text-xs font-medium font-['Prompt']">
                <i class="ph-bold ph-cpu text-[11px] text-cyan-400"></i>\${toolName}
              </span>
            \`;
          }
        });
      }

      // Format elegant Category Badge UI styling
      const categoryTheme = getCategoryTheme(item.Category);

      // Handle fallback image if no Drive link provided or contains invalid ID placeholders
      const imageSourceUrl = item.Drive_Image_Link && !item.Drive_Image_Link.includes('_demo_image') 
        ? item.Drive_Image_Link 
        : getCategoryFallbackImage(item.Category);

      // Visual structure: Responsive flex/grid. Left margin on mobile to align dot path, center alternate layout in desktop md:
      htmlContent += \`
        <div class="relative flex flex-col md:flex-row items-start md:justify-between w-full mb-10 last:mb-0 text-left fade-in-up" style="animation-delay: \${index * 0.15}s;">
          
          <!-- Desktop Alternating Alignment Content Placement -->
          <div class="w-full md:w-[46%] pl-12 md:pl-0 order-2 md:order-1 \${isLeft ? 'md:text-right' : 'md:opacity-0 md:h-0 md:overflow-hidden md:pointer-events-none'}\` + (isLeft ? '' : ' md:hidden') + \`">
            \${isLeft ? createCardElement(item, imageSourceUrl, badgesHtml, categoryTheme) : ''}
          </div>

          <!-- Chronology Timeline Node (Dot Point) -->
          <div class="absolute left-1.5 md:left-1/2 top-4 w-10 h-10 rounded-full bg-white border-2 border-cyan-500 flex items-center justify-center transform md:-translate-x-1/2 z-10 timeline-dot">
            <i class="\${categoryTheme.icon} text-lg text-cyan-600 animate-pulse"></i>
          </div>

          <div class="w-full md:w-[46%] pl-12 md:pl-0 order-2 \${!isLeft ? 'md:text-left' : 'md:opacity-0 md:h-0 md:overflow-hidden md:pointer-events-none md:order-3'}\` + (!isLeft ? '' : ' md:hidden') + \`">
            \${!isLeft ? createCardElement(item, imageSourceUrl, badgesHtml, categoryTheme) : ''}
          </div>
          
        </div>
      \`;
    });
    
    container.innerHTML = htmlContent;
  }

  /**
   * Dynamic theme mapping dictionary to stylize timeline nodes
   */
  function getCategoryTheme(category) {
    if (!category) return { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-200', icon: 'ph-bold ph-folder' };
    
    const catUpper = category.trim().toUpperCase();
    if (catUpper.includes('SAFETY') || catUpper.includes('COMPLIANCE') || catUpper.includes('SECURITY') || catUpper.includes('HR')) {
      return { bg: 'bg-rose-50 text-rose-800', border: 'border-rose-100', icon: 'ph-bold ph-shield-check', accent: 'bg-rose-500' };
    } else if (catUpper.includes('INFRASTRUCTURE') || catUpper.includes('IT') || catUpper.includes('NETWORK')) {
      return { bg: 'bg-cyan-50 text-cyan-800', border: 'border-cyan-100', icon: 'ph-bold ph-hard-drives', accent: 'bg-cyan-500' };
    } else if (catUpper.includes('MANAGEMENT') || catUpper.includes('TOOLS') || catUpper.includes('PROJECT')) {
      return { bg: 'bg-indigo-50 text-indigo-800', border: 'border-indigo-100', icon: 'ph-bold ph-presentation-chart', accent: 'bg-indigo-500' };
    }
    
    return { bg: 'bg-slate-50 text-slate-800', border: 'border-slate-100', icon: 'ph-bold ph-cube', accent: 'bg-cyan-500' };
  }

  /**
   * Smart fallback images with placeholder visual representations fitting each niche
   */
  function getCategoryFallbackImage(category) {
    if (!category) return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop';
    
    const catUpper = category.trim().toUpperCase();
    if (catUpper.includes('SAFETY') || catUpper.includes('COMPLIANCE') || catUpper.includes('SECURITY') || catUpper.includes('HR')) {
      return 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop'; // industrial safety
    } else if (catUpper.includes('INFRASTRUCTURE') || catUpper.includes('IT') || catUpper.includes('NETWORK')) {
      return 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop'; // server hardware
    } else if (catUpper.includes('MANAGEMENT') || catUpper.includes('TOOLS') || catUpper.includes('PROJECT')) {
      return 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop'; // management desk
    }
    
    return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop'; // Office setup
  }

  /**
   * Compiles elements to render the dynamic portfolio projects card
   */
  function createCardElement(item, imageUrl, badgesHtml, theme) {
    return \`
      <div class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 hover:border-slate-200">
        <!-- Project Thumbnail Frame -->
        <div class="relative aspect-video w-full overflow-hidden bg-slate-900 group">
          <img src="\${imageUrl}" alt="\${item.Title}" class="w-full h-full object-cover image-hover-zoom" loading="lazy" />
          
          <!-- Category Floating Overlay Pill -->
          <span class="absolute top-3.5 left-3.5 px-3 py-1 text-xs font-semibold rounded-full shadow-sm \${theme.bg} \${theme.border} border font-['Prompt']">
            \${item.Category}
          </span>

          <!-- Time frame Tag Overlay -->
          <span class="absolute bottom-3 right-3 px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-900/70 text-white backdrop-blur-sm shadow-sm font-['Prompt'] flex items-center gap-1">
            <i class="ph ph-calendar"></i> \${item.Date}
          </span>
        </div>

        <!-- Descriptive Metadata Body -->
        <div class="p-5 font-prompt">
          <h3 class="text-base font-bold font-['Prompt'] text-slate-800 leading-snug mb-2.5 hover:text-cyan-600 transition duration-200">
            \${item.Title}
          </h3>
          <p class="text-slate-500 font-light text-xs leading-relaxed mb-4 font-['Sarabun']">
            \${item.Description}
          </p>

          <!-- Separator Line -->
          <div class="h-px bg-slate-100/80 mb-3.5"></div>

          <!-- Skill Chipsets list footer -->
          <div class="flex flex-wrap gap-1.5">
            \${badgesHtml ? badgesHtml : '<span class="text-xs text-slate-400 font-light italic font-prompt">ไม่ได้ระบุเครื่องมือ</span>'}
          </div>
        </div>
      </div>
    \`;
  }
</script>
`
  }
];
