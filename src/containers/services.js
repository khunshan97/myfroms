import React, { Component } from "react";
import Multiselect from "../components/Multiselect/index";
import DropDown from "../components/dropDown";
import InputField from "../components/inputField";
import ReactTags from "react-tag-autocomplete";
import axios from "axios";
import editIcon from "../edit.svg";
import { connect } from "react-redux";
import { savePage } from "../actions/pages";
import deleteIcon from "../delete.svg";
import { Redirect } from "react-router-dom";
import Navbar from "./navBar";

class Services extends Component {
  state = {
    cities_option: [],
    compensation_option: [],
    occupations_option: [],
    service_types_option: [],
    frequency_option: [],
    inputs: {
      service_type: "",
      occupation_ids: [],
      min_participants: "",
      max_participants: "",
      frequency: "",
      locations: [],
      existing_venture: false,
      description: "",
      compensation: ""
    },
    tableAndFormFlags: [
      {
        table: false,
        form: {
          new: true,
          edit: -1
        }
      }
    ],
    services: [],
    errors: [false, false, false, false, false, false, false, false]
  };

  componentDidMount = () => {
    if (this.props.pageState.length > 0) {
      this.props.pageState.forEach(page => {
        if (page.id === 3) {
          this.setState(page.state, () => this.setState({ redirect: false }));
          return;
        }
      });
    }
    var proxyUrl = "",
      targetUrl =
        "https://wtbe-249306.appspot.com/users/get_services_form_data";
    fetch(proxyUrl + targetUrl)
      .then(res => res.json())
      .then(
        result => {
          result.occupations.forEach(element => {
            element.value = element.id.toString();
            element.name = element.text;
          });
          let freq = [];
          for (let i = 1; i < 11; i++) {
            freq.push({
              id: i.toString(),
              text: i.toString()
            });
          }
          freq.push({
            id: "-1",
            text: "Unlimited"
          });

          result.cities.forEach(element => {
            element.name = element.text;
          });
          this.setState({
            cities_option: [...result.cities],
            compensation_option: [...result.compensation],
            occupations_option: [...result.occupations],
            service_types_option: [...result.service_types],
            frequency_option: [...freq]
          });
        },
        error => {
          console.log(error);
        }
      );
  };

  onSubmit = async () => {
    let e = [...this.state.errors];
    e[0] = this.state.services.length === 0 ? true : false;
    this.setState({ errors: [...e] });
    if (!e[0]) {
      const res = await axios.post(
        "https://wtbe-249306.appspot.com/users/add_mentor_services",
        this.state.services
      );
      // .then(res => {
      console.log(res);
      this.props.savePage(this.state, 3);
      this.setState({ redirect: true });
      // })
      // .catch(err => {
      //   console.log(err);
      //   window.alert("Error");
      // });
    }
  };

  submitNewService = index => {
    let e = [...this.state.errors];

    e[1] = this.state.inputs.service_type.length == 0 ? true : false;
    e[2] = this.state.inputs.occupation_ids.length == 0 ? true : false;
    e[3] = this.state.inputs.frequency.length == 0 ? true : false;
    e[4] = this.state.inputs.compensation.length == 0 ? true : false;
    e[5] =
      this.state.inputs.service_type !== "PH" &&
      this.state.inputs.locations.length == 0
        ? true
        : false;
    e[6] =
      this.state.inputs.service_type == "MU" &&
      this.state.inputs.min_participants.length == 0
        ? true
        : false;
    e[7] =
      this.state.inputs.service_type == "MU" &&
      this.state.inputs.max_participants.length == 0
        ? true
        : false;

    this.setState({ errors: [...e] });
    if (!e.splice(1, 7).includes(true)) {
      let serv = [...this.state.services];
      if (index === -1) {
        serv.push({ ...this.state.inputs });
      } else {
        serv[index] = { ...this.state.inputs };
      }
      e[0] = false;
      this.setState({ services: serv }, () => {
        let tff = [...this.state.tableAndFormFlags];
        tff[0].form.new = false;
        tff[0].form.edit = -1;
        tff[0].table = true;
        this.setState({
          tableAndFormFlags: tff,
          inputs: { ...this.state.inputs },
          errors: e
        });
      });
    }
  };

  clearServicesEntries = () => {
    const clear = {
      service_type: this.state.service_types_option[0].id,
      occupation_ids: [],
      min_participants: "",
      max_participants: "",
      frequency: this.state.frequency_option[0].id,
      locations: [],
      existing_venture: false,
      description: "",
      compensation: ""
    };
    this.setState({
      inputs: { ...clear }
    });
  };

