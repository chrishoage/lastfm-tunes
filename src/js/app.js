import Promise from 'bluebird'
import React from 'react'
import Router from 'react-router'
import Albums from './components/Albums'
import Album from './components/Album'
const { Route } = Router

const routes = (
  <Route name="albums" path="/" handler={Albums} ignoreScrollBehavior={true} addHandlerKey={true} >
    <Route name="album" path="album/:id" handler={Album} addHandlerKey={true} />
  </Route>
)

const load = (routerState) => {
  return Promise.all(routerState.routes.filter((route) => {
    return route.handler.load
  }).map((route) => {
    return route.handler.load(routerState.params)
  }))
}

Router.run(routes, (Handler, state) => {
  load(state).then(() => {
    React.render(<Handler {...state}/>, document.getElementById('app'))
  })
})

