import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { CgProfile } from "react-icons/cg";
import styles from "./Profile.module.css";
import Home from "../Home/Home";
import { getProfile, initialiseDrive } from "../../utils/googleApis";
import Sidebar from "../SideBar";
import Loader from "../Loader";

declare global {
  interface Window {
    gapi: any;
  }
}

function Profile() {
  const [isSignedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [img, setImg] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  const handleLogin = async () => {
    setLoading(true);
    let accesToken = null;
    await chrome.runtime.sendMessage(
      { message: "authenticate" },
      async function (response) {
        console.log("handle response ", response);
        accesToken = response.token;
        setAccessToken(accesToken);
        const profileInfo = await getProfile(accesToken);
        setLoading(false);
        setSignedIn(true);
        setEmail(profileInfo.email);
        setImg(profileInfo.picture);
        localStorage.setItem("excaliSyncAuth", accesToken);
        console.log("profileInfo ", profileInfo);
      }
    );
  };

  useEffect(() => {
    if (isSignedIn) {
      initialiseDrive(accessToken);
    }
  }, [isSignedIn]);

  useEffect(() => {
    const auth = localStorage.getItem("excaliSyncAuth");
    if (auth) {
      handleLogin();
    }
  }, []);

  return (
    <>
      {isSignedIn ? (
        <div onClick={() => setIsOpen(true)}>
          <img className={styles.authPic} src={img} alt="profile picture" />
        </div>
      ) : (
        <div
          title="Login to sync workspace with Google drive"
          className={styles.profile}
          onClick={handleLogin}
        >
          {loading ? (
            <Loader />
          ) : (
            <div className={styles.unauth}>
              <CgProfile /> <span className={styles.login}>Login</span>
            </div>
          )}
        </div>
      )}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}

export default Profile;
