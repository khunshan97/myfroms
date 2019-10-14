import { SAVE_PAGE_STATE } from "../actions/types";

const initialState = {
  pageState: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SAVE_PAGE_STATE:
      let i = -1;
      state.pageState.forEach((pageSt, index) => {
        if (pageSt.id === action.payload.id) {
          i = index;
        }
      });
      if (i === -1) {
        return {
          ...state,
          pageState: [...state.pageState, action.payload]
        };
      } else {
        state.pageState[i] = action.payload;
        return {
          ...state,
          pageState: [...state.pageState]
        };
      }

    default:
      return state;
  }
}
