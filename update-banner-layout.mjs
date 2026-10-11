import fs from "node:fs";
const read=p=>fs.readFileSync(p,"utf8"),write=(p,s)=>fs.writeFileSync(p,s);
let s=read("src/data/collections.js").replace("for-her-branded.png","for-her-wide.png").replace("for-him-branded.png","for-him-wide.png");
s=s.replace(/(unisex:.*?image:")([^"]+)(")/,'$1/images/collections/unisex-couple.png$3');
write("src/data/collections.js",s);
s=read("src/pages/Collection.jsx").replace('className={"category-hero category-"+defaults.theme}','className={"category-hero category-"+defaults.theme+" collection-"+slug}');
s=s.replace(':"Fragrance collection"}',':slug==="unisex"?"Husband and wife sharing Manzeil Obsession perfume":"Fragrance collection"}');
write("src/pages/Collection.jsx",s);
s=read("src/pages/admin/AddProduct.jsx");
s=s.replace('import { mediaSlots } from "../../data/mediaSlots.js";','');
s=s.replace(/  const \[media, setMedia\] = useState\(\{\}\);\r?\n/,'').replace(/  const \[preparing, setPreparing\] = useState\(false\);\r?\n/,'');
s=s.replace(/    api.get\("\/content"\).*?\r?\n/,'');
s=s.replace(/  async function choosePost\(slot\) \{[\s\S]*?\n  const inputClass =/,'  const inputClass =');
s=s.replace(/          <section className="admin-media-library"><h2>Campaign image library[\s\S]*?<\/section>\r?\n/,'');
s=s.replaceAll('saving || preparing','saving');
s=s.replace('<span className="text-sm">Upload replacement or gallery images</span>','<span className="text-sm">Upload product photos</span><span className="text-xs">Recommended: 1200 × 1200 px (1:1) · JPG, PNG or WebP · Max 5 MB each · Up to 5 new photos</span>');
s=s.replace('• Use square (1:1) images for a consistent grid','• Recommended size: 1200 × 1200 px (square)').replace('• Keep file size under 2MB for faster loading','• Maximum 5 MB per photo; under 2 MB loads faster');
write("src/pages/admin/AddProduct.jsx",s);
s=read("src/data/mediaSlots.js");
s += `
export function mediaGuidance(key) {
 if(key.endsWith("Hero"))return {size:"2400 × 800 px",ratio:"3:1",note:"Keep the left 50% clear for text. Keep heads, hands and bottles inside the right half with space around the edges.",format:"JPG or WebP"};
 if(key.endsWith("Bottle"))return {size:"1000 × 1400 px",ratio:"5:7",note:"Transparent background. Centre the entire bottle with margin around the cap and base.",format:"Transparent PNG"};
 if(key.endsWith("Decor"))return {size:"1000 × 1000 px",ratio:"1:1",note:"Keep the full fruit, flower or wood arrangement inside the image.",format:"Transparent PNG"};
 if(key.endsWith("Post"))return {size:"1200 × 1200 px",ratio:"1:1",note:"Keep the bottle and label in the centre, with margin on all sides.",format:"JPG, PNG or WebP"};
 if(key==="logo")return {size:"600 × 240 px",ratio:"5:2",note:"Use a clean logo with minimal empty space.",format:"Transparent PNG"};
 return {size:"1600 × 900 px",ratio:"16:9",note:"Keep the subject centred. Responsive banners may crop the outer edges.",format:"JPG or WebP"};
}
`;
write("src/data/mediaSlots.js",s);
s=read("src/pages/admin/MediaLibrary.jsx").replace('import {mediaSlots}', 'import {mediaSlots, mediaGuidance}');
s=s.replace('<h3>{slot.label}</h3>','<h3>{slot.label}</h3><div className="upload-size-guide"><strong>Recommended: {mediaGuidance(slot.key).size}</strong><span>{mediaGuidance(slot.key).ratio} · {mediaGuidance(slot.key).format} · Max 5 MB</span><p>{mediaGuidance(slot.key).note}</p></div>');
write("src/pages/admin/MediaLibrary.jsx",s);
s=read("src/pages/admin/Stories.jsx");
s=s.replace('Video · MP4 or WebM, up to 60 MB','Video · MP4 or WebM, up to 60 MB — recommended 1080 × 1350 px (4:5)');
s=s.replace('Cover · JPG, PNG or WebP, up to 5 MB','Cover · JPG, PNG or WebP, up to 5 MB — recommended 1080 × 1350 px (4:5)');
write("src/pages/admin/Stories.jsx",s);
