import React, { Component } from "react";
import DropDown from "../components/dropDown";
import editIcon from "../edit.svg";
import deleteIcon from "../delete.svg";
import { connect } from "react-redux";
import { savePage } from "../actions/pages";
import axios from "axios";
import { Redirect } from "react-router-dom";
import Navbar from "./navBar";

class Expertise extends Component {
  state = {
    exp_years: [],
    categories: [],
    sub_categories: [],
    accounting_details: [],
    occupations: [],
    occupations_options: [],
    sub_categories_options: [],
    expertise_field: {
      occupations_ids: [],
      years_of_experience: "",
      vat_status: "",
      current_field: false,
      cat: "",
      sub_cat: ""
    },
    expertise_fields: [],
    tableAndFormFlags: [
      {
        table: false,
        form: {
          new: true,
          edit: -1
        }
      }
    ],
    errors: []
  };

  componentDidMount = () => {
    if (this.props.pageState.length > 0) {
      this.props.pageState.forEach(page => {
        if (page.id === 2) {
          this.setState(page.state, () => this.setState({ redirect: false }));
          return;
        }
      });
    }
    for (let i = 1; i <= 20; i++) {
      this.state.exp_years[i] = { id: i, text: i };
    }
    var proxyUrl = "",
      targetUrl =
        "https://wtbe-249306.appspot.com/users/get_mentoring_fields_form_data";
    fetch(proxyUrl + targetUrl)
      .then(res => res.json())
      .then(
        result => {
          this.setState(
            {
              categories: result.categories,
              accounting_details: result.vat_status,
              sub_categories: result.sub_categories,
              occupations: result.occupations
            },
            () => {
              let temp = this.state.expertise_field;
              this.state.occupations.forEach((a, index) => {
                temp.occupations_ids[index] = false;
              });
              // temp.occupations_ids = [...result.occupations];
              // result.occupations.forEach(occ => {
              //   temp.occupations_ids.push(false);
              // });
              this.setState({ expertise_field: temp });
            }
          );
        },
        error => {
          console.log(error);
        }
      );
  };

  submitNewExpertise = index => {
    let e = [...this.state.errors];
    e[1] = this.state.expertise_field.cat.length === 0 ? true : false;
    e[2] = this.state.expertise_field.sub_cat.length === 0 ? true : false;
    e[3] =
      this.state.expertise_field.years_of_experience.length === 0
        ? true
        : false;
    e[4] = this.state.expertise_field.vat_status.length === 0 ? true : false;
    e[5] =
      this.state.expertise_field.occupations_ids.length === 0 ? true : false;
    this.setState({ errors: [...e] });
    if (!e.splice(1, 5).includes(true)) {
      let expertise_fields = [...this.state.expertise_fields];
      if (index === -1) {
        expertise_fields.push({ ...this.state.expertise_field });
      } else {
        expertise_fields[index] = { ...this.state.expertise_field };
      }
      this.setState({ expertise_fields: expertise_fields }, () => {
        let tff = [...this.state.tableAndFormFlags];
        tff[0].form.new = false;
        tff[0].form.edit = -1;
        tff[0].table = true;
        this.setState({
          tableAndFormFlags: tff,
          expertise_field: { ...this.state.expertise_field }
        });
      });
    }
  };

  clearExpertiseEntries = () => {
    this.setState({
      expertise_field: {
        occupations_ids: [],
        years_of_experience: "",
        vat_status: "",
        current_field: false,
        cat: "",
        sub_cat: ""
      }
    });
  };

  editExpertiseEntry = i => {
    let tff = [...this.state.tableAndFormFlags];
    tff[0].form.new = false;
    tff[0].form.edit = i;
    this.setState({
      expertise_field: { ...this.state.expertise_fields[i] },
      tableAndFormFlags: [...this.state.tableAndFormFlags]
    });
  };

  idToText = (id, arr) => {
    return arr.find(a => {
      if (a.id == id) {
        return a.text.toString();
      }
    }).text;
  };

