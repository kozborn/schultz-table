import React from "react";
import Api from "../api/Api";
import {stringDivider} from "../utils/helpers";

const PREFIX = "<div class='wrapper'>";
const POSTFIX = "<div class='show-top-letters'></div></div>";

class TopHalfText extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      textWrapped: "",
    };
  }

  componentWillMount() {
    Api.getText()
    .then((jsonResponse) => {
      this.setState({sampleTexts: jsonResponse});
      const {sampleTexts} = this.state;
      const textWrapped = stringDivider(sampleTexts.reading, 100, PREFIX, POSTFIX);
      this.setState({textWrapped});
    });
  }

  createMarkup(markup) {
    return {__html: markup};
  }

  render() {
    return (
      <div className="top-half-text">
        <div
          className="text-container"
          ref={(e) => { this.textContainer = e; }}
          dangerouslySetInnerHTML={this.createMarkup(this.state.textWrapped)}
        />
      </div>
    );
  }
}

export default TopHalfText;
