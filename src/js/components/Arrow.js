import React from 'react'
import Colors from '../stores/Colors'

const Arrow = React.createClass({
  render() {
    var styles = {
      width: 0,
      height: 0,
      borderLeft: '10px solid transparent',
      borderRight: '10px solid transparent',
      borderBottom: `10px solid ${Colors.get(this.props.id).bg}`,
      left: this.props.pos.left,
      display: this.props.pos.left > 0 ? 'block' : 'none',
      top: 0,
      marginLeft: 40,
      position: 'relative',
      zIndex: 100
    }
    return <div className="album-arrow" style={styles}/>
  }
})

export default Arrow
