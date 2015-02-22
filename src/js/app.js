import Promise from 'bluebird'
import React from 'react'
import Router from 'react-router'
import Layout from 'components/Layout'
import Albums from 'components/Albums'
import Album from 'components/Album'
const { Route, DefaultRoute } = Router

const routes = (
  <Route name="index" path="/" handler={Layout} ignoreScrollBehavior={true} >
    <Route name="albums" path="albums/" handler={Albums}>
      <Route name="album" path=":id" handler={Album} addHandlerKey={true} />
    </Route>
    <DefaultRoute handler={Albums}/>
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

