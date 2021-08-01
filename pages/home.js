import Head from 'next/head'
import styles from '../styles/home2.module.css'
import Header from '../common/header'
import Sidebar from "../common/Sidebar"
import Footer from "../common/Footer"
import Viewer from "../common/Viewer"


export default function Home() {
  return (
    <main className="home">
      <Head>
        <title>Home - Memory Map</title>
        {/* TODO add favicon */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header></Header>
      <div className={styles.container}>
        <div className={styles.screen}>
          <Viewer></Viewer>
        </div>
        <div className={styles.sidebar}>
          <Sidebar>
          </Sidebar>
        </div>
      </div>
      <Footer></Footer>
      </main>      
  )
}
