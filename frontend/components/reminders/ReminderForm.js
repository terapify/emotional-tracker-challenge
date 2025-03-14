
import { useContext, useState } from "react";
import styled from "styled-components";
import { ReminderContext } from "../../context/ReminderContext";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  background-color: #3cabdb;
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

const ReminderForm = () => {
  const { addReminder } = useContext(ReminderContext);

  const [form, setForm] = useState({
    activity: "",
    time: "",
    repeat: "",
  });
  
  
  const activityOptions = [
    "Meditation",
    "Exercise",
    "Reading",
    "Journaling",
    "Stretching",
  ];

  const reminderRepeatOptions = [
    "Daily",
    "Weekly",
    "Monthly",
    "Yearly",
  ];

  const validateForm = () => {
    if (!form.activity || !form.time) {
      return false;
    }
    return true;
  };

  const isFormValid = validateForm();

  const createReminder = (e) => {
    e.preventDefault();
    if (!isFormValid) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    const reminderData = {
      activity: form.activity,
      time: form.time,
      repeat: form.repeat,
    };

    addReminder(reminderData);
    setForm({ activity: "", time: "", repeat: "" });
  };

  return (
    <Form onSubmit={createReminder}>
      <Select
        value={form.activity}
        onChange={(e) => setForm({ ...form, activity: e.target.value })}
      >
        <option value="" disabled>
          Select an activity
        </option>
        {activityOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
    
      <Select
        value={form.repeat}
        onChange={(e) => setForm({ ...form, repeat: e.target.value })}
      >
        {reminderRepeatOptions.map((option) => (
          <option key={option} value={option}>  
            {option}
          </option>
        ))}
      </Select>
      
      <Input
        type="time"
        value={form.time}
        onChange={(e) => setForm({ ...form, time: e.target.value })}
      />
      <Button type="submit">Agregar Recordatorio</Button>
    </Form>
  );
};

export default ReminderForm;
