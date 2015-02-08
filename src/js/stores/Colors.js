import Promise from 'bluebird'
import Colibri from '../libs/colibri'
import Color from 'color'
import AlbumsStore from './Albums'
import createStore from '../utils/createStore'
import url from 'url'

const Colors = createStore((id) => {
	return AlbumsStore.load(id).then(function (release) {
		return new Promise((resolve, reject) => {
			var img = new Image()
			img.onload = () => {
			  var colors = Colibri.extractImageColors(img, 'css')
			  var bg = colors.background
			  var fg = colors.content.length ? colors.content.pop() : Color(bg).light() ? '#000' : '#fff'
			  resolve({ bg, fg })
			}
			// WHY CORS WHY
			var imgParts = url.parse(release.image[2]['#text'])
			img.src = location.origin + '/' + imgParts.host + imgParts.path
  	});
	});
})

export default Colors
