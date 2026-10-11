import fs from "node:fs";
const read=p=>fs.readFileSync(p,"utf8"),write=(p,s)=>fs.writeFileSync(p,s);
let s=read("src/App.jsx");
s='import Collection from "./pages/Collection.jsx";\n'+s;
s=s.replace('<Route path="/product/:id"', '<Route path="/products" element={<StorefrontLayout><Collection /></StorefrontLayout>} />\n          <Route path="/collections/:slug" element={<StorefrontLayout><Collection /></StorefrontLayout>} />\n          <Route path="/product/:id"');
write("src/App.jsx",s);
for(const path of ["src/components/Navbar.jsx","src/components/Footer.jsx","src/pages/Home.jsx"]){
 s=read(path).replaceAll('/?category=female#collection','/collections/for-her').replaceAll('/?category=male#collection','/collections/for-him').replaceAll('/?category=unisex#collection','/collections/unisex');
 if(path.includes("Navbar")){
  s=s.replace('["/", "Home"],','["/", "Home"], ["/products", "Shop"],').replaceAll('/?search=1#collection','/products?search=1');
  s=s.replace('return location.pathname === url.pathname && location.search === url.search && location.hash === url.hash;', 'return location.pathname === url.pathname && (url.pathname !== "/" || (location.search === url.search && location.hash === url.hash));');
 }
 if(path.includes("Footer"))s=s.replace('to="/#collection"','to="/products"');
 if(path.includes("Home")){
  s=s.replace('limit: 12,','limit: 8,');
  s=s.replace('    </section>\n\n    {contentError','      <div className="home-shop-all"><Link className="scent-button" to="/products">Explore all fragrances <ArrowUpRight size={16}/></Link></div>\n    </section>\n\n    {contentError');
 }
 write(path,s);
}
s=read("src/data/mediaSlots.js").replace('export const mediaSlots = [','import { collections } from "./collections.js";\nexport const mediaSlots = [\n ...Object.entries(collections).map(([key,item])=>({key:key+"Hero",label:item.label+" — collection hero",url:item.image})),');
write("src/data/mediaSlots.js",s);
s=read("../backend/models/SiteContent.js").replace('  media: {','  collectionHeroes: { type: Map, of: new mongoose.Schema({title:{type:String,maxlength:100},intro:{type:String,maxlength:500}},{_id:false}), default:{} },\n  media: {');
write("../backend/models/SiteContent.js",s);
write("../backend/utils/collectionValidation.js",`import { fail, textField } from "./contentValidation.js";
export const collectionKeys = ["all","for-her","for-him","unisex"];
export function collectionFields(value) {
 if (!value || typeof value !== "object" || Array.isArray(value)) fail("Invalid collection settings");
 const fields={};
 for(const [key,hero] of Object.entries(value)){
  if(!collectionKeys.includes(key)||!hero||typeof hero!=="object"||Array.isArray(hero))fail("Invalid collection");
  fields["collectionHeroes."+key]={title:textField(hero.title,"Collection title",100,true),intro:textField(hero.intro,"Collection introduction",500,true)};
 }
 return fields;
}
export function catalogFilters(query) {
 const extra={};
 for(const key of ["minPrice","maxPrice"])if(query[key]!==undefined&&query[key]!==""){
  const value=Number(query[key]);
  if(!Number.isFinite(value)||value<0)fail("Prices must be positive numbers");
  (extra.price??={})[key==="minPrice"?"$gte":"$lte"]=value;
 }
 if(extra.price?.$gte!==undefined&&extra.price?.$lte!==undefined&&extra.price.$gte>extra.price.$lte)fail("Minimum price must not exceed maximum price");
 if(query.inStock==="true")extra.stock={$gt:0};
 return extra;
}
`);
s=read("../backend/routes/contentRoutes.js");
s='import { collectionFields, collectionKeys } from "../utils/collectionValidation.js";\n'+s;
s=s.replace('  const fields = {};','  const fields = req.body.collectionHeroes === undefined ? {} : collectionFields(req.body.collectionHeroes);');
s=s.replace('new Set(["logo"', 'new Set([...collectionKeys.map(key=>key+"Hero"),"logo"');
write("../backend/routes/contentRoutes.js",s);
s=read("../backend/controllers/productController.js");
s='import { catalogFilters } from "../utils/collectionValidation.js";\n'+s;
s=s.replace('const filter = { isActive: true };','const filter = { isActive: true, ...catalogFilters(req.query) };');
s=s.replace(/  if \(minPrice \|\| maxPrice\) \{[\s\S]*?\n  \}/,'');
write("../backend/controllers/productController.js",s);
s=read("src/pages/admin/WebsiteSettings.jsx");
s='import CollectionSettings from "./CollectionSettings.jsx";\n'+s;
s=s.replace('<MediaLibrary />','<CollectionSettings /><MediaLibrary />');
write("src/pages/admin/WebsiteSettings.jsx",s);
