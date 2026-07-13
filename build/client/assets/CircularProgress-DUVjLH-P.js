import{R as N,r as g,j as c}from"./jsx-runtime-WrAyFm7i.js";import{g as U,a as E,u as T,b as F,p as l,d as z,s as u,q as v,L as A,X as I,Y as R}from"./Box-CQ3Vu3f3.js";let $=0;function G(r){const[e,s]=g.useState(r),a=r||e;return g.useEffect(()=>{e==null&&($+=1,s(`mui-${$}`))},[e]),a}const K={...N},D=K.useId;function O(r){if(D!==void 0){const e=D();return r??e}return G(r)}function V(r){return U("MuiCircularProgress",r)}E("MuiCircularProgress",["root","determinate","indeterminate","colorPrimary","colorSecondary","svg","track","circle","circleDeterminate","circleIndeterminate","circleDisableShrink"]);const t=44,y=R`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`,h=R`
  0% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -15px;
  }

  100% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: -126px;
  }
`,W=typeof y!="string"?I`
        animation: ${y} 1.4s linear infinite;
      `:null,q=typeof h!="string"?I`
        animation: ${h} 1.4s ease-in-out infinite;
      `:null,B=r=>{const{classes:e,variant:s,color:a,disableShrink:d}=r,p={root:["root",s,`color${l(a)}`],svg:["svg"],track:["track"],circle:["circle",`circle${l(s)}`,d&&"circleDisableShrink"]};return z(p,V,e)},L=u("span",{name:"MuiCircularProgress",slot:"Root",overridesResolver:(r,e)=>{const{ownerState:s}=r;return[e.root,e[s.variant],e[`color${l(s.color)}`]]}})(v(({theme:r})=>({display:"inline-block",variants:[{props:{variant:"determinate"},style:{transition:r.transitions.create("transform")}},{props:{variant:"indeterminate"},style:W||{animation:`${y} 1.4s linear infinite`}},...Object.entries(r.palette).filter(A()).map(([e])=>({props:{color:e},style:{color:(r.vars||r).palette[e].main}}))]}))),X=u("svg",{name:"MuiCircularProgress",slot:"Svg"})({display:"block"}),Y=u("circle",{name:"MuiCircularProgress",slot:"Circle",overridesResolver:(r,e)=>{const{ownerState:s}=r;return[e.circle,e[`circle${l(s.variant)}`],s.disableShrink&&e.circleDisableShrink]}})(v(({theme:r})=>({stroke:"currentColor",variants:[{props:{variant:"determinate"},style:{transition:r.transitions.create("stroke-dashoffset")}},{props:{variant:"indeterminate"},style:{strokeDasharray:"80px, 200px",strokeDashoffset:0}},{props:({ownerState:e})=>e.variant==="indeterminate"&&!e.disableShrink,style:q||{animation:`${h} 1.4s ease-in-out infinite`}}]}))),Z=u("circle",{name:"MuiCircularProgress",slot:"Track"})(v(({theme:r})=>({stroke:"currentColor",opacity:(r.vars||r).palette.action.activatedOpacity}))),Q=g.forwardRef(function(e,s){const a=T({props:e,name:"MuiCircularProgress"}),{className:d,color:p="primary",disableShrink:M=!1,enableTrackSlot:x=!1,size:f=40,style:j,thickness:o=3.6,value:m=0,variant:C="indeterminate",...w}=a,i={...a,color:p,disableShrink:M,size:f,thickness:o,value:m,variant:C,enableTrackSlot:x},n=B(i),k={},P={},S={};if(C==="determinate"){const b=2*Math.PI*((t-o)/2);k.strokeDasharray=b.toFixed(3),S["aria-valuenow"]=Math.round(m),k.strokeDashoffset=`${((100-m)/100*b).toFixed(3)}px`,P.transform="rotate(-90deg)"}return c.jsx(L,{className:F(n.root,d),style:{width:f,height:f,...P,...j},ownerState:i,ref:s,role:"progressbar",...S,...w,children:c.jsxs(X,{className:n.svg,ownerState:i,viewBox:`${t/2} ${t/2} ${t} ${t}`,children:[x?c.jsx(Z,{className:n.track,ownerState:i,cx:t,cy:t,r:(t-o)/2,fill:"none",strokeWidth:o,"aria-hidden":"true"}):null,c.jsx(Y,{className:n.circle,style:k,ownerState:i,cx:t,cy:t,r:(t-o)/2,fill:"none",strokeWidth:o})]})})});export{Q as C,O as u};
