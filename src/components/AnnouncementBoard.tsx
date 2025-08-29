'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp, Timestamp, DocumentData } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

type Announcement = {
  id: string;
  message: string;
  authorName: string;
  createdAt: any;
};

export default function AnnouncementBoard() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // 連絡事項をリアルタイムで取得
  useEffect(() => {
    const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'), limit(20));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const announcementsList: Announcement[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as DocumentData;
        return {
          id: docSnap.id,
          message: String(data.message ?? ''),
          authorName: String(data.authorName ?? ''),
          createdAt: (data.createdAt as Timestamp | undefined) ?? null,
        };
      });
      setAnnouncements(announcementsList);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'announcements'), {
        message: newMessage.trim(),
        authorName: user.displayName || user.email?.split('@')[0] || '匿名',
        createdAt: serverTimestamp(),
      } satisfies { message: string; authorName: string; createdAt: ReturnType<typeof serverTimestamp> };
      setNewMessage('');
    } catch (error) {
      console.error('連絡事項の投稿に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: Timestamp | null) => {
    if (!timestamp) return '';
    try {
      const date = timestamp.toDate();
      return date.toLocaleString('ja-JP', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  return (
    <div style={{ 
      background: '#1b1b1b', 
      borderRadius: 12, 
      padding: 20, 
      marginBottom: 24,
      border: '1px solid #2b2b2b'
    }}>
      <h3 style={{ 
        marginBottom: 16, 
        color: '#fff', 
        fontSize: 18,
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }}>
        📢 漫画部全体連絡掲示板
      </h3>

      {/* 新規投稿フォーム */}
      {user && (
        <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="連絡事項を入力..."
              maxLength={200}
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid #444',
                background: '#2b2b2b',
                color: '#fff',
                fontSize: 14
              }}
            />
            <button
              type="submit"
              disabled={loading || !newMessage.trim()}
              style={{
                padding: '10px 16px',
                background: '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: loading || !newMessage.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !newMessage.trim() ? 0.6 : 1,
                fontSize: 14
              }}
            >
              {loading ? '投稿中...' : '投稿'}
            </button>
          </div>
          <div style={{ 
            marginTop: 8, 
            fontSize: 12, 
            color: '#888',
            textAlign: 'right'
          }}>
            {newMessage.length}/200
          </div>
        </form>
      )}

      {/* 連絡事項一覧 */}
      <div style={{ maxHeight: 300, overflowY: 'auto' }}>
        {announcements.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', fontSize: 14 }}>
            まだ連絡事項はありません
          </p>
        ) : (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              style={{
                padding: '12px',
                marginBottom: 12,
                background: '#2b2b2b',
                borderRadius: 8,
                border: '1px solid #3b3b3b'
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: 8
              }}>
                <span style={{ 
                  color: '#007bff', 
                  fontSize: 14, 
                  fontWeight: 'bold' 
                }}>
                  {announcement.authorName}
                </span>
                <span style={{ 
                  color: '#888', 
                  fontSize: 12 
                }}>
                  {formatDate(announcement.createdAt)}
                </span>
              </div>
              <p style={{ 
                color: '#fff', 
                margin: 0, 
                fontSize: 14,
                lineHeight: 1.4,
                wordBreak: 'break-word'
              }}>
                {announcement.message}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
