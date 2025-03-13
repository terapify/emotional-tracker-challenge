import { createContext, useState } from "react";
import Cookie from "js-cookie";
import axios from "axios";

// API URL
const API_URL = "http://localhost:5050/api";

export const EmotionContext = createContext();

export const EmotionProvider = ({ children }) => {
  const [emotions, setEmotions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get all emotions (client-side only, not using getServerSideProps)
  // TODO: Implement server-side fetching
  const getEmotions = async (serverToken) => {
    try {
      setLoading(true);
      const token = serverToken || Cookie.get("token");

      if (!token) {
        setEmotions([]);
        return;
      }

      const res = await axios.get(`${API_URL}/emotions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const fetchedEmotions = res.data;
      setEmotions(fetchedEmotions);
      return fetchedEmotions;
    } catch (error) {
      console.error("Error fetching emotions: ", error);
      setEmotions([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Add a new emotion entry (frontend only, not connected to backend)
  const addEmotion = async (emotionData) => {
    try {
      const token = Cookie.get("token");
      if (!token) {
        setLoading(false);
        return;
      }
      const res = await axios.post(`${API_URL}/emotions`, emotionData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmotions((prev) => [res.data, ...prev]);
    } catch (error) {
      console.error("Error adding emotion");
    } finally {
      setLoading(false);
    }
  };

  const shareWithTherapist = async (emotionIds) => {
    // TODO: Implement sharing with therapist
    console.log("Sharing emotions with therapist:", emotionIds);
  };

  return (
    <EmotionContext.Provider
      value={{
        emotions,
        loading,
        getEmotions,
        addEmotion,
        shareWithTherapist,
      }}
    >
      {children}
    </EmotionContext.Provider>
  );
};

export async function getServerSideProps(context) {
  const token = context.req.cookies.token;

  try {
    const emotions = await getEmotions(token);
    return {
      props: {
        initialEmotions: emotions,
      },
    };
  } catch (error) {
    return {
      props: {
        initialEmotions: [],
      },
    };
  }
}
