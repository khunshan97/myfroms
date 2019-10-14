import React, { Component } from "react";
import DropDown from "../components/dropDown";
import InputField from "../components/inputField";
import axios from "axios";
import { connect } from "react-redux";
import { savePage } from "../actions/pages";
import uploadIcon from "../upload.svg";
import uploadIcon2 from "../uploadfilled.svg";
import { Redirect } from "react-router-dom";
import Navbar from "./navBar";

class Payments extends Component {
  state = {
    bank_options: [],
    branches_options: [],
    branches: [],
    id_number: "",
    tax_file: "",
    account_holder_name: "",
    bank_id: "",
    bank_branch_id: "",
    account_number: "",
    all_requiredFields_flag: false,
    icon: true,
    success: false,
    tax_file_uploaded: false,
    errors: []
  };

  files = e => {
    console.log(e.target.files);
    if (e.target.files.length > 0) {
      this.setState({
        icon: false
      });
    }
  };

  componentDidMount = () => {
    if (this.props.pageState.length > 0) {
      this.props.pageState.forEach(page => {
        if (page.id === 4) {
          this.setState(page.state, () => this.setState({ redirect: false }));
          return;
        }
      });
    }
    var proxyUrl = "",
      targetUrl =
        "https://wtbe-249306.appspot.com/users/get_accounting_form_data";
    fetch(proxyUrl + targetUrl)
      .then(res => res.json())
      .then(
        result => {
          let b_options = Object.keys(result.branches).map(function(key) {
            return [Number(key), result.branches[key]];
          });

          this.setState({
            bank_options: result.banks,
            branches_options: b_options
          });
        },
        error => {
          console.log(error);
        }
      );
  };

  handleBankChange = e => {
    console.log(e.target);
    let arr = this.state.branches_options;

    for (let i = 0; i < arr.length; i++) {
      if (arr[i][0] == e.target.value) {
        this.setState({
          branches: [{ id: arr[i][1].id, text: arr[i][1].text }],
          bank_id: e.target.value,
          bank_branch_id: arr[i][1].id + ""
        });
      }
    }
  };

  files = e => {
    this.setState({ tax_file: e.target.files[0], tax_file_uploaded: true });
    if (e.target.files.length > 0) {
      this.setState({
        icon: false
      });
    }
  };

  onSubmit = async () => {
    let e = [...this.state.errors];
    e[0] = this.state.account_holder_name.length === 0 ? true : false;
    e[1] = this.state.bank_id.length === 0 ? true : false;
    e[2] = this.state.bank_branch_id.length === 0 ? true : false;
    e[3] = this.state.account_number.length === 0 ? true : false;

    this.setState({ errors: [...e] });
    if (!e.includes(true)) {
      const payment = {
        id_number: this.state.id_number,
        tax_file: this.state.tax_file,
        account_holder_name: this.state.account_holder_name,
        bank_id: this.state.bank_id,
        bank_branch_id: this.state.bank_branch_id,
        account_number: this.state.account_number
      };

      const res = await axios.post(
        "https://wtbe-249306.appspot.com/users/update_user_info",
        payment
      );
      // .then(res => {
      console.log(res);
      this.props.savePage(this.state, 4);
      this.setState({ redirect: true });
      // })
      // .catch(err => {
      //   console.log(err);
      //   window.alert("Error");
      // });
    }
  };
  render() {
    if (this.state.redirect) {
      return <Redirect to="/thank-you" />;
    }
    const icon = this.state.icon ? uploadIcon : uploadIcon2;
    return (
      <>
        <Navbar />
        <div className="wrap mb-5">
          <div className="wrapper">
            <div className="text-left border-bottom header-section">
              <p className="text-desc hide">Step 2 of 5</p>
              <h2 className="page-title">Payment</h2>
              <p>
                <small className="text-muted">
                  Please tell us about your professional background
                </small>
              </p>
            </div>
            <div className="row">
              <div className="col-lg-11">
                <p className="italic">* Mendatory fields </p>
              </div>
            </div>
            <div className="row mb-2 w-100 text-left mt-2 mt-lg-5">
              <div className="col-lg-1" />
              <div className="col-lg-2 ">
                <h4 className="pi-lables p-0">ID *</h4>
              </div>
              <div className="col-lg-1" />
              <InputField
                classes="col-lg-6"
                placeholder="ID #"
                name="id"
                type="text"
                onChange={e => {
                  this.setState({ id_number: e.target.value });
                }}
                value={this.state.id_number}
              />
              <div className="col" />
            </div>

            <div className="row mb-2 w-100  text-left">
              <div className="col-lg-1" />
              <div className="col-lg-3 ">
                <h4 className="pi-lables p-0">Tax Document</h4>
                <p className="text-left text-desc">
                  Please choose a Tax file to upload. Let potential buyers know
                  what you do best and how you gained your skills,
                  certifications and experience
                </p>
              </div>
              {/* <div className="col-lg-1" /> */}
              <div className="col-lg-6 d-flex align-items-center">
                <div className="input--file">
                  <span>
                    <img src={icon} alt="" height="35" width="35" />
                  </span>
                  <input
                    name="Select File"
                    type="file"
                    onChange={this.files}
                    style={{
                      width: "45px"
                    }}
                  />
                </div>
              </div>
              <div className="col" />
            </div>

            <div className="row mb-2 w-100  text-left">
              <div className="col-lg-1" />
              <div className="col-lg-2 ">
                <h4 className="pi-lables p-0">Bank Details *</h4>
              </div>
              <div className="col-lg-1" />
              <InputField
                classes="col-lg-3 pr-6px"
                placeholder="Owner"
                name="owner"
                type="text"
                onChange={e => {
                  this.setState({ account_holder_name: e.target.value });
                }}
                value={this.state.account_holder_name}
                error={this.state.errors[0]}
                message="Account Holder Name is required"
              />
              <DropDown
                classes="col-lg-3 pl-6px pt-2 pt-lg-0 pt-xl-0"
                options={this.state.bank_options}
                onChange={e => {
                  this.handleBankChange(e);
                }}
                error={this.state.errors[1]}
                message="Bank is required"
              />
              <div className="col" />
            </div>

            <div className="row mb-4 w-100 s">
              <div className="col-lg-4" />

              <DropDown
                classes="col-lg-3 pr-6px pt-2 pt-lg-0 pt-xl-0"
                placeholder="Branch #"
                name="branch"
                type="text"
                options={this.state.branches}
                onChange={e => {
                  this.setState({
                    bank_branch_id: e.target.value
                  });
                }}
                error={this.state.errors[2]}
                message="Bank Branch is required"
              />
              <InputField
                classes="col-lg-3 pl-6px pt-2 pt-lg-0 pt-xl-0"
                placeholder="Account #"
                name="account"
                type="text"
                onChange={e => {
                  this.setState({
                    account_number: e.target.value
                  });
                }}
                error={this.state.errors[0]}
                message="Account Number is required"
              />
              <div className="col" />
            </div>
          </div>

          <div className="row mt-5 w-100">
            <div
              className="col-lg-6 offset-lg-4"
              style={{ paddingRight: "34px", paddingLeft: "26px" }}
            >
              {/* <Link className="btn btn-secondary link mr-2" to="services">Back</Link> */}
              <button
                className="btn btn-success w-100 btn-block link link-success"
                onClick={this.onSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  pageState: state.pages.pageState
});

export default connect(
  mapStateToProps,
  { savePage }
)(Payments);
