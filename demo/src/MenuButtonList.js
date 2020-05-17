import React, { useState } from "react";
import MenuButton from "./MenuButton";

const MenuButtonList = (props) => {
  const [selectedId, setSelectedId] = useState(0);

  function selectWrapper(id, value) {
    setSelectedId(id);
    if (props.func !== undefined) {
      props.func(value);
    }
  }

  function getSelectedId() {
    return selectedId;
  }

  function headerBtnOnClick(id) {
    const collapsible = document.getElementById(id);
    var curClassName = collapsible.getAttribute("class");

    if (!curClassName.includes("collapsed")) {
      curClassName = curClassName + " collapsed";
    } else {
      curClassName = curClassName.replace(" collapsed", "");
    }

    collapsible.setAttribute("class", curClassName);
  }

  const items = props.items;
  const listItems = items.map(({ title, value }, index) => (
    <li key={index}>
      <MenuButton
        key={index}
        title={title}
        onClick={() => selectWrapper(index, value)}
        isSelected={selectedId === index}
        hierarchy={props.hierarchy}
      />
    </li>
  ));

  return (
    <div>
      <li>
        <MenuButton
          title={props.listId}
          onClick={() => headerBtnOnClick(props.listId)}
          hierarchy={props.hierarchy - 1}
        />
      </li>
      <ul id={props.listId} className="menuGroupCollapsible">
        {listItems}
      </ul>
    </div>
  );
};

export default MenuButtonList;
