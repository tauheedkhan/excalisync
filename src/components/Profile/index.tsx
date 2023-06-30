import * as React from "react";
import { useEffect, useState, useCallback, useContext } from "react";
import { CgProfile } from "react-icons/cg";
import styles from "./Profile.module.css";
import Home from "../Home/Home";
import { getProfile, initialiseDrive } from "../../utils/googleApis";
import Sidebar from "../SideBar";
import Loader from "../Loader";
import { GlobalContext } from "../../Context/globalState";

function Profile() {
  const {
    folders,
    user,
    isLoggedIn,
    isSideBarOpen,
    activeFileId,
    activeFolderId,
    dispatch,
  } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  // const [isOpen, setIsOpen] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  const setIsOpen = (val) => {
    dispatch({
      type: "SET_SIDEBAR",
      payload: { isSideBarOpen: val },
    });
  };
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
        dispatch({
          type: "LOGIN",
          payload: { user: profileInfo, isLoggedIn: true },
        });

        localStorage.setItem("excaliSyncAuth", accesToken);
        console.log("profileInfo ", profileInfo);
      }
    );
  };

  useEffect(() => {
    console.log("FOlders state ", folders);
    console.log("user state ", user);
    console.log("login state ", isLoggedIn);
    if (isLoggedIn) {
      // initialiseDrive(accessToken);
      // no files in drive
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const auth = localStorage.getItem("excaliSyncAuth");
    if (auth && !isLoggedIn) {
      handleLogin();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("excaliSync-folders", JSON.stringify(folders));
  }, [folders]);
  useEffect(() => {
    localStorage.setItem("excaliSync-user", JSON.stringify(user));
  }, [user]);
  useEffect(() => {
    localStorage.setItem("excaliSync-loggedIn", isLoggedIn.toString());
  }, [isLoggedIn]);
  useEffect(() => {
    localStorage.setItem("excaliSync-sideBar", isSideBarOpen.toString());
  }, [isSideBarOpen]);
  useEffect(() => {
    localStorage.setItem("excaliSync-fileId", activeFileId.toString());
  }, [activeFileId]);
  useEffect(() => {
    localStorage.setItem("excaliSync-folderId", activeFolderId.toString());
  }, [activeFolderId]);

  return (
    <>
      {isLoggedIn ? (
        <div onClick={() => setIsOpen(true)}>
          <img
            className={styles.authPic}
            src={user.picture}
            alt="profile picture"
          />
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
      {isSideBarOpen && <Sidebar />}
    </>
  );
}

export default Profile;
