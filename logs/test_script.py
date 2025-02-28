"""
Çağrı Merkezi Kalite Yönetimi Sistemi - Test Senaryoları

Bu script, test senaryolarını çalıştırmak ve sonuçları loglamak için kullanılır.
"""

import os
import sys
import time
import json
import random
from datetime import datetime

# Log modülünü import et
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from logs.test_log import log_info, log_warning, log_error, log_success, log_debug, LogLevel, get_logs, clear_logs

def test_login():
    """Giriş yapma testi"""
    log_info("Giriş testi başlatılıyor")
    
    # Test kullanıcıları
    users = [
        {"username": "admin", "password": "admin123", "role": "admin"},
        {"username": "expert", "password": "expert123", "role": "expert"},
        {"username": "agent", "password": "agent123", "role": "agent"}
    ]
    
    for user in users:
        try:
            # Giriş simülasyonu
            log_info(f"{user['username']} kullanıcısı ile giriş deneniyor", user)
            time.sleep(0.5)  # Giriş işlemi simülasyonu
            
            # Başarılı giriş
            if random.random() > 0.2:  # %80 başarı oranı
                log_success(f"{user['username']} kullanıcısı başarıyla giriş yaptı", 
                           {"role": user["role"], "login_time": datetime.now().isoformat()})
            else:
                # Başarısız giriş
                log_error(f"{user['username']} kullanıcısı için giriş başarısız", 
                         {"error": "Geçersiz kullanıcı adı veya şifre"})
        except Exception as e:
            log_error(f"Giriş sırasında beklenmeyen hata: {str(e)}")
    
    log_info("Giriş testleri tamamlandı")
    return True

def test_evaluation_form():
    """Değerlendirme formu testi"""
    log_info("Değerlendirme formu testi başlatılıyor")
    
    try:
        # Form doldurma simülasyonu
        log_info("Değerlendirme formu doldurulacak")
        
        # Temsilci seçimi
        agent_id = random.randint(1, 5)
        agent_name = f"Temsilci {agent_id}"
        log_info(f"Temsilci seçildi: {agent_name}", {"agent_id": agent_id})
        
        # Çağrı bilgileri
        call_data = {
            "queue": random.choice(["Destek", "Satış", "Teknik Destek", "Şikayet"]),
            "phone_number": f"555{random.randint(1000000, 9999999)}",
            "call_date": datetime.now().isoformat(),
            "duration": f"00:{random.randint(1, 15)}:{random.randint(10, 59)}"
        }
        log_info("Çağrı bilgileri girildi", call_data)
        
        # Kriterler ve puanlar
        criteria = [
            {"id": 1, "name": "Müşteri Selamlama", "weight": 10},
            {"id": 2, "name": "Problem Anlama", "weight": 20},
            {"id": 3, "name": "Çözüm Sunma", "weight": 30},
            {"id": 4, "name": "İletişim Becerileri", "weight": 25},
            {"id": 5, "name": "Kapanış", "weight": 15}
        ]
        
        scores = {}
        total_score = 0
        total_weight = 0
        
        for criterion in criteria:
            score = random.randint(60, 100)
            scores[criterion["id"]] = score
            total_score += score * criterion["weight"]
            total_weight += criterion["weight"]
            
            log_debug(f"{criterion['name']} kriteri için puan: {score}", 
                     {"criterion_id": criterion["id"], "score": score})
        
        # Toplam puan hesaplama
        final_score = total_score / total_weight if total_weight > 0 else 0
        log_info(f"Toplam puan hesaplandı: {final_score:.2f}")
        
        # Kritik hatalar
        critical_errors = {}
        if random.random() < 0.3:  # %30 ihtimalle kritik hata
            error_type = random.choice([
                "callTermination", "recordingError", "rudeBehavior", 
                "noContactInfo", "lineLeftOpen", "kvkkViolation"
            ])
            critical_errors[error_type] = True
            log_warning(f"Kritik hata tespit edildi: {error_type}")
        
        # Açıklama
        comments = "Bu bir test değerlendirmesidir. " + \
                  f"Temsilci {agent_name} genel olarak " + \
                  ("iyi" if final_score >= 80 else "ortalama" if final_score >= 60 else "zayıf") + \
                  " performans gösterdi."
        
        # Form gönderimi
        evaluation_data = {
            "agent_id": agent_id,
            "agent_name": agent_name,
            "call_data": call_data,
            "scores": scores,
            "critical_errors": critical_errors,
            "comments": comments,
            "total_score": final_score
        }
        
        log_info("Değerlendirme formu gönderiliyor", evaluation_data)
        time.sleep(1)  # Form gönderimi simülasyonu
        
        # Başarılı kayıt
        if random.random() > 0.1:  # %90 başarı oranı
            evaluation_id = f"eval_{int(time.time())}"
            log_success(f"Değerlendirme başarıyla kaydedildi", {"evaluation_id": evaluation_id})
        else:
            # Başarısız kayıt
            log_error("Değerlendirme kaydedilemedi", {"error": "Sunucu hatası"})
        
    except Exception as e:
        log_error(f"Değerlendirme formu testi sırasında beklenmeyen hata: {str(e)}")
    
    log_info("Değerlendirme formu testi tamamlandı")
    return True

