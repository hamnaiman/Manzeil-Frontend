import api from "../api/axios.js";
let memorySession=null;
export function trackPage(path) {
 if(!path||path.startsWith("/admin")||navigator.doNotTrack==="1")return;
 let session;
 try{
  session=JSON.parse(sessionStorage.getItem("manzeil-visit-session")||"null");
  if(!session||Date.now()-session.last>30*60*1000)session={id:crypto.randomUUID()};
  session.last=Date.now();
  sessionStorage.setItem("manzeil-visit-session",JSON.stringify(session));
 }catch{memorySession??={id:crypto.randomUUID()};session=memorySession;}
 api.post("/visits",{path,sessionId:session.id,eventId:crypto.randomUUID()},{timeout:5000}).catch(()=>{});
}
