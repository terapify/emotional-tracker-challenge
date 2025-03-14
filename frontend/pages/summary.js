import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import styled from 'styled-components';
import EmotionResume from '../components/emotions/EmotionResume';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';

const EmotionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Title = styled.h1`
  color: #2c3e50;
`;

const Summary = () => {
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
      <Layout title="Resumen de emociones - Terapia Emocional">
        <p>Cargando...</p>
      </Layout>
    );
  }
  
  return (
    <Layout title="Resumen de emociones - Terapia Emocional">
      <EmotionsContainer>
        <Title>Resumen de emociones</Title>
        
        <EmotionResume />
        
      </EmotionsContainer>
    </Layout>
  );
}

export default Summary;