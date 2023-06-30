import * as React from "react";
import { useState, useEffect, useContext } from "react";
import styles from "./Sidebar.module.css";
import Folder from "../Folder";
import useSyncedLocalStorage from "../../utils/useSyncedLocalStorage";
import { GlobalContext } from "../../Context/globalState";

function Sidebar() {
  const {
    folders,
    user,
    activeFileId,
    activeFolderId,
    isSideBarOpen,
    dispatch,
  } = useContext(GlobalContext);

  const exalidrawStorage = useSyncedLocalStorage();

  // TODO call google drive apis and get files and folders
  // const [folders, setFolders] = useState([]); //TODO set the google drive files and folders

  console.log("folder--- ", folders);
  console.log("user----", user);

  const addFolder = ({ name = "untitled", files = [], isEditable = true }) => {
    dispatch({
      type: "ADD_FOLDER",
      payload: {
        name,
        id: Math.floor(Math.random() * 100000000),
        files,
        isEditable,
      },
    });
  };

  const closeSidebar = () => {
    dispatch({
      type: "SET_SIDEBAR",
      payload: { isSideBarOpen: false },
    });
  };

  useEffect(() => {
    // if folders is empty array then create a untitled folder and file and add the current page data to it
    if (folders.length === 0) {
      const fileVersion = localStorage.getItem("version-dataState");
      const fileContent = localStorage.getItem("excalidraw");
      addFolder({
        isEditable: false,
        files: [
          {
            name: "untitled",
            id: Math.floor(Math.random() * 100000000),
            version: fileVersion,
            content: fileContent,
            isEditable: true,
          },
        ],
      });
    }
  }, []);

  // useEffect(() => {
  //   if (folders.length === 1) {
  //     console.log("folders before dispatch ", folders[0].id);
  //     dispatch({
  //       type: "UPDATE_ACTIVE_FILE_FOLDER",
  //       payload: { folderId: folders[0].id, fileId: folders[0].files[0].id },
  //     });
  //   }
  // }, [folders]);

  useEffect(() => {
    console.log(
      "excaliSync-sidebar ",
      localStorage.getItem("excaliSync-sidebar")
    );
    console.log(
      "before msg ",
      localStorage.getItem("excaliSync-sidebar") === "true"
    );
    chrome.runtime.sendMessage({
      message: "context",
      fileId: activeFileId,
      folderId: activeFolderId,
    });
  }, [activeFileId, activeFolderId]);
  console.log("activeFileId ", activeFileId);
  console.log("activeFolderId ", activeFolderId);
  return (
    <div>
      <div className={`${styles.sidebar} ${!isSideBarOpen && styles.hidden}`}>
        <div className={styles.workspace}>Workspace</div>
        <button className={styles.closeButton} onClick={closeSidebar}>
          ×
        </button>
        <button className={styles.button} onClick={() => addFolder({})}>
          Add Folder
        </button>
        {folders.map((folder, index) => (
          <Folder
            // isActive={activeFolderId === folder.id}
            key={index}
            folder={folder}
          />
        ))}
        <div className={styles.userContainer}>
          <img className={styles.img} src={user.picture} alt="" />
          <div className={styles.logintext}>
            Logged In as:
            <span className={styles.email}>{user.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
