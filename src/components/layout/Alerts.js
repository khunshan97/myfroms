import React, {Component, Fragment} from 'react'
import {withAlert} from 'react-alert'
import PropTypes from 'prop-types'
import {connect} from "react-redux";

export class Alerts extends Component {

    static propTypes = {
        error: PropTypes.object.isRequired,
        message: PropTypes.object.isRequired
    }

    componentDidUpdate(prevProps) {
        const {error, alert, message} = this.props
        if (error != prevProps.error) {
            alert.error('There is an error')
        }

        if (message != prevProps.message) {
            alert.success(message.msg)
        }
    }

    render() {
        return <Fragment/>
    }
}

const mapStateToProps = state => ({
    error: state.errors,
    message: state.messages
})

export default connect(mapStateToProps)(withAlert()(Alerts))
