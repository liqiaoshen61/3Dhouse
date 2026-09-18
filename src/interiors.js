import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

const geometryCache=new Map();
export function softBox(g,x,y,z,w,h,d,material,rotation=0){
  const radius=Math.min(.055,w*.15,h*.3,d*.15),key=[w,h,d,radius].join(',');
  if(!geometryCache.has(key))geometryCache.set(key,new RoundedBoxGeometry(w,h,d,2,radius));
  const mesh=new THREE.Mesh(geometryCache.get(key),material);mesh.position.set(x,y,z);mesh.rotation.y=rotation;mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);return mesh;
}

export function furnish({floors,box,cyl,sphere,mat,C}){
  const [f,u]=floors;
  const soft=(g,x,y,z,w,h,d,c,r=0)=>softBox(g,x,y,z,w,h,d,mat(c),r);
  const brass='#8b8070',ink='#5b615f',paper='#f0eeea',clay='#918176';
  function rug(g,x,z,w,d){
    const canvas=document.createElement('canvas');canvas.width=256;canvas.height=256;const c=canvas.getContext('2d');c.fillStyle='#cec9c1';c.fillRect(0,0,256,256);
    for(let i=0;i<256;i+=3){c.fillStyle=i%2?'#d8d3cc':'#c3beb7';c.fillRect(i,0,1,256);c.fillRect(0,i,256,1)}
    c.strokeStyle='#aaa49b';c.lineWidth=2;c.strokeRect(14,14,228,228);c.strokeRect(21,21,214,214);
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;
    const m=new THREE.MeshStandardMaterial({map:texture,roughness:1});softBox(g,x,.078,z,w,.025,d,m);
    for(let i=-w/2+.04;i<w/2;i+=.085)for(const edge of [-1,1])box(g,x+i,.072,z+edge*(d/2+.04),.018,.008,.085,'#c9c4ba');
  }
  function book(g,x,y,z,w=.19,d=.27,color=ink,rotation=0){const q=new THREE.Group();q.position.set(x,y,z);q.rotation.y=rotation;g.add(q);box(q,0,.018,0,w,.03,d,paper);box(q,0,0,0,w+.012,.008,d+.012,color);box(q,0,.037,0,w+.012,.008,d+.012,color);box(q,-w/2,.02,0,.012,.04,d,color)}
  function mug(g,x,y,z,color=paper){cyl(g,x,y+.044,z,.044,.085,color);cyl(g,x,y+.089,z,.034,.002,'#5b4733');const handle=new THREE.Mesh(new THREE.TorusGeometry(.035,.009,6,12),mat(color));handle.position.set(x+.047,y+.045,z);g.add(handle)}
  function vase(g,x,y,z,s=.8){cyl(g,x,y+.1*s,z,.075*s,.2*s,'#b3a69a',.05*s);for(let i=0;i<3;i++){const stalk=box(g,x+(i-1)*.025*s,y+.29*s,z,.008*s,.27*s,.008*s,ink);stalk.rotation.z=(i-1)*.17;sphere(g,x+(i-1)*.04*s,y+.42*s,z,.045*s,['#ccab81','#d7c2a0','#bd9171'][i],[1,.75,1])}}
  function lamp(g,x,y,z,scale=1){cyl(g,x,y+.025*scale,z,.12*scale,.05*scale,brass);cyl(g,x,y+.17*scale,z,.018*scale,.3*scale,brass);cyl(g,x,y+.36*scale,z,.17*scale,.2*scale,paper,.11*scale);cyl(g,x,y+.263*scale,z,.145*scale,.012*scale,'#fff2c2')}
  function picture(g,x,y,z,w,h){box(g,x,y,z,w,h,.045,C.wood);box(g,x,y,z+.026,w-.06,h-.06,.008,paper);const circle=new THREE.Mesh(new THREE.CircleGeometry(w*.18,24),mat('#b58b68'));circle.position.set(x-w*.13,y+h*.12,z+.032);g.add(circle);box(g,x+w*.12,y-h*.17,z+.034,w*.29,h*.27,.005,'#87947c');box(g,x-w*.13,y-h*.2,z+.035,w*.22,h*.13,.005,'#c1b095')}

  // Living room: woven rug, soft cushions, folded throw, books and reading lamp.
  rug(f,10.25,5.04,2.82,2.56);
  for(const [x,c,r] of [[9.19,'#938579',-.12],[10.06,'#f0eeea',.1],[10.94,'#676e6b',-.12]]){const p=soft(f,x,.8,6.32,.42,.4,.15,c,r);p.rotation.x=-.18}
  soft(f,10.92,.663,6.04,.38,.018,.69,'#aba197');soft(f,10.92,.44,5.71,.38,.42,.025,'#aba197');
  for(let i=0;i<7;i++)box(f,10.75+i*.054,.226,5.7,.012,.065,.014,paper);
  book(f,9.99,.437,4.78,.23,.29,ink,.16);mug(f,10.47,.409,4.64);cyl(f,11.82,.025,6.5,.16,.05,brass);cyl(f,11.82,.69,6.5,.018,1.33,brass);cyl(f,11.82,1.42,6.5,.23,.29,paper,.17);
  cyl(f,11.98,.48,5,.24,.055,C.lightwood);cyl(f,11.98,.24,5,.026,.48,brass);book(f,11.98,.51,5,.17,.23,clay,-.15);
  // Dining: linen runner, ceramics and an understated dried-flower arrangement.
  soft(f,6.55,.812,5.75,.26,.01,1.55,'#b7b4ab');
  for(const z of [5.27,6.17]){cyl(f,6.66,.818,z,.16,.019,paper);cyl(f,6.66,.831,z,.12,.009,'#dcdad3');box(f,6.91,.818,z,.018,.012,.24,brass);mug(f,6.38,.81,z+.12)}vase(f,6.55,.815,5.75,.75);
  mug(f,5.02,.993,5.32);book(f,5.04,.993,6.12,.24,.32,clay,.12);
  // Kitchen: front panels, plinths, handles, backsplash and countertop objects.
  box(f,1.42,.12,3.425,2.52,.1,.025,'#737873');
  for(let x=.45;x<2.5;x+=.47){box(f,x,.47,3.424,.009,.66,.012,'#737873');box(f,x+.2,.72,3.453,.18,.019,.026,brass)}
  for(const z of [3.5,3.98,4.46]){box(f,.634,.47,z,.012,.66,.009,'#737873');box(f,.651,.72,z-.19,.026,.018,.17,brass)}
  box(f,1.35,1.12,2.962,2.25,.33,.023,'#e7e6e1');for(let x=.26;x<2.4;x+=.25)box(f,x,1.12,2.979,.008,.33,.005,'#cdcfcb');box(f,1.35,1.12,2.982,2.23,.009,.006,'#cdcfcb');
  soft(f,.8,.958,3.17,.35,.027,.24,C.wood,.12);box(f,.85,.98,3.19,.18,.008,.025,'#d1d6cf',-.2);cyl(f,2.03,1.023,3.11,.073,.16,paper);for(let i=0;i<3;i++)box(f,2.01+i*.023,1.16,3.11,.015,.2,.015,C.wood);
  cyl(f,.99,1.0,3.19,.085,.12,clay);cyl(f,.99,1.063,3.19,.056,.006,'#547459');
  box(f,2.62,1.23,3.571,.56,.012,.007,'#8e9f95');box(f,2.86,1.48,3.592,.024,.34,.026,brass);box(f,2.86,.9,3.592,.024,.23,.026,brass);
  // Bedroom furniture is retained; add bedside lighting and restrained linen details.
  for(const [g,x,z,w,reverse] of [[f,10.5,1.35,1.5,false],[u,10.55,1.26,1.8,false]]){
    const q=new THREE.Group();q.position.set(x,0,z);q.rotation.y=reverse?Math.PI:0;g.add(q);
    rug(q,0,.18,w+.6,2.32);
    for(let side of [-1,1]){lamp(q,side*(w/2+.35),.53,-.75,.75);box(q,side*(w/2+.35),.31,-.493,.4,.012,.012,'#625244');box(q,side*(w/2+.35),.29,-.472,.12,.018,.025,brass)}
    for(let j=-2;j<=2;j++)soft(q,j*w*.14,.685,.37,.014,.008,.73,'#a4a59e');
    book(q,w/2+.35,.54,-.68,.13,.18,clay,.12);
  }
  // Children's room: former headboard wall is the drawing's bottom wall (z=6.67).
  // Low open shelving faces into the room, leaving the centre clear for play.
  const nursery=new THREE.Group();nursery.name='儿童房-矮书架与玩具架';u.add(nursery);
  function lowShelf(x,width){
    const z=6.31,depth=.4,height=.72;
    box(nursery,x,height/2,z+depth/2-.018,width,height,.035,C.lightwood);
    for(const edge of [-1,1])soft(nursery,x+edge*(width/2-.022),height/2,z,.044,height,depth,C.lightwood);
    for(const yy of [.045,.365,.705])soft(nursery,x,yy,z,width,.035,depth,C.lightwood);
    for(const offset of [-width/6,width/6])box(nursery,x+offset,.36,z,.026,.65,depth,C.lightwood);
    // Light inset cubbies, open towards negative z.
    for(let tier=0;tier<2;tier++)for(let bay=0;bay<3;bay++){
      const cx=x-width/2+(bay+.5)*width/3,cy=.2+tier*.32;
      box(nursery,cx,cy,z+.177,width/3-.055,.265,.016,'#f0eeea');
      box(nursery,cx,cy-.14,z-.065,width/3-.045,.025,.34,C.lightwood);
    }
    return {x,width};
  }
  lowShelf(10.52,1.05);lowShelf(11.67,1.05);
  for(let bay=0;bay<3;bay++)for(let i=0;i<3;i++){
    const x=10.52-.525+(bay+.5)*.35+(i-1)*.078,h=.16+(i%2)*.04;
    box(nursery,x,.073+h/2,6.15,.06,h,.14,[ink,paper,'#ad967e'][i]);
    box(nursery,x,.18,6.07,.035,.012,.006,paper);
  }
  for(let i=0;i<3;i++){
    const x=10.17+i*.35;
    box(nursery,x,.48,6.135,.24,.19,.026,[paper,'#a2afa5','#b6a391'][i]);
    sphere(nursery,x,.49,6.115,.045,ink,[1,1,.08]);
  }
  for(let i=0;i<3;i++){
    const x=11.32+i*.35;
    soft(nursery,x,.165,6.12,.27,.18,.23,['#b6b5aa','#a9b5ad','#c5b5a4'][i]);
    box(nursery,x,.195,5.998,.075,.027,.008,'#6c716c');
  }
  for(let i=0;i<5;i++)box(nursery,11.29+(i%2)*.085,.44+Math.floor(i/2)*.055,6.13,.07,.055,.075,[paper,'#bca387',ink][i%3]);
  sphere(nursery,11.7,.49,6.14,.09,'#b8a18b');sphere(nursery,11.7,.6,6.14,.065,'#b8a18b');
  for(let x of [11.655,11.745])sphere(nursery,x,.646,6.14,.025,'#b8a18b');
  soft(nursery,12.03,.436,6.12,.2,.065,.11,ink);for(let x of [11.97,12.09]){const wheel=cyl(nursery,x,.41,6.058,.032,.022,'#696b66');wheel.rotation.x=Math.PI/2;}
  // Study: desktop objects and a low bookcase in the existing study footprint.
  for(const x of [1.8,2.55]){box(u,x,.842,1.53,.24,.016,.09,'#d0d5cb');for(let i=0;i<5;i++)box(u,x-.08+i*.04,.852,1.53,.015,.004,.055,'#89978d');mug(u,x+.19,.81,1.62)}
  lamp(u,2.16,.81,.77,.65);book(u,1.81,.83,1.81,.2,.26,clay,-.13);
  box(u,3.76,.45,.98,1.1,.85,.32,C.lightwood);for(let y of [.15,.43,.72]){box(u,3.76,y,.98,1.02,.035,.34,C.wood);for(let i=0;i<8;i++){let h=.14+(i%3)*.035;box(u,3.31+i*.12,y+h/2+.025,1.06,.075,h,.17,[ink,clay,paper,'#9da188'][i%4])}}
  picture(u,4.8,1.45,1.05,.37,.42);vase(u,4.82,1.21,1.79,.7);
  // Entry and bathroom accessories stay on surfaces rather than in circulation paths.
  vase(f,3.67,.96,3.18,.8);book(f,4.35,.96,3.19,.23,.3,paper,.12);
  for(const [g,x,z] of [[f,6.99,1.45],[u,5.96,.36]]){cyl(g,x+.24,1.026,z,.033,.13,'#b6bab1');box(g,x+.24,1.106,z,.054,.018,.024,brass);soft(g,x-.22,.994,z,.12,.035,.23,paper)}
  for(let i=0;i<3;i++)soft(f,7.03,.925+i*.035,2.59,.36,.033,.25,['#e6dbc9','#a6aaa4','#e6dbc9'][i]);
}
