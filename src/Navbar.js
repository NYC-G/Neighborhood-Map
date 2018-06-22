import React, { Component } from 'react';
import ReactDOM from 'react-dom'

class Navbar extends Component {

  componentDidUpdate() {
    if (this.props.buttonState) {
      ReactDOM.findDOMNode(this.refs.hamburger).focus();
    }
  }

  render() {
    return (
      <nav className="navbar navbar-default">
          <header className="container-fluid">
              <div className="navbar-header">
                  <button
                    type="button"
                    ref="hamburger"
                    id="sidebarCollapse"
                    className={this.props.buttonState ? 'navbar-btn active' : 'navbar-btn'}
                    onClick={this.props.onButtonClicked}>
                      <span></span>
                      <span></span>
                      <span></span>
                  </button>
              </div>
              <h3 className="title">Map of Museums in Manhattan</h3>
          </header>
      </nav>
    )
  }
}

export default Navbar;
