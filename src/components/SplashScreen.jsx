import React,{useCallback,useEffect,useRef,useState} from "react";
import {motion,useReducedMotion} from "framer-motion";
import logo from "../assets/manzeil-gold-emblem.png";
import "../styles/splash-intro.css";
export default function SplashScreen({onComplete}){
 const canvas=useRef(null);
 const video=useRef(null),timer=useRef(null),finished=useRef(false);
 const [playing,setPlaying]=useState(false);
 const reducedMotion=useReducedMotion();
 const complete=useCallback(()=>{if(finished.current)return;finished.current=true;clearTimeout(timer.current);onComplete();},[onComplete]);
 useEffect(()=>{
  const previous=document.body.style.overflow;document.body.style.overflow="hidden";
  timer.current=setTimeout(complete,reducedMotion?900:8000);
  if(!reducedMotion&&video.current){video.current.muted=true;video.current.playbackRate=1.8;video.current.play()?.catch(complete);}
  return()=>{clearTimeout(timer.current);document.body.style.overflow=previous;};
 },[complete,reducedMotion]);
 useEffect(()=>{
  if(!playing||!video.current||!canvas.current)return;
  const player=video.current,surface=canvas.current;
  const ratio=Math.min(1,480/Math.max(player.videoWidth,player.videoHeight));
  surface.width=Math.max(1,Math.round(player.videoWidth*ratio));
  surface.height=Math.max(1,Math.round(player.videoHeight*ratio));
  const context=surface.getContext("2d",{willReadFrequently:true});
  if(!context){complete();return;}
  let frame;
  function draw(){
   if(player.readyState>=2){
    context.drawImage(player,0,0,surface.width,surface.height);
    const image=context.getImageData(0,0,surface.width,surface.height),pixels=image.data;
    for(let i=0;i<pixels.length;i+=4){
     const red=pixels[i],green=pixels[i+1],blue=pixels[i+2];
     const brightness=Math.max(red,green,blue),darkest=Math.min(red,green,blue);
     // Remove compressed black/grey outlines while retaining gold and bright glints.
     const edge=Math.max(0,Math.min(1,(brightness-65)/75));
     const saturation=brightness?(brightness-darkest)/brightness:0;
     const colour=Math.max(0,Math.min(1,(saturation-.18)/.24));
     const warmth=Math.max(0,Math.min(1,(red-blue-14)/36));
     const alpha=edge*edge*(3-2*edge)*colour*warmth;
     pixels[i+3]=Math.round(alpha*255);
     if(alpha>0&&alpha<1){
      const lift=Math.min(1.65,1/Math.max(edge,.01));
      pixels[i]=Math.min(255,red*lift);pixels[i+1]=Math.min(255,green*lift);pixels[i+2]=Math.min(255,blue*lift);
     }
    }
    context.putImageData(image,0,0);
   }
   frame=requestAnimationFrame(draw);
  }
  draw();
  return()=>cancelAnimationFrame(frame);
 },[playing,complete]);
 function started(){setPlaying(true);clearTimeout(timer.current);const duration=video.current?.duration;timer.current=setTimeout(complete,Number.isFinite(duration)?Math.min(duration/1.8*1000+3000,60000):30000);}
 return <motion.div className={playing?"manzeil-intro intro-original intro-playing":"manzeil-intro intro-original"} initial={{opacity:1}} exit={{opacity:0}} transition={{duration:reducedMotion?0:.5}} role="dialog" aria-modal="true" aria-label="Welcome to Manzeil">
  <div className="manzeil-intro-backdrop" aria-hidden="true"><img src={logo} alt=""/></div>
  <div className="manzeil-intro-glow" aria-hidden="true"/>
  <div className="manzeil-intro-fallback" aria-hidden="true"><img src={logo} alt=""/><span>JO TUM CHAHO</span></div>
  {!reducedMotion&&<video ref={video} className="manzeil-intro-source" src="/videos/manzeil-intro.mp4" autoPlay muted playsInline preload="auto" onLoadedMetadata={()=>{if(video.current)video.current.playbackRate=1.8;}} onPlaying={started} onEnded={complete} onError={complete} aria-hidden="true" disablePictureInPicture disableRemotePlayback/>}
  {!reducedMotion&&<canvas ref={canvas} className={playing?"manzeil-intro-canvas is-playing":"manzeil-intro-canvas"} aria-hidden="true" />}
  <button autoFocus type="button" className="manzeil-intro-skip" onClick={complete}>Skip intro <span aria-hidden="true">↗</span></button>
 </motion.div>;
}



