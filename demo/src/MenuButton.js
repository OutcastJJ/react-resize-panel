import React from "react";

const MenuButton = (props) => {
  function onClickWrapper() {
    if (props.onClick) {
      props.onClick();
    }
  }

  let className = "menuButton" + (props.isSelected ? " selected" : "");
  const hierarchy = props.hierarchy ? props.hierarchy : 0;

  return (
    <div className={className} onClick={onClickWrapper} style={props.style}>
      <div style={{ paddingLeft: hierarchy * 10 }} />
      <div className="buttonContainer">
        <img src="../../asset/image1.jpg" alt=" " />
        <p>{props.title}</p>
      </div>
    </div>
  );
};

export default MenuButton;
