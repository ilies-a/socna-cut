import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.scss'
import KonvaWrapper from "../components/konva-wrapper/konva-wrapper.component"
import { KONVA_WIDTH_SCALE, KONVA_HEIGHT_SCALE } from '@/global'
import { useDispatch, useSelector } from 'react-redux';
import { setTouches } from '../redux/screen-event/screen-event.actions';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const dispatch = useDispatch();

  
  const recordTouches = (e:React.TouchEvent) => {
    dispatch(setTouches(e.touches))
  };
  const endRecordTouches = () => {
    dispatch(setTouches(null))
  };
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main} onTouchStart={recordTouches} onTouchMove={recordTouches} onTouchEnd={endRecordTouches}>
        <div style= {{"width":+{KONVA_WIDTH_SCALE}+"px", "height":+{KONVA_HEIGHT_SCALE}+"px", "backgroundColor": "grey"}}>
          <KonvaWrapper/>
        </div>
      </main>
    </>
  )
}


class Controller {
  constructor(){

  }
}