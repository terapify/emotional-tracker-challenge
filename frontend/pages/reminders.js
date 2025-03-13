import { useRouter } from "next/router";
import { useEffect, useContext } from "react";
import styled from "styled-components";
import Layout from "../components/Layout";
import { AuthContext } from "../context/AuthContext";
import ReminderForm from "../components/reminders/ReminderForm";
import RemindersList from "../components/reminders/RemindersList";

const Title = styled.h1`
  color: #2c3e50;
`;

const RemindersContainer = styled.div`
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #f8f9fa;
`;

const Reminders = () => {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();


  // Basic auth protection
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <Layout title="Recordatorios - Terapia Emocional">
        <p>Cargando...</p>
      </Layout>
    );
  }

  return (
    <Layout title="Recordatorios - Terapia Emocional">
      <RemindersContainer>
        <Title>Recordatorios</Title>
        
        <ReminderForm />
        <RemindersList />

      </RemindersContainer>
    </Layout>
  );
}

export default Reminders;