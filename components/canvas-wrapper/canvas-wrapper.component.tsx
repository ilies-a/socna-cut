import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import styles from './canvas-wrapper.module.scss';
import CanvasElementOptions from '../canvas-element-options/canvas-element-options.component'
import {canvasElements, CanvasElement, Handle} from '../canvas-elements(old)';
import { v4 } from 'uuid';


const DEFAULT_NEW_ELEMENT_HEIGHT = 25;
const HANDLE_TOUCH_TOLERANCE_RADIUS = 15;


const CanvasWrapper = () => {
  // const [canvas, setCanvas] = useState<fabric.Canvas | undefined>();
  
  const canvasRef: MutableRefObject<HTMLCanvasElement | null> = useRef(null);
  const [touches, setTouches] = useState<React.TouchList | undefined>(undefined);


  useEffect(() => {
    const canvas = canvasRef.current;
    if(canvas === null) return;
    const ctx = canvas.getContext('2d');
    if(ctx === null) return;
    requestAnimationFrame(() => {renderLoop(ctx, canvas)});
  });

    // const draw = useCallback((ctx:CanvasRenderingContext2D) => {
    //   ctx.fillStyle = '#000000'
    //   ctx.beginPath()
    //   ctx.arc(50, 100, 20, 0, 2*Math.PI)
    //   ctx.fill()
    // }, []);


  const draw = (ctx:CanvasRenderingContext2D, canvas:HTMLCanvasElement) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //draw elements
    for (const el of canvasElements) {
      ctx.fillStyle = el.isSelected? "red" : el.fillColor;
      // ctx.beginPath()
      // ctx.arc(50, 100, 20, 0, 2*Math.PI)
      ctx.beginPath();
      const path = el.path;
      ctx.moveTo(path[0][1], path[0][1]);
      for (let i=1; i<path.length; i++){
        ctx.lineTo(path[i][0], path[i][1]);
      }
      // ctx.strokeStyle = "black";
      // ctx.stroke();
      ctx.fill();

      //draw handler if exists
      if(el.handle !== undefined){
        ctx.fillStyle = "white";
        ctx.beginPath();
        const handleRadius = 5;
        ctx.arc(el.handle.position[0],el.handle.position[1],handleRadius,0,2*Math.PI);
        ctx.stroke();
      }

      ctx.fill();
    }




  };

  const renderLoop = (ctx:CanvasRenderingContext2D, canvas:HTMLCanvasElement) => {
    draw(ctx, canvas);
    requestAnimationFrame(() => {renderLoop(ctx, canvas)});
  };

    // useEffect(() => {
    //   // setCanvas(new fabric.Canvas("c", {
    //   //   backgroundColor: "lightgrey",
    //   // }));

    //   const canvas = canvasRef.current
    //   if(canvas === null) return;
    //   const context = canvas.getContext('2d')
      
    //   //Our draw come here
    //   draw(context)

    // },[draw]);
  

    const addElement = (elementType:string) => {
      const canvas: HTMLCanvasElement | null = canvasRef.current;
      if(canvas === null) return;

      const canvasWidth = canvas.width;
      let newElement: CanvasElement;

      if(canvasElements.length > 0){
        const newElementTop = canvasElements[canvasElements.length-1].getHeight();
        newElement = new CanvasElement(v4(), elementType, [[0, newElementTop], [canvasWidth, newElementTop], [canvasWidth, newElementTop + DEFAULT_NEW_ELEMENT_HEIGHT], [0, newElementTop + DEFAULT_NEW_ELEMENT_HEIGHT], [0, newElementTop]], "green");
      }else{
        newElement = new CanvasElement(v4(), elementType, [[0, 0], [canvasWidth, 0], [canvasWidth, DEFAULT_NEW_ELEMENT_HEIGHT], [0, DEFAULT_NEW_ELEMENT_HEIGHT], [0, 0]], "blue")
      }

      canvasElements.push(newElement);

      
      // const canvas: HTMLCanvasElement | null = canvasRef.current;
      // if(canvas === null) return;
      // const context = canvas.getContext('2d');
      // if(context === null) return;
      // //Our first draw
      // context.fillStyle = '#000000'
      // context.fillRect(0, 0, context.canvas.width, context.canvas.height)

      // const component = new fabric.Rect({
      //   left: 100,
      //   top: 100,
      //   fill: "blue",
      //   width: 20,
      //   height: 20,
      // });
      // component.on('mousedown', function(e:fabric.IEvent<MouseEvent>) { 
      //     alert("ok")
      //     console.log(e.target);
      //     component.fill = "red";
      // });
      // if (canvas !== undefined ){
      //   canvas.add(component);
      // }
    }

  const handleTouch= (e:React.TouchEvent) => {
    setTouches(e.touches);
    handleSelectElement(e.touches);
    handleElementHandle(e.touches);
    // handleResizeHandledElement(e.touches);
  }

  const handleTouchEnd= (e:React.TouchEvent) => {
    setTouches(undefined);
    // unselectAllElements();
    unhandleHandledElement();
  }

  const handleTouchMove = (e:React.TouchEvent) => {
    setTouches(e.touches);
  }
  const handleSelectElement = (touches: React.TouchList) => {
    const canvas = canvasRef.current;
    if(canvas === null) return;

    unselectAllElements();
    
    const canvasPos = canvas.getBoundingClientRect();
    for (let i=0; i < touches.length; i++) {
      const touchPos = getTouchPos(touches[i], canvasPos);
      for (const el of canvasElements) {
        if(pointInPolygon(el.path, touchPos)){
          el.isSelected = true;
          return
        }
        // el.isSelected = false;
        // el.handle = undefined;
      }
    }
  };

  const handleElementHandle = (touches: React.TouchList) => {
    const canvas = canvasRef.current;
    if(canvas === null) return;

    unhandleHandledElement();

    const selectedEl = getSelectedCanvasElement();
    if(selectedEl === undefined) return;

    const selectedElX = selectedEl.getX();
    const selectedElY = selectedEl.getY();
    const selectedElWidth = selectedEl.getWidth();
    const selectedElHeight = selectedEl.getHeight();

    const handles = [
      [selectedElX, selectedElY],
      [(selectedElX + selectedElWidth) * 0.5, selectedElY],
      [selectedElX + selectedElWidth, selectedElY],
      [selectedElX + selectedElWidth, (selectedElY + selectedElHeight) * 0.5],
      [selectedElX + selectedElWidth, selectedElY + selectedElHeight],
      [(selectedElX + selectedElWidth) * 0.5, selectedElY + selectedElHeight],
      [selectedElX , selectedElY + selectedElHeight],
      [selectedElX , (selectedElY + selectedElHeight) * 0.5]
    ]

    const canvasPos = canvas.getBoundingClientRect();
    for (let i=0; i < touches.length; i++) {
      const touchPos = getTouchPos(touches[i], canvasPos);

      for(let i=0; i<handles.length; i++){  
        const dx = touchPos[0] - handles[i][0];
        const dy = touchPos[1] - handles[i][1];
        const d = Math.sqrt(dx * dx + dy * dy);

        if(d <= HANDLE_TOUCH_TOLERANCE_RADIUS){
          selectedEl.handle = new Handle(i + 1, [handles[i][0], handles[i][1]]);
        }
      }
    }
  } 

  const unhandleHandledElement = () => {
    const handledEl = getHandledCanvasElement();
    if(handledEl === undefined) return;

    handledEl.handle = undefined;
  }
  const unselectAllElements = () => {
    for (const el of canvasElements) {
      el.isSelected = false;
    }
  };

  const getTouchPos = (touch:React.Touch, canvasPos:DOMRect): [number, number] => {
    const touchX = touch.clientX - canvasPos.left;
    const touchY = touch.clientY - canvasPos.top;
    return [touchX, touchY]
  }

    //with mouse (desktop version)
    // const handleMousemove = (e:React.MouseEvent) => {
    //   const canvasPos = (e.target as Element).getBoundingClientRect();
    //   const mouseX = e.clientX - canvasPos.left;
    //   const mouseY = e.clientY - canvasPos.top;

    //   handleSelectElement([mouseX, mouseY]);
    // }

    // const handleSelectElement = (mousePos: [number, number]) => {
    //   for (const el of canvasElements) {
    //     if(pointInPolygon(el.path, mousePos)){
    //       el.isSelected = true;
    //       continue;
    //     }
    //     el.isSelected = false;
    //   }
    // }

  const pointInPolygon = function (polygon:[number, number][], point:[number, number]) {
    //A point is in a polygon if a line from the point to infinity crosses the polygon an odd number of times
    let odd = false;
    //For each edge (In this case for each point of the polygon and the previous one)
    for (let i = 0, j = polygon.length - 1; i < polygon.length; i++) {
      //If a line from the point into infinity crosses this edge
      if (((polygon[i][1] > point[1]) !== (polygon[j][1] > point[1])) // One point needs to be above, one below our y coordinate
        // ...and the edge doesn't cross our Y corrdinate before our x coordinate (but between our x coordinate and infinity)
        && (point[0] < ((polygon[j][0] - polygon[i][0]) * (point[1] - polygon[i][1]) / (polygon[j][1] - polygon[i][1]) + polygon[i][0]))) {
        // Invert odd
        odd = !odd;
      }
      j = i;
  
    }
    //If the number of crossings was odd, the point is in the polygon
    return odd;
  };
  
  const getNewCanvasElementDefaultPosition = () => {

  };

  const getSelectedCanvasElement = ():CanvasElement | undefined => {
    for(const el of canvasElements){
      if(el.isSelected){
        return el;
      }
    }
  }
  
  const getHandledCanvasElement = ():CanvasElement | undefined => {
    for(const el of canvasElements){
      if(el.handle !== undefined){
        return el;
      }
    }
  }

  const handleResizeHandledElement = (touches: React.TouchList) => {
    const handledEl = getHandledCanvasElement();
    if(handledEl === undefined) return;

    handledEl.handle = undefined;
  }


  return <div className={styles["main-wrapper"]}>
        {/* <canvas id="c" width="300" height="500" ref={canvasRef} onTouchStart={handleTouch} onTouchEnd={handleTouchEnd}></canvas> */}

    <canvas id="c" width="300" height="500" ref={canvasRef} onTouchStart={handleTouch} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}></canvas>
    <CanvasElementOptions element={undefined} canvasRef={canvasRef} touches={touches}/>
    <button onClick={()=>addElement('')}>Add element</button>
  </div>
};

export default CanvasWrapper;
