// TYPE ONE full-set showcase: the eight Supra A90 parts turn in 3D as the visitor scrolls through
// section#range. Adapted from typeone3d/showcase.html: the part geometry is unchanged; the scene now
// lives inside the section (sticky stage), reads scroll relative to it, sleeps when off screen, and
// takes its words from the page (the captions are plain HTML, so search engines and screen readers read them).
const section = document.getElementById('range');
// reduced motion: the plain list and the still stay (nothing turns with the scroll)
if (section && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) { io.disconnect(); start().catch(fail); }
  }, { rootMargin: '150% 0px' });
  io.observe(section);
}

function fail(e) {
  console.warn('showcase:', e);
  section.classList.remove('sc--live');
  section.classList.add('sc--still');
}

async function start() {
  const THREE = await import('three');
  const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');
  const { RoundedBoxGeometry } = await import('three/addons/geometries/RoundedBoxGeometry.js');
  const V3 = THREE.Vector3;
  const BLUE = '#2c4bd0';

  const stage = section.querySelector('.sc-stage');
  const canvas = section.querySelector('.sc-gl');
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' }); }
  catch (e) { fail(e); return; }
  renderer.debug.onShaderError = () => fail(new Error('shader failed to compile'));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  function rrPath(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
  function fitText(ctx,text,font,maxW,size){ let s=size; ctx.font=font(s); while (ctx.measureText(text).width>maxW && s>8){ s-=2; ctx.font=font(s); } return s; }

  // Real TypeOne badge (from the supplied logo, cleaned to exact blue #0000FF / red #FF2526, transparent outside)
  const BADGE=new Image(); BADGE.src="/img/typeone-badge.png";
  const BADGE_READY=BADGE.decode().catch(()=>{});
  const BADGE_ASPECT=1743/417;
  function drawLogo(ctx,W,H){
    ctx.clearRect(0,0,W,H);
    let w=W, h=W/BADGE_ASPECT; if (h>H){ h=H; w=H*BADGE_ASPECT; }
    ctx.imageSmoothingQuality="high";
    ctx.drawImage(BADGE,(W-w)/2,(H-h)/2,w,h);
  }

  function seeded(str){ let h=2166136261; for (const c of str){ h^=c.charCodeAt(0); h=Math.imul(h,16777619); } return ()=>{ h^=h<<13; h^=h>>>17; h^=h<<5; return ((h>>>0)%1000)/1000; }; }
  function drawLabel(ctx,W,H,name){
    ctx.clearRect(0,0,W,H);
    rrPath(ctx,2,2,W-4,H-4,H*0.06); ctx.fillStyle='#f6f7f4'; ctx.fill();
    ctx.lineWidth=3; ctx.strokeStyle='#c9ccd2'; ctx.stroke();
    // decorative 2D code block
    const n=21, cell=Math.floor((H*0.74)/n), x0=H*0.12, y0=(H-cell*n)/2, rnd=seeded(name);
    ctx.fillStyle='#1a1a1a';
    for (let i=0;i<n;i++) for (let j=0;j<n;j++){
      const inFinder=(a,b)=>(i>=a&&i<a+7&&j>=b&&j<b+7);
      if (inFinder(0,0)||inFinder(0,n-7)||inFinder(n-7,0)) continue;
      if (rnd()>0.52) ctx.fillRect(x0+i*cell,y0+j*cell,cell,cell);
    }
    [[0,0],[0,n-7],[n-7,0]].forEach(([a,b])=>{
      ctx.fillRect(x0+a*cell,y0+b*cell,7*cell,7*cell); ctx.fillStyle='#f6f7f4';
      ctx.fillRect(x0+(a+1)*cell,y0+(b+1)*cell,5*cell,5*cell); ctx.fillStyle='#1a1a1a';
      ctx.fillRect(x0+(a+2)*cell,y0+(b+2)*cell,3*cell,3*cell);
    });
    // text block
    const tx=x0+n*cell+H*0.1, tw=W-tx-H*0.08;
    const lw=Math.min(tw*0.72,H*0.2*BADGE_ASPECT); ctx.imageSmoothingQuality='high'; ctx.drawImage(BADGE,tx,H*0.1,lw,lw/BADGE_ASPECT);
    ctx.fillStyle='#1d2433'; ctx.textBaseline='alphabetic';
    fitText(ctx,name,s=>`700 ${s}px "Instrument Sans", "Arial Narrow", sans-serif`,tw,H*0.2);
    ctx.fillText(name,tx,H*0.55);
    ctx.fillStyle='#4a5162';
    fitText(ctx,'TOYOTA SUPRA A90 · 3.0TT 2WD',s=>`600 ${s}px "Instrument Sans", "Arial Narrow", sans-serif`,tw,H*0.13);
    ctx.fillText('TOYOTA SUPRA A90 · 3.0TT 2WD',tx,H*0.72);
    fitText(ctx,'THE PROVEN STABLE BAR',s=>`${s}px Georgia, serif`,tw,H*0.1);
    ctx.fillText('THE PROVEN STABLE BAR',tx,H*0.87);
  }


  await BADGE_READY;
  await Promise.race([document.fonts.load('700 40px "Instrument Sans"'), new Promise((r) => setTimeout(r, 2500))]).catch(() => {});

  const canvasTex = (c) => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = maxAniso; return t; };
  const logoCanvas = document.createElement('canvas'); logoCanvas.width = 2048; logoCanvas.height = 490; drawLogo(logoCanvas.getContext('2d'), 2048, 490);
  const LOGO_TEX = canvasTex(logoCanvas);
  const LOGO_ASPECT = 2048 / 490;
  function labelTex(name) { const c = document.createElement('canvas'); c.width = 1536; c.height = 640; drawLabel(c.getContext('2d'), 1536, 640, name.toUpperCase()); return canvasTex(c); }
  const barMat = new THREE.MeshPhysicalMaterial({ color: BLUE, roughness: 0.34, metalness: 0.1, clearcoat: 0.75, clearcoatRoughness: 0.16, envMapIntensity: 1.0 });
  const decalMat = (tex) => new THREE.MeshStandardMaterial({ map: tex, color: 0x8c8c8c, emissiveMap: tex, emissive: 0xffffff, emissiveIntensity: 0.5, roughness: 0.6, envMapIntensity: 0.2, transparent: true, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 });

  /* ---------- geometry helpers ---------- */
  function tube(pts,r){
    const curve=new THREE.CatmullRomCurve3(pts.map(p=>new V3(p[0],p[1],p[2]||0)),false,'centripetal');
    const g=new THREE.Group();
    g.add(new THREE.Mesh(new THREE.TubeGeometry(curve,Math.max(120,pts.length*30),r,24,false),barMat));
    [0,1].forEach(t=>{ const p=curve.getPointAt(t), d=curve.getTangentAt(t).multiplyScalar(t?1:-1);
      const c=new THREE.Mesh(new THREE.SphereGeometry(r,20,12,0,Math.PI*2,0,Math.PI/2),barMat);
      c.position.copy(p); c.quaternion.setFromUnitVectors(new V3(0,1,0),d.normalize()); g.add(c); });
    g.userData.curve=curve; g.userData.r=r;
    return g;
  }
  function rr(x0,y0,x1,y1,r){
    const s=new THREE.Shape(); s.moveTo(x0+r,y0); s.lineTo(x1-r,y0); s.absarc(x1-r,y0+r,r,-Math.PI/2,0);
    s.lineTo(x1,y1-r); s.absarc(x1-r,y1-r,r,0,Math.PI/2); s.lineTo(x0+r,y1); s.absarc(x0+r,y1-r,r,Math.PI/2,Math.PI);
    s.lineTo(x0,y0+r); s.absarc(x0+r,y0+r,r,Math.PI,Math.PI*1.5); return s;
  }
  const poly = pts=>new THREE.Shape(pts.map(([x,y])=>new THREE.Vector2(x,y)));
  function plate(shape,holes=[],t=0.006){
    holes.forEach(([x,y,r])=>{ const h=new THREE.Path(); h.absarc(x,y,r,0,Math.PI*2,true); shape.holes.push(h); });
    const g=new THREE.ExtrudeGeometry(shape,{depth:t,bevelEnabled:true,bevelThickness:0.0012,bevelSize:0.0012,bevelSegments:2,curveSegments:28});
    g.translate(0,0,-t/2);
    return new THREE.Mesh(g,barMat);
  }
  const rbox=(lx,ly,lz)=>new THREE.Mesh(new RoundedBoxGeometry(lx,ly,lz,3,Math.min(lx,ly,lz)*0.22),barMat);
  function boxBetween(a,b,ly,lz){
    const dx=b[0]-a[0], dy=b[1]-a[1], L=Math.hypot(dx,dy), m=rbox(L,ly,lz);
    m.position.set((a[0]+b[0])/2,(a[1]+b[1])/2,0); m.rotation.z=Math.atan2(dy,dx); return m;
  }
  function eye(x,y,R,hole,t=0.007){ const p=plate(rr(-R,-R,R,R,R*0.999),[[0,0,hole]],t); p.position.set(x,y,0); return p; }

  const FACE = new V3(0,0.28,1).normalize();   // decals face the default camera
  // flat sticker on a +z face
  function flatDecal(tex,w,h,x,y,z,kind){
    const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),decalMat(tex));
    m.position.set(x,y,z+0.0004); m.userData={decal:kind, normal:new V3(0,0,1)}; return m;
  }
  // sticker wrapped round a tube, centred on the side facing the camera
  function wrapDecal(tex,w,h,tubeGroup,xTarget,kind){
    const curve=tubeGroup.userData.curve, r=tubeGroup.userData.r*1.035;
    let best=0,bd=1e9; for (let i=0;i<=600;i++){ const t=i/600, d=Math.abs(curve.getPointAt(t).x-xTarget); if (d<bd){bd=d;best=t;} }
    const C=curve.getPointAt(best), A=curve.getTangentAt(best).normalize(); if (A.x<0) A.negate();
    const F=FACE.clone().sub(A.clone().multiplyScalar(FACE.dot(A))).normalize(), B=new V3().crossVectors(A,F);
    const arc=Math.min(h/r, Math.PI*0.95), nS=24, nT=18, pos=[], uv=[], idx=[];
    for (let i=0;i<=nS;i++) for (let j=0;j<=nT;j++){
      const s=-w/2+w*i/nS, th=-arc/2+arc*j/nT;
      const p=C.clone().addScaledVector(A,s).addScaledVector(F,r*Math.cos(th)).addScaledVector(B,r*Math.sin(th));
      pos.push(p.x,p.y,p.z); uv.push(i/nS, 0.5-th/arc);
    }
    for (let i=0;i<nS;i++) for (let j=0;j<nT;j++){ const a=i*(nT+1)+j, b=a+nT+1; idx.push(a,a+1,b, b,a+1,b+1); }
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3)); g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2)); g.setIndex(idx); g.computeVertexNormals();
    const m=new THREE.Mesh(g,decalMat(tex)); m.userData={decal:kind, normal:F.clone(), center:C.clone().addScaledVector(F,r)};
    return m;
  }
  const logoH = w=>w/LOGO_ASPECT;

  /* ---------- builders (x = along the bar, y = up, z = toward the viewer) ---------- */
  const BUILD = {
    FSB(lbl){ const g=new THREE.Group();
      const t=tube([[-0.585,-0.044],[-0.566,-0.031],[-0.535,-0.006],[-0.45,0.021],[-0.2,0.040],[0,0.044],[0.2,0.040],[0.45,0.021],[0.535,-0.006],[0.566,-0.031],[0.585,-0.044]],0.0135);
      g.add(t);
      [1,-1].forEach(s=>{ const p=plate(rr(-0.036,-0.031,0.036,0.031,0.012),[[0,0.0125,0.0058],[0,-0.0125,0.0058]],0.005); p.rotation.x=-Math.PI/2; p.position.set(s*0.618,-0.049,0); g.add(p); });
      g.add(wrapDecal(LOGO_TEX,0.085,logoH(0.085),t,0.03,'logo'));
      g.add(wrapDecal(lbl,0.06,0.025,t,0.15,'label'));
      return g; },

    FSB2(lbl){ const g=new THREE.Group();
      [[0.048,0],[-0.048,0.014]].forEach(([y,dx])=>{ const b=new THREE.Group(); b.position.set(dx,y,0);
        b.add(rbox(0.46,0.025,0.031));
        // wide flattened end + taper
        b.add(plate(rr(-0.33,-0.021,-0.215,0.021,0.02),[[-0.305,0,0.0078]],0.006));
        b.add(plate(poly([[-0.232,-0.0125],[-0.215,-0.021],[-0.2,-0.021],[-0.2,0.021],[-0.215,0.021],[-0.232,0.0125]]),[],0.02));
        // narrow tab end
        b.add(plate(rr(0.215,-0.0135,0.315,0.0135,0.0134),[[0.293,0,0.0066]],0.006));
        b.add(flatDecal(LOGO_TEX,0.074,logoH(0.074),-0.015,0,0.0155,'logo'));
        b.add(flatDecal(lbl,0.052,0.021,0.105,0,0.0155,'label'));
        g.add(b); });
      return g; },

    RARB(lbl){ const g=new THREE.Group(), S=0.001746;
      const half=[[0,0],[100,0],[140,0],[160,2],[180,12],[200,21],[215,18],[250,-5],[285,-30],[300,-26],[312,-12],[315,-5]];
      const pts=[...half.slice(1).reverse().map(([u,h])=>[-u*S,-h*S]), ...half.map(([u,h])=>[u*S,-h*S])].filter((p,i,a)=>i===0||p[0]!==a[i-1][0]);
      const t=tube(pts,0.0105); g.add(t);
      [1,-1].forEach(s=>g.add(eye(s*315*S,5*S,0.017,0.0065)));
      g.add(wrapDecal(LOGO_TEX,0.07,logoH(0.07),t,0.03,'logo'));
      g.add(wrapDecal(lbl,0.05,0.021,t,0.14,'label'));
      return g; },

    FARB(lbl){ const g=new THREE.Group(), S=0.00195;
      const half=[[0,0],[100,0],[150,0],[182,0],[198,12],[213,22],[240,30],[265,40],[282,58],[292,80],[295,104]];
      const pts=[...half.slice(1).reverse().map(([u,h])=>[-u*S,-h*S]), ...half.map(([u,h])=>[u*S,-h*S])].filter((p,i,a)=>i===0||p[0]!==a[i-1][0]);
      const t=tube(pts,0.016); g.add(t);
      [1,-1].forEach(s=>g.add(eye(s*295*S,-104*S,0.022,0.008,0.009)));
      g.add(wrapDecal(LOGO_TEX,0.085,logoH(0.085),t,0.035,'logo'));
      g.add(wrapDecal(lbl,0.06,0.026,t,0.15,'label'));
      return g; },

    FLB(lbl){ const g=new THREE.Group();
      g.add(rbox(1.0,0.032,0.026));
      [1,-1].forEach(s=>{
        g.add(plate(rr(s>0?0.49:-0.585,-0.02,s>0?0.585:-0.49,0.02,0.019),[[s*0.56,0,0.008]],0.006));
        // legs + feet
        const a=[s*0.39,-0.012], b=[s*0.62,-0.262];
        g.add(boxBetween(a,b,0.03,0.026));
        const ang=Math.atan2(b[1]-a[1],b[0]-a[0]);
        const foot=plate(rr(-0.01,-0.022,0.07,0.022,0.021),[[0.045,0,0.0085]],0.006);
        foot.position.set(b[0],b[1],0); foot.rotation.z=ang; g.add(foot);
        // diagonal braces + gusset webs
        g.add(boxBetween([s*0.245,-0.014],[s*0.47,-0.112],0.017,0.018));
        const web=plate(poly([[s*0.30,-0.015],[s*0.41,-0.015],[s*0.44,-0.062]]),[],0.004); g.add(web);
      });
      g.add(flatDecal(LOGO_TEX,0.085,logoH(0.085),0.04,0,0.0135,'logo'));
      g.add(flatDecal(lbl,0.056,0.023,0.165,0,0.0135,'label'));
      return g; },

    RLB(lbl){ const g=new THREE.Group();
      [[1,0.075],[-1,-0.075]].forEach(([s,y])=>{ const b=new THREE.Group(); b.position.y=y;
        const X=x=>s*x;
        const t=rbox(0.47,0.03,0.032); t.position.x=X(0.02); b.add(t);
        const plt=[[-0.205,-0.016],[-0.335,-0.016],[-0.348,0.0],[-0.342,0.03],[-0.305,0.072],[-0.262,0.09],[-0.228,0.082],[-0.205,0.035]].map(([x,yy])=>[X(x),yy]);
        b.add(plate(poly(s>0?plt:plt.slice().reverse()),[[X(-0.318),0.012,0.0072],[X(-0.268),0.062,0.0072],[X(-0.238),0.03,0.0062]],0.006));
        b.add(plate(s>0?rr(0.25,-0.0145,0.335,0.0145,0.0144):rr(-0.335,-0.0145,-0.25,0.0145,0.0144),[[X(0.31),0,0.0068]],0.006));
        b.add(flatDecal(LOGO_TEX,0.08,logoH(0.08),0.02,0,0.0164,'logo'));
        b.add(flatDecal(lbl,0.056,0.022,0.14,0,0.0164,'label'));
        g.add(b); });
      return g; },

    SB(lbl){ const g=new THREE.Group();
      [[0.036,0],[-0.036,0.022]].forEach(([y,dx])=>{ const b=new THREE.Group(); b.position.set(dx,y,0);
        const t=tube([[-0.40,-0.008],[0,0],[0.335,0.007]],0.0105); b.add(t);
        const tip=plate(rr(-0.038,-0.0115,0.012,0.0115,0.0114),[[-0.022,0,0.0048]],0.005); tip.rotation.x=-Math.PI/2; tip.position.set(-0.405,-0.0085,0); b.add(tip);
        const arrow=plate(poly([[0,-0.016],[0.046,-0.016],[0.066,0],[0.046,0.016],[0,0.016]]),[[0.034,0,0.0055]],0.006);
        arrow.position.set(0.33,0.007,0); arrow.rotation.z=0.42; b.add(arrow);
        b.add(wrapDecal(LOGO_TEX,0.07,logoH(0.07),t,-0.06,'logo'));
        b.add(wrapDecal(lbl,0.05,0.021,t,0.04,'label'));
        g.add(b); });
      return g; },

    RTB(lbl){ const g=new THREE.Group();
      const t=tube([[-0.515,0],[0,0],[0.515,0]],0.0145); g.add(t);
      [1,-1].forEach(s=>{
        g.add(plate(s>0?rr(0.503,-0.058,0.566,0.017,0.012):rr(-0.566,-0.058,-0.503,0.017,0.012),[[s*0.535,-0.032,0.0078]],0.008));
        const cap=rbox(0.034,0.034,0.034); cap.position.set(s*0.512,0,0); g.add(cap);
      });
      g.add(wrapDecal(LOGO_TEX,0.09,logoH(0.09),t,0.17,'logo'));
      g.add(wrapDecal(lbl,0.064,0.027,t,0.3,'label'));
      return g; },
  };



  /* ---------- scene ---------- */
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scene = new THREE.Scene(); scene.environment = envTex;
  const CAM = new V3(0, 0.15, 6);
  const camera = new THREE.PerspectiveCamera(30, 1, 0.02, 100);
  camera.position.copy(CAM); camera.lookAt(CAM.x, CAM.y, 0);
  const key = new THREE.DirectionalLight(0xffffff, 1.35); key.position.set(2.5, 3.5, 4); scene.add(key);
  const rim = new THREE.DirectionalLight(0x7f9cff, 1.4); rim.position.set(-3, 1.5, -3); scene.add(rim);
  const fill = new THREE.DirectionalLight(0xffffff, 0.35); fill.position.set(-2, -1.5, 3); scene.add(fill);
  scene.add(new THREE.AmbientLight(0xffffff, 0.1));

  const glowTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d');
    const g = x.createRadialGradient(128, 128, 0, 128, 128, 128); g.addColorStop(0, 'rgba(70,110,255,.55)'); g.addColorStop(.5, 'rgba(44,75,208,.16)'); g.addColorStop(1, 'rgba(44,75,208,0)');
    x.fillStyle = g; x.fillRect(0, 0, 256, 256); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  glow.position.set(0, CAM.y, -2.5); scene.add(glow);

  /* ---------- parts: the page's captions name them, in order ---------- */
  const caps = [...section.querySelectorAll('.sc-cap')];
  const steps = [...section.querySelectorAll('.sc-step')];
  const rail = [...section.querySelectorAll('.sc-rail button')];
  const items = caps.map((cap, i) => {
    const keyId = cap.dataset.part;
    const part = BUILD[keyId](labelTex(cap.dataset.label));
    const box = new THREE.Box3().setFromObject(part), size = box.getSize(new V3());
    part.position.sub(box.getCenter(new V3()));
    const pivot = new THREE.Group(); pivot.add(part); pivot.updateMatrixWorld(true);
    let d = null; part.traverse((o) => { if (!d && o.userData.decal === 'logo') d = o; });
    const L = (d.userData.center ? d.userData.center.clone() : d.position.clone()).applyMatrix4(d.parent.matrixWorld);
    const n = d.userData.normal.clone().transformDirection(d.parent.matrixWorld);
    d.geometry.computeBoundingBox(); const bb = d.geometry.boundingBox;
    pivot.visible = false; scene.add(pivot);
    return { i, pivot, size, L, aL: Math.atan2(n.y, n.z), logoW: bb.max.x - bb.min.x, cap, section: steps[i], rail: rail[i] };
  });
  const introUI = section.querySelector('.sc-intro'), outroUI = section.querySelector('.sc-outro'), outroSec = section.querySelector('.sc-end');
  rail.forEach((b, i) => { b.onclick = () => scrollTo({ top: sectionTop() + steps[i].offsetTop + steps[i].offsetHeight * 0.3, behavior: reduce ? 'auto' : 'smooth' }); });
  items.forEach((it) => { it.pivot.visible = true; });
  renderer.compile(scene, camera);
  items.forEach((it) => { it.pivot.visible = false; });
  if (section.classList.contains('sc--still')) return;
  section.classList.add('sc--live');

  /* ---------- choreography (unchanged from the showcase, in section coordinates) ---------- */
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const ease = (t) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  const Q = (x, y, z) => new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, z));
  const EU = new THREE.Euler();
  function viewDims() { const tanH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)), visH = 2 * CAM.z * tanH; return { tanH, visH, visW: visH * camera.aspect }; }
  function keyframes(it, v) {
    const narrow = camera.aspect < 0.9;
    const s = Math.min((narrow ? 0.86 : 0.66) * v.visW / it.size.x, 0.42 * v.visH / Math.max(it.size.y, 0.05));
    const hero = new V3(0, CAM.y + v.visH * (narrow ? 0.16 : 0.07), 0);
    const R = Q(it.aL, 0, 0);
    const dL = Math.max(0.3, (it.logoW * s) / (0.5 * 2 * v.tanH * camera.aspect));
    const logoAt = new V3(0, CAM.y + (narrow ? 0.03 : 0.0), CAM.z - dL).sub(it.L.clone().multiplyScalar(s).applyQuaternion(R));
    return [
      { t: -0.22, pos: new V3(v.visW * 0.95, -v.visH * 0.28, -3.6), q: Q(0.75, -1.65, 0.7), s },
      { t: 0.14, pos: hero, q: Q(0.24, -0.55, 0.05), s },
      { t: 0.38, pos: hero, q: Q(0.22, 0.42, -0.03), s },
      { t: 0.52, pos: logoAt, q: R, s },
      { t: 0.64, pos: logoAt.clone().add(new V3(-it.logoW * s * 0.12, 0, 0)), q: Q(it.aL, 0.05, 0), s },
      { t: 0.80, pos: hero, q: Q(0.2, 0.72, 0.02), s },
      { t: 1.12, pos: new V3(-v.visW * 0.78, v.visH * 0.32, CAM.z * 0.55), q: Q(-0.5, 1.75, -0.6), s },
    ];
  }
  function sample(kf, t, out) {
    if (t <= kf[0].t || t >= kf[kf.length - 1].t) return false;
    let k = 0; while (t > kf[k + 1].t) k++;
    const a = kf[k], b = kf[k + 1], u = ease((t - a.t) / (b.t - a.t));
    out.position.lerpVectors(a.pos, b.pos, u); out.quaternion.slerpQuaternions(a.q, b.q, u); out.scale.setScalar(a.s + (b.s - a.s) * u);
    return true;
  }
  function slot(it, v, now) {
    const narrow = camera.aspect < 0.9, col = it.i % 2, row = Math.floor(it.i / 2);
    const cw = v.visW * (narrow ? 0.37 : 0.33);
    const s = Math.min(cw / it.size.x, v.visH * 0.11 / Math.max(it.size.y, 0.05));
    const pos = new V3((col ? 1 : -1) * v.visW * (narrow ? 0.225 : 0.19), CAM.y + v.visH * (0.36 - row * 0.15), 0);
    return { pos, q: Q(0.32, reduce ? 0 : 0.22 * Math.sin(now / 1700 + it.i * 0.8), 0), s };
  }
  const sectionTop = () => section.getBoundingClientRect().top + scrollY;
  let ySm = scrollY - sectionTop(), lastActive = -2, dirty = true, last = 0, top0 = sectionTop();
  addEventListener('resize', () => { top0 = sectionTop(); });
  let V = null;
  function rebuild() { V = viewDims(); items.forEach((it) => { it.kf = keyframes(it, V); it.st = it.i === items.length - 1 ? it.kf[it.kf.length - 1] : { pos: new V3((it.i % 2 ? 1 : -1) * V.visW * 0.9, (it.i < 4 ? 1 : -1) * V.visH * 0.7, -4), q: Q(1, (it.i % 2 ? -1 : 1) * 1.4, 0.6) }; it.sl = slot(it, V, 0); it.slq = new THREE.Quaternion(); }); }
  const setStyle = (el, k, val) => { if (el['_' + k] !== val) { el['_' + k] = val; el.style[k] = val; } };
  function update(now, y) {
    const vh = stage.clientHeight, v = V;
    const io_ = 1 - clamp(y / (vh * 0.55));
    setStyle(introUI, 'opacity', io_.toFixed(3));
    setStyle(introUI, 'transform', io_ > 0 ? `translate3d(0,${(-Math.max(0, y) * 0.25).toFixed(1)}px,0)` : 'none');
    const lastSec = items[items.length - 1].section, h8 = lastSec.offsetHeight;
    const o = clamp((y - (outroSec.offsetTop + 0.12 * h8)) / Math.max(1, outroSec.offsetHeight - vh - 0.12 * h8));
    const oo = sstep(0.45, 0.75, o);
    setStyle(outroUI, 'opacity', oo.toFixed(3));
    setStyle(outroUI, 'visibility', oo > 0.01 ? 'visible' : 'hidden');
    setStyle(outroUI, 'pointerEvents', o > 0.5 ? 'auto' : 'none');
    let active = -1, glowTarget = null, glowAmt = 0;
    items.forEach((it) => {
      const sec = it.section, t = (y - sec.offsetTop) / sec.offsetHeight;
      const kf = it.kf;
      let vis = false;
      if (o > 0) {
        const sl = it.sl, u = ease(clamp((o - it.i * 0.045) / 0.42)), start = it.st, s0 = start.s ?? sl.s;
        it.slq.setFromEuler(EU.set(0.32, reduce ? 0 : 0.22 * Math.sin(now / 1700 + it.i * 0.8), 0));
        it.pivot.position.lerpVectors(start.pos, sl.pos, u); it.pivot.quaternion.slerpQuaternions(start.q, it.slq, u); it.pivot.scale.setScalar(s0 + (sl.s - s0) * u);
        vis = u > 0 || it.i === items.length - 1;
      } else {
        vis = sample(kf, t, it.pivot);
      }
      it.pivot.visible = vis;
      const f = o > 0 ? 0 : sstep(0.06, 0.17, t) * (1 - sstep(0.8, 0.9, t));
      setStyle(it.cap, 'opacity', f.toFixed(3));
      setStyle(it.cap, 'transform', f > 0.999 ? 'none' : `translate3d(0,${((1 - f) * 24).toFixed(1)}px,0)`);
      setStyle(it.cap, 'visibility', f > 0.01 ? 'visible' : 'hidden');
      if (t >= 0 && t < 1 && o <= 0) active = it.i;
      if (vis && o <= 0) { const w = sstep(-0.1, 0.15, t) * (1 - sstep(0.85, 1.05, t)); if (w > glowAmt) { glowAmt = w; glowTarget = it.pivot.position; } }
    });
    if (active !== lastActive) { items.forEach((it, i) => { it.rail.classList.toggle('on', i === active); it.rail.toggleAttribute('aria-current', i === active); }); lastActive = active; }
    glow.material.opacity = o > 0 ? 0.7 * o : glowAmt;
    if (glowTarget) glow.position.set(glowTarget.x * 0.5, glowTarget.y, -2.5); else if (o > 0) glow.position.set(0, CAM.y + v.visH * 0.12, -2.5);
    glow.scale.setScalar(v.visW * 0.75);
  }

  function applySize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    // cap the drawn pixels near 2.6 million (a 1440x900 screen at 1.4x): the clearcoat shader is the cost
    const pr = Math.max(1, Math.min(devicePixelRatio, 1.5, Math.sqrt(2.6e6 / (w * h))));
    renderer.setPixelRatio(pr); renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    rebuild(); dirty = true;
  }
  new ResizeObserver(() => { top0 = sectionTop(); applySize(); }).observe(stage); applySize();

  /* draw only while the section is on screen */
  const loop = (now) => {
    if (!section.classList.contains('sc--live')) { renderer.setAnimationLoop(null); return; }
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016); last = now;
    const y = scrollY - (top0 = sectionTop());
    const moving = Math.abs(y - ySm) >= 0.5;
    ySm = moving ? ySm + (y - ySm) * (1 - Math.exp(-dt * 9)) : y;
    const inOutro = ySm > outroSec.offsetTop;   // the finished set sways gently
    if (!moving && !dirty && !inOutro) return;   // nothing changed: skip the frame
    dirty = false;
    update(now, ySm);
    renderer.render(scene, camera);
  };
  new IntersectionObserver((e) => renderer.setAnimationLoop(e[0].isIntersecting ? loop : null)).observe(section);
}
