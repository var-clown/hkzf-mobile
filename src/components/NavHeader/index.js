import { NavBar } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import propTypes from 'prop-types'
import './index.scss'
export default function NavHeader({ children, className }) {
  const history = useNavigate()
  return (
    <NavBar className={className} onBack={() => history(-1)}>
      {children}
    </NavBar>
  )
}

// props的校验
NavHeader.propTypes = {
  children: propTypes.string.isRequired,
  className: propTypes.string,
}
