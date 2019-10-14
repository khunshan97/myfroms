import React, { Component } from "react";
import thankyou from "../thankyou.jpg";
class ThankYou extends Component {
  state = {};
  render() {
    return (
      <div id="thanks">
        <div className=" row w-100 mb-4  mt-4">
          <div className="col" />
          <div className="col-md-6 ">
            <img src={thankyou} class="img-fluid" alt="Responsive image" />
            <h2 id="title" className="mt-2  text-center">
              Thank You For Submitting Form
            </h2>
          </div>
          <div className="col" />
        </div>
      </div>
    );
  }
}

export default ThankYou;
