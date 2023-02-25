import React from 'react'
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
  componentDidMount() {
    const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))
    console.log(label, 'label')
    var map = new BMapGL.Map('container')
    //创建地址解析器实例
    var myGeo = new BMapGL.Geocoder()
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

          let res = await axios.get(
            `http://10.10.81.150:8080/area/map?id=${value}`,
          )
          console.log(res.data.body)
          res.data.body.forEach((item) => {
            //   显示文本标注
            const {
              coord: { latitude, longitude },
              label: labelAreaName,
              count,
              value,
            } = item
            const areaPoint = new BMapGL.Point(longitude, latitude)
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
            map.addOverlay(label)
            label.setStyle(labelStyle)
            label.addEventListener('click', async function () {
              map.centerAndZoom(areaPoint, 13)
               map.clearOverlays()
              let re2s = await axios.get(
                `http://10.10.81.150:8080/area/map?id=${label.id}`,
              )
             
            })
          })
        } else {
          alert('您选择的地址没有解析到结果！')
        }
      },
      label,
    )
  }

  render() {
    return (
      <div className="map">
        <div className={styles.top}>
          <NavHeader>地图找房</NavHeader>
        </div>
        <div id="container"></div>
      </div>
    )
  }
}
