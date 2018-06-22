import React, { Component } from 'react';
import Filter from './Filter';

class Sidebar extends Component {

  constructor(props) {
    super(props);

    this.listItemClicked = this.listItemClicked.bind(this);
    this.listItemPressed = this.listItemPressed.bind(this);
  };

  listItemClicked(event) {
    const itemName = event.target.text;
    this.props.onListItemClicked(itemName);
  }

  listItemPressed(event) {
    const itemName = event.target.innerText;
    this.props.onListItemClicked(itemName);
  }

  render() {
    return (
      <nav id="sidebar" className={this.props.onSidebarActivated}>
          <header className="sidebar-header">
              <h3>My Locations</h3>
          </header>
          <Filter
            onFilterChanged={this.props.onFilterChanged}
            filterFocused={this.props.filterFocused}/>
          <ul className="list-unstyled components" >
            { this.props.locations.map(location => (
              <li
                key={location.id}
                onClick={this.listItemClicked}>
                  <a
                    tabIndex="0"
                    role="button"
                    onKeyPress={this.listItemPressed}>{location.name}</a>
              </li>
            ))}
          </ul>
      </nav>
    )
  }

}

export default Sidebar;
