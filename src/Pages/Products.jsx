import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const backendurl = import.meta.env.VITE_BACKENDURL;

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;0,900;1,900&family=Barlow:wght@400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;overflow-x:hidden}
body{background:#060606;color:#fff;font-family:'Barlow',sans-serif;overflow-x:hidden}
:root{
  --red:#E8192C;--red2:#ff2d42;--gold:#D4A843;
  --bg:#060606;--bg1:#0C0C0C;--bg2:#111111;--bg3:#181818;
  --line:#1C1C1C;--muted:#3a3a3a;--sub:#666;--text:#EBEBEB;
  --fd:'Barlow Condensed',sans-serif;--fb:'Barlow',sans-serif;
}
::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--red);border-radius:1px}
@keyframes fadeUp{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideR{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(.94) translateY(34px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes shimmer{0%,100%{opacity:.2}50%{opacity:.5}}
@keyframes alertIn{from{opacity:0;transform:translateX(-50%) translateY(16px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(232,25,44,.6)}70%{box-shadow:0 0 0 10px rgba(232,25,44,0)}100%{box-shadow:0 0 0 0 rgba(232,25,44,0)}}
@keyframes marqueeRed{from{transform:translateX(0)}to{transform:translateX(-33.333%)}}
@keyframes grain{0%,100%{transform:translate(0,0)}10%{transform:translate(-2%,-3%)}20%{transform:translate(1%,2%)}30%{transform:translate(-1%,1%)}40%{transform:translate(2%,-1%)}50%{transform:translate(-3%,2%)}60%{transform:translate(1%,-2%)}70%{transform:translate(-2%,3%)}80%{transform:translate(3%,1%)}90%{transform:translate(-1%,-2%)}}
.sn-grain{position:fixed;inset:0;width:100%;height:100%;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");opacity:.04;pointer-events:none;z-index:0;will-change:transform;animation:grain 6s steps(2) infinite;}
.sn-img{transition:transform .6s cubic-bezier(.16,1,.3,1);display:block}
.sn-tab{background:none;border:none;font-family:var(--fd);font-size:12px;font-weight:900;letter-spacing:3px;text-transform:uppercase;cursor:pointer;padding:16px 20px;color:var(--sub);border-bottom:2px solid transparent;margin-bottom:-1px;transition:color .2s,border-color .2s;}
.sn-tab:hover{color:var(--text)}
.sn-tab.on{color:#fff;border-bottom-color:var(--red)}
.sn-sz{background:var(--bg2);color:var(--sub);border:1px solid var(--line);padding:8px 14px;font-size:11px;font-weight:900;font-family:var(--fd);letter-spacing:1px;cursor:pointer;transition:all .18s;clip-path:polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%);}
.sn-sz:hover{border-color:var(--sub);color:#fff}
.sn-sz.on{background:#fff;color:#000;border-color:#fff}
.sn-cat{padding:9px 22px;border:1px solid var(--line);background:transparent;color:var(--sub);font-size:10px;font-weight:900;font-family:var(--fd);letter-spacing:3px;text-transform:uppercase;cursor:pointer;transition:all .2s;clip-path:polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%);}
.sn-cat:hover{border-color:var(--sub);color:var(--text)}
.sn-cat.on{background:var(--red);border-color:var(--red);color:#fff}
.sn-pri{position:relative;overflow:hidden;background:none;color:#fff;border:2px solid #fff;font-size:11px;font-weight:900;font-family:var(--fd);letter-spacing:2.5px;text-transform:uppercase;cursor:pointer;transition:color .22s;padding:13px 22px;clip-path:polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%);display:inline-flex;align-items:center;gap:8px;}
.sn-pri::before{content:'';position:absolute;inset:0;background:#fff;transform:translateX(-101%);transition:transform .28s cubic-bezier(.16,1,.3,1);}
.sn-pri:hover::before{transform:translateX(0)}
.sn-pri:hover{color:#000}
.sn-pri>*{position:relative;z-index:1}
.sn-acc{position:relative;overflow:hidden;background:none;color:#fff;border:2px solid var(--red);font-size:11px;font-weight:900;font-family:var(--fd);letter-spacing:2.5px;text-transform:uppercase;cursor:pointer;transition:color .22s;padding:13px 22px;clip-path:polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%);display:inline-flex;align-items:center;gap:8px;}
.sn-acc::before{content:'';position:absolute;inset:0;background:var(--red);transform:translateX(-101%);transition:transform .28s cubic-bezier(.16,1,.3,1);}
.sn-acc:hover::before{transform:translateX(0)}
.sn-acc>*{position:relative;z-index:1}
.sn-wl{width:46px;height:46px;border:1px solid var(--line);background:var(--bg2);color:var(--sub);font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;flex-shrink:0;clip-path:polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%);}
.sn-wl:hover,.sn-wl.on{border-color:#e11d48;color:#e11d48;background:rgba(225,29,72,.08)}
.sn-qty{background:var(--bg2);color:#fff;border:none;width:40px;height:46px;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s;font-family:var(--fd);font-weight:900;}
.sn-qty:hover{background:var(--bg3)}
.sn-card-wrap{background:var(--bg1);overflow:hidden;border:1px solid var(--line);position:relative;clip-path:polygon(0 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%);transition:transform .33s cubic-bezier(.16,1,.3,1),box-shadow .33s,border-color .33s;cursor:pointer;}
.sn-card-wrap:hover{transform:translateY(-10px) scale(1.012);box-shadow:0 36px 80px rgba(0,0,0,.98);border-color:#242424;}
.sn-card-wrap::after{content:'';position:absolute;bottom:0;left:0;right:0;height:3px;background:var(--red);transform:scaleX(0);transform-origin:left;transition:transform .33s cubic-bezier(.16,1,.3,1);}
.sn-card-wrap:hover::after{transform:scaleX(1)}
.sn-card-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.9) 0%,rgba(0,0,0,.1) 42%,transparent 100%);opacity:0;transition:opacity .3s;pointer-events:none;}
.sn-card-wrap:hover .sn-card-overlay{opacity:1}
.sn-card-wrap:hover .sn-img{transform:scale(1.07)}
.sn-quick-add{position:absolute;bottom:0;left:0;right:0;border-radius:0;padding:14px;letter-spacing:3px;font-size:10px;font-weight:900;font-family:var(--fd);transform:translateY(100%);clip-path:none!important;transition:transform .3s cubic-bezier(.16,1,.3,1);}
.sn-card-wrap:hover .sn-quick-add{transform:translateY(0)}
.rcard{background:var(--bg1);overflow:hidden;border:1px solid var(--line);cursor:pointer;transition:transform .22s,box-shadow .22s;clip-path:polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%);}
.rcard:hover{transform:translateY(-5px);box-shadow:0 20px 44px rgba(0,0,0,.85)}
.rcard:hover .sn-img{transform:scale(1.08)}
.sn-close{position:absolute;top:18px;right:18px;background:var(--bg3);color:var(--sub);border:1px solid var(--line);border-radius:50%;width:40px;height:40px;font-size:14px;cursor:pointer;z-index:20;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s,transform .2s;}
.sn-close:hover{background:#fff;color:#000;transform:rotate(90deg)}
.sn-arrow{position:absolute;top:50%;transform:translateY(-50%);background:rgba(0,0,0,.78);backdrop-filter:blur(8px);color:#fff;border:1px solid rgba(255,255,255,.1);border-radius:50%;width:38px;height:38px;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .18s,border-color .18s;font-family:var(--fd);font-weight:900;}
.sn-arrow:hover{background:rgba(232,25,44,.9);border-color:var(--red)}
.sn-arrow-l{left:14px}
.sn-arrow-r{right:14px}
.sn-loadmore{padding:14px 52px;background:transparent;color:#fff;border:1px solid var(--line);font-size:10px;font-weight:900;cursor:pointer;letter-spacing:4px;text-transform:uppercase;transition:all .25s;font-family:var(--fd);clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);}
.sn-loadmore:hover{border-color:var(--red);color:var(--red)}
.sn-chip{font-size:9px;font-weight:900;font-family:var(--fd);letter-spacing:2px;text-transform:uppercase;padding:3px 9px;border-radius:2px;display:inline-flex;align-items:center;gap:4px;}
.sn-disc-badge{position:absolute;top:12px;left:12px;background:var(--red);color:#fff;font-family:var(--fd);font-weight:900;font-size:11px;letter-spacing:2px;padding:4px 10px;z-index:2;clip-path:polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%);}
.sn-skel{background:var(--bg1);overflow:hidden;border:1px solid var(--line);clip-path:polygon(0 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%);}
.sn-redbar{background:var(--red);overflow:hidden;padding:12px 0;border-top:2px solid rgba(0,0,0,.18);border-bottom:2px solid rgba(0,0,0,.18);max-width:100vw;}
.sn-redbar-track{display:flex;width:max-content;animation:marqueeRed 20s linear infinite}
.sn-redbar-item{font-family:var(--fd);font-size:clamp(10px,1.2vw,13px);font-weight:900;letter-spacing:4px;text-transform:uppercase;color:#fff;white-space:nowrap;padding:0 20px;display:inline-flex;align-items:center;gap:20px;}
.sn-redbar-star{font-size:8px;opacity:.7}
`;

const pp  = p => typeof p === "number" ? p : parseFloat(String(p).replace(/[^0-9.-]+/g,"")) || 0;
const gid = p => p._id || p.id;
const SIZES = ["UK 5","UK 6","UK 7","UK 8","UK 9","UK 10","UK 11","UK 12"];
const CATS  = ["all","mens","women","kids"];
const ATTRS = [
  {attr:"Upper Material",value:"Premium Leather / Canvas"},
  {attr:"Sole",value:"Vulcanised Rubber, Cushioned Insole"},
  {attr:"Closure",value:"Lace-Up"},
  {attr:"Fit",value:"True to size — size up for wide feet"},
  {attr:"Care",value:"Wipe with damp cloth, air dry"},
  {attr:"Origin",value:"Vietnam"},
];
const REVIEWS = [
  {name:"Thabo M.",loc:"Joburg",date:"Feb 2025",rating:5,verified:true,text:"These are honestly the cleanest kicks I've owned. Wore them to a braai on Saturday, got like five compliments. Fit is perfect on size UK 9."},
  {name:"Kefilwe D.",loc:"Pretoria",date:"Jan 2025",rating:4,verified:true,text:"Delivered super fast — ordered Thursday, had them by Saturday. Sized down half a size and it worked perfectly. Quality is legit."},
  {name:"Ryan C.",loc:"Cape Town",date:"Dec 2024",rating:5,verified:true,text:"Bought these for my nephew for Christmas. He hasn't taken them off. The sole grip is excellent, way better than expected for the price."},
  {name:"Naledi S.",loc:"Soweto",date:"Nov 2024",rating:5,verified:true,text:"ShoeNation never disappoints. Third pair I've bought and the quality is always consistent. These colourways are actually 🔥"},
];

const Stars = memo(({ r=4.8, sm=false }) => (
  <span style={{display:"flex",gap:1}}>
    {[1,2,3,4,5].map(i=><span key={i} style={{fontSize:sm?10:13,color:i<=Math.round(r)?"#F5C842":"#1e1e1e"}}>★</span>)}
  </span>
));
const Grain = memo(() => <div className="sn-grain"/>);
const Chip = memo(({ children, col="#E8192C", bg="rgba(232,25,44,.08)" }) => (
  <span className="sn-chip" style={{background:bg,color:col,border:`1px solid ${col}22`}}>{children}</span>
));
const RedBar = memo(() => (
  <div className="sn-redbar">
    <div className="sn-redbar-track">
      {[...Array(3)].map((_,j)=>
        ["THE DROP IS LIVE","SHOENATION RSA","EXCLUSIVE KICKS","SA CULTURE","STREET READY","FRESH PAIRS"].map(t=>(
          <span key={`${j}-${t}`} className="sn-redbar-item">{t} <span className="sn-redbar-star">✦</span></span>
        ))
      )}
    </div>
  </div>
));

const Modal = memo(({ product, related, onClose, onAddToCart, onBuyNow }) => {
  const [img,setImg]=useState(0);const [size,setSize]=useState(null);const [qty,setQty]=useState(1);
  const [tab,setTab]=useState("desc");const [liked,setLiked]=useState(false);
  const [loaded,setLoaded]=useState(false);const [sizeErr,setSizeErr]=useState(false);
  const pid=product._id||product.id||"x";
  const images=product.images?.length>=2?product.images:[product.image,
    `https://source.unsplash.com/900x900/?sneaker,${encodeURIComponent(product.category||"shoe")}&sig=${pid}A`,
    `https://source.unsplash.com/900x900/?shoe,${encodeURIComponent((product.name||"").split(" ")[0]||"kick")}&sig=${pid}B`,
    `https://source.unsplash.com/900x900/?footwear,sole&sig=${pid}C`];
  const price=pp(product.price);const orig=(price*1.28).toFixed(2);
  const disc=Math.round((1-price/(price*1.28))*100);const save=(price*1.28-price).toFixed(2);
  const FD={fontFamily:"var(--fd)"};
  useEffect(()=>{const h=e=>{if(e.key==="Escape")onClose();};document.addEventListener("keydown",h);document.body.style.overflow="hidden";return()=>{document.removeEventListener("keydown",h);document.body.style.overflow="";};},[onClose]);
  useEffect(()=>setLoaded(false),[img]);
  const tryAdd=useCallback(fn=>{if(!size){setSizeErr(true);setTimeout(()=>setSizeErr(false),2200);return;}fn();},[size]);
  const prevImg=useCallback(()=>setImg(i=>(i-1+images.length)%images.length),[images.length]);
  const nextImg=useCallback(()=>setImg(i=>(i+1)%images.length),[images.length]);
  const overlayClk=useCallback(e=>{if(e.target===e.currentTarget)onClose();},[onClose]);
  const incQty=useCallback(()=>setQty(q=>q+1),[]);const decQty=useCallback(()=>setQty(q=>Math.max(1,q-1)),[]);
  const toggleLike=useCallback(()=>setLiked(l=>!l),[]);
  return (
    <div onClick={overlayClk} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.93)",backdropFilter:"blur(22px)",zIndex:3000,display:"flex",alignItems:"flex-start",justifyContent:"center",overflowY:"auto",padding:"32px 16px 100px",animation:"fadeIn .2s ease"}}>
      <div style={{width:"100%",maxWidth:1080,background:"var(--bg1)",border:"1px solid var(--line)",overflow:"hidden",position:"relative",animation:"scaleIn .32s cubic-bezier(.16,1,.3,1)",boxShadow:"0 80px 180px rgba(0,0,0,1)"}}>
        <Grain/>
        <div style={{height:3,background:"linear-gradient(90deg,var(--red) 0%,#ff6b7a 40%,transparent 100%)"}}/>
        <button className="sn-close" onClick={onClose}>✕</button>
        <div style={{display:"flex",flexWrap:"wrap"}}>
          <div style={{flex:"1 1 400px",background:"var(--bg)",display:"flex",flexDirection:"column",borderRight:"1px solid var(--line)"}}>
            <div style={{position:"relative",aspectRatio:"1/1",overflow:"hidden",background:"#070707"}}>
              {!loaded&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:2}}><div style={{width:28,height:28,border:"2px solid var(--line)",borderTopColor:"var(--red)",borderRadius:"50%",animation:"spin .7s linear infinite"}}/></div>}
              <img src={images[img]} alt={product.name} onLoad={()=>setLoaded(true)} className="sn-img" style={{width:"100%",height:"100%",objectFit:"cover",opacity:loaded?1:0,transition:"opacity .3s"}}/>
              <button className="sn-arrow sn-arrow-l" onClick={prevImg}>‹</button>
              <button className="sn-arrow sn-arrow-r" onClick={nextImg}>›</button>
              <div style={{position:"absolute",top:14,left:14,background:"var(--red)",color:"#fff",...FD,fontWeight:900,fontSize:11,letterSpacing:2,padding:"5px 12px",clipPath:"polygon(5px 0%,100% 0%,calc(100% - 5px) 100%,0% 100%)"}}>SAVE {disc}%</div>
              <div style={{position:"absolute",bottom:14,right:14,background:"rgba(0,0,0,.8)",backdropFilter:"blur(8px)",color:"rgba(255,255,255,.55)",fontSize:10,...FD,fontWeight:900,letterSpacing:2,padding:"4px 12px",border:"1px solid rgba(255,255,255,.07)"}}>{img+1} / {images.length}</div>
            </div>
            <div style={{display:"flex",gap:8,padding:"12px 14px",background:"var(--bg1)",borderTop:"1px solid var(--line)",flexWrap:"wrap"}}>
              {images.map((src,i)=>(<div key={i} onClick={()=>setImg(i)} style={{width:60,height:60,overflow:"hidden",cursor:"pointer",flexShrink:0,border:`2px solid ${i===img?"var(--red)":"var(--line)"}`,transition:"border-color .2s,transform .2s",transform:i===img?"scale(1.07)":"scale(1)"}}><img src={src} alt={`view ${i+1}`} className="sn-img" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>))}
            </div>
            <div style={{display:"flex",padding:"12px 14px",gap:8,borderTop:"1px solid var(--line)",flexWrap:"wrap"}}>
              {[["🚚","Free delivery R500+"],["↩️","30-day returns"],["🔒","Secure checkout"]].map(([icon,lbl])=>(
                <div key={lbl} style={{flex:"1 1 auto",display:"flex",alignItems:"center",gap:7,background:"var(--bg2)",padding:"8px 10px",border:"1px solid var(--line)",borderLeft:"2px solid var(--red)"}}>
                  <span style={{fontSize:12}}>{icon}</span>
                  <span style={{fontSize:10,color:"var(--sub)",fontWeight:900,...FD,letterSpacing:1,whiteSpace:"nowrap"}}>{lbl}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{flex:"1 1 360px",padding:"32px 28px",display:"flex",flexDirection:"column",gap:16,position:"relative",zIndex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
              <span style={{...FD,fontSize:10,fontWeight:900,letterSpacing:4,color:"var(--red)",textTransform:"uppercase"}}>{product.category||"Sneakers"}</span>
              <span style={{color:"var(--line)"}}>·</span>
              <Chip col="#4ADE80" bg="rgba(74,222,128,.08)">● In Stock</Chip>
              <Chip col="var(--gold)" bg="rgba(212,168,67,.08)">Bestseller</Chip>
            </div>
            <div>
              <h2 style={{...FD,fontWeight:900,fontSize:"clamp(26px,4vw,44px)",letterSpacing:.2,color:"#fff",lineHeight:.93,marginBottom:14}}>{product.name}</h2>
              <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                <Stars r={4.8}/><span style={{...FD,fontSize:13,fontWeight:900,color:"#fff"}}>4.8</span>
                <span style={{fontSize:12,color:"var(--sub)"}}>(124 reviews)</span>
                <span style={{fontSize:10,color:"var(--red)",fontWeight:900,cursor:"pointer",marginLeft:"auto",...FD,letterSpacing:1}} onClick={()=>setTab("reviews")}>Read all →</span>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"baseline",gap:14,padding:"16px 0 16px 20px",borderTop:"1px solid var(--line)",borderBottom:"1px solid var(--line)",position:"relative"}}>
              <div style={{position:"absolute",left:0,top:0,bottom:0,width:3,background:"var(--red)"}}/>
              <span style={{...FD,fontWeight:900,fontSize:52,color:"#fff",letterSpacing:-1,lineHeight:1}}>R{price.toFixed(2)}</span>
              <div><div style={{fontSize:14,color:"var(--muted)",textDecoration:"line-through",lineHeight:1}}>R{orig}</div><div style={{fontSize:9,...FD,fontWeight:900,letterSpacing:2,color:"var(--red)",marginTop:3}}>YOU SAVE R{save}</div></div>
            </div>
            <p style={{fontSize:13,color:"var(--sub)",lineHeight:1.85,margin:0}}>{product.description||"Built for the streets, designed for the culture. Premium construction with all-day comfort — whether you're hitting the mall or the court, these are the ones."}</p>
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{...FD,fontSize:10,fontWeight:900,letterSpacing:2,color:"var(--sub)",textTransform:"uppercase"}}>Select Size {size&&<span style={{color:"#fff"}}>— {size}</span>}</span>
                <span style={{fontSize:10,color:"var(--red)",fontWeight:900,cursor:"pointer",...FD,letterSpacing:1}}>Size Guide</span>
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {SIZES.map(s=><button key={s} className={`sn-sz${s===size?" on":""}`} onClick={()=>{setSize(s);setSizeErr(false);}}>{s}</button>)}
              </div>
              {sizeErr&&<p style={{fontSize:10,color:"var(--red)",fontWeight:900,marginTop:8,...FD,letterSpacing:2,animation:"fadeIn .2s"}}>⚠ SELECT A SIZE FIRST</p>}
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              <div style={{display:"flex",alignItems:"center",border:"1px solid var(--line)",overflow:"hidden",flexShrink:0}}>
                <button className="sn-qty" onClick={decQty}>−</button>
                <span style={{width:44,height:46,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:900,color:"#fff",background:"var(--bg)",borderLeft:"1px solid var(--line)",borderRight:"1px solid var(--line)",...FD}}>{qty}</span>
                <button className="sn-qty" onClick={incQty}>+</button>
              </div>
              <button className="sn-pri" style={{flex:1,minWidth:110,height:46}} onClick={()=>tryAdd(()=>onAddToCart(product,qty))}><span>Add to Cart</span></button>
              <button className="sn-acc" style={{flex:1,minWidth:110,height:46}} onClick={()=>tryAdd(()=>onBuyNow(product,qty))}><span>Buy Now</span></button>
              <button className={`sn-wl${liked?" on":""}`} onClick={toggleLike}>{liked?"♥":"♡"}</button>
            </div>
            <div style={{fontSize:10,color:"var(--muted)",lineHeight:2,borderTop:"1px solid var(--line)",paddingTop:12,...FD,fontWeight:700,letterSpacing:.5}}>
              <span style={{color:"var(--sub)"}}>SKU:</span>&nbsp;{(product._id||"").slice(-8).toUpperCase()||"N/A"}&nbsp;·&nbsp;
              <span style={{color:"var(--sub)"}}>Brand:</span>&nbsp;{(product.name||"").split(" ")[0]||"ShoeNation"}&nbsp;·&nbsp;
              <span style={{color:"var(--sub)"}}>Category:</span>&nbsp;{product.category||"Sneakers"}
            </div>
          </div>
        </div>
        <div style={{borderTop:"1px solid var(--line)",padding:"0 28px 36px"}}>
          <div style={{display:"flex",borderBottom:"1px solid var(--line)",marginBottom:26,overflowX:"auto"}}>
            {[["desc","Description"],["info","Specifications"],["reviews","Reviews (124)"]].map(([k,l])=>(
              <button key={k} className={`sn-tab${tab===k?" on":""}`} onClick={()=>setTab(k)}>{l}</button>
            ))}
          </div>
          <div style={{animation:"fadeUp .22s ease"}}>
            {tab==="desc"&&(
              <div style={{maxWidth:700}}>
                <p style={{fontSize:13.5,color:"var(--sub)",lineHeight:1.9,marginBottom:20}}>{product.description||"Engineered for South African streets and made to turn heads. Premium upper materials are stitched with reinforced seams for durability, while the cushioned insole system keeps your feet locked in comfort."}</p>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10}}>
                  {["Premium Materials","All-Day Comfort","SA Quality Checked","Limited Stock"].map(f=>(
                    <div key={f} style={{background:"var(--bg2)",border:"1px solid var(--line)",borderLeft:"2px solid var(--red)",padding:"11px 14px",display:"flex",alignItems:"center",gap:10}}>
                      <span style={{color:"var(--red)",fontSize:13,fontWeight:900}}>✓</span>
                      <span style={{fontSize:10,fontWeight:900,color:"var(--text)",...FD,letterSpacing:1}}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {tab==="info"&&(
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                <thead><tr>{["ATTRIBUTE","DETAILS"].map(h=><th key={h} style={{background:"var(--red)",color:"#fff",padding:"11px 18px",textAlign:"left",...FD,fontWeight:900,letterSpacing:2,fontSize:10,width:h==="ATTRIBUTE"?"38%":"auto"}}>{h}</th>)}</tr></thead>
                <tbody>{ATTRS.map(({attr,value},i)=>(<tr key={attr} style={{background:i%2===0?"var(--bg)":"var(--bg1)",borderBottom:"1px solid var(--line)"}}><td style={{padding:"12px 18px",color:"var(--sub)",fontWeight:700,...FD,fontSize:11,letterSpacing:1}}>{attr}</td><td style={{padding:"12px 18px",color:"var(--text)",fontSize:13}}>{value}</td></tr>))}</tbody>
              </table>
            )}
            {tab==="reviews"&&(
              <div>
                <div style={{display:"flex",gap:24,alignItems:"center",marginBottom:22,padding:"20px",background:"var(--bg)",border:"1px solid var(--line)",borderLeft:"3px solid var(--red)",flexWrap:"wrap"}}>
                  <div style={{textAlign:"center",minWidth:80}}>
                    <div style={{...FD,fontSize:60,fontWeight:900,lineHeight:1,color:"#fff"}}>4.8</div>
                    <Stars r={4.8}/>
                    <div style={{fontSize:9,color:"var(--muted)",marginTop:4,...FD,fontWeight:900,letterSpacing:2}}>124 REVIEWS</div>
                  </div>
                  <div style={{flex:1,minWidth:160}}>
                    {[[5,68],[4,22],[3,6],[2,2],[1,2]].map(([star,pct])=>(
                      <div key={star} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                        <span style={{fontSize:10,color:"var(--sub)",width:8,...FD,fontWeight:900}}>{star}</span>
                        <span style={{fontSize:9,color:"#F5C842"}}>★</span>
                        <div style={{flex:1,height:4,background:"var(--bg3)",overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:star>=4?"#F5C842":"var(--muted)"}}/></div>
                        <span style={{fontSize:9,color:"var(--muted)",width:28,...FD,fontWeight:900}}>{pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {REVIEWS.map((r,i)=>(
                    <div key={i} style={{background:"var(--bg)",border:"1px solid var(--line)",borderLeft:`2px solid ${r.rating===5?"var(--red)":"var(--line)"}`,padding:"18px 20px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,flexWrap:"wrap",gap:8}}>
                        <div>
                          <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{...FD,fontWeight:900,color:"#fff",fontSize:15}}>{r.name}</span>{r.verified&&<Chip col="#4ADE80" bg="rgba(74,222,128,.08)">✓ Verified</Chip>}</div>
                          <span style={{fontSize:10,color:"var(--muted)",...FD,fontWeight:700,letterSpacing:1}}>{r.loc} · {r.date}</span>
                        </div>
                        <Stars r={r.rating} sm/>
                      </div>
                      <p style={{fontSize:13,color:"var(--sub)",lineHeight:1.78,margin:0}}>{r.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {related.length>0&&(
          <div style={{borderTop:"1px solid var(--line)",padding:"26px 28px 32px",background:"var(--bg)"}}>
            <div style={{marginBottom:18}}>
              <div style={{...FD,fontSize:9,fontWeight:900,letterSpacing:4,color:"var(--red)",marginBottom:6}}>YOU MIGHT ALSO LIKE</div>
              <h3 style={{...FD,fontSize:26,fontWeight:900,color:"#fff",letterSpacing:.3}}>More From The Range</h3>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:12}}>
              {related.slice(0,4).map(rp=>{const rp_=pp(rp.price);return(
                <div key={gid(rp)} className="rcard">
                  <div style={{height:140,overflow:"hidden",background:"var(--bg2)"}}><img src={rp.image} alt={rp.name} className="sn-img" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>
                  <div style={{padding:"10px 12px"}}>
                    <div style={{fontSize:9,color:"var(--muted)",textTransform:"uppercase",letterSpacing:2,marginBottom:3,...FD,fontWeight:900}}>{rp.category}</div>
                    <div style={{fontSize:13,fontWeight:900,color:"#fff",...FD,lineHeight:1.2,marginBottom:5}}>{rp.name}</div>
                    <div style={{...FD,fontWeight:900,fontSize:16,color:"var(--red)"}}>R{rp_.toFixed(2)}</div>
                  </div>
                </div>
              );})}
            </div>
          </div>
        )}
        <div style={{height:3,background:"linear-gradient(90deg,transparent 0%,var(--red) 100%)"}}/>
      </div>
    </div>
  );
});

const ProductCard = memo(({ product, onOpen, onAddToCart, idx }) => {
  const price=pp(product.price);const orig=(price*1.28).toFixed(2);const disc=Math.round((1-price/(price*1.28))*100);
  const handleOpen=useCallback(()=>onOpen(product),[product,onOpen]);
  const handleQuickAdd=useCallback(e=>{e.stopPropagation();onAddToCart(product);},[product,onAddToCart]);
  return (
    <div className="sn-card-wrap" onClick={handleOpen} style={{animation:`fadeUp .5s ${idx*0.055}s both ease`}}>
      <div style={{position:"relative",height:272,overflow:"hidden",background:"#070707"}}>
        <img src={product.image} alt={product.name} className="sn-img" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        <div className="sn-card-overlay"/>
        <button className="sn-acc sn-quick-add" onClick={handleQuickAdd}><span>+ Quick Add</span></button>
        <div className="sn-disc-badge">−{disc}%</div>
        <div style={{position:"absolute",top:12,right:12,background:"rgba(0,0,0,.82)",backdropFilter:"blur(8px)",color:"var(--sub)",fontSize:9,fontWeight:900,padding:"4px 10px",letterSpacing:2.5,textTransform:"uppercase",fontFamily:"var(--fd)",border:"1px solid rgba(255,255,255,.06)"}}>{product.category||"Sneakers"}</div>
        <div style={{position:"absolute",top:40,right:12,fontFamily:"var(--fd)",fontSize:10,fontWeight:900,letterSpacing:2,color:"rgba(255,255,255,.2)",pointerEvents:"none",zIndex:3}}>0{(idx%9)+1}</div>
      </div>
      <div style={{padding:"16px 18px 20px",position:"relative",zIndex:1}}>
        <h3 style={{fontFamily:"var(--fd)",fontWeight:900,fontSize:21,letterSpacing:.3,color:"#fff",lineHeight:1.05,marginBottom:8}}>{product.name}</h3>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:13}}><Stars r={4.8} sm/><span style={{fontSize:10,color:"var(--muted)",fontWeight:900,fontFamily:"var(--fd)",letterSpacing:.5}}>4.8 (124)</span></div>
        <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",flexWrap:"wrap",gap:4}}>
          <div><span style={{fontFamily:"var(--fd)",fontWeight:900,fontSize:24,color:"#fff"}}>R{price.toFixed(2)}</span><span style={{fontSize:13,color:"var(--muted)",textDecoration:"line-through",marginLeft:8}}>R{orig}</span></div>
          <span style={{fontSize:9,color:"var(--red)",fontWeight:900,fontFamily:"var(--fd)",letterSpacing:1.5}}>SAVE R{(price*1.28-price).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
});

const Skel = memo(({ i }) => (
  <div className="sn-skel" style={{animation:`shimmer 1.5s ${i*0.1}s ease infinite`}}>
    <div style={{height:272,background:"var(--bg2)"}}/>
    <div style={{padding:"16px 18px 20px",display:"flex",flexDirection:"column",gap:10}}>
      <div style={{height:18,background:"var(--bg2)",width:"70%"}}/><div style={{height:10,background:"var(--bg2)",width:"36%"}}/><div style={{height:14,background:"var(--bg2)",width:"52%"}}/>
    </div>
  </div>
));

const Products = () => {
  const navigate=useNavigate();
  const [products,setProducts]=useState([]);
  const [category,setCategory]=useState("all");
  const [selected,setSelected]=useState(null);const [toast,setToast]=useState("");const [loading,setLoading]=useState(true);
  const [cart,setCart]=useState(()=>{try{return JSON.parse(localStorage.getItem("cart"))||[];}catch{return[];}});
  const cartCount=cart.reduce((s,it)=>s+it.qty,0);
  const toastTimer=useRef(null);
  const showToast=useCallback(msg=>{setToast(msg);clearTimeout(toastTimer.current);toastTimer.current=setTimeout(()=>setToast(""),2800);},[]);
  const addToCart=useCallback((product,qty=1)=>{const id=gid(product);setCart(prev=>{const ex=prev.find(it=>it.id===id);const next=ex?prev.map(it=>it.id===id?{...it,qty:it.qty+qty}:it):[...prev,{id,name:product.name,price:pp(product.price),image:product.image,qty}];localStorage.setItem("cart",JSON.stringify(next));return next;});showToast(`${product.name} added to cart`);},[showToast]);
  const handleBuyNow=useCallback((product,qty=1)=>{addToCart(product,qty);navigate("/cart");},[addToCart,navigate]);
  const fetchProducts=useCallback(async(cat="all")=>{setLoading(true);try{const key=`sn_products_${cat}`;const cached=localStorage.getItem(key);if(cached){const p=JSON.parse(cached);setProducts(p);}const url=cat==="all"?`${backendurl}/products`:`${backendurl}/products?category=${cat}`;const res=await fetch(url);if(!res.ok)throw new Error();const result=await res.json();const arr=Array.isArray(result)?result:result.data||[];setProducts(arr);localStorage.setItem(key,JSON.stringify(arr));}catch(e){console.error(e);}finally{setLoading(false);}},[]);
  useEffect(()=>{fetchProducts("all");},[fetchProducts]);
  const handleCatChange=useCallback(cat=>{setCategory(cat);fetchProducts(cat);},[fetchProducts]);
  const related=selected?products.filter(p=>gid(p)!==gid(selected)&&p.category===selected.category).slice(0,4):[];
  return (
    <div style={{overflowX:"hidden",width:"100%"}}>
      <style>{GLOBAL_CSS}</style>
      <div style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,background:"rgba(6,6,6,.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid var(--line)"}}><Navbar/></div>
      <div style={{position:"fixed",bottom:28,right:28,zIndex:2000}}>
        <button onClick={()=>navigate("/cart")} style={{background:"var(--red)",color:"#fff",border:"none",width:52,height:52,fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 32px rgba(232,25,44,.5)",position:"relative",transition:"transform .2s",clipPath:"polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
          🛒
          {cartCount>0&&<span style={{position:"absolute",top:-6,right:-6,background:"#fff",color:"var(--red)",borderRadius:"50%",width:22,height:22,fontSize:11,fontWeight:900,border:"2px solid var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--fd)"}}>{cartCount}</span>}
        </button>
      </div>
      <section style={{width:"100%",padding:"104px clamp(20px,6vw,100px) 0",position:"relative"}}>
        <Grain/>
        <div style={{marginBottom:48,position:"relative",zIndex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,animation:"slideR .5s ease"}}>
            <div style={{width:22,height:3,background:"var(--red)",borderRadius:1}}/>
            <span style={{fontFamily:"var(--fd)",fontSize:9,fontWeight:900,letterSpacing:5,color:"var(--red)",textTransform:"uppercase"}}>ShoeNation RSA · Official Store</span>
            <span style={{width:6,height:6,borderRadius:"50%",background:"#4ADE80",boxShadow:"0 0 8px #4ADE80",display:"inline-block",animation:"pulse 1.8s ease-out infinite"}}/>
          </div>
          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",flexWrap:"wrap",gap:20,marginBottom:32}}>
            <div style={{position:"relative"}}>
              <span style={{position:"absolute",right:"-0.04em",bottom:"-0.12em",fontFamily:"var(--fd)",fontWeight:900,fontSize:"clamp(90px,15vw,200px)",color:"rgba(255,255,255,.022)",letterSpacing:-4,lineHeight:1,userSelect:"none",pointerEvents:"none",zIndex:0}}>DROP</span>
              <h1 style={{fontFamily:"var(--fd)",fontWeight:900,fontSize:"clamp(64px,10.5vw,116px)",letterSpacing:-2,lineHeight:.86,color:"#fff",animation:"fadeUp .5s ease",position:"relative",zIndex:1}}>THE<br/><span style={{WebkitTextStroke:"3px var(--red)",color:"transparent",display:"block"}}>DROP.</span></h1>
            </div>
            <div style={{maxWidth:280,animation:"fadeUp .65s ease",display:"flex",flexDirection:"column",gap:12}}>
              <p style={{fontSize:13,color:"var(--sub)",lineHeight:1.84}}>Premium sneakers. SA prices. Every pair quality checked before it ships to your door.</p>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{width:7,height:7,borderRadius:"50%",background:"#4ADE80",boxShadow:"0 0 8px #4ADE80",flexShrink:0}}/>
                <span style={{fontSize:10,color:"var(--sub)",fontWeight:900,fontFamily:"var(--fd)",letterSpacing:1.5,textTransform:"uppercase"}}>{products.length>0?`${products.length} styles in stock`:"Loading collection..."}</span>
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",animation:"fadeUp .7s ease"}}>
            {CATS.map(cat=><button key={cat} className={`sn-cat${category===cat?" on":""}`} onClick={()=>handleCatChange(cat)}>{cat==="all"?"All Styles":cat.charAt(0).toUpperCase()+cat.slice(1)}</button>)}
            <span style={{marginLeft:"auto",fontFamily:"var(--fd)",fontSize:10,fontWeight:900,letterSpacing:2,color:"var(--muted)"}}>{products.length} STYLES</span>
          </div>
        </div>
      </section>
      <RedBar/>
      <section style={{width:"100%",padding:"48px clamp(20px,6vw,100px) 80px",position:"relative"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(285px,1fr))",gap:"clamp(12px,1.8vw,22px)",marginBottom:56,position:"relative",zIndex:1}}>
          {loading?Array(8).fill(0).map((_,i)=><Skel key={i} i={i}/>):products.map((p,i)=><ProductCard key={gid(p)} product={p} idx={i} onOpen={setSelected} onAddToCart={addToCart}/>)}
        </div>
      </section>
      {selected&&<Modal product={selected} related={related} onClose={()=>setSelected(null)} onAddToCart={addToCart} onBuyNow={handleBuyNow}/>}
      {toast&&(
        <div style={{position:"fixed",bottom:28,left:"50%",background:"var(--bg1)",color:"#fff",border:"1px solid var(--line)",borderLeft:"3px solid var(--red)",padding:"12px 22px 12px 16px",fontFamily:"var(--fd)",fontWeight:900,fontSize:12,letterSpacing:1,zIndex:9999,boxShadow:"0 14px 48px rgba(0,0,0,.9)",animation:"alertIn .3s cubic-bezier(.16,1,.3,1)",display:"flex",alignItems:"center",gap:10,whiteSpace:"nowrap"}}>
          <span style={{color:"var(--red)",fontSize:14}}>✔</span>{toast}
        </div>
      )}
      <Footer/>
    </div>
  );
};
export default Products;