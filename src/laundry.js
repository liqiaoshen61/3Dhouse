import * as THREE from 'three';
import {softBox} from './interiors.js';

// Local front faces +Z. Both appliances share a footprint and stacking tray.
export function stackedLaundry(parent,x,z,rotation,{box,mat}){
  const group=new THREE.Group();group.name='叠放洗衣机与烘干机';group.position.set(x,0,z);group.rotation.y=rotation;parent.add(group);
  const white=mat('#23282b',.6),dark=mat('#111517',.5),rim=mat('#b9bfbc',.28);
  for(let i=0;i<2;i++){
    const base=.035+i*.87;
    softBox(group,0,base+.415,0,.6,.83,.64,white);
    box(group,0,base+.739,.327,.55,.11,.012,white);
    box(group,.15,base+.75,.338,.16,.045,.01,dark);
    const knob=new THREE.Mesh(new THREE.CylinderGeometry(.026,.026,.021,20),rim);knob.rotation.x=Math.PI/2;knob.position.set(-.055,base+.752,.345);group.add(knob);
    box(group,-.185,base+.745,.343,.125,.035,.013,mat('#dce0db'));
    const ring=new THREE.Mesh(new THREE.TorusGeometry(.19,.026,8,32),rim);ring.position.set(0,base+.382,.345);group.add(ring);
    const glass=new THREE.Mesh(new THREE.CircleGeometry(.166,32),dark);glass.position.set(0,base+.382,.35);group.add(glass);
    const drum=new THREE.Mesh(new THREE.CircleGeometry(.132,24),mat(i?'#758285':'#64797f',.35));drum.position.set(0,base+.382,.353);group.add(drum);
    box(group,.148,base+.39,.371,.023,.085,.027,white);
    box(group,-.005,base+.13,.337,.21,.02,.009,mat('#c5ccc6'));
  }
  box(group,0,.878,0,.624,.035,.66,mat('#d7dcd6'));
  return group;
}
