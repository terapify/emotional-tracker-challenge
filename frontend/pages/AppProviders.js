import { EmotionProvider } from "../context/EmotionContext";
import { ReminderProvider } from "../context/ReminderContext";
import { AuthProvider } from "../context/AuthContext";
const combineProviders = (providers) => {
  return providers.reduce((AccumulatedComponents, CurrentComponent) => {
    return ({ children }) => {
      return (
        <AccumulatedComponents>
          <CurrentComponent>{children}</CurrentComponent>
        </AccumulatedComponents>
      )
    }
  }, ({ children }) => children);
};

const appProviders = [
  EmotionProvider,
  ReminderProvider,
  AuthProvider,
];

export default combineProviders(appProviders);