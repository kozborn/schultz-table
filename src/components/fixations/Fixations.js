import React from "react";
import {number, string, func} from "prop-types";
import {stringDivider} from "../../utils/helpers";
import FixationsToolbar from "./FixationsToolbar";

const PREFIX = "<div class='wrapper'>";
const POSTFIX = " </div>||"; // "||" are used for splitting text

class Fixations extends React.Component {

  static propTypes = {
    fixationText: string.isRequired,
    speed: number, // ms
    createBtnCb: func,
  }

  static defaultProps = {
    documentId: "sample_text",
    speed: 1000, //ms
    eventType: "",
    createBtnCb: () => "",
  }

  constructor(props) {
    super(props);
    this.state = {
      textWrapped: [],
      running: false,
    };

    this.getText = this.getText.bind(this);
    this.prepareText = this.prepareText.bind(this);
    this.startSwitching = this.startSwitching.bind(this);
    this.stopSwitching = this.stopSwitching.bind(this);
    this.pauseSwitching = this.pauseSwitching.bind(this);
  }

  componentDidMount() {
    this.prepareText(this.props.fixationText);
  }

  componentWillReceiveProps(nextProps) {
    this.prepareText(nextProps.fixationText);
    if (nextProps.speed !== this.props.speed) {
      clearInterval(this.interval);
      this.interval = null;
      this.startSwitching();
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getText() {
    const lines = [];
    const {textWrapped} = this.state;

    for (let i = 0; i < textWrapped.length; i += 2) {
      const line = (<div className="line" key={`line_${i}`}>
        <div dangerouslySetInnerHTML={this.createMarkup(textWrapped[i])} className="left" />
        <div className="left-space">&nbsp;</div>
        <div dangerouslySetInnerHTML={this.createMarkup(textWrapped[i + 1])} className="right" />
        <div className="clearfix" />
      </div>);
      lines.push(line);
    }
    return lines;
  }

  getElements() {
    const leftElements = this.textWithFixations.getElementsByClassName("left");
    const rightElements = this.textWithFixations.getElementsByClassName("right");
    const elements = [];
    for (let i = 0; i < leftElements.length; i += 1) {
      elements.push(leftElements[i]);
      elements.push(rightElements[i]);
    }
    return elements;
  }

  prepareText(text) {
    const textWrapped = stringDivider(text, 50, PREFIX, POSTFIX).split("||");
    this.setState({textWrapped});
  }

  startSwitching() {
    const elements = this.getElements();
    this.setState({running: true});
    if (!this.interval) {
      this.interval = setInterval(() => {
        elements[this.currentElIndex].classList.add("highlight");
        if (this.currentElIndex > 0) elements[this.currentElIndex - 1].classList.remove("highlight");
        this.currentElIndex += 1;
        if (this.currentElIndex === elements.length) {
          clearInterval(this.interval);
          this.interval = null;
        }
      }, this.props.speed);
    }
  }

  pauseSwitching() {
    this.setState({running: false});
    clearInterval(this.interval);
    this.interval = null;
  }

  stopSwitching() {
    const elements = this.getElements();
    elements.forEach(element => element.classList.remove("highlight"));
    this.pauseSwitching();
    this.currentElIndex = 0;
  }

  interval = null;
  currentElIndex = 0;

  createMarkup(markup) {
    return {__html: markup};
  }

  render() {
    return (
      <div className="text-with-fixations" ref={(e) => { this.textWithFixations = e; }} >
        <FixationsToolbar
          startBtn={{
            cb: this.state.running ? this.pauseSwitching : this.startSwitching,
            label: this.state.running ? "Pause" : "Start",
            disabled: false,
          }}
          stopBtn={{
            cb: this.stopSwitching,
            label: "Stop",
            disabled: !this.state.running,
          }}
          createBtn={{
            cb: this.props.createBtnCb,
            label: "Dodaj swój text",
            disabled: false,
          }}
        />
        {this.getText()}
      </div>
    );
  }
}

export default Fixations;
