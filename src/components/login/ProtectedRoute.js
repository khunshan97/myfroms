import React from "react";
import {Redirect} from "react-router-dom";
import {connect} from "react-redux";

const ProtectedRoute = props => {
    const Component = props.component;
    return props.login || props.localDev ? <Component/> : <Redirect to="/"/>;
};

const mapStateToProps = state => ({
    login: state.session.facebook.data ? true : false,
    localDev: state.config.localDev

});

export default connect(
    mapStateToProps,
    {}
)(ProtectedRoute);
