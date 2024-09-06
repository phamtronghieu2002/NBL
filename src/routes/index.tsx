import { Fragment, ReactNode } from "react"
import { routeConfig } from "../configs/routeConfig"

import { MainLayout } from "../layouts/MainLayout"
import { Login } from "../pages/Login"
import { LoginLayout } from "../layouts/LoginLayout"

import { RootPage } from "../pages/Root"
import Remind from "../pages/manager/Remind/Remind"
export interface IRoute {
  path: string
  component: React.FC<{}> | null
  layout: React.FC<{ children: ReactNode }>
  useMenu?: boolean
  useFullScreen?: boolean
  useMonitor?: boolean
  useTab?: boolean
}

export const routes: IRoute[] = [
  {
    path: routeConfig?.login,
    component: Login,
    layout: LoginLayout,
  },
  //LOGIN
  {
    path: routeConfig?.root,
    component: RootPage,
    layout: MainLayout,
    useFullScreen: true,
  },

  //PRIVATE
  {
    path: routeConfig?.monitor,
    component: Fragment,
    layout: MainLayout,
    useFullScreen: true,
    useMonitor: true,
  },

  // alert vihicle
  {
    path: routeConfig?.manager_remind,
    component: Remind,
    layout: MainLayout,
  },
  // {
  //   path: routeConfig?.manager_tire,
  //   component: ManagerAlert,
  //   layout: MainLayout,
  // },
]

export const routesObj: { [key: string]: IRoute } = {}

routes?.forEach?.((route) => {
  if (route?.path) {
    routesObj[route?.path] = route
  }
})
