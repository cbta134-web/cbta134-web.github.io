import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import BackButton from '../components/BackButton';

const Creditos = () => {
  const [config, setConfig] = useState(null);
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    const fetchCredits = async () => {
      const { data: configData } = await supabase
        .from('credits_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const { data: authorsData } = await supabase
        .from('credits_authors')
        .select('*')
        .order('order_index', { ascending: true });

      setConfig(configData || null);
      setAuthors(authorsData || []);
    };

    fetchCredits();
  }, []);

  return (
    <div style={{ minHeight: '100vh', padding: '80px 20px 40px', background: '#f8f9fa' }}>
      <BackButton onClick={() => window.history.back()} />
      <div style={{ maxWidth: '1000px', margin: '0 auto', background: 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)' }}>
        <h1 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '10px' }}>
          {config?.title || 'Créditos'}
        </h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
          {config?.subtitle || 'Autores de la página'}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {authors.map((author) => (
            <div key={author.id} style={{ background: '#f8f9fa', borderRadius: '15px', padding: '20px', border: '1px solid #e9ecef' }}>
              <img
                src={author.photo_url || '/images/cbta134.png'}
                alt={author.full_name}
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', marginBottom: '12px' }}
              />
              <h3 style={{ color: '#2c3e50', marginBottom: '6px' }}>{author.full_name}</h3>
              <p style={{ color: '#28a745', fontWeight: 'bold', marginBottom: '8px' }}>{author.career}</p>
              <p style={{ color: '#666', fontSize: '0.95rem' }}>{author.description}</p>
            </div>
          ))}
        </div>

        {config?.license_text && (
          <div style={{ marginTop: '30px', background: '#eef2ff', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ color: '#1e3a8a', marginBottom: '10px' }}>{config?.license_title || 'Licencia'}</h3>
            <p style={{ color: '#374151' }}>{config.license_text}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Creditos;
