import { createContext, useState } from "react";
import Cookie from "js-cookie";
import axios from "axios";

const API_URL = "http://localhost:5050/api";

export const ReminderContext = createContext();

export const ReminderProvider = ({ children }) => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);

  const getReminders = async (serverToken) => {
    try {
      setLoading(true);
      const token = serverToken || Cookie.get("token");

      if (!token) {
        setReminders([]);
        return;
      }

      const res = await axios.get(`${API_URL}/reminders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const fetchedReminders = res.data;
      setReminders(fetchedReminders);
      return fetchedReminders;
    } catch (error) {
      console.error("Error fetching reminders: ", error);
      setReminders([]);
      return [];
    } finally {
      setLoading(false);
    }
  }; 

  const addReminder = async (reminderData) => {
    try {
      setLoading(true);
      const token = Cookie.get("token");
      if (!token) {
        setLoading(false);
        return;
      }
      const res = await axios.post(`${API_URL}/reminders`, reminderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReminders((prev) => [res.data, ...prev]);
    } catch (error) {
      console.error("Error adding reminder: ", error);
    } finally {
      setLoading(false);  
    }
  };

  const deleteReminder = async (id) => {
    try {
      const token = Cookie.get("token");
      if (!token) {
        return;
      }
      const res = await axios.delete(`${API_URL}/reminders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReminders((prev) => prev.filter((reminder) => reminder._id !== id));
    } catch (error) {
      console.error("Error deleting reminder: ", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ReminderContext.Provider value={{ reminders, loading, getReminders, addReminder, deleteReminder }}>
      {children}
    </ReminderContext.Provider>
  );
};

export async function getServerSideProps(context) {
  const token = context.req.cookies.token;

  try {
    const reminders = await getReminders(token);
    return {
      props: {
        initialReminders: reminders,
      },
    };
  } catch (error) {
    return {
      props: {
        initialReminders: [],
      },
    };
  }
};