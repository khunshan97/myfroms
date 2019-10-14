import {combineReducers} from "redux";
import session from "./session";
import errors from "./errors";
import messages from "./messages";
import pages from "./pages";
import config from "./config";

export default combineReducers({
    session,
    errors,
    messages,
    pages,
    config
});
