import { SAVE_PAGE_STATE } from "./types";

// Save Page
export const savePage = (state, page) => dispatch => {
  console.log(state);
  dispatch({ type: SAVE_PAGE_STATE, payload: { state: state, id: page } });
};
