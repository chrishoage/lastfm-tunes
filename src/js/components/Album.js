import React from 'react/addons'
import Promise from 'bluebird'

const { CSSTransitionGroup } = React.addons

import AlbumsStore from '../stores/Albums'
import Colors from '../stores/Colors'


const Album = React.createClass({

  statics: {
    load(params) {
      return Promise.join(AlbumsStore.load(params.id), Colors.load(params.id))
    }
  },

  getInitialState() {
    return {
      height: this.props.old ? 'auto' : 0,
      animate: false
    }
  },

  componentDidMount() {
    this.animate()
  },

  componentWillReceiveProps() {
    this.setState({animate: true})
  },

  componentDidUpdate() {
    if (this.state.animate) {
      this.animate()
      this.setState({animate: false})
    }
  },

  animate() {
    var height = this.refs.container.getDOMNode().offsetHeight
    this.setState({ height: height }, () => {
      if (this.props.old) {
        setTimeout(() => {
          this.setState({height: 0})
        }, 10)
      }
    })
  },

  render() {
    var { id } = this.props.params
    var { bg, fg } = Colors.get(id)
    var album = AlbumsStore.get(id)
    var styles = {
      background: bg,
      color: fg,
      height: this.state.height
    }

    var tracks = album.tracks.track.filter((track) => track.mbid ).map((track, index) => {
      let m = Math.floor(track.duration / 60)
      let s = track.duration - (m * 60)
      s = s < 10 ? `0${s}` : s
      return <li key={index}>{track.name} ({m}:{s})</li>
    })

    return (
        <div key={id} style={styles} className="album-detail">
          <div className="album-detail-container" ref="container">
            <h2>{album.name}</h2>
            <h3>{album.artist}</h3>
            <div className="album-info">
              <div className="col-wrap"><ol>{tracks}</ol></div>
              <div className="album-art-container">
                <img onLoad={this.animate} src={album.image[3]['#text']} />
              </div>
            </div>
          </div>
        </div>
    )
  }
})

export default Album
