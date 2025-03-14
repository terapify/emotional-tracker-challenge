import { useContext, useEffect } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import Header from './Header';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;

const Layout = ({ title, description, children, protectedRoute = false}) => {
  const { user, loading } = useContext(AuthContext);

  const router = useRouter();
  
  useEffect(() => {
    if (protectedRoute && !loading && !user) {
      router.push('/login');
    }
  }, [protectedRoute, loading, user, router]);

  if (protectedRoute && loading) {
    return <p>Cargando...</p>;
  }

  return (
    <>
      <Head>
        <title>{title || 'Emotional Tracker'}</title>
        <meta name="description" content={description || 'Track your emotional wellbeing'} />
        <link rel="icon" href="/favicon.ico" />
        {/* No CSP headers */}
      </Head>

      <Header />
      
      <Main>
        {/* No loading indicator */}
        {children}
      </Main>
    </>
  );
};

export default Layout;