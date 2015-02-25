import React from 'react/addons'
const { CSSTransitionGroup, PureRenderMixin } = React.addons
import { Link, RouteHandler, Navigation } from 'react-router'

import Sidebar from 'components/Sidebar'
import Albums from 'components/Albums'

import './layout.scss'

const Layout = React.createClass({

  mixins: [ Navigation, PureRenderMixin ],

  getInitialState() {
    let widths = this.getWidth(200)
    let styles = {
      cursor: 'default'
    }
    let resizing = false
    return {widths, styles, resizing}
  },

  getWidth(sidebarWidth = this.state.widths.sidebar) {
    let w = document.body.clientWidth
    return {
      sidebar: sidebarWidth,
      main: w - sidebarWidth
    }
  },

  componentDidMount() {
    this.setState({widths: this.getWidth()})
    window.addEventListener('resize', () => {
      this.setState({widths: this.getWidth()})
    })
  },

  sidebarRight() {
    let sidebar = this.refs.sidebar.getDOMNode()
    return sidebar.offsetLeft + sidebar.offsetWidth
  },

  mouseMove(event) {
    if (this.state.resizing) {
      let width = this.refs.sidebar.getDOMNode().offsetWidth
      let newWidth = event.clientX
      let widths = this.getWidth(newWidth)
      this.setState({widths})
    } else {
      if (this.sidebarRight() === event.clientX) {
        this.setState({styles: {
          cursor: 'col-resize'
        }})
      } else {
        this.setState({styles: {
          cursor: 'default'
        }})
      }
    }
  },

  mouseDown() {
    if (this.sidebarRight() !== event.clientX) return
    this.setState({resizing: true})

  },

  mouseUp() {
    if (!this.state.resizing) return
    this.setState({resizing: false, widths: this.getWidth()})
  },

  render() {
    return (
      <div style={this.state.styles}
           className="wrapper"
           onMouseMove={this.mouseMove}
           onMouseDown={this.mouseDown}
           onMouseUp={this.mouseUp}>
        <Sidebar ref="sidebar" width={this.state.widths.sidebar} />
        <RouteHandler ref="container" width={this.state.widths.main} params={this.props.params} />
      </div>
    );
  }

});


export default Layout
