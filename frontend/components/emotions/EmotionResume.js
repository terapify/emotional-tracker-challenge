import { useContext, useEffect } from "react";
import styled from "styled-components";
import { EmotionContext } from "../../context/EmotionContext";
import { useEmotionTranslation } from "../../utils/translationUtils";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "../ui/Button";

const EmotionResumeContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const Title = styled.h2`
  margin-top: 0;
  color: #2c3e50;
`;

const EmotionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const EmotionItem = styled.div`
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 1rem;

  h3 {
    margin: 0;
  }
`;

const EmptyState = styled.p`
  color: #7f8c8d;
  text-align: center;
  font-style: italic;
`;

const SummaryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const EmotionResume = () => {
  const { user } = useContext(AuthContext);
  const { loading, getEmotionsSummary, emotionsSummary } =
    useContext(EmotionContext);

  const { translateEmotion } = useEmotionTranslation();

  useEffect(() => {
    getEmotionsSummary();
  }, []);

  const handleShareWithTherapist = () => {
    alert("Compartir con mi terapeuta está en progreso, mantente atento a v2!");
  };

  return (
    <EmotionResumeContainer>
      <SummaryHeader>
        <Title>Mis emociones</Title>
        {!emotionsSummary ||
        !emotionsSummary.emotions ||
        emotionsSummary.emotions.length > 0 ||
        !user.hasTherapist ? (
          <Button className="outline-button" onClick={handleShareWithTherapist}>
            Compartir con mi terapeuta
          </Button>
        ) : (
          ""
        )}
      </SummaryHeader>
      {loading ? (
        <p>Cargando...</p>
      ) : !emotionsSummary || !emotionsSummary.emotions ? (
        <EmptyState>No se pudo cargar el resumen de emociones.</EmptyState>
      ) : emotionsSummary.emotions.length === 0 ? (
        <EmptyState>No hay emociones registradas aún.</EmptyState>
      ) : (
        <EmotionList>
          {emotionsSummary.emotions.map((emotion) => (
            <EmotionItem key={emotion.name}>
              Se han registrado &nbsp; <strong>{emotion.count}</strong>
              &nbsp;emociones de tipo &nbsp;
              <strong>{translateEmotion(emotion.name)}</strong>
            </EmotionItem>
          ))}
        </EmotionList>
      )}
    </EmotionResumeContainer>
  );
};

export default EmotionResume;
