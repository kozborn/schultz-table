import React from "react";
import {instanceOf, func, string} from "prop-types";
import Immutable from "immutable";
import Text from "./Text";

export default class extends React.Component {
  static propTypes = {
    texts: instanceOf(Immutable.List).isRequired,
    switchText: func.isRequired,
    textKey: string.isRequired,
  }

  constructor(props) {
    super(props);
    this.switchText = this.switchText.bind(this);
  }

  switchText(id) {
    console.log(this.props.textKey, id)
    // this.props.switchText(this.props.textKey, id);
  }

  render() {
    const {texts} = this.props;
    return (
      <div className="text-list">
        {texts.map(text => (
          <Text
            key={text.get('id')}
            id={text.get('id')}
            title={text.get("title")}
            text={text.get("text")}
            onCheck={this.switchText}
          />),
        ).toList()}
      </div>
    );
  }
}
