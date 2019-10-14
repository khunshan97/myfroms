import React, {Component} from "react";
import DropDown from "../components/dropDown";
import Description from "../components/desription";
import uploadIcon from "../upload.svg";
import uploadIcon2 from "../uploadfilled.svg";
import InputField from "../components/inputField";
import Autosuggest from "react-autosuggest";
import editIcon from "../edit.svg";
import deleteIcon from "../delete.svg";
import axios from "axios";
import {connect} from "react-redux";
import {savePage} from "../actions/pages";
import {Redirect} from "react-router-dom";
import Navbar from "./navBar";

class ProfessionalInfo extends Component {
    state = {
        areas_options: [],
        career_status_options: [],
        degree_types_options: [],
        institutions_options: [],
        programs_options: [],
        vat_status_options: [],
        work_status_options: [],
        start_years_option: [],
        end_year_option: [],
        icon: true,
        career_status: [],
        work_status: "",
        vat_status: "",
        background_source: "",
        linkedinLink: "",
        cv: "",
        education: {
            institution_id: "",
            degree_type_id: "",
            first_major_id: "",
            second_major_id: "",
            year_start: "Today",
            year_end: "Still There"
        },
        educations: [],
        work: {
            company_name: "",
            title: "",
            year_start: "Today",
            year_end: "My current job"
        },
        experience: [],
        suggestions: [],
        tableAndFormFlags: [
            {
                table: false,
                form: {
                    new: true,
                    edit: -1
                }
            },
            {
                table: false,
                form: {
                    new: true,
                    edit: -1
                }
            }
        ],
        self_description: "",
        errors: []
    };

    componentDidMount = () => {
        if (this.props.pageState.length > 0) {
            this.props.pageState.forEach(page => {
                if (page.id === 1) {
                    this.setState(page.state, () => this.setState({redirect: false}));
                    return;
                }
            });
        }
        var proxyUrl = "",
            targetUrl =
                this.props.serverUrl + "/users/get_professional_info_form_data";
        fetch(proxyUrl + targetUrl)
            .then(res => res.json())
            .then(
                result => {
                    this.setState(
                        {
                            areas_options: [...result.areas],
                            career_status_options: [...result.career_status],
                            degree_types_options: [...result.degree_types],
                            institutions_options: [...result.institutions],
                            programs_options: [...result.programs],
                            vat_status_options: [...result.vat_status],
                            work_status_options: [...result.work_status]
                        },
                        () => {
                            let years = [];
                            let startYear = [];
                            let workEnd = [];
                            years.push({id: "Still There", text: "Still There"});
                            years.push({id: "Today", text: "Today"});
                            startYear.push({id: "Today", text: "Today"});
                            workEnd.push({id: "My current job", text: "My current job"});
                            workEnd.push({id: "Today", text: "Today"});
                            for (
                                let index = new Date().getFullYear();
                                index >= 1960;
                                index--
                            ) {
                                startYear.push({
                                    id: index.toString(),
                                    text: index.toString()
                                });
                                years.push({id: index.toString(), text: index.toString()});
                                workEnd.push({
                                    id: index.toString(),
                                    text: index.toString()
                                });
                            }
                            this.setState(
                                {
                                    start_years_option: startYear,
                                    end_year_option: years,
                                    end_work_option: workEnd
                                },
                                () => this.clearEducationalEntries()
                            );
                        }
                    );
                },
                error => {
                    console.log(error);
                }
            );
    };

    files = e => {
        console.log(e.target.files[0]);
        let x = [...this.state.errors];
        x[4] =
            e.target.files[0].name.split(".").pop() === "pdf" ||
            e.target.files[0].name.split(".").pop() === "docx"
                ? false
                : true;
        this.setState({errors: [...x]});
        this.setState({cv: e.target.files[0]});
        if (e.target.files.length > 0) {
            this.setState({
                icon: false
            });
        }
    };

