import React, {Component} from "react";
import DropDown from "../components/dropDown";
import InputField from "../components/inputField";
import axios from "axios";
import {connect} from "react-redux";
import {savePage} from "../actions/pages";
import {Redirect} from "react-router-dom";
import Navbar from "./navBar";

class PersonalInfo extends Component {
    state = {
        age_range_options: [],
        gender_options: [],
        referral_options: [],
        first_name: "",
        last_name: "",
        age_range: "",
        gender: "",
        email: "",
        phone: "",
        referral: "",
        marketing_emails_accepted: false,
        tos: false,
        errors: [
            {message: "first name field is necessary", flag: false},
            {message: "last name field is necessary", flag: false},
            {message: "email field is necessary", flag: false},
            {message: "phone field is necessary", flag: false},
            {message: "age field is necessary", flag: false},
            {message: "gender field is necessary", flag: false},
            {message: "referral field is necessary", flag: false},
            {message: "Please Accept Terms & Conditions", flag: false}
        ],
        success: false
    };

    componentDidMount = () => {
        if (this.props.pageState.length > 0) {
            this.props.pageState.forEach(page => {
                if (page.id === 0) {
                    this.setState(page.state, () => this.setState({redirect: false}));
                    return;
                }
            });
        }
        var proxyUrl = "",
            targetUrl =
                this.props.serverUrl + "/users/get_personal_info_form_data";
        fetch(proxyUrl + targetUrl)
            .then(res => res.json())
            .then(
                result => {
                    this.setState({
                        age_range_options: result.age_range,
                        referral_options: result.referral,
                        gender_options: result.gender
                    });
                },
                error => {
                    console.log(error);
                }
            );
    };

