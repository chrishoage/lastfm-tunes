import React from 'react/addons'
const { PureRenderMixin } = React.addons

import './sidebar.scss'

const Sidebar = React.createClass({

  mixins: [ PureRenderMixin ],

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