  onSubmit = async () => {
    let e = [...this.state.errors];
    e[0] = this.state.expertise_fields.length === 0 ? true : false;
    this.setState({ errors: [...e] });
    this.state.expertise_fields.forEach(el => {
      let arr = [];
      el.occupations_ids.forEach((element, index) => {
        console.log(index);
        if (element) arr.push(this.state.occupations[index].id);
      });
      el.occupations_ids = [...arr];
    });
    console.log(this.state.expertise_fields);

    if (!e[0]) {
      const res = await axios.post(
        "https://wtbe-249306.appspot.com/users/add_mentor_fields",
        this.state.expertise_fields
      );
      // .then(res => {
      console.log(res);
      this.props.savePage(this.state, 2);
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
      return <Redirect to="/services" />;
    }
    return (
      <>
        <Navbar />
        <div className="wrap mb-5">
          <div className="wrapper">
            <div className="text-left border-bottom header-section">
              <p className="text-desc hide">Step 1 of 5</p>
              <h2 className="page-title">Expertise</h2>
              <p>
                {" "}
                <small className="text-muted">
                  Please tell us about your professional background Please tell
                  us about your professional background
                </small>
              </p>
            </div>
            <div className="row">
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
                  At least add one Expertise
                </p>
              )}
            </div>
            <div>
              {this.state.tableAndFormFlags[0].form.new ||
              this.state.tableAndFormFlags[0].form.edit !== -1 ? (
                <React.Fragment>
                  <div className="row mb-2 mt-5 w-100">
                    <div className="col-lg-1" />
                    <div className="col-lg-3 ">
                      <h4 className="pi-lables">Field Of Expertiese *</h4>
                    </div>
                    <DropDown
                      classes="col-lg-3 pr-6px pt-2 pt-lg-0 pt-xl-0"
                      options={this.state.categories}
                      placeholder="Select Category"
                      value={this.state.expertise_field.cat}
                      error={this.state.errors[1]}
                      message="Select Category"
                      onChange={e => {
                        let temp = { ...this.state.expertise_field };
                        temp.cat = e.target.value;
                        this.setState(
                          {
                            expertise_field: { ...temp }
                          },
                          () => {
                            let temp = [];
                            this.state.sub_categories.forEach(element => {
                              if (
                                this.state.expertise_field.cat ==
                                element.cateogry_id
                              ) {
                                temp.push(element);
                              }
                            });
                            this.setState({
                              sub_categories_options: [...temp]
                            });
                          }
                        );
                      }}
                    />
                    <DropDown
                      classes="col-lg-3 pl-6px pt-2 pt-lg-0 pt-xl-0"
                      options={this.state.sub_categories_options}
                      placeholder="Select Sub Category"
                      value={this.state.expertise_field.sub_cat}
                      error={this.state.errors[2]}
                      message="Select any sub category"
                      onChange={e => {
                        let temp = { ...this.state.expertise_field };
                        temp.sub_cat = e.target.value;
                        this.setState(
                          {
                            expertise_field: { ...temp }
                          },
                          () => {
                            let temp = [];
                            this.state.occupations.map(element => {
                              if (
                                this.state.expertise_field.sub_cat ==
                                element.sub_cateogry_id
                              ) {
                                temp.push(element);
                              }
                            });
                            this.setState({ occupations_options: [...temp] });
                          }
                        );
                      }}
                    />
                    <div className="col" />
                  </div>

                  <div className="row mb-2 w-100">
                    <div className="col-lg-1" />
                    <div className="col-lg-3 ">
                      <h4 className="pi-lables">Years Of Experience *</h4>
                    </div>
                    {/* <div className="col-lg-1" /> */}
                    <DropDown
                      classes="col-lg-6  pt-2 pt-lg-0 pt-xl-0"
                      placeholder="Select Year Of Expertise"
                      value={this.state.expertise_field.years_of_experience}
                      options={this.state.exp_years}
                      error={this.state.errors[3]}
                      message="Select Years of Experience "
                      onChange={e => {
                        let temp = { ...this.state.expertise_field };
                        temp.years_of_experience = e.target.value;
                        this.setState({
                          expertise_field: { ...temp }
                        });
                      }}
                    />
                    <div className="col" />
                  </div>

                  <div className="row mb-2 w-100">
                    <div className="col-lg-1" />
                    <div className="col-lg-3 ">
                      <h4 className="pi-lables">Accounting Details *</h4>
                    </div>
                    <DropDown
                      classes="col-lg-6"
                      options={this.state.accounting_details}
                      placeholder="Select accounting details"
                      value={this.state.expertise_field.vat_status}
                      error={this.state.errors[4]}
                      message="Select Accounting Details"
                      onChange={e => {
                        let temp = { ...this.state.expertise_field };
                        temp.vat_status = e.target.value;
                        this.setState({
                          expertise_field: { ...temp }
                        });
                      }}
                    />
                    <div className="col" />
                  </div>
                  <div className="row mb-2 w-100">
                    <div className="col-lg-1" />
                    <div className="col-lg-3 ">
                      <h4 className="pi-lables">Select Current Status *</h4>
                    </div>
                    <div className="col-lg-6  mt-2 mr-2 mb-2  ml-0">
                      <div className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="current_in_field"
                          name="current_in_field"
                          checked={this.state.expertise_field.current_field}
                          onChange={() => {
                            let temp = { ...this.state.expertise_field };
                            temp.current_field = !this.state.expertise_field
                              .current_field;
                            this.setState({
                              expertise_field: { ...temp }
                            });
                          }}
                        />
                        <label
                          htmlFor="current_in_field"
                          className="text-muted p-1 messy"
                        >
                          Currently In Field
                        </label>
                      </div>
                    </div>
                    <div className="col" />
                  </div>

                  <div className="row mb-2 w-100">
                    <div className="col-lg-1" />
                    <div className="col-lg-3 ">
                      <h4 className="pi-lables">Select Occupations *</h4>
                    </div>
                    {/* <div className="col-lg-1" /> */}
                    <div className="col-lg-6  mb-2 mt-2 mr-2 ml-0 d-flex">
                      {this.state.errors[5] && (
                        <p className="st-error">
                          Select at least one occupation
                        </p>
                      )}
                      <div className="row w-100">
                        {this.state.occupations_options.map((occ, index) => (
                          <div
                            className="col-lg-6 pl-0 d-flex align-items-center"
                            key={index}
                          >
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id={occ.id}
                              name={occ.id}
                              checked={
                                this.state.expertise_field.occupations_ids[
                                  occ.id
                                ]
                              }
                              onChange={() => {
                                let temp = { ...this.state.expertise_field };
                                temp.occupations_ids[occ.id] = !this.state
                                  .expertise_field.occupations_ids[occ.id];
                                this.setState({
                                  expertise_field: { ...temp }
                                });
                              }}
                            />
                            <label
                              htmlFor={occ.id}
                              className="text-muted p-1 mb-0"
                            >
                              {occ.text}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="col" />
                  </div>

                  <div className="row btn-row">
                    <div className="col-lg-6 offset-lg-4 btn-container text-right">
                      {this.state.expertise_fields.length > 0 && (
                        <button
                          className="btn btn-secondary mr-2"
                          onClick={() => {
                            let tff = [...this.state.tableAndFormFlags];
                            tff[0].form.new = false;
                            tff[0].form.edit = -1;
                            this.clearExpertiseEntries();
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
                            this.submitNewExpertise(
                              this.state.tableAndFormFlags[0].form.edit
                            )
                          }
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          className="btn btn-secondary"
                          onClick={() => this.submitNewExpertise(-1)}
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              ) : (
                ""
              )}
            </div>
            {this.state.tableAndFormFlags[0].table && (
              <>
                <div className="row mt-2">
                  <div className="col-lg-6 offset-lg-4 p-0 table-responsive">
                    <table className="table">
                      <thead className="thead-light">
                        <tr>
                          <th scope="col" className="w-50">
                            Categories
                          </th>
                          <th scope="col" className="w-30">
                            Occupations
                          </th>
                          <th scope="col" className="">
                            <p
                              className="addNew"
                              onClick={() => {
                                let tff = [...this.state.tableAndFormFlags];
                                tff[0].form.new = true;
                                tff[0].form.edit = -1;
                                this.clearExpertiseEntries();
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
                        {this.state.expertise_fields.map((exp, index) => (
                          <tr key={index}>
                            <td>
                              {this.idToText(
                                exp.sub_cat,
                                this.state.sub_categories
                              )}
                            </td>
                            <td>
                              {exp.occupations_ids.map(
                                (id, i) =>
                                  id && (
                                    <span key={id.id}>
                                      {this.idToText(i, this.state.occupations)}{" "}
                                      ,
                                    </span>
                                  )
                              )}
                            </td>
                            <td className="text-right">
                              <img
                                className="img-hover"
                                src={editIcon}
                                alt="..."
                                width={17}
                                onClick={() => this.editExpertiseEntry(index)}
                              />
                              <img
                                className="img-hover deleteIcon"
                                src={deleteIcon}
                                width={17}
                                onClick={() => {
                                  let e = [...this.state.expertise_fields];
                                  let tff = [...this.state.tableAndFormFlags];
                                  if (e.length === 1) {
                                    tff[0] = {
                                      form: {
                                        new: true,
                                        edit: -1
                                      },
                                      table: false
                                    };
                                    e = [];
                                  } else {
                                    e.splice(index, 1);
                                  }
                                  this.clearExpertiseEntries();
                                  this.setState({
                                    expertise_fields: [...e],
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
                </div>
              </>
            )}
            <div className="row mt-5 w-100">
              <div className="col-lg-6 text-center offset-lg-4">
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
      // <div id="Expertise">
      //   <div className=" row w-100 mb-4 mt-2">
      //     <div className="row w-100 ">
      //       <div className="col-lg-4 offset-lg-1 ">
      //         <h2 id="title" className="text-left">
      //           Fields Of Expertise
      //         </h2>
      //         <p className="text-left">
      //           <small>
      //             This is your time to shine. Let potential buyers know what you
      //             do best and how you gained your skills, certifications and
      //             experience
      //           </small>
      //         </p>
      //       </div>
      //     </div>
      //     <div className="row w-100 mt-1">
      //       <div className="col" />
      //       <div className="col-lg-10 step-header">
      //         <p className="text-right text-muted">
      //           <small>*Mandatory Fields</small>
      //         </p>
      //       </div>
      //       <div className="col" />
      //     </div>
      //   </div>
      // </div>
    );
  }
}

const mapStateToProps = state => ({
  pageState: state.pages.pageState
});

export default connect(
  mapStateToProps,
  { savePage }
)(Expertise);
