import { createContext, useState } from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';

// API URL
const API_URL = 'http://localhost:5050/api';

export const EmotionContext = createContext();

export const EmotionProvider = ({ children }) => {
  const [emotions, setEmotions] = useState([]);
  const [loading, setLoading] = useState(false);

  const getEmotions = async () => {
    try {
      setLoading(true);
      const token = Cookie.get('token');
      
      if (!token) {
        setEmotions([]);
        setLoading(false);
        return;
      }
      
      const res = await axios.get(`${API_URL}/emotions`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setEmotions(res.data);
    } catch (error) {
      console.error('Error fetching emotions', error);
    } finally {
      setLoading(false);
    }
  };

  
  const addEmotion = async (emotionData) => {
    try {
      const token = Cookie.get('token');
      const res = await axios.post(`${API_URL}/emotions`, emotionData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEmotions(prev => [res.data, ...prev]);
    } catch (error) {
      console.error('Error adding emotion', error);
    }
  };

  const shareWithTherapist = async (emotionIds) => {
    try {
      const token = Cookie.get('token');
      const res = await axios.post(`${API_URL}/therapists/share`, { emotionIds }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Shared with therapist:', res.data);
    } catch (error) {
      console.error('Error sharing emotions with therapist', error);
    }
  };

  return (
    <EmotionContext.Provider
      value={{
        emotions,
        loading,
        getEmotions,
        addEmotion,
        shareWithTherapist
      }}
    >
      {children}
    </EmotionContext.Provider>
  );
};