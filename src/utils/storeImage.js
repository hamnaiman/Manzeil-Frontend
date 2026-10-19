import assets from '../data/cloudinary-assets.json';
export function storeImage(url, width) {
 const source=assets[url] || url;
 if(typeof source!=='string' || !source.startsWith('https://res.cloudinary.com/') || !source.includes('/image/upload/') || source.includes('/s--')) return source;
 const transform='f_auto,q_auto'+(width?',c_limit,w_'+width:'');
 return source.replace('/image/upload/','/image/upload/'+transform+'/');
}
