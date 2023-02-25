import React from 'react'
import { Toast } from 'antd-mobile'
import { List, AutoSizer } from 'react-virtualized'

import './index.scss'
import axios from 'axios'
import { getCurrentCity, withRouter } from '../../utils/index'
import NavHeader from '../../components/NavHeader/index'
import styles from './cityList.module.css'

// 处理城市列表数据

const getCityListData = (list) => {
  const cityList = {}
  list.forEach((item) => {
    let firstAlphabet = item.short.substr(0, 1)
    if (cityList[firstAlphabet]) {
      cityList[firstAlphabet].push(item)
    } else {
      cityList[firstAlphabet] = [{ ...item }]
    }
  })

  return cityList
}
// 标题高度
const TITLE_HEIGHT = 36
// 名称高度
const NAME_HEIGHT = 50

// 封装处理字母索引方法a
const formateCirtyIndex = (letter) => {
  switch (letter) {
    case '#':
      return '当前定位'
    case 'hot':
      return '热门城市'

    default:
      return letter.toUpperCase()
  }
}

// 有房源的城市
const HOSE_CITY = ['北京', '上海', '广州', '深圳']

class CityList extends React.Component {
  constructor(props) {
    super(props)
    this.state = { cityList: {}, cityIndex: [], activeIndex: 0 }
    this.componentRef = React.createRef()
  }

  async componentDidMount() {
    await this.getCityList()
    // this.componentRef.current.measureAllRows()
  }
  async getCityList() {
    let res = await axios.get('http://10.10.81.150:8080/area/city?level=1')
    let res2 = await axios.get('http://10.10.81.150:8080/area/hot')
    let cityList = getCityListData(res.data.body)
    let cityIndex = Object.keys(cityList)
    const curCity = await getCurrentCity()
    cityList = { ...cityList, hot: res2.data.body, '#': [curCity] }
    cityIndex = ['#', 'hot'].concat(cityIndex)
    this.setState({
      cityList: cityList,
      cityIndex: cityIndex,
    })
  }
  //   切换城市
  async changeCity({ label, value }) {
    if (HOSE_CITY.indexOf(label) > -1) {
      localStorage.setItem('hkzf_city', JSON.stringify({ label, value }))
      this.props.navigate(-1)
      return
    }
    Toast.show({
      content: <span>该城市暂无房源</span>,
      duration: 1000,
    })
  }
  //   动态计算每行的高度
  getRowHeight = ({ index }) => {
    let { cityIndex, cityList } = this.state
    // TITLE_HEIGHT +cityList[cityIndex[index]]
    return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
  }
  //   用于滚动时右侧高亮自动切换显示
  onRowsRendered = ({ startIndex }) => {
    if (this.state.activeIndex !== startIndex) {
      this.setState({ activeIndex: startIndex })
    }
  }

  rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled (当前是否在混动)
    isVisible, // This row is visible within the List (eg it is not an overscanned row) （当前行是否是可见的）
    style, // Style object to be applied to row (to position it)
  }) => {
    let { cityIndex, cityList } = this.state
    let letter = cityIndex[index]
    return (
      <div key={key} style={style} className="city">
        <div className="title">{formateCirtyIndex(letter)}</div>

        {cityList[letter].map((item) => (
          <div
            className="name"
            key={item.value}
            onClick={() => this.changeCity(item)}
          >
            {item.label}
          </div>
        ))}
      </div>
    )
  }
  //   渲染右侧索引
  rowRightRender = () => {
    return this.state.cityIndex.map((item, index) => (
      <li
        className="city_right_item"
        key={item}
        onClick={() => {
          //   this.setState({ activeIndex: index })
          this.componentRef.current.scrollToRow(index)
        }}
      >
        <span
          className={this.state.activeIndex === index ? 'index_active' : ''}
        >
          {item === 'hot' ? '热' : item.toUpperCase()}
        </span>
      </li>
    ))
  }
  render() {
    return (
      <div className="cityList">
        {/* <NavBarTop /> */}
        {/* <NavBar onBack={() => this.props.navigate(-1)}>城市选择</NavBar> */}
        <NavHeader className={"cityListNav"}>城市选择</NavHeader>
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={this.componentRef}
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.getRowHeight}
              rowRenderer={this.rowRenderer}
              onRowsRendered={this.onRowsRendered}
              scrollToAlignment="start"
              width={width}
            />
          )}
        </AutoSizer>

        {/* 右侧索引列表 */}
        <ul className="city_right">{this.rowRightRender()}</ul>
      </div>
    )
  }
}

// const NavBarTop = () => {
//   return <NavBar onBack={() => this.useNavigateTos()}>城市选择</NavBar>
// }

export default withRouter(CityList)
