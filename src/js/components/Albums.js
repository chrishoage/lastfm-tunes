import React from 'react/addons'
const { CSSTransitionGroup } = React.addons
import { Link, RouteHandler, Navigation } from 'react-router'
import _ from 'lodash'
import Colors from '../stores/Colors'
import TopAlbums from '../stores/TopAlbums'
import Arrow  from'./Arrow'
import Album from './Album'


const IMAGE_SIZE = 100
const IMAGE_MARGIN = 10

const Albums = React.createClass({

  mixins: [ Navigation ],

  statics: {
    load() {
      return TopAlbums.load('ub3rgeek')
    }
  },

  getInitialState() {
    return {
      albums: TopAlbums.get('ub3rgeek'),
      containerWidth: this.props.width,
      lastChildId: null,
      arrowLeft: -99
    }
  },

  setUIState(props) {
    let { arrowLeft } = this.currentAlbumPos(props.params.id)
    let containerWidth = this.getWidth()

    this.setState({
      containerWidth,
      arrowLeft
    })
  },

  handleResize() {
    this.setUIState(this.props)
  },

  componentDidMount() {
    this.setUIState(this.props)
    window.addEventListener('resize', this.handleResize)
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  },

  componentWillReceiveProps(newProps) {
    var lastChildId = this.props.params.id
    if (newProps.params.id !== lastChildId) {
      let { arrowLeft } = this.currentAlbumPos(newProps.params.id)
      this.setState({ lastChildId, arrowLeft })
    }
  },

  getWidth() {
    return this.refs.container.getDOMNode().clientWidth
  },

  currentAlbumPos(ref) {
    let arrowLeft = 0
    if (ref && this.refs && this.refs[ref]) {
      let offset = this.refs.container.getDOMNode().offsetLeft
      let left = this.refs[ref].getDOMNode().offsetLeft - offset
      arrowLeft = left
    }
    return {arrowLeft}
  },

  calcAlbumsPerRow() {
    var fullWidth = IMAGE_SIZE + (IMAGE_MARGIN * 2)
    return Math.floor(this.state.containerWidth / fullWidth)
  },

  calcRows() {
    var albumsPerRow = this.calcAlbumsPerRow()
    return _.filter(this.state.albums, 'mbid').reduce((rows, album, index) => {
      if (index % albumsPerRow === 0)
        rows.push([])

      rows[rows.length - 1].push({ id: album.mbid, file: album.image[3]['#text'] })
      return rows
    }, [])
  },

  renderAlbum(release) {
    var currentId = this.props.params.id
    var { lastChildId } = this.state
    var isCurrent = currentId === release.id
    var wasCurrent = lastChildId === release.id
    var styles = {
      margin: IMAGE_MARGIN
    }
    var linkTo = isCurrent ? 'albums' : 'album'
    var ref = isCurrent ? 'current' : null
    return (
      <div ref={release.id} className="album-link" style={styles} key={release.id}>
        <Link to={linkTo} params={{id: release.id}}>
          <img
            style={{height: IMAGE_SIZE, width: IMAGE_SIZE}}
            src={release.file}
          />
        </Link>
      </div>
    )
  },

  renderRow(row, index) {
    var currentId = this.props.params.id
    var { lastChildId } = this.state
    var hasCurrent = _.find(row, {id: currentId})
    var hadCurrent = _.find(row, {id: lastChildId})
    var wasCurrent = (!currentId && hadCurrent)
    var sameRow = hasCurrent && hadCurrent
    var arrowPos = {left: this.state.arrowLeft}
    var containerClass = sameRow ? 'album-container' : null
    return (
      <div key={index}>
        <div className="album-row">{row.map(this.renderAlbum)}</div>
        {hasCurrent ? <Arrow id={currentId} pos={arrowPos} /> : null}
        {hasCurrent ? <CSSTransitionGroup ref="container"
                                          transitionName="same-row"
                                          className={containerClass}
                                          component="div" >
                        <RouteHandler params={this.props.params} key={currentId} />
                      </CSSTransitionGroup>
                    : null}
        {((hadCurrent && !sameRow) || wasCurrent) ?
          <Album params={{id: lastChildId}} old={true} key={lastChildId} /> : null}
      </div>
    )
  },

  render() {
    var releases = this.calcRows().map(this.renderRow)
    return <div className="main" ref="container">{releases}</div>
  }
})

export default Albums
