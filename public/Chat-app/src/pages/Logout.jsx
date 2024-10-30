import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { BiPowerOff } from "react-icons/bi";

export default function Logout() {
  const navigate = useNavigate();

  const handleClick = async () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Button onClick={handleClick}>
      <BiPowerOff className="power-icon" />
    </Button>
  );
}

const Button = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  cursor: pointer;
  border: none;
  
  background-color: #9a86f3;
  border-radius: 0.5rem;
  svg{
    font-size: 1.3rem;
    color: #ebe7ff;
  }
  /* .power-icon {
    color: white;
    font-size: 1.5rem;
  } */
  &:hover {
    background-color: #ff6666;
  }
`;
