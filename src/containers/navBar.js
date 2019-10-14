import React, { Component } from "react";
import arrow from "../arrow.png";
import { Router, Link } from "react-router-dom";
import { connect } from "react-redux";

class Navbar extends Component {
  state = {
    percentage: 0
  };

  componentDidMount = () => {
    let l = this.props.pageState.length;
    if (this.props.pageState.length > 0) {
      let len =
        l === 0
          ? 0
          : l === 1
          ? 20
          : l === 2
          ? 40
          : l === 3
          ? 60
          : l === 4
          ? 80
          : 0;
      this.setState({
        percentage: len
      });
    }
  };
  render() {
    return (
      <div>
        <nav className="navbar logo-nav ">
          <Link className="navbar-brand  m-auto" to="/">
            <h2 className="logo-text"> Watoobi</h2>
          </Link>
        </nav>
        <div>
          <nav className="navbar navbar-expand-lg navbar-light steps-nav ">
            <div
              className=" navbar-collapse steps-border pl-md-4 pr-md-4 pt-md-1 pb-md-1"
              id="navbarNavAltMarkup"
            >
              <div className="navbar-nav">
                <div className="steps-bar">
                  <Link
                    className="nav-item nav-link  "
                    to="/personal-info"
                    style={{
                      pointerEvents: this.props.pageState[0] ? "" : "none"
                    }}
                  >
                    <span
                      className={`btn btn-secondary step-count ${
                        this.props.pageState[0] ? "clr-green" : ""
                      }`}
                    >
                      1
                    </span>{" "}
                    <span className="step-name">Personal Info</span>
                  </Link>
                  <img src={arrow} alt="" width="10" />
                  <Link
                    className="nav-item nav-link"
                    to="/professional-info"
                    style={{
                      pointerEvents: this.props.pageState[1] ? "" : "none"
                    }}
                  >
                    <span
                      className={`btn btn-secondary step-count ${
                        this.props.pageState[1] ? "clr-green" : ""
                      }`}
                    >
                      2
                    </span>{" "}
                    <span className="step-name">Professional Info</span>
                  </Link>
                  <img src={arrow} alt="" width="10" />
                  <Link
                    className="nav-item nav-link"
                    to="/expertise"
                    style={{
                      pointerEvents: this.props.pageState[2] ? "" : "none"
                    }}
                  >
                    <span
                      className={`btn btn-secondary step-count ${
                        this.props.pageState[2] ? "clr-green" : ""
                      }`}
                    >
                      3
                    </span>{" "}
                    <span className="step-name">Expertise</span>
                  </Link>
                  <img src={arrow} alt="" width="10" />
                  <Link
                    className="nav-item nav-link"
                    to="/services"
                    style={{
                      pointerEvents: this.props.pageState[3] ? "" : "none"
                    }}
                  >
                    <span
                      className={`btn btn-secondary step-count ${
                        this.props.pageState[3] ? "clr-green" : ""
                      }`}
                    >
                      4
                    </span>{" "}
                    <span className="step-name">Services</span>
                  </Link>
                  <img src={arrow} alt="" width="10" />
                  <Link
                    className="nav-item nav-link "
                    to="/payments"
                    style={{
                      pointerEvents: this.props.pageState[4] ? "" : "none"
                    }}
                  >
                    <span
                      className={`btn btn-secondary step-count ${
                        this.props.pageState[4] ? "clr-green" : ""
                      }`}
                    >
                      5
                    </span>{" "}
                    <span className="step-name">Payments</span>
                  </Link>
                </div>
              </div>

              <div className="progressBar">
                <span className="progress-text  ml-auto w-100">
                  Completion Rate: {this.state.percentage}%
                </span>
                <div className="progress ml-auto w-100">
                  <div
                    className="progress-bar bg"
                    role="progressbar"
                    style={{ width: `${this.state.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  pageState: state.pages.pageState
});

export default connect(
  mapStateToProps,
  {}
)(Navbar);
