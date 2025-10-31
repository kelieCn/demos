import { Outlet } from 'react-router'
import styles from './app.module.scss'

export default function App() {
  return (
    <div className={styles.appContainer}>
      <Outlet />
    </div>
  )
}