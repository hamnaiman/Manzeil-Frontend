import test,{before,after} from "node:test";
import assert from "node:assert/strict";
import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {createServer} from "vite";
let server,ParcelDocument;
before(async()=>{
 server=await createServer({server:{middlewareMode:true},appType:"custom"});
 ({ParcelDocument}=await server.ssrLoadModule("/src/pages/admin/ParcelLabelEditor.jsx"));
});
after(async()=>{await server?.close();});
const order={
 _id:"507f1f77bcf86cd799439012",createdAt:"2026-10-22T12:00:00Z",
 createdByName:"PRIVATE_ADMIN_SENTINEL",labelUpdatedByName:"PRIVATE_OPERATOR_SENTINEL",internalNote:"PRIVATE_NOTE_SENTINEL",
 shippingAddress:{fullName:"Customer Example",phone:"03001234567",address:"House 4, Street 10",city:"Lahore"},
 orderItems:[{name:"Obsession",price:1200,quantity:2}],
 itemsPrice:2400,shippingPrice:200,discountAmount:100,totalPrice:2500,isPaid:false
};
const settings={senderName:"Manzeil",senderPhone:"03000000000",senderAddress:"Store return address",courier:"Courier",trackingNumber:"TRACK-12",instructions:"Handle with care",showItems:true,showPrices:true};
for(const format of ["label","receipt"])test(format+" contains customer/amount but never internal operator names or notes",()=>{
 const html=renderToStaticMarkup(React.createElement(ParcelDocument,{order,settings:{...settings,format}}));
 for(const secret of ["PRIVATE_ADMIN_SENTINEL","PRIVATE_OPERATOR_SENTINEL","PRIVATE_NOTE_SENTINEL","Entered by"])assert.ok(!html.includes(secret));
 assert.ok(html.includes("Customer Example"));assert.ok(html.includes("Lahore"));assert.ok(html.includes("TRACK-12"));assert.ok(html.includes("2,500"));
});
test("paid receipts show zero collectible amount",()=>{
 const html=renderToStaticMarkup(React.createElement(ParcelDocument,{order:{...order,isPaid:true},settings:{...settings,format:"receipt"}}));
 assert.ok(html.includes("PAID · NOTHING TO COLLECT"));assert.match(html,/parcel-collect[\s\S]*?Rs\. 0/);
});
test("hiding item prices preserves required collectible total",()=>{
 const html=renderToStaticMarkup(React.createElement(ParcelDocument,{order,settings:{...settings,format:"label",showPrices:false}}));
 assert.ok(!html.includes("parcel-totals"));assert.ok(html.includes("Obsession"));assert.ok(html.includes("CASH TO COLLECT"));assert.ok(html.includes("2,500"));
});
