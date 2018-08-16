!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/mws-restaurant-stage-1",n(n.s=4)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=function(e){return e&&e.__esModule?e:{default:e}}(n(1));var i=function(){return navigator.serviceWorker?o.default.open("restaurant",1,function(e){e.createObjectStore("restaurants",{keyPath:"id"})}):Promise.resolve()},a=function(){return navigator.serviceWorker?o.default.open("review",1,function(e){e.createObjectStore("reviews",{keyPath:"id"})}):Promise.resolve()},u=function(){return i().then(function(e){if(e)return e.transaction("restaurants").objectStore("restaurants").getAll()})},s=function(){return a().then(function(e){if(e)return e.transaction("reviews").objectStore("reviews").getAll()})},c=function(){return fetch(h.DATABASE_URL).then(d).then(function(e){return e.json()}).then(function(e){return i().then(function(t){if(t){var n=t.transaction("restaurants","readwrite").objectStore("restaurants");e.forEach(function(e){n.put(e)})}}),u()}).catch(function(e){return console.log(e),u()})},l=function(){a().then(function(e){e&&e.transaction("reviews").objectStore("reviews").getAll().then(function(t){console.log("uploading reviews"),t.forEach(function(t){if(String(t.id).startsWith("offline")){var n={restaurant_id:t.restaurant_id,name:t.name,rating:parseInt(t.rating),comments:t.comments};fetch(h.POST_REVIEW_URL,{method:"post",body:JSON.stringify(n)}).then(function(e){}).then(function(n){e.transaction("reviews","readwrite").objectStore("reviews").delete(t.id).then(console.log("deleted"))}).catch(function(e){console.log(e)})}})})})},f=function(e){return fetch(h.get_review_url(e)).then(p).then(function(e){return e.json()}).then(function(e){return a().then(function(t){if(t){var n=t.transaction("reviews","readwrite").objectStore("reviews");e.forEach(function(e){n.put(e)})}}),s()}).catch(function(e){return console.log(e),s()})},d=function(e){return e||u()},p=function(e){return e||s()},h=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}return r(e,null,[{key:"get_review_url",value:function(e){return"http://localhost:1337/reviews/?restaurant_id="+e}},{key:"fetchReviews",value:function(e,t){l(),f(e).then(function(e){t(null,e)})}},{key:"fetchRestaurants",value:function(e){c().then(function(t){e(null,t)})}},{key:"storeReview",value:function(t,n){fetch(e.POST_REVIEW_URL,{method:"post",body:JSON.stringify(t)}).then(function(e){e?n("success"):a().then(function(e){e||n("error"),e.transaction("reviews","readwrite").objectStore("reviews").put(t)}).then(n("offline"))}).catch(function(e){console.log(e),t.id="offline"+String(Date.now()),a().then(function(e){e||n("error"),e.transaction("reviews","readwrite").objectStore("reviews").put(t)}).then(n("offline"))})}},{key:"fetchRestaurantById",value:function(t,n){e.fetchRestaurants(function(e,r){if(e)n(e,null);else{var o=r.find(function(e){return e.id==t});o?n(null,o):n("Restaurant does not exist",null)}})}},{key:"fetchReviewById",value:function(t,n){e.fetchReviews(t,function(e,r){if(e)n(e,null);else{var o=r.filter(function(e){return e.restaurant_id==t});o.length>0?n(null,o):n("no reviews",null)}})}},{key:"fetchRestaurantByCuisine",value:function(t,n){e.fetchRestaurants(function(e,r){if(e)n(e,null);else{var o=r.filter(function(e){return e.cuisine_type==t});n(null,o)}})}},{key:"fetchRestaurantByNeighborhood",value:function(t,n){e.fetchRestaurants(function(e,r){if(e)n(e,null);else{var o=r.filter(function(e){return e.neighborhood==t});n(null,o)}})}},{key:"fetchRestaurantByCuisineAndNeighborhood",value:function(t,n,r){e.fetchRestaurants(function(e,o){if(e)r(e,null);else{var i=o;"all"!=t&&(i=i.filter(function(e){return e.cuisine_type==t})),"all"!=n&&(i=i.filter(function(e){return e.neighborhood==n})),r(null,i)}})}},{key:"fetchNeighborhoods",value:function(t){e.fetchRestaurants(function(e,n){if(e)t(e,null);else{var r=n.map(function(e,t){return n[t].neighborhood}),o=r.filter(function(e,t){return r.indexOf(e)==t});t(null,o)}})}},{key:"fetchCuisines",value:function(t){e.fetchRestaurants(function(e,n){if(e)t(e,null);else{var r=n.map(function(e,t){return n[t].cuisine_type}),o=r.filter(function(e,t){return r.indexOf(e)==t});t(null,o)}})}},{key:"urlForRestaurant",value:function(e){return"./restaurant.html?id="+e.id}},{key:"imageUrlForRestaurant",value:function(e){return"/mws-restaurant-stage-1/img/"+(e.photograph?e.photograph:e.id)+".webp"}},{key:"mapMarkerForRestaurant",value:function(t,n){var r=new L.marker([t.latlng.lat,t.latlng.lng],{title:t.name,alt:t.name,url:e.urlForRestaurant(t)});return r.addTo(newMap),r}},{key:"DATABASE_URL",get:function(){return"http://localhost:1337/restaurants"}},{key:"POST_REVIEW_URL",get:function(){return"http://localhost:1337/reviews/"}}]),e}();t.default=h},function(e,t,n){"use strict";!function(){function t(e){return new Promise(function(t,n){e.onsuccess=function(){t(e.result)},e.onerror=function(){n(e.error)}})}function n(e,n,r){var o,i=new Promise(function(i,a){t(o=e[n].apply(e,r)).then(i,a)});return i.request=o,i}function r(e,t,n){n.forEach(function(n){Object.defineProperty(e.prototype,n,{get:function(){return this[t][n]},set:function(e){this[t][n]=e}})})}function o(e,t,r,o){o.forEach(function(o){o in r.prototype&&(e.prototype[o]=function(){return n(this[t],o,arguments)})})}function i(e,t,n,r){r.forEach(function(r){r in n.prototype&&(e.prototype[r]=function(){return this[t][r].apply(this[t],arguments)})})}function a(e,t,r,o){o.forEach(function(o){o in r.prototype&&(e.prototype[o]=function(){return function(e,t,r){var o=n(e,t,r);return o.then(function(e){if(e)return new s(e,o.request)})}(this[t],o,arguments)})})}function u(e){this._index=e}function s(e,t){this._cursor=e,this._request=t}function c(e){this._store=e}function l(e){this._tx=e,this.complete=new Promise(function(t,n){e.oncomplete=function(){t()},e.onerror=function(){n(e.error)},e.onabort=function(){n(e.error)}})}function f(e,t,n){this._db=e,this.oldVersion=t,this.transaction=new l(n)}function d(e){this._db=e}r(u,"_index",["name","keyPath","multiEntry","unique"]),o(u,"_index",IDBIndex,["get","getKey","getAll","getAllKeys","count"]),a(u,"_index",IDBIndex,["openCursor","openKeyCursor"]),r(s,"_cursor",["direction","key","primaryKey","value"]),o(s,"_cursor",IDBCursor,["update","delete"]),["advance","continue","continuePrimaryKey"].forEach(function(e){e in IDBCursor.prototype&&(s.prototype[e]=function(){var n=this,r=arguments;return Promise.resolve().then(function(){return n._cursor[e].apply(n._cursor,r),t(n._request).then(function(e){if(e)return new s(e,n._request)})})})}),c.prototype.createIndex=function(){return new u(this._store.createIndex.apply(this._store,arguments))},c.prototype.index=function(){return new u(this._store.index.apply(this._store,arguments))},r(c,"_store",["name","keyPath","indexNames","autoIncrement"]),o(c,"_store",IDBObjectStore,["put","add","delete","clear","get","getAll","getKey","getAllKeys","count"]),a(c,"_store",IDBObjectStore,["openCursor","openKeyCursor"]),i(c,"_store",IDBObjectStore,["deleteIndex"]),l.prototype.objectStore=function(){return new c(this._tx.objectStore.apply(this._tx,arguments))},r(l,"_tx",["objectStoreNames","mode"]),i(l,"_tx",IDBTransaction,["abort"]),f.prototype.createObjectStore=function(){return new c(this._db.createObjectStore.apply(this._db,arguments))},r(f,"_db",["name","version","objectStoreNames"]),i(f,"_db",IDBDatabase,["deleteObjectStore","close"]),d.prototype.transaction=function(){return new l(this._db.transaction.apply(this._db,arguments))},r(d,"_db",["name","version","objectStoreNames"]),i(d,"_db",IDBDatabase,["close"]),["openCursor","openKeyCursor"].forEach(function(e){[c,u].forEach(function(t){e in t.prototype&&(t.prototype[e.replace("open","iterate")]=function(){var t=function(e){return Array.prototype.slice.call(e)}(arguments),n=t[t.length-1],r=this._store||this._index,o=r[e].apply(r,t.slice(0,-1));o.onsuccess=function(){n(o.result)}})})}),[u,c].forEach(function(e){e.prototype.getAll||(e.prototype.getAll=function(e,t){var n=this,r=[];return new Promise(function(o){n.iterateCursor(e,function(e){e?(r.push(e.value),void 0===t||r.length!=t?e.continue():o(r)):o(r)})})})});var p={open:function(e,t,r){var o=n(indexedDB,"open",[e,t]),i=o.request;return i&&(i.onupgradeneeded=function(e){r&&r(new f(i.result,e.oldVersion,i.transaction))}),o.then(function(e){return new d(e)})},delete:function(e){return n(indexedDB,"deleteDatabase",[e])}};e.exports=p,e.exports.default=e.exports}()},,,function(e,t,n){"use strict";var r=function(e){return e&&e.__esModule?e:{default:e}}(n(0));"serviceWorker"in navigator&&window.addEventListener("load",function(){navigator.serviceWorker.register("sw.js").then(function(e){navigator.serviceWorker.controller&&(e.waiting?o(e.waiting):e.installing?i(e.installing):e.addEventListener("updatefound",function(){i(e.installing)}))})}),Notification.requestPermission();var o=function(e){e.postMessage({action:"skipWaiting"})},i=function(e){e.addEventListener("statechange",function(){"installed"==e.state&&o(e)})};document.addEventListener("DOMContentLoaded",function(e){a()});var a=function(){u(function(e,t){e?console.error(e):(self.newMap=L.map("map",{center:[t.latlng.lat,t.latlng.lng],zoom:16,scrollWheelZoom:!1}),L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}",{mapboxToken:"pk.eyJ1Ijoia2FudG9sb2dpc3QiLCJhIjoiY2pranN3a2IzMDU5azNxcGJjOWg2OXBkbyJ9.Ic3yoMbrKwlh1ot9gTEmcw",maxZoom:18,attribution:'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',id:"mapbox.streets"}).addTo(self.newMap),p(),r.default.mapMarkerForRestaurant(self.restaurant,self.newMap))})},u=function(e){if(self.restaurant)e(null,self.restaurant);else{var t=h("id");t?r.default.fetchRestaurantById(t,function(t,n){self.restaurant=n,n?(s(),e(null,n)):console.error(t)}):(error="No restaurant id in URL",e(error,null))}},s=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:self.restaurant,t=document.getElementById("restaurant-name");t.setAttribute("tabindex","0"),t.innerHTML=e.name;var n=document.getElementById("restaurant-address");n.setAttribute("tabindex","0"),n.innerHTML=e.address;var o=document.getElementById("restaurant-img");o.className="restaurant-img",o.setAttribute("tabindex","0"),o.alt="image of "+e.name+" restaurant",o.src=r.default.imageUrlForRestaurant(e);var i=document.getElementById("restaurant-cuisine");i.setAttribute("tabindex","0"),i.innerHTML=e.cuisine_type,e.operating_hours&&c(),l()},c=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:self.restaurant.operating_hours,t=document.getElementById("restaurant-hours");for(var n in t.setAttribute("tabindex","0"),e){var r=document.createElement("tr"),o=document.createElement("td");o.innerHTML=n,r.appendChild(o);var i=document.createElement("td");i.innerHTML=e[n],r.appendChild(i),t.appendChild(r)}},l=function(){r.default.fetchReviewById(self.restaurant.id,function(e,t){e?(console.error(e),f()):(self.restaurant.reviews=t,f())})},f=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:self.restaurant.reviews,t=document.getElementById("reviews-container"),n=document.createElement("h2");t.setAttribute("tabindex","0"),n.setAttribute("tabindex","0"),n.innerHTML="Reviews",t.appendChild(n);var o=document.createElement("form");o.setAttribute("id","review_form"),o.setAttribute("method","post"),o.setAttribute("tabindex","0");var i=document.createElement("input");i.setAttribute("type","text"),i.setAttribute("id","user_name"),i.setAttribute("tabindex","0"),i.required=!0,i.setAttribute("name","username"),i.setAttribute("aria-labelledby","name_label");var a=document.createElement("label");a.setAttribute("id","name_label"),a.setAttribute("for","username"),a.setAttribute("tabindex","0"),a.innerHTML="Name";var u=document.createElement("select");u.setAttribute("tabindex","0"),u.setAttribute("id","user_rating"),u.setAttribute("aria-labelledby","rating_label"),u.required=!0,u.setAttribute("name","rating");for(var s=1;s<6;s++){var c=document.createElement("option");c.setAttribute("value",""+s),c.innerHTML=""+s,u.appendChild(c)}var l=document.createElement("label");l.setAttribute("id","rating_label"),l.setAttribute("for","rating"),l.setAttribute("tabindex","0"),l.innerHTML="Rating";var f=document.createElement("textarea");f.setAttribute("tabindex","0"),f.setAttribute("aria-labelledby","comment_label"),f.setAttribute("id","user_comment"),f.required=!0,f.setAttribute("name","comment");var p=document.createElement("label");p.setAttribute("id","comment_label"),p.setAttribute("for","comment"),p.setAttribute("tabindex","0"),p.innerHTML="Comments";var h=document.createElement("button");if(h.setAttribute("type","submit"),h.setAttribute("id","submit"),h.setAttribute("tabindex","0"),h.innerHTML="Submit",h.setAttribute("value","Submit"),o.appendChild(a),o.appendChild(i),o.appendChild(l),o.appendChild(u),o.appendChild(p),o.appendChild(f),o.appendChild(h),o.addEventListener("submit",function(e){e.preventDefault();var t={restaurant_id:self.restaurant.id,name:i.value,rating:parseInt(u.value),comments:f.value};console.log(t),r.default.storeReview(t,function(e){switch(e){case"success":alert("Review posted"),window.location.reload(!1);break;case"offline":alert(" You are currently offline. But your data is stored for now."),window.location.reload(!1);break;default:alert("something bad happened")}})}),t.appendChild(o),!e){var b=document.createElement("p");return b.innerHTML="No reviews yet!",b.setAttribute("tabindex","0"),void t.appendChild(b)}var m=document.getElementById("reviews-list");m.setAttribute("tabindex","0"),e.forEach(function(e){m.appendChild(d(e))}),t.appendChild(m)},d=function(e){var t=document.createElement("li"),n=document.createElement("p");t.setAttribute("tabindex","0"),n.setAttribute("tabindex","0"),n.innerHTML=e.name,t.appendChild(n);var r=document.createElement("p");r.innerHTML="Rating: "+e.rating,r.setAttribute("tabindex","0"),t.appendChild(r);var o=document.createElement("p");return o.innerHTML=e.comments,o.setAttribute("tabindex","0"),t.appendChild(o),t},p=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:self.restaurant,t=document.getElementById("breadcrumb"),n=document.createElement("li");n.setAttribute("tabindex","0"),t.setAttribute("tabindex","0"),n.innerHTML=e.name,t.appendChild(n)},h=function(e,t){t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");var n=new RegExp("[?&]"+e+"(=([^&#]*)|&|#|$)").exec(t);return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null}}]);