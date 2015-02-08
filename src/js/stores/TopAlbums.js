import requestLastFM from '../utils/requestLastFM'
import createStore from '../utils/createStore'

const TopAlbums = createStore((user) =>
                             requestLastFM({method: 'library.getalbums'})
                             .then((resp) => resp.albums.album))
export default TopAlbums
