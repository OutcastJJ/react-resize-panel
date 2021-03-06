import React from "react";
import { DraggableCore } from "react-draggable";
import debounce from "lodash.debounce";
import $ from "cash-dom";
import classNames from "classnames/bind";
import style from "./ResizePanel.module.css";
let cx = classNames.bind(style);

class ResizePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { size: 0, previousSize: 0, sizeList: {}, sizeOption: "" };

    this.contentRef = React.createRef();
    this.wrapperRef = React.createRef();
    this.validateSize = debounce(this.validateSize, 100).bind(this);
  }

  isHorizontal = () =>
    this.props.direction === "w" || this.props.direction === "e";

  componentDidMount() {
    const content = this.contentRef.current;
    const actualContent = content.children[0];
    let initialSize =
      this.props.sizeList && this.props.sizeOption
        ? this.props.sizeList[this.props.sizeOption]
        : this.isHorizontal()
        ? $(actualContent).outerWidth(true)
        : $(actualContent).outerHeight(true);

    // Initialize the size value based on the content's current size
    this.setState({
      size: initialSize,
      sizeList: this.props.sizeList,
      sizeOption: this.props.sizeOption,
    });
    this.validateSize();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.sizeOption && nextProps.sizeOption != prevState.sizeOption) {
      let initialSize =
        prevState.sizeList && nextProps.sizeOption
          ? prevState.sizeList[nextProps.sizeOption]
          : 0;

      // Initialize the size value based on the content's current size
      return {
        size: initialSize,
        sizeList: prevState.sizeList,
        sizeOption: nextProps.sizeOption,
      };
    }

    return prevState;
  }

  validateSize() {
    const isHorizontal = this.isHorizontal();
    const content = this.contentRef.current;
    const wrapper = this.wrapperRef.current;
    const actualContent = content.children[0];
    let containerParent = wrapper.parentElement;

    // Or if our size doesn't equal the actual content size, then we
    // must have pushed past the min size of the content, so resize back
    //let minSize = isHorizontal ? $(actualContent).outerWidth(true) : $(actualContent).outerHeight(true);

    let minSize = isHorizontal
      ? actualContent.scrollWidth
      : actualContent.scrollHeight;

    let margins = isHorizontal
      ? $(actualContent).outerWidth(true) - $(actualContent).outerWidth()
      : $(actualContent).outerHeight(true) - $(actualContent).outerHeight();
    minSize += margins;

    // scrollwidth only return the round up value,
    // so if the actual drag size got decimal places,
    // the menu can't resize
    if (Math.round(this.state.size) !== minSize && !this.state.sizeOption) {
      console.log(
        "Overflow, drag size: " + this.state.size + " min size: " + minSize
      );
      this.setState({
        ...this.state,
        size: this.state.previousSize,
      });

      return false;
    } else {
      // If our resizing has left the parent container's content overflowing
      // then we need to shrink back down to fit
      let overflow = isHorizontal
        ? containerParent.scrollWidth - containerParent.clientWidth
        : containerParent.scrollHeight - containerParent.clientHeight;

      if (overflow) {
        console.log("Others' overflow", overflow);
        this.setState({
          ...this.state,
          size: isHorizontal
            ? actualContent.clientWidth - overflow
            : actualContent.clientHeight - overflow,
        });

        return false;
      }
    }

    return true;
  }

  handleDragStart = (e, ui) => {
    this.setState({
      ...this.state,
      previousSize: this.state.size,
    });
  };

  handleDrag = (e, ui) => {
    const { direction } = this.props;
    const factor = direction === "e" || direction === "s" ? -1 : 1;

    // modify the size based on the drag delta
    let delta = this.isHorizontal() ? ui.deltaX : ui.deltaY;
    this.setState((s, p) => ({ size: Math.max(10, s.size - delta * factor) }));
  };

  handleDragEnd = (e, ui) => {
    var dragValid = this.validateSize();
    if (this.state.sizeList["default"]) {
      if (dragValid) {
        if (this.validateNewDefault(this.state.size)) {
          let newSizeList = this.state.sizeList;
          newSizeList["default"] = this.state.size;
          this.setState({
            ...this.state,
            sizeList: newSizeList,
          });
        }
      }
    }
  };

  validateNewDefault(newDefault) {
    // Check if the new default value is same with other sizeOption
    for (var sizeOption in this.state.sizeList) {
      if (this.state.sizeList[sizeOption] === newDefault) {
        return false;
      }
    }

    return true;
  }

  render() {
    const dragHandlers = {
      onStart: this.handleDragStart,
      onDrag: this.handleDrag,
      onStop: this.handleDragEnd,
    };
    const { direction } = this.props;
    const isHorizontal = this.isHorizontal();

    let containerClass = cx({
      ContainerHorizontal: isHorizontal,
      ContainerVertical: !isHorizontal,
    });

    if (this.props.containerClass) {
      containerClass += ` ${this.props.containerClass}`;
    }

    let containerStyle = { ...this.props.style } || {};
    if (this.state.size !== 0) {
      containerStyle.flexGrow = 0;
      containerStyle[isHorizontal ? "width" : "height"] = "auto";
    } else {
      containerStyle.flexGrow = 0;
      // containerStyle.overflow = "hidden";
    }

    let handleClasses = this.props.removeHandle
      ? ""
      : this.props.handleClass ||
        cx({
          ResizeHandleHorizontal: isHorizontal,
          ResizeHandleVertical: !isHorizontal,
        });

    let resizeBarClasses =
      this.props.borderClass ||
      cx({
        ResizeBarHorizontal: isHorizontal,
        ResizeBarVertical: !isHorizontal,
      });

    let contentStyle = isHorizontal
      ? { width: this.state.size + "px" }
      : { height: this.state.size + "px" };
    let contentClassName = cx("ResizeContent", {
      ResizeContentHorizontal: isHorizontal,
      ResizeContentVertical: !isHorizontal,
    });

    let content = [
      <div
        key="content"
        ref={this.contentRef}
        className={contentClassName}
        style={contentStyle}
      >
        {React.Children.only(this.props.children)}
      </div>,
    ];

    let handle = (
      <DraggableCore key="handle" {...dragHandlers}>
        <div className={resizeBarClasses}>
          <div className={handleClasses}>
            <span />
          </div>
        </div>
      </DraggableCore>
    );

    // Insert the handle at the beginning of the content if our directio is west or north
    if (direction === "w" || direction === "n") {
      content.unshift(handle);
    } else {
      content.push(handle);
    }

    return (
      <div
        ref={this.wrapperRef}
        className={containerClass}
        style={containerStyle}
      >
        {content}
      </div>
    );
  }
}

export default ResizePanel;
