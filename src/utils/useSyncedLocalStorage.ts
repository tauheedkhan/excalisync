import { useState, useEffect } from "react";
const keys = ["version-files", "version-dataState", "excalidraw"];
function useSyncedLocalStorage() {
  const [values, setValues] = useState({});

  // Read the initial values from localStorage
  useEffect(() => {
    const initialValues = {};
    keys.forEach((key) => {
      initialValues[key] = localStorage.getItem(key);
    });
    setValues(initialValues);
  }, [keys]);

  // Listen for changes in localStorage
  useEffect(() => {
    function handleStorageChange(e) {
      console.log("storage event", e);
      if (keys.includes(e.key)) {
        setValues((prevValues) => ({ ...prevValues, [e.key]: e.newValue }));
      }
    }

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [keys]);

  return values;
}

export default useSyncedLocalStorage;
