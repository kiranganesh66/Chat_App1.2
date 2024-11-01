import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import logo_chat from "../../src/assets/logo_chat.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { registerRoute } from "../utils/APIRoutes";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Register() {
  const navigate = useNavigate();
  const [value, setvalues] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (localStorage.getItem("chat-aap-user")) {
      navigate("/");
    }
  }, []);

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   if (handleValidation()) {
  //     //   console.log("in Valodation", registerRoute);
  //     const { userName, email, password } = value;
  //     const { data } = await axios.post(registerRoute, {
  //       userName,
  //       email,
  //       password,
  //     });
  //     if (data.status === false) {
  //       toast.error(data.msg, toastOptions);
  //     }
  //     if (data.status === true) {
  //       localStorage.setItem("chat-aap-user", JSON.stringify(data.user));
  //       navigate("/");
  //     }
  //   }
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { userName, email, password } = value;
      try {
        const { data } = await axios.post(registerRoute, {
          userName,
          email,
          password,
        });
        if (data.status === false) {
          toast.error(data.msg, toastOptions);
        } else if (data.status === true) {
          localStorage.setItem("chat-aap-user", JSON.stringify(data.user));
          navigate("/");
        }
      } catch (error) {
        toast.error("An error occurred. Please try again.", toastOptions);
        console.error(error); // Log the error for debugging
      }
    }
  };

  const handleValidation = () => {
    const { userName, email, password, confirmPassword } = value;

    if (password !== confirmPassword) {
      toast.error("Password and confirmPassword Should be same.", toastOptions);
      return false;
    } else if (userName.length < 3) {
      toast.error("UserName should be greater then 3 Characters", toastOptions);
      return false;
    } else if (password.length < 8) {
      toast.error(
        "password  should be greater then 8 Characters",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email  should not be Empty", toastOptions);
      return false;
    }
    return true;
  };

  const handleChange = (event) => {
    setvalues({ ...value, [event.target.name]: event.target.value });
  };

  return (
    <>
      <FromContanier>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={logo_chat} alt="logo" />
            <h1>ChatC</h1>
          </div>
          <input
            type="text"
            placeholder="UserName"
            name="userName"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Create User</button>
          <span>
            Already have an account ? <Link to="/login">Login</Link>
          </span>
        </form>
      </FromContanier>
      <ToastContainer />
    </>
  );
}

const FromContanier = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  img {
    height: 5rem;
    border-radius: 80rem;
  }
  h1 {
    color: white;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #997af0;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    transition: transform 0.7s ease;
    &:hover {
      background-color: #4e0eff;
      transform: rotate(360deg);
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;

export default Register;
