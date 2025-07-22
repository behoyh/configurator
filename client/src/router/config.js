import React, { lazy } from 'react'
import BasicLayout from '@/layouts/BasicLayout'
import BlankLayout from '@/layouts/BlankLayout'

const routerConfig = [
  { path: '/dashboard', name: '列表', component: 'dashboard' },
  { path: '/pointcloud', name: '点云', component: 'pointCloud' },
  { path: '/threepointcloud', name: '点云', component: 'threePointCloud' },
  { path: '/threepointcloud2', name: '点云', component: 'threePointCloud2' },
  { path: '/sweep', name: 'Sweep Configurator', component: 'sweep' },

  {
    path: '/exception/404',
    name: 'PageNotFound',
    component: 'exception/404',
    exact: true,
  },
  {
    path: '/exception/403',
    name: 'PermissionDenied',
    component: 'exception/403',
    exact: true,
  },
  {
    path: '/exception/500',
    name: 'ServerError',
    component: 'exception/500',
    exact: true,
  },
  { path: '/', redirect: '/sweep', exact: true },
  { path: '*', redirect: '/exception/404', exact: true },
]

const renderChild = (routerConfig, config = []) => {
  if (!Array.isArray(routerConfig)) {
    return null
  }
  routerConfig.map((item) => {
    if (item.childRoutes) {
      config = renderChild(item.childRoutes, config)
    }
    config.push({
      path: item.path,
      name: item.name && item.name,
      exact: item.exact && item.exact,
      redirect: item.redirect && item.redirect,
      component:
        item.component && lazy(() => import(`@/views/${item.component}`)),
      meta: item.name && { title: item.name },
    })
  })
  return config
}

const config = [
  {
    path: '/',
    component: BlankLayout, 
    childRoutes: [
      {
        path: '/',
        component: BasicLayout,
        childRoutes: [...renderChild(routerConfig)],
      },
    ],
  },
]

export default config
