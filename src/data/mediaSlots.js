import { heroBottles } from "./heroBottles.js";
export const mediaSlots = [
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
