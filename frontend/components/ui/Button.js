import styled from "styled-components";

const CtaButton = styled.button`
  background-color: #3CABDB;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &.outline-button {
    background-color: white;
    color: #3CABDB;
    border: 1px solid #3CABDB;

    &:hover {
      background-color: #3CABDB;
      color: white;
    }
  }
  
  &:hover {
    background-color: #2980b9;
  }
`;

export const Button = ({ children, onClick, className, ...props }) => {
  return (
    <CtaButton onClick={onClick} className={className} {...props}>
      {children}
    </ CtaButton>
  );
};