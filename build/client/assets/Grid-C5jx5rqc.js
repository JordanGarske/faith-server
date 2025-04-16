import{i as H,e as J}from"./Button-DaxGkc4Z.js";import{r as $,l as Q}from"./chunk-XJI4KG32-Dbao5bvq.js";import{u as T,i as V,c as X,a as Y,j as Z}from"./Box-D8yNCgNg.js";import{d as I,e as ee,c as ne,s as te,u as re}from"./createSimplePaletteValueFilter-BcJO3yJu.js";const se=I();function oe(e){const{theme:n,name:t,props:s}=e;return!n||!n.components||!n.components[t]||!n.components[t].defaultProps?s:ee(n.components[t].defaultProps,s)}function ie({props:e,name:n,defaultTheme:t,themeId:s}){let r=T(t);return s&&(r=r[s]||r),oe({theme:r,name:n,props:e})}const ce=(e,n)=>e.filter(t=>n.includes(t)),S=(e,n,t)=>{const s=e.keys[0];Array.isArray(n)?n.forEach((r,o)=>{t((i,p)=>{o<=e.keys.length-1&&(o===0?Object.assign(i,p):i[e.up(e.keys[o])]=p)},r)}):n&&typeof n=="object"?(Object.keys(n).length>e.keys.length?e.keys:ce(e.keys,Object.keys(n))).forEach(o=>{if(e.keys.includes(o)){const i=n[o];i!==void 0&&t((p,G)=>{s===o?Object.assign(p,G):p[e.up(o)]=G},i)}}):(typeof n=="number"||typeof n=="string")&&t((r,o)=>{Object.assign(r,o)},n)};function b(e){return`--Grid-${e}Spacing`}function x(e){return`--Grid-parent-${e}Spacing`}const E="--Grid-columns",y="--Grid-parent-columns",ae=({theme:e,ownerState:n})=>{const t={};return S(e.breakpoints,n.size,(s,r)=>{let o={};r==="grow"&&(o={flexBasis:0,flexGrow:1,maxWidth:"100%"}),r==="auto"&&(o={flexBasis:"auto",flexGrow:0,flexShrink:0,maxWidth:"none",width:"auto"}),typeof r=="number"&&(o={flexGrow:0,flexBasis:"auto",width:`calc(100% * ${r} / var(${y}) - (var(${y}) - ${r}) * (var(${x("column")}) / var(${y})))`}),s(t,o)}),t},fe=({theme:e,ownerState:n})=>{const t={};return S(e.breakpoints,n.offset,(s,r)=>{let o={};r==="auto"&&(o={marginLeft:"auto"}),typeof r=="number"&&(o={marginLeft:r===0?"0px":`calc(100% * ${r} / var(${y}) + var(${x("column")}) * ${r} / var(${y}))`}),s(t,o)}),t},le=({theme:e,ownerState:n})=>{if(!n.container)return{};const t={[E]:12};return S(e.breakpoints,n.columns,(s,r)=>{const o=r??12;s(t,{[E]:o,"> *":{[y]:o}})}),t},ue=({theme:e,ownerState:n})=>{if(!n.container)return{};const t={};return S(e.breakpoints,n.rowSpacing,(s,r)=>{var i;const o=typeof r=="string"?r:(i=e.spacing)==null?void 0:i.call(e,r);s(t,{[b("row")]:o,"> *":{[x("row")]:o}})}),t},me=({theme:e,ownerState:n})=>{if(!n.container)return{};const t={};return S(e.breakpoints,n.columnSpacing,(s,r)=>{var i;const o=typeof r=="string"?r:(i=e.spacing)==null?void 0:i.call(e,r);s(t,{[b("column")]:o,"> *":{[x("column")]:o}})}),t},pe=({theme:e,ownerState:n})=>{if(!n.container)return{};const t={};return S(e.breakpoints,n.direction,(s,r)=>{s(t,{flexDirection:r})}),t},de=({ownerState:e})=>({minWidth:0,boxSizing:"border-box",...e.container&&{display:"flex",flexWrap:"wrap",...e.wrap&&e.wrap!=="wrap"&&{flexWrap:e.wrap},gap:`var(${b("row")}) var(${b("column")})`}}),ge=e=>{const n=[];return Object.entries(e).forEach(([t,s])=>{s!==!1&&s!==void 0&&n.push(`grid-${t}-${String(s)}`)}),n},ye=(e,n="xs")=>{function t(s){return s===void 0?!1:typeof s=="string"&&!Number.isNaN(Number(s))||typeof s=="number"&&s>0}if(t(e))return[`spacing-${n}-${String(e)}`];if(typeof e=="object"&&!Array.isArray(e)){const s=[];return Object.entries(e).forEach(([r,o])=>{t(o)&&s.push(`spacing-${r}-${String(o)}`)}),s}return[]},Se=e=>e===void 0?[]:typeof e=="object"?Object.entries(e).map(([n,t])=>`direction-${n}-${t}`):[`direction-xs-${String(e)}`];function Ge(e,n){e.item!==void 0&&delete e.item,e.zeroMinWidth!==void 0&&delete e.zeroMinWidth,n.keys.forEach(t=>{e[t]!==void 0&&delete e[t]})}const $e=Z(),be=se("div",{name:"MuiGrid",slot:"Root",overridesResolver:(e,n)=>n.root});function xe(e){return ie({props:e,name:"MuiGrid",defaultTheme:$e})}function he(e={}){const{createStyledComponent:n=be,useThemeProps:t=xe,useTheme:s=T,componentName:r="MuiGrid"}=e,o=(l,a)=>{const{container:d,direction:f,spacing:u,wrap:c,size:h}=l,w={root:["root",d&&"container",c!=="wrap"&&`wrap-xs-${String(c)}`,...Se(f),...ge(h),...d?ye(u,a.breakpoints.keys[0]):[]]};return ne(w,k=>Y(r,k),{})};function i(l,a,d=()=>!0){const f={};return l===null||(Array.isArray(l)?l.forEach((u,c)=>{u!==null&&d(u)&&a.keys[c]&&(f[a.keys[c]]=u)}):typeof l=="object"?Object.keys(l).forEach(u=>{const c=l[u];c!=null&&d(c)&&(f[u]=c)}):f[a.keys[0]]=l),f}const p=n(le,me,ue,ae,pe,de,fe),G=$.forwardRef(function(a,d){const f=s(),u=t(a),c=V(u);Ge(c,f.breakpoints);const{className:h,children:w,columns:k=12,container:C=!1,component:z="div",direction:O="row",wrap:M="wrap",size:R={},offset:W={},spacing:j=0,rowSpacing:A=j,columnSpacing:B=j,unstable_level:g=0,...D}=c,L=i(R,f.breakpoints,m=>m!==!1),_=i(W,f.breakpoints),K=a.columns??(g?void 0:k),U=a.spacing??(g?void 0:j),q=a.rowSpacing??a.spacing??(g?void 0:A),v=a.columnSpacing??a.spacing??(g?void 0:B),P={...c,level:g,columns:K,container:C,direction:O,wrap:M,spacing:U,rowSpacing:q,columnSpacing:v,size:L,offset:_},F=o(P,f);return Q.jsx(p,{ref:d,as:z,ownerState:P,className:X(F.root,h),...D,children:$.Children.map(w,m=>{var N;return $.isValidElement(m)&&H(m,["Grid"])&&C&&m.props.container?$.cloneElement(m,{unstable_level:((N=m.props)==null?void 0:N.unstable_level)??g+1}):m})})});return G.muiName="Grid",G}const Pe=he({createStyledComponent:te("div",{name:"MuiGrid",slot:"Root",overridesResolver:(e,n)=>{const{ownerState:t}=e;return[n.root,t.container&&n.container]}}),componentName:"MuiGrid",useThemeProps:e=>re({props:e,name:"MuiGrid"}),useTheme:J});export{Pe as G};
