import React, { Component } from "react";
import camelize from "underscore.string/camelize";
import { withRouter, Route } from "react-router";
import { matchPath } from "react-router-dom";
import Immutable from 'immutable';
import { bool, string, object, node, instanceOf, func } from "prop-types";
import Header from '../connectors/Header';
import Spinner from './common/Spinner';
import Modal from './common/Modal';
import Footer from "../connectors/Footer";
import TextListToChoose from "../connectors/TextListToChoose";

const pageWithSidebar = (location) => {
  const key = camelize(location.replace("/", ""));
  return (["fixations", "bottomHalfText", "topHalfText"].indexOf(key) !== -1);
};

class App extends Component {

  static propTypes = {
    docId: string.isRequired,
    isFetching: bool.isRequired,
    location: object.isRequired,
    children: node.isRequired,
    notification: instanceOf(Immutable.Map).isRequired,
    closeNotification: func.isRequired,
    fetchUserDoc: func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      sidebar: false,
    };
    this.closeNotification = this.closeNotification.bind(this);
    this.getSidebar = this.getSidebar.bind(this);
  }

  componentDidMount() {
    // https://stackoverflow.com/a/45492498/1783152
    const match = matchPath(this.props.history.location.pathname, {
      // You can share this string as a constant if you want
      path: "/:module/:userId",
    });

    if (match && match.params.userId) {
      this.props.fetchUserDoc(match.params.userId);
    }

    console.log(match);
  }

  getSidebar(docId) {
    if (pageWithSidebar(this.props.location.pathname)) {
      const key = camelize(this.props.location.pathname.replace("/", ""));
      return (<div className="sidebar">
        <TextListToChoose docId={docId} textKey={key} />
      </div>);
    }
    return null;
  }

  closeNotification() {
    this.props.closeNotification();
  }

  render() {
    let queryParams = "";
    const {isFetching, children} = this.props;

    const docId = this.props.docId ? this.props.docId : localStorage.getItem("docId");
    if (docId) {
      queryParams = `?documentId=${docId}`;
    }

    return (
      <div className="App">
        <Route component={Header} />
        <div className="App-body">
          <div className="page-content">
            {isFetching ? <Spinner /> : children}
          </div>
          {this.getSidebar(docId)}
        </div>
        <Footer />
        <Modal
          isOpen={!this.props.notification.isEmpty()}
          overlay
          title={this.props.notification.get('title', "")}
          position="center"
          closeBtn
          onClose={this.closeNotification}
        >
          <div className="notification">
            {this.props.notification.get('message', '')}
          </div>
        </Modal>
      </div>
    );
  }
}

export default withRouter(App);
