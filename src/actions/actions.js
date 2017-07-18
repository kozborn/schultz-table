import _ from "underscore";

const ServerUrl = "http://127.0.0.1:5984/speed-read";

export function getDoc(docId = "sample_text") {
  return (dispatch) => {
    dispatch({type: "FETCHING_DOC", docId});

    const documentId = _.isEmpty(docId) ? "sample_text" : docId;
    const userDocument = documentId !== "sample_text";

    return fetch(`${ServerUrl}/${documentId}`)
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

function save(url, saveOptions) {
  return fetch(url, saveOptions);
}

function create(url, saveOptions) {
  return save(url, saveOptions);
}

function update(response, url, saveOptions) {
  const newBody = JSON.parse(saveOptions.body);
  newBody._rev = response._rev;
  const newOptions = _.extend(saveOptions, {body: JSON.stringify(newBody)});
  return save(url, newOptions);
}

export function saveText(docId, text, textKey) {
  const method = _.isEmpty(docId) ? "POST" : "PUT";
  const url = _.isEmpty(docId) ? ServerUrl : `${ServerUrl}/${docId}`;
  const body = {};
  body[textKey] = text;
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  const saveOptions = {
    method,
    headers,
    mode: "cors",
    cache: "default",
    body: JSON.stringify(body),
  };

  return (dispatch) => {
    fetch(url)
    .then((response) => {
      let next = null;
      if (response.status === 404) {
        next = create(url, saveOptions);
      } else {
        next = update(response.json(), url, saveOptions);
      }
      return next;
    })
    .then((response) => {
      dispatch({type: "DOCUMENT_SAVED", response});
    })
    .catch((ex) => {
      console.warn("Exception catched", ex);
    });
  };
}

