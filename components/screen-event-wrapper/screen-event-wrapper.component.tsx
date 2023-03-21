import { setIsRecording, setScreenSize, setTouches } from "@/redux/screen-event/screen-event.actions";
import { selectIsRecording, selectScreenSize } from "@/redux/screen-event/screen-event.selectors";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

type ScreenEventWrapperProps = {
    children: JSX.Element,
  };


const ScreenEventWrapper: React.FC<ScreenEventWrapperProps> = ({children}) => {
    const isRecording:boolean = useSelector(selectIsRecording);
    const dispatch = useDispatch();
  
    useEffect(() => {
      dispatch(setScreenSize([window.innerWidth, window.innerHeight]));
      alert("window.innerHeight"+ window.innerHeight)
    }, [dispatch]);

    const handleWindowResize = useCallback(() => {
      dispatch(setScreenSize([window.innerWidth, window.innerHeight]));
    }, [dispatch]);

    useEffect(() => {
      window.addEventListener('resize', handleWindowResize);
    }, [handleWindowResize]);

    useEffect(() => {
      return () => {
        window.removeEventListener('resize', handleWindowResize);
      };
    }, [handleWindowResize]);
    
    const recordTouches = (e:React.TouchEvent) => {
      if(!isRecording) return;
      dispatch(setTouches(e.touches))
    };

    const endRecordTouches = () => {
      if(!isRecording) return;
      dispatch(setIsRecording(false))
      dispatch(setTouches(null))
    };

    return (
        <div onTouchStart={recordTouches} onTouchMove={recordTouches} onTouchEnd={endRecordTouches}>
            {children}
        </div>
      )
}
export default ScreenEventWrapper;