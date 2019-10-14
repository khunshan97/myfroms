import React, { Component } from "react";
class DropDown extends Component {
  state = {};

  render() {
    const {
      classes,
      options,
      value,
      onChange,
      error,
      message,
      placeholder
    } = this.props;
    const Items = options.map(o => (
      <option key={o.id} value={o.id}>
        {o.text}
      </option>
    ));
    return (
      <div className={classes}>
        <select
          className="form-control"
          value={value}
          // defaultValue=""
          onChange={e => onChange(e)}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {Items}
        </select>
        {error && (
          <p style={{ color: "red", fontSize: "12px", textAlign: "left" }}>
            {message}
          </p>
        )}
      </div>
    );
  }
}

export default DropDown;
