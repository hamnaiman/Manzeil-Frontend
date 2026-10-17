export function nextReviewOffset(current,maximum,stride,direction){
 if(maximum<=2||stride<=0)return 0;
 if(direction>0)return current>=maximum-2?0:Math.min(maximum,current+stride);
 return current<=2?maximum:Math.max(0,current-stride);
}
