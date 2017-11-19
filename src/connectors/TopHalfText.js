import { connect } from "react-redux";
import TopHalfText from "../components/TopHalfText";
import { getText } from '../utils/state_helpers';

function mapStateToProps(state) {
  return {
    text: getText(state, "topHalfText"),
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(TopHalfText);
