import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ReminderContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin: 2rem auto;
  max-width: 800px;
`;

const ReminderTitle = styled.h2`
  margin-top: 0;
  color: #2c3e50;
`;

const ReminderItem = styled.div`
  color: #34495e;
  margin: 0.5rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DeleteButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c0392b;
  }
`;

const FormContainer = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
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

const formatLocalDate = (dateString) => {
  const [datePart, timePart] = dateString.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  const localDate = new Date(year, month - 1, day, hour, minute);
  return localDate.toLocaleString(undefined, { 
    year: 'numeric', 
    month: 'numeric', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: 'numeric', 
    hour12: true 
  });
};

export default function Reminders() {
  const { user } = useContext(AuthContext);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    message: '',
    date: ''
  });

  const fetchReminders = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reminders`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setReminders(res.data);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      toast.error('Error al obtener recordatorios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchReminders();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/reminders`, formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      toast.success('Recordatorio creado exitosamente');
      fetchReminders();
      setFormData({ message: '', date: '' });
    } catch (error) {
      console.error('Error creating reminder:', error);
      toast.error('Error al crear recordatorio');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/reminders/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      toast.success('Recordatorio eliminado exitosamente');
      fetchReminders();
    } catch (error) {
      console.error('Error deleting reminder:', error);
      toast.error('Error al eliminar recordatorio');
    }
  };

  return (
    <Layout title="Recordatorios de Bienestar" protectedRoute={true}>
      <FormContainer>
        <h1>Crear Recordatorio</h1>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="message">Mensaje</Label>
            <Input
              type="text"
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Ingresa el mensaje del recordatorio"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="date">Fecha y Hora</Label>
            <Input
              type="datetime-local"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <Button type="submit">Crear Recordatorio</Button>
        </Form>
      </FormContainer>

      <ReminderContainer>
        <ReminderTitle>Recordatorios de Bienestar</ReminderTitle>
        {loading ? (
          <p>Cargando recordatorios...</p>
        ) : reminders.length > 0 ? (
          reminders.map((reminder) => (
            <ReminderItem key={reminder._id}>
              {reminder.message} - {formatLocalDate(reminder.date)}
              <DeleteButton style={{ marginLeft: '1rem' }} onClick={() => handleDelete(reminder._id)}>
                Eliminar
              </DeleteButton>
            </ReminderItem>
          ))
        ) : (
          <p>No hay recordatorios.</p>
        )}
      </ReminderContainer>
    </Layout>
  );
}
