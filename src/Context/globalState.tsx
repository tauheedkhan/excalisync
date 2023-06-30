import * as React from "react";
import { createContext, useReducer } from "react";

type StateType = {
  folders: Array<any>;
  user: any | null;
  isLoggedIn: boolean;
  activeFileId: number;
  activeFolderId: number;
  isSideBarOpen: boolean;
  dispatch?: React.Dispatch<any>;
};

// Initial state
const initialState: StateType = {
  folders: JSON.parse(localStorage.getItem("excaliSync-folders")) || [],
  user: JSON.parse(localStorage.getItem("excaliSync-user")),
  activeFileId: Number(localStorage.getItem("excaliSync-fileId")),
  activeFolderId: Number(localStorage.getItem("excaliSync-folderId")),
  isLoggedIn: localStorage.getItem("excaliSync-loggedIn") === "true",
  isSideBarOpen: localStorage.getItem("excaliSync-sideBar") === "true",
};

// Create context
export const GlobalContext = createContext<StateType>(initialState);

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case "ADD_FOLDER":
      return {
        ...state,
        folders: [...state.folders, action.payload],
      };
    case "UPDATE_FOLDER":
      return {
        ...state,
        folders: state.folders.map((folder) =>
          folder.id === action.payload.id ? action.payload : folder
        ),
      };
    case "DELETE_FOLDER":
      return {
        ...state,
        folders: state.folders.filter((folder) => folder.id !== action.payload),
      };
    case "ADD_FILE":
      return {
        ...state,
        folders: state.folders.map((folder) =>
          folder.id === action.payload.folderId
            ? { ...folder, files: [...folder.files, action.payload.file] }
            : folder
        ),
      };
    case "UPDATE_FILE":
      return {
        ...state,
        folders: state.folders.map((folder) =>
          folder.id === action.payload.folderId
            ? {
                ...folder,
                files: folder.files.map((file) =>
                  file.id === action.payload.file.id
                    ? action.payload.file
                    : file
                ),
              }
            : folder
        ),
      };
    case "DELETE_FILE":
      return {
        ...state,
        folders: state.folders.map((folder) =>
          folder.id === action.payload.folderId
            ? {
                ...folder,
                files: folder.files.filter(
                  (file) => file.id !== action.payload.fileId
                ),
              }
            : folder
        ),
      };
    case "LOGIN":
      return {
        ...state,
        user: action.payload.user,
        isLoggedIn: action.payload.isLoggedIn,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "UPDATE_ACTIVE_FILE_FOLDER":
      return {
        ...state,
        activeFileId: action.payload.fileId,
        activeFolderId: action.payload.folderId,
      };
    case "SET_SIDEBAR":
      return {
        ...state,
        isSideBarOpen: action.payload.isSideBarOpen,
      };
    default:
      return state;
  }
};

// Provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <GlobalContext.Provider
      value={{
        folders: state.folders,
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        activeFileId: state.activeFileId,
        activeFolderId: state.activeFolderId,
        isSideBarOpen: state.isSideBarOpen,
        dispatch,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
