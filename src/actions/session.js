import axios from "axios";
import { GET_ERRORS, LOGIN } from "./types";

// GET_LEADS
export const login = fb_data => dispatch => {
  // axios.post('https://wtbe-249306.appspot.com/users/facebook_login', fbData)
  axios
    .post("https://wtbe-249306.appspot.com/users/facebook_login", {
      fb_data: fb_data,
      user_type: "mentor",
      messenger_id: "31265342641"
    })
    .then(res => {
      console.log(res);
      if (res.status === 200) {
        dispatch({ type: LOGIN, payload: res });
      } else {
        window.alert("Login Failed Error " + res.status);
      }
    })
    .catch(err => {
      window.alert(err);
      const errors = {
        msg: err.response.data,
        status: err.response.status
      };
      dispatch({
        type: GET_ERRORS,
        payload: errors
      });
    });
};
