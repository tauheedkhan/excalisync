import * as React from "react";
import { Root, createRoot } from "react-dom/client";
import Main from "./components/Main";

export const excalidrawButtonSelector = ".App-menu .excalidraw-button";

class Extension {
  static element: HTMLElement;
  static root: Root;
  static initialize() {
    if (!this.element) {
      this.element = document.createElement("div");
      this.root = createRoot(this.element);
    }
    this.root.render(<Main />);
    document
      .querySelector(excalidrawButtonSelector)
      .insertAdjacentElement("beforebegin", this.element);
  }
  static terminate() {
    this.root.render(<></>);
    this.element.remove();
  }
}

const integrate = () => {
  Extension.initialize();
};

export { integrate };
