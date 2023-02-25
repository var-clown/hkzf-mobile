import React from 'react'
import { Swiper, Grid, AutoCenter, List, SearchBar } from 'antd-mobile'
import { DownFill, LocationFill } from 'antd-mobile-icons'
import { useNavigate } from 'react-router-dom'

import axios from 'axios'
import { getCurrentCity } from '../../utils/index'
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'
import './index.scss'
const { Provider, Consumer } = React.createContext()

// navigator.geolocation.getCurrentPosition((position) => {
//   console.log(position,'eee')
// })

export default class Index extends React.Component {
  state = { city: { name: '', value: '' } }
  getMenuNavigate() {
    return [
      { name: '整租', imgSrc: Nav1, path: '/home/index' },
      { name: '合租', imgSrc: Nav2, path: '/home/houseList' },
      { name: '地图找房', imgSrc: Nav3, path: '/home/news' },
      { name: '去出租', imgSrc: Nav4, path: '/home/profile' },
    ]
  }

  async componentDidMount() {
    let curCirty= await getCurrentCity()
    this.setState({
      city: { name: curCirty.label, value: curCirty.value },
    })
  }

  render() {
    return (
      <Provider value={{ ...this.state }}>
        <AutoCenter>
          <Swipers />
          <MenuNavigate menuNavigate={this.getMenuNavigate()} />
          <RentalUnit city={this.state.city} />
          <NewsInfo city={this.state.city} />
        </AutoCenter>
      </Provider>
    )
  }
}

// 轮播图
class Swipers extends React.Component {
  state = {
    swipers: [],
    isSwiperLoaded: false,
  }

  componentDidMount() {
    this.getSwipers()
  }
  //   获取轮播图数
  async getSwipers() {
    const res = await axios.get('http://10.10.81.150:8080/home/swiper')
    this.setState(() => {
      return {
        swipers: res.data.body,
        isSwiperLoaded: true,
      }
    })
  }

  //   点击轮播如
  handleSwiper(val) {
    // 点击轮播如
    console.log('点击轮播图', val)
  }

  //   渲染子轮播如
  renderSwiper() {
    return this.state.swipers.map((val, index) => (
      <Swiper.Item key={index}>
        <div
          className={'content'}
          //   style={{ background: colors[index] }}
          onClick={() => this.handleSwiper(index)}
        >
          <img
            className={'imgScr'}
            src={`http://10.10.81.150:8080${val.imgSrc}`}
            alt=""
          />
        </div>
      </Swiper.Item>
    ))
  }

  render() {
    return (
      <div className="swiperContent">
        {this.state.isSwiperLoaded ? (
          <div>
            <Swiper autoplay>{this.renderSwiper()}</Swiper>
            <SwiperSearch />
          </div>
        ) : (
          ''
        )}
      </div>
    )
  }
}

// 头部搜索框
const SwiperSearch = () => {
  const history = useNavigate()
  return (
    <Consumer>
      {(data) => (
        <div className="swiper_search">
          <div className="swiper_search_left">
            <div
              className="swiper_search_left_city"
              onClick={() => history('/cityList')}
            >
              <span>{data.city.name}</span>
              <DownFill />
            </div>

            <SearchBar
              placeholder="请输入内容"
              onFocus={() => history('/cityList')}
            />
          </div>
          <div className="swiper_search_right">
            <LocationFill onClick={() => history('/map')} />
          </div>
        </div>
      )}
    </Consumer>
  )
}

// 菜单导航

class MenuNavigate extends React.Component {
  render() {
    return (
      <Grid columns={4} gap={8} style={{ background: '#fff' }}>
        {<RenderGridItem menuNavigate={this.props.menuNavigate} />}
      </Grid>
    )
  }
}
const RenderGridItem = (data) => {
  const history = useNavigate()
  const { menuNavigate } = data
  return menuNavigate.map((item, index) => (
    <Grid.Item key={index}>
      <div className={'nav'}>
        <img src={item.imgSrc} alt="" onClick={() => history(item.path)} />
        <div>{item.name}</div>
      </div>
    </Grid.Item>
  ))
}

// 租房小组

class RentalUnit extends React.Component {
  state = {
    RentalUnitInfo: [],
  }
  componentDidMount() {
    // this.getRentalUnit(this.props.city.value)
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.city.name !== this.props.city.name) {
      this.getRentalUnit(nextProps.city.value)
   
    }
    return this.props.city.name
  }

  renderTitle() {
    return (
      <div className="rental_unit_tile">
        <span>更多</span>
        <div>租房小组</div>
      </div>
    )
  }
  async getRentalUnit(area) {
    let res = await axios.get('http://10.10.81.150:8080/home/groups', {
      params: { area: area },
    })
    this.setState({
      RentalUnitInfo: res.data.body,
    })
  }
  render() {
    return (
      <div>
        {this.renderTitle()}
        <Grid columns={2} gap={8} style={{ background: '#f0f0f0' }}>
          {<RenderGridItemUnit RentalUnitInfo={this.state.RentalUnitInfo} />}
        </Grid>
      </div>
    )
  }
}

const RenderGridItemUnit = (data) => {
  const { RentalUnitInfo } = data
  const history = useNavigate()

  return RentalUnitInfo.map((item, index) => (
    <Grid.Item key={index} className="gridItem">
      <div className={'unitItem'}>
        <div className={'unitItem_left'}>
          <div>{item.title}</div>
          <span>{item.desc}</span>
        </div>
        <div className="unitItem_right">
          <img
            src={`http://10.10.81.150:8080${item.imgSrc}`}
            alt=""
            onClick={() => history(item.path)}
          />
        </div>
      </div>
    </Grid.Item>
  ))
}

// 最新资讯
class NewsInfo extends React.Component {
  state = {
    newsInfoList: [],
  }
  componentDidMount() {
    // this.getNewsInfoList(this.props.city.value)
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.city.name !== this.props.city.name) {
      this.getNewsInfoList(nextProps.city.value)
    }
    return this.props.city.name
  }
  async getNewsInfoList(area) {
    let res = await axios.get('http://10.10.81.150:8080/home/news', {
      params: { area: area },
    })
    this.setState({
      newsInfoList: res.data.body,
    })
  }
  render() {
    console.log(this.props,'props')
    return (
      <div className="newsInfo">
        <div className="news_info_title">最新资讯</div>
        <List>
          {this.state.newsInfoList.map((user) => (
            <List.Item
              key={user.title}
              description={
                <div className="decription-bottom">
                  <span className="decription_left">{user.from}</span>
                  <span className="decription_right">{user.date}</span>
                </div>
              }
              prefix={
                <img
                  className="decription_imgSrc"
                  src={`http://10.10.81.150:8080${user.imgSrc}`}
                  alt=""
                />
              }
            >
              <div className="decription_title"> {user.title}</div>
            </List.Item>
          ))}
        </List>
      </div>
    )
  }
}
