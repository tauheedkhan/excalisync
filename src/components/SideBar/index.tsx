import * as React from "react";
import styles from "./Sidebar.module.css";
import List from "../List";

function Sidebar({ isOpen, setIsOpen }) {
  const handleClose = () => {
    setIsOpen(false);
  };

  const handleTextEdit = () => {
    console.log("textedit clicked of focus");
  };

  return (
    <div>
      <div className={`${styles.sidebar} ${!isOpen && styles.hidden}`}>
        <div className={styles.workspace}>Workspace</div>
        <button className={styles.closeButton} onClick={handleClose}>
          ×
        </button>
        <List text="default" onTextClick={handleTextEdit} />
      </div>
    </div>
  );
}

export default Sidebar;
