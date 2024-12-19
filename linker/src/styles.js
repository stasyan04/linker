import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #141414;
  }
`;

const colors = {
  primary: "#636363",
  secondary: "#3b3b3b",
  dark: "#222222",
  darker: "#141414",
  darkest: "#000000",
  light: "#8b8b8b",
  white: "#ffffff",
  error: "#dc2626",
};

export const Container = styled.div`
  min-height: 100vh;
  background-color: ${colors.darker};
  padding: 2rem 1rem;
  color: ${colors.white};
`;

export const Card = styled.div`
  max-width: ${(props) => props.$maxWidth || "32rem"};
  margin: 2rem auto;
  padding: 1.5rem;
  background: ${colors.dark};
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  border: 1px solid ${colors.secondary};
`;

export const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${colors.white};
  letter-spacing: -0.025em;
`;

export const Subtitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${colors.white};
`;

export const Button = styled.button`
  background-color: ${(props) =>
    props.$variant === "danger" ? colors.error : colors.primary};
  color: ${colors.white};
  padding: ${(props) => props.$padding || "0.625rem 1.25rem"};
  border-radius: 0.5rem;
  width: ${(props) => (props.$fullWidth ? "100%" : "auto")};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.025em;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: ${(props) =>
      props.$variant === "danger" ? "#b91c1c" : colors.secondary};
    transform: translateY(-1px);
  }
`;

export const LinkButton = styled.button`
  color: ${colors.primary};
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: ${colors.white};
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

export const Label = styled.label`
  display: block;
  color: ${colors.white};
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
`;

export const Input = styled.input`
  width: 90%;
  padding: 0.625rem 0.875rem;
  border: 1px solid ${colors.secondary};
  border-radius: 0.5rem;
  outline: none;
  font-size: 0.875rem;
  background: ${colors.darker};
  color: ${colors.white};
  transition: all 0.2s ease;

  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 2px rgba(99, 99, 99, 0.2);
  }

  &::placeholder {
    color: ${colors.primary};
  }
`;

export const Form = styled.form`
  display: ${(props) => (props.$layout === "horizontal" ? "flex" : "block")};
  gap: 1rem;
`;

export const ErrorText = styled.span`
  color: ${colors.error};
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
`;

export const UrlCard = styled.div`
  padding: 1rem;
  border: 1px solid ${colors.secondary};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${(props) =>
    props.$selected ? colors.secondary : "transparent"};

  &:hover {
    background: ${colors.secondary};
  }
`;

export const UrlCardContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const UrlText = styled.p`
  color: ${(props) => (props.$isSmall ? colors.light : colors.white)};
  font-size: ${(props) => (props.$isSmall ? "0.875rem" : "1rem")};
  margin: ${(props) => (props.$isSmall ? "0.25rem 0 0" : "0")};
  word-break: break-all;
`;

export const ExternalLinkStyled = styled.a`
  color: ${colors.primary};
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 4px;

  &:hover {
    color: ${colors.white};
    background: ${colors.secondary};
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const Section = styled.div`
  margin-bottom: 2rem;
`;

export const UrlList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ChartWrapper = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid ${colors.secondary};
  border-radius: 0.5rem;
  overflow-x: auto;
  background: ${colors.darker};
`;

export const LoadingSpinner = styled.div`
  border: 3px solid ${colors.secondary};
  border-top: 3px solid ${colors.primary};
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  margin: 0 auto;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
