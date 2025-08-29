'use client';

import { useEffect, useMemo, useState } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  writeBatch,
  query,
  orderBy,
  getDocs,
} from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/LoginForm';
import AnnouncementBoard from '@/components/AnnouncementBoard';

type Seat = {
  id: string;
  occupied: boolean;
  occupantName: string;
};

export default function Page() {
  const [seats, setSeats] = useState<Seat[]>([]);
  const { user, loading, logout } = useAuth();
  const seatsCol = useMemo(() => (db ? collection(db, 'seats') : null), []);

  // 10席固定の座席データを初期化
  const initializeSeats = async () => {
    if (!db || seats.length > 0) return;
    try {
      const batch = writeBatch(db);
      for (let i = 1; i <= 10; i++) {
        const seatId = `seat-${i.toString().padStart(2, '0')}`;
        const seatRef = doc(db, 'seats', seatId);
        batch.set(seatRef, { occupied: false, occupantName: '' });
      }
      await batch.commit();
      console.log('[seats] initialized');
    } catch (e) {
      console.error('[seats] initialize failed', e);
    }
  };

  // 初回マウント時に空なら初期化（ワンショット）
  useEffect(() => {
    const run = async () => {
      if (!seatsCol) return;
      try {
        const snap = await getDocs(seatsCol);
        if (snap.empty) {
          await initializeSeats();
        }
      } catch (e) {
        console.error('[seats] pre-check failed', e);
      }
    };
    run();
  }, [seatsCol]);

  // リアルタイム購読
  useEffect(() => {
    if (!seatsCol) return;
    
    // ID順に並べる（seat-01, seat-02, ...）
    const q = query(seatsCol, orderBy('__name__'));
    const unsub = onSnapshot(q, (snap) => {
      if (snap.empty) {
        // ドキュメントが存在しない場合は初期化
        initializeSeats();
        return;
      }
      const next: Seat[] = snap.docs.map((d) => {
        const data = d.data() as any;
        return {
          id: d.id,
          occupied: !!data?.occupied,
          occupantName: data?.occupantName ?? '',
        };
      });
      setSeats(next);
    });
    return () => unsub();
  }, [seatsCol]);

  // 着席/退席 トグル
  const toggleSeat = async (s: Seat) => {
    if (!db) return;
    const ref = doc(db, 'seats', s.id);
    if (s.occupied) {
      // 退席
      await updateDoc(ref, { occupied: false, occupantName: '' });
    } else {
      // 着席（名前入力は必須）
      const name = window.prompt('お名前を入力してください', '');
      if (name && name.trim()) {
        await updateDoc(ref, { occupied: true, occupantName: name.trim() });
      }
    }
  };

  // 全席リセット
  const resetAll = async () => {
    if (!db) return;
    const batch = writeBatch(db);
    seats.forEach((s) => {
      const ref = doc(db, 'seats', s.id);
      batch.update(ref, { occupied: false, occupantName: '' });
    });
    await batch.commit();
  };

  // 使用中席数と総席数
  const occupiedCount = seats.filter(s => s.occupied).length;
  const totalSeats = 10;

  // 使用中の部員名一覧
  const occupiedMembers = seats
    .filter(s => s.occupied && s.occupantName)
    .map(s => s.occupantName);

  // ローディング中
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: '#fff',
        fontSize: 18
      }}>
        読み込み中...
      </div>
    );
  }

  // 未ログイン時はログインフォームを表示
  if (!user) {
    return <LoginForm />;
  }

  // ログイン済み時はメイン画面を表示
  return (
    <main style={{ padding: 24, color: '#eee', fontFamily: 'system-ui, sans-serif' }}>
      {/* ヘッダー */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 24,
        paddingBottom: 16,
        borderBottom: '1px solid #333'
      }}>
        <div>
          <h1 style={{ fontSize: 24, margin: 0, color: '#fff' }}>
            📚 漫画部屋管理システム
          </h1>
          <p style={{ margin: '8px 0 0 0', fontSize: 14, color: '#888' }}>
            ようこそ、{user.displayName || user.email?.split('@')[0] || 'メンバー'}さん
          </p>
        </div>
        <button
          onClick={logout}
          style={{
            padding: '8px 16px',
            background: '#dc3545',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14
          }}
        >
          ログアウト
        </button>
      </div>

      {/* 座席状況サマリー */}
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
          📊 座席状況サマリー
        </h3>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 16
        }}>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#7CFC99' }}>
            {occupiedCount}/{totalSeats}席使用中
          </div>
          <button
            onClick={resetAll}
            style={{
              padding: '8px 16px',
              background: '#6c757d',
              color: '#fff',
              border: '1px solid #555',
              cursor: 'pointer',
              fontSize: 14
            }}
          >
            全席リセット
          </button>
        </div>

        {/* 使用中の部員名一覧 */}
        {occupiedMembers.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <h4 style={{ 
              marginBottom: 12, 
              color: '#ccc', 
              fontSize: 16 
            }}>
              🧑‍🤝‍🧑 現在使用中の部員
            </h4>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 8 
            }}>
              {occupiedMembers.map((name, index) => (
                <span
                  key={index}
                  style={{
                    padding: '6px 12px',
                    background: '#28a745',
                    color: '#fff',
                    borderRadius: 20,
                    fontSize: 14,
                    fontWeight: 'bold'
                  }}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 全体連絡掲示板 */}
      <AnnouncementBoard />

      {/* 座席一覧 */}
      <div style={{ 
        background: '#1b1b1b', 
        borderRadius: 12, 
        padding: 20,
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
          🪑 座席一覧
        </h3>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 12
        }}>
          {seats.map((s) => (
            <div
              key={s.id}
              onClick={() => toggleSeat(s)}
              title={s.occupied ? `使用中: ${s.occupantName}（クリックで退席）` : '空席（クリックで着席）'}
              style={{
                padding: '16px',
                borderRadius: 10,
                background: s.occupied ? '#2b2b2b' : '#1b1b1b',
                border: `2px solid ${s.occupied ? '#ff6b6b' : '#7CFC99'}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center'
              }}
            >
              <div style={{ 
                fontSize: 18, 
                fontWeight: 'bold', 
                marginBottom: 8,
                color: s.occupied ? '#ff6b6b' : '#7CFC99'
              }}>
                {s.id}
              </div>
              <div style={{ 
                fontSize: 16,
                color: s.occupied ? '#fff' : '#888',
                marginBottom: 8
              }}>
                {s.occupied ? '使用中' : '空席'}
              </div>
              {s.occupied && s.occupantName && (
                <div style={{ 
                  fontSize: 14,
                  color: '#007bff',
                  fontWeight: 'bold'
                }}>
                  {s.occupantName}
                </div>
              )}
            </div>
          ))}
        </div>

        {seats.length === 0 && (
          <p style={{ 
            textAlign: 'center', 
            color: '#888', 
            fontSize: 14,
            padding: '20px 0'
          }}>
            座席データを初期化中...
            <br/>
            しばらく経っても表示されない場合は、下のボタンで手動初期化してください。
            <br/>
            <button
              onClick={initializeSeats}
              style={{
                marginTop: 12,
                padding: '8px 12px',
                borderRadius: 8,
                background: '#007bff',
                color: '#fff',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              座席を手動初期化
            </button>
          </p>
        )}

        <p style={{ marginTop: 16, fontSize: 12, opacity: 0.6 }}>
          ※ 座席をクリックすると着席/退席を切り替えできます。
        </p>
      </div>
    </main>
  );
}
