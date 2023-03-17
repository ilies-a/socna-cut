import { setIsRecording, setTouches } from "@/redux/screen-event/screen-event.actions";
import { selectIsRecording } from "@/redux/screen-event/screen-event.selectors";
import { useDispatch, useSelector } from "react-redux";

type ScreenEventWrapperProps = {
    children: JSX.Element,
  };


const ScreenEventWrapper: React.FC<ScreenEventWrapperProps> = ({children}) => {
    const isRecording:boolean = useSelector(selectIsRecording);
    const dispatch = useDispatch();
  
    
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