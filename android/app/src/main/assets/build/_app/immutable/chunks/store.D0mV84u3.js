import{C as m,D as I,H as L,F as O,G as y,I as b,J as N,K as H,k as l,L as V,M as C,N as M,O as Y,P as j,Q as k,R as P,g as $,p as q,j as w,e as F,m as G,q as J,n as E,t as K,S as Q,T as U,w as W,U as z}from"./runtime.ChA4jPkq.js";import{a as B,r as S,h}from"./events._hQ_KU8L.js";import{b as X}from"./disclose-version.zt6h8DHx.js";const Z=["touchstart","touchmove"];function x(e){return Z.includes(e)}function ae(e,t){var r=t==null?"":typeof t=="object"?t+"":t;r!==(e.__t??(e.__t=e.nodeValue))&&(e.__t=r,e.nodeValue=r==null?"":r+"")}function ee(e,t){return A(e,t)}function ie(e,t){m(),t.intro=t.intro??!1;const r=t.target,s=w,o=l;try{for(var n=I(r);n&&(n.nodeType!==8||n.data!==L);)n=O(n);if(!n)throw y;b(!0),N(n),H();const f=A(e,{...t,anchor:n});if(l===null||l.nodeType!==8||l.data!==V)throw C(),y;return b(!1),f}catch(f){if(f===y)return t.recover===!1&&M(),m(),Y(r),b(!1),ee(e,t);throw f}finally{b(s),N(o)}}const d=new Map;function A(e,{target:t,anchor:r,props:s={},events:o,context:n,intro:f=!0}){m();var g=new Set,p=u=>{for(var a=0;a<u.length;a++){var i=u[a];if(!g.has(i)){g.add(i);var c=x(i);t.addEventListener(i,h,{passive:c});var R=d.get(i);R===void 0?(document.addEventListener(i,h,{passive:c}),d.set(i,1)):d.set(i,R+1)}}};p(j(B)),S.add(p);var _=void 0,D=k(()=>{var u=r??t.appendChild(P());return $(()=>{if(n){q({});var a=J;a.c=n}o&&(s.$$events=o),w&&X(u,null),_=e(u,s)||{},w&&(F.nodes_end=l),n&&G()}),()=>{var c;for(var a of g){t.removeEventListener(a,h);var i=d.get(a);--i===0?(document.removeEventListener(a,h),d.delete(a)):d.set(a,i)}S.delete(p),T.delete(_),u!==r&&((c=u.parentNode)==null||c.removeChild(u))}});return T.set(_,D),_}let T=new WeakMap;function ue(e){const t=T.get(e);t&&t()}function te(e,t,r){if(e==null)return t(void 0),E;const s=K(()=>e.subscribe(t,r));return s.unsubscribe?()=>s.unsubscribe():s}let v=!1;function oe(e,t,r){const s=r[t]??(r[t]={store:null,source:U(void 0),unsubscribe:E});if(s.store!==e)if(s.unsubscribe(),s.store=e??null,e==null)s.source.v=void 0,s.unsubscribe=E;else{var o=!0;s.unsubscribe=te(e,n=>{o?s.source.v=n:z(s.source,n)}),o=!1}return W(s.source)}function de(){const e={};return Q(()=>{for(var t in e)e[t].unsubscribe()}),e}function fe(e){var t=v;try{return v=!1,[e(),v]}finally{v=t}}export{ae as a,oe as b,fe as c,ie as h,ee as m,de as s,ue as u};
