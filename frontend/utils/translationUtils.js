export const translate = (emotion) => {
  const translations = {
    happy: "Feliz",
    sad: "Triste",
    angry: "Enojado",
    anxious: "Ansioso",
    neutral: "Neutral"  
  };
  return translations[emotion] || emotion;
};

export const useEmotionTranslation = () => { 
  const translateEmotion = (emotion) => {
    return translate(emotion);
  };
  return { translateEmotion };
}
