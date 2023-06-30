import * as React from "react";
import { useState, useContext, useEffect } from "react";
import styles from "./File.module.css";
import { MdDeleteOutline, MdCheck, MdOutlineCancel } from "react-icons/md";
import { FcFile } from "react-icons/fc";
import { classNames } from "../../utils/classNames";
import { GlobalContext } from "../../Context/globalState";

function TextItem({ folderId, file }) {
  const { dispatch, activeFileId } = useContext(GlobalContext);
  const [isEditable, setEditable] = useState(false);
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);
  // const [active, setActive] = useState(false);

  const handleClick = () => {
    // setActive(true);
    localStorage.setItem("excalidraw", file.content);
    dispatch({
      type: "UPDATE_ACTIVE_FILE_FOLDER",
      payload: {
        fileId: file.id,
        folderId: folderId,
      },
    });
  };

  const handleBlur = (e) => {
    setEditable(false);
    dispatch({
      type: "UPDATE_FILE",
      payload: {
        folderId,
        file: { ...file, name: e.target.value },
      },
    });
  };

  const deleteFile = () =>
    dispatch({
      type: "DELETE_FILE",
      payload: {
        folderId,
        fileId: file.id,
      },
    });

  const handleDblClick = () => {
    setEditable(true);
  };

  const handleDeleteClick = () => {
    setShowDeleteOptions(true);
  };

  const handleCloseDelete = () => {
    setShowDeleteOptions(false);
  };

  // useEffect(() => {
  //   if (file.id === activeFileId) {
  //     setActive(true);
  //   }
  // }, [activeFileId]);

  return (
    <div
      className={classNames(
        styles.textItem,
        file.id === activeFileId && styles.active
      )}
    >
      <div
        className={styles.fileNameContainer}
        onClick={handleClick}
        onDoubleClick={handleDblClick}
      >
        <FcFile />
        {isEditable ? (
          <input
            className={styles.editable}
            defaultValue={file.name}
            onBlur={handleBlur}
            autoFocus
          />
        ) : (
          <span className={styles.fileName}>{file.name}</span>
        )}
      </div>

      {!showDeleteOptions ? (
        <span
          className={classNames(styles.icon, styles.filecontrol)}
          onClick={handleDeleteClick}
          title="Delete File"
        >
          <MdDeleteOutline />
        </span>
      ) : (
        <div
          className={
            showDeleteOptions ? styles.iconOptionsShow : styles.iconOptionsHide
          }
        >
          <span
            className={styles.icon}
            onClick={deleteFile}
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
  );
}

export default TextItem;
