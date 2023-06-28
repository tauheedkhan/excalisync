import * as React from "react";
import { FC, ReactNode, useEffect, useState } from "react";
import { BiMicrophone } from "react-icons/bi";
import { FaHeart } from "react-icons/fa";
import { CgMail } from "react-icons/cg";
import { TbExternalLink, TbVolume } from "react-icons/tb";
import styles from "./Home.module.css";

const KeyboardKey: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className={styles.keyboard}>{children}</div>;
};

const Home: FC = () => {
  const [status, setStatus] = useState(1);

  useEffect(() => {
    chrome.tabs
      .query({ active: true, url: ["http://localhost/*"] })
      .then(([tab]) => {
        setStatus(tab ? 1 : 0);
      });
  }, []);

  const handleLogin = () => {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      if (chrome.runtime.lastError) {
        console.log("Error: ", chrome.runtime.lastError);
        // return;
      }
      console.log("OAuth2 Token: ", token);
    });
  };

  return (
    <div className={styles.container}>
      {status === -1 ? (
        <>...</>
      ) : status === 0 ? (
        <div className={styles.textContainer}>
          <div className={styles.text}>
            This extension is only available Excalidraw.
          </div>
          <button id="exalisyncButton" onClick={handleLogin}>
            SignIn
          </button>
        </div>
      ) : (
        <>
          <div>Usage guide: TBD</div>
        </>
      )}
    </div>
  );
};

export default Home;
