import fs from "node:fs";
const read=p=>fs.readFileSync(p,"utf8"),write=(p,s)=>fs.writeFileSync(p,s);
for(const file of ["src/components/ProductCard.jsx","src/components/Hero.jsx","src/components/ScentVisualizer.jsx"]){
 let s=read(file);s='import {productPath} from "../utils/productPath.js";\n'+s;
 s=s.replaceAll('"/product/" + product._id','productPath(product)').replaceAll("'/product/'+product._id","productPath(product)");
 write(file,s);
}
for(const file of ["src/pages/Cart.jsx","src/pages/Checkout.jsx"]){
 let s=read(file);s='import {productPath} from "../utils/productPath.js";\n'+s;
 s=s.replaceAll("'/product/'+item.product","productPath(item)").replaceAll('"/product/" + item.product','productPath(item)');
 write(file,s);
}
let s=read("src/context/CartContext.jsx");
s=s.replace('          product: productId,','          product: productId,\n          slug: item.slug,');
write("src/context/CartContext.jsx",s);
s=read("src/pages/ProductDetail.jsx");
s='import {ProductSeo} from "../components/Seo.jsx";\nimport {productPath} from "../utils/productPath.js";\n'+s;
s=s.replace("item.product===id","item.product===product?._id");
s=s.replace(' const images=product?.images||[];', ' useEffect(()=>{if(product?.slug&&id!==product.slug)navigate(productPath(product),{replace:true});},[product?.slug,id,navigate]);\n const images=product?.images||[];');
s=s.replace('<main id="main-content" className="fragrance-page">','<main id="main-content" className="fragrance-page"><ProductSeo product={product} error={error}/>');
write("src/pages/ProductDetail.jsx",s);
s=read("src/App.jsx");s='import RouteSeo from "./components/Seo.jsx";\n'+s;s=s.replace('<Navbar />','<RouteSeo /><Navbar />');write("src/App.jsx",s);
s=read("src/pages/admin/AddProduct.jsx");
s=s.replace('const emptyForm = {','const emptyForm = {\n  seoTitle:"", seoDescription:"", seoKeywords:"",');
s=s.replace('      name: product.name || "",','      name: product.name || "",\n      seoTitle:product.seoTitle||"", seoDescription:product.seoDescription||"", seoKeywords:product.seoKeywords||"",');
s=s.replace('          {/* Basic Info */}',`          <details className="admin-product-seo"><summary>Search appearance (SEO)</summary><p>Leave blank to use the product name and description automatically. Use target phrases naturally in your visible product description.</p><label>SEO title · up to 70 characters<input name="seoTitle" value={form.seoTitle} onChange={handleChange} maxLength={70} className={inputClass} placeholder="Obsession Perfume | Manzeil Pakistan"/></label><label>SEO description · up to 180 characters<textarea name="seoDescription" value={form.seoDescription} onChange={handleChange} maxLength={180} className={inputClass} rows={3}/></label><label>Target keywords · comma separated<input name="seoKeywords" value={form.seoKeywords} onChange={handleChange} maxLength={300} className={inputClass} placeholder="Obsession perfume, unisex perfume Pakistan"/></label><p>Product-name URLs are assigned automatically. Existing URLs stay stable when you rename a product.</p></details>
          {/* Basic Info */}`);
write("src/pages/admin/AddProduct.jsx",s);
s=read("index.html").replace('<title>Manzeil | Jo Tum Chaho</title>','<title>Perfumes in Pakistan | Manzeil — Jo Tum Chaho</title>\n    <meta name="description" content="Shop Manzeil perfumes for women, men and everyone in Pakistan. Discover your signature fragrance with cash on delivery. Jo Tum Chaho." />');
write("index.html",s);
