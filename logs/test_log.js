/**
 * Çağrı Merkezi Kalite Yönetimi Sistemi - Test Log Modülü
 * 
 * Bu modül, test işlemlerini kaydetmek için kullanılır.
 * Frontend uygulamasına entegre edilebilir.
 */

// Log seviyeleri
const LOG_LEVELS = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
  DEBUG: 'DEBUG'
};

// Log kayıtlarını tutacak dizi
let logs = [];

// Maksimum log sayısı
const MAX_LOGS = 1000;

/**
 * Yeni bir log kaydı ekler
 * @param {string} message - Log mesajı
 * @param {string} level - Log seviyesi (INFO, WARNING, ERROR, SUCCESS, DEBUG)
 * @param {Object} data - İlgili veri (opsiyonel)
 */
function addLog(message, level = LOG_LEVELS.INFO, data = null) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    data: data ? JSON.stringify(data) : null
  };
  
  logs.push(logEntry);
  
  // Konsola da yazdır
  console.log(`[${timestamp}] [${level}] ${message}`);
  if (data) {
    console.log(data);
  }
  
  // Maksimum log sayısını aşarsa en eski logu sil
  if (logs.length > MAX_LOGS) {
    logs.shift();
  }
  
  // LocalStorage'a kaydet
  saveLogsToStorage();
  
  return logEntry;
}

/**
 * Log kayıtlarını localStorage'a kaydeder
 */
function saveLogsToStorage() {
  try {
    localStorage.setItem('qm_test_logs', JSON.stringify(logs));
  } catch (error) {
    console.error('Loglar localStorage\'a kaydedilemedi:', error);
  }
}

/**
 * Log kayıtlarını localStorage'dan yükler
 */
function loadLogsFromStorage() {
  try {
    const storedLogs = localStorage.getItem('qm_test_logs');
    if (storedLogs) {
      logs = JSON.parse(storedLogs);
    }
  } catch (error) {
    console.error('Loglar localStorage\'dan yüklenemedi:', error);
  }
}

/**
 * Tüm log kayıtlarını döndürür
 * @returns {Array} Log kayıtları
 */
function getLogs() {
  return [...logs];
}

/**
 * Belirli bir seviyedeki log kayıtlarını filtreler
 * @param {string} level - Log seviyesi
 * @returns {Array} Filtrelenmiş log kayıtları
 */
function filterLogsByLevel(level) {
  return logs.filter(log => log.level === level);
}

/**
 * Log kayıtlarını temizler
 */
function clearLogs() {
  logs = [];
  localStorage.removeItem('qm_test_logs');
}

/**
 * Log kayıtlarını dosyaya indirir
 */
function downloadLogs() {
  const logText = logs.map(log => 
    `[${log.timestamp}] [${log.level}] ${log.message}${log.data ? ' - Data: ' + log.data : ''}`
  ).join('\n');
  
  const blob = new Blob([logText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `qm_test_logs_${new Date().toISOString().replace(/:/g, '-')}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Bilgi seviyesinde log
function logInfo(message, data = null) {
  return addLog(message, LOG_LEVELS.INFO, data);
}

// Uyarı seviyesinde log
function logWarning(message, data = null) {
  return addLog(message, LOG_LEVELS.WARNING, data);
}

// Hata seviyesinde log
function logError(message, data = null) {
  return addLog(message, LOG_LEVELS.ERROR, data);
}

// Başarı seviyesinde log
function logSuccess(message, data = null) {
  return addLog(message, LOG_LEVELS.SUCCESS, data);
}

// Debug seviyesinde log
function logDebug(message, data = null) {
  return addLog(message, LOG_LEVELS.DEBUG, data);
}

// Başlangıçta localStorage'dan logları yükle
loadLogsFromStorage();

// Dışa aktarılan fonksiyonlar
const Logger = {
  LOG_LEVELS,
  addLog,
  getLogs,
  filterLogsByLevel,
  clearLogs,
  downloadLogs,
  logInfo,
  logWarning,
  logError,
  logSuccess,
  logDebug
};

// Node.js ortamında
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Logger;
}
// Browser ortamında
else if (typeof window !== 'undefined') {
  window.QMLogger = Logger;
} 