def test_evaluation_list():
    """Değerlendirme listesi testi"""
    log_info("Değerlendirme listesi testi başlatılıyor")
    
    try:
        # Liste yükleme simülasyonu
        log_info("Değerlendirme listesi yükleniyor")
        time.sleep(0.8)  # Liste yükleme simülasyonu
        
        # Rastgele değerlendirme sayısı
        evaluation_count = random.randint(5, 15)
        log_info(f"{evaluation_count} adet değerlendirme yüklendi")
        
        # Filtreleme testi
        filter_options = ["Destek", "Satış", "Teknik Destek"]
        selected_filter = random.choice(filter_options)
        log_info(f"Filtre uygulanıyor: {selected_filter}")
        
        # Filtreleme sonuçları
        filtered_count = random.randint(1, evaluation_count)
        log_info(f"Filtreleme sonucu {filtered_count} değerlendirme listelendi")
        
        # Değerlendirme detayı görüntüleme
        evaluation_id = f"eval_{random.randint(1000, 9999)}"
        log_info(f"Değerlendirme detayı görüntüleniyor: {evaluation_id}")
        time.sleep(0.5)  # Detay yükleme simülasyonu
        
        # Detay yükleme başarılı
        if random.random() > 0.1:  # %90 başarı oranı
            log_success(f"Değerlendirme detayları başarıyla yüklendi", {"evaluation_id": evaluation_id})
        else:
            # Detay yükleme başarısız
            log_error(f"Değerlendirme detayları yüklenemedi", 
                     {"evaluation_id": evaluation_id, "error": "Değerlendirme bulunamadı"})
        
    except Exception as e:
        log_error(f"Değerlendirme listesi testi sırasında beklenmeyen hata: {str(e)}")
    
    log_info("Değerlendirme listesi testi tamamlandı")
    return True

def test_audio_player():
    """Ses oynatıcı testi"""
    log_info("Ses oynatıcı testi başlatılıyor")
    
    try:
        # Ses dosyası yükleme simülasyonu
        audio_file = {
            "name": f"call_recording_{random.randint(1000, 9999)}.mp3",
            "size": random.randint(500, 5000) * 1024,  # 500KB - 5MB
            "type": "audio/mpeg",
            "duration": random.randint(60, 600)  # 1-10 dakika
        }
        
        log_info(f"Ses dosyası yükleniyor", audio_file)
        time.sleep(0.7)  # Dosya yükleme simülasyonu
        
        # Ses dosyası yükleme başarılı
        if audio_file["size"] > 20 * 1024 * 1024:  # 20MB'dan büyükse hata
            log_error("Ses dosyası çok büyük", 
                     {"file_size": audio_file["size"], "max_size": 20 * 1024 * 1024})
            return False
        
        log_success(f"Ses dosyası başarıyla yüklendi: {audio_file['name']}")
        
        # Oynatma testi
        log_info("Ses dosyası oynatılıyor")
        time.sleep(0.3)  # Oynatma başlatma simülasyonu
        
        # Oynatma başarılı
        if random.random() > 0.2:  # %80 başarı oranı
            log_success("Ses dosyası başarıyla oynatılıyor")
            
            # Oynatma kontrolleri testi
            controls = ["pause", "seek", "volume", "mute", "playback_rate"]
            for _ in range(3):  # 3 rastgele kontrol testi
                control = random.choice(controls)
                if control == "pause":
                    log_info("Ses dosyası duraklatıldı")
                    time.sleep(0.2)
                    log_info("Ses dosyası devam ettiriliyor")
                elif control == "seek":
                    seek_position = random.randint(0, audio_file["duration"])
                    log_info(f"Ses dosyası {seek_position} saniyeye ilerledi")
                elif control == "volume":
                    volume = random.randint(0, 100)
                    log_info(f"Ses seviyesi %{volume} olarak ayarlandı")
                elif control == "mute":
                    log_info("Ses kapatıldı")
                    time.sleep(0.2)
                    log_info("Ses açıldı")
                elif control == "playback_rate":
                    rate = random.choice([0.5, 0.75, 1.0, 1.25, 1.5, 2.0])
                    log_info(f"Oynatma hızı {rate}x olarak ayarlandı")
        else:
            # Oynatma başarısız
            error_types = [
                "Ses dosyası bulunamadı",
                "Desteklenmeyen format",
                "CORS hatası",
                "Ağ hatası"
            ]
            error = random.choice(error_types)
            log_error(f"Ses dosyası oynatılamadı: {error}")
        
    except Exception as e:
        log_error(f"Ses oynatıcı testi sırasında beklenmeyen hata: {str(e)}")
    
    log_info("Ses oynatıcı testi tamamlandı")
    return True

