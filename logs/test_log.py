"""
Çağrı Merkezi Kalite Yönetimi Sistemi - Test Log Modülü (Python)

Bu modül, test işlemlerini kaydetmek için kullanılır.
Backend uygulamasına entegre edilebilir.
"""

import os
import json
import logging
import datetime
from enum import Enum

# Log dosyasının yolu
LOG_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'logs')
LOG_FILE = os.path.join(LOG_DIR, 'qm_test_log.log')

# Log seviyeleri
class LogLevel(Enum):
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    SUCCESS = "SUCCESS"
    DEBUG = "DEBUG"

# Logging yapılandırması
if not os.path.exists(LOG_DIR):
    os.makedirs(LOG_DIR)

# Logger yapılandırması
logger = logging.getLogger('qm_test_logger')
logger.setLevel(logging.DEBUG)

# Dosya handler
file_handler = logging.FileHandler(LOG_FILE)
file_handler.setLevel(logging.DEBUG)

# Konsol handler
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)

# Format
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)
console_handler.setFormatter(formatter)

# Handler'ları ekle
logger.addHandler(file_handler)
logger.addHandler(console_handler)

# Log kayıtlarını tutacak liste
logs = []

# Maksimum log sayısı
MAX_LOGS = 1000

def add_log(message, level=LogLevel.INFO, data=None):
    """
    Yeni bir log kaydı ekler
    
    Args:
        message (str): Log mesajı
        level (LogLevel): Log seviyesi
        data (dict, optional): İlgili veri
    
    Returns:
        dict: Eklenen log kaydı
    """
    timestamp = datetime.datetime.now().isoformat()
    
    log_entry = {
        'timestamp': timestamp,
        'level': level.value,
        'message': message,
        'data': json.dumps(data) if data else None
    }
    
    logs.append(log_entry)
    
    # Maksimum log sayısını aşarsa en eski logu sil
    if len(logs) > MAX_LOGS:
        logs.pop(0)
    
    # Log seviyesine göre kaydet
    if level == LogLevel.INFO:
        logger.info(message)
    elif level == LogLevel.WARNING:
        logger.warning(message)
    elif level == LogLevel.ERROR:
        logger.error(message)
    elif level == LogLevel.SUCCESS:
        logger.info(f"[SUCCESS] {message}")
    elif level == LogLevel.DEBUG:
        logger.debug(message)
    
    # Veri varsa ekstra log
    if data:
        logger.debug(f"Data: {json.dumps(data)}")
    
    # Log dosyasına kaydet
    save_logs_to_file()
    
    return log_entry

def save_logs_to_file():
    """Log kayıtlarını JSON dosyasına kaydeder"""
    try:
        with open(os.path.join(LOG_DIR, 'qm_test_logs.json'), 'w') as f:
            json.dump(logs, f, indent=2)
    except Exception as e:
        logger.error(f"Loglar dosyaya kaydedilemedi: {str(e)}")

def load_logs_from_file():
    """Log kayıtlarını JSON dosyasından yükler"""
    global logs
    try:
        log_file = os.path.join(LOG_DIR, 'qm_test_logs.json')
        if os.path.exists(log_file):
            with open(log_file, 'r') as f:
                logs = json.load(f)
    except Exception as e:
        logger.error(f"Loglar dosyadan yüklenemedi: {str(e)}")

def get_logs():
    """Tüm log kayıtlarını döndürür"""
    return logs.copy()

def filter_logs_by_level(level):
    """Belirli bir seviyedeki log kayıtlarını filtreler"""
    return [log for log in logs if log['level'] == level.value]

def clear_logs():
    """Log kayıtlarını temizler"""
    global logs
    logs = []
    try:
        log_file = os.path.join(LOG_DIR, 'qm_test_logs.json')
        if os.path.exists(log_file):
            os.remove(log_file)
    except Exception as e:
        logger.error(f"Log dosyası silinemedi: {str(e)}")

# Yardımcı fonksiyonlar
def log_info(message, data=None):
    """Bilgi seviyesinde log"""
    return add_log(message, LogLevel.INFO, data)

def log_warning(message, data=None):
    """Uyarı seviyesinde log"""
    return add_log(message, LogLevel.WARNING, data)

def log_error(message, data=None):
    """Hata seviyesinde log"""
    return add_log(message, LogLevel.ERROR, data)

def log_success(message, data=None):
    """Başarı seviyesinde log"""
    return add_log(message, LogLevel.SUCCESS, data)

def log_debug(message, data=None):
    """Debug seviyesinde log"""
    return add_log(message, LogLevel.DEBUG, data)

# Başlangıçta dosyadan logları yükle
load_logs_from_file()

# Test
if __name__ == "__main__":
    log_info("Test log sistemi başlatıldı")
    log_warning("Bu bir uyarı mesajıdır")
    log_error("Bu bir hata mesajıdır", {"error_code": 404, "detail": "Sayfa bulunamadı"})
    log_success("İşlem başarıyla tamamlandı")
    log_debug("Debug bilgisi", {"memory_usage": "45MB", "cpu": "12%"})
    
    print(f"Toplam {len(get_logs())} log kaydı bulunuyor")
    print(f"Hata logları: {len(filter_logs_by_level(LogLevel.ERROR))}") 