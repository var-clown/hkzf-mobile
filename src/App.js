import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import Home from './pages/Home'
import CityList from './pages/CityList'
import Map from './pages/Map'
// import 'antd-mobile/es/global'
function App() {
  return (
    <Router>
      <div className="App">
        {/* <ul>
          <li>
            <Link to="/home">首页</Link>
          </li>
          <li>
            <Link to="/cityList">城市选择</Link>
          </li>
        </ul> */}

        <Routes>
          <Route path="/home/*" element={<Home />}></Route>
          <Route path="*" element={<Navigate to="/home/index" />}></Route>
          <Route path="/home" element={<Navigate to="/home/index" />}></Route>
          <Route path="/cityList" element={<CityList />}></Route>
          <Route path="/map" element={<Map />}></Route>

        </Routes>
      </div>
    </Router>
  )
}

export default App
