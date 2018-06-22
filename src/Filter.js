import React, { Component } from 'react';
import ReactDOM from 'react-dom'

class Filter extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: ''
    }

    this.handleChange = this.handleChange.bind(this);
  };

  handleChange(event) {
    const currentValue = event.target.value
    this.setState({
      value: currentValue
    })
    // filter locations
    this.props.onFilterChanged(currentValue.toLowerCase());
  }

  componentDidUpdate() {
    // focus searchinput when filter is shown 
    if (this.props.filterFocused) {
      ReactDOM.findDOMNode(this.refs.searchInput).focus();
    }
  }

  render() {
    return (
      <section className="col">
        <div className="input-group">
          <input
            type="text"
            id="search-input"
            ref="searchInput"
            className="form-control"
            placeholder="Filter location..."
            onChange={this.handleChange} />
          <span className="input-group-addon">Filter</span>
        </div>
      </section>
    )
  }

}

export default Filter;
