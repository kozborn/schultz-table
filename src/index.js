import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createStore, applyMiddleware } from "redux";
import createBrowserHistory from "history/createBrowserHistory";
import { Provider } from "react-redux";
import thunkMiddleware from "redux-thunk";
import queryString from "query-string";

import reducer from "./reducer";
import "./assets/index.css";
import "./styles/index.css";
import App from "./components/App";
import HomePage from "./connectors/HomePage";
import BottomHalfText from "./components/BottomHalfText";
import TopHalfText from "./components/TopHalfText";
import TableWithSliders from "./connectors/Table";
import Fixations from "./connectors/Fixations";
import registerServiceWorker from "./registerServiceWorker";
import {getDoc, setDocumentId, clearLocalStorage} from "./actions/actions";

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
store.dispatch(getDoc());
const parsed = queryString.parse(window.location.search);
const documentId = parsed.documentId;
if (documentId) {
  store.dispatch(setDocumentId(documentId));
} else if (localStorage.getItem("docId")) {
  store.dispatch(setDocumentId(localStorage.getItem("docId")));
}

const docId = store.getState().getIn(["app", "docId"], "");

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <div>
        <App docId={docId} clearLocalStorage={clearLocalStorage}>
          <Route exact path="/" component={HomePage} />
          <Route path="/fixations" component={Fixations} />
          <Route path="/top-half-text" component={TopHalfText} />
          <Route path="/bottom-half-text" component={BottomHalfText} />
          <Route path="/schultz-table" component={TableWithSliders} />
        </App>
      </div>
    </Router>
  </Provider>,
  document.getElementById("root"),
);
registerServiceWorker();