    submitNewEducation = index => {
        let e = [...this.state.errors];
        e[7] = this.state.education.institution_id.length === 0 ? true : false;
        e[10] = this.state.education.degree_type_id.length === 0 ? true : false;
        e[8] = this.state.education.year_start.length === 0 ? true : false;
        e[9] = this.state.education.year_end.length === 0 ? true : false;
        e[11] = this.state.education.first_major_id.length === 0 ? true : false;
        e[12] = this.state.education.second_major_id.length === 0 ? true : false;

        this.setState({errors: [...e]});
        if (!e.slice(7, 12).includes(true)) {
            let edu = [...this.state.educations];
            if (index === -1) {
                edu.push({...this.state.education});
            } else {
                edu[index] = {...this.state.education};
            }
            this.setState({educations: edu}, () => {
                let x = [...this.state.errors];
                x[6] = false;
                let tff = [...this.state.tableAndFormFlags];
                tff[0].form.new = false;
                tff[0].form.edit = -1;
                tff[0].table = true;
                this.setState({
                    tableAndFormFlags: tff,
                    education: {...this.state.education},
                    errors: x
                });
            });
        }
    };

    clearEducationalEntries = () => {
        const clear = {
            institution_id: "",
            degree_type_id: "",
            first_major_id: "",
            second_major_id: "",
            year_end: "",
            year_start: ""
        };
        this.setState({
            education: {...clear}
        });
    };

    editEducationEntry = i => {
        let tff = [...this.state.tableAndFormFlags];
        tff[0].form.new = false;
        tff[0].form.edit = i;
        this.setState({
            education: {...this.state.educations[i]},
            tableAndFormFlags: [...this.state.tableAndFormFlags]
        });
    };

    submitNewExperience = index => {
        let e = [...this.state.errors];
        e[14] = this.state.work.company_name.length === 0 ? true : false;
        e[15] = this.state.work.title.length === 0 ? true : false;
        e[16] = this.state.work.year_start.length === 0 ? true : false;
        e[17] = this.state.work.year_end.length === 0 ? true : false;
        this.setState({errors: [...e]});
        if (!e.slice(14, 17).includes(true)) {
            let exp = [...this.state.experience];
            if (index === -1) {
                exp.push({...this.state.work});
            } else {
                exp[index] = {...this.state.work};
            }
            this.setState({experience: exp}, () => {
                let x = [...this.state.errors];
                x[13] = false;
                let tff = [...this.state.tableAndFormFlags];
                tff[1].form.new = false;
                tff[1].form.edit = -1;
                tff[1].table = true;
                this.setState({
                    tableAndFormFlags: [...tff],
                    work: {...this.state.work},
                    errors: [...x]
                });
            });
        }
    };

    clearExperienceEntries = () => {
        const clear = {
            company_name: "",
            title: "",
            year_end: "",
            year_start: ""
        };
        this.setState({
            work: {...clear}
        });
    };

    editExperienceEntry = i => {
        let tff = [...this.state.tableAndFormFlags];
        tff[1].form.new = false;
        tff[1].form.edit = i;
        this.setState({
            work: {...this.state.experience[i]},
            tableAndFormFlags: [...this.state.tableAndFormFlags]
        });
    };

    getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0
            ? []
            : this.state.institutions_options.filter(
                lang => lang.text.toLowerCase().slice(0, inputLength) === inputValue
            );
    };

    getSuggestionValue = suggestion => suggestion.text;

    // Use your imagination to render suggestions.
    renderSuggestion = suggestion => <span>{suggestion.text}</span>;

    onChange = (event, {newValue}) => {
        let edu = {...this.state.education};
        edu.institution_id = newValue;
        let x = [...this.state.errors];
        x[7] = false;
        this.setState({
            education: edu,
            errors: [...x]
        });
    };

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    onSuggestionsFetchRequested = ({value}) => {
        this.setState({
            suggestions: [...this.getSuggestions(value)]
        });
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    idToText = (id, arr) =>
        arr.find(a => {
            if (a.id == id) {
                return a.text.toString();
            }
        }).text;

    onSubmit = async () => {
        let e = [...this.state.errors];
        e[0] = this.state.career_status.length === 0 ? true : false;
        e[1] = this.state.work_status.length === 0 ? true : false;
        e[2] = this.state.vat_status.length === 0 ? true : false;
        e[3] = this.state.background_source.length === 0 ? true : false;
        e[18] = this.state.self_description.length === 0 ? true : false;

        let arr = [];
        this.state.career_status.forEach((element, index) => {
            if (element) arr.push(this.state.career_status_options[index].id);
        });


        let data = new FormData()
        data.append('work_status', this.state.work_status);
        data.append('career_status', arr);
        data.append('vat_status', this.state.vat_status);
        data.append('background_source', this.state.background_source);
        data.append('self_description', this.state.self_description);

        if (this.state.background_source === "CV") {
            e[4] = this.state.cv.name
                ? this.state.cv.name.split(".").pop() === "pdf" ||
                this.state.cv.name.split(".").pop() === "docx"
                    ? false
                    : true
                : true;
            data.append('cv', this.state.cv);
        } else if (this.state.background_source === "Linkedin") {
            e[5] = this.state.linkedinLink.includes("linkedin") ? false : true;
            data.append('linkedin_profile_url', this.state.linkedinLink);
        } else if (this.state.background_source === "Form") {
            e[13] = this.state.experience.length === 0 ? true : false;
            e[6] = this.state.educations.length === 0 ? true : false;
            data.append('education', this.state.educations);
            data.append('experience', this.state.experience);

        }
// console.log(data.get('cv'));
        this.setState({errors: [...e]});
        if (!e.slice(0, 6).includes(true) && !e[13] && !e[18]) {
            const res = await axios.post(
                this.props.serverUrl + "/users/update_user_info",
                data, {withCredentials: true, headers: {'content-type': 'multipart/form-data'}}
            );
            console.log(res);
            this.props.savePage(this.state, 1);
            this.setState({redirect: true});

        }
    };

    render() {
        if (this.state.redirect) {
            return <Redirect to="/expertise"/>;
        }
        const icon = this.state.icon ? uploadIcon : uploadIcon2;
        return (
            <>
                <Navbar/>
                <div className="wrap mb-5">
                    <div className="wrapper">
                        <div className="text-left border-bottom header-section">
                            <p className="text-desc hide">Step 2 of 5</p>
                            <h2 className="page-title">Professional Info</h2>
                            <p>
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
                        <div className="row  mb-2 mt-2 mt-lg-5">
                            <div className="col"></div>
                            <div className="col-lg-4 text-left d-flex align-items-start">
                                <p className="titles">What is your current career status?</p>
                            </div>
                            <div className="col-lg-6 pl-0">
                                <div className="row mt-1">
                                    {this.state.career_status_options.map((option, index) => (
                                        <div
                                            className="col-lg-4 d-flex  align-items-center"
                                            key={index}
                                        >
                                            <input
                                                className="form-check-input"
                                                checked={this.state.career_status[index]}
                                                onChange={e => {
                                                    if (this.state.career_status.length > 0) {
                                                        let x = [...this.state.errors];
                                                        x[0] = false;
                                                        this.setState({errors: [...x]});
                                                    }
                                                    let temp = [...this.state.career_status];
                                                    temp[index] = !temp[index];
                                                    this.setState({career_status: [...temp]});
                                                }}
                                                type="checkbox"
                                                id={`inlineCheckbox${index}`}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor={`inlineCheckbox${index}`}
                                            >
                                                {option.text}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                {this.state.errors[0] && (
                                    <p className="st-error" style={{paddingLeft: "15px"}}>
                                        Select at least one career status
                                    </p>
                                )}
                            </div>
                            <div className="col"></div>
                        </div>
                        <div className="row mb-3">
                            <div className="col"></div>
                            <div className="col-lg-4 text-left d-flex  align-items-center">
                                <p className="titles">What is your current status?</p>
                            </div>
                            <div className="col-lg-6 pl-0">
                                <div className="row">
                                    <DropDown
                                        classes="col-12"
                                        options={this.state.work_status_options}
                                        value={this.state.work_status}
                                        placeholder="Work Status"
                                        onChange={e => {
                                            let x = [...this.state.errors];
                                            x[1] = false;
                                            this.setState({errors: [...x]});
                                            this.setState({work_status: e.target.value});
                                        }}
                                        error={this.state.errors[1]}
                                        message="Select Work Status"
                                    />
                                </div>
                            </div>
                            <div className="col"></div>
                        </div>
                        <div className="row  mb-3">
                            <div className="col"></div>
                            <div className="col-lg-4 text-left">
                                <p className="titles">Accounting Details</p>
                            </div>
                            <div className="col-lg-6 pl-0">
                                <div className="row">
                                    <DropDown
                                        classes="col-lg-12"
                                        options={this.state.vat_status_options}
                                        value={this.state.vat_status}
                                        placeholder="Accounting details"
                                        onChange={e => {
                                            let x = [...this.state.errors];
                                            x[2] = false;
                                            this.setState({errors: [...x]});
                                            this.setState({vat_status: e.target.value});
                                        }}
                                        error={this.state.errors[2]}
                                        message="Select Accounting Details"
                                    />
                                </div>
                            </div>
                            <div className="col"></div>
                        </div>
                        <div className="row  mb-3 ">
                            <div className="col"></div>
                            <div className="col-lg-4 text-left  d-flex align-items-center">
                                <p className="titles">
                                    How would you like to tell us about yourself?
                                </p>
                            </div>
                            <div className="col-lg-6 pl-0">
                                <div className="row">
                                    <div className="col-lg-8 d-flex align-items-center justify-content-between">
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="my"
                                                id="inlineRadio1"
                                                value="CV"
                                                onClick={e => {
                                                    let x = [...this.state.errors];
                                                    x[3] = false;
                                                    this.setState({errors: [...x]});
                                                    this.setState({background_source: e.target.value});
                                                }}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="inlineRadio1"
                                            >
                                                CV
                                            </label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="my"
                                                id="inlineRadio2"
                                                value="Linkedin"
                                                onClick={e => {
                                                    let x = [...this.state.errors];
                                                    x[3] = false;
                                                    this.setState({errors: [...x]});
                                                    this.setState({background_source: e.target.value});
                                                }}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="inlineRadio2"
                                            >
                                                LinkedIn Link
                                            </label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="my"
                                                id="inlineRadio3"
                                                value="Form"
                                                onClick={e => {
                                                    let x = [...this.state.errors];
                                                    x[3] = false;
                                                    this.setState({errors: [...x]});
                                                    this.setState({background_source: e.target.value});
                                                }}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="inlineRadio3"
                                            >
                                                Form
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                {this.state.errors[3] && (
                                    <p className="st-error" style={{paddingLeft: "15px"}}>
                                        Select at least one option
                                    </p>
                                )}
                            </div>
                            <div className="col"></div>
                        </div>
                        {this.state.background_source === "CV" && (
                            <div className="lefty">
                                <div className="row  mb-3 ">
                                    <div className="col"></div>
                                    <div className="col-lg-4">
                                        <p className="titles">Please upload your CV</p>
                                    </div>
                                    <div className="col-lg-6 pl-0">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="input--file">
                          <span>
                            <img src={icon} alt="" height="35" width="35"/>
                          </span>
                                                    <input
                                                        name="Select File"
                                                        type="file"
                                                        onChange={this.files}
                                                        style={{
                                                            width: "45px"
                                                        }}
                                                    />
                                                    {this.state.errors[4] && (
                                                        <p className="st-error">
                                                            Upload only PDF or doc File
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col"></div>
                                </div>
                            </div>
                        )}
                        {this.state.background_source === "Linkedin" && (
                            <div className="lefty">
                                <div className="row  mb-3 ">
                                    <div className="col"></div>
                                    <div className="col-lg-4">
                                        <p className="titles">Please insert you LinkedIn profile</p>
                                    </div>
                                    <div className="col-lg-6 pl-0">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <InputField
                                                    classes=""
                                                    value={this.state.linkedinLink}
                                                    placeholder="Insert Your LinkedIn Profile Link"
                                                    name="linkedin"
                                                    type="text"
                                                    onChange={e => {
                                                        let x = [...this.state.errors];
                                                        x[5] = e.target.value.includes("linkedin")
                                                            ? false
                                                            : true;
                                                        this.setState({
                                                            linkedinLink: e.target.value,
                                                            errors: [...x]
                                                        });
                                                    }}
                                                    error={this.state.errors[5]}
                                                    message="Please enter a valid LinkedIn link"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col"></div>
                                </div>
                            </div>
                        )}

                        {this.state.background_source === "Form" && (
                            <div className="lefty">
                                <div className="row mb-3 ">
                                    <div className="col"></div>
                                    <div className="col-lg-4">
                                        <p className="titles">Education</p>
                                        <p className="text-desc">
                                            Add any relevant education details that will help to get
                                            us know you better and match you with clients
                                        </p>
                                    </div>
                                    <div className="col-lg-6">
                                        {this.state.errors[6] && (
                                            <p className="st-error">
                                                Add atleast one education degree
                                            </p>
                                        )}
                                        {this.state.tableAndFormFlags[0].form.new ||
                                        this.state.tableAndFormFlags[0].form.edit !== -1 ? (
                                            <>
                                                <div className="row table-form">
                                                    <div className="col-lg-6 pr-6px">
                                                        <Autosuggest
                                                            className="form-control"
                                                            suggestions={this.state.suggestions}
                                                            onSuggestionsFetchRequested={
                                                                this.onSuggestionsFetchRequested
                                                            }
                                                            onSuggestionsClearRequested={
                                                                this.onSuggestionsClearRequested
                                                            }
                                                            getSuggestionValue={this.getSuggestionValue}
                                                            renderSuggestion={this.renderSuggestion}
                                                            inputProps={{
                                                                placeholder: "Enter institution name",
                                                                value: this.state.education.institution_id,
                                                                onChange: this.onChange
                                                            }}
                                                        />
                                                        {this.state.errors[7] && (
                                                            <p className="st-error">
                                                                Institution name is required
                                                            </p>
                                                        )}
                                                    </div>
                                                    <DropDown
                                                        classes="col-lg-3 pl-6px pr-6px sm-p-16"
                                                        options={this.state.start_years_option}
                                                        value={this.state.education.year_start}
                                                        placeholder="Start Year"
                                                        onChange={e => {
                                                            let edu = {...this.state.education};
                                                            let x = [...this.state.errors];
                                                            x[8] = false;
                                                            edu.year_start = e.target.value;
                                                            this.setState({
                                                                education: {...edu},
                                                                errors: [...x]
                                                            });
                                                        }}
                                                        error={this.state.errors[8]}
                                                        message="Enter the starting year"
                                                    />
                                                    <DropDown
                                                        classes="col-lg-3 pl-6px sm-p-16"
                                                        options={this.state.end_year_option}
                                                        value={this.state.education.year_end}
                                                        placeholder="End Year"
                                                        onChange={e => {
                                                            let edu = {...this.state.education};
                                                            let x = [...this.state.errors];
                                                            x[9] = false;
                                                            edu.year_end = e.target.value;
                                                            this.setState({
                                                                education: {...edu},
                                                                errors: [...x]
                                                            });
                                                        }}
                                                        error={this.state.errors[9]}
                                                        message="Enter the ending year"
                                                    />
                                                </div>
                                                <div className="row table-form2">
                                                    <div className="row">
                                                        <DropDown
                                                            classes="col-lg-2 pr-6px"
                                                            options={this.state.degree_types_options}
                                                            placeholder="Degree"
                                                            value={this.state.education.degree_type_id}
                                                            onChange={e => {
                                                                let edu = {...this.state.education};
                                                                let x = [...this.state.errors];
                                                                x[10] = false;
                                                                edu.degree_type_id = e.target.value;
                                                                this.setState({
                                                                    education: {...edu},
                                                                    errors: [...x]
                                                                });
                                                            }}
                                                            error={this.state.errors[10]}
                                                            message="Degree type is required"
                                                        />
                                                        <DropDown
                                                            classes="col-lg-5 pl-6px pr-6px sm-p-16"
                                                            options={this.state.programs_options}
                                                            value={this.state.education.first_major_id}
                                                            placeholder="First Major"
                                                            onChange={e => {
                                                                let edu = {...this.state.education};
                                                                edu.first_major_id = e.target.value;
                                                                let x = [...this.state.errors];
                                                                x[11] = false;
                                                                this.setState({
                                                                    education: {...edu},
                                                                    errors: [...x]
                                                                });
                                                            }}
                                                            error={this.state.errors[11]}
                                                            message="Major subject is required"
                                                        />
                                                        <DropDown
                                                            classes="col-lg-5 pl-6px  sm-p-16"
                                                            options={this.state.programs_options}
                                                            placeholder="Second Major"
                                                            value={this.state.education.second_major_id}
                                                            onChange={e => {
                                                                let edu = {...this.state.education};
                                                                edu.second_major_id = e.target.value;
                                                                let x = [...this.state.errors];
                                                                x[12] = false;
                                                                this.setState({
                                                                    education: {...edu},
                                                                    errors: [...x]
                                                                });
                                                            }}
                                                            error={this.state.errors[12]}
                                                            message="Second Major is required"
                                                        />

                                                        <div className="row btn-row">
                                                            <div className="col-lg-12 btn-container">
                                                                {this.state.educations.length > 0 && (
                                                                    <button
                                                                        className="btn btn-secondary mr-10"
                                                                        onClick={() => {
                                                                            let tff = [
                                                                                ...this.state.tableAndFormFlags
                                                                            ];
                                                                            tff[0].form.new = false;
                                                                            tff[0].form.edit = -1;
                                                                            this.clearEducationalEntries();
                                                                            this.setState({
                                                                                tableAndFormFlags: [...tff]
                                                                            });
                                                                        }}
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                )}
                                                                {this.state.tableAndFormFlags[0].form.edit !==
                                                                -1 ? (
                                                                    <button
                                                                        className="btn btn-success"
                                                                        onClick={() =>
                                                                            this.submitNewEducation(
                                                                                this.state.tableAndFormFlags[0].form
                                                                                    .edit
                                                                            )
                                                                        }
                                                                    >
                                                                        Save
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        className="btn btn-success"
                                                                        onClick={() => this.submitNewEducation(-1)}
                                                                    >
                                                                        Add
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            ""
                                        )}
                                        {this.state.tableAndFormFlags[0].table && (
                                            <>
                                                <div className="row mt-2">
                                                    <div className="col-lg-12 p-0 table-responsive">
                                                        <table className="table">
                                                            <thead className="thead-light">
                                                            <tr>
                                                                <th scope="col" className="w-50">
                                                                    Degree
                                                                </th>
                                                                <th scope="col" className="w-30">
                                                                    Year
                                                                </th>
                                                                <th scope="col" className="w-20">
                                                                    <p
                                                                        className="addNew"
                                                                        onClick={() => {
                                                                            let tff = [
                                                                                ...this.state.tableAndFormFlags
                                                                            ];
                                                                            tff[0].form.new = true;
                                                                            tff[0].form.edit = -1;
                                                                            this.clearEducationalEntries();
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
                                                            {this.state.educations.map((edu, index) => (
                                                                <tr key={index}>
                                                                    <td>
                                                                        {this.idToText(
                                                                            edu.degree_type_id,
                                                                            this.state.degree_types_options
                                                                        ) +
                                                                        " in " +
                                                                        this.idToText(
                                                                            edu.first_major_id,
                                                                            this.state.programs_options
                                                                        ) +
                                                                        " and " +
                                                                        this.idToText(
                                                                            edu.second_major_id,
                                                                            this.state.programs_options
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {edu.year_start + " - " + edu.year_end}
                                                                    </td>
                                                                    <td className="text-right">
                                                                        <img
                                                                            className="img-hover"
                                                                            src={editIcon}
                                                                            alt="..."
                                                                            width={17}
                                                                            onClick={() =>
                                                                                this.editEducationEntry(index)
                                                                            }
                                                                        />
                                                                        <img
                                                                            className="img-hover deleteIcon"
                                                                            src={deleteIcon}
                                                                            width={17}
                                                                            onClick={() => {
                                                                                let edu = [...this.state.educations];
                                                                                let tff = [
                                                                                    ...this.state.tableAndFormFlags
                                                                                ];
                                                                                if (edu.length === 1) {
                                                                                    tff[0] = {
                                                                                        form: {
                                                                                            new: true,
                                                                                            edit: -1
                                                                                        },
                                                                                        table: false
                                                                                    };
                                                                                    edu = [];
                                                                                } else {
                                                                                    edu.splice(index, 1);
                                                                                }
                                                                                this.clearEducationalEntries();
                                                                                this.setState({
                                                                                    educations: [...edu],
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
                                    </div>
                                    <div className="col"></div>
                                </div>
                            </div>
                        )}

                        {this.state.background_source === "Form" && (
                            <div className="lefty">
                                <div className="row  mb-3">
                                    <div className="col"></div>
                                    <div className="col-lg-4">
                                        <p className="titles">Work Experience</p>
                                        <p className="text-desc">
                                            Add any relevant education details that will help to get
                                            us know you better and match you with clients
                                        </p>
                                    </div>
                                    <div className="col-lg-6">
                                        {this.state.errors[13] && (
                                            <p className="st-error">
                                                Atleast add one Work Experience
                                            </p>
                                        )}
                                        {this.state.tableAndFormFlags[1].form.new ||
                                        this.state.tableAndFormFlags[1].form.edit !== -1 ? (
                                            <>
                                                <div className="row table-form">
                                                    <InputField
                                                        classes="col-lg-12 sm-p-16"
                                                        value={this.state.work.company_name}
                                                        placeholder="Company Name"
                                                        name="company"
                                                        type="text"
                                                        onChange={e => {
                                                            let w = {...this.state.work};
                                                            let x = [...this.state.errors];
                                                            x[14] = false;
                                                            w.company_name = e.target.value;
                                                            this.setState({work: {...w}, errors: [...x]});
                                                        }}
                                                        error={this.state.errors[14]}
                                                        message="Company name is required"
                                                    />
                                                </div>
                                                <div className="row table-form2">
                                                    <InputField
                                                        classes="col-lg-6 pr-6px "
                                                        value={this.state.work.title}
                                                        placeholder="Job Title"
                                                        name="title"
                                                        type="text"
                                                        onChange={e => {
                                                            let w = {...this.state.work};
                                                            let x = [...this.state.errors];
                                                            x[15] = false;
                                                            w.title = e.target.value;
                                                            this.setState({work: {...w}, errors: [...x]});
                                                        }}
                                                        error={this.state.errors[15]}
                                                        message="Job title is required"
                                                    />
                                                    <DropDown
                                                        classes="col-lg-3 pl-6px pr-6px sm-p-16"
                                                        placeholder="Start Year"
                                                        options={this.state.start_years_option}
                                                        value={this.state.work.year_start}
                                                        onChange={e => {
                                                            let w = {...this.state.work};
                                                            let x = [...this.state.errors];
                                                            x[16] = false;
                                                            w.year_start = e.target.value;
                                                            this.setState({
                                                                work: {...w},
                                                                errors: [...x]
                                                            });
                                                        }}
                                                        error={this.state.errors[16]}
                                                        message="starting year is required"
                                                    />
                                                    <DropDown
                                                        classes="col-lg-3 pl-6px sm-p-16"
                                                        options={this.state.end_work_option}
                                                        placeholder="End Year"
                                                        value={this.state.work.year_end}
                                                        onChange={e => {
                                                            let w = {...this.state.work};
                                                            let x = [...this.state.errors];
                                                            x[17] = false;
                                                            w.year_end = e.target.value;
                                                            this.setState({
                                                                work: {...w},
                                                                errors: [...x]
                                                            });
                                                        }}
                                                        error={this.state.errors[17]}
                                                        message="Ending year is required"
                                                    />

                                                    <div className="row btn-row">
                                                        <div className="col-lg-12 btn-container">
                                                            {this.state.experience.length > 0 && (
                                                                <button
                                                                    className="btn btn-secondary mr-10"
                                                                    onClick={() => {
                                                                        let tff = [...this.state.tableAndFormFlags];
                                                                        tff[1].form.new = false;
                                                                        tff[1].form.edit = -1;
                                                                        this.clearExperienceEntries();
                                                                        this.setState({
                                                                            tableAndFormFlags: [...tff]
                                                                        });
                                                                    }}
                                                                >
                                                                    Cancel
                                                                </button>
                                                            )}
                                                            {this.state.tableAndFormFlags[1].form.edit !==
                                                            -1 ? (
                                                                <button
                                                                    className="btn btn-success"
                                                                    onClick={() =>
                                                                        this.submitNewExperience(
                                                                            this.state.tableAndFormFlags[1].form.edit
                                                                        )
                                                                    }
                                                                >
                                                                    Save
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    className="btn btn-success"
                                                                    onClick={() => this.submitNewExperience(-1)}
                                                                >
                                                                    Add
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            ""
                                        )}
                                        {this.state.tableAndFormFlags[1].table && (
                                            <>
                                                <div className="row mt-2">
                                                    <div className="col-lg-12 p-0 table-responsive">
                                                        <table className="table">
                                                            <thead className="thead-light">
                                                            <tr>
                                                                <th scope="col" className="w-50">
                                                                    Job
                                                                </th>
                                                                <th scope="col" className="w-30">
                                                                    Year
                                                                </th>
                                                                <th scope="col" className="w-20">
                                                                    <p
                                                                        className="addNew"
                                                                        onClick={() => {
                                                                            let tff = [
                                                                                ...this.state.tableAndFormFlags
                                                                            ];
                                                                            tff[1].form.new = true;
                                                                            tff[1].form.edit = -1;
                                                                            this.clearExperienceEntries();
                                                                            this.setState({
                                                                                tableAndFormFlags: [...tff]
                                                                            });
                                                                        }}
                                                                    >
                                                                        Add new
                                                                    </p>
                                                                </th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {this.state.experience.map((exp, index) => (
                                                                <tr key={index}>
                                                                    <td>
                                                                        {exp.title + " at " + exp.company_name}
                                                                    </td>
                                                                    <td>
                                                                        {exp.year_start + " - " + exp.year_end}
                                                                    </td>
                                                                    <td className="text-right">
                                                                        <img
                                                                            className="img-hover"
                                                                            src={editIcon}
                                                                            alt="..."
                                                                            width={17}
                                                                            onClick={() =>
                                                                                this.editExperienceEntry(index)
                                                                            }
                                                                        />
                                                                        <img
                                                                            className="img-hover deleteIcon"
                                                                            src={deleteIcon}
                                                                            width={17}
                                                                            onClick={() => {
                                                                                let exp = [...this.state.experience];
                                                                                let tff = [
                                                                                    ...this.state.tableAndFormFlags
                                                                                ];
                                                                                if (exp.length === 1) {
                                                                                    tff[1] = {
                                                                                        form: {
                                                                                            new: true,
                                                                                            edit: -1
                                                                                        },
                                                                                        table: false
                                                                                    };
                                                                                    exp = [];
                                                                                } else {
                                                                                    exp.splice(index, 1);
                                                                                }
                                                                                this.clearExperienceEntries();
                                                                                this.setState({
                                                                                    experience: [...exp],
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
                                    </div>
                                    <div className="col"></div>
                                </div>
                            </div>
                        )}

                        <Description
                            value={this.state.self_description}
                            name="self_description"
                            error={this.state.errors[18]}
                            message="Description is required"
                            onChange={e => {
                                let x = [...this.state.errors];
                                x[18] = false;
                                this.setState({
                                    self_description: e.target.value,
                                    errors: [...x]
                                });
                            }}
                        />
                        <div className="row mt-5 w-100">
                            <div className="col-lg-6 offset-lg-5 text-center">
                                {/* <Link className="btn btn-secondary mr-2 link " to="personal-info">
                Back
              </Link> */}
                                <button
                                    className="btn btn-success w-100 btn-block link link-success"
                                    onClick={this.onSubmit}
                                    to="/expertise"
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
    pageState: state.pages.pageState,
    serverUrl: state.config.serverUrl,
});

export default connect(
    mapStateToProps,
    {savePage}
)(ProfessionalInfo);
