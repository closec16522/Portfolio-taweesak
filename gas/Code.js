/**
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
    /\/file\/d\/([a-zA-Z0-9_-]+)/,                     // Standard share URL
    /id=([a-zA-Z0-9_-]+)/,                            // Direct id parameters
    /open\?id=([a-zA-Z0-9_-]+)/,                      // Open url
    /drive\.google\.com\/uc\?id=([a-zA-Z0-9_-]+)/,   // Export raw link
    /\/folders\/([a-zA-Z0-9_-]+)/                   // Folders fallback
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
      ['INPRO01870', 'INPRO018701024N', 'การวิเคราะห์การสั่นสะเทือนของเครื่องจักร (Machine Vibration Analysis)', '30-10-2024', 'IT & Technical', 'Passed']
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
