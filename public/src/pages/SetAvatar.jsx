import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Buffer } from "buffer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { setAvatarRoute } from "../utils/APIRoutes";
import { useNavigate } from "react-router-dom";
import loader from "../assets/loader.gif";

export default function SetAvatar() {
  const api = "https://api.multiavatar.com";
  const navigate = useNavigate();
  const [avatars, setAvatar] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setselectedAvatar] = useState(undefined);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please Select an avatar", toastOptions);
    } else {
      const user = await JSON.parse(localStorage.getItem("chat-aap-user"));
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("chat-aap-user", JSON.stringify(user));
        navigate("/");
      } else {
        
        toast.error("Error setting Avatar. Please try again", toastOptions);
      }
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("chat-aap-user")) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const fetchAvatars = async () => {
      const data = [];
      for (let i = 0; i < 4; i++) {
        const image = await axios.get(
          `${api}/${Math.round(Math.random() * 1000)}`
        );
        const buffer = Buffer.from(image.data);
        // console.log(buffer);
        data.push(buffer.toString("base64"));
      }
      setAvatar(data);
      setIsLoading(false);
    };
    fetchAvatars();
  }, []);

  return (
    <>
      {isLoading ? (
        <Contanier>
          {" "}
          <img src={loader} className="loader" alt="loader" />
        </Contanier>
      ) : (
        <Contanier>
          <div className="title-contanier">
            <h1>Pick an avatar as your profile picture</h1>
          </div>

          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  key={index}
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    onClick={() => setselectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
          <button className="submit-btn" onClick={setProfilePicture}>
            Set as Profile Picture
          </button>
        </Contanier>
      )}
      <ToastContainer />
    </>
  );
}

const Contanier = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  gap: 3rem;
  background-color: #131324;
  .loader {
    max-inline-size: 100%;
  }

  .title-contanier h1 {
    color: white;
  }

  .avatars {
    display: flex;
    gap: 2rem;
  }

  .avatar {
    border: 0.4rem solid transparent;
    padding: 0.4rem;
    border-radius: 50%;
    transition: 0.5s ease-in-out;
    img {
      height: 6rem;
    }
  }

  .selected {
    border: 0.4rem solid #4e0eff;
  }

  .submit-btn {
    background-color: #997af0;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    transition: 0.7s ease-in-out;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;
