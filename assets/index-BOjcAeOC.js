import{A as e,C as t,D as n,E as r,F as i,I as a,M as o,N as s,O as c,P as l,S as u,T as d,_ as f,a as p,b as m,c as h,d as g,f as _,g as ee,h as te,i as ne,j as re,k as ie,l as ae,m as oe,n as se,o as ce,p as le,r as ue,s as de,t as fe,u as pe,v as me,w as he,x as ge,y as _e}from"./three-DhlKdBDn.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var v={width:3.6,depth:3.6,height:3.6},y=4,ve=y*2;function ye(e){let t=xe(e);return{vertices:t.vertices.map(e=>e.clone()),quadFaces:t.quadFaces.map(([e,t,n,r])=>[e,t,n,r])}}function be(){let e=Ce(),t=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]],n=new Float32Array(t.length*2*3);for(let r=0;r<t.length;r+=1){let[i,a]=t[r],o=e[i],s=e[a],c=r*6;n[c+0]=o.x,n[c+1]=o.y,n[c+2]=o.z,n[c+3]=s.x,n[c+4]=s.y,n[c+5]=s.z}let r=new h;return r.setAttribute(`position`,new de(n,3)),r.computeBoundingSphere(),r}function xe(e){let t=Te(e.t0),n=Te(e.t1),r=Te(e.t2),i=Te(e.t3),a=Ce(),o=[],s=[],c=[],l=[],u=[],d=new Map,f=Array(y).fill(0),p=we(y-1);for(let e=0;e<=y-1;e+=1){let r=p[e],i=p[e+1],s=r+y,c=i+y,l=Ee([a[r],a[i],a[s],a[c]]);if(f[r]===0&&(f[r]=e<2?1:2),e<2){let e=b(o,x(l,a[i],n[i]));d.set(S(r,i,0),e),d.set(S(i,r,0),e);let u=b(o,x(l,a[s],n[s]));d.set(S(c,s,0),u),d.set(S(s,c,0),u);let f=b(o,x(a[r],a[i],t[r]));d.set(S(r,i,1),f),d.set(S(i,r,1),f);let p=b(o,x(a[c],a[s],t[c]));d.set(S(c,s,1),p),d.set(S(s,c,1),p)}else{let e=b(o,x(l,a[r],n[r]));d.set(S(r,i,0),e),d.set(S(i,r,0),e);let u=b(o,x(l,a[c],n[c]));d.set(S(c,s,0),u),d.set(S(s,c,0),u);let f=b(o,x(a[i],a[r],t[i]));d.set(S(r,i,1),f),d.set(S(i,r,1),f);let p=b(o,x(a[s],a[c],t[s]));d.set(S(c,s,1),p),d.set(S(s,c,1),p)}}for(let e=0;e<y;e+=1)f[e]===1?c.push(x(a[e],a[e+y],t[e])):c.push(x(a[e+y],a[e],t[e+y]));let m=Ee(a.slice(0,y)),h=Ee(a.slice(y,ve)),g=Ee([m,h]),_=i.slice(0,y).reduce((e,t)=>e+t,0)/y,ee=i.slice(y,ve).reduce((e,t)=>e+t,0)/y;s.push(x(h,m,_/2)),s.push(x(m,h,ee/2)),s.push(g.clone());let te=we(y-1);for(let e=1;e<=y;e+=1){let t=te[e],o=te[e+1],s=Ee([a[t],a[o],a[o+y],a[t+y]]),c=(i[t]+i[o]+i[o+y]+i[t+y])/4;l.push(x(s,g,c)),t%2?e>2?u.push(x(a[t],g,r[t])):u.push(x(a[t+y],g,r[t+y])):(u.push(x(a[t],m,n[t])),u.push(x(a[t+y],h,n[t+y])))}let ne=o.length,re=ne+s.length,ie=re+c.length,ae=Se(d,te,{faceBase:ne,verticalBase:re,sideBase:ie,detailBase:ie+l.length}),oe=[...o,...s,...c,...l,...u],se=Oe(ae);if(oe.length!==33||ae.length!==24||se.length!==144)throw Error(`Unexpected batwing topology: ${oe.length} vertices, ${ae.length} quads, ${se.length} indices.`);return{vertices:oe,indices:se,quadFaces:ae}}function Se(e,t,n){let r=[],i=[0,1,2,3],a=n.faceBase,o=n.faceBase+1,s=n.faceBase+2,c=e=>n.verticalBase+e,l=e=>n.sideBase+e,u=e=>n.detailBase+e;for(let n=1;n<=y;n+=1){let d=i[t[n]],f=i[t[n+1]],p=De(e,d,f,0),m=De(e,d+y,f+y,0),h=De(e,d,f,1),g=De(e,d+y,f+y,1),_=l(t[n]);n<3?n%2?(r.push([_,p,c(i[t[2]]),u(2)]),r.push([p,_,s,h]),r.push([m,_,u(2),g]),r.push([_,m,c(i[t[1]]),s]),r.push([o,u(0),h,s]),r.push([a,u(1),g,u(2)])):(r.push([p,_,u(2),c(i[t[2]])]),r.push([_,p,h,s]),r.push([_,m,g,u(2)]),r.push([m,_,s,c(i[t[3]])]),r.push([u(3),o,s,h]),r.push([u(4),a,u(2),g])):n%2?(r.push([p,_,u(5),h]),r.push([_,p,c(i[t[n]]),s]),r.push([m,c(i[t[0]]),u(5),_]),r.push([m,_,s,g]),r.push([a,u(4),g,s]),r.push([o,u(3),h,u(5)])):(r.push([_,p,h,u(5)]),r.push([p,_,s,c(i[t[n+1]])]),r.push([c(i[t[0]]),m,_,u(5)]),r.push([_,m,g,s]),r.push([u(1),a,s,g]),r.push([u(0),o,u(5),h]))}return r}function Ce(){let e=v.width/2,t=v.depth/2,n=v.height/2,r=n,i=-n;return[new a(-e,r,-t),new a(e,r,-t),new a(e,r,t),new a(-e,r,t),new a(-e,i,-t),new a(e,i,-t),new a(e,i,t),new a(-e,i,t)]}function we(e){let t=Array.from({length:e+1},(e,t)=>t);return t.push(0),t.unshift(e),t}function Te(e){let t=m.clamp(e,0,1);return Array.from({length:ve},()=>t)}function b(e,t){let n=e.length;return e.push(t),n}function x(e,t,n){return e.clone().lerp(t,m.clamp(n,0,1))}function Ee(e){let t=new a;for(let n of e)t.add(n);return t.multiplyScalar(1/e.length)}function S(e,t,n){return`${e},${t},${n}`}function De(e,t,n,r){let i=S(t,n,r),a=e.get(i);if(a===void 0)throw Error(`Missing batwing edge point ${i}.`);return a}function Oe(e){let t=[];for(let[n,r,i,a]of e)t.push(n,r,i,n,i,a);return t}function ke(e,t){let n=e,r=m.clamp(Math.round(t),0,3);for(let e=0;e<r;e+=1)n=Ae(n);return n}function Ae(e){let t=e.quadFaces.map(t=>Re(t.map(t=>e.vertices[t]))),n=[],r=new Map,i=Array.from({length:e.vertices.length},()=>[]),a=Array.from({length:e.vertices.length},()=>[]);for(let t=0;t<e.quadFaces.length;t+=1){let[o,s,c,l]=e.quadFaces[t],u=new Set([o,s,c,l]);for(let e of u)i[e]?.push(t);Fe(n,r,a,o,s,t),Fe(n,r,a,s,c,t),Fe(n,r,a,c,l,t),Fe(n,r,a,l,o,t)}let o=e.vertices.map((r,o)=>je(r,o,e.vertices,t,n,i,a)),s=n.map(n=>{let r=o.length;return o.push(Me(n,e.vertices,t)),r}),c=t.map(e=>{let t=o.length;return o.push(e.clone()),t}),l=[];for(let t=0;t<e.quadFaces.length;t+=1){let[n,i,a,o]=e.quadFaces[t],u=c[t],d=Ie(r,s,n,i),f=Ie(r,s,i,a),p=Ie(r,s,a,o),m=Ie(r,s,o,n);l.push([n,d,u,m]),l.push([i,f,u,d]),l.push([a,p,u,f]),l.push([o,m,u,p])}return{vertices:o,quadFaces:l}}function je(e,t,n,r,i,a,o){let s=a[t]??[],c=o[t]??[];if(s.length===0||c.length===0)return e.clone();let l=Pe(t,i,c);if(l.length>0){let t=e.clone().multiplyScalar(6);for(let e of l)t.add(n[e]);return t.multiplyScalar(1/(6+l.length))}let u=Re(s.map(e=>r[e])),d=Re(c.map(e=>Ne(i[e],n))),f=s.length;return u.add(d.multiplyScalar(2)).add(e.clone().multiplyScalar(f-3)).multiplyScalar(1/f)}function Me(e,t,n){return e.faces.length===2?Re([t[e.a],t[e.b],n[e.faces[0]],n[e.faces[1]]]):e.faces.length>2?Re([t[e.a],t[e.b],...e.faces.map(e=>n[e])]):Ne(e,t)}function Ne(e,t){return t[e.a].clone().add(t[e.b]).multiplyScalar(.5)}function Pe(e,t,n){let r=new Set;for(let i of n){let n=t[i];if(n.faces.length!==1)continue;let a=n.a===e?n.b:n.a;a!==e&&r.add(a)}return[...r]}function Fe(e,t,n,r,i,a){let o=Le(r,i),s=t.get(o);s===void 0&&(s=e.length,t.set(o,s),e.push({a:Math.min(r,i),b:Math.max(r,i),faces:[]}),n[r]?.push(s),r!==i&&n[i]?.push(s));let c=e[s];c.faces.includes(a)||c.faces.push(a)}function Ie(e,t,n,r){let i=e.get(Le(n,r));if(i===void 0)throw Error(`Missing Catmull-Clark edge ${n},${r}.`);return t[i]}function Le(e,t){return`${Math.min(e,t)},${Math.max(e,t)}`}function Re(e){if(e.length===0)return new a;let t=new a;for(let n of e)t.add(n);return t.multiplyScalar(1/e.length)}var ze=`
varying vec3 localPosition;
varying vec4 worldPosition;

uniform vec3 worldCamProjPosition;
uniform vec3 worldPlanePosition;
uniform float fadeDistance;
uniform bool infiniteGrid;
uniform bool followCamera;

