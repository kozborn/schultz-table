import React from "react";
import ReactDOM from "react-dom";
import { Router, Route } from "react-router-dom";
import { createStore, applyMiddleware } from "redux";
import createBrowserHistory from "history/createBrowserHistory";
import { Provider } from "react-redux";
import thunkMiddleware from "redux-thunk";
import queryString from "query-string";

import reducer from "./reducer";
import "./styles/index.css";
import App from "./connectors/App";
import HomePage from "./connectors/HomePage";
import BottomHalfText from "./connectors/BottomHalfText";
import TopHalfText from "./connectors/TopHalfText";
import TableWithSliders from "./connectors/Table";
import Fixations from "./connectors/Fixations";
import UserTexts from "./connectors/UserTexts";
import NewText from "./connectors/NewText";
import EditText from "./connectors/EditText";
import Settings from "./connectors/Settings";
import registerServiceWorker from "./registerServiceWorker";
import { getDefaultDoc } from "./actions/actions";
import { getUserDoc } from './actions/user-actions';

const history = createBrowserHistory();

function logger({ getState }) {
  return next => (action) => {
    console.log("will dispatch", action);

    // Call the next dispatch method in the middleware chain.
    const returnValue = next(action);

    console.log("state after dispatch", getState().toJS());

    // This will likely be the action itself, unless
    // a middleware further in chain changed it.
    return returnValue;
  };
}

const store = createStore(reducer, applyMiddleware(thunkMiddleware, logger));
store.dispatch(getDefaultDoc());

const parsed = queryString.parse(window.location.search);
const documentId = parsed.documentId;

if (documentId) {
  store.dispatch(getUserDoc(documentId));
} else if (localStorage.getItem("docId")) {
  store.dispatch(getUserDoc(localStorage.getItem("docId")));
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App>
        <Route exact path="/" component={HomePage} />
        <Route path="/fixations" component={Fixations} />
        <Route path="/top-half-text" component={TopHalfText} />
        <Route path="/bottom-half-text" component={BottomHalfText} />
        <Route path="/schultz-table" component={TableWithSliders} />
        <Route path="/new-text" component={NewText} />
        <Route path="/edit-text" component={EditText} />
        <Route path="/user-texts" component={UserTexts} />
        <Route path="/settings" component={Settings} />
      </App>
    </Router>
  </Provider>,
  document.getElementById("root"),
);
registerServiceWorker();
