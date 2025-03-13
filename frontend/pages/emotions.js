import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Layout from '../components/Layout';
import EmotionTracker from '../components/emotions/EmotionTracker';
import EmotionHistory from '../components/emotions/EmotionHistory';
import { AuthContext } from '../context/AuthContext';

const EmotionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Title = styled.h1`
  color: #2c3e50;
`;

export default function Emotions() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  
  // Basic auth protection
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);
  
  if (loading || !user) {
    return (
      <Layout title="Emociones - Terapia Emocional">
        <p>Cargando...</p>
      </Layout>
    );
  }
  
  return (
    <Layout title="Emociones - Terapia Emocional">
      <EmotionsContainer>
        <Title>Seguimiento Emocional</Title>
        
        <EmotionTracker />
        <EmotionHistory />
        
        {/* TODO: Add functionality to share emotions with therapist */}
      </EmotionsContainer>
    </Layout>
  );
}