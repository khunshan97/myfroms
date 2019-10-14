import { LOGIN } from "../actions/types";

const initialState = {
  facebook: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        facebook: action.payload
      };
    default:
      return state;
  }
}
