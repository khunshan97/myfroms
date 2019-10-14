import React, { Component } from "react";
import FacebookLogin from "react-facebook-login";
import { login } from "../../actions/session";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";

class Login extends Component {
  static propTypes = {
    login: PropTypes.func,
    fb_session: PropTypes.object
  };

  state = {
    isLoggedIn: false,
    name: "",
    picture: ""
  };

  componentClicked = () => console.log("clicked");
  responseFacebook = async response => {
    if (response.status !== "unknown") {
      await this.props.login(response);
      this.setState({
        isLoggedIn: true,
        name: response.name,
        picture: response.picture.data.url
      });
    } else {
      window.alert("Login Failed");
    }
  };

  render() {
    let fbContent;
    if (this.state.isLoggedIn) {
      return <Redirect to="/personal-info" />;
    } else {
      fbContent = (
        <FacebookLogin
          appId="470325516890356"
          autoLoad={true}
          fields="name,email,picture"
          onClick={this.componentClicked}
          callback={this.responseFacebook}
        />
      );
    }
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh"
        }}
      >
        {fbContent}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    fb_session: state.session.facebook
  };
};

export default connect(
  mapStateToProps,
  { login }
)(Login);
