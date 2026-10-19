import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 20000,
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("customerToken");
  if (token) config.headers.Authorization = "Bearer " + token;
  // Large media uploads need time for Cloudinary processing.
  if (config.data instanceof FormData) config.timeout = 180000;
  return config;
});
// Retry only temporary read failures; never repeat orders, uploads or feedback.
api.interceptors.response.use(response=>response,async error=>{
  const config=error.config;
  const transient=error.code==='ERR_NETWORK'||[502,503,504].includes(error.response?.status);
  if(!config||String(config.method||'get').toLowerCase()!=='get'||!transient||config.signal?.aborted||axios.isCancel(error)||(config.startupRetries||0)>=3)throw error;
  config.startupRetries=(config.startupRetries||0)+1;
  await new Promise((resolve,reject)=>{
    let timer;
    const cancel=()=>{clearTimeout(timer);config.signal?.removeEventListener('abort',cancel);reject(new axios.CanceledError('Request cancelled'));};
    timer=setTimeout(()=>{config.signal?.removeEventListener('abort',cancel);resolve();},500*Math.pow(2,config.startupRetries-1));
    config.signal?.addEventListener('abort',cancel,{once:true});
    if(config.signal?.aborted)cancel();
  });
  return api.request(config);
});
export default api;
