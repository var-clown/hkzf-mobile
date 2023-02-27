import React, { useState } from 'react'
import { Popup, Space, Button, List ,Tag} from 'antd-mobile'
import NavHeader from '../../components/NavHeader'
import './index.scss'
import styles from './map.module.css'
import axios from 'axios'

const BMapGL = window.BMapGL

const labelStyle = {
  cursor: 'pointer',
  border: '0 solid rgb(155,0,0)',
  padding: '0',
  whiteSpace: 'nowrap',
  fontSize: '12px',
  color: ' rgb(255, 255, 255)',
  textAlign: 'center',
}

export default class MapInfo extends React.Component {
  state = {
    houseList: [],
    visible: false,
  }
  componentDidMount() {
    const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))
    var map = new BMapGL.Map('container')
    this.map = map
    //创建地址解析器实例
    var myGeo = new BMapGL.Geocoder()
    let that = this
    // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(
      label,
      async function (point) {
        if (point) {
          // 添加城市列表控件
          map.centerAndZoom(point, 11)
          //  比例尺
          map.addControl(new BMapGL.ScaleControl())
          map.addControl(new BMapGL.ZoomControl())
          that.renderOVerlays(value)
        } else {
          alert('您选择的地址没有解析到结果！')
        }
      },
      label,
    )
  }

  //   获取渲染数据
  async renderOVerlays(id) {
    let res = await axios.get(`http://10.10.81.150:8080/area/map?id=${id}`)
    let { nextZoom, type } = this.getTypeAndZoom()
    res.data.body.map((item) => {
      this.createOverlays(nextZoom, type, item)
    })
  }
  // 创建覆盖物
  createOverlays(nextZoom, type, data) {
    const {
      coord: { latitude, longitude },
    } = data
    const areaPoint = new BMapGL.Point(longitude, latitude)

    if (type == 'rect') {
      this.createRect(nextZoom, data, areaPoint)
    } else {
      this.createCirle(nextZoom, data, areaPoint)
    }
  }
  // 获取缩放级别以及类型
  getTypeAndZoom() {
    const zoom = this.map.getZoom()
    let nextZoom, type
    if (zoom >= 10 && zoom < 12) {
      // 区
      nextZoom = 13
      type = 'circle'
    } else if (zoom >= 12 && zoom < 14) {
      // 镇
      nextZoom = 15
      type = 'circle'
    } else if (zoom >= 14 && zoom < 16) {
      // 小区
      type = 'rect'
    }
    return { nextZoom, type }
  }
  //   创建圆形覆盖物
  createCirle(nextZoom, data, areaPoint) {
    const {
      coord: { latitude, longitude },
      label: labelAreaName,
      count,
      value,
    } = data
    const opts = {
      position: areaPoint,
      offset: new BMapGL.Size(-35, -35),
    }
    const label = new BMapGL.Label('', opts)
    label.id = value
    label.setContent(
      `<div class="${styles.bubble}">
                  <p class="${styles.name}">${labelAreaName}</p>
                  <p>${count}套</p>
        </div>`,
    )
    this.map.addOverlay(label)
    label.setStyle(labelStyle)

    let that = this
    label.addEventListener('click', async function () {
      this.map.centerAndZoom(areaPoint, nextZoom)
      this.map.clearOverlays()
      that.renderOVerlays(label.id)
    })
  }
  // 创建小区的形状的覆盖物
  createRect(nextZoom, data, areaPoint) {
    console.log(data, 'data')
    const {
      coord: { latitude, longitude },
      label: labelAreaName,
      count,
      value,
    } = data
    const opts = {
      position: areaPoint,
      offset: new BMapGL.Size(-50, -28),
    }
    const label = new BMapGL.Label('', opts)
    label.id = value
    label.setContent(
      `<div class="${styles.rect}">
         <span class="${styles.housename}">${labelAreaName}</span>
         <span class="${styles.housenum}">${count}</span>
      </div>`,
    )
    this.map.addOverlay(label)
    label.setStyle(labelStyle)

    let that = this
    label.addEventListener('click', async function () {
      that.getHouseList(label.id)
    })
  }

  //   获取小区的房源信息
  async getHouseList(id) {
    let res = await axios.get(`http://10.10.81.150:8080/houses?cityId=${id}`)
    this.setState({
      houseList: res.data.body.list,
      visible: true,
    })
  }
  onClose() {
    console.log('关闭')
    this.setState({
      visible: false,
    })
  }

  render() {
    return (
      <div className="map">
        <div className={styles.top}>
          <NavHeader>地图找房</NavHeader>
        </div>
        <div id="container"></div>
        <Popup
          visible={this.state.visible}
          showCloseButton={true}
          onClose={() => this.onClose()}
          mask={false}
          onMaskClick={() => {}}
          bodyStyle={{ height: '40vh' }}
        >
          {houseList(this.state.houseList)}
        </Popup>
      </div>
    )
  }
}

const houseList = (list) => {
  return (
    <div>
      <div className={styles.housetitle}>
        <span>更多房源</span>
        <p>房屋列表</p>
      </div>

      <List
        className={styles.houselist}
        style={{ height: '40vh', overflowY: 'scroll' }}
      >
        {list.map((item, index) => {
          return (
            <List.Item key={index}>
              <div className={styles.listContent}>
                <div className={styles.houseListLeft}>
                  <img
                    className={styles.imgSrc}
                    src={`http://10.10.81.150:8080${item.houseImg}`}
                    alt=""
                  />
                </div>
                <div className={styles.houseListRight}>
                  <p className={styles.itemTitle}>{item.title}</p>
                  <div className={styles.itemContent}>{item.desc}</div>
                  {item.tags.map((it, idx) => {
                    return (
                      <Tag color="#2db7f5"  key={it} className={styles.itemSubway} style={{marginRight:"5px"}}> {it}</Tag>
                    )
                  })}

                  <p className={styles.itemPrice}>{item.price}元/月</p>
                </div>
              </div>
            </List.Item>
          )
        })}
      </List>
    </div>
  )
}
