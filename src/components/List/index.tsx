import * as React from "react";
import { useState } from "react";
import styles from "./List.module.css";
import { MdDelete, MdCheck, MdOutlineCancel } from "react-icons/md";

function TextItem({ text, onTextClick }) {
  const [isEditable, setEditable] = useState(false);
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);

  const handleTextClick = () => {
    if (!isEditable) {
      onTextClick && onTextClick();
    }
  };

  const handleTextDblClick = () => {
    setEditable(true);
  };

  const handleDeleteClick = () => {
    setShowDeleteOptions(true);
  };

  const handleConfirmDelete = () => {
    console.log("Confirm delete");
  };

  const handleCloseDelete = () => {
    setShowDeleteOptions(false);
  };

  return (
    <div className={styles.textItem}>
      {isEditable ? (
        <input
          className={styles.editable}
          defaultValue={text}
          onBlur={() => setEditable(false)}
          autoFocus
        />
      ) : (
        <span onClick={handleTextClick} onDoubleClick={handleTextDblClick}>
          {text}
        </span>
      )}

      {!showDeleteOptions ? (
        <span className={styles.icon} onClick={handleDeleteClick}>
          <MdDelete />
        </span>
      ) : (
        <div
          className={
            showDeleteOptions ? styles.iconOptionsShow : styles.iconOptionsHide
          }
        >
          <span className={styles.icon} onClick={handleConfirmDelete}>
            <MdCheck />
          </span>
          <span className={styles.icon} onClick={handleCloseDelete}>
            <MdOutlineCancel />
          </span>
        </div>
      )}
    </div>
  );
}

export default TextItem;
