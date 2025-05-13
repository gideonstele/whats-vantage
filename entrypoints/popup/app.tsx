import { StyledContainer } from './components/container.styled';
import { Header } from './components/header';
import { WhatsAppButton } from './components/whatsapp-button';

export function App() {
  return (
    <StyledContainer>
      <Header title="Whats Vantage" />
      <WhatsAppButton />
    </StyledContainer>
  );
}

export default App;
