import * as React from "react";
import Profile from "../Profile";
import { GlobalProvider } from "../../Context/globalState";

const Main = () => {
  return (
    <div>
      <GlobalProvider>
        <Profile />
      </GlobalProvider>
    </div>
  );
};

export default Main;
