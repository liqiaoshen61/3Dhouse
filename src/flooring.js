import * as THREE from 'three';

// Procedural, offline textures. UV coordinates use metres so adjoining slabs align.
function canvasMaterial(draw,size=1024,roughness=.94){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=size;
  const ctx=canvas.getContext('2d');draw(ctx,size);
  const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;
  map.wrapS=map.wrapT=THREE.RepeatWrapping;map.anisotropy=8;
  return new THREE.MeshStandardMaterial({map,roughness,metalness:0});
}
const seed=(a,b)=>{const n=Math.sin(a*127.1+b*311.7)*43758.5453;return n-Math.floor(n)};
function plank(c,x,y,w,h,index){
  const tone=Math.floor(seed(index,4)*17);c.fillStyle=`rgb(${168+tone},${147+tone},${122+tone})`;c.fillRect(x+.8,y+.8,w-1.6,h-1.6);
  c.save();c.beginPath();c.rect(x+2,y+2,w-4,h-4);c.clip();
  for(let j=0;j<18;j++){const yy=y+seed(index,j+2)*h;c.strokeStyle=`rgba(91,68,45,${.035+seed(j,index)*.045})`;c.lineWidth=.5+seed(index,j)*1.1;c.beginPath();c.moveTo(x,yy);c.bezierCurveTo(x+w*.3,yy+3,x+w*.7,yy-3,x+w,yy+1);c.stroke()}c.restore();
}
const tile=canvasMaterial((c,n)=>{c.fillStyle='#a5a39a';c.fillRect(0,0,n,n);c.fillStyle='#d6d3cb';c.fillRect(3,3,n-6,n-6);for(let i=0;i<18000;i++){const x=seed(i,1)*n,y=seed(i,2)*n;c.fillStyle=i%2?'rgba(255,255,255,.045)':'rgba(86,82,75,.025)';c.fillRect(x,y,1.5,1.5)}},1024,.98);
const straight=canvasMaterial((c,n)=>{c.fillStyle='#9f8e79';c.fillRect(0,0,n,n);for(let row=0;row<4;row++)for(let col=-1;col<3;col++)plank(c,col*n/2+(row%2)*n/4,row*n/4,n/2,n/4,row*11+col+5)});
const herringbone=canvasMaterial((c,n)=>{
  c.fillStyle='#9c8a73';c.fillRect(0,0,n,n);const unit=n/8,length=4;
  for(let y=-8;y<16;y++)for(let x=-8;x<16;x++){
    const mod=((x-y)%8+8)%8,idx=((x%8+8)%8)+((y%8+8)%8)*8;
    if(mod===0)plank(c,x*unit,y*unit,unit*length,unit,idx);
    if(mod===7){c.save();c.translate((x+1)*unit,y*unit);c.rotate(Math.PI/2);plank(c,0,0,unit*length,unit,idx);c.restore()}
  }
});
export function floorFinish(group,x,z,w,d,type){
  const geometry=new THREE.PlaneGeometry(w,d);geometry.rotateX(-Math.PI/2);
  const pos=geometry.attributes.position,uv=geometry.attributes.uv;
  for(let i=0;i<pos.count;i++){
    const xx=x+pos.getX(i),zz=z+pos.getZ(i);
    if(type==='herringbone')uv.setXY(i,(xx-zz)/Math.SQRT2/1.28,(xx+zz)/Math.SQRT2/1.28);
    else if(type==='tile')uv.setXY(i,xx/1.2,zz/1.2);
    else uv.setXY(i,xx/2.4,zz/.96);
  }
  const mesh=new THREE.Mesh(geometry,({tile,straight,herringbone})[type]);mesh.position.set(x,.032,z);mesh.receiveShadow=true;mesh.name='floor-'+type;group.add(mesh);
}
