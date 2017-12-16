import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Immutable from 'immutable';
import {
  Editor,
  EditorState,
  ContentState,
  convertFromRaw,
  CompositeDecorator,
} from 'draft-js';

export const getInitialState = (initialText, decorator = null) => {
  let initialContentState;
  if (initialText instanceof ContentState) {
    initialContentState = EditorState.createWithContent(initialText, decorator);
  } else if (Immutable.Map.isMap(initialText) && !initialText.isEmpty()) {
    const state = convertFromRaw(initialText.toJS());
    initialContentState = EditorState.createWithContent(state, decorator);
  } else if (typeof initialText === 'string') {
    const state = ContentState.createFromText(initialText);
    initialContentState = EditorState.createWithContent(state, decorator);
  } else {
    initialContentState = EditorState.createEmpty(decorator);
  }
  return initialContentState;
};

export const findWithRegex = (regex, contentBlock, callback) => {
  const text = contentBlock.getText();
  let matchArr;
  let start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
};

const MATCH_WORD = /[\w]+/g;
const MATCH_ANYTHING_BUT_WHITESPACE = /[\S]+/g;
const handleStrategy = (contentBlock, callback, contentState) => {
  findWithRegex(MATCH_ANYTHING_BUT_WHITESPACE, contentBlock, callback);
};

export const wrapEachWordWithSpanAndAddCoverDraft = (text, component) => {
  const decorator = new CompositeDecorator([{
    component,
    strategy: handleStrategy,
  }]);
  return new Promise((resolve) => {
    const contentState = getInitialState(text, decorator);
    resolve(contentState);
  });
};

export const renderEditorToString = (state) => {
  return new Promise((resolve) => {
    const stringEditor = ReactDOMServer.renderToStaticMarkup(
      <Editor
        readOnly
        editorState={state}
      />);
    resolve(stringEditor);
  });
};

export const getDraftTextSnippet = initialText =>
  initialText.update('blocks', blocks => blocks.take(2));

const splitLineBy = (length, contentBlock, callback) => {
  const text = contentBlock.getText();
  const words = text.split(' ');
  const sentences = [];
  let sentence = '';
  for (let i = 0; i < words.length; i++) {
    sentence = sentence.concat(words[i], " ");
    if (sentence.length > length) {
      sentences.push(sentence);
      sentence = '';
    }
  }
  if (sentence !== '') {
    sentences.push(sentence);
  }
  let start = 0;
  let end = 0;
  sentences.forEach((sentence) => {
    end = start + sentence.length;
    callback(start, end);
    start += sentence.length;
  });
};

export const fixationTextFromDraftJS = (component, text, splitLength = 50) => {
  const splitLine = (contentBlock, callback, contentState) => {
    splitLineBy(splitLength, contentBlock, callback);
  };
  const decorator = new CompositeDecorator([{
    component,
    strategy: splitLine,
  }]);

  return getInitialState(text, decorator);
};
