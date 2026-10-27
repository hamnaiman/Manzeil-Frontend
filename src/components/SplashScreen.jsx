import React,{useCallback,useEffect,useRef,useState} from "react";
import {motion,useReducedMotion} from "framer-motion";
import logo from "../assets/manzeil-gold-emblem.png";
import "../styles/splash-intro.css";
export default function SplashScreen({onComplete}){
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
 function started(){setPlaying(true);clearTimeout(timer.current);const duration=video.current?.duration;timer.current=setTimeout(complete,Number.isFinite(duration)?Math.min(duration/1.8*1000+3000,60000):30000);}
 return <motion.div className={playing?"manzeil-intro intro-original intro-playing":"manzeil-intro intro-original"} initial={{opacity:1}} exit={{opacity:0}} transition={{duration:reducedMotion?0:.5}} role="dialog" aria-modal="true" aria-label="Welcome to Manzeil">
  <div className="manzeil-intro-backdrop" aria-hidden="true"><img src={logo} alt=""/></div>
  <div className="manzeil-intro-glow" aria-hidden="true"/>
  <div className="manzeil-intro-fallback" aria-hidden="true"><img src={logo} alt=""/><span>JO TUM CHAHO</span></div>
  {!reducedMotion&&<video ref={video} className={playing?"manzeil-intro-video is-playing":"manzeil-intro-video"} src="/videos/manzeil-intro.mp4" autoPlay muted playsInline preload="auto" onLoadedMetadata={()=>{if(video.current)video.current.playbackRate=1.8;}} onPlaying={started} onEnded={complete} onError={complete} aria-hidden="true" disablePictureInPicture disableRemotePlayback/>}
  <button autoFocus type="button" className="manzeil-intro-skip" onClick={complete}>Skip intro <span aria-hidden="true">↗</span></button>
 </motion.div>;
}
