import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const FormContainer = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const Title = styled.h1`
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: bold;
  color: #34495e;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  background-color: #3CABDB;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: 1rem;
  
  a {
    color: #3498db;
    text-decoration: underline;
    cursor: pointer;
  }
`;

export default function Share() {
  const [formData, setFormData] = useState({ therapistId: '' });
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/therapists/share`, 
        { therapistId: formData.therapistId },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );
      alert('Datos compartidos con éxito');
      router.push('/dashboard');
    } catch (error) {
      console.error('Share error:', error.response?.data?.message || error.message);
      alert('Error al compartir datos');
    }
  };

  return (
    <Layout title="Compartir con Terapeuta" protectedRoute={true}>
      <FormContainer>
        <Title>Compartir Datos con Terapeuta</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="therapistId">ID o Email del Terapeuta</Label>
            <Input
              type="text"
              id="therapistId"
              name="therapistId"
              value={formData.therapistId}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <Button type="submit">Compartir</Button>
        </Form>
        <LinkText>
          Volver al <a onClick={() => router.push('/dashboard')}>Panel</a>
        </LinkText>
      </FormContainer>
    </Layout>
  );
}
