import {connect} from "react-redux";
import HomePage from "../components/HomePage";
import {getDoc} from "../actions/actions";

function mapStateToProps(state) {
  return {
    reading: state.getIn(["app", "defaultTexts", "reading"], ""),
    understanding: state.getIn(["app", "defaultTexts", "understanding"], ""),
    anticipating: state.getIn(["app", "defaultTexts", "anticipating"], ""),
    thinking: state.getIn(["app", "defaultTexts", "thinking"], ""),
    memorizing: state.getIn(["app", "defaultTexts", "memorizing"], ""),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getDoc: () => dispatch(getDoc()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
