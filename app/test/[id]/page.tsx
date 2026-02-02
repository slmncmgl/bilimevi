'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';

export default function ContractTestPage() {
  const params = useParams();
  const contractId = params.id as string;
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canAccept, setCanAccept] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [verificationText, setVerificationText] = useState('');
  const [checkboxAccepted, setCheckboxAccepted] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef(Date.now());

  // Time tracker
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll tracker
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      
      const percentage = Math.min(
        Math.round(((scrollTop + windowHeight) / documentHeight) * 100),
        100
      );

      setScrollProgress(percentage);

      if (percentage >= 95 && !canAccept) {
        setCanAccept(true);
        logScrollEvent('reached_bottom', percentage);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [canAccept]);

  // Scroll logging
  const logScrollEvent = async (event: string, percentage: number) => {
    try {
      await fetch('/api/log-scroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractId,
          event,
          scrollPercentage: percentage,
          timeSpent,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Log error:', error);
    }
  };

  const handleAccept = async () => {
    if (!canAccept || !checkboxAccepted || !verificationText.trim()) {
      alert('Lütfen tüm adımları tamamlayın');
      return;
    }

    try {
      await fetch('/api/log-scroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractId,
          event: 'accepted',
          scrollPercentage: scrollProgress,
          timeSpent,
          verificationText,
          timestamp: new Date().toISOString()
        })
      });

      setAccepted(true);
      alert('✓ Sözleşme başarıyla kabul edildi!');
    } catch (error) {
      console.error('Accept error:', error);
      alert('Bir hata oluştu');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Progress Bar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: '#e5e7eb',
        zIndex: 1000
      }}>
        <div style={{
          height: '100%',
          background: '#40E0D0',
          width: `${scrollProgress}%`,
          transition: 'width 0.3s'
        }} />
      </div>

      {/* Progress Info */}
      <div style={{
        position: 'fixed',
        top: '4px',
        left: 0,
        right: 0,
        background: 'white',
        padding: '12px 20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 999,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ fontSize: '14px', fontWeight: '500', color: canAccept ? '#22c55e' : '#6b7280' }}>
          {canAccept ? '✓ Tamamını görüntülediniz' : `İlerleme: %${scrollProgress}`}
        </span>
        <span style={{ fontSize: '12px', color: '#9ca3af' }}>
          Geçen süre: {timeSpent}s
        </span>
      </div>

      {/* Contract Content */}
      <div 
        ref={contentRef}
        style={{
          maxWidth: '900px',
          margin: '80px auto 40px',
          padding: '40px',
          background: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          borderRadius: '8px'
        }}
      >
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold', 
          color: '#40E0D0',
          marginBottom: '20px',
          borderBottom: '3px solid #40E0D0',
          paddingBottom: '15px'
        }}>
          BİLİMEVİ YAZ OKULU PROGRAMI KAYIT SÖZLEŞMESİ
        </h1>

        <div style={{ lineHeight: '1.8', fontSize: '16px', color: '#374151' }}>
          {/* Demo sözleşme içeriği */}
          <p><strong>Contract ID:</strong> {contractId}</p>
          <p><strong>Oluşturulma:</strong> {new Date().toLocaleString('tr-TR')}</p>

          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px' }}>
            1. TARAFLAR
          </h2>
          <p>
            İşbu sözleşme, bir tarafta İstiklal Cad. Mim Han No:55 Kat:2 Beyoğlu İstanbul adresinde mukim 
            Bilimevi Eğitim Danışmanlık A.Ş. ile diğer yanda test kullanıcısı arasında düzenlenmiştir.
          </p>

          {/* Uzun içerik simülasyonu */}
          {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
            <div key={num} style={{ marginTop: '30px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>
                {num}. MADDE
              </h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt 
                ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco 
                laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p style={{ marginTop: '10px' }}>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt 
                mollit anim id est laborum.
              </p>
            </div>
          ))}

          <div style={{ 
            marginTop: '50px', 
            padding: '20px', 
            background: '#fef3c7',
            borderRadius: '8px',
            border: '2px solid #fbbf24'
          }}>
            <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>
              SON HÜKÜMLER
            </p>
            <p>
              İşbu sözleşme 12 madde ve 3 sayfadan ibaret olup, taraflarca okunarak dijital ortamda 
              kabul edilmiştir.
            </p>
          </div>
        </div>
      </div>

      {/* Accept Section */}
      <div style={{
        position: 'sticky',
        bottom: 0,
        background: 'white',
        borderTop: '4px solid #40E0D0',
        padding: '20px',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '15px',
            fontSize: '14px',
            color: canAccept ? '#000' : '#9ca3af',
            cursor: canAccept ? 'pointer' : 'not-allowed'
          }}>
            <input
              type="checkbox"
              checked={checkboxAccepted}
              onChange={(e) => setCheckboxAccepted(e.target.checked)}
              disabled={!canAccept}
              style={{ marginRight: '10px', width: '18px', height: '18px' }}
            />
            Yukarıdaki sözleşmeyi okudum, anladım ve kabul ediyorum
          </label>

          {checkboxAccepted && (
            <input
              type="text"
              placeholder="Onaylamak için tam adınızı yazın"
              value={verificationText}
              onChange={(e) => setVerificationText(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #40E0D0',
                borderRadius: '6px',
                marginBottom: '15px',
                fontSize: '14px'
              }}
            />
          )}

          <button
            onClick={handleAccept}
            disabled={!canAccept || !checkboxAccepted || !verificationText.trim() || accepted}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: 'white',
              background: (canAccept && checkboxAccepted && verificationText.trim() && !accepted) 
                ? '#40E0D0' 
                : '#d1d5db',
              border: 'none',
              borderRadius: '8px',
              cursor: (canAccept && checkboxAccepted && verificationText.trim() && !accepted) 
                ? 'pointer' 
                : 'not-allowed',
              transition: 'all 0.3s'
            }}
          >
            {accepted ? '✓ Kabul Edildi' : 'Sözleşmeyi Kabul Et'}
          </button>
        </div>
      </div>
    </div>
  );
}
