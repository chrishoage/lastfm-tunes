import requestLastFM from 'utils/requestLastFM'
import createStore from 'utils/createStore'

const Albums = createStore((id) =>
                             requestLastFM({method: 'album.getinfo', mbid: id})
                             .then((resp) => resp.album))
export default Albums
