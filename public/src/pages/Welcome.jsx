import React from "react";
import styled from "styled-components";
import robot from "../assets/robot.gif";

export default function Welcome({ currentUser }) {
  //console.log("currentUser", currentUser.userName);
  return (
    <Contanier>
      <img src={robot} alt="Robot" />
      <h1>
        Welcome, <span>{currentUser ? currentUser.userName : "Guest"}!</span>
      </h1>
      <h3>Please select a chat to Start Messaging</h3>
    </Contanier>
  );
}

const Contanier = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white;
  img {
    height: 20rem;
  }
  span {
    color: #4e00ff;
  }
`;