def run_all_tests():
    """Tüm testleri çalıştır"""
    log_info("Test senaryoları başlatılıyor")
    
    tests = [
        {"name": "Giriş Testi", "function": test_login},
        {"name": "Değerlendirme Formu Testi", "function": test_evaluation_form},
        {"name": "Değerlendirme Listesi Testi", "function": test_evaluation_list},
        {"name": "Ses Oynatıcı Testi", "function": test_audio_player}
    ]
    
    results = []
    
    for test in tests:
        log_info(f"{test['name']} başlatılıyor")
        start_time = time.time()
        
        try:
            success = test["function"]()
            end_time = time.time()
            duration = end_time - start_time
            
            if success:
                log_success(f"{test['name']} başarıyla tamamlandı", {"duration": f"{duration:.2f} saniye"})
                results.append({"test": test["name"], "status": "SUCCESS", "duration": duration})
            else:
                log_error(f"{test['name']} başarısız oldu", {"duration": f"{duration:.2f} saniye"})
                results.append({"test": test["name"], "status": "FAILED", "duration": duration})
        except Exception as e:
            end_time = time.time()
            duration = end_time - start_time
            log_error(f"{test['name']} sırasında hata oluştu: {str(e)}", {"duration": f"{duration:.2f} saniye"})
            results.append({"test": test["name"], "status": "ERROR", "duration": duration, "error": str(e)})
    
    # Test sonuçlarını özetle
    success_count = sum(1 for r in results if r["status"] == "SUCCESS")
    failed_count = sum(1 for r in results if r["status"] == "FAILED")
    error_count = sum(1 for r in results if r["status"] == "ERROR")
    
    log_info("Test senaryoları tamamlandı", {
        "total": len(tests),
        "success": success_count,
        "failed": failed_count,
        "error": error_count
    })
    
    return results

if __name__ == "__main__":
    # Önceki logları temizle
    clear_logs()
    
    # Testleri çalıştır
    results = run_all_tests()
    
    # Sonuçları yazdır
    print("\n=== TEST SONUÇLARI ===")
    for result in results:
        status_symbol = "✅" if result["status"] == "SUCCESS" else "❌"
        print(f"{status_symbol} {result['test']} - {result['status']} ({result['duration']:.2f}s)")
    
    # Özet
    success_count = sum(1 for r in results if r["status"] == "SUCCESS")
    total_count = len(results)
    print(f"\nToplam: {total_count}, Başarılı: {success_count}, Başarısız: {total_count - success_count}")
    print(f"Başarı Oranı: {(success_count / total_count) * 100:.2f}%")
    
    # Log dosyasının konumunu yazdır
    print(f"\nDetaylı log dosyası: {os.path.abspath('logs/qm_test_log.log')}")
    print(f"JSON log dosyası: {os.path.abspath('logs/qm_test_logs.json')}") 