import React from "react";

const Description = props => {
  const { error, message } = props;
  return (
    <div className="lefty">
      <div className="row mb-2">
        <div className="col"></div>
        <div className="col-lg-4">
          <p className="titles">Self description</p>
          <p className="text-desc">
            Please describe yourself - this description will be sent tp your
            mentees
          </p>
        </div>
        <div className="col-lg-6 pl-0 pr-0">
          <div className="row">
            <div className="col-lg-12">
              <textarea
                name={props.name}
                onChange={props.onChange}
                className="form-control"
                rows="4"
              ></textarea>
              {error && (
                <p
                  style={{ color: "red", fontSize: "12px", textAlign: "left" }}
                >
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="col"></div>
      </div>
    </div>
  );
};

export default Description;
