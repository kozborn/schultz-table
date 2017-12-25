import Immutable from "immutable";
import notificationCreator from './notification';

const PREFERENCES = {
  fixationsSettings: {
    speed: 1000,
    blockSize: 8,
    index: 0,
  },
  schultzTable: {
    rows: 3,
    cols: 3,
  },
};

function app(state = Immutable.Map({
  isFetching: false,
  defaultDoc: Immutable.Map({}),
  defaultPreferences: Immutable.fromJS(PREFERENCES),
  notification: Immutable.Map(),
}), action) {
  switch (action.type) {
    case "FETCHING_DEFAULT_DOC":
      return state.set("isFetching", true);
    case "DEFAULT_DOC_FETCHED":
      return state.withMutations((s) => {
        s.set("defaultDoc", Immutable.fromJS(action.response));
        s.set("isFetching", false);
      });
    case "FETCHING_ERROR":
      return state.withMutations((s) => {
        s.set('notification', notificationCreator('response-error', Immutable.fromJS(action.response)));
        s.set('isFetching', false);
      });
    case "UPDATE_TEXT": {
      const { path, text } = action;
      return state.setIn(path, Immutable.fromJS(text));
    }
    case "SHOW_NOTIFICATION":
      return state.set('notification', Immutable.fromJS(action.notification));
    case "CLOSE_NOTIFICATION":
      return state.set('notification', Immutable.Map());
    default:
      return state;
  }
}

export default app;
