import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.scss'
import KonvaWrapper from "../components/konva-wrapper/konva-wrapper.component"
import { KONVA_WIDTH_SCALE, KONVA_HEIGHT_SCALE, getSelectedMaterialDataArray, MaterialData } from '@/global'
import { useDispatch, useSelector } from 'react-redux';
import { setIsRecording, setTouches } from '../redux/screen-event/screen-event.actions';
import { selectIsRecording } from '@/redux/screen-event/screen-event.selectors'
import ScreenEventWrapper from '@/components/screen-event-wrapper/screen-event-wrapper.component'
import { selectMaterialDataDict } from '@/redux/konva/konva.selectors'
import { updateMaterialData } from '@/redux/konva/konva.actions'
import { useMemo } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Socna Cut</title>
        <meta name="description" content="Socna Cut app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppScreen/>
    </>
  )
}

const AppScreen:React.FC = () =>{
  const dispatch = useDispatch();
  const materialDataDict: { [key: string]: MaterialData } = useSelector(selectMaterialDataDict);

  const unselectALLMaterials = useMemo(function () {
    return function (e:React.TouchEvent<HTMLInputElement>) {
      for(const id in materialDataDict){
        if(materialDataDict[id].getIsSelected()){
          materialDataDict[id].setIsSelected(false);
          dispatch(updateMaterialData(materialDataDict[id]));
        }
      }
    }
  }, [materialDataDict, dispatch]);


  return( 
    <ScreenEventWrapper>
      <div className={styles.main} onTouchEnd={unselectALLMaterials}>
        <KonvaWrapper/>
      </div>
    </ScreenEventWrapper>)
}