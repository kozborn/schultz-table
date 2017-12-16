import {connect} from "react-redux";
import Immutable from 'immutable';
import Fixations from "../components/Fixations";
import { savePreferences } from "../actions/user-actions";
import { getText } from '../utils/state_helpers';

function mapStateToProps(state) {
  return {
    userDoc: state.get('user'),
    text: getText(state, "fixations"),
    preferences: state.getIn(['user', 'doc', 'preferences'], Immutable.Map()),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    savePreferences: (key, preferences) => dispatch(savePreferences(key, preferences)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Fixations);
