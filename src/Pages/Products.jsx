import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const backendurl = import.meta.env.VITE_BACKENDURL;

/* ─── GLOBAL CSS ──────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;0,900;1,900&family=Barlow:wght@300;400;500;600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:#060606;color:#fff;font-family:'Barlow',sans-serif}

:root{
  --red:#E8192C; --red2:#ff2d42;
  --bg:#060606; --bg1:#0C0C0C; --bg2:#111111; --bg3:#181818;
  --line:#1C1C1C; --muted:#3a3a3a; --sub:#666; --text:#EBEBEB;
  --fd:'Barlow Condensed',sans-serif; --fb:'Barlow',sans-serif;
}

::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:#222;border-radius:2px}

/* ── keyframes ── */
@keyframes fadeUp   {from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
@keyframes fadeIn   {from{opacity:0}to{opacity:1}}
@keyframes slideR   {from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:none}}
@keyframes heroIn   {from{opacity:0;transform:translateY(30px) skewY(2deg)}to{opacity:1;transform:none}}
@keyframes scaleIn  {from{opacity:0;transform:scale(.95) translateY(32px)}to{opacity:1;transform:none}}
@keyframes spin     {to{transform:rotate(360deg)}}
@keyframes shimmer  {0%,100%{opacity:.2}50%{opacity:.55}}
@keyframes alertIn  {from{opacity:0;transform:translateX(-50%) translateY(16px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
@keyframes pulse    {0%{box-shadow:0 0 0 0 rgba(232,25,44,.6)}70%{box-shadow:0 0 0 10px rgba(232,25,44,0)}100%{box-shadow:0 0 0 0 rgba(232,25,44,0)}}
@keyframes grain    {
  0%,100%{transform:translate(0,0)} 20%{transform:translate(-2%,-3%)}
  40%{transform:translate(2%,-1%)} 60%{transform:translate(-3%,2%)} 80%{transform:translate(3%,1%)}
}
@keyframes scanBar  {0%{left:-100%}50%{left:0%}100%{left:100%}}
@keyframes bgDrift  {from{transform:translateY(0)} to{transform:translateY(-14px)}}
@keyframes marqueeRed {from{transform:translateX(0)} to{transform:translateX(-33.333%)}}

/* ── grain overlay ── */
.sn-grain{
  position:absolute;inset:-50%;width:200%;height:200%;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity:.035;pointer-events:none;z-index:0;
  will-change:transform;animation:grain 6s steps(2) infinite;
}

/* ── image zoom ── */
.sn-img{transition:transform .55s cubic-bezier(.16,1,.3,1);display:block}

/* ── CHIP ── */
.sn-chip{
  font-size:9px;font-weight:900;font-family:var(--fd);
  letter-spacing:2px;text-transform:uppercase;
  padding:3px 10px;border-radius:2px;
  display:inline-flex;align-items:center;gap:4px;
}

/* ── TABS ── */
.sn-tab{
  background:none;border:none;font-family:var(--fd);font-size:12px;font-weight:900;
  letter-spacing:3px;text-transform:uppercase;cursor:pointer;padding:16px 20px;
  color:var(--muted);border-bottom:2px solid transparent;margin-bottom:-1px;
  transition:color .2s,border-color .2s;
}
.sn-tab:hover{color:var(--text)}
.sn-tab.on{color:#fff;border-bottom-color:var(--red)}

/* ── SIZE BUTTONS ── */
.sn-sz{
  background:var(--bg2);color:var(--sub);border:1px solid var(--line);
  padding:8px 14px;font-size:11px;font-weight:900;font-family:var(--fd);letter-spacing:1px;
  cursor:pointer;transition:all .18s;
  clip-path:polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%);
}
.sn-sz:hover{border-color:var(--sub);color:#fff}
.sn-sz.on{background:#fff;color:#000;border-color:#fff}

/* ── CATEGORY FILTER PILLS ── */
.sn-cat{
  padding:9px 24px;border:1px solid var(--line);background:transparent;
  color:var(--sub);font-size:10px;font-weight:900;font-family:var(--fd);letter-spacing:3px;
  text-transform:uppercase;cursor:pointer;transition:all .2s;
  clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);
}
.sn-cat:hover{border-color:var(--sub);color:#fff}
.sn-cat.on{background:var(--red);border-color:var(--red);color:#fff}

/* ── PRIMARY BUTTON (white fill) ── */
.sn-pri{
  position:relative;overflow:hidden;
  background:none;color:#fff;border:2px solid #fff;
  font-size:11px;font-weight:900;font-family:var(--fd);letter-spacing:3px;
  text-transform:uppercase;cursor:pointer;transition:color .22s;padding:13px 22px;
  clip-path:polygon(7px 0%,100% 0%,calc(100% - 7px) 100%,0% 100%);
  display:inline-flex;align-items:center;justify-content:center;
}
.sn-pri::before{
  content:'';position:absolute;inset:0;background:#fff;
  transform:translateX(-101%);transition:transform .28s cubic-bezier(.16,1,.3,1);
}
.sn-pri:hover{color:#000}
.sn-pri:hover::before{transform:translateX(0)}
.sn-pri span{position:relative;z-index:1}

/* ── ACCENT BUTTON (red fill) ── */
.sn-acc{
  position:relative;overflow:hidden;
  background:none;color:#fff;border:2px solid var(--red);
  font-size:11px;font-weight:900;font-family:var(--fd);letter-spacing:3px;
  text-transform:uppercase;cursor:pointer;transition:color .22s;padding:13px 22px;
  clip-path:polygon(7px 0%,100% 0%,calc(100% - 7px) 100%,0% 100%);
  display:inline-flex;align-items:center;justify-content:center;
}
.sn-acc::before{
  content:'';position:absolute;inset:0;background:var(--red);
  transform:translateX(-101%);transition:transform .28s cubic-bezier(.16,1,.3,1);
}
.sn-acc:hover::before{transform:translateX(0)}
.sn-acc span{position:relative;z-index:1}

/* ── WISHLIST ── */
.sn-wl{
  width:46px;height:46px;border:1px solid var(--line);background:var(--bg2);
  color:var(--muted);font-size:18px;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  transition:all .2s;flex-shrink:0;
  clip-path:polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%);
}
.sn-wl:hover,.sn-wl.on{border-color:#e11d48;color:#e11d48;background:rgba(225,29,72,.08)}

/* ── QTY BUTTONS ── */
.sn-qty{
  background:var(--bg2);color:#fff;border:none;
  width:40px;height:46px;font-size:20px;
  cursor:pointer;display:flex;align-items:center;justify-content:center;
  transition:background .15s;font-family:var(--fd);font-weight:900;
}
.sn-qty:hover{background:var(--bg3)}

/* ── PRODUCT CARD ── */
.sn-card-wrap{
  background:var(--bg1);overflow:hidden;
  border:1px solid var(--line);
  clip-path:polygon(0 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%);
  transition:transform .32s cubic-bezier(.16,1,.3,1),box-shadow .32s,border-color .32s;
  position:relative;cursor:pointer;
}
.sn-card-wrap:hover{
  transform:translateY(-9px) scale(1.01);
  box-shadow:0 32px 80px rgba(0,0,0,.95);
  border-color:#252525;
}
.sn-card-overlay{
  position:absolute;inset:0;
  background:linear-gradient(to top,rgba(0,0,0,.88) 0%,transparent 60%);
  opacity:0;transition:opacity .3s;pointer-events:none;
}
.sn-card-wrap:hover .sn-card-overlay{opacity:1}
.sn-quick-add{
  position:absolute;bottom:0;left:0;right:0;
  padding:14px;letter-spacing:3px;font-size:10px;
  transform:translateY(100%);border-radius:0;
  transition:transform .28s cubic-bezier(.16,1,.3,1);
  clip-path:none;
}
.sn-card-wrap:hover .sn-quick-add{transform:translateY(0)}
.sn-card-wrap:hover .sn-img{transform:scale(1.07)}

/* red bottom bar on card */
.sn-card-bar{
  position:absolute;bottom:0;left:0;right:0;height:2px;
  background:var(--red);transform:scaleX(0);transform-origin:left;
  transition:transform .32s cubic-bezier(.16,1,.3,1);
}
.sn-card-wrap:hover .sn-card-bar{transform:scaleX(1)}

/* ── RELATED CARD ── */
.rcard{
  background:var(--bg1);overflow:hidden;border:1px solid var(--line);
  cursor:pointer;transition:transform .22s,box-shadow .22s;
  clip-path:polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%);
}
.rcard:hover{transform:translateY(-5px);box-shadow:0 16px 40px rgba(0,0,0,.8)}
.rcard:hover .sn-img{transform:scale(1.08)}

/* ── CLOSE BTN ── */
.sn-close{
  position:absolute;top:18px;right:18px;
  background:var(--bg3);color:var(--sub);
  border:1px solid var(--line);border-radius:50%;
  width:40px;height:40px;font-size:14px;cursor:pointer;z-index:20;
  display:flex;align-items:center;justify-content:center;
  transition:background .2s,color .2s,transform .2s;
}
.sn-close:hover{background:#fff;color:#000;transform:rotate(90deg)}

/* ── GALLERY ARROWS ── */
.sn-arrow{
  position:absolute;top:50%;transform:translateY(-50%);
  background:rgba(0,0,0,.75);backdrop-filter:blur(8px);
  color:#fff;border:1px solid rgba(255,255,255,.08);
  border-radius:50%;width:38px;height:38px;font-size:20px;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  transition:background .18s;font-family:var(--fd);
}
.sn-arrow:hover{background:rgba(232,25,44,.9)}
.sn-arrow-l{left:14px}
.sn-arrow-r{right:14px}

/* ── LOAD MORE ── */
.sn-loadmore{
  padding:15px 56px;background:transparent;color:#fff;
  border:2px solid var(--line);font-size:11px;font-weight:900;
  cursor:pointer;letter-spacing:4px;text-transform:uppercase;
  transition:all .25s;font-family:var(--fd);
  clip-path:polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%);
  position:relative;overflow:hidden;
}
.sn-loadmore::before{
  content:'';position:absolute;inset:0;background:var(--red);
  transform:translateX(-101%);transition:transform .28s cubic-bezier(.16,1,.3,1);
}
.sn-loadmore:hover{border-color:var(--red)}
.sn-loadmore:hover::before{transform:translateX(0)}
.sn-loadmore span{position:relative;z-index:1}
`;

/* ─── helpers ─────────────────────────────────────────────────────────── */
const pp  = (p) => typeof p === "number" ? p : parseFloat(String(p).replace(/[^0-9.-]+/g,"")) || 0;
const gid = (p) => p._id || p.id;

const SIZES   = ["UK 5","UK 6","UK 7","UK 8","UK 9","UK 10","UK 11","UK 12"];
const CATS    = ["all","mens","women","kids"];
const ATTRS   = [
  {attr:"Upper Material", value:"Premium Leather / Canvas"},
  {attr:"Sole",           value:"Vulcanised Rubber, Cushioned Insole"},
  {attr:"Closure",        value:"Lace-Up"},
  {attr:"Fit",            value:"True to size — size up for wide feet"},
  {attr:"Care",           value:"Wipe with damp cloth, air dry"},
  {attr:"Origin",         value:"Vietnam"},
];
const REVIEWS = [
  {name:"Thabo M.",  loc:"Joburg",   date:"Feb 2025",rating:5,verified:true,text:"These are honestly the cleanest kicks I've owned. Wore them to a braai on Saturday, got like five compliments. Fit is perfect on size UK 9."},
  {name:"Kefilwe D.",loc:"Pretoria", date:"Jan 2025",rating:4,verified:true,text:"Delivered super fast — ordered Thursday, had them by Saturday. Sized down half a size and it worked perfectly. Quality is legit."},
  {name:"Ryan C.",   loc:"Cape Town",date:"Dec 2024",rating:5,verified:true,text:"Bought these for my nephew for Christmas. He hasn't taken them off. The sole grip is excellent, way better than expected for the price."},
  {name:"Naledi S.", loc:"Soweto",   date:"Nov 2024",rating:5,verified:true,text:"ShoeNation never disappoints. Third pair I've bought and the quality is always consistent. These colourways are actually 🔥"},
];

/* ─── Sub-components ──────────────────────────────────────────────────── */
const Stars = memo(({ r = 4.8, sm = false }) => (
  <span style={{display:"flex",gap:1}}>
    {[1,2,3,4,5].map(i =>
      <span key={i} style={{fontSize:sm?10:13,color:i<=Math.round(r)?"#F5C842":"#252525"}}>★</span>
    )}
  </span>
));

const Grain = memo(() => <div className="sn-grain"/>);

const Chip = memo(({ children, col="#E8192C", bg="rgba(232,25,44,.1)" }) => (
  <span className="sn-chip" style={{background:bg,color:col,border:`1px solid ${col}25`}}>
    {children}
  </span>
));

const EyebrowBar = () => (
  <span style={{display:"inline-block",width:18,height:3,background:"var(--red)",borderRadius:2,flexShrink:0,verticalAlign:"middle"}}/>
);

/* ─── MODAL ───────────────────────────────────────────────────────────── */
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
      background:"rgba(0,0,0,.92)",backdropFilter:"blur(20px)",
      zIndex:3000,display:"flex",alignItems:"flex-start",justifyContent:"center",
      overflowY:"auto",padding:"32px 14px 88px",
      animation:"fadeIn .18s ease",
    }}>
      <div style={{
        width:"100%",maxWidth:1080,
        background:"var(--bg1)",
        border:"1px solid var(--line)",overflow:"hidden",
        position:"relative",
        animation:"scaleIn .32s cubic-bezier(.16,1,.3,1)",
        boxShadow:"0 70px 160px rgba(0,0,0,.98)",
        clipPath:"polygon(0 0,100% 0,100% calc(100% - 24px),calc(100% - 24px) 100%,0 100%)",
      }}>
        <Grain/>

        {/* top accent bar — gradient red */}
        <div style={{height:4,background:"linear-gradient(90deg,var(--red) 0%,#ff6b7a 40%,transparent 100%)"}}/>

        {/* section number watermark */}
        <span style={{
          position:"absolute",right:"-0.04em",top:"-0.1em",
          fontFamily:"var(--fd)",fontWeight:900,
          fontSize:"clamp(120px,16vw,200px)",
          color:"rgba(255,255,255,.018)",
          letterSpacing:"-6px",lineHeight:1,
          userSelect:"none",pointerEvents:"none",zIndex:0,
        }}>PDT</span>

        <button className="sn-close" onClick={onClose}>✕</button>

        {/* ── TOP: gallery + details ── */}
        <div style={{display:"flex",flexWrap:"wrap",position:"relative",zIndex:1}}>

          {/* GALLERY */}
          <div style={{flex:"1 1 400px",background:"var(--bg)",display:"flex",flexDirection:"column",borderRight:"1px solid var(--line)"}}>

            {/* main image */}
            <div style={{position:"relative",aspectRatio:"1/1",overflow:"hidden",background:"#080808"}}>
              {!loaded && (
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <div style={{width:26,height:26,border:"2px solid var(--line)",borderTopColor:"var(--red)",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>
                </div>
              )}
              <img
                src={images[img]} alt={product.name}
                onLoad={() => setLoaded(true)}
                className="sn-img"
                style={{width:"100%",height:"100%",objectFit:"cover",opacity:loaded?1:0,transition:"opacity .3s"}}
              />
              <button className="sn-arrow sn-arrow-l" onClick={prevImg}>‹</button>
              <button className="sn-arrow sn-arrow-r" onClick={nextImg}>›</button>

              {/* SAVE badge — clipped */}
              <div style={{
                position:"absolute",top:16,left:16,
                background:"var(--red)",color:"#fff",
                fontFamily:"var(--fd)",fontWeight:900,fontSize:12,letterSpacing:2,
                padding:"6px 14px",
                clipPath:"polygon(5px 0%,100% 0%,calc(100% - 5px) 100%,0% 100%)",
              }}>
                SAVE {disc}%
              </div>
              {/* counter pill */}
              <div style={{
                position:"absolute",bottom:14,right:14,
                background:"rgba(0,0,0,.78)",backdropFilter:"blur(8px)",
                color:"#fff",fontSize:10,fontFamily:"var(--fd)",fontWeight:900,
                letterSpacing:2,padding:"4px 12px",
                border:"1px solid rgba(255,255,255,.06)",
              }}>
                {img+1} / {images.length}
              </div>
            </div>

            {/* thumbnails */}
            <div style={{display:"flex",gap:8,padding:"12px 14px",background:"var(--bg1)",borderTop:"1px solid var(--line)",flexWrap:"wrap"}}>
              {images.map((src,i) => (
                <div key={i} onClick={() => setImg(i)} style={{
                  width:62,height:62,overflow:"hidden",cursor:"pointer",flexShrink:0,
                  border:`2px solid ${i===img?"var(--red)":"var(--line)"}`,
                  transition:"border-color .2s,transform .2s",
                  transform:i===img?"scale(1.06)":"scale(1)",
                  clipPath:"polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%)",
                }}>
                  <img src={src} alt={`view ${i+1}`} className="sn-img" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                </div>
              ))}
            </div>

            {/* trust strip */}
            <div style={{display:"flex",padding:"12px 14px",gap:6,borderTop:"1px solid var(--line)",flexWrap:"wrap"}}>
              {[["🚚","Free delivery R500+"],["↩️","30-day returns"],["🔒","Secure checkout"]].map(([icon,lbl]) => (
                <div key={lbl} style={{
                  flex:"1 1 auto",display:"flex",alignItems:"center",gap:8,
                  background:"var(--bg2)",padding:"9px 11px",border:"1px solid var(--line)",
                  borderLeft:"2px solid var(--red)",
                }}>
                  <span style={{fontSize:13}}>{icon}</span>
                  <span style={{fontSize:9,color:"var(--sub)",fontWeight:900,fontFamily:"var(--fd)",letterSpacing:1.5,textTransform:"uppercase",whiteSpace:"nowrap"}}>{lbl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* DETAILS */}
          <div style={{flex:"1 1 360px",padding:"32px 28px",display:"flex",flexDirection:"column",gap:18,position:"relative",zIndex:1}}>

            {/* eyebrow */}
            <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
              <EyebrowBar/>
              <span style={{fontFamily:"var(--fd)",fontSize:10,fontWeight:900,letterSpacing:4,color:"var(--red)",textTransform:"uppercase"}}>
                {product.category||"Sneakers"}
              </span>
              <span style={{color:"var(--line)"}}>·</span>
              <Chip col="#4ADE80" bg="rgba(74,222,128,.1)">● In Stock</Chip>
              <Chip>Bestseller</Chip>
            </div>

            {/* name + rating */}
            <div>
              <h2 style={{fontFamily:"var(--fd)",fontWeight:900,fontSize:"clamp(28px,4vw,46px)",letterSpacing:"-1px",color:"#fff",lineHeight:.9,marginBottom:14}}>
                {product.name}
              </h2>
              <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                <Stars r={4.8}/>
                <span style={{fontFamily:"var(--fd)",fontSize:13,fontWeight:900,color:"#fff"}}>4.8</span>
                <span style={{fontSize:12,color:"var(--sub)"}}>(124 reviews)</span>
                <span style={{fontSize:10,color:"var(--red)",fontWeight:900,cursor:"pointer",marginLeft:"auto",fontFamily:"var(--fd)",letterSpacing:1,textTransform:"uppercase"}} onClick={() => setTab("reviews")}>Read All →</span>
              </div>
            </div>

            {/* price row */}
            <div style={{display:"flex",alignItems:"baseline",gap:16,padding:"16px 0",borderTop:"1px solid var(--line)",borderBottom:"1px solid var(--line)"}}>
              <span style={{fontFamily:"var(--fd)",fontWeight:900,fontSize:"clamp(38px,5vw,52px)",color:"#fff",letterSpacing:"-1px",lineHeight:1}}>
                R{price.toFixed(2)}
              </span>
              <div>
                <div style={{fontSize:14,color:"var(--muted)",textDecoration:"line-through",lineHeight:1}}>R{orig}</div>
                <div style={{fontSize:10,color:"var(--red)",fontWeight:900,fontFamily:"var(--fd)",letterSpacing:2,textTransform:"uppercase",marginTop:2}}>Save R{save}</div>
              </div>
            </div>

            <p style={{fontSize:13,color:"var(--sub)",lineHeight:1.85,margin:0,fontFamily:"var(--fb)"}}>
              {product.description||"Built for the streets, designed for the culture. Premium construction with all-day comfort — whether you're hitting the mall or the court, these are the ones."}
            </p>

            {/* size selector */}
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <EyebrowBar/>
                  <span style={{fontFamily:"var(--fd)",fontSize:10,fontWeight:900,letterSpacing:3,color:"var(--sub)",textTransform:"uppercase"}}>
                    Select Size{size && <span style={{color:"#fff"}}> — {size}</span>}
                  </span>
                </div>
                <span style={{fontSize:10,color:"var(--red)",fontWeight:900,cursor:"pointer",fontFamily:"var(--fd)",letterSpacing:2,textTransform:"uppercase"}}>Size Guide</span>
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {SIZES.map(s => (
                  <button key={s} className={`sn-sz${s===size?" on":""}`} onClick={() => { setSize(s); setSizeErr(false); }}>{s}</button>
                ))}
              </div>
              {sizeErr && (
                <p style={{fontSize:11,color:"var(--red)",fontWeight:900,marginTop:8,fontFamily:"var(--fd)",letterSpacing:1,animation:"fadeIn .2s"}}>
                  ⚠ Select a size first
                </p>
              )}
            </div>

            {/* qty + CTA */}
            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              <div style={{display:"flex",alignItems:"center",border:"1px solid var(--line)",overflow:"hidden",flexShrink:0}}>
                <button className="sn-qty" onClick={decQty}>−</button>
                <span style={{width:44,height:46,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:900,color:"#fff",background:"var(--bg)",borderLeft:"1px solid var(--line)",borderRight:"1px solid var(--line)",fontFamily:"var(--fd)"}}>{qty}</span>
                <button className="sn-qty" onClick={incQty}>+</button>
              </div>
              <button className="sn-pri" style={{flex:1,minWidth:110,height:46}} onClick={() => tryAdd(() => onAddToCart(product, qty))}>
                <span>Add to Cart</span>
              </button>
              <button className="sn-acc" style={{flex:1,minWidth:110,height:46}} onClick={() => tryAdd(() => onBuyNow(product, qty))}>
                <span>Buy Now</span>
              </button>
              <button className={`sn-wl${liked?" on":""}`} onClick={toggleLike}>{liked?"♥":"♡"}</button>
            </div>

            {/* meta */}
            <div style={{fontSize:11,color:"var(--muted)",lineHeight:2,borderTop:"1px solid var(--line)",paddingTop:12,fontFamily:"var(--fd)",fontWeight:700,letterSpacing:.5}}>
              <span style={{color:"var(--sub)"}}>SKU</span>: {(product._id||"").slice(-8).toUpperCase()||"N/A"}
              &nbsp;·&nbsp;<span style={{color:"var(--sub)"}}>Brand</span>: {(product.name||"").split(" ")[0]||"ShoeNation"}
              &nbsp;·&nbsp;<span style={{color:"var(--sub)"}}>Category</span>: {product.category||"Sneakers"}
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div style={{borderTop:"1px solid var(--line)",padding:"0 28px 36px",position:"relative",zIndex:1}}>
          <div style={{display:"flex",borderBottom:"1px solid var(--line)",marginBottom:26,overflowX:"auto"}}>
            {[["desc","Description"],["info","Specifications"],["reviews","Reviews (124)"]].map(([k,l]) => (
              <button key={k} className={`sn-tab${tab===k?" on":""}`} onClick={() => setTab(k)}>{l}</button>
            ))}
          </div>

          <div style={{animation:"fadeUp .22s ease"}}>
            {tab==="desc" && (
              <div style={{maxWidth:700}}>
                <p style={{fontSize:13.5,color:"var(--sub)",lineHeight:1.9,marginBottom:20,fontFamily:"var(--fb)"}}>
                  {product.description||"Engineered for South African streets and made to turn heads. Premium upper materials are stitched with reinforced seams for durability, while the cushioned insole system keeps your feet locked in comfort from morning commutes to late-night sessions."}
                </p>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))",gap:8}}>
                  {["Premium Materials","All-Day Comfort","SA Quality Checked","Limited Stock"].map(f => (
                    <div key={f} style={{background:"var(--bg2)",border:"1px solid var(--line)",borderLeft:"2px solid var(--red)",padding:"11px 14px",display:"flex",alignItems:"center",gap:10}}>
                      <span style={{color:"var(--red)",fontSize:14,fontWeight:900}}>✓</span>
                      <span style={{fontSize:10,fontWeight:900,color:"var(--text)",fontFamily:"var(--fd)",letterSpacing:1.5,textTransform:"uppercase"}}>{f}</span>
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
                      <th key={h} style={{background:"var(--red)",color:"#fff",padding:"12px 18px",textAlign:"left",fontFamily:"var(--fd)",fontWeight:900,letterSpacing:3,fontSize:10,width:h==="ATTRIBUTE"?"38%":"auto"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ATTRS.map(({attr,value},i) => (
                    <tr key={attr} style={{background:i%2===0?"var(--bg)":"var(--bg1)",borderBottom:"1px solid var(--line)"}}>
                      <td style={{padding:"13px 18px",color:"var(--sub)",fontWeight:700,fontFamily:"var(--fd)",letterSpacing:.5}}>{attr}</td>
                      <td style={{padding:"13px 18px",color:"var(--text)",fontFamily:"var(--fb)",fontSize:13}}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab==="reviews" && (
              <div>
                {/* rating summary */}
                <div style={{display:"flex",gap:24,alignItems:"center",marginBottom:22,padding:"20px",background:"var(--bg)",border:"1px solid var(--line)",borderLeft:"3px solid var(--red)",flexWrap:"wrap"}}>
                  <div style={{textAlign:"center",minWidth:80}}>
                    <div style={{fontFamily:"var(--fd)",fontSize:62,fontWeight:900,lineHeight:1,color:"#fff",letterSpacing:"-2px"}}>4.8</div>
                    <Stars r={4.8}/>
                    <div style={{fontSize:9,color:"var(--muted)",marginTop:4,fontFamily:"var(--fd)",fontWeight:900,letterSpacing:2}}>124 REVIEWS</div>
                  </div>
                  <div style={{flex:1,minWidth:160}}>
                    {[[5,68],[4,22],[3,6],[2,2],[1,2]].map(([star,pct]) => (
                      <div key={star} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                        <span style={{fontSize:10,color:"var(--sub)",width:8,fontFamily:"var(--fd)",fontWeight:900}}>{star}</span>
                        <span style={{fontSize:9,color:"#F5C842"}}>★</span>
                        <div style={{flex:1,height:4,background:"var(--bg3)",overflow:"hidden"}}>
                          <div style={{width:`${pct}%`,height:"100%",background:star>=4?"#F5C842":star===3?"#D4A843":"var(--muted)"}}/>
                        </div>
                        <span style={{fontSize:10,color:"var(--muted)",width:28,fontFamily:"var(--fd)",fontWeight:900}}>{pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* review list */}
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {REVIEWS.map((r,i) => (
                    <div key={i} style={{background:"var(--bg)",border:"1px solid var(--line)",padding:"18px 20px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,flexWrap:"wrap",gap:8}}>
                        <div>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <span style={{fontFamily:"var(--fd)",fontWeight:900,color:"#fff",fontSize:16,letterSpacing:.3}}>{r.name}</span>
                            {r.verified && <Chip col="#4ADE80" bg="rgba(74,222,128,.1)">✓ Verified</Chip>}
                          </div>
                          <span style={{fontSize:10,color:"var(--muted)",fontFamily:"var(--fd)",fontWeight:700,letterSpacing:1}}>{r.loc} · {r.date}</span>
                        </div>
                        <Stars r={r.rating} sm/>
                      </div>
                      <p style={{fontSize:13,color:"var(--sub)",lineHeight:1.8,margin:0,fontFamily:"var(--fb)"}}>{r.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── RELATED ── */}
        {related.length > 0 && (
          <div style={{borderTop:"1px solid var(--line)",padding:"28px 28px 36px",background:"var(--bg)",position:"relative",zIndex:1}}>
            <div style={{marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <EyebrowBar/>
                <span style={{fontFamily:"var(--fd)",fontSize:10,fontWeight:900,letterSpacing:4,color:"var(--red)",textTransform:"uppercase"}}>You Might Also Like</span>
              </div>
              <h3 style={{fontFamily:"var(--fd)",fontSize:"clamp(22px,3vw,30px)",fontWeight:900,color:"#fff",letterSpacing:"-0.5px"}}>More From The Range</h3>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10}}>
              {related.slice(0,4).map(rp => {
                const rp_ = pp(rp.price);
                return (
                  <div key={gid(rp)} className="rcard">
                    <div style={{height:140,overflow:"hidden",background:"var(--bg2)"}}>
                      <img src={rp.image} alt={rp.name} className="sn-img" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    </div>
                    <div style={{padding:"10px 12px"}}>
                      <div style={{fontSize:9,color:"var(--muted)",textTransform:"uppercase",letterSpacing:2,marginBottom:3,fontFamily:"var(--fd)",fontWeight:900}}>{rp.category}</div>
                      <div style={{fontSize:13,fontWeight:900,color:"#fff",fontFamily:"var(--fd)",lineHeight:1.15,marginBottom:5,letterSpacing:.3}}>{rp.name}</div>
                      <div style={{fontFamily:"var(--fd)",fontWeight:900,fontSize:17,color:"var(--red)"}}>R{rp_.toFixed(2)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* bottom accent bar */}
        <div style={{height:4,background:"linear-gradient(90deg,transparent 0%,var(--red) 100%)"}}/>
      </div>
    </div>
  );
});

/* ─── PRODUCT CARD ────────────────────────────────────────────────────── */
const ProductCard = memo(({ product, onOpen, onAddToCart, idx }) => {
  const price = pp(product.price);
  const orig  = (price * 1.28).toFixed(2);
  const disc  = Math.round((1 - price / (price * 1.28)) * 100);

  const handleOpen     = useCallback(() => onOpen(product), [product, onOpen]);
  const handleQuickAdd = useCallback(e => { e.stopPropagation(); onAddToCart(product); }, [product, onAddToCart]);

  return (
    <div
      className="sn-card-wrap"
      onClick={handleOpen}
      style={{animation:`fadeUp .5s ${idx*0.06}s both ease`}}
    >
      {/* image area */}
      <div style={{position:"relative",height:280,overflow:"hidden",background:"#0A0A0A"}}>
        <img src={product.image} alt={product.name} className="sn-img"
          style={{width:"100%",height:"100%",objectFit:"cover"}}/>

        <div className="sn-card-overlay"/>
        <div className="sn-card-bar"/>

        {/* quick add — slides up on hover */}
        <button className="sn-acc sn-quick-add" onClick={handleQuickAdd}>
          <span>+ Quick Add</span>
        </button>

        {/* discount badge */}
        <div style={{
          position:"absolute",top:14,left:14,
          background:"var(--red)",color:"#fff",
          fontFamily:"var(--fd)",fontWeight:900,fontSize:11,letterSpacing:2,
          padding:"5px 12px",
          clipPath:"polygon(5px 0%,100% 0%,calc(100% - 5px) 100%,0% 100%)",
        }}>−{disc}%</div>

        {/* category label */}
        <div style={{
          position:"absolute",top:14,right:14,
          background:"rgba(0,0,0,.8)",backdropFilter:"blur(8px)",
          color:"var(--sub)",fontSize:9,fontWeight:900,
          padding:"4px 12px",letterSpacing:2.5,textTransform:"uppercase",
          fontFamily:"var(--fd)",border:"1px solid rgba(255,255,255,.05)",
        }}>
          {product.category||"Sneakers"}
        </div>

        {/* card index */}
        <div style={{
          position:"absolute",bottom:52,right:14,
          fontFamily:"var(--fd)",fontSize:10,fontWeight:900,
          letterSpacing:2,color:"rgba(255,255,255,.25)",
        }}>
          {String(idx+1).padStart(2,"0")}
        </div>
      </div>

      {/* info */}
      <div style={{padding:"16px 18px 20px",borderTop:"1px solid var(--line)"}}>
        <h3 style={{fontFamily:"var(--fd)",fontWeight:900,fontSize:20,letterSpacing:.3,color:"#fff",lineHeight:1.05,marginBottom:8}}>
          {product.name}
        </h3>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:13}}>
          <Stars r={4.8} sm/>
          <span style={{fontSize:10,color:"var(--muted)",fontWeight:900,fontFamily:"var(--fd)",letterSpacing:1}}>4.8 (124)</span>
        </div>
        <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",flexWrap:"wrap",gap:4}}>
          <div style={{display:"flex",alignItems:"baseline",gap:8}}>
            <span style={{fontFamily:"var(--fd)",fontWeight:900,fontSize:22,color:"#fff",letterSpacing:"-0.5px"}}>R{price.toFixed(2)}</span>
            <span style={{fontSize:13,color:"var(--muted)",textDecoration:"line-through"}}>R{orig}</span>
          </div>
          <span style={{fontSize:9,color:"var(--red)",fontWeight:900,fontFamily:"var(--fd)",letterSpacing:2,textTransform:"uppercase"}}>
            Save R{(price*1.28 - price).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
});

/* ─── SKELETON ────────────────────────────────────────────────────────── */
const Skel = memo(({ i }) => (
  <div style={{
    background:"var(--bg1)",overflow:"hidden",
    border:"1px solid var(--line)",
    clipPath:"polygon(0 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%)",
    animation:`shimmer 1.4s ${i*0.1}s ease infinite`,
  }}>
    <div style={{height:280,background:"var(--bg2)"}}/>
    <div style={{padding:"16px 18px 20px",borderTop:"1px solid var(--line)",display:"flex",flexDirection:"column",gap:10}}>
      <div style={{height:20,background:"var(--bg2)",width:"70%"}}/>
      <div style={{height:12,background:"var(--bg2)",width:"36%"}}/>
      <div style={{height:16,background:"var(--bg2)",width:"50%"}}/>
    </div>
  </div>
));

/* ─── MAIN ────────────────────────────────────────────────────────────── */
const Products = () => {
  const navigate = useNavigate();

  const [products,  setProducts]  = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [category,  setCategory]  = useState("all");
  const [showAll,   setShowAll]   = useState(false);
  const [selected,  setSelected]  = useState(null);
  const [toast,     setToast]     = useState("");
  const [loading,   setLoading]   = useState(true);

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
    showToast(`${product.name} added to cart`);
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

      {/* ── FIXED NAVBAR ── */}
      <div style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,background:"rgba(6,6,6,.96)",backdropFilter:"blur(20px)",borderBottom:"1px solid var(--line)"}}>
        <Navbar/>
      </div>

      {/* ── FLOATING CART ── */}
      <div style={{position:"fixed",bottom:28,right:28,zIndex:2000}}>
        <button onClick={() => navigate("/cart")} style={{
          background:"#fff",color:"#000",border:"none",
          borderRadius:"50%",width:54,height:54,fontSize:22,
          cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
          boxShadow:"0 10px 36px rgba(0,0,0,.8)",position:"relative",
          transition:"transform .2s,box-shadow .2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.transform="scale(1.14)"; e.currentTarget.style.boxShadow="0 16px 48px rgba(0,0,0,.9)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="0 10px 36px rgba(0,0,0,.8)"; }}
        >
          🛒
          {cartCount > 0 && (
            <span style={{position:"absolute",top:-6,right:-6,background:"var(--red)",color:"#fff",borderRadius:"50%",width:22,height:22,fontSize:11,fontWeight:900,border:"2px solid var(--bg)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* ── PAGE WRAPPER ── */}
      <section style={{
        maxWidth:1400,margin:"0 auto",
        padding:"clamp(88px,10vw,120px) clamp(20px,5vw,80px) 80px",
        minHeight:"100vh",position:"relative",
      }}>
        <Grain/>

        {/* ── PAGE HEADER ── */}
        <div style={{marginBottom:52,position:"relative",zIndex:1}}>

          {/* eyebrow */}
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,animation:"slideR .5s ease"}}>
            <EyebrowBar/>
            <span style={{fontFamily:"var(--fd)",fontSize:9,fontWeight:900,letterSpacing:5,color:"var(--red)",textTransform:"uppercase"}}>
              ShoeNation RSA · Official Store
            </span>
          </div>

          {/* headline + blurb row */}
          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",flexWrap:"wrap",gap:24,marginBottom:32}}>
            <div style={{position:"relative"}}>
              {/* giant bg watermark */}
              <span style={{
                position:"absolute",left:"-0.04em",top:"-0.08em",
                fontFamily:"var(--fd)",fontWeight:900,
                fontSize:"clamp(100px,18vw,220px)",
                color:"rgba(255,255,255,.02)",
                letterSpacing:"-6px",lineHeight:1,
                userSelect:"none",pointerEvents:"none",
                animation:"bgDrift 18s ease-in-out infinite alternate",
              }}>01</span>

              <h1 style={{
                fontFamily:"var(--fd)",fontWeight:900,
                fontSize:"clamp(58px,10vw,110px)",
                letterSpacing:"-2px",lineHeight:.86,color:"#fff",
                animation:"heroIn .5s cubic-bezier(.16,1,.3,1)",
                position:"relative",zIndex:1,
              }}>
                THE<br/>
                <span style={{
                  WebkitTextStroke:"2px var(--red)",color:"transparent",
                  display:"block",
                }}>DROP.</span>
              </h1>
            </div>

            <div style={{maxWidth:280,animation:"fadeUp .65s ease"}}>
              <p style={{fontSize:13,color:"var(--sub)",lineHeight:1.85,marginBottom:14,fontFamily:"var(--fb)"}}>
                Premium sneakers. SA prices. Every pair quality checked before it ships to your door.
              </p>
              <div style={{display:"flex",alignItems:"center",gap:9}}>
                <div style={{
                  width:7,height:7,borderRadius:"50%",background:"#4ADE80",
                  boxShadow:"0 0 8px #4ADE80",
                  animation:"pulse 1.8s ease-out infinite",
                }}/>
                <span style={{fontSize:10,color:"var(--sub)",fontWeight:900,fontFamily:"var(--fd)",letterSpacing:2,textTransform:"uppercase"}}>
                  {products.length > 0 ? `${products.length} styles in stock` : "Loading collection..."}
                </span>
              </div>
            </div>
          </div>

          {/* category filters + count */}
          <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",animation:"fadeUp .7s ease"}}>
            {CATS.map(cat => (
              <button key={cat} className={`sn-cat${category===cat?" on":""}`} onClick={() => handleCatChange(cat)}>
                {cat==="all" ? "All Styles" : cat.charAt(0).toUpperCase()+cat.slice(1)}
              </button>
            ))}
            {/* count */}
            <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:16,height:2,background:"var(--muted)",borderRadius:2}}/>
              <span style={{fontFamily:"var(--fd)",fontSize:10,fontWeight:900,letterSpacing:3,color:"var(--muted)",textTransform:"uppercase"}}>
                {displayed.length} Styles
              </span>
            </div>
          </div>
        </div>

        {/* ── PRODUCT GRID ── */}
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",
          gap:"clamp(10px,1.5vw,20px)",
          marginBottom:56,position:"relative",zIndex:1,
        }}>
          {loading
            ? Array(8).fill(0).map((_,i) => <Skel key={i} i={i}/>)
            : displayed.map((p,i) => (
                <ProductCard key={gid(p)} product={p} idx={i} onOpen={setSelected} onAddToCart={addToCart}/>
              ))
          }
        </div>

        {/* ── LOAD MORE ── */}
        {!showAll && !loading && displayed.length >= 8 && (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,position:"relative",zIndex:1}}>
            <button className="sn-loadmore" onClick={handleLoadAll}>
              <span>Load All {products.length} Styles</span>
            </button>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:14,height:1,background:"var(--muted)"}}/>
              <span style={{fontSize:10,color:"var(--muted)",fontFamily:"var(--fd)",fontWeight:900,letterSpacing:3,textTransform:"uppercase"}}>
                Showing {displayed.length} of {products.length}
              </span>
              <div style={{width:14,height:1,background:"var(--muted)"}}/>
            </div>
          </div>
        )}
      </section>

      {/* ── MODAL ── */}
      {selected && (
        <Modal
          product={selected}
          related={related}
          onClose={() => setSelected(null)}
          onAddToCart={addToCart}
          onBuyNow={handleBuyNow}
        />
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div style={{
          position:"fixed",bottom:28,left:"50%",
          background:"var(--bg1)",color:"#fff",
          border:"1px solid var(--line)",borderLeft:"3px solid var(--red)",
          padding:"13px 24px 13px 16px",
          fontFamily:"var(--fd)",fontWeight:900,fontSize:12,letterSpacing:2,textTransform:"uppercase",
          zIndex:9999,boxShadow:"0 16px 50px rgba(0,0,0,.85)",
          animation:"alertIn .3s cubic-bezier(.16,1,.3,1)",
          display:"flex",alignItems:"center",gap:12,whiteSpace:"nowrap",
          clipPath:"polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)",
        }}>
          <span style={{
            width:20,height:20,borderRadius:"50%",background:"var(--red)",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:11,color:"#fff",fontWeight:900,flexShrink:0,
          }}>✔</span>
          {toast}
        </div>
      )}

      <Footer/>
    </>
  );
};

export default Products;