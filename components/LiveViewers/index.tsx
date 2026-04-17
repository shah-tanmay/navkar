import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import api from '../../lib/axios';
import { nanoid } from 'nanoid';

const pulse = keyframes`
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(10, 191, 105, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(10, 191, 105, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(10, 191, 105, 0); }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f0fdf4;
  border: 1px solid #dcfce7;
  padding: 8px 16px;
  border-radius: 50px;
  width: fit-content;
  margin: 10px 0;
  font-size: 0.9rem;
  color: #166534;
  font-weight: 500;
  transition: all 0.3s ease;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  background-color: #10b981;
  border-radius: 50%;
  animation: ${pulse} 2s infinite;
`;

interface LiveViewersProps {
  productId: string;
}

export const LiveViewers: React.FC<LiveViewersProps> = ({ productId }) => {
  const [count, setCount] = useState<number>(0);
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('live_session_id');
      if (!id) {
        id = nanoid();
        localStorage.setItem('live_session_id', id);
      }
      return id;
    }
    return '';
  });

  useEffect(() => {
    if (!productId || !sessionId) return;

    // 1. Initial heartbeat and fetch
    const sendHeartbeat = async () => {
      try {
        await api.post('/tracking/heartbeat', { productId, sessionId });
      } catch (e) {
        // Silently fail
      }
    };

    const fetchCount = async () => {
      try {
        const res = await api.get(`/tracking/viewers/${productId}`);
        setCount(res.data.count);
      } catch (e) {
        // Silently fail
      }
    };

    sendHeartbeat();
    fetchCount();

    // 2. Continuous heartbeat (every 45s) and polling (every 30s)
    const heartbeatTimer = setInterval(sendHeartbeat, 45000);
    const pollTimer = setInterval(fetchCount, 30000);

    return () => {
      clearInterval(heartbeatTimer);
      clearInterval(pollTimer);
    };
  }, [productId, sessionId]);

  // Only show if more than 2 people are viewing
  if (count <= 2) return null;

  return (
    <Container>
      <Dot />
      <span>{count} people viewed this in the last 10 minutes</span>
    </Container>
  );
};
