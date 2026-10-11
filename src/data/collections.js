export const collections = {
 all: {label:"All fragrances", category:"", title:"Your next signature awaits.", intro:"A world of fragrance, made for every version of you.", image:"/images/posts/obsession.png", theme:"amber"},
 "for-her": {label:"For her", category:"female", title:"Beautifully, unmistakably you.", intro:"Find a fragrance that feels as personal as your favourite memory.", image:"/images/collections/for-her-wide.png", theme:"rose"},
 "for-him": {label:"For him", category:"male", title:"Presence, without a word.", intro:"Discover your signature. Quiet confidence for every occasion.", image:"/images/collections/for-him-wide.png", theme:"dark"},
 unisex: {label:"Unisex", category:"unisex", title:"A scent beyond labels.", intro:"Wear what moves you. Explore fragrances made to be your own.", image:"/images/collections/unisex-couple.png", theme:"amber"}
};
export const collectionPath = key => key === "all" ? "/products" : "/collections/"+key;
