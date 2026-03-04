import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const backendurl = import.meta.env.VITE_BACKENDURL;

/* ─── GLOBAL CSS ─────────────────────────────────────────────────────────
   Injected once. All repeated visual patterns live here as classes so
   React never re-creates inline style objects on re-render.
──────────────────────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;0,900;1,900&family=Barlow:wght@400;500;600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:#080808;color:#fff;font-family:'Barlow',sans-serif}

:root{
  --red:#E8192C; --red-dim:rgba(232,25,44,.12); --gold:#D4A843;
  --bg:#080808;  --bg1:#0F0F0F; --bg2:#141414; --bg3:#1A1A1A;
  --line:#1F1F1F; --muted:#444; --sub:#777; --text:#E8E8E8;
  --fd:'Barlow Condensed',sans-serif; --fb:'Barlow',sans-serif;
}

::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:2px}

/* ── keyframes ── */
@keyframes fadeUp  {from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn  {from{opacity:0}to{opacity:1}}
@keyframes slideR  {from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:translateX(0)}}
@keyframes scaleIn {from{opacity:0;transform:scale(.96) translateY(28px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes spin    {to{transform:rotate(360deg)}}
@keyframes shimmer {0%,100%{opacity:.3}50%{opacity:.7}}
@keyframes alertIn {from{opacity:0;transform:translateX(-50%) translateY(14px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
/* grain uses will-change so GPU handles it */
@keyframes grain {
  0%,100%{transform:translate(0,0)}10%{transform:translate(-2%,-3%)}20%{transform:translate(1%,2%)}
  30%{transform:translate(-1%,1%)}40%{transform:translate(2%,-1%)}50%{transform:translate(-3%,2%)}
  60%{transform:translate(1%,-2%)}70%{transform:translate(-2%,3%)}80%{transform:translate(3%,1%)}90%{transform:translate(-1%,-2%)}
}

/* ── utility classes (replaces inline styles for hot-path elements) ── */
.sn-img{transition:transform .55s cubic-bezier(.16,1,.3,1);display:block}
.sn-card{cursor:pointer}
.sn-card:hover .sn-img{transform:scale(1.07)}

.sn-grain{
  position:absolute;inset:-50%;width:200%;height:200%;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity:.025;pointer-events:none;z-index:0;
  will-change:transform;animation:grain 8s steps(2) infinite;
}

.sn-tab{background:none;border:none;font-family:var(--fd);font-size:14px;font-weight:800;
  letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;padding:16px 18px;
  color:var(--muted);border-bottom:2px solid transparent;margin-bottom:-1px;
  transition:color .2s,border-color .2s}
.sn-tab:hover{color:var(--text)}
.sn-tab.on{color:#fff;border-bottom-color:var(--red)}

.sn-sz{background:var(--bg2);color:var(--sub);border:1px solid var(--line);border-radius:6px;
  padding:8px 13px;font-size:11px;font-weight:800;font-family:var(--fd);letter-spacing:.5px;
  cursor:pointer;transition:all .18s}
.sn-sz:hover{border-color:var(--sub);color:#fff}
.sn-sz.on{background:#fff;color:#000;border-color:#fff}

.sn-cat{padding:9px 22px;border-radius:30px;border:1px solid var(--line);background:transparent;
  color:var(--muted);font-size:11px;font-weight:800;font-family:var(--fd);letter-spacing:2px;
  text-transform:uppercase;cursor:pointer;transition:all .2s}
.sn-cat:hover{border-color:var(--sub);color:var(--text)}
.sn-cat.on{background:var(--red);border-color:var(--red);color:#fff}

.sn-pri{background:#fff;color:#000;border:none;border-radius:8px;font-size:12px;font-weight:900;
  font-family:var(--fd);letter-spacing:2px;text-transform:uppercase;cursor:pointer;
  transition:all .2s;padding:13px 22px}
.sn-pri:hover{background:var(--red);color:#fff;transform:translateY(-1px)}

.sn-acc{background:var(--red);color:#fff;border:none;border-radius:8px;font-size:12px;font-weight:900;
  font-family:var(--fd);letter-spacing:2px;text-transform:uppercase;cursor:pointer;
  transition:all .2s;padding:13px 22px}
.sn-acc:hover{background:#ff2d42;transform:translateY(-1px);box-shadow:0 8px 24px rgba(232,25,44,.4)}

.sn-wl{width:46px;height:46px;border-radius:8px;border:1px solid var(--line);background:var(--bg2);
  color:var(--muted);font-size:18px;cursor:pointer;display:flex;align-items:center;
  justify-content:center;transition:all .2s;flex-shrink:0}
.sn-wl:hover,.sn-wl.on{border-color:#e11d48;color:#e11d48;background:rgba(225,29,72,.08)}

.sn-qty{background:var(--bg2);color:#fff;border:none;width:40px;height:46px;font-size:20px;
  cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s}
.sn-qty:hover{background:var(--bg3)}

/* card */
.sn-card-wrap{
  background:var(--bg1);border-radius:14px;overflow:hidden;
  border:1px solid var(--line);
  transition:transform .3s cubic-bezier(.16,1,.3,1),box-shadow .3s,border-color .3s;
  position:relative;
}
.sn-card-wrap:hover{
  transform:translateY(-8px);
  box-shadow:0 28px 70px rgba(0,0,0,.9);
  border-color:#252525;
}
.sn-card-overlay{
  position:absolute;inset:0;
  background:linear-gradient(to top,rgba(0,0,0,.8) 0%,transparent 55%);
  opacity:0;transition:opacity .3s;pointer-events:none;
}
.sn-card-wrap:hover .sn-card-overlay{opacity:1}
.sn-quick-add{
  position:absolute;bottom:0;left:0;right:0;border-radius:0;
  padding:13px;letter-spacing:2.5px;font-size:11px;
  transform:translateY(100%);
  transition:transform .28s cubic-bezier(.16,1,.3,1);
}
.sn-card-wrap:hover .sn-quick-add{transform:translateY(0)}

/* related card */
.rcard{background:var(--bg1);border-radius:12px;overflow:hidden;border:1px solid var(--line);
  cursor:pointer;transition:transform .22s,box-shadow .22s}
.rcard:hover{transform:translateY(-4px);box-shadow:0 14px 36px rgba(0,0,0,.7)}
.rcard:hover .sn-img{transform:scale(1.08)}

/* close btn — CSS handles hover, no JS needed */
.sn-close{
  position:absolute;top:18px;right:18px;
  background:var(--bg3);color:var(--sub);
  border:1px solid var(--line);border-radius:50%;
  width:40px;height:40px;font-size:15px;cursor:pointer;z-index:20;
  display:flex;align-items:center;justify-content:center;
  transition:background .2s,color .2s,transform .2s;
}
.sn-close:hover{background:#fff;color:#000;transform:rotate(90deg)}

/* gallery arrow */
.sn-arrow{
  position:absolute;top:50%;transform:translateY(-50%);
  background:rgba(0,0,0,.72);backdrop-filter:blur(8px);
  color:#fff;border:1px solid rgba(255,255,255,.1);
  border-radius:50%;width:38px;height:38px;font-size:20px;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  transition:background .18s;font-family:var(--fd);
}
.sn-arrow:hover{background:rgba(232,25,44,.85)}
.sn-arrow-l{left:14px}
.sn-arrow-r{right:14px}

/* load more */
.sn-loadmore{
  padding:14px 52px;background:transparent;color:#fff;
  border:1px solid var(--line);border-radius:30px;font-size:11px;font-weight:900;
  cursor:pointer;letter-spacing:3px;text-transform:uppercase;
  transition:all .25s;font-family:var(--fd);
}
.sn-loadmore:hover{border-color:var(--red);color:var(--red)}

/* chip */
.sn-chip{
  font-size:9px;font-weight:900;font-family:var(--fd);
  letter-spacing:1.5px;text-transform:uppercase;
  padding:3px 9px;border-radius:4px;
  display:inline-flex;align-items:center;gap:4px;
}
`;

/* ─── helpers ──────────────────────────────────────────────────────────── */
const pp  = (p) => typeof p === "number" ? p : parseFloat(String(p).replace(/[^0-9.-]+/g,"")) || 0;
const gid = (p) => p._id || p.id;

const SIZES   = ["UK 5","UK 6","UK 7","UK 8","UK 9","UK 10","UK 11","UK 12"];
const CATS    = ["all","mens","women","kids"];
const ATTRS   = [
  {attr:"Upper Material",value:"Premium Leather / Canvas"},
  {attr:"Sole",          value:"Vulcanised Rubber, Cushioned Insole"},
  {attr:"Closure",       value:"Lace-Up"},
  {attr:"Fit",           value:"True to size — size up for wide feet"},
  {attr:"Care",          value:"Wipe with damp cloth, air dry"},
  {attr:"Origin",        value:"Vietnam"},
];
const REVIEWS = [
  {name:"Thabo M.",  loc:"Joburg",   date:"Feb 2025",rating:5,verified:true,text:"These are honestly the cleanest kicks I've owned. Wore them to a braai on Saturday, got like five compliments. Fit is perfect on size UK 9."},
  {name:"Kefilwe D.",loc:"Pretoria", date:"Jan 2025",rating:4,verified:true,text:"Delivered super fast — ordered Thursday, had them by Saturday. Sized down half a size and it worked perfectly. Quality is legit."},
  {name:"Ryan C.",   loc:"Cape Town",date:"Dec 2024",rating:5,verified:true,text:"Bought these for my nephew for Christmas. He hasn't taken them off. The sole grip is excellent, way better than expected for the price."},
  {name:"Naledi S.", loc:"Soweto",   date:"Nov 2024",rating:5,verified:true,text:"ShoeNation never disappoints. Third pair I've bought and the quality is always consistent. These colourways are actually 🔥"},
];

/* ─── Tiny sub-components (memoised) ──────────────────────────────────── */
const Stars = memo(({ r = 4.8, sm = false }) => (
  <span style={{display:"flex",gap:1}}>
    {[1,2,3,4,5].map(i =>
      <span key={i} style={{fontSize:sm?11:14,color:i<=Math.round(r)?"#F5C842":"#252525"}}>★</span>
    )}
  </span>
));

/* Grain is static — render once, never re-render */
const Grain = memo(() => <div className="sn-grain"/>);

const Chip = memo(({ children, col="#E8192C", bg="rgba(232,25,44,.1)" }) => (
  <span className="sn-chip" style={{background:bg,color:col,border:`1px solid ${col}20`}}>
    {children}
  </span>
));

/* ─── MODAL ────────────────────────────────────────────────────────────── */
const Modal = memo(({ product, related, onClose, onAddToCart, onBuyNow }) => {
  const [img,     setImg]     = useState(0);
  const [size,    setSize]    = useState(null);
  const [qty,     setQty]     = useState(1);
  const [tab,     setTab]     = useState("desc");
  const [liked,   setLiked]   = useState(false);
  const [loaded,  setLoaded]  = useState(false);
  const [sizeErr, setSizeErr] = useState(false);

  const pid    = product._id || product.id || "x";
  const images = product.images?.length >= 2 ? product.images : [
    product.image,
    `https://source.unsplash.com/900x900/?sneaker,${encodeURIComponent(product.category||"shoe")}&sig=${pid}A`,
    `https://source.unsplash.com/900x900/?shoe,${encodeURIComponent((product.name||"").split(" ")[0]||"kick")}&sig=${pid}B`,
    `https://source.unsplash.com/900x900/?footwear,sole&sig=${pid}C`,
  ];

  const price = pp(product.price);
  const orig  = (price * 1.28).toFixed(2);
  const disc  = Math.round((1 - price / (price * 1.28)) * 100);
  const save  = (price * 1.28 - price).toFixed(2);

  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  useEffect(() => { setLoaded(false); }, [img]);

  const tryAdd = useCallback((fn) => {
    if (!size) { setSizeErr(true); setTimeout(() => setSizeErr(false), 2200); return; }
    fn();
  }, [size]);

  const prevImg = useCallback(() => setImg(i => (i - 1 + images.length) % images.length), [images.length]);
  const nextImg = useCallback(() => setImg(i => (i + 1) % images.length), [images.length]);

  const handleOverlayClick = useCallback(e => { if (e.target === e.currentTarget) onClose(); }, [onClose]);
  const incQty = useCallback(() => setQty(q => q + 1), []);
  const decQty = useCallback(() => setQty(q => Math.max(1, q - 1)), []);
  const toggleLike = useCallback(() => setLiked(l => !l), []);

  return (
    <div onClick={handleOverlayClick} style={{
      position:"fixed",inset:0,
      background:"rgba(0,0,0,.9)",backdropFilter:"blur(18px)",
      zIndex:3000,display:"flex",alignItems:"flex-start",justifyContent:"center",
      overflowY:"auto",padding:"28px 14px 80px",
      animation:"fadeIn .2s ease",
    }}>
      <div style={{
        width:"100%",maxWidth:1060,
        background:"var(--bg1)",borderRadius:18,
        border:"1px solid var(--line)",overflow:"hidden",
        position:"relative",
        animation:"scaleIn .32s cubic-bezier(.16,1,.3,1)",
        boxShadow:"0 60px 140px rgba(0,0,0,.98)",
      }}>
        <Grain/>

        {/* top accent */}
        <div style={{height:3,background:"linear-gradient(90deg,var(--red) 0%,#ff6b7a 50%,transparent 100%)"}}/>

        <button className="sn-close" onClick={onClose}>✕</button>

        {/* ── TOP ── */}
        <div style={{display:"flex",flexWrap:"wrap"}}>

          {/* GALLERY */}
          <div style={{flex:"1 1 400px",background:"var(--bg)",display:"flex",flexDirection:"column",borderRight:"1px solid var(--line)"}}>

            {/* main image */}
            <div style={{position:"relative",aspectRatio:"1/1",overflow:"hidden",background:"#0A0A0A"}}>
              {!loaded && (
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <div style={{width:26,height:26,border:"2px solid #1a1a1a",borderTopColor:"var(--red)",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>
                </div>
              )}
              <img
                src={images[img]}
                alt={product.name}
                onLoad={() => setLoaded(true)}
                className="sn-img"
                style={{width:"100%",height:"100%",objectFit:"cover",opacity:loaded?1:0,transition:"opacity .3s"}}
              />
              <button className="sn-arrow sn-arrow-l" onClick={prevImg}>‹</button>
              <button className="sn-arrow sn-arrow-r" onClick={nextImg}>›</button>

              {/* badges */}
              <div style={{position:"absolute",top:14,left:14,background:"var(--red)",color:"#fff",fontFamily:"var(--fd)",fontWeight:900,fontSize:12,letterSpacing:1,padding:"5px 12px",borderRadius:4}}>
                SAVE {disc}%
              </div>
              <div style={{position:"absolute",bottom:14,right:14,background:"rgba(0,0,0,.75)",backdropFilter:"blur(6px)",color:"#fff",fontSize:10,fontFamily:"var(--fd)",fontWeight:800,letterSpacing:1,padding:"4px 10px",borderRadius:20,border:"1px solid rgba(255,255,255,.07)"}}>
                {img+1} / {images.length}
              </div>
            </div>

            {/* thumbnails */}
            <div style={{display:"flex",gap:8,padding:"12px 14px",background:"var(--bg1)",borderTop:"1px solid var(--line)",flexWrap:"wrap"}}>
              {images.map((src,i) => (
                <div key={i} onClick={() => setImg(i)} style={{
                  width:62,height:62,borderRadius:8,overflow:"hidden",cursor:"pointer",flexShrink:0,
                  border:`2px solid ${i===img?"var(--red)":"var(--line)"}`,
                  transition:"border-color .2s,transform .2s",
                  transform:i===img?"scale(1.06)":"scale(1)",
                }}>
                  <img src={src} alt={`view ${i+1}`} className="sn-img" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                </div>
              ))}
            </div>

            {/* trust strip */}
            <div style={{display:"flex",padding:"12px 14px",gap:8,borderTop:"1px solid var(--line)",flexWrap:"wrap"}}>
              {[["🚚","Free delivery R500+"],["↩️","30-day returns"],["🔒","Secure checkout"]].map(([icon,lbl]) => (
                <div key={lbl} style={{flex:"1 1 auto",display:"flex",alignItems:"center",gap:7,background:"var(--bg2)",borderRadius:8,padding:"8px 10px",border:"1px solid var(--line)"}}>
                  <span style={{fontSize:13}}>{icon}</span>
                  <span style={{fontSize:10,color:"var(--sub)",fontWeight:700,fontFamily:"var(--fd)",letterSpacing:.5,whiteSpace:"nowrap"}}>{lbl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* DETAILS */}
          <div style={{flex:"1 1 360px",padding:"30px 28px",display:"flex",flexDirection:"column",gap:16,position:"relative",zIndex:1}}>

            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
              <span style={{fontFamily:"var(--fd)",fontSize:10,fontWeight:800,letterSpacing:3,color:"var(--red)",textTransform:"uppercase"}}>
                {product.category||"Sneakers"}
              </span>
              <span style={{color:"var(--line)"}}>·</span>
              <Chip col="#4ADE80" bg="rgba(74,222,128,.1)">● In Stock</Chip>
              <Chip col="var(--gold)" bg="rgba(212,168,67,.1)">Bestseller</Chip>
            </div>

            <div>
              <h2 style={{fontFamily:"var(--fd)",fontWeight:900,fontSize:"clamp(26px,4vw,40px)",letterSpacing:.3,color:"#fff",lineHeight:1,marginBottom:12}}>
                {product.name}
              </h2>
              <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                <Stars r={4.8}/>
                <span style={{fontFamily:"var(--fd)",fontSize:13,fontWeight:800,color:"#fff"}}>4.8</span>
                <span style={{fontSize:12,color:"var(--sub)"}}>(124 reviews)</span>
                <span style={{fontSize:11,color:"var(--red)",fontWeight:800,cursor:"pointer",marginLeft:"auto"}} onClick={() => setTab("reviews")}>Read all →</span>
              </div>
            </div>

            {/* price */}
            <div style={{display:"flex",alignItems:"baseline",gap:14,padding:"14px 0",borderTop:"1px solid var(--line)",borderBottom:"1px solid var(--line)"}}>
              <span style={{fontFamily:"var(--fd)",fontWeight:900,fontSize:46,color:"#fff",letterSpacing:-0.5,lineHeight:1}}>
                R{price.toFixed(2)}
              </span>
              <div>
                <div style={{fontSize:15,color:"var(--muted)",textDecoration:"line-through",lineHeight:1}}>R{orig}</div>
                <div style={{fontSize:10,color:"var(--red)",fontWeight:900,fontFamily:"var(--fd)",letterSpacing:1}}>YOU SAVE R{save}</div>
              </div>
            </div>

            <p style={{fontSize:13,color:"var(--sub)",lineHeight:1.8,margin:0}}>
              {product.description||"Built for the streets, designed for the culture. Premium construction with all-day comfort — whether you're hitting the mall or the court, these are the ones."}
            </p>

            {/* sizes */}
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{fontFamily:"var(--fd)",fontSize:11,fontWeight:800,letterSpacing:1.5,color:"var(--sub)",textTransform:"uppercase"}}>
                  Select Size {size && <span style={{color:"#fff"}}>— {size}</span>}
                </span>
                <span style={{fontSize:10,color:"var(--red)",fontWeight:800,cursor:"pointer",fontFamily:"var(--fd)",letterSpacing:1}}>Size Guide</span>
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {SIZES.map(s => (
                  <button key={s} className={`sn-sz${s===size?" on":""}`} onClick={() => { setSize(s); setSizeErr(false); }}>{s}</button>
                ))}
              </div>
              {sizeErr && (
                <p style={{fontSize:11,color:"var(--red)",fontWeight:800,marginTop:8,fontFamily:"var(--fd)",letterSpacing:.5,animation:"fadeIn .2s"}}>
                  ⚠ Please select a size first
                </p>
              )}
            </div>

            {/* qty + CTA */}
            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              <div style={{display:"flex",alignItems:"center",border:"1px solid var(--line)",borderRadius:8,overflow:"hidden",flexShrink:0}}>
                <button className="sn-qty" onClick={decQty}>−</button>
                <span style={{width:44,height:46,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:900,color:"#fff",background:"var(--bg)",borderLeft:"1px solid var(--line)",borderRight:"1px solid var(--line)",fontFamily:"var(--fd)"}}>{qty}</span>
                <button className="sn-qty" onClick={incQty}>+</button>
              </div>
              <button className="sn-pri" style={{flex:1,minWidth:110,height:46}} onClick={() => tryAdd(() => onAddToCart(product, qty))}>Add to Cart</button>
              <button className="sn-acc" style={{flex:1,minWidth:110,height:46}} onClick={() => tryAdd(() => onBuyNow(product, qty))}>Buy Now</button>
              <button className={`sn-wl${liked?" on":""}`} onClick={toggleLike}>{liked?"♥":"♡"}</button>
            </div>

            <div style={{fontSize:11,color:"var(--muted)",lineHeight:2,borderTop:"1px solid var(--line)",paddingTop:12,fontFamily:"var(--fd)",fontWeight:600,letterSpacing:.3}}>
              <span style={{color:"var(--sub)"}}>SKU:</span>&nbsp;{(product._id||"").slice(-8).toUpperCase()||"N/A"}
              &nbsp;·&nbsp;<span style={{color:"var(--sub)"}}>Brand:</span>&nbsp;{(product.name||"").split(" ")[0]||"ShoeNation"}
              &nbsp;·&nbsp;<span style={{color:"var(--sub)"}}>Category:</span>&nbsp;{product.category||"Sneakers"}
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div style={{borderTop:"1px solid var(--line)",padding:"0 28px 32px"}}>
          <div style={{display:"flex",borderBottom:"1px solid var(--line)",marginBottom:24,overflowX:"auto"}}>
            {[["desc","Description"],["info","Specifications"],["reviews","Reviews (124)"]].map(([k,l]) => (
              <button key={k} className={`sn-tab${tab===k?" on":""}`} onClick={() => setTab(k)}>{l}</button>
            ))}
          </div>

          <div style={{animation:"fadeUp .2s ease"}}>
            {tab==="desc" && (
              <div style={{maxWidth:700}}>
                <p style={{fontSize:13.5,color:"var(--sub)",lineHeight:1.85,marginBottom:18}}>
                  {product.description||"Engineered for South African streets and made to turn heads. Premium upper materials are stitched with reinforced seams for durability, while the cushioned insole system keeps your feet locked in comfort from morning commutes to late-night sessions."}
                </p>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))",gap:10}}>
                  {["Premium Materials","All-Day Comfort","SA Quality Checked","Limited Stock"].map(f => (
                    <div key={f} style={{background:"var(--bg2)",border:"1px solid var(--line)",borderRadius:8,padding:"11px 14px",display:"flex",alignItems:"center",gap:10}}>
                      <span style={{color:"var(--red)",fontSize:15,fontWeight:900}}>✓</span>
                      <span style={{fontSize:11,fontWeight:800,color:"var(--text)",fontFamily:"var(--fd)",letterSpacing:.5}}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab==="info" && (
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                <thead>
                  <tr>
                    {["ATTRIBUTE","DETAILS"].map(h => (
                      <th key={h} style={{background:"var(--red)",color:"#fff",padding:"11px 18px",textAlign:"left",fontFamily:"var(--fd)",fontWeight:900,letterSpacing:1.5,fontSize:11,width:h==="ATTRIBUTE"?"38%":"auto"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ATTRS.map(({attr,value},i) => (
                    <tr key={attr} style={{background:i%2===0?"var(--bg)":"var(--bg1)"}}>
                      <td style={{padding:"12px 18px",color:"var(--sub)",fontWeight:600}}>{attr}</td>
                      <td style={{padding:"12px 18px",color:"var(--text)"}}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab==="reviews" && (
              <div>
                <div style={{display:"flex",gap:24,alignItems:"center",marginBottom:22,padding:"20px",background:"var(--bg)",borderRadius:12,border:"1px solid var(--line)",flexWrap:"wrap"}}>
                  <div style={{textAlign:"center",minWidth:80}}>
                    <div style={{fontFamily:"var(--fd)",fontSize:58,fontWeight:900,lineHeight:1,color:"#fff"}}>4.8</div>
                    <Stars r={4.8}/>
                    <div style={{fontSize:10,color:"var(--muted)",marginTop:4,fontFamily:"var(--fd)",fontWeight:800,letterSpacing:1}}>124 REVIEWS</div>
                  </div>
                  <div style={{flex:1,minWidth:160}}>
                    {[[5,68],[4,22],[3,6],[2,2],[1,2]].map(([star,pct]) => (
                      <div key={star} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                        <span style={{fontSize:10,color:"var(--sub)",width:8}}>{star}</span>
                        <span style={{fontSize:9,color:"#F5C842"}}>★</span>
                        <div style={{flex:1,height:5,background:"var(--bg3)",borderRadius:3,overflow:"hidden"}}>
                          <div style={{width:`${pct}%`,height:"100%",background:star>=4?"#F5C842":star===3?"var(--gold)":"var(--muted)",borderRadius:3}}/>
                        </div>
                        <span style={{fontSize:10,color:"var(--muted)",width:28,fontFamily:"var(--fd)",fontWeight:700}}>{pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {REVIEWS.map((r,i) => (
                    <div key={i} style={{background:"var(--bg)",border:"1px solid var(--line)",borderRadius:12,padding:"18px 20px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,flexWrap:"wrap",gap:8}}>
                        <div>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <span style={{fontFamily:"var(--fd)",fontWeight:900,color:"#fff",fontSize:15}}>{r.name}</span>
                            {r.verified && <Chip col="#4ADE80" bg="rgba(74,222,128,.1)">✓ Verified</Chip>}
                          </div>
                          <span style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--fd)",fontWeight:600,letterSpacing:.3}}>{r.loc} · {r.date}</span>
                        </div>
                        <Stars r={r.rating} sm/>
                      </div>
                      <p style={{fontSize:13,color:"var(--sub)",lineHeight:1.75,margin:0}}>{r.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── RELATED ── */}
        {related.length > 0 && (
          <div style={{borderTop:"1px solid var(--line)",padding:"26px 28px 32px",background:"var(--bg)"}}>
            <div style={{marginBottom:18}}>
              <div style={{fontFamily:"var(--fd)",fontSize:10,fontWeight:900,letterSpacing:3,color:"var(--red)",marginBottom:4}}>YOU MIGHT ALSO LIKE</div>
              <h3 style={{fontFamily:"var(--fd)",fontSize:24,fontWeight:900,color:"#fff",letterSpacing:.3}}>More From The Range</h3>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:12}}>
              {related.slice(0,4).map(rp => {
                const rp_ = pp(rp.price);
                return (
                  <div key={gid(rp)} className="rcard">
                    <div style={{height:140,overflow:"hidden",background:"var(--bg2)"}}>
                      <img src={rp.image} alt={rp.name} className="sn-img" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    </div>
                    <div style={{padding:"10px 12px"}}>
                      <div style={{fontSize:9,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1.5,marginBottom:3,fontFamily:"var(--fd)",fontWeight:800}}>{rp.category}</div>
                      <div style={{fontSize:13,fontWeight:800,color:"#fff",fontFamily:"var(--fd)",lineHeight:1.2,marginBottom:5}}>{rp.name}</div>
                      <div style={{fontFamily:"var(--fd)",fontWeight:900,fontSize:17,color:"var(--red)"}}>R{rp_.toFixed(2)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{height:3,background:"linear-gradient(90deg,transparent 0%,var(--red) 100%)"}}/>
      </div>
    </div>
  );
});

/* ─── PRODUCT CARD ─────────────────────────────────────────────────────── */
const ProductCard = memo(({ product, onOpen, onAddToCart, idx }) => {
  const price = pp(product.price);
  const orig  = (price * 1.28).toFixed(2);
  const disc  = Math.round((1 - price / (price * 1.28)) * 100);

  const handleOpen     = useCallback(() => onOpen(product), [product, onOpen]);
  const handleQuickAdd = useCallback(e => { e.stopPropagation(); onAddToCart(product); }, [product, onAddToCart]);

  return (
    <div
      className="sn-card sn-card-wrap"
      onClick={handleOpen}
      style={{animation:`fadeUp .5s ${idx*0.06}s both ease`}}
    >
      {/* image */}
      <div style={{position:"relative",height:268,overflow:"hidden",background:"#0A0A0A"}}>
        <img src={product.image} alt={product.name} className="sn-img"
          style={{width:"100%",height:"100%",objectFit:"cover"}}/>

        <div className="sn-card-overlay"/>

        <button className="sn-acc sn-quick-add" onClick={handleQuickAdd}>+ Quick Add</button>

        <div style={{position:"absolute",top:12,left:12,background:"var(--red)",color:"#fff",fontFamily:"var(--fd)",fontWeight:900,fontSize:11,letterSpacing:1,padding:"4px 10px",borderRadius:4}}>
          -{disc}%
        </div>
        <div style={{position:"absolute",top:12,right:12,background:"rgba(0,0,0,.78)",backdropFilter:"blur(8px)",color:"var(--sub)",fontSize:9,fontWeight:800,padding:"4px 10px",borderRadius:20,letterSpacing:2,textTransform:"uppercase",fontFamily:"var(--fd)",border:"1px solid rgba(255,255,255,.06)"}}>
          {product.category||"Sneakers"}
        </div>
      </div>

      {/* info */}
      <div style={{padding:"16px 18px 18px"}}>
        <h3 style={{fontFamily:"var(--fd)",fontWeight:900,fontSize:19,letterSpacing:.3,color:"#fff",lineHeight:1.1,marginBottom:8}}>
          {product.name}
        </h3>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:12}}>
          <Stars r={4.8} sm/>
          <span style={{fontSize:11,color:"var(--muted)",fontWeight:700,fontFamily:"var(--fd)"}}>4.8 (124)</span>
        </div>
        <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",flexWrap:"wrap",gap:4}}>
          <div>
            <span style={{fontFamily:"var(--fd)",fontWeight:900,fontSize:22,color:"#fff"}}>R{price.toFixed(2)}</span>
            <span style={{fontSize:13,color:"var(--muted)",textDecoration:"line-through",marginLeft:8}}>R{orig}</span>
          </div>
          <span style={{fontSize:10,color:"var(--red)",fontWeight:900,fontFamily:"var(--fd)",letterSpacing:.5}}>
            SAVE R{(price*1.28 - price).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
});

/* ─── SKELETON ──────────────────────────────────────────────────────────── */
const Skel = memo(({ i }) => (
  <div style={{background:"var(--bg1)",borderRadius:14,overflow:"hidden",border:"1px solid var(--line)",animation:`shimmer 1.4s ${i*0.1}s ease infinite`}}>
    <div style={{height:268,background:"var(--bg2)"}}/>
    <div style={{padding:"16px 18px 18px",display:"flex",flexDirection:"column",gap:10}}>
      <div style={{height:20,background:"var(--bg2)",borderRadius:4,width:"72%"}}/>
      <div style={{height:12,background:"var(--bg2)",borderRadius:4,width:"38%"}}/>
      <div style={{height:16,background:"var(--bg2)",borderRadius:4,width:"52%"}}/>
    </div>
  </div>
));

/* ─── MAIN ──────────────────────────────────────────────────────────────── */
const Products = () => {
  const navigate = useNavigate();

  const [products,  setProducts]  = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [category,  setCategory]  = useState("all");
  const [showAll,   setShowAll]   = useState(false);
  const [selected,  setSelected]  = useState(null);
  const [toast,     setToast]     = useState("");
  const [loading,   setLoading]   = useState(true);

  /* Cart: read once from localStorage, write only on explicit change */
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cart")) || []; } catch { return []; }
  });
  const cartCount = cart.reduce((s, it) => s + it.qty, 0);

  const toastTimer = useRef(null);
  const showToast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2800);
  }, []);

  /* addToCart writes localStorage itself — avoids effect running on every unrelated render */
  const addToCart = useCallback((product, qty = 1) => {
    const id = gid(product);
    setCart(prev => {
      const ex   = prev.find(it => it.id === id);
      const next = ex
        ? prev.map(it => it.id === id ? {...it, qty: it.qty + qty} : it)
        : [...prev, {id, name:product.name, price:pp(product.price), image:product.image, qty}];
      localStorage.setItem("cart", JSON.stringify(next));
      return next;
    });
    showToast(`✔ ${product.name} added to cart`);
  }, [showToast]);

  const handleBuyNow = useCallback((product, qty = 1) => {
    addToCart(product, qty);
    navigate("/cart");
  }, [addToCart, navigate]);

  const fetchProducts = useCallback(async (cat = "all") => {
    setLoading(true);
    try {
      const key    = `sn_products_${cat}`;
      const cached = localStorage.getItem(key);
      if (cached) {
        const p = JSON.parse(cached);
        setProducts(p);
        setDisplayed(p.slice(0, 8));
      }
      const url = cat === "all" ? `${backendurl}/products` : `${backendurl}/products?category=${cat}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const result = await res.json();
      const arr = Array.isArray(result) ? result : result.data || [];
      setProducts(arr);
      setDisplayed(arr.slice(0, 8));
      setShowAll(false);
      localStorage.setItem(key, JSON.stringify(arr));
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProducts("all"); }, [fetchProducts]);

  const handleCatChange = useCallback((cat) => {
    setCategory(cat);
    fetchProducts(cat);
  }, [fetchProducts]);

  const handleLoadAll = useCallback(() => {
    setShowAll(true);
    setDisplayed(products);
  }, [products]);

  const related = selected
    ? products.filter(p => gid(p) !== gid(selected) && p.category === selected.category).slice(0, 4)
    : [];

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      {/* fixed navbar */}
      <div style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,background:"rgba(8,8,8,.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid var(--line)"}}>
        <Navbar/>
      </div>

      {/* floating cart */}
      <div style={{position:"fixed",bottom:28,right:28,zIndex:2000}}>
        <button onClick={() => navigate("/cart")} style={{
          background:"#fff",color:"#000",border:"none",
          borderRadius:"50%",width:54,height:54,fontSize:22,
          cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
          boxShadow:"0 8px 32px rgba(0,0,0,.7)",position:"relative",
          transition:"transform .2s",
        }}
          onMouseEnter={e => e.currentTarget.style.transform="scale(1.12)"}
          onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
        >
          🛒
          {cartCount > 0 && (
            <span style={{position:"absolute",top:-5,right:-5,background:"var(--red)",color:"#fff",borderRadius:"50%",width:22,height:22,fontSize:11,fontWeight:900,border:"2px solid var(--bg)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* ── PAGE ── */}
      <section style={{maxWidth:1380,margin:"0 auto",padding:"100px 22px 70px",minHeight:"100vh",position:"relative"}}>
        <Grain/>

        {/* HEADER */}
        <div style={{marginBottom:48,position:"relative",zIndex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14,animation:"slideR .5s ease"}}>
            <div style={{width:24,height:3,background:"var(--red)",borderRadius:2}}/>
            <span style={{fontFamily:"var(--fd)",fontSize:10,fontWeight:900,letterSpacing:4,color:"var(--red)",textTransform:"uppercase"}}>
              ShoeNation RSA · Official Store
            </span>
          </div>

          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",flexWrap:"wrap",gap:20,marginBottom:28}}>
            <h1 style={{fontFamily:"var(--fd)",fontWeight:900,fontSize:"clamp(54px,9vw,100px)",letterSpacing:-1,lineHeight:.9,color:"#fff",animation:"fadeUp .5s ease"}}>
              THE<br/>
              <span style={{WebkitTextStroke:"2px var(--red)",color:"transparent",display:"block"}}>DROP.</span>
            </h1>
            <div style={{maxWidth:260,animation:"fadeUp .65s ease"}}>
              <p style={{fontSize:13,color:"var(--sub)",lineHeight:1.75,marginBottom:12}}>
                Premium sneakers. SA prices. Every pair quality checked before it ships to your door.
              </p>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:"#4ADE80",boxShadow:"0 0 8px #4ADE80"}}/>
                <span style={{fontSize:11,color:"var(--sub)",fontWeight:700,fontFamily:"var(--fd)",letterSpacing:.5}}>
                  {products.length > 0 ? `${products.length} styles in stock` : "Loading collection..."}
                </span>
              </div>
            </div>
          </div>

          <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",animation:"fadeUp .7s ease"}}>
            {CATS.map(cat => (
              <button key={cat} className={`sn-cat${category===cat?" on":""}`} onClick={() => handleCatChange(cat)}>
                {cat==="all" ? "All Styles" : cat.charAt(0).toUpperCase()+cat.slice(1)}
              </button>
            ))}
            <span style={{marginLeft:"auto",fontFamily:"var(--fd)",fontSize:11,fontWeight:800,letterSpacing:1.5,color:"var(--muted)"}}>
              {displayed.length} STYLES
            </span>
          </div>
        </div>

        {/* GRID */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(285px,1fr))",gap:22,marginBottom:50,position:"relative",zIndex:1}}>
          {loading
            ? Array(8).fill(0).map((_,i) => <Skel key={i} i={i}/>)
            : displayed.map((p,i) => (
                <ProductCard key={gid(p)} product={p} idx={i} onOpen={setSelected} onAddToCart={addToCart}/>
              ))
          }
        </div>

        {/* load more */}
        {!showAll && !loading && displayed.length >= 8 && (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10,position:"relative",zIndex:1}}>
            <button className="sn-loadmore" onClick={handleLoadAll}>
              Load All {products.length} Styles
            </button>
            <span style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--fd)",fontWeight:700,letterSpacing:1}}>
              SHOWING {displayed.length} OF {products.length}
            </span>
          </div>
        )}
      </section>

      {/* modal */}
      {selected && (
        <Modal
          product={selected}
          related={related}
          onClose={() => setSelected(null)}
          onAddToCart={addToCart}
          onBuyNow={handleBuyNow}
        />
      )}

      {/* toast */}
      {toast && (
        <div style={{
          position:"fixed",bottom:28,left:"50%",
          background:"var(--bg1)",color:"#fff",
          border:"1px solid var(--line)",borderLeft:"3px solid var(--red)",
          padding:"12px 22px 12px 16px",borderRadius:10,
          fontFamily:"var(--fd)",fontWeight:800,fontSize:13,
          zIndex:9999,boxShadow:"0 12px 44px rgba(0,0,0,.75)",
          animation:"alertIn .3s cubic-bezier(.16,1,.3,1)",
          display:"flex",alignItems:"center",gap:10,whiteSpace:"nowrap",
        }}>
          <span style={{color:"var(--red)",fontSize:16}}>✔</span>
          {toast}
        </div>
      )}

      <Footer/>
    </>
  );
};

export default Products;