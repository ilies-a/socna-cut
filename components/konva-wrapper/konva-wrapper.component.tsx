import dynamic from 'next/dynamic';

const KonvaWrapper = dynamic(() => import('./static-konva-wrapper.component'), {
    ssr: false,
})
  
export default KonvaWrapper;