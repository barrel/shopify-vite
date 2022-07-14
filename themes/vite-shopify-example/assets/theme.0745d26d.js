const f="modulepreload",m=function(o,r){return new URL(o,r).href},a={},h=function(r,s,l){return!s||s.length===0?r():Promise.all(s.map(e=>{if(e=m(e,l),e in a)return;a[e]=!0;const t=e.endsWith(".css"),i=t?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${e}"]${i}`))return;const n=document.createElement("link");if(n.rel=t?"stylesheet":f,t||(n.as="script",n.crossOrigin=""),n.href=e,document.head.appendChild(n),t)return new Promise((u,d)=>{n.addEventListener("load",u),n.addEventListener("error",()=>d(new Error(`Unable to preload CSS for ${e}`)))})})).then(()=>r())},p=function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))l(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const i of t.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&l(i)}).observe(document,{childList:!0,subtree:!0});function s(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function l(e){if(e.ep)return;e.ep=!0;const t=s(e);fetch(e.href,t)}};p();const g=""+new URL("vite.4a748afd.svg",import.meta.url).href,y=""+new URL("shopify.ab6ef553.svg",import.meta.url).href,c=document.createElement("div");c.className="app";c.innerHTML=`
  <a href="https://vitejs.dev" target="_blank">
    <img src="${g}" class="logo" alt="Vite logo" />
  </a>
  <a href="https://shopify.dev/themes" target="_blank">
    <img src="${y}" class="logo vanilla" alt="Shopify logo" />
  </a>
  <h1>Hello Vite!</h1>
  <div class="card">
    <button id="counter" type="button"></button>
  </div>
  <p class="read-the-docs">
    Click on the Vite logo to learn more
  </p>
`;document.body.appendChild(c);h(()=>import("./counter.d37853c9.js"),[],import.meta.url).then(({setupCounter:o})=>{o(document.querySelector("#counter"))}).catch(o=>{console.error(o)});
//# sourceMappingURL=theme.0745d26d.js.map