    onSubmit = async () => {
        if (
            this.state.first_name.length > 0 &&
            this.state.last_name.length > 0 &&
            this.state.email.length > 0 &&
            this.state.gender.length > 0 &&
            this.state.age_range.length > 0 &&
            this.state.referral.length > 0 &&
            this.state.phone.length > 0 &&
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                this.state.email
            ) &&
            this.state.tos
        ) {
            const personalInfo = {
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                email: this.state.email,
                gender: this.state.gender,
                age_range: this.state.age_range.toString(),
                phone: this.state.phone.toString(),
                referral: this.state.referral,
                marketing_emails_accepted: this.state.marketing_emails_accepted,
                tos_accepted: this.state.tos
            };
            console.log(personalInfo);
            const res = await axios.post(
                this.props.serverUrl + "/users/update_user_info",
                personalInfo, {withCredentials: true}
            );
            console.log(res);
            this.props.savePage(this.state, 0);
            this.setState({redirect: true});
        } else {
            this.setState({
                errors: [
                    {
                        message: "first name field is necessary",
                        flag: this.state.first_name.length > 0 ? false : true
                    },
                    {
                        message: "last name field is necessary",
                        flag: this.state.last_name.length > 0 ? false : true
                    },
                    {
                        message:
                            this.state.email.length > 0
                                ? /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                                this.state.email
                                )
                                ? ""
                                : "Please enter a valid email address"
                                : "email field is necessary",
                        flag:
                            this.state.email.length > 0
                                ? /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(
                                this.state.email
                                )
                                ? false
                                : true
                                : true
                    },
                    {
                        message: "phone field is necessary",
                        flag: this.state.phone.length > 0 ? false : true
                    },
                    {
                        message: "age field is necessary",
                        flag: this.state.age_range.length > 0 ? false : true
                    },
                    {
                        message: "gender field is necessary",
                        flag: this.state.gender.length > 0 ? false : true
                    },
                    {
                        message: "referral field is necessary",
                        flag: this.state.referral.length > 0 ? false : true
                    },
                    {
                        message: "Please Accept Terms & Conditions",
                        flag: this.state.tos ? false : true
                    }
                ]
            });
        }
    };

    render() {
        if (this.state.redirect) {
            return <Redirect to="/professional-info"/>;
        }

        return (
            <>
                <Navbar/>
                <div className="wrap mb-5">
                    <div className="wrapper">
                        <div className="text-left border-bottom header-section">
                            <p className="text-desc hide">Step 1 of 5</p>
                            <h2 className="page-title">Personal Info</h2>
                            <p>
                                <small className="text-muted">
                                    Please tell us about your professional background
                                </small>
                            </p>
                        </div>
                        <div className="row">
                            <div className="col-lg-11">
                                <p className="italic">* Mendatory fields</p>
                            </div>
                        </div>
                        <div>
                            <div className="row mb-2 w-100 text-left mt-2 mt-lg-5">
                                <div className="col-lg-1"/>
                                <div className="col-lg-2 ">
                                    <h4 className="pi-lables">Full Name *</h4>
                                </div>
                                <div className="col-lg-1"/>
                                <InputField
                                    classes="col-lg-3 pr-6px"
                                    placeholder="First Name"
                                    name="fname"
                                    type="text"
                                    value={this.state.first_name}
                                    onChange={e => {
                                        let error = this.state.errors;
                                        error[0].flag = false;
                                        this.setState({
                                            first_name: e.target.value,
                                            errors: error
                                        });
                                    }}
                                    error={this.state.errors[0].flag}
                                    message={this.state.errors[0].message}
                                />

                                <InputField
                                    classes="col-lg-3 pl-6px pt-1 pt-lg-0 pt-xl-0"
                                    placeholder="Last Name"
                                    name="lname"
                                    type="text"
                                    value={this.state.last_name}
                                    onChange={e => {
                                        let error = this.state.errors;
                                        error[1].flag = false;
                                        this.setState({last_name: e.target.value, errors: error});
                                    }}
                                    error={this.state.errors[1].flag}
                                    message={this.state.errors[1].message}
                                />
                                <div className="col"/>
                            </div>
                            <div className="row mb-2 w-100 text-left">
                                <div className="col-lg-1"/>
                                <div className="col-lg-2 ">
                                    <h4 className="pi-lables">Email *</h4>
                                </div>
                                <div className="col-lg-1"/>
                                <InputField
                                    classes="col-lg-6"
                                    placeholder="Email"
                                    name="email"
                                    type="email"
                                    value={this.state.email}
                                    onChange={e => {
                                        let error = this.state.errors;
                                        error[2].flag = false;
                                        this.setState({email: e.target.value, errors: error});
                                    }}
                                    error={this.state.errors[2].flag}
                                    message={this.state.errors[2].message}
                                />
                                <div className="col"/>
                            </div>
                            <div className="row mb-2 w-100 text-left">
                                <div className="col-lg-1"/>
                                <div className="col-lg-2 ">
                                    <h4 className="pi-lables">Phone</h4>
                                </div>
                                <div className="col-lg-1"/>
                                <InputField
                                    classes="col-lg-6"
                                    placeholder="Phone #"
                                    name="phone"
                                    type="number"
                                    value={this.state.phone}
                                    onChange={e => {
                                        let error = this.state.errors;
                                        error[3].flag = false;
                                        this.setState({phone: e.target.value, errors: error});
                                    }}
                                    error={this.state.errors[3].flag}
                                    message={this.state.errors[3].message}
                                />
                                <div className="col"/>
                            </div>

                            <div className="row mb-2 w-100 text-left">
                                <div className="col-lg-1"/>
                                <div className="col-lg-2 ">
                                    <h4 className="pi-lables">Age *</h4>
                                </div>
                                <div className="col-lg-1"/>
                                <DropDown
                                    classes="col-lg-6"
                                    placeholder="Select Age"
                                    options={this.state.age_range_options}
                                    value={this.state.age_range}
                                    error={this.state.errors[4].flag}
                                    message={this.state.errors[4].message}
                                    onChange={e => {
                                        let error = this.state.errors;
                                        error[4].flag = false;
                                        this.setState({age_range: e.target.value, errors: error});
                                    }}
                                />
                                <div className="col"/>
                            </div>

                            <div className="row mb-2 w-100  text-left">
                                <div className="col-lg-1"/>
                                <div className="col-lg-2 ">
                                    <h4 className="pi-lables">Gender</h4>
                                </div>
                                <div className="col-lg-1"/>
                                <DropDown
                                    classes="col-lg-6"
                                    placeholder="Select Gender"
                                    options={this.state.gender_options}
                                    value={this.state.gender}
                                    onChange={e => {
                                        let error = this.state.errors;
                                        error[5].flag = false;
                                        this.setState({gender: e.target.value, errors: error});
                                    }}
                                    error={this.state.errors[5].flag}
                                    message={this.state.errors[5].message}
                                />
                                <div className="col"/>
                            </div>

                            <div className="row w-100 mb-1">
                                <div className="col-lg-4"/>
                                <div className="col-lg-6">
                                    <label>
                                        <small className="form-text text-muted text-center">
                                            How did you Hear about Us ?
                                        </small>
                                    </label>
                                </div>
                                <div className="col"/>
                            </div>

                            <div className="row w-100 mb-3">
                                <div className="col-lg-4"/>

                                <DropDown
                                    classes="col-lg-6"
                                    placeholder="Source"
                                    options={this.state.referral_options}
                                    value={this.state.referral}
                                    onChange={e => {
                                        let error = this.state.errors;
                                        error[6].flag = false;
                                        this.setState({referral: e.target.value, errors: error});
                                    }}
                                    error={this.state.errors[6].flag}
                                    message={this.state.errors[6].message}
                                />

                                <div className="col"/>
                            </div>

                            <div className="row w-100">
                                <div className="col-lg-4"/>

                                <div className="col-lg-4 d-flex justify-content-flex-start">
                                    <div className="form-group form-check d-flex align-items-center pl-0">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="tos"
                                            checked={this.state.tos}
                                            onChange={e => {
                                                let error = this.state.errors;
                                                error[7].flag = false;
                                                this.setState({
                                                    tos: !this.state.tos,
                                                    errors: error
                                                });
                                            }}
                                        />
                                        <label htmlFor="tos" className="form-check-label">
                                            I read Watoobi's Terms and Conditions
                                        </label>
                                    </div>
                                </div>
                                <div className="col"/>
                            </div>

                            <div className="row w-100 mb-2">
                                <div className="col-lg-4"/>

                                <div className="col-lg-6 d-flex justify-content-flex-start">
                                    <div className="form-group form-check d-flex align-items-center pl-0">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="marketing"
                                            checked={this.state.marketing_emails_accepted}
                                            onChange={() =>
                                                this.setState({
                                                    marketing_emails_accepted: !this.state
                                                        .marketing_emails_accepted
                                                })
                                            }
                                        />
                                        <label htmlFor="marketing" className="form-check-label">
                                            I agree to recieve Markeeting Emails
                                        </label>
                                    </div>
                                </div>
                                <div className="col"/>
                            </div>
                            <div className="row w-100">
                                <div className="col-lg-4"/>

                                <div className="col-lg-4 d-flex justify-content-flex-start">
                                    <div className="form-group form-check d-flex align-items-center pl-0">
                                        {this.state.errors[7].flag && (
                                            <p
                                                style={{
                                                    color: "red",
                                                    fontSize: "12px",
                                                    textAlign: "left"
                                                }}
                                            >
                                                {this.state.errors[7].message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="col"/>
                            </div>

                            <div className="row w-100 mb-2">
                                <div className="col-lg-4"/>

                                <div className="col-lg-6 text-center">
                                    <button
                                        id="personalInfo-btn"
                                        className="btn btn-success w-100 btn-block link link-success"
                                        onClick={this.onSubmit}
                                    >
                                        Continue
                                    </button>
                                </div>
                                <div className="col"/>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => ({
    pageState: state.pages.pageState,
    serverUrl: state.config.serverUrl,
});

export default connect(
    mapStateToProps,
    {savePage}
)(PersonalInfo);
