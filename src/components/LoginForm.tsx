'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // モック認証（実際の認証は行わない）
      const username = email.split('@')[0] || 'User';
      login(username, email);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'ログインに失敗しました';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: 400, 
      margin: '40px auto', 
      padding: 24, 
      background: '#1b1b1b', 
      borderRadius: 12,
      border: '1px solid #2b2b2b'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24, color: '#fff' }}>
        漫画部屋管理システム
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, color: '#ccc' }}>
            メールアドレス
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 8,
              border: '1px solid #444',
              background: '#ffffff',
              color: '#000000',
              fontSize: 16
            }}
            placeholder="example@email.com"
          />
        </div>
        
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 8, color: '#ccc' }}>
            パスワード
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 8,
              border: '1px solid #444',
              background: '#ffffff',
              color: '#000000',
              fontSize: 16
            }}
            placeholder="パスワードを入力"
          />
        </div>
        
        {error && (
          <div style={{ 
            marginBottom: 16, 
            padding: '12px', 
            background: '#ff4444', 
            color: '#fff', 
            borderRadius: 8,
            fontSize: 14
          }}>
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            background: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 16,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>
      
      <p style={{ 
        marginTop: 24, 
        textAlign: 'center', 
        fontSize: 14, 
        color: '#888',
        lineHeight: 1.5
      }}>
        漫画部メンバーのみアクセス可能です<br/>
        アカウント情報は管理者にお問い合わせください
      </p>
    </div>
  );
}
