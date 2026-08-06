// Services for Report Module localStorage persistence
const REPORTS_KEY = "voiceOfStrayReports";

/**
 * Load reports from localStorage
 */
export function getReports() {
  const reportsRaw = localStorage.getItem(REPORTS_KEY);
  if (!reportsRaw) return [];
  try {
    return JSON.parse(reportsRaw);
  } catch (e) {
    return [];
  }
}

/**
 * Save reports list to localStorage
 */
export function saveReports(reports) {
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
}

/**
 * Create a new report and prepend it to reports list
 */
export function createReport(reportData) {
  const reports = getReports();
  reports.unshift(reportData);
  saveReports(reports);
  return reportData;
}

/**
 * Update an existing report
 */
export function updateReport(reportId, updatedFields) {
  const reports = getReports();
  const index = reports.findIndex(r => r.id === reportId);
  if (index !== -1) {
    reports[index] = { ...reports[index], ...updatedFields };
    saveReports(reports);
    return reports[index];
  }
  return null;
}

/**
 * Delete a report
 */
export function deleteReport(reportId) {
  const reports = getReports();
  const filtered = reports.filter(r => r.id !== reportId);
  saveReports(filtered);
}

/**
 * Get current session user profile for auto-filling contact details
 */
export function getCurrentUser() {
  const currentUserRaw = localStorage.getItem("currentUser");
  let currentUser = null;
  if (currentUserRaw) {
    try {
      currentUser = JSON.parse(currentUserRaw);
    } catch (e) {}
  }

  let phone = "";
  const storedProfile = localStorage.getItem("voiceOfStrayUserProfile");
  if (storedProfile) {
    try {
      const profile = JSON.parse(storedProfile);
      if (profile.phone) {
        phone = profile.phone;
      }
    } catch (e) {}
  }

  return {
    name: currentUser?.name || localStorage.getItem("username") || "",
    email: currentUser?.email || localStorage.getItem("email") || "",
    phone: phone
  };
}
