import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit'
import { rootReducer } from './reducers';
import { setPath, setFoundedPath, clearFoundedPath } from './slices/board';

// for creating animation of path-finding using listenerApi.delay();
// And cancelling animation of path-finding
const setPathListener = createListenerMiddleware();

setPathListener.startListening({
  actionCreator: setPath,
  effect: async (action, listenerApi) => {
    const path = Object.assign([], listenerApi.getState().board.path); // harus terpisah kaya gini kalo gak error
    const { start, end} = Object.assign([], listenerApi.getState().board); // supaya nanti di splice gak mutate yang di state (immerjs)
    if (start === null || end === null) return;
    if (path.length === 0) {
      return alert('The end node is not reachable! Please try to remove some walls.');
    }
    // cancelling animation of prev path-finding
    listenerApi.cancelActiveListeners();
    path.splice(0, 1);
    path.splice(path.length - 1, 1);
    for (let i = 0; i < path.length; i++) {
      await listenerApi.delay(40);
      const box = path[i];
      listenerApi.dispatch(setFoundedPath(box));
    }
  }
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(setPathListener.middleware)
})

export { store };