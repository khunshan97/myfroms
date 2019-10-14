import React, { Fragment } from "react";
import ReactDom from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import { Provider } from "react-redux";
import store from "./store";
import "bootstrap/dist/css/bootstrap.css";

import { Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import Login from "./components/login/Login";
import "./App.css";
import "./index.css";
import PersonalInfo from "./containers/personalInfo";
import ProfessionalInfo from "./containers/professionalInfo";
import Payments from "./containers/Payments";
import Services from "./containers/services";
import ThankYou from "./containers/ThankYou";
import Navbar from "./containers/navBar";
import Expertise from "./containers/Expertise";
import ProtectedRoute from "./components/login/ProtectedRoute";
import LoginRedirect from "./components/login/loginRedirect";

const alertOptions = {
  timeout: 3000,
  position: "top center"
};

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Switch>
            <Route path="/personal-info">
              <ProtectedRoute component={PersonalInfo} />
            </Route>
            <Route path="/services">
              <ProtectedRoute component={Services} />
            </Route>
            <Route path="/payments">
              <ProtectedRoute component={Payments} />
            </Route>
            <Route path="/thank-you">
              <ProtectedRoute component={ThankYou} />
            </Route>
            <Route path="/expertise">
              <ProtectedRoute component={Expertise} />
            </Route>
            <Route path="/professional-info">
              <ProtectedRoute component={ProfessionalInfo} />
            </Route>
            <Route path="/">
              <LoginRedirect component={Login} />
            </Route>
          </Switch>
        </Router>
        {/* <AlertProvider template={AlertTemplate} {...alertOptions}>
          <Fragment>
            <Login />
            <Alerts/>
          </Fragment>
        </AlertProvider> */}
      </Provider>
    );
  }
}

ReactDom.render(<App />, document.getElementById("app"));
