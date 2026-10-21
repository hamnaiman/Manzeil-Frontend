import { heroBottles } from "./heroBottles.js";
import { collections } from "./collections.js";
export const mediaSlots = [
 {key:"storyImage",label:"The Manzeil Philosophy — arch image",url:"/images/posts/hitman.png"},
 {key:"perspectivesLeft",label:"Two Perspectives — left lifestyle image",url:"/images/perspectives/quiet-moments.png"},
 {key:"perspectivesRight",label:"Two Perspectives — right lifestyle image",url:"/images/perspectives/golden-moments.png"},
 ...Object.entries(collections).map(([key,item])=>({key:key+"Hero",label:item.label+" — collection hero",url:item.image})),
 {key:"logo",label:"Hero logo",url:"/manzeil-logo.png"},
 ...heroBottles.flatMap(b => [
  {key:b.key+"Bottle",label:b.name+" — transparent bottle",url:b.image},
  {key:b.key+"Decor",label:b.name+" — background accent",url:b.decor},
  {key:b.key+"Post",label:b.name+" — campaign post",url:"/images/posts/"+b.key+".png"}
 ]),
 {key:"femaleEdit",label:"Feminine collection banner",url:"/images/posts/serene.png"},
 {key:"maleEdit",label:"Masculine collection banner",url:"/images/posts/business-elegance.png"}
];
export const mediaUrl = (media,key) => media?.[key] || mediaSlots.find(slot=>slot.key===key)?.url;

export function mediaGuidance(key) {
 if(key==="storyImage")return {size:"1400 × 1600 px",ratio:"7:8",note:"Upload a full rectangular portrait. The website creates the arch automatically. Keep faces and bottles near the centre with space above the head and around the edges for the arch and scroll animation.",format:"JPG, PNG or WebP"};
 if(key==="perspectivesLeft"||key==="perspectivesRight")return {size:"1600 × 800 px",ratio:"2:1",note:"Keep the entire head and perfume visible. Leave room at the lower edge for the caption.",format:"JPG or WebP"};
 if(key.endsWith("Hero"))return {size:"2400 × 800 px",ratio:"3:1",note:"Keep the left 50% clear for text. Keep heads, hands and bottles inside the right half with space around the edges.",format:"JPG or WebP"};
 if(key.endsWith("Bottle"))return {size:"1000 × 1400 px",ratio:"5:7",note:"Transparent background. Centre the entire bottle with margin around the cap and base.",format:"Transparent PNG"};
 if(key.endsWith("Decor"))return {size:"1000 × 1000 px",ratio:"1:1",note:"Keep the full fruit, flower or wood arrangement inside the image.",format:"Transparent PNG"};
 if(key.endsWith("Post"))return {size:"1200 × 1200 px",ratio:"1:1",note:"Keep the bottle and label in the centre, with margin on all sides.",format:"JPG, PNG or WebP"};
 if(key==="logo")return {size:"600 × 240 px",ratio:"5:2",note:"Use a clean logo with minimal empty space.",format:"Transparent PNG"};
 return {size:"1600 × 900 px",ratio:"16:9",note:"Keep the subject centred. Responsive banners may crop the outer edges.",format:"JPG or WebP"};
}