void main() {
  localPosition = position.xzy;
  if (infiniteGrid) {
    localPosition *= 1.0 + fadeDistance;
  }

  worldPosition = modelMatrix * vec4(localPosition, 1.0);
  if (followCamera) {
    worldPosition.xyz += (worldCamProjPosition - worldPlanePosition);
    localPosition = (inverse(modelMatrix) * worldPosition).xyz;
  }

  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`,Be=`
varying vec3 localPosition;
varying vec4 worldPosition;

uniform vec3 worldCamProjPosition;
uniform float cellSize;
uniform float sectionSize;
uniform vec3 cellColor;
uniform vec3 sectionColor;
uniform float fadeDistance;
uniform float fadeStrength;
uniform float fadeFrom;
uniform float cellThickness;
uniform float sectionThickness;
uniform float opacity;

float getGrid(float size, float thickness) {
  vec2 r = localPosition.xz / size;
  vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
  float line = min(grid.x, grid.y) + 1.0 - thickness;
  return 1.0 - min(line, 1.0);
}

void main() {
  float g1 = getGrid(cellSize, cellThickness);
  float g2 = getGrid(sectionSize, sectionThickness);

  vec3 from = worldCamProjPosition * vec3(fadeFrom);
  float dist = distance(from, worldPosition.xyz);
  float d = 1.0 - min(dist / fadeDistance, 1.0);
  vec3 color = mix(cellColor, sectionColor, min(1.0, sectionThickness * g2));

  gl_FragColor = vec4(color, (g1 + g2) * pow(d, fadeStrength) * opacity);
  gl_FragColor.a = mix(0.75 * gl_FragColor.a, gl_FragColor.a, g2);
  if (gl_FragColor.a <= 0.0) {
    discard;
  }

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`,Ve=class{mesh;plane=new n;up=new a(0,1,0);origin=new a(0,0,0);constructor(e={}){let t=new c(e.width??200,e.height??200),n=new s({transparent:!0,side:1,depthWrite:!1,uniforms:{cellSize:{value:e.cellSize??1},sectionSize:{value:e.sectionSize??5},fadeDistance:{value:e.fadeDistance??140},fadeStrength:{value:e.fadeStrength??1.2},fadeFrom:{value:e.fadeFrom??1},cellThickness:{value:e.cellThickness??.6},sectionThickness:{value:e.sectionThickness??1.2},opacity:{value:e.opacity??1},cellColor:{value:new pe(e.cellColor??`#8b9095`)},sectionColor:{value:new pe(e.sectionColor??`#5e6368`)},infiniteGrid:{value:e.infiniteGrid??!0},followCamera:{value:e.followCamera??!1},worldCamProjPosition:{value:new a},worldPlanePosition:{value:new a}},vertexShader:ze,fragmentShader:Be});n.alphaToCoverage=!0,this.mesh=new ge(t,n),this.mesh.frustumCulled=!1,this.mesh.position.y=e.y??.001,this.mesh.renderOrder=-50}update(e){this.mesh.updateWorldMatrix(!0,!1),this.plane.setFromNormalAndCoplanarPoint(this.up,this.origin).applyMatrix4(this.mesh.matrixWorld);let t=this.mesh.material.uniforms;this.plane.projectPoint(e.position,t.worldCamProjPosition.value),t.worldPlanePosition.value.copy(this.origin).applyMatrix4(this.mesh.matrixWorld)}dispose(){this.mesh.geometry.dispose(),this.mesh.material.dispose()}};document.title=`260428_BatwingGyroid`;var He=`260428_BatwingGyroid`,Ue=100,We=20,Ge=1,Ke=3,qe=20,Je=1e-5,Ye=.0825,Xe=4,Ze=new pe(13697279),Qe=new pe(16742912),$e=16766074,et=4894421,tt=1e-4,nt=.4,rt=2/3,it={X:16753057,Y:11135393,Z:10470911},at={t0:.5,t1:.5,t2:.5,t3:.5},C={lengthCount:1,widthCount:1,heightCount:1,thickness:0,subdivisions:0},ot={lengthDivisions:1,widthDivisions:1,heightDivisions:1},w={color:15857151,metalness:.72,roughness:.34,clearcoat:1,clearcoatRoughness:.2,envMapIntensity:1.32,iridescence:.72,iridescenceIOR:1.22,iridescenceThicknessRange:[140,460],reflectivity:1,specularIntensity:.88,sheen:.1,sheenRoughness:.5,sheenColor:15199999,eggIridescence:1.05,eggIridescenceFrequency:1.25},st={color:12768754,metalness:.04,roughness:.86,clearcoat:0,clearcoatRoughness:0,envMapIntensity:0,iridescence:.18,iridescenceIOR:1.22,iridescenceThicknessRange:[140,460],reflectivity:.18,specularIntensity:.22,sheen:0,sheenRoughness:1,sheenColor:16777215,eggIridescence:.42,eggIridescenceFrequency:1.1},ct={magenta:3.2,cyan:4.1,amber:3.6},lt=document.querySelector(`#app`)??(()=>{throw Error(`App root was not found.`)})();lt.innerHTML=`
  <div class="app-shell">
    <canvas class="viewport" aria-label="Batwing mesh viewport"></canvas>
    <div id="lattice-marquee" class="lattice-marquee" hidden></div>
    <section id="ui-panel" class="apple-panel" aria-label="Batwing mesh controls">
      <div id="ui-handle" class="panel-drag-handle">
        <button
          id="collapseToggle"
          class="collapse-button panel-collapse-toggle"
          type="button"
          aria-label="Collapse controls"
          aria-expanded="true"
        >
          <span class="collapse-icon" aria-hidden="true"></span>
        </button>
      </div>
      <div class="ui-body panel-sections">
        <div class="control-hint">Wheel = Zoom, MMB = Pan, RMB = Orbit</div>
        <section class="panel-section">
          <button class="panel-section-header" type="button" aria-expanded="true">
            <span class="panel-section-label">Batwing</span>
          </button>
          <div class="panel-section-content panel-controls-stack">
            <label class="control" for="t0Slider">
              <div class="control-row">
                <span>Vert Positions 1</span>
                <input id="t0-value" class="value-pill value-input" type="number" inputmode="decimal" min="0.01" max="0.99" step="0.01" value="0.50" />
              </div>
              <input id="t0Slider" type="range" min="0.01" max="0.99" value="0.50" step="0.01" />
            </label>
            <label class="control" for="t1Slider">
              <div class="control-row">
                <span>Vert Positions 2</span>
                <input id="t1-value" class="value-pill value-input" type="number" inputmode="decimal" min="0.01" max="0.99" step="0.01" value="0.50" />
              </div>
              <input id="t1Slider" type="range" min="0.01" max="0.99" value="0.50" step="0.01" />
            </label>
            <label class="control" for="t2Slider">
              <div class="control-row">
                <span>Vert Positions 3</span>
                <input id="t2-value" class="value-pill value-input" type="number" inputmode="decimal" min="0.01" max="0.99" step="0.01" value="0.50" />
              </div>
              <input id="t2Slider" type="range" min="0.01" max="0.99" value="0.50" step="0.01" />
            </label>
            <label class="control" for="t3Slider">
              <div class="control-row">
                <span>Vert Positions 4</span>
                <input id="t3-value" class="value-pill value-input" type="number" inputmode="decimal" min="0.01" max="0.99" step="0.01" value="0.50" />
              </div>
              <input id="t3Slider" type="range" min="0.01" max="0.99" value="0.50" step="0.01" />
            </label>
            <label class="control" for="thicknessSlider">
              <div class="control-row">
                <span>Thickness</span>
                <input id="thickness-value" class="value-pill value-input" type="number" inputmode="decimal" min="0" max="1" step="0.01" value="0.00" />
              </div>
              <input id="thicknessSlider" type="range" min="0" max="1" value="0" step="0.01" />
            </label>
            <label class="control" for="subdivisionsSlider">
              <div class="control-row">
                <span>Subdivisions</span>
                <input id="subdivisions-value" class="value-pill value-input" type="number" inputmode="numeric" min="0" max="3" step="1" value="0" />
              </div>
              <input id="subdivisionsSlider" type="range" min="0" max="3" value="0" step="1" />
            </label>
          </div>
        </section>
        <section class="panel-section">
          <button class="panel-section-header" type="button" aria-expanded="true">
            <span class="panel-section-label">Array</span>
          </button>
          <div class="panel-section-content panel-controls-stack">
            <label class="control" for="lengthCountSlider">
              <div class="control-row">
                <span>Length Count</span>
                <input id="length-count-value" class="value-pill value-input" type="number" inputmode="numeric" min="1" max="20" step="1" value="1" />
              </div>
              <input id="lengthCountSlider" type="range" min="1" max="20" value="1" step="1" />
            </label>
            <label class="control" for="widthCountSlider">
              <div class="control-row">
                <span>Width Count</span>
                <input id="width-count-value" class="value-pill value-input" type="number" inputmode="numeric" min="1" max="20" step="1" value="1" />
              </div>
              <input id="widthCountSlider" type="range" min="1" max="20" value="1" step="1" />
            </label>
            <label class="control" for="heightCountSlider">
              <div class="control-row">
                <span>Height Count</span>
                <input id="height-count-value" class="value-pill value-input" type="number" inputmode="numeric" min="1" max="20" step="1" value="1" />
              </div>
              <input id="heightCountSlider" type="range" min="1" max="20" value="1" step="1" />
            </label>
          </div>
        </section>
        <section class="panel-section">
          <button class="panel-section-header" type="button" aria-expanded="true">
            <span class="panel-section-label">Lattice</span>
          </button>
          <div class="panel-section-content panel-controls-stack">
            <label class="control" for="lengthDivisionSlider">
              <div class="control-row">
                <span>Length Division</span>
                <input id="length-division-value" class="value-pill value-input" type="number" inputmode="numeric" min="1" max="20" step="1" value="1" />
              </div>
              <input id="lengthDivisionSlider" type="range" min="1" max="20" value="1" step="1" />
            </label>
            <label class="control" for="widthDivisionSlider">
              <div class="control-row">
                <span>Width Division</span>
                <input id="width-division-value" class="value-pill value-input" type="number" inputmode="numeric" min="1" max="20" step="1" value="1" />
              </div>
              <input id="widthDivisionSlider" type="range" min="1" max="20" value="1" step="1" />
            </label>
            <label class="control" for="heightDivisionSlider">
              <div class="control-row">
                <span>Height Division</span>
                <input id="height-division-value" class="value-pill value-input" type="number" inputmode="numeric" min="1" max="20" step="1" value="1" />
              </div>
              <input id="heightDivisionSlider" type="range" min="1" max="20" value="1" step="1" />
            </label>
            <div class="control">
              <button id="latticeResetButton" class="pill-button control-button-wide" type="button">Reset</button>
            </div>
          </div>
        </section>
        <section class="panel-section">
          <button class="panel-section-header" type="button" aria-expanded="true">
            <span class="panel-section-label">Display</span>
          </button>
          <div class="panel-section-content panel-controls-stack">
            <label class="toggle-control" for="baseGridToggle">
              <span>Base Grid</span>
              <input id="baseGridToggle" type="checkbox" checked />
            </label>
            <label class="toggle-control" for="boxGuideToggle">
              <span>Bounding Boxes</span>
              <input id="boxGuideToggle" type="checkbox" />
            </label>
            <label class="toggle-control" for="latticeControlsToggle">
              <span>Lattice Controls</span>
              <input id="latticeControlsToggle" type="checkbox" checked />
            </label>
            <label class="toggle-control" for="wireToggle">
              <span>Mesh Wires</span>
              <input id="wireToggle" type="checkbox" checked />
            </label>
            <label class="toggle-control" for="reflectionToggle">
              <span>Foil Material</span>
              <input id="reflectionToggle" type="checkbox" checked />
            </label>
            <label class="toggle-control" for="backFacesToggle">
              <span>Back Faces</span>
              <input id="backFacesToggle" type="checkbox" />
            </label>
          </div>
        </section>
        <section class="panel-section">
          <button class="panel-section-header" type="button" aria-expanded="true">
            <span class="panel-section-label">Export</span>
          </button>
          <div class="panel-section-content panel-controls-stack">
            <div class="control">
              <button id="exportObjButton" class="pill-button control-button-wide" type="button">Export OBJ</button>
            </div>
            <div class="control">
              <button id="exportGlbButton" class="pill-button control-button-wide" type="button">Export GLB</button>
            </div>
            <div class="control">
              <button id="exportScreenshotButton" class="pill-button control-button-wide" type="button">Export Screenshot</button>
            </div>
          </div>
        </section>
      </div>
      <div id="ui-handle-bottom"></div>
    </section>
  </div>
`;function T(e){let t=lt.querySelector(e);if(!t)throw Error(`Missing UI element: ${e}`);return t}function ut(e,t,n,r,i,a,o,s){for(let c of[-t,0,t])e.save(),e.shadowColor=o,e.shadowBlur=s,e.fillStyle=o,e.fillRect(n+c-i/2,r-a/2,i,a),e.restore()}function dt(e){let t=new ne(e),n=document.createElement(`canvas`);n.width=1024,n.height=512;let r=n.getContext(`2d`);if(!r)throw Error(`Could not create environment canvas context.`);let i=n.width,a=n.height,o=r.createLinearGradient(0,0,0,a);o.addColorStop(0,`#05070d`),o.addColorStop(.2,`#111827`),o.addColorStop(.46,`#22324d`),o.addColorStop(.7,`#0a0d14`),o.addColorStop(1,`#020306`),r.fillStyle=o,r.fillRect(0,0,i,a),ut(r,i,i*.52,a*.18,i*.54,a*.08,`rgba(255,255,255,0.92)`,36),ut(r,i,i*.18,a*.54,i*.1,a*.72,`rgba(113,215,255,0.72)`,42),ut(r,i,i*.84,a*.48,i*.12,a*.66,`rgba(255,205,115,0.62)`,42),ut(r,i,i*.5,a*.82,i*.42,a*.1,`rgba(110,140,210,0.38)`,30),r.fillStyle=`rgba(0,0,0,0.38)`,r.fillRect(i*.44,0,i*.12,a),r.fillStyle=`rgba(255,255,255,0.18)`,r.fillRect(i*.02,a*.35,i*.96,a*.018),r.fillRect(i*.02,a*.67,i*.96,a*.012);let s=new ae(n);s.colorSpace=re,s.mapping=303;let c=t.fromEquirectangular(s);return s.dispose(),t.dispose(),c}var E=T(`.viewport`),D=T(`#lattice-marquee`),ft=T(`#ui-panel`),pt=T(`#ui-handle`),mt=T(`#collapseToggle`),ht=T(`#latticeResetButton`),gt=T(`#exportObjButton`),_t=T(`#exportGlbButton`),vt=T(`#exportScreenshotButton`),yt=T(`#baseGridToggle`),bt=T(`#wireToggle`),xt=T(`#reflectionToggle`),St=T(`#boxGuideToggle`),Ct=T(`#latticeControlsToggle`),wt=T(`#backFacesToggle`),Tt=[{key:`t0`,fallback:at.t0,slider:T(`#t0Slider`),valueInput:T(`#t0-value`)},{key:`t1`,fallback:at.t1,slider:T(`#t1Slider`),valueInput:T(`#t1-value`)},{key:`t2`,fallback:at.t2,slider:T(`#t2Slider`),valueInput:T(`#t2-value`)},{key:`t3`,fallback:at.t3,slider:T(`#t3Slider`),valueInput:T(`#t3-value`)}],Et=[{key:`lengthCount`,fallback:C.lengthCount,min:1,max:We,integer:!0,slider:T(`#lengthCountSlider`),valueInput:T(`#length-count-value`)},{key:`widthCount`,fallback:C.widthCount,min:1,max:We,integer:!0,slider:T(`#widthCountSlider`),valueInput:T(`#width-count-value`)},{key:`heightCount`,fallback:C.heightCount,min:1,max:We,integer:!0,slider:T(`#heightCountSlider`),valueInput:T(`#height-count-value`)},{key:`thickness`,fallback:C.thickness,min:0,max:Ge,integer:!1,slider:T(`#thicknessSlider`),valueInput:T(`#thickness-value`)},{key:`subdivisions`,fallback:C.subdivisions,min:0,max:Ke,integer:!0,slider:T(`#subdivisionsSlider`),valueInput:T(`#subdivisions-value`)}],Dt=[{key:`lengthDivisions`,fallback:ot.lengthDivisions,min:1,max:qe,slider:T(`#lengthDivisionSlider`),valueInput:T(`#length-division-value`)},{key:`widthDivisions`,fallback:ot.widthDivisions,min:1,max:qe,slider:T(`#widthDivisionSlider`),valueInput:T(`#width-division-value`)},{key:`heightDivisions`,fallback:ot.heightDivisions,min:1,max:qe,slider:T(`#heightDivisionSlider`),valueInput:T(`#height-division-value`)}],O=new p({canvas:E,antialias:!0,powerPreference:`high-performance`,preserveDrawingBuffer:!0});O.outputColorSpace=re,O.toneMapping=4,O.toneMappingExposure=1.04,O.shadowMap.enabled=!0,O.shadowMap.type=2;var k=new o;k.background=new pe(0);var Ot=dt(O);k.environment=Ot.texture;var A=new r(42,1,.1,200);A.position.set(6.4,4.8,6.4);var kt=new Ve({width:200,height:200,sectionSize:5,sectionThickness:1.02,cellSize:1,cellThickness:.46,cellColor:`#656b71`,sectionColor:`#52585f`,fadeDistance:140,fadeStrength:1.35,infiniteGrid:!0,followCamera:!0,y:-v.height/2-.002,opacity:.9});kt.mesh.visible=yt.checked,k.add(kt.mesh);var j=new ue(A,O.domElement);j.enableDamping=!0,j.target.set(0,0,0),j.minDistance=3,j.maxDistance=1/0,j.maxPolarAngle=Math.PI-.01,j.mouseButtons.LEFT=-1,j.mouseButtons.MIDDLE=_e.PAN,j.mouseButtons.RIGHT=_e.ROTATE;var At=null,M=null,N=null,P=null,F=null,jt=null,Mt=null,Nt=!1,Pt=!1,Ft=null,I=new Set,It=new e,Lt=new i,Rt=new a,L=new d,R=new d;R.visible=!1,k.add(R);var zt=[Qn(`translate`,.75),Qn(`rotate`,.375),Qn(`scale`,.315)],Bt=zt.map(({control:e})=>e),Vt=zt.map(({helper:e})=>e);zt.forEach(({control:e,helper:t})=>{e.attach(R),t.visible=!1});var Ht=new te(14674431,1119517,.34);k.add(Ht);var z=new g(16777215,4.2);z.position.set(-8,13,7),z.target.position.set(0,0,0),k.add(z.target),z.castShadow=!1,z.shadow.mapSize.set(4096,4096),z.shadow.bias=-8e-5,z.shadow.normalBias=.024,z.shadow.radius=5,z.shadow.camera.near=.5,z.shadow.camera.far=120,z.shadow.camera.left=-18,z.shadow.camera.right=18,z.shadow.camera.top=18,z.shadow.camera.bottom=-18,k.add(z);var Ut=new g(10467551,.22);Ut.position.set(9,5,-10),k.add(Ut);var Wt=new g(9422847,.82);Wt.position.set(7,4,-9),k.add(Wt);var Gt=new ie(16731336,ct.magenta,30,2);Gt.position.set(-7.5,4.5,4.8),k.add(Gt);var Kt=new ie(5236479,ct.cyan,28,2);Kt.position.set(6.5,2.4,7.5),k.add(Kt);var qt=new ie(16762967,ct.amber,28,2);qt.position.set(7.8,5.2,-4.8),k.add(qt);var B={strength:w.eggIridescence,frequency:w.eggIridescenceFrequency,backFacesEnabled:wt.checked,uniforms:null},Jt=new t({color:w.color,metalness:w.metalness,roughness:w.roughness,clearcoat:w.clearcoat,clearcoatRoughness:w.clearcoatRoughness,envMapIntensity:w.envMapIntensity,iridescence:w.iridescence,iridescenceIOR:w.iridescenceIOR,iridescenceThicknessRange:w.iridescenceThicknessRange,reflectivity:w.reflectivity,specularIntensity:w.specularIntensity,sheen:w.sheen,sheenRoughness:w.sheenRoughness,sheenColor:new pe(w.sheenColor),side:2,polygonOffset:!0,polygonOffsetFactor:1,polygonOffsetUnits:1});Ai(Jt,B);var Yt=Yn(at,C),V=new ge(Yt.meshGeometry,Jt);V.castShadow=!1,V.receiveShadow=!1,V.frustumCulled=!1,k.add(V);var H=new me(Yt.wireGeometry,new f({color:3625068,transparent:!0,opacity:.46,depthWrite:!1,toneMapped:!1}));H.visible=bt.checked,H.frustumCulled=!1,H.renderOrder=3,k.add(H);var U=new me(Di(C),new f({color:et,transparent:!0,opacity:.5,depthWrite:!1,toneMapped:!1}));U.visible=St.checked,U.renderOrder=2,k.add(U),fr(),Un();var Xt={obj:0,glb:0,png:0},Zt={x:0,y:0},Qt=!1,$t=0,en=null,tn=!1,nn=[],rn=[];lt.addEventListener(`contextmenu`,e=>{e.preventDefault()},{capture:!0});function an(e,t){let n=Number.parseFloat(e.value);return Number.isFinite(n)?n:t}function on(e){return cn(e,an(e.slider,e.fallback))}function sn(e){return ln(e,an(e.slider,e.fallback))}function cn(e,t){let n=mn(W(Number.isFinite(t)?t:e.fallback,e.min,e.max),e.slider);return W(e.integer?Math.round(n):n,e.min,e.max)}function ln(e,t){let n=mn(W(Number.isFinite(t)?t:e.fallback,e.min,e.max),e.slider);return Math.round(W(n,e.min,e.max))}function un(e,t){return e.integer?`${Math.round(t)}`:hn(t)}function dn(e){return`${Math.round(e)}`}function W(e,t,n){return Math.min(Math.max(e,t),n)}function fn(e){if(e.step===`any`)return null;let t=Number.parseFloat(e.step);return Number.isFinite(t)&&t>0?t:null}function pn(e){if(!Number.isFinite(e))return 0;let t=e.toString().toLowerCase();if(t.includes(`e-`)){let[,e]=t.split(`e-`),n=Number.parseInt(e??`0`,10);return(t.split(`.`)[1]?.split(`e`)[0]??``).length+n}return t.split(`.`)[1]?.length??0}function mn(e,t){let n=Number.parseFloat(t.min),r=Number.parseFloat(t.max),i=e;Number.isFinite(n)&&Number.isFinite(r)&&(i=W(i,n,r));let a=fn(t);if(a===null)return i;let o=Number.isFinite(n)?n:0,s=Math.round((i-o)/a)*a+o,c=pn(a);return Number.parseFloat(s.toFixed(c))}function hn(e){return e.toFixed(2)}function G(e){let t=Number.parseFloat(e.min),n=Number.parseFloat(e.max),r=Number.parseFloat(e.value),i=Number.isFinite(t)&&Number.isFinite(n)&&Number.isFinite(r)&&n!==t?(r-t)/(n-t)*100:0;e.style.setProperty(`--range-progress`,`${W(i,0,100)}%`)}function gn(){return Tt.reduce((e,t)=>(e[t.key]=an(t.slider,t.fallback),e),{...at})}function _n(){return Et.reduce((e,t)=>(e[t.key]=on(t),e),{...C})}function vn(){return Dt.reduce((e,t)=>(e[t.key]=sn(t),e),{...ot})}function yn(e){return{t0:e.t0,t1:e.t1,t2:e.t2,t3:e.t3}}function bn(e){return{lengthCount:e.lengthCount,widthCount:e.widthCount,heightCount:e.heightCount,thickness:e.thickness,subdivisions:e.subdivisions}}function xn(e){return{lengthDivisions:e.lengthDivisions,widthDivisions:e.widthDivisions,heightDivisions:e.heightDivisions}}function Sn(){if(!M)return null;let e=[];for(let t of M.points)e.push(t.position.x,t.position.y,t.position.z);return e}function Cn(e,t){if(e===t)return!0;if(!e||!t||e.length!==t.length)return!1;for(let n=0;n<e.length;n+=1)if(Math.abs(e[n]-t[n])>1e-8)return!1;return!0}function wn(e){return{settings:yn(e.settings),arraySettings:bn(e.arraySettings),latticeSettings:xn(e.latticeSettings),latticePointPositions:e.latticePointPositions?[...e.latticePointPositions]:null,showBaseGrid:e.showBaseGrid,showWireframe:e.showWireframe,reflectionsEnabled:e.reflectionsEnabled,showBoxGuide:e.showBoxGuide,showLatticeControls:e.showLatticeControls,showBackFaces:e.showBackFaces}}function K(){return{settings:gn(),arraySettings:_n(),latticeSettings:vn(),latticePointPositions:Sn(),showBaseGrid:yt.checked,showWireframe:bt.checked,reflectionsEnabled:xt.checked,showBoxGuide:St.checked,showLatticeControls:Ct.checked,showBackFaces:wt.checked}}function Tn(e,t){return e.settings.t0===t.settings.t0&&e.settings.t1===t.settings.t1&&e.settings.t2===t.settings.t2&&e.settings.t3===t.settings.t3&&e.arraySettings.lengthCount===t.arraySettings.lengthCount&&e.arraySettings.widthCount===t.arraySettings.widthCount&&e.arraySettings.heightCount===t.arraySettings.heightCount&&e.arraySettings.thickness===t.arraySettings.thickness&&e.arraySettings.subdivisions===t.arraySettings.subdivisions&&e.latticeSettings.lengthDivisions===t.latticeSettings.lengthDivisions&&e.latticeSettings.widthDivisions===t.latticeSettings.widthDivisions&&e.latticeSettings.heightDivisions===t.latticeSettings.heightDivisions&&Cn(e.latticePointPositions,t.latticePointPositions)&&e.showBaseGrid===t.showBaseGrid&&e.showWireframe===t.showWireframe&&e.reflectionsEnabled===t.reflectionsEnabled&&e.showBoxGuide===t.showBoxGuide&&e.showLatticeControls===t.showLatticeControls&&e.showBackFaces===t.showBackFaces}function En(e){nn.push(wn(e)),nn.length>Ue&&nn.shift()}function q(e){tn||Tn(e,K())||(En(e),rn.length=0)}function J(){tn||en||(en=K())}function Y(){en&&=(q(en),null)}function Dn(){en=null}function On(e){tn=!0,jn(e.settings),Mn(e.arraySettings),Nn(e.latticeSettings),Pn(e.latticePointPositions),yt.checked=e.showBaseGrid,kt.mesh.visible=e.showBaseGrid,bt.checked=e.showWireframe,H.visible=e.showWireframe,xt.checked=e.reflectionsEnabled,Oi(e.reflectionsEnabled?w:st),St.checked=e.showBoxGuide,U.visible=e.showBoxGuide,Ct.checked=e.showLatticeControls,jr(),wt.checked=e.showBackFaces,ki(e.showBackFaces),tn=!1}function kn(){Y();let e=nn.pop();e&&(rn.push(K()),On(e))}function An(){Y();let e=rn.pop();e&&(En(K()),On(e))}function jn(e){for(let t of Tt){let n=mn(e[t.key],t.slider);t.slider.value=`${n}`,t.valueInput.value=hn(n),G(t.slider)}X()}function Mn(e){for(let t of Et){let n=cn(t,e[t.key]);t.slider.value=`${n}`,t.valueInput.value=un(t,n),G(t.slider)}X()}function Nn(e){for(let t of Dt){let n=ln(t,e[t.key]);t.slider.value=`${n}`,t.valueInput.value=dn(n),G(t.slider)}X()}function Pn(e){if(!(!M||!e||e.length!==M.points.length*3)){for(let t=0;t<M.points.length;t+=1)M.points[t].position.set(e[t*3+0],e[t*3+1],e[t*3+2]);Q(),Hn()}}function Fn(){if(M){for(let e of M.points)e.position.copy(e.restPosition);Q(),Hn()}}function In(e){let t=Number.parseFloat(e.valueInput.value),n=mn(Number.isFinite(t)?t:e.fallback,e.slider);e.slider.value=`${n}`,e.valueInput.value=hn(n),G(e.slider),X()}function Ln(e){let t=cn(e,Number.parseFloat(e.valueInput.value));e.slider.value=`${t}`,e.valueInput.value=un(e,t),G(e.slider),X()}function Rn(e){let t=ln(e,Number.parseFloat(e.valueInput.value));e.slider.value=`${t}`,e.valueInput.value=dn(t),G(e.slider),X()}function zn(e){e.slider.addEventListener(`pointerdown`,J),e.slider.addEventListener(`pointerup`,Y),e.slider.addEventListener(`pointercancel`,Y),e.slider.addEventListener(`keydown`,e=>{[`ArrowLeft`,`ArrowRight`,`ArrowUp`,`ArrowDown`,`Home`,`End`,`PageUp`,`PageDown`].includes(e.key)&&J()}),e.slider.addEventListener(`input`,()=>{J();let t=an(e.slider,e.fallback);e.valueInput.value=hn(t),G(e.slider),X()}),e.slider.addEventListener(`change`,Y),e.valueInput.addEventListener(`focus`,J),e.valueInput.addEventListener(`change`,()=>{In(e),Y()}),e.valueInput.addEventListener(`blur`,()=>{In(e),Y()}),e.valueInput.addEventListener(`keydown`,t=>{t.key===`Enter`&&(t.preventDefault(),In(e),Y(),e.valueInput.blur()),t.key===`Escape`&&(t.preventDefault(),e.valueInput.value=hn(an(e.slider,e.fallback)),Dn(),e.valueInput.blur())})}function Bn(e){e.slider.addEventListener(`pointerdown`,J),e.slider.addEventListener(`pointerup`,Y),e.slider.addEventListener(`pointercancel`,Y),e.slider.addEventListener(`keydown`,e=>{[`ArrowLeft`,`ArrowRight`,`ArrowUp`,`ArrowDown`,`Home`,`End`,`PageUp`,`PageDown`].includes(e.key)&&J()}),e.slider.addEventListener(`input`,()=>{J();let t=on(e);e.slider.value=`${t}`,e.valueInput.value=un(e,t),G(e.slider),X()}),e.slider.addEventListener(`change`,Y),e.valueInput.addEventListener(`focus`,J),e.valueInput.addEventListener(`change`,()=>{Ln(e),Y()}),e.valueInput.addEventListener(`blur`,()=>{Ln(e),Y()}),e.valueInput.addEventListener(`keydown`,t=>{t.key===`Enter`&&(t.preventDefault(),Ln(e),Y(),e.valueInput.blur()),t.key===`Escape`&&(t.preventDefault(),e.valueInput.value=un(e,on(e)),Dn(),e.valueInput.blur())})}function Vn(e){e.slider.addEventListener(`pointerdown`,J),e.slider.addEventListener(`pointerup`,Y),e.slider.addEventListener(`pointercancel`,Y),e.slider.addEventListener(`keydown`,e=>{[`ArrowLeft`,`ArrowRight`,`ArrowUp`,`ArrowDown`,`Home`,`End`,`PageUp`,`PageDown`].includes(e.key)&&J()}),e.slider.addEventListener(`input`,()=>{J();let t=sn(e);e.slider.value=`${t}`,e.valueInput.value=dn(t),G(e.slider),X()}),e.slider.addEventListener(`change`,Y),e.valueInput.addEventListener(`focus`,J),e.valueInput.addEventListener(`change`,()=>{Rn(e),Y()}),e.valueInput.addEventListener(`blur`,()=>{Rn(e),Y()}),e.valueInput.addEventListener(`keydown`,t=>{t.key===`Enter`&&(t.preventDefault(),Rn(e),Y(),e.valueInput.blur()),t.key===`Escape`&&(t.preventDefault(),e.valueInput.value=dn(sn(e)),Dn(),e.valueInput.blur())})}function X(){let e=gn(),t=_n(),n=ni(e,t);At=Zn(n),fr();let r=Xn(Sr(n),t);V.geometry.dispose(),V.geometry=r.meshGeometry,H.geometry.dispose(),H.geometry=r.wireGeometry,U.geometry.dispose(),U.geometry=Di(t),Un(),Bi()}function Hn(){let e=At;if(!e)return;let t=_n(),n=Xn(Sr(e),t);V.geometry.dispose(),V.geometry=n.meshGeometry,H.geometry.dispose(),H.geometry=n.wireGeometry,Un(),Bi()}function Un(){V.updateWorldMatrix(!0,!1);let e=new ce().setFromObject(V);if(e.isEmpty())return;let t=e.getCenter(new a),n=e.getSize(new a),r=Math.max(n.x,n.y,n.z,v.width)/2+9,i=Math.max(1,r/18);z.position.set(t.x-8*i,t.y+13*i,t.z+7*i),z.target.position.copy(t),z.target.updateMatrixWorld(),Ut.position.set(t.x+9*i,t.y+5*i,t.z-10*i),Wt.position.set(t.x+7*i,t.y+4*i,t.z-9*i)}function Wn(e){return e.lengthCount*e.widthCount*e.heightCount}function Gn(e,t,n){return`${Math.round(e/Je)},${Math.round(t/Je)},${Math.round(n/Je)}`}function Kn(e,t,n,r){return new a((t-(r.widthCount-1)/2)*v.width,n*v.height,(e-(r.lengthCount-1)/2)*v.depth)}function qn(e,t){let n=0;for(let r=0;r<e.heightCount;r+=1)for(let i=0;i<e.widthCount;i+=1)for(let a=0;a<e.lengthCount;a+=1)t(Kn(a,i,r,e),n,a,i,r),n+=1}function Jn(e,t){let n=e.getAttribute(`position`),r=Wn(t),i=new Float32Array(n.count*r*3);qn(t,(e,t)=>{let r=t*n.count*3;for(let t=0;t<n.count;t+=1){let a=r+t*3;i[a+0]=n.getX(t)+e.x,i[a+1]=n.getY(t)+e.y,i[a+2]=n.getZ(t)+e.z}});let a=new h;return a.setAttribute(`position`,new de(i,3)),a.computeBoundingSphere(),a}function Yn(e,t){let n=ni(e,t);return At=Zn(n),Xn(n,t)}function Xn(e,t){return{meshGeometry:ui(e,t),wireGeometry:Ci(e)}}function Zn(e){return{vertices:e.vertices.map(e=>e.clone()),quadFaces:e.quadFaces.map(([e,t,n,r])=>[e,t,n,r])}}function Qn(e,t){let n=new se(A,O.domElement);n.setMode(e),n.setSpace(`local`),n.setSize(t),n.addEventListener(`dragging-changed`,()=>{n.dragging?lr(n):lr(null),ur()}),n.addEventListener(`mouseDown`,()=>{dr(n)&&(or(n),Nt=!0)}),n.addEventListener(`objectChange`,sr),n.addEventListener(`mouseUp`,()=>{cr(),window.setTimeout(()=>{Nt=!1,lr(null)},0)});let r=n.getHelper();return r.renderOrder=8,tr(n,e),e===`translate`&&(nr(n),rr(n,rt)),e===`scale`&&ir(n,nt),$n(n),k.add(r),{control:n,helper:r}}function $n(e){let t=e._gizmo;if(t){for(let e of Object.values(t.gizmo??{}))er(e);for(let e of Object.values(t.helper??{}))er(e)}}function er(e){e.traverse(e=>{if(e.name!==`X`&&e.name!==`Y`&&e.name!==`Z`)return;let t=e,n=Array.isArray(t.material)?t.material:t.material?[t.material]:[];for(let t of n)t.color?.setHex(it[e.name])})}function tr(e,t){let n=t===`scale`?new Set([`X`,`Y`,`Z`,`XYZ`]):new Set([`X`,`Y`,`Z`]),r=e._gizmo;if(!r)return;let i=r.helper?.[t];if(i)for(let e of[...i.children])i.remove(e);let a=[r.gizmo?.[t],r.picker?.[t]];for(let e of a){if(!e)continue;let t=e.children.filter(e=>!n.has(e.name));for(let n of t)e.remove(n)}}function nr(e){let t={X:new a(1,0,0),Y:new a(0,1,0),Z:new a(0,0,1)},n=e._gizmo;if(!n)return;let r=[n.gizmo?.translate,n.picker?.translate];for(let e of r)if(e)for(let n of[`X`,`Y`,`Z`]){let r=e.children.filter(e=>e.name===n);if(r.length<=1)continue;let i=t[n],o=[];for(let e of r){let t=e.geometry;if(!t)continue;t.computeBoundingBox();let n=t.boundingBox;n&&n.getCenter(new a).dot(i)<-1e-4&&o.push(e)}for(let t of o)e.remove(t)}}function rr(e,t){let n={X:new a(1,0,0),Y:new a(0,1,0),Z:new a(0,0,1)},r=e._gizmo?.gizmo?.translate;if(r)for(let e of[`X`,`Y`,`Z`]){let i=n[e];for(let n of r.children){if(n.name!==e)continue;let r=n.geometry;if(!r)continue;r.computeBoundingBox();let o=r.boundingBox;if(!o)continue;let s=o.getCenter(new a),c=o.getSize(new a),l=Math.max(c.x,c.y,c.z),u=Math.min(c.x,c.y,c.z);if(!(s.dot(i)>.35&&l<=.16&&u>.03))continue;let d=s.clone().multiplyScalar(-1);r.translate(d.x,d.y,d.z),r.scale(t,t,t),r.translate(s.x,s.y,s.z)}}}function ir(e,t){let n={X:new a(1,0,0),Y:new a(0,1,0),Z:new a(0,0,1)},r=e._gizmo;if(!r)return;let i=r.gizmo?.scale;i&&ar(i,n,t);let o=r.picker?.scale;o&&ar(o,n,t)}function ar(e,t,n){for(let r of[`X`,`Y`,`Z`]){let i=t[r],o=[];for(let t of e.children){if(t.name!==r)continue;let e=t.geometry;if(!e)continue;e.computeBoundingBox();let s=e.boundingBox;if(!s)continue;let c=s.getCenter(new a).dot(i);c>1e-4?o.push(t):c<-1e-4&&e.translate(-i.x*n,-i.y*n,-i.z*n)}for(let t of o)e.remove(t)}}function or(e){if(I.size===0||!M||!dr(e))return;J(),lr(e),R.updateMatrixWorld(!0);let t=R.matrixWorld.clone(),n=t.clone().invert(),r=new Map;I.forEach(e=>{let t=M?.points[e];t&&r.set(e,t.position.clone())}),Mt={anchorStartMatrix:t,anchorStartInverse:n,pointStartPositions:r}}function sr(){if(!(!M||!Mt)){R.updateMatrixWorld(!0);for(let[e,t]of Mt.pointStartPositions){let n=M.points[e];n&&n.position.copy(t).applyMatrix4(Mt.anchorStartInverse).applyMatrix4(R.matrixWorld)}Q(!1),Hn()}}function cr(){sr(),Mt=null,Rr(),Y()}function lr(e){for(let t of Bt)t.enabled=e===null||t===e}function ur(){let e=Bt.some(e=>e.dragging);Pt=e,j.enabled=!e}function dr(e){let t=e.axis;return typeof t==`string`?t:null}function fr(){let e=At,t=M?pr(M):null;if(!e||e.vertices.length===0){M=null,Ft=null,I.clear(),Q();return}let n=vn(),r=hr(e),i=r.getSize(new a),o=[],s=kr(n),c=Ar(n),l=Or(n);for(let e=0;e<c;e+=1)for(let t=0;t<s;t+=1)for(let n=0;n<l;n+=1){let u=new a(xr(r.min.x,i.x,s,t),xr(r.min.y,i.y,c,e),xr(r.min.z,i.z,l,n));o.push({index:o.length,widthIndex:t,heightIndex:e,lengthIndex:n,restPosition:u.clone(),position:u})}M={settings:xn(n),bounds:r,size:i,points:o},t&&mr(t,M),Ft=null,I.clear(),Mt=null,Q()}function pr(e){return{settings:xn(e.settings),bounds:e.bounds.clone(),size:e.size.clone(),points:e.points.map(e=>({index:e.index,widthIndex:e.widthIndex,heightIndex:e.heightIndex,lengthIndex:e.lengthIndex,restPosition:e.restPosition.clone(),position:e.position.clone()}))}}function mr(e,t){for(let n of t.points){let r=vr(gr(n.restPosition,t.bounds,t.size),e.bounds,e.size),i=wr(e,r).sub(r);n.position.copy(n.restPosition).add(yr(i,e.size,t.size))}}function hr(e){let t=new ce;for(let n of e.vertices)t.expandByPoint(n);return t}function gr(e,t,n){return new a(_r(e.x,t.min.x,n.x),_r(e.y,t.min.y,n.y),_r(e.z,t.min.z,n.z))}function _r(e,t,n){return Math.abs(n)<=tt?.5:W((e-t)/n,0,1)}function vr(e,t,n){return new a(t.min.x+n.x*e.x,t.min.y+n.y*e.y,t.min.z+n.z*e.z)}function yr(e,t,n){return new a(br(e.x,t.x,n.x),br(e.y,t.y,n.y),br(e.z,t.z,n.z))}function br(e,t,n){return Math.abs(t)<=tt?e:e/t*n}function xr(e,t,n,r){return n<=1||Math.abs(t)<=tt?e+t/2:e+t*(r/(n-1))}function Sr(e){return M?{vertices:e.vertices.map(e=>Cr(e)),quadFaces:e.quadFaces}:e}function Cr(e){return M?wr(M,e):e.clone()}function wr(e,t){let{bounds:n,size:r,settings:i}=e,a=Tr(t.x,n.min.x,r.x,kr(i)),o=Tr(t.y,n.min.y,r.y,Ar(i)),s=Tr(t.z,n.min.z,r.z,Or(i));return Er(e,a.index0,a.index1,a.alpha,o.index0,o.index1,o.alpha,s.index0,s.index1,s.alpha)}function Tr(e,t,n,r){if(r<=1||Math.abs(n)<=tt)return{index0:0,index1:0,alpha:0};let i=W((e-t)/n,0,1)*(r-1),a=Math.floor(i);return{index0:a,index1:Math.min(a+1,r-1),alpha:i-a}}function Er(e,t,n,r,i,a,o,s,c,l){let u=Z(e,t,i,s),d=Z(e,n,i,s),f=Z(e,t,a,s),p=Z(e,n,a,s),m=Z(e,t,i,c),h=Z(e,n,i,c),g=Z(e,t,a,c),_=Z(e,n,a,c),ee=u.clone().lerp(d,r),te=f.clone().lerp(p,r),ne=m.clone().lerp(h,r),re=g.clone().lerp(_,r),ie=ee.lerp(te,o),ae=ne.lerp(re,o);return ie.lerp(ae,l)}function Z(e,t,n,r){return e.points[Dr(t,n,r,e.settings)]?.position??new a}function Dr(e,t,n,r){let i=kr(r),a=Or(r);return(t*i+e)*a+n}function Or(e){return e.lengthDivisions+1}function kr(e){return e.widthDivisions+1}function Ar(e){return e.heightDivisions+1}function Q(e=!0){Mr(),Nr(),e&&Rr()}function $(){return Ct.checked}function jr(){let e=$();e||(qr(),D.hidden=!0),N&&(N.visible=e),P&&(P.visible=e),F&&(F.visible=e),Rr()}function Mr(){if(!M||M.points.length===0){Ir();return}if(!N||!P||N.count!==M.points.length){Ir();let e=new u({color:Ze,depthTest:!1,depthWrite:!1,transparent:!0,opacity:1,toneMapped:!1}),t=new u({color:Qe,depthTest:!1,depthWrite:!1,transparent:!0,opacity:1,toneMapped:!1});N=new ee(new l(1,12,8),e,M.points.length),P=new ee(new l(1,12,8),t,M.points.length),N.instanceMatrix.setUsage(_),P.instanceMatrix.setUsage(_),N.frustumCulled=!1,P.frustumCulled=!1,N.renderOrder=7,P.renderOrder=8,k.add(N),k.add(P)}let e=Fr(),t=0;for(let n of M.points)L.position.copy(n.position),L.rotation.set(0,0,0),L.scale.setScalar(e),L.updateMatrix(),N.setMatrixAt(n.index,L.matrix),(I.has(n.index)||Ft===n.index)&&(L.scale.setScalar(e*1.1),L.updateMatrix(),P.setMatrixAt(t,L.matrix),t+=1);P.count=t,N.visible=$(),P.visible=$(),N.instanceMatrix.needsUpdate=!0,P.instanceMatrix.needsUpdate=!0,N.computeBoundingSphere(),N.computeBoundingBox(),P.computeBoundingSphere(),P.computeBoundingBox()}function Nr(){if(!M||M.points.length===0){Lr();return}let e=Pr();if(!F){F=new me(e,new f({color:$e,transparent:!0,opacity:.34,depthTest:!1,depthWrite:!1,toneMapped:!1})),F.frustumCulled=!1,F.renderOrder=6,F.visible=$(),k.add(F);return}F.geometry.dispose(),F.geometry=e,F.visible=$()}function Pr(){let e=[];if(!M)return new h;let{settings:t}=M,n=kr(t),r=Ar(t),i=Or(t),a=(t,n)=>{e.push(t.x,t.y,t.z,n.x,n.y,n.z)};for(let e=0;e<r;e+=1)for(let t=0;t<n;t+=1)for(let o=0;o<i;o+=1){let s=Z(M,t,e,o);t+1<n&&a(s,Z(M,t+1,e,o)),e+1<r&&a(s,Z(M,t,e+1,o)),o+1<i&&a(s,Z(M,t,e,o+1))}let o=new h;return o.setAttribute(`position`,new le(e,3)),o.computeBoundingSphere(),o}function Fr(){return M?W(Math.max(M.size.x,M.size.y,M.size.z,1)/120,Ye,.24):Ye}function Ir(){N&&=(k.remove(N),N.geometry.dispose(),N.material.dispose(),null),P&&=(k.remove(P),P.geometry.dispose(),P.material.dispose(),null)}function Lr(){F&&=(k.remove(F),F.geometry.dispose(),F.material.dispose(),null)}function Rr(){let e=zr(),t=e!==null&&$();R.visible=t;for(let e of Vt)e.visible=t;if(!e||!t){for(let e of Bt)e.detach();return}R.position.copy(e),R.rotation.set(0,0,0),R.scale.set(1,1,1),R.updateMatrixWorld(!0);for(let e of Bt)e.attach(R)}function zr(){if(!M||I.size===0)return null;let e=new a,t=0;return I.forEach(n=>{let r=M?.points[n];r&&(e.add(r.position),t+=1)}),t===0?null:e.multiplyScalar(1/t)}function Br(e){return e.ctrlKey||e.metaKey?`remove`:e.shiftKey?`add`:`replace`}function Vr(e,t){if(t===`remove`){I.delete(e),Q();return}t===`replace`&&I.clear(),t===`add`&&I.has(e)?I.delete(e):I.add(e),Q()}function Hr(e,t){if(t===`remove`){for(let t of e)I.delete(t);Q();return}t===`replace`&&I.clear();for(let t of e)I.add(t);Q()}function Ur(){I.size!==0&&(I.clear(),Q())}function Wr(e){if(e.button!==0||Zr()||!$())return;let t=Qr(e),n=Br(e);if(t!==null){e.preventDefault(),Vr(t,n);return}jt={pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,currentX:e.clientX,currentY:e.clientY,mode:n,active:!1},E.setPointerCapture(e.pointerId),e.preventDefault()}function Gr(e){let t=jt;if(!t||t.pointerId!==e.pointerId){Kr(e);return}t.currentX=e.clientX,t.currentY=e.clientY;let n=t.currentX-t.startX,r=t.currentY-t.startY;!t.active&&Math.hypot(n,r)>=Xe&&(t.active=!0,D.hidden=!1),t.active&&ei(t)}function Kr(e){if(Zr()||!$()){qr();return}let t=Qr(e);Ft!==t&&(Ft=t,Mr())}function qr(){Ft!==null&&(Ft=null,Mr())}function Jr(e){let t=jt;!t||t.pointerId!==e.pointerId||(t.active?Hr(ti(t),t.mode):t.mode===`replace`&&Ur(),Xr(e.pointerId))}function Yr(e){let t=jt;!t||t.pointerId!==e.pointerId||Xr(e.pointerId)}function Xr(e){E.hasPointerCapture(e)&&E.releasePointerCapture(e),jt=null,D.hidden=!0,D.classList.remove(`is-deselecting`)}function Zr(){return Nt||Pt}function Qr(e){if(!N||!M||!$())return null;$r(e),It.setFromCamera(Lt,A);let t=It.intersectObject(N,!1).find(e=>typeof e.instanceId==`number`);return t?.instanceId===void 0||t.instanceId<0||t.instanceId>=M.points.length?null:t.instanceId}function $r(e){let t=E.getBoundingClientRect();Lt.x=(e.clientX-t.left)/t.width*2-1,Lt.y=-((e.clientY-t.top)/t.height)*2+1}function ei(e){let t=Math.min(e.startX,e.currentX),n=Math.min(e.startY,e.currentY),r=Math.abs(e.currentX-e.startX),i=Math.abs(e.currentY-e.startY);D.style.left=`${t}px`,D.style.top=`${n}px`,D.style.width=`${r}px`,D.style.height=`${i}px`,D.classList.toggle(`is-deselecting`,e.mode===`remove`)}function ti(e){if(!M)return[];let t=Math.min(e.startX,e.currentX),n=Math.max(e.startX,e.currentX),r=Math.min(e.startY,e.currentY),i=Math.max(e.startY,e.currentY),a=E.getBoundingClientRect(),o=[];for(let e of M.points){if(Rt.copy(e.position).project(A),Rt.z<-1||Rt.z>1)continue;let s=a.left+(Rt.x+1)/2*a.width,c=a.top+(-Rt.y+1)/2*a.height;s>=t&&s<=n&&c>=r&&c<=i&&o.push(e.index)}return o}function ni(e,t){return fi(ke(li(ri(e,t),t.thickness,ci(t)),t.subdivisions))}function ri(e,t){return fi(ii(e,t))}function ii(e,t){let n=ye(e),r=[],i=[];return qn(t,(e,t,a,o,s)=>{let c=r.length;for(let t of n.vertices)r.push(t.clone().add(e));let l=ai(a,o,s);for(let e of n.quadFaces)i.push(si(l?oi(e):e,c))}),{vertices:r,quadFaces:i}}function ai(e,t,n){return(e+t+n)%2==1}function oi([e,t,n,r]){return[e,r,n,t]}function si([e,t,n,r],i){return[i+e,i+t,i+n,i+r]}function ci(e){let t=new Set;return qn(e,(e,n,r,i,a)=>{ai(r,i,a)&&t.add(Gn(e.x,e.y,e.z))}),t}function li(e,t,n=new Set){let r=W(t,0,Ge);if(r<=1e-4)return e;let i=r/2,a=pi(e);for(let t=0;t<e.vertices.length;t+=1){let r=e.vertices[t];n.has(Gn(r.x,r.y,r.z))&&a[t].multiplyScalar(-1)}let o=e.vertices.length,s=[],c=[];for(let t=0;t<o;t+=1)s.push(e.vertices[t].clone().addScaledVector(a[t],i));for(let t=0;t<o;t+=1)s.push(e.vertices[t].clone().addScaledVector(a[t],-i));for(let[t,n,r,i]of e.quadFaces)c.push([t,n,r,i]),c.push([t+o,i+o,r+o,n+o]);for(let[t,n]of mi(e.quadFaces))c.push([n,t,t+o,n+o]);return{vertices:s,quadFaces:c}}function ui(e,t){Ei(e.vertices);let n=new Float32Array(e.vertices.length*3);for(let t=0;t<e.vertices.length;t+=1){let r=e.vertices[t];n[t*3+0]=r.x,n[t*3+1]=r.y,n[t*3+2]=r.z}let r=wi(e.quadFaces),i=new h;return i.setAttribute(`position`,new de(n,3)),i.setIndex(r),i.computeVertexNormals(),hi(i,e,t.subdivisions),i.computeBoundingSphere(),i.userData.batwing={welded:!0,rawVertexCount:Wn(t)*33,vertexCount:e.vertices.length,indexCount:r.length,quadCount:e.quadFaces.length,instanceCount:Wn(t),thickness:t.thickness,subdivisions:t.subdivisions},i}function di(e){let t=[],n=new Map,r=Array(e.vertices.length);for(let i=0;i<e.vertices.length;i+=1){let a=e.vertices[i],o=Gn(a.x,a.y,a.z),s=n.get(o);s===void 0&&(s=t.length,n.set(o,s),t.push(a.clone())),r[i]=s}return{vertices:t,quadFaces:e.quadFaces.map(([e,t,n,i])=>[r[e],r[t],r[n],r[i]])}}function fi(e){let t=e.quadFaces.map(t=>_i(e.vertices,t)),n=di(e),r=n.quadFaces.map((e,r)=>{let i=t[r];if(!i||i.lengthSq()<=1e-12)return e;let a=_i(n.vertices,e);return a.lengthSq()>1e-12&&a.dot(i)<0?oi(e):e});return{vertices:n.vertices,quadFaces:r}}function pi(e){let t=Array.from({length:e.vertices.length},()=>new a);for(let n of e.quadFaces){let r=_i(e.vertices,n);if(!(r.lengthSq()<=1e-12))for(let e of n)t[e].add(r)}for(let e of t)e.lengthSq()>1e-12?e.normalize():e.set(0,1,0);return vi(t,e.vertices),t}function mi(e){let t=new Map,n=(e,n)=>{let r=`${Math.min(e,n)},${Math.max(e,n)}`,i=t.get(r);if(i){i.count+=1;return}t.set(r,{a:e,b:n,count:1})};for(let[t,r,i,a]of e)n(t,r),n(r,i),n(i,a),n(a,t);let r=[];for(let e of t.values())e.count===1&&r.push([e.a,e.b]);return r}function hi(e,t,n){let r=e.getAttribute(`normal`),i=gi(t,n),o=Array.from({length:t.vertices.length},(e,t)=>r?new a(r.getX(t),r.getY(t),r.getZ(t)):new a),s=Array.from({length:t.vertices.length},()=>new a);for(let e of t.quadFaces){let t=_i(i,e);if(!(t.lengthSq()<=1e-12))for(let n of e)s[n].add(t)}for(let e=0;e<o.length;e+=1)s[e].lengthSq()>1e-12?o[e].copy(s[e]).normalize():o[e].lengthSq()>1e-12?o[e].normalize():o[e].set(0,1,0);vi(o,t.vertices),n>0&&yi(o,t.quadFaces,4+n*2,.62);let c=new Float32Array(o.length*3);for(let e=0;e<o.length;e+=1)c[e*3+0]=o[e].x,c[e*3+1]=o[e].y,c[e*3+2]=o[e].z;e.setAttribute(`normal`,new de(c,3))}function gi(e,t){return t<=0?e.vertices:bi(e.vertices,e.quadFaces,5+t*3,.22,!1)}function _i(e,t){let n=new a;for(let r=0;r<t.length;r+=1){let i=e[t[r]],a=e[t[(r+1)%t.length]];n.x+=(i.y-a.y)*(i.z+a.z),n.y+=(i.z-a.z)*(i.x+a.x),n.z+=(i.x-a.x)*(i.y+a.y)}if(n.lengthSq()>1e-12)return n.normalize();let[r,i,o]=t;return new a().subVectors(e[i],e[r]).cross(new a().subVectors(e[o],e[r])).normalize()}function vi(e,t){let n=new Map;for(let r=0;r<t.length;r+=1){let i=t[r],a=Gn(i.x,i.y,i.z),o=n.get(a);o?o.add(e[r]):n.set(a,e[r].clone())}for(let r=0;r<t.length;r+=1){let i=t[r],a=n.get(Gn(i.x,i.y,i.z));a&&a.lengthSq()>1e-12&&e[r].copy(a).normalize()}}function yi(e,t,n,r){let i=Si(e.length,t);for(let t=0;t<n;t+=1){let t=e.map((t,n)=>{let o=i[n];if(o.size===0)return t.clone();let s=new a;for(let t of o)s.add(e[t]);return s.multiplyScalar(1/o.size),t.clone().lerp(s.normalize(),r).normalize()});for(let n=0;n<e.length;n+=1)e[n].copy(t[n])}}function bi(e,t,n,r,i){let o=Si(e.length,t),s=i?xi(t):new Set,c=e.map(e=>e.clone());for(let e=0;e<n;e+=1)c=c.map((e,t)=>{let n=o[t];if(n.size===0||s.has(t))return e.clone();let i=new a;for(let e of n)i.add(c[e]);return i.multiplyScalar(1/n.size),e.clone().lerp(i,r)});return c}function xi(e){let t=new Map,n=(e,n)=>{let r=`${Math.min(e,n)},${Math.max(e,n)}`,i=t.get(r);if(i){i.count+=1;return}t.set(r,{a:e,b:n,count:1})};for(let[t,r,i,a]of e)n(t,r),n(r,i),n(i,a),n(a,t);let r=new Set;for(let e of t.values())e.count===1&&(r.add(e.a),r.add(e.b));return r}function Si(e,t){let n=Array.from({length:e},()=>new Set),r=(e,t)=>{e!==t&&(n[e].add(t),n[t].add(e))};for(let[e,n,i,a]of t)r(e,n),r(n,i),r(i,a),r(a,e);return n}function Ci(e){let t=Ti(e.quadFaces),n=new Float32Array(t.length*2*3);for(let r=0;r<t.length;r+=1){let[i,a]=t[r],o=e.vertices[i],s=e.vertices[a],c=r*6;n[c+0]=o.x,n[c+1]=o.y,n[c+2]=o.z,n[c+3]=s.x,n[c+4]=s.y,n[c+5]=s.z}let r=new h;return r.setAttribute(`position`,new de(n,3)),r.computeBoundingSphere(),r}function wi(e){let t=[];for(let[n,r,i,a]of e)t.push(n,r,i,n,i,a);return t}function Ti(e){let t=[],n=new Set,r=(e,r)=>{let i=`${Math.min(e,r)},${Math.max(e,r)}`;n.has(i)||(n.add(i),t.push([e,r]))};for(let[t,n,i,a]of e)r(t,n),r(n,i),r(i,a),r(a,t);return t}function Ei(e){for(let t=0;t<e.length;t+=1){let n=e[t];if(!Number.isFinite(n.x)||!Number.isFinite(n.y)||!Number.isFinite(n.z))throw Error(`Batwing geometry produced a non-finite vertex at index ${t}.`)}}function Di(e){let t=be(),n=Jn(t,e);return t.dispose(),n}function Oi(e){V.material.color.setHex(e.color),V.material.metalness=e.metalness,V.material.roughness=e.roughness,V.material.clearcoat=e.clearcoat,V.material.clearcoatRoughness=e.clearcoatRoughness,V.material.envMapIntensity=e.envMapIntensity,V.material.iridescence=e.iridescence,V.material.iridescenceIOR=e.iridescenceIOR,V.material.iridescenceThicknessRange=[...e.iridescenceThicknessRange],V.material.reflectivity=e.reflectivity,V.material.specularIntensity=e.specularIntensity,V.material.sheen=e.sheen,V.material.sheenRoughness=e.sheenRoughness,V.material.sheenColor.setHex(e.sheenColor),B.strength=e.eggIridescence,B.frequency=e.eggIridescenceFrequency,B.uniforms&&(B.uniforms.uEggIridescence.value=e.eggIridescence,B.uniforms.uEggIridescenceFrequency.value=e.eggIridescenceFrequency),V.material.needsUpdate=!0}function ki(e){B.backFacesEnabled=e,B.uniforms&&(B.uniforms.uBackFaceDiagnostic.value=+!!e)}function Ai(e,t){e.customProgramCacheKey=()=>`batwing-gyroid-foil-iridescence-v2`,e.onBeforeCompile=e=>{let n={uEggIridescence:{value:t.strength},uEggIridescenceFrequency:{value:t.frequency},uBackFaceDiagnostic:{value:+!!t.backFacesEnabled}};t.uniforms=n,e.uniforms.uEggIridescence=n.uEggIridescence,e.uniforms.uEggIridescenceFrequency=n.uEggIridescenceFrequency,e.uniforms.uBackFaceDiagnostic=n.uBackFaceDiagnostic,e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
varying vec3 vEggIriWorldPosition;
varying vec3 vEggIriWorldNormal;`).replace(`#include <worldpos_vertex>`,`#include <worldpos_vertex>
vEggIriWorldPosition = worldPosition.xyz;
vEggIriWorldNormal = normalize( mat3( modelMatrix ) * normal );`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
uniform float uEggIridescence;
uniform float uEggIridescenceFrequency;
uniform float uBackFaceDiagnostic;
varying vec3 vEggIriWorldPosition;
varying vec3 vEggIriWorldNormal;

float eggSaturate01(float value) {
  return clamp(value, 0.0, 1.0);
}

float eggHash13(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.yzx + 19.19);
  return fract((p.x + p.y) * p.z);
}

float eggSmoothNoise3(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);

  float n000 = eggHash13(i + vec3(0.0, 0.0, 0.0));
  float n100 = eggHash13(i + vec3(1.0, 0.0, 0.0));
  float n010 = eggHash13(i + vec3(0.0, 1.0, 0.0));
  float n110 = eggHash13(i + vec3(1.0, 1.0, 0.0));
  float n001 = eggHash13(i + vec3(0.0, 0.0, 1.0));
  float n101 = eggHash13(i + vec3(1.0, 0.0, 1.0));
  float n011 = eggHash13(i + vec3(0.0, 1.0, 1.0));
  float n111 = eggHash13(i + vec3(1.0, 1.0, 1.0));

  float nx00 = mix(n000, n100, u.x);
  float nx10 = mix(n010, n110, u.x);
  float nx01 = mix(n001, n101, u.x);
  float nx11 = mix(n011, n111, u.x);
  float nxy0 = mix(nx00, nx10, u.y);
  float nxy1 = mix(nx01, nx11, u.y);
  return mix(nxy0, nxy1, u.z);
}

vec3 eggBismuthPalette(float t) {
  t = fract(t);
  vec3 c0 = vec3(1.00, 0.84, 0.20);
  vec3 c1 = vec3(1.00, 0.33, 0.77);
  vec3 c2 = vec3(0.18, 0.93, 1.00);
  vec3 c3 = vec3(0.30, 1.00, 0.46);
  if (t < 0.25) {
    return mix(c0, c1, t * 4.0);
  }
  if (t < 0.50) {
    return mix(c1, c2, (t - 0.25) * 4.0);
  }
  if (t < 0.75) {
    return mix(c2, c3, (t - 0.50) * 4.0);
  }
  return mix(c3, c0, (t - 0.75) * 4.0);
}

vec3 applyEggIridescence(vec3 baseColor) {
  float iriStrength = eggSaturate01(uEggIridescence);
  if (iriStrength <= 0.0001) {
    return baseColor;
  }

  vec3 n = normalize(vEggIriWorldNormal);
  vec3 viewDir = normalize(cameraPosition - vEggIriWorldPosition);
  float ndv = eggSaturate01(dot(n, viewDir));
  float jitter = eggSmoothNoise3(vEggIriWorldPosition * 1.5 + vec3(31.4));
  float broadNoise = eggSmoothNoise3(vEggIriWorldPosition * 0.48 + vec3(11.7));
  float bandFreq = max(0.2, uEggIridescenceFrequency);
  float facetBand =
    (vEggIriWorldPosition.y * 1.8 + vEggIriWorldPosition.x * 0.42 - vEggIriWorldPosition.z * 0.31) * bandFreq;
  float stepBand = (abs(vEggIriWorldPosition.x) + abs(vEggIriWorldPosition.z)) * 0.92;
  float swirl =
    0.5 +
    0.5 *
      sin(
        dot(vEggIriWorldPosition, vec3(0.73, 0.51, -0.46)) * bandFreq * 1.25 +
        broadNoise * 4.6 +
        6.283
      );
  float thicknessT = fract(facetBand * 0.123 + stepBand * 0.081 + swirl * 0.39 + jitter * 0.27 + 5.7);
  float thicknessNm = mix(120.0, 980.0, thicknessT);

  vec3 wavelengths = vec3(680.0, 540.0, 440.0);
  vec3 phase = (4.0 * 3.14159265 * 1.65 * thicknessNm * max(ndv, 0.08)) / wavelengths;
  vec3 interference = 0.5 + 0.5 * cos(phase + vec3(0.0, 2.094, 4.188));

  float hueSweep =
    fract(
      thicknessT * (0.55 + uEggIridescenceFrequency * 0.65) +
      dot(n, vec3(0.23, 0.11, -0.37)) * 0.18
    );
  vec3 oxidePalette = eggBismuthPalette(hueSweep);
  vec3 oxideColor = mix(interference, oxidePalette, 0.68);

  float fresnel = pow(1.0 - ndv, 2.2);
  float filmAmount = iriStrength * (0.48 + 0.52 * fresnel);
  vec3 branchTint = mix(vec3(1.0), baseColor, 0.58);
  vec3 metallicBase = vec3(0.92, 0.94, 0.98) * mix(vec3(1.0), branchTint, 0.26);
  vec3 oxideTinted = mix(oxideColor, oxideColor * branchTint, 0.62);
  vec3 blendTint = mix(metallicBase, oxideTinted, eggSaturate01(filmAmount * 0.78));
  vec3 overlayTint = mix(vec3(1.0), blendTint, 0.62 * iriStrength);
  vec3 iridescentBase = baseColor * overlayTint;
  iridescentBase += oxideColor * fresnel * iriStrength * 0.22;
  return mix(baseColor, iridescentBase, 0.85 * iriStrength);
}`).replace(`#include <color_fragment>`,`#include <color_fragment>
diffuseColor.rgb = applyEggIridescence(diffuseColor.rgb);`).replace(`#include <opaque_fragment>`,`#include <opaque_fragment>
if (uBackFaceDiagnostic > 0.5) {
  gl_FragColor = vec4(gl_FrontFacing ? vec3(1.0) : vec3(1.0, 0.0, 0.85), diffuseColor.a);
}`)}}function ji(e){return e.color?.clone()??new pe(15857151)}function Mi(){V.updateWorldMatrix(!0,!1);let e=V.geometry.clone();e.applyMatrix4(V.matrixWorld),e.computeVertexNormals(),e.computeBoundingSphere();let t=new ge(e,new he({color:ji(V.material),metalness:V.material.metalness,roughness:V.material.roughness,side:2}));return t.name=He,t}function Ni(e){e.geometry.dispose(),e.material.dispose()}function Pi(e){return Xt[e]+=1,`${He}_${String(Xt[e]).padStart(3,`0`)}.${e}`}function Fi(e,t){let n=URL.createObjectURL(e),r=document.createElement(`a`);r.href=n,r.download=t,document.body.appendChild(r),r.click(),r.remove(),URL.revokeObjectURL(n)}function Ii(){let e=Mi(),t=e.geometry.getAttribute(`position`),n=e.geometry.getIndex(),r=`# ${He} OBJ Export\n`;r+=`o ${He}\n`;for(let e=0;e<t.count;e+=1)r+=`v ${t.getX(e)} ${t.getY(e)} ${t.getZ(e)}\n`;if(n)for(let e=0;e<n.count;e+=3){let t=n.getX(e)+1,i=n.getX(e+1)+1,a=n.getX(e+2)+1;r+=`f ${t} ${i} ${a}\n`}Fi(new Blob([r],{type:`text/plain;charset=utf-8`}),Pi(`obj`)),Ni(e)}function Li(){let e=Mi(),t=new fe,n=new oe;n.add(e),t.parse(n,t=>{t instanceof ArrayBuffer&&Fi(new Blob([t],{type:`model/gltf-binary`}),Pi(`glb`)),Ni(e)},t=>{console.error(`GLB export failed.`,t),Ni(e)},{binary:!0})}function Ri(){O.render(k,A),E.toBlob(e=>{e&&Fi(e,Pi(`png`))},`image/png`)}function zi(){let e=V.geometry.getAttribute(`position`),t=V.geometry.getAttribute(`normal`),n=V.geometry.getIndex(),r=!0;for(let t=0;t<e.count;t+=1)if(!Number.isFinite(e.getX(t))||!Number.isFinite(e.getY(t))||!Number.isFinite(e.getZ(t))){r=!1;break}return{vertexCount:e.count,indexCount:n?.count??0,hasNormals:t!==void 0&&t.count===e.count,finitePositions:r}}function Bi(){let e=zi();E.dataset.vertexCount=`${e.vertexCount}`,E.dataset.indexCount=`${e.indexCount}`,E.dataset.hasNormals=`${e.hasNormals}`,E.dataset.finitePositions=`${e.finitePositions}`}function Vi(){lt.querySelectorAll(`.panel-section-header`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.closest(`.panel-section`);if(!t)return;let n=t.classList.toggle(`is-collapsed`);e.setAttribute(`aria-expanded`,n?`false`:`true`)})})}function Hi(){let e=window.innerWidth,t=window.innerHeight;A.aspect=e/Math.max(t,1),A.updateProjectionMatrix(),O.setPixelRatio(Math.min(window.devicePixelRatio,2)),O.setSize(e,t,!1)}function Ui(){j.update(),kt.update(A),O.render(k,A),$t=window.requestAnimationFrame(Ui)}function Wi(){window.cancelAnimationFrame($t),j.dispose();for(let e of Bt)e.dispose();for(let e of Vt)k.remove(e);Ir(),Lr(),V.geometry.dispose(),V.material.dispose(),H.geometry.dispose(),H.material.dispose(),U.geometry.dispose(),U.material.dispose(),Ot.dispose(),kt.dispose(),O.dispose()}for(let e of Tt)zn(e),G(e.slider);for(let e of Et)Bn(e),G(e.slider);for(let e of Dt)Vn(e),G(e.slider);ht.addEventListener(`click`,()=>{let e=K();Fn(),q(e)}),E.addEventListener(`pointerdown`,Wr),E.addEventListener(`pointermove`,Gr),E.addEventListener(`pointerup`,Jr),E.addEventListener(`pointercancel`,Yr),E.addEventListener(`pointerleave`,qr),yt.addEventListener(`change`,()=>{let e=K();e.showBaseGrid=!yt.checked,kt.mesh.visible=yt.checked,q(e)}),bt.addEventListener(`change`,()=>{let e=K();e.showWireframe=!bt.checked,H.visible=bt.checked,q(e)}),xt.addEventListener(`change`,()=>{let e=K();e.reflectionsEnabled=!xt.checked,Oi(xt.checked?w:st),q(e)}),wt.addEventListener(`change`,()=>{let e=K();e.showBackFaces=!wt.checked,ki(wt.checked),q(e)}),St.addEventListener(`change`,()=>{let e=K();e.showBoxGuide=!St.checked,U.visible=St.checked,q(e)}),Ct.addEventListener(`change`,()=>{let e=K();e.showLatticeControls=!Ct.checked,jr(),q(e)}),gt.addEventListener(`click`,Ii),_t.addEventListener(`click`,Li),vt.addEventListener(`click`,Ri),mt.addEventListener(`pointerdown`,e=>{e.stopPropagation()}),mt.addEventListener(`click`,()=>{let e=ft.classList.toggle(`is-collapsed`);mt.setAttribute(`aria-expanded`,e?`false`:`true`)}),pt.addEventListener(`pointerdown`,e=>{if(e.target.closest(`#collapseToggle`))return;let t=ft.getBoundingClientRect();Qt=!0,Zt.x=e.clientX-t.left,Zt.y=e.clientY-t.top,pt.setPointerCapture(e.pointerId),e.preventDefault()}),pt.addEventListener(`pointermove`,e=>{if(!Qt)return;let t=ft.getBoundingClientRect(),n=W(e.clientX-Zt.x,8,window.innerWidth-t.width-8),r=W(e.clientY-Zt.y,8,window.innerHeight-t.height-8);ft.style.left=`${n}px`,ft.style.top=`${r}px`}),pt.addEventListener(`pointerup`,e=>{Qt=!1,pt.releasePointerCapture(e.pointerId)}),pt.addEventListener(`pointercancel`,e=>{Qt=!1,pt.releasePointerCapture(e.pointerId)}),Vi(),Bi(),Hi(),window.addEventListener(`resize`,Hi),window.addEventListener(`beforeunload`,Wi),window.addEventListener(`keydown`,e=>{if(!e.ctrlKey||e.altKey)return;let t=e.key.toLowerCase();if(t===`z`){e.preventDefault(),e.shiftKey?An():kn();return}t===`y`&&!e.shiftKey&&(e.preventDefault(),An())}),window.__batwingDebug={getStats:zi,setSettings:jn},requestAnimationFrame(()=>{document.documentElement.classList.add(`ui-ready`)}),Ui();