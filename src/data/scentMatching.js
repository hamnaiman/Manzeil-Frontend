export const scentNotes=['Rose','Jasmine','Citrus','Bergamot','Vanilla','Amber','Sandalwood','Musk','Oud','Fruity'];
export const occasions=['Everyday','Work','Evening','Special occasion'];
const aliases={Rose:['rose','roses'],Jasmine:['jasmine'],Citrus:['citrus','lemon','lime','orange','grapefruit'],Bergamot:['bergamot'],Vanilla:['vanilla'],Amber:['amber'],Sandalwood:['sandalwood'],Musk:['musk','musky'],Oud:['oud','agarwood'],Fruity:['fruity','fruit','lychee','peach','pear','apple','berries']};
const has=(text,words)=>words.some(word=>new RegExp('\\b'+word+'\\b','i').test(text));
export function scentInfo(product,profile={}){
 const text=String(product.name||'')+' '+String(product.description||'');
 const notes=profile.notes?.length?profile.notes:scentNotes.filter(note=>has(text,aliases[note]));
 const intensity=profile.intensity||(has(text,['rich','bold','intense','heavy'])?'rich':has(text,['light','airy','delicate'])?'light':has(text,['balanced','moderate'])?'balanced':'');
 const moments=profile.occasions?.length?profile.occasions:occasions.filter(moment=>has(text,{'Everyday':['everyday','daily','casual'],'Work':['work','office','business'],'Evening':['evening','night'],'Special occasion':['special occasion','wedding','celebration']}[moment]));
 return {notes,intensity,occasions:moments};
}
export function fitsMood(product,mood,profile){
 const info=scentInfo(product,profile);
 const family={fresh:['Citrus','Bergamot','Fruity'],floral:['Rose','Jasmine'],woody:['Sandalwood','Oud','Musk'],warm:['Vanilla','Amber','Musk']}[mood]||[];
 return info.notes.some(n=>family.includes(n))||has(String(product.description||''),{fresh:['fresh','aquatic'],floral:['floral','flowers'],woody:['woody','wood'],warm:['warm','spicy']}[mood]||[]);
}
export function rankScents(products,profiles,preferences){
 return products.map(product=>{
  const profile=scentInfo(product,profiles?.[product._id]);
  const matched=preferences.notes.filter(note=>profile.notes.includes(note));
  if(preferences.notes.length&&!matched.length)return null;
  const feel=Boolean(preferences.intensity&&profile.intensity===preferences.intensity);
  const moment=Boolean(preferences.occasion&&profile.occasions.includes(preferences.occasion));
  return {...product,matchedNotes:matched,matchReasons:[...(matched.length?['Notes: '+matched.join(', ')]:[]),...(feel?['Your preferred feel']:[]),...(moment?['Suitable for '+preferences.occasion.toLowerCase()]:[])],matchScore:matched.length*3+(feel?2:0)+(moment?2:0)};
 }).filter(Boolean).sort((a,b)=>b.matchScore-a.matchScore);
}
