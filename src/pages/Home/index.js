import React from 'react'
import { TabBar } from 'antd-mobile'
import { Route, useNavigate, useLocation, Routes } from 'react-router-dom'
import {
  AppOutline,
  EnvironmentOutline,
  ContentOutline,
  UserOutline,
} from 'antd-mobile-icons'
import './index.css'
import Index from '../Index'
import News from '../News'
import HouseList from '../HouseList'
import Profile from '../Profile'

const Bottom = () => {
  const history = useNavigate()
  const location = useLocation()
  const { pathname } = location
  const setRouteActive = (value) => {
    history(value)
  }
  const tabs = [
    {
      key: '/home/index',
      title: '首页',
      icon: <AppOutline />,
    },
    {
      key: '/home/houseList',
      title: '导航',
      icon: <EnvironmentOutline />,
    },
    {
      key: '/home/news',
      title: '资讯',
      icon: <ContentOutline />,
    },
    {
      key: '/home/profile',
      title: '我的',
      icon: <UserOutline />,
    },
  ]
  return (
    <TabBar
      activeKey={pathname}
      onChange={(value) => setRouteActive(value)}
      safeArea={true}
    >
      {tabs.map((item) => (
        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
      ))}
    </TabBar>
  )
}
export default class Home extends React.Component {
  render() {
    return (
      <div className={'app'}>
        {/* <div className={'top'}>
          <NavBar>首页</NavBar>
        </div> */}
        <div className={'body'}>
          <Routes>
            <Route path="/index" element={<Index />}></Route>
            <Route path="/houseList" element={<HouseList />}></Route>
            <Route path="/news" element={<News />}></Route>
            <Route path="/Profile" element={<Profile />}></Route>
          </Routes>
        </div>
        <div className={'bottom'}>
          <Bottom />
        </div>
      </div>
    )
  }
}
