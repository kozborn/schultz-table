import _ from "underscore";
import {Map, fromJS} from "immutable";

export const DEFAULT_DOC_ID = "default_doc";
export const DbUrl = "http://127.0.0.1:5984/speed-read";
export const ServerUrl = "http://localhost:3000";

export function getDoc(docId) {
  return (dispatch) => {
    dispatch({type: "FETCHING_DOC", docId});

    const documentId = _.isEmpty(docId) ? DEFAULT_DOC_ID : docId;
    const userDocument = documentId !== DEFAULT_DOC_ID;

    return fetch(`${DbUrl}/${documentId}`)
    .then(response => response.json())
    .then((response) => {
      if (userDocument) {
        dispatch({type: "USER_DOC_FETCHED", response});
      } else {
        dispatch({type: "DOC_FETCHED", response});
      }
    })
    .catch((ex) => {
      console.warn("parsing failed", ex);
    });
  };
}

function fetchDoc(docId) {
  return fetch(`${DbUrl}/${docId}`)
  .then(response => response.json());
}

function getOptions(method, body) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  return {
    method,
    headers,
    mode: "cors",
    cache: "default",
    body: JSON.stringify(body),
  };
}

export function setDocumentId(docId) {
  const userDocId = docId !== DEFAULT_DOC_ID ? docId : null;
  localStorage.setItem("docId", userDocId);
  return {type: "SET_USER_DOCID", userDocId};
}

export function clearLocalStorage() {
  localStorage.removeItem("docId");
  return {type: "SET_USER_DOCID", userDocId: null};
}

export function save(docId, data) {
  const method = _.isEmpty(docId) || docId === DEFAULT_DOC_ID ? "POST" : "PUT";
  const url = _.isEmpty(docId) || docId === DEFAULT_DOC_ID ? DbUrl : `${DbUrl}/${docId}`;
  return (dispatch, getState) => {
    const userDoc = Map.isMap(getState().getIn(["app", "userDoc"])) ? getState().getIn(["app", "userDoc"]) : new Map();
    if (userDoc.isEmpty()) {
      dispatch({type: "CREATE_NEW_DOCUMENT"});
    }
    const bodyToSave = userDoc.mergeDeep(fromJS(data));
    const options = getOptions(method, bodyToSave.toJS());

    fetch(url, options)
    .then((response) => {
      if (response.status === 409) {
        return fetchDoc(docId)
        .then((e) => {
          dispatch(save(docId, _.extend(bodyToSave.toJS(), {_rev: e._rev})));
        });
      }
      return response;
    })
    .then(response => response.json())
    .then((response) => {
      dispatch({type: "DOCUMENT_SAVED", response});
      dispatch(setDocumentId(response.id));
      // TODO try to do optimistic update?
      dispatch(getDoc(response.id));
    })
    .catch((e) => {
      console.warn("Exception catched", e);
    });
  };
}

export function saveText(docId, textKey, text) {
  const body = {};
  body[textKey] = text;
  return dispatch => dispatch(save(docId, body));
}

export function savePreferences(docId, key, value) {
  return (dispatch) => {
    const preferences = {};
    preferences[key] = value;
    dispatch({type: "SAVING_PREFERENCES", preferences});
    dispatch(save(docId, {preferences}));
  };
}

export function switchText(docId, key, id) {
  return (dispatch) => {
    dispatch(savePreferences(docId, key, id));
    dispatch({type: "SWITCH_TYPE", data: {key, id}});
  };
}
