import { useState, useContext } from 'react';
import styled from 'styled-components';
import { EmotionContext } from '../context/EmotionContext';

const TrackerContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  margin-top: 0;
  color: #2c3e50;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: bold;
  color: #34495e;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const RangeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const RangeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Range = styled.input`
  width: 100%;
`;

const TextArea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
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

const EmotionTracker = () => {
  const [form, setForm] = useState({
    emotion: 'neutral',
    intensity: 5,
    notes: ''
  });
  
  const { addEmotion } = useContext(EmotionContext);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  
  const validateForm = () => {
    if (!form.emotion || !form.notes) {
      return false;
    }
    
    if (!form.intensity || form.intensity < 1 || form.intensity > 10) {
      return false;
    }
    
    return true;
  };
  
  const isFormValid = validateForm();
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if(!isFormValid) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    addEmotion({
      emotion: form.emotion,
      intensity: Number(form.intensity),
      notes: form.notes
    });
    
    // Reset form
    setForm({
      emotion: 'neutral',
      intensity: 5,
      notes: ''
    });
  };
  
  return (
    <TrackerContainer>
      <Title>¿Cómo te sientes hoy?</Title>
      
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="emotion">Emoción</Label>
          <Select
            id="emotion"
            name="emotion"
            value={form.emotion}
            onChange={handleChange}
          >
            <option value="happy">Feliz</option>
            <option value="sad">Triste</option>
            <option value="angry">Enojado</option>
            <option value="anxious">Ansioso</option>
            <option value="neutral">Neutral</option>
          </Select>
        </InputGroup>
        
        <InputGroup>
          <Label htmlFor="intensity">Intensidad</Label>
          <RangeContainer>
            <Range
              type="range"
              id="intensity"
              name="intensity"
              min="1"
              max="10"
              value={form.intensity}
              onChange={handleChange}
            />
            <RangeLabels>
              <span>Baja</span>
              <span>{form.intensity}</span>
              <span>Alta</span>
            </RangeLabels>
          </RangeContainer>
        </InputGroup>
        
        <InputGroup>
          <Label htmlFor="notes">Notas</Label>
          <TextArea
            id="notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="¿Qué desencadenó esta emoción? ¿Algún pensamiento o reflexión?"
          />
        </InputGroup>
        
        <Button type="submit">Registrar Emoción</Button>
      </Form>
    </TrackerContainer>
  );
};

export default EmotionTracker;