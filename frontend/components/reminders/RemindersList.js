import styled from "styled-components";
import { useContext, useState, useEffect } from "react";
import { ReminderContext } from "../../context/ReminderContext";

const RemindersContainer = styled.div`
  border-radius: 8px;
  padding: 1rem 0;
  margin-top: 1rem;
`;

const RemindersListComponent = styled.ul`
  list-style: none;
  padding: 0;
  `;
  
const EmptyState = styled.p`
  color: #7f8c8d;
  text-align: center;
  font-style: italic;
`;

const ReminderItem = styled.li`
  background: white;
  margin: 10px 0;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const DeleteButton = styled.button`
  background: red;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: darkred;
  }
`;

const RemindersList = () => {
  const { loading, reminders, getReminders, deleteReminder } = useContext(ReminderContext);

  const removeActivity = async (id) => {
    await deleteReminder(id);
  };

  useEffect(() => {
    getReminders();
  }, []);

  return (
    <RemindersContainer>
      {loading ? (
        <p>Cargando...</p>
      ) : reminders.length === 0 ? (
        <EmptyState>
          No hay recordatorios aún. ¡Comienza a crear recordatorios arriba!
        </EmptyState>
      ) : (
        <RemindersListComponent>
          {reminders.map((item) => (
            <ReminderItem key={item._id}>
              {item.activity} - {item.repeat} a las {item.time}hrs
              <DeleteButton onClick={() => removeActivity(item._id)}>
                X
              </DeleteButton>
            </ReminderItem>
          ))}
        </RemindersListComponent>
      )}
    </RemindersContainer>
  );
};

export default RemindersList;
