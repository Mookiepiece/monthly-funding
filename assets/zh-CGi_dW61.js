import{g as m,d as i,c as f}from"./index-BiTSbG06.js";function u(n,a){for(var _=0;_<a.length;_++){const e=a[_];if(typeof e!="string"&&!Array.isArray(e)){for(const r in e)if(r!=="default"&&!(r in n)){const o=Object.getOwnPropertyDescriptor(e,r);o&&Object.defineProperty(n,r,o.get?o:{enumerable:!0,get:()=>e[r]})}}}return Object.freeze(Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}))}var d={exports:{}};(function(n,a){(function(_,e){n.exports=e(i)})(f,function(_){function e(t){return t&&typeof t=="object"&&"default"in t?t:{default:t}}var r=e(_),o={name:"zh",weekdays:"星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),weekdaysShort:"周日_周一_周二_周三_周四_周五_周六".split("_"),weekdaysMin:"日_一_二_三_四_五_六".split("_"),months:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),ordinal:function(t,l){return l==="W"?t+"周":t+"日"},weekStart:1,yearStart:4,formats:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY/MM/DD",LL:"YYYY年M月D日",LLL:"YYYY年M月D日Ah点mm分",LLLL:"YYYY年M月D日ddddAh点mm分",l:"YYYY/M/D",ll:"YYYY年M月D日",lll:"YYYY年M月D日 HH:mm",llll:"YYYY年M月D日dddd HH:mm"},relativeTime:{future:"%s后",past:"%s前",s:"几秒",m:"1 分钟",mm:"%d 分钟",h:"1 小时",hh:"%d 小时",d:"1 天",dd:"%d 天",M:"1 个月",MM:"%d 个月",y:"1 年",yy:"%d 年"},meridiem:function(t,l){var s=100*t+l;return s<600?"凌晨":s<900?"早上":s<1100?"上午":s<1300?"中午":s<1800?"下午":"晚上"}};return r.default.locale(o,null,!0),o})})(d);var Y=d.exports;const p=m(Y),y=u({__proto__:null,default:p},[Y]);export{y as z};
