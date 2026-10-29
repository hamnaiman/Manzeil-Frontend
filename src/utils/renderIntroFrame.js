// Process the logo on the GPU; update only when a new video frame is decoded.
export function startIntroRenderer(player,surface){
 const limit=window.matchMedia('(max-width:600px)').matches?192:320;
 const ratio=Math.min(1,limit/Math.max(player.videoWidth,player.videoHeight));
 surface.width=Math.max(1,Math.round(player.videoWidth*ratio));
 surface.height=Math.max(1,Math.round(player.videoHeight*ratio));
 const gl=surface.getContext('webgl',{alpha:true,premultipliedAlpha:false,antialias:false,depth:false,stencil:false,powerPreference:"high-performance"});
 let render,dispose=()=>{};
 if(gl){
  function shader(type,source){const result=gl.createShader(type);gl.shaderSource(result,source);gl.compileShader(result);if(!gl.getShaderParameter(result,gl.COMPILE_STATUS)){gl.deleteShader(result);throw new Error('Intro shader unavailable');}return result;}
  const vertex=shader(gl.VERTEX_SHADER,'attribute vec2 position;varying vec2 uv;void main(){uv=(position+1.0)*0.5;gl_Position=vec4(position,0.0,1.0);}');
  const fragment=shader(gl.FRAGMENT_SHADER,`precision mediump float;
   varying vec2 uv;uniform sampler2D frame;
   void main(){
    vec3 c=texture2D(frame,uv).rgb;
    float hi=max(c.r,max(c.g,c.b));float lo=min(c.r,min(c.g,c.b));
    float edge=clamp((hi-65.0/255.0)/(75.0/255.0),0.0,1.0);
    float saturation=hi>0.0?(hi-lo)/hi:0.0;
    float colour=clamp((saturation-0.18)/0.24,0.0,1.0);
    float warmth=clamp((c.r-c.b-14.0/255.0)/(36.0/255.0),0.0,1.0);
    float alpha=edge*edge*(3.0-2.0*edge)*colour*warmth;
    float lift=min(1.65,1.0/max(edge,0.01));
    gl_FragColor=vec4(clamp(c*lift,0.0,1.0),alpha);
   }`);
  const program=gl.createProgram();gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('Intro renderer unavailable');
  gl.useProgram(program);
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  const position=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
  gl.uniform1i(gl.getUniformLocation(program,'frame'),0);gl.viewport(0,0,surface.width,surface.height);
  render=()=>{if(gl.isContextLost())return;gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,player);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);};
  dispose=()=>{gl.deleteTexture(texture);gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vertex);gl.deleteShader(fragment);};
 }else{
  const context=surface.getContext('2d',{willReadFrequently:true});
  if(!context)throw new Error('Intro canvas unavailable');
  render=()=>{
   context.drawImage(player,0,0,surface.width,surface.height);
   const image=context.getImageData(0,0,surface.width,surface.height),pixels=image.data;
   for(let i=0;i<pixels.length;i+=4){
    const red=pixels[i],green=pixels[i+1],blue=pixels[i+2];
    const hi=Math.max(red,green,blue),lo=Math.min(red,green,blue),edge=Math.max(0,Math.min(1,(hi-65)/75));
    const saturation=hi?(hi-lo)/hi:0;
    const colour=Math.max(0,Math.min(1,(saturation-.18)/.24)),warmth=Math.max(0,Math.min(1,(red-blue-14)/36));
    const alpha=edge*edge*(3-2*edge)*colour*warmth,lift=Math.min(1.65,1/Math.max(edge,.01));
    pixels[i+3]=Math.round(alpha*255);pixels[i]=Math.min(255,red*lift);pixels[i+1]=Math.min(255,green*lift);pixels[i+2]=Math.min(255,blue*lift);
   }
   context.putImageData(image,0,0);
  };
 }
 let handle,stopped=false,lastTime=-1;
 const decodedFrames=typeof player.requestVideoFrameCallback==='function';
 function draw(){
  if(stopped)return;
  if(player.readyState>=2&&player.currentTime!==lastTime){render();lastTime=player.currentTime;}
  if(!player.ended)handle=decodedFrames?player.requestVideoFrameCallback(draw):requestAnimationFrame(draw);
 }
 draw();
 return()=>{stopped=true;if(decodedFrames)player.cancelVideoFrameCallback(handle);else cancelAnimationFrame(handle);dispose();};
}

