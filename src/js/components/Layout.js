import React from 'react/addons'
const { CSSTransitionGroup } = React.addons
import { Link, RouteHandler, Navigation } from 'react-router'

import Sidebar from './Sidebar'
import Albums from './Albums'

const Layout = React.createClass({

  mixins: [ Navigation ],

  getInitialState() {
    let w = window.innerWidth
    return {
      sidebarWidth: w * 0.2,
      mainWidth: w * 0.8
    }
  },

  getWidth() {
    return this.refs.container.getDOMNode().clientWidth
  },

  componentDidMount() {
    this.setState({mainWidth: this.getWidth()})
    window.addEventListener('resize', () => {
      this.setState({mainWidth: this.getWidth()})
    })
  },

  render() {
    return (
      <div className="wrapper">
        <Sidebar width={this.state.sidebarWidth} />
        <RouteHandler ref="container" width={this.state.mainWidth} params={this.props.params} />
      </div>
    );
  }

});


export default Layout
