import React, { Component } from "react";

class InputField extends Component {
  state = {};
  render() {
    const {
      classes,
      placeholder,
      name,
      type,
      value,
      onChange,
      error,
      message
    } = this.props;

    return (
      <div className={classes}>
        <input
          placeholder={placeholder}
          className="form-control"
          name={name}
          value={value}
          onChange={e => onChange(e)}
          type={type}
        />
        {error && (
          <p style={{ color: "red", fontSize: "12px", textAlign: "left" }}>
            {message}
          </p>
        )}
      </div>
    );
  }
}

export default InputField;
