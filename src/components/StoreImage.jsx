import React, { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { storeImage } from '../utils/storeImage.js';
const StoreImage=forwardRef(function StoreImage({src,srcSet,sizes,decoding='async',fetchPriority,onError,...props},ref) {
 const [failedSource,setFailedSource]=useState(null);
 const resolved=storeImage(src);
 const fallback=failedSource===src;
 const isCloud=typeof resolved==='string' && resolved.includes('res.cloudinary.com/') && resolved.includes('/image/upload/');
 return <img {...props} ref={ref} fetchpriority={fetchPriority} src={fallback?src:resolved} decoding={decoding}
  sizes={sizes || (props.width && Number.isFinite(Number(props.width))?Number(props.width)+'px':isCloud?'100vw':undefined)}
  srcSet={fallback?undefined:srcSet || (isCloud?[320,640,960,1440,1920].map(w=>storeImage(src,w)+' '+w+'w').join(', '):undefined)}
  onError={event=>{if(!fallback && resolved!==src){setFailedSource(src);return;}onError?.(event);}}/>;
});
export default StoreImage;
export const MotionStoreImage=motion.create(StoreImage);
