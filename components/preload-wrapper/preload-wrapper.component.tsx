import React, { useEffect } from 'react'
import styles from './preload-wrapper.module.scss'
import { useSelector, useDispatch } from 'react-redux';
import { selectPreloadIsComplete } from '../../redux/preloader/preloader.selectors';
import { setPreloadIsComplete } from '../../redux/preloader/preloader.actions';
import useImage from 'use-image';


type PreloadWrapperProps = {
    children: JSX.Element[],
  };

const imgUrls: string[] = [
    "dalle.png",
];

const PreloadWrapper: React.FC<PreloadWrapperProps> = ({ children }) => {
    const preloadIsComplete = useSelector(selectPreloadIsComplete);
    const dispatch = useDispatch();
    const [_, loadStatus] = useImage('dalle.png');

    useEffect(()=>{
        let loadedImages = 0;
        if(loadStatus === "loaded"){
            loadedImages += 1;
            if(loadedImages === imgUrls.length){
                dispatch(setPreloadIsComplete(true));
            }
        }
    },[loadStatus, dispatch]);

    // const handleImageLoad = () => {
    //     loadedImages += 1;
    //     if(loadedImages === imgUrls.length){
    //         dispatch(setPreloadIsComplete(true));
    //     }
    //   };
    
    return (
            preloadIsComplete? 
            <>
                {children}
            </>
            :<div className={styles['loader-wrapper']}>
                <div className={styles['lds-ellipsis']}><div></div><div></div><div></div><div></div></div>
            </div> 
      )
  };
  
export default PreloadWrapper;