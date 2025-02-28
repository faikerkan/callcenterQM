# Çağrı Merkezi Kalite Yönetimi Sistemi - Log Sistemi

Bu dizin, Çağrı Merkezi Kalite Yönetimi Sistemi'nin test ve geliştirme süreçlerinde kullanılan log sistemini içerir.

## Dosyalar

- `test_log.js`: Frontend uygulaması için JavaScript log modülü
- `test_log.py`: Backend uygulaması için Python log modülü
- `qm_test_log.log`: Python logger tarafından oluşturulan log dosyası
- `qm_test_logs.json`: Log kayıtlarının JSON formatında saklandığı dosya

## JavaScript Log Modülü Kullanımı

Frontend uygulamasında log sistemi kullanmak için:

```javascript
// Log modülünü import et
import QMLogger from '../logs/test_log.js';

// Bilgi seviyesinde log
QMLogger.logInfo('Kullanıcı giriş yaptı', { userId: 123, username: 'expert' });

// Uyarı seviyesinde log
QMLogger.logWarning('Dosya boyutu çok büyük', { fileSize: '25MB', maxSize: '20MB' });

// Hata seviyesinde log
QMLogger.logError('API isteği başarısız oldu', { statusCode: 500, message: 'Internal Server Error' });

// Başarı seviyesinde log
QMLogger.logSuccess('Değerlendirme başarıyla kaydedildi', { evaluationId: 1001 });

// Debug seviyesinde log
QMLogger.logDebug('Performans metrikleri', { renderTime: '120ms', memoryUsage: '45MB' });

// Tüm logları al
const allLogs = QMLogger.getLogs();

// Hata loglarını filtrele
const errorLogs = QMLogger.filterLogsByLevel(QMLogger.LOG_LEVELS.ERROR);

// Logları temizle
QMLogger.clearLogs();

// Logları dosyaya indir
QMLogger.downloadLogs();
```

## Python Log Modülü Kullanımı

Backend uygulamasında log sistemi kullanmak için:

```python
# Log modülünü import et
from logs.test_log import log_info, log_warning, log_error, log_success, log_debug, LogLevel, get_logs, filter_logs_by_level, clear_logs

# Bilgi seviyesinde log
log_info('Sunucu başlatıldı', {'port': 8000, 'environment': 'development'})

# Uyarı seviyesinde log
log_warning('Yüksek CPU kullanımı', {'cpu_usage': '85%', 'threshold': '80%'})

# Hata seviyesinde log
log_error('Veritabanı bağlantısı başarısız', {'error_code': 'DB_CONNECTION_ERROR', 'detail': 'Connection timed out'})

# Başarı seviyesinde log
log_success('Veritabanı migrasyonu tamamlandı', {'applied_migrations': 5})

# Debug seviyesinde log
log_debug('Sorgu performansı', {'query_time': '250ms', 'rows_affected': 150})

# Tüm logları al
all_logs = get_logs()

# Hata loglarını filtrele
error_logs = filter_logs_by_level(LogLevel.ERROR)

# Logları temizle
clear_logs()
```

## Log Dosyalarını İzleme

Python log dosyasını terminal üzerinden izlemek için:

```bash
tail -f logs/qm_test_log.log
```

## Log Seviyelerinin Anlamları

- **INFO**: Genel bilgi mesajları
- **WARNING**: Potansiyel sorunlar veya dikkat edilmesi gereken durumlar
- **ERROR**: Hata durumları
- **SUCCESS**: Başarıyla tamamlanan işlemler
- **DEBUG**: Geliştirme ve hata ayıklama için detaylı bilgiler

## Log Formatı

Her log kaydı şu bilgileri içerir:

- **timestamp**: Logın oluşturulduğu zaman damgası
- **level**: Log seviyesi (INFO, WARNING, ERROR, SUCCESS, DEBUG)
- **message**: Log mesajı
- **data**: İlgili veri (JSON formatında, opsiyonel)

## Notlar

- JavaScript log modülü, logları localStorage'da saklar ve tarayıcı oturumu boyunca korunur.
- Python log modülü, logları hem metin dosyasına hem de JSON formatında disk üzerinde saklar.
- Maksimum log sayısı her iki modülde de 1000 olarak ayarlanmıştır. Bu sayıya ulaşıldığında en eski loglar silinir. 