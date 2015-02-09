import React from 'react/addons'
const { CSSTransitionGroup } = React.addons

const Sidebar = React.createClass({

  render() {
    let styles = {
      width: this.props.width
    }

    return (
      <div style={styles} className="playlists"> hello </div>
    );
  }

});

export default Sidebar
