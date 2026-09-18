import * as THREE from 'three';

// Freestanding white powder-coated metal frames, open on every side.
export function openWardrobe(parent,x,z,w,d,h,{box,mat}){
  const group=new THREE.Group();group.name='白色开放金属衣柜';group.position.set(x,0,z);parent.add(group);
  const width=Math.max(w,d),depth=Math.min(w,d);if(d>w)group.rotation.y=Math.PI/2;
  const metal=new THREE.MeshStandardMaterial({color:'#f2f3ef',metalness:.42,roughness:.44});
  const railMaterial=new THREE.MeshStandardMaterial({color:'#dfe2df',metalness:.65,roughness:.32});
  const bar=(x,y,z,ww,hh,dd)=>box(group,x,y,z,ww,hh,dd,metal);
  const left=-width/2+.025,right=width/2-.025,back=-depth/2+.025,front=depth/2-.025,divide=width*.17;
  for(const xx of [left,divide,right])for(const zz of [back,front])bar(xx,h/2,zz,.028,h,.028);
  for(const yy of [.12,h-.055]){bar(0,yy,back,width,.026,.026);bar(0,yy,front,width,.026,.026);for(const xx of [left,divide,right])bar(xx,yy,0,.026,.026,depth)}
  // Thin metal shelves, no door fronts or solid back panels.
  bar(0,.14,0,width-.03,.025,depth-.025);bar(0,h-.055,0,width-.03,.025,depth-.025);
  const shelfWidth=right-divide,centre=(right+divide)/2;
  for(const yy of [.56,.99,1.42])bar(centre,yy,0,shelfWidth-.025,.022,depth-.025);
  const hangLength=divide-left-.08,hangCentre=(left+divide)/2;
  const rod=new THREE.Mesh(new THREE.CylinderGeometry(.014,.014,hangLength,10),railMaterial);rod.rotation.z=Math.PI/2;rod.position.set(hangCentre,h-.3,0);group.add(rod);
  for(const xx of [left+.04,divide-.04])bar(xx,h-.2,0,.017,.2,.017);
  // A few garments make the open storage legible without filling the frame.
  for(let i=0;i<5;i++){
    const xx=left+.15+i*(hangLength-.18)/4,top=h-.4;
    const points=[new THREE.Vector3(xx-.075,top-.055,0),new THREE.Vector3(xx,top,0),new THREE.Vector3(xx+.075,top-.055,0),new THREE.Vector3(xx-.075,top-.055,0)];
    const hanger=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:'#b3afa5'}));group.add(hanger);
    const color=['#e7e3d9','#a6ada9','#c2b7aa','#faf8f0','#7e8984'][i];
    box(group,xx,top-.34,0,.095,.55,depth*.52,mat(color));
  }
  for(let level=0;level<3;level++)for(let fold=0;fold<2;fold++)box(group,centre,[.56,.99,1.42][level]+.04+fold*.05,.01,shelfWidth*.7,.045,depth*.65,mat(fold?'#e3dfd6':'#aab4ab'));
  return group;
}
