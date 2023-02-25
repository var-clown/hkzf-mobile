//
import { useParams, useLocation, useNavigate } from "react-router-dom";
import React  from "react";
import axios from 'axios'

export const getCurrentCity = () => {
  // 判断本地是否又定位城市
  const localCity = JSON.parse(localStorage.getItem('hkzf_city'))
  //   如果没有就去定位
  if (!localCity) {
    return new Promise((resolve, reject) => {
      var city = new window.BMapGL.LocalCity()
      city.get(async (res) => {
        try {
          let reslute = await axios.get('http://10.10.81.150:8080/area/info', {
            params: { name: res.name },
          })
          localStorage.setItem('hkzf_city', JSON.stringify(reslute.data.body))
          resolve(reslute.data.body)
        } catch (e) {
          reject(e)
        }
      })
    })
  }

  return Promise.resolve(localCity)
}


export function withRouter(Component) {
  return (props) => (
    <Component
      {...props}
      params={useParams()}
      location={useLocation()}
      navigate={useNavigate()}
    />
  );
}
