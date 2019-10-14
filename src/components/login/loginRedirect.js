import React from "react";
import {Redirect} from "react-router-dom";
import {connect} from "react-redux";

const LoginRedirect = props => {
    const Component = props.component;
    return props.login && !props.localDev ? <Component/> : <Redirect to="/personal-info"/>;
};

const mapStateToProps = state => ({
    login: state.session.facebook.data ? false : true,
    localDev: state.config.localDev
});

export default connect(
    mapStateToProps,
    {}
)(LoginRedirect);
