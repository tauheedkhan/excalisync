// Folder.jsx
import * as React from "react";
import { useState, useRef, useEffect, useContext } from "react";
import File from "../File";
import styles from "./Folder.module.css";
import { MdDeleteOutline, MdCheck, MdOutlineCancel } from "react-icons/md";
import { FcFolder, FcOpenedFolder } from "react-icons/fc";
import { AiOutlineFileAdd } from "react-icons/ai";
import { classNames } from "../../utils/classNames";
import { GlobalContext } from "../../Context/globalState";

function Folder({ folder }) {
  const { dispatch, activeFolderId } = useContext(GlobalContext);
  const [isEditable, setEditable] = useState(false);
  const [isExpanded, setExpanded] = useState(false);
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);
  const [active, setActive] = useState(false);
  const inputRef = useRef(null);

  const handleFolderClick = () => {
    setExpanded(!isExpanded);
  };

  const handleFolderDoubleClick = () => {
    setEditable(true);
  };

  const handleBlur = (e) => {
    setEditable(false);
    // onRename(e.target.value);
    dispatch({
      type: "UPDATE_FOLDER",
      payload: { ...folder, name: e.target.value },
    });
  };

  const deleteFolder = () =>
    dispatch({
      type: "DELETE_FOLDER",
      payload: folder.id,
    });

  const addFile = ({ name = "untitled", content = [], version = 0 }) => {
    setExpanded(true);
    localStorage.setItem("excalidraw", null);
    dispatch({
      type: "ADD_FILE",
      payload: {
        folderId: folder.id,
        file: {
          id: Math.floor(Math.random() * 100000000),
          name,
          content,
          version,
          isEditable: true,
        },
      },
    });
  };

  const handleDeleteClick = () => {
    setShowDeleteOptions(true);
  };

  const handleCloseDelete = () => {
    setShowDeleteOptions(false);
  };

  useEffect(() => {
    if (folder.isEditable) {
      setEditable(true);
    }
  }, [folder.isEditable]);

  useEffect(() => {
    if (isEditable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditable]);

  useEffect(() => {
    if (folder.id === activeFolderId) {
      setActive(true);
    }
  }, [activeFolderId]);

  return (
    <div className={styles.folder}>
      <div
        className={classNames(styles.folderWrap, isExpanded && styles.expanded)}
      >
        <div className={styles.folderNameWrap}>
          {isExpanded ? <FcOpenedFolder /> : <FcFolder />}
          {isEditable ? (
            <input
              className={styles.editable}
              defaultValue={folder.name}
              onBlur={handleBlur}
              autoFocus
            />
          ) : (
            <div
              className={styles.folderName}
              onClick={handleFolderClick}
              onDoubleClick={handleFolderDoubleClick}
            >
              {folder.name}
            </div>
          )}
        </div>
        {!showDeleteOptions ? (
          <div className={styles.folderControls}>
            <span
              className={styles.icon}
              onClick={() => addFile({})}
              title="Create file inside this folder"
            >
              <AiOutlineFileAdd />
            </span>
            <span
              className={styles.icon}
              onClick={handleDeleteClick}
              title="Delete folder"
            >
              <MdDeleteOutline />
            </span>
          </div>
        ) : (
          <div
            className={
              showDeleteOptions
                ? styles.iconOptionsShow
                : styles.iconOptionsHide
            }
          >
            <span
              className={styles.icon}
              onClick={deleteFolder}
              title="Confirm Delete"
            >
              <MdCheck />
            </span>
            <span
              className={styles.icon}
              onClick={handleCloseDelete}
              title="Cancel Delete"
            >
              <MdOutlineCancel />
            </span>
          </div>
        )}
      </div>
      <div className={styles.fileContainer}>
        {isExpanded &&
          folder.files.map((file, index) => (
            <File
              folderId={folder.id}
              //   isActive={activeFileId === file.id}
              key={index}
              file={file}
              //   onRename={(newName) => renameFile(file.id, newName)}
              //   onDelete={() => deleteFile(file.id)}
            />
          ))}
      </div>
    </div>
  );
}

export default Folder;