  editServicesEntry = i => {
    let tff = [...this.state.tableAndFormFlags];
    tff[0].form.new = false;
    tff[0].form.edit = i;
    this.setState({
      inputs: { ...this.state.services[i] },
      tableAndFormFlags: [...this.state.tableAndFormFlags]
    });
  };

  idToText = (id, arr) =>
    arr.find(a => {
      if (a.id == id) {
        return a.text.toString();
      }
    }).text;

  render() {
    if (this.state.redirect) {
      return <Redirect to="/payments" />;
    }
    return (
      <>
        <Navbar />
        <div className="wrap mb-5">
          <div className="wrapper text-left">
            <div className="text-left border-bottom header-section">
              <p className="text-desc hide">Step 2 of 5</p>
              <h2 className="page-title">Services</h2>
              <div className="four">
                <p> Please tell us about your professional background</p>
                <p>Please tell us about your professional background</p>
              </div>
              <p className="mt-3">
                <small className="text-muted">
                  Please tell us about your professional background
                </small>
              </p>
            </div>
            <div className="row mb-3">
              <div className="col-lg-11">
                <p className="italic">* Mendatory fields</p>
              </div>
            </div>
            <div className="offset-lg-1">
              {this.state.errors[0] && (
                <p
                  className="st-error"
                  style={{ fontSize: "17px", paddingLeft: "21px" }}
                >
                  Select at least one Service
                </p>
              )}
            </div>

            {this.state.tableAndFormFlags[0].form.new ||
            this.state.tableAndFormFlags[0].form.edit !== -1 ? (
              <>
                <div className="row  mb-2 mt-2 mt-lg-5">
                  <div className="col"></div>
                  <div className="col-lg-4">
                    <p className="titles">Add a service type</p>
                  </div>
                  <DropDown
                    classes="col-lg-6"
                    options={this.state.service_types_option}
                    value={this.state.inputs.service_type}
                    onChange={e => {
                      let err = [...this.state.errors];
                      err[1] = false;
                      err[0] = false;
                      let i = { ...this.state.inputs };
                      i.service_type = e.target.value;
                      this.setState({ inputs: { ...i }, errors: [...err] });
                    }}
                    error={this.state.errors[1]}
                    placeholder="Service Type"
                    message="Service is required"
                  />
                  <div className="col"></div>
                </div>
                <div className="row mb-2">
                  <div className="col"></div>
                  <div className="col-lg-4">
                    <p className="titles">
                      Choose occupations for this service type
                    </p>
                  </div>
                  <div className="col-lg-6">
                    {this.state.occupations_option.length > 0 && (
                      <Multiselect
                        options={this.state.occupations_option}
                        selected={this.state.inputs.occupation_ids}
                        onSelectOptions={o => {
                          let err = [...this.state.errors];
                          err[2] = false;
                          let i = { ...this.state.inputs };
                          i.occupation_ids = o;
                          this.setState({ inputs: { ...i }, errors: [...err] });
                        }}
                      />
                    )}
                    {this.state.occupations_option.length < 1 && (
                      <Multiselect
                        options={this.state.occupations_option}
                        selected={this.state.inputs.occupation_ids}
                        onSelectOptions={o => {
                          let err = [...this.state.errors];
                          err[2] = false;
                          let i = { ...this.state.inputs };
                          i.occupation_ids = o;
                          this.setState({ inputs: { ...i }, errors: [...err] });
                        }}
                      />
                    )}
                    {this.state.errors[2] && (
                      <p className="st-error">
                        Select at least one occupation{" "}
                      </p>
                    )}
                  </div>
                  <div className="col"></div>
                </div>
                <div className="row mb-2">
                  <div className="col"></div>
                  <div className="col-lg-4">
                    <p className="titles">Frequency per month</p>
                  </div>
                  <DropDown
                    classes="col-lg-6"
                    options={this.state.frequency_option}
                    value={this.state.inputs.frequency}
                    onChange={e => {
                      let err = [...this.state.errors];
                      err[3] = false;
                      let i = { ...this.state.inputs };
                      i.frequency = e.target.value;
                      this.setState({ inputs: { ...i }, errors: [...err] });
                    }}
                    error={this.state.errors[3]}
                    placeholder="Frequency"
                    message="Frequency is required"
                  />
                  <div className="col"></div>
                </div>
                {this.state.inputs.service_type === "MU" && (
                  <>
                    <div className="row mb-2">
                      <div className="col"></div>
                      <div className="col-lg-4">
                        <p className="titles">Min participants</p>
                      </div>
                      <InputField
                        classes="col-lg-6"
                        value={this.state.inputs.min_participants}
                        placeholder="Minimum Participants"
                        name="min_part"
                        type="number"
                        onChange={e => {
                          let err = [...this.state.errors];
                          err[6] = false;
                          let i = { ...this.state.inputs };
                          i.min_participants = e.target.value;
                          this.setState({ inputs: { ...i }, errors: [...err] });
                        }}
                        error={this.state.errors[6]}
                        message="Min Participants is required"
                      />
                      <div className="col"></div>
                    </div>
                    <div className="row mb-2">
                      <div className="col"></div>
                      <div className="col-lg-4">
                        <p className="titles">Max participants</p>
                      </div>
                      <InputField
                        classes="col-lg-6"
                        value={this.state.inputs.max_participants}
                        placeholder="Minimum Participants"
                        name="min_part"
                        type="number"
                        onChange={e => {
                          let err = [...this.state.errors];
                          err[7] = false;
                          let i = { ...this.state.inputs };
                          i.max_participants = e.target.value;
                          this.setState({ inputs: { ...i }, errors: [...err] });
                        }}
                        error={this.state.errors[7]}
                        message="Max Participants is required"
                      />
                      <div className="col"></div>
                    </div>
                  </>
                )}
                {this.state.inputs.service_type !== "PH" && (
                  <>
                    <div className="row mb-2">
                      <div className="col"></div>
                      <div className="col-lg-4">
                        <p className="titles">
                          Please indicate cities in which you can offer your
                          services
                        </p>
                      </div>
                      <div className="col-lg-6">
                        <ReactTags
                          placeholder="Enter City"
                          tags={this.state.inputs.locations}
                          suggestions={this.state.cities_option}
                          handleDelete={index => {
                            let i = { ...this.state.inputs };
                            const t = i.locations.slice(0);
                            t.splice(index, 1);
                            i.locations = [...t];
                            this.setState({ inputs: { ...i } });
                          }}
                          handleAddition={loc => {
                            let err = [...this.state.errors];
                            err[5] = false;
                            let i = { ...this.state.inputs };
                            const locations = [].concat(i.locations, loc);
                            i.locations = [...locations];
                            this.setState({
                              inputs: { ...i },
                              errors: [...err]
                            });
                          }}
                        />
                        {this.state.errors[5] && (
                          <p className="st-error">Select a location</p>
                        )}
                      </div>
                      <div className="col"></div>
                    </div>
                  </>
                )}
                {this.state.inputs.service_type === "MU" && (
                  <>
                    <div className="row mb-2">
                      <div className="col"></div>
                      <div className="col-lg-4">
                        {/* <p className="titles">I have where to host event</p> */}
                      </div>
                      <div className="col-lg-6 d-flex">
                        <input
                          type="checkbox"
                          id="venture"
                          checked={this.state.inputs.existing_venture}
                          onChange={e => {
                            let i = { ...this.state.inputs };
                            i.existing_venture = !i.existing_venture;
                            this.setState({ inputs: { ...i } });
                          }}
                        />
                        <label htmlFor="venture" className="pl-2">
                          I have where to host event
                        </label>
                      </div>
                      <div className="col"></div>
                    </div>
                  </>
                )}
                <div className="row mb-2">
                  <div className="col"></div>
                  <div className="col-lg-4">
                    <p className="titles">What will your services include</p>
                  </div>
                  <div className="col-lg-6">
                    <textarea
                      className="form-control"
                      value={this.state.inputs.description}
                      onChange={e => {
                        let i = { ...this.state.inputs };
                        i.description = e.target.value;
                        this.setState({ inputs: { ...i } });
                      }}
                      rows="3"
                    ></textarea>
                  </div>
                  <div className="col"></div>
                </div>
                <div className="row mb-2">
                  <div className="col"></div>
                  <div className="col-lg-4">
                    <p className="titles">Desired Compensation</p>
                    <p className="text-desc">Please note:</p>
                    <p className="text-desc">
                      As a none business owner, we will have to deduct maximum
                      tax from your payment unless you provide us with the Tax
                      document.
                    </p>
                    <p className="text-desc">
                      In case you chose "X", we will donate 50% of your budget
                      to an NGO and rest will help you improve our services. You
                      can change it any time later (will be valid for future
                      events and retroactively)
                    </p>
                  </div>
                  <DropDown
                    classes="col-lg-6"
                    value={this.state.inputs.compensation}
                    onChange={e => {
                      let err = [...this.state.errors];
                      let i = { ...this.state.inputs };
                      i.compensation = e.target.value;
                      e[4] = false;
                      this.setState({ inputs: { ...i }, errors: [...err] });
                    }}
                    options={this.state.compensation_option}
                    error={this.state.errors[4]}
                    placeholder="Compenstation"
                    message="Compenstation is required"
                  />
                  <div className="col"></div>
                </div>

                <div className="row mb-2 btn-row">
                  <div className="col"></div>
                  <div className="col-lg-10 btn-container">
                    {this.state.services.length > 0 && (
                      <button
                        className="btn btn-secondary mr-10"
                        onClick={() => {
                          let tff = [...this.state.tableAndFormFlags];
                          tff[0].form.new = false;
                          tff[0].form.edit = -1;
                          this.clearServicesEntries();
                          this.setState({
                            tableAndFormFlags: [...tff]
                          });
                        }}
                      >
                        Cancel
                      </button>
                    )}
                    {this.state.tableAndFormFlags[0].form.edit !== -1 ? (
                      <button
                        className="btn btn-success"
                        onClick={() =>
                          this.submitNewService(
                            this.state.tableAndFormFlags[0].form.edit
                          )
                        }
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className="btn btn-secondary"
                        onClick={() => this.submitNewService(-1)}
                      >
                        Add
                      </button>
                    )}
                  </div>
                  <div className="col"></div>
                </div>
              </>
            ) : (
              ""
            )}
            {this.state.tableAndFormFlags[0].table && (
              <>
                <div className="row mb-2 mt-5">
                  {/* <div className="col"></div> */}
                  <div
                    className={
                      this.state.tableAndFormFlags[0].form.new ||
                      this.state.tableAndFormFlags[0].form.edit !== -1
                        ? "col-lg-6 offset-lg-5  table-responsive"
                        : "col-lg-6 offset-lg-5 table-responsive"
                    }
                  >
                    <table className="table">
                      <thead className="thead-light">
                        <tr>
                          <th scope="col" className="w-50">
                            Service Type
                          </th>
                          <th scope="col" className="w-30">
                            Occupations
                          </th>
                          <th scope="col" className="w-20">
                            <p
                              className="addNew"
                              onClick={() => {
                                let tff = [...this.state.tableAndFormFlags];
                                tff[0].form.new = true;
                                tff[0].form.edit = -1;
                                this.clearServicesEntries();
                                this.setState({
                                  tableAndFormFlags: tff
                                });
                              }}
                            >
                              Add new
                            </p>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.services.map((serv, index) => (
                          <tr key={index}>
                            <td>
                              {this.idToText(
                                serv.service_type,
                                this.state.service_types_option
                              )}
                            </td>
                            <td>{serv.occupation_ids}</td>
                            <td className="text-right">
                              <img
                                className="img-hover"
                                src={editIcon}
                                alt="..."
                                width={17}
                                onClick={() => this.editServicesEntry(index)}
                              />
                              <img
                                className="img-hover deleteIcon"
                                src={deleteIcon}
                                width={17}
                                onClick={() => {
                                  let serv = [...this.state.services];
                                  let tff = [...this.state.tableAndFormFlags];
                                  if (serv.length === 1) {
                                    tff[0] = {
                                      form: {
                                        new: true,
                                        edit: -1
                                      },
                                      table: false
                                    };
                                    serv = [];
                                  } else {
                                    serv.splice(index, 1);
                                  }
                                  this.clearServicesEntries();
                                  this.setState({
                                    services: [...serv],
                                    tableAndFormFlags: [...tff]
                                  });
                                }}
                                alt="..."
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/*  <div className="col"></div>                 */}
                </div>
              </>
            )}
            <div className="row mt-5 w-100">
              <div className="col-lg-6 text-center offset-lg-5">
                {/* <Link
              className="btn btn-secondary mr-2 link "
              to="professional-info"
            >
              Back
            </Link> */}
                <button
                  className="btn btn-success w-100 btn-block link link-success"
                  onClick={this.onSubmit}
                >
                  Continue
                </button>
              </div>
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
)(Services);
