import React from "react";
import {Map} from "immutable";
import {string, func, instanceOf} from "prop-types";
import {stringDivider} from "../utils/helpers";

const PREFIX = "<div class='wrapper'>";
const POSTFIX = "<div class='show-bottom-letters'></div></div>";

class BottomHalfText extends React.Component {

  static propTypes = {
    docId: string.isRequired,
    getDoc: func.isRequired,
    text: instanceOf(Map).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      textWrapped: "",
    };
  }

  componentWillMount() {
    this.props.getDoc(this.props.docId);
  }

  componentDidMount() {
    const textWrapped = stringDivider(this.props.text.get("text", ""), 100, PREFIX, POSTFIX);
    this.setState({textWrapped});
  }

  componentWillReceiveProps(nextProps) {
    const textWrapped = stringDivider(nextProps.text.get("text", ""), 100, PREFIX, POSTFIX);
    this.setState({textWrapped});
  }

  createMarkup(markup) {
    return {__html: markup};
  }

  render() {
    return (
      <div className="bottom-half-text">
        <div
          className="text-container"
          ref={(e) => { this.textContainer = e; }}
          dangerouslySetInnerHTML={this.createMarkup(this.state.textWrapped)}
        />
      </div>
    );
  }
}

export default BottomHalfText;
