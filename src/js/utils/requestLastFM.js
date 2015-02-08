import { lastfm as lastfmConf } from '../conf'
import jsonp from 'jsonp'
import Promise from 'bluebird'
import url from 'url'
import _ from 'lodash'

const API = {
	protocol: 'http',
	host: 'ws.audioscrobbler.com',
	pathname: '/2.0/'
}
const requestLastFM = (params = {}) => {
	const defaultPrams = {
		format: 'json'
	}

	let query = _.extend({}, params, defaultPrams, lastfmConf)
	let uri = url.format(_.extend({}, {query}, API))
	return new Promise((resolve, reject) => {
		jsonp(uri, (err, response) => {
			if (err) reject(err)
				resolve(response)
		})
	})
}

export default requestLastFM
