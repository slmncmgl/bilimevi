'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [contractUrl, setContractUrl] = useState('');

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (data.contractId) {
        const url = `${window.location.origin}/test/${data.contractId}`;
        setContractUrl(url);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Yükleme başarısız');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        maxWidth: '500px',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold',
            color: '#40E0D0',
            marginBottom: '10px'
          }}>
            Bilimevi Sözleşme Testi
          </h1>
          <p style={{ color: '#666', fontSize: '14px' }}>
            PDF yükleyin, scroll tracking'i test edin
          </p>
        </div>

        <div style={{
          border: '2px dashed #40E0D0',
          borderRadius: '12px',
          padding: '30px',
          textAlign: 'center',
          marginBottom: '20px',
          background: '#f8ffff'
        }}>
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{
              display: 'block',
              width: '100%',
              padding: '10px',
              marginBottom: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
          
          {file && (
            <p style={{ 
              fontSize: '14px', 
              color: '#40E0D0',
              marginBottom: '15px',
              fontWeight: '500'
            }}>
              ✓ {file.name}
            </p>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            style={{
              width: '100%',
              padding: '15px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: 'white',
              background: file ? '#40E0D0' : '#ccc',
              border: 'none',
              borderRadius: '8px',
              cursor: file ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s'
            }}
          >
            {uploading ? 'Yükleniyor...' : 'Sözleşme Oluştur'}
          </button>
        </div>

        {contractUrl && (
          <div style={{
            padding: '20px',
            background: '#f0fdf4',
            borderRadius: '8px',
            border: '1px solid #86efac'
          }}>
            <p style={{ 
              fontSize: '14px', 
              color: '#15803d',
              marginBottom: '10px',
              fontWeight: '500'
            }}>
              ✓ Sözleşme hazır!
            </p>
            <a 
              href={contractUrl}
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                background: '#22c55e',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Test Sayfasını Aç →
            </a>
          </div>
        )}

        <div style={{
          marginTop: '30px',
          padding: '15px',
          background: '#fef3c7',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#92400e'
        }}>
          <strong>Not:</strong> Bu test ortamıdır. Sözleşme şablonu yüklediğinizde,
          scroll tracking ve kabul mekanizmasını test edebilirsiniz.
        </div>
      </div>
    </div>
  );
}
