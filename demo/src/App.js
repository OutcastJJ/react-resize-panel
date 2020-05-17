import React, { useState } from "react";
//import ResizePanel from "react-resize-panel";
import ResizePanel from "../../src/ResizePanel";
import style from "./App.css";
import classNames from "classnames/bind";
import MenuButton from "./MenuButton";
import MenuButtonList from "./MenuButtonList";

let cx = classNames.bind(style);

const testSizeList = {
  min: 50,
  default: 285,
  max: 600,
};

const perspectiveList = [
  { title: "Programmer", value: "" },
  { title: "Designer", value: "" },
];

const colorList = [
  { title: "Default", value: "" },
  { title: "Red", value: "Red" },
];

function App() {
  const [sizeMode, setSizeMode] = useState("default");

  function toggleMin() {
    if (sizeMode === "default") {
      setSizeMode("min");
    } else {
      setSizeMode("default");
    }
  }

  return (
    <div className={cx("container")}>
      <ResizePanel direction="s">
        <div className={cx("header", "panel")}>
          <span>header</span>
        </div>
      </ResizePanel>
      <div className={cx("body")}>
        {/* <ResizePanel
        direction="e"
        style={{ flexGrow: "1" }}
        removeHandle={true}
        sizeList={testSizeList}
        sizeOption="max"
      >
        <div className={cx("sidebar", "withMargin", "panel")}>
          left panel
          <br /> with margin <br />
          default 50% of content area using flex-grow
        </div>
      </ResizePanel> */}
        <ResizePanel
          direction="e"
          removeHandle={true}
          containerClass="sideMenu"
          sizeList={testSizeList}
          sizeOption={sizeMode}
        >
          <div style={{ flexGrow: 1 }}>
            <div className="logoArea">
              <img src="../../asset/image1.jpg" alt=" " />
            </div>
            <div className="menu">
              <div className="persistent">
                <button onClick={toggleMin}>Toggle</button>
              </div>
              <div className="collapsible">
                <MenuButton
                  title="TeamWeb"
                  style={{ backgroundColor: "#999999" }}
                />
                <ul className="sideMenuButtonArea">
                  <MenuButtonList
                    listId="Perspectives"
                    items={perspectiveList}
                    hierarchy={1}
                  />
                  <MenuButtonList
                    listId="Colors"
                    items={colorList}
                    hierarchy={1}
                  />
                </ul>
              </div>
            </div>
          </div>
        </ResizePanel>
        <div className={cx("content", "panel")}>content</div>
        <ResizePanel
          direction="w"
          style={{ width: "400px" }}
          handleClass={style.customHandle}
          borderClass={style.customResizeBorder}
        >
          <div className={cx("sidebar", "panel")}>
            right panel
            <br /> with custom handle
            <br /> default 400px
          </div>
        </ResizePanel>
      </div>

      <ResizePanel direction="n" style={{ height: "200px" }}>
        <div className={cx("footer", "panel")}>
          <div className={cx("footerArea")}>
            <div className={cx("footerAreaContent")}>
              <span>footer area, min height: 100px</span>
            </div>
          </div>
          <div className={cx("footerBottomBar")}>bottom bar</div>
        </div>
      </ResizePanel>
    </div>
  );
}

export default App;
