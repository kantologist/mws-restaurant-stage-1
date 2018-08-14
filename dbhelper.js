!function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/mws-restaurant-stage-1",n(n.s=0)}([function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),o=function(t){return t&&t.__esModule?t:{default:t}}(n(1));var u=function(){return navigator.serviceWorker?o.default.open("restaurant",1,function(t){t.createObjectStore("restaurants",{keyPath:"id"})}):Promise.resolve()},i=function(){return u().then(function(t){if(t)return t.transaction("restaurants").objectStore("restaurants").getAll()})},a=function(){return fetch(s.DATABASE_URL).then(c).then(function(t){return t.json()}).then(function(t){return u().then(function(e){if(e){var n=e.transaction("restaurants","readwrite").objectStore("restaurants");t.forEach(function(t){n.put(t)})}}),i()}).catch(function(t){return console.log(t),i()})},c=function(t){return t||i()},s=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t)}return r(t,null,[{key:"fetchRestaurants",value:function(t){a().then(function(e){t(null,e)})}},{key:"fetchRestaurantById",value:function(e,n){t.fetchRestaurants(function(t,r){if(t)n(t,null);else{var o=r.find(function(t){return t.id==e});o?n(null,o):n("Restaurant does not exist",null)}})}},{key:"fetchRestaurantByCuisine",value:function(e,n){t.fetchRestaurants(function(t,r){if(t)n(t,null);else{var o=r.filter(function(t){return t.cuisine_type==e});n(null,o)}})}},{key:"fetchRestaurantByNeighborhood",value:function(e,n){t.fetchRestaurants(function(t,r){if(t)n(t,null);else{var o=r.filter(function(t){return t.neighborhood==e});n(null,o)}})}},{key:"fetchRestaurantByCuisineAndNeighborhood",value:function(e,n,r){t.fetchRestaurants(function(t,o){if(t)r(t,null);else{var u=o;"all"!=e&&(u=u.filter(function(t){return t.cuisine_type==e})),"all"!=n&&(u=u.filter(function(t){return t.neighborhood==n})),r(null,u)}})}},{key:"fetchNeighborhoods",value:function(e){t.fetchRestaurants(function(t,n){if(t)e(t,null);else{var r=n.map(function(t,e){return n[e].neighborhood}),o=r.filter(function(t,e){return r.indexOf(t)==e});e(null,o)}})}},{key:"fetchCuisines",value:function(e){t.fetchRestaurants(function(t,n){if(t)e(t,null);else{var r=n.map(function(t,e){return n[e].cuisine_type}),o=r.filter(function(t,e){return r.indexOf(t)==e});e(null,o)}})}},{key:"urlForRestaurant",value:function(t){return"./restaurant.html?id="+t.id}},{key:"imageUrlForRestaurant",value:function(t){return"/mws-restaurant-stage-1/img/"+(t.photograph?t.photograph:t.id)+".jpg"}},{key:"mapMarkerForRestaurant",value:function(e,n){var r=new L.marker([e.latlng.lat,e.latlng.lng],{title:e.name,alt:e.name,url:t.urlForRestaurant(e)});return r.addTo(newMap),r}},{key:"DATABASE_URL",get:function(){return"http://localhost:1337/restaurants"}}]),t}();e.default=s},function(t,e,n){"use strict";!function(){function e(t){return new Promise(function(e,n){t.onsuccess=function(){e(t.result)},t.onerror=function(){n(t.error)}})}function n(t,n,r){var o,u=new Promise(function(u,i){e(o=t[n].apply(t,r)).then(u,i)});return u.request=o,u}function r(t,e,n){n.forEach(function(n){Object.defineProperty(t.prototype,n,{get:function(){return this[e][n]},set:function(t){this[e][n]=t}})})}function o(t,e,r,o){o.forEach(function(o){o in r.prototype&&(t.prototype[o]=function(){return n(this[e],o,arguments)})})}function u(t,e,n,r){r.forEach(function(r){r in n.prototype&&(t.prototype[r]=function(){return this[e][r].apply(this[e],arguments)})})}function i(t,e,r,o){o.forEach(function(o){o in r.prototype&&(t.prototype[o]=function(){return function(t,e,r){var o=n(t,e,r);return o.then(function(t){if(t)return new c(t,o.request)})}(this[e],o,arguments)})})}function a(t){this._index=t}function c(t,e){this._cursor=t,this._request=e}function s(t){this._store=t}function f(t){this._tx=t,this.complete=new Promise(function(e,n){t.oncomplete=function(){e()},t.onerror=function(){n(t.error)},t.onabort=function(){n(t.error)}})}function l(t,e,n){this._db=t,this.oldVersion=e,this.transaction=new f(n)}function p(t){this._db=t}r(a,"_index",["name","keyPath","multiEntry","unique"]),o(a,"_index",IDBIndex,["get","getKey","getAll","getAllKeys","count"]),i(a,"_index",IDBIndex,["openCursor","openKeyCursor"]),r(c,"_cursor",["direction","key","primaryKey","value"]),o(c,"_cursor",IDBCursor,["update","delete"]),["advance","continue","continuePrimaryKey"].forEach(function(t){t in IDBCursor.prototype&&(c.prototype[t]=function(){var n=this,r=arguments;return Promise.resolve().then(function(){return n._cursor[t].apply(n._cursor,r),e(n._request).then(function(t){if(t)return new c(t,n._request)})})})}),s.prototype.createIndex=function(){return new a(this._store.createIndex.apply(this._store,arguments))},s.prototype.index=function(){return new a(this._store.index.apply(this._store,arguments))},r(s,"_store",["name","keyPath","indexNames","autoIncrement"]),o(s,"_store",IDBObjectStore,["put","add","delete","clear","get","getAll","getKey","getAllKeys","count"]),i(s,"_store",IDBObjectStore,["openCursor","openKeyCursor"]),u(s,"_store",IDBObjectStore,["deleteIndex"]),f.prototype.objectStore=function(){return new s(this._tx.objectStore.apply(this._tx,arguments))},r(f,"_tx",["objectStoreNames","mode"]),u(f,"_tx",IDBTransaction,["abort"]),l.prototype.createObjectStore=function(){return new s(this._db.createObjectStore.apply(this._db,arguments))},r(l,"_db",["name","version","objectStoreNames"]),u(l,"_db",IDBDatabase,["deleteObjectStore","close"]),p.prototype.transaction=function(){return new f(this._db.transaction.apply(this._db,arguments))},r(p,"_db",["name","version","objectStoreNames"]),u(p,"_db",IDBDatabase,["close"]),["openCursor","openKeyCursor"].forEach(function(t){[s,a].forEach(function(e){t in e.prototype&&(e.prototype[t.replace("open","iterate")]=function(){var e=function(t){return Array.prototype.slice.call(t)}(arguments),n=e[e.length-1],r=this._store||this._index,o=r[t].apply(r,e.slice(0,-1));o.onsuccess=function(){n(o.result)}})})}),[a,s].forEach(function(t){t.prototype.getAll||(t.prototype.getAll=function(t,e){var n=this,r=[];return new Promise(function(o){n.iterateCursor(t,function(t){t?(r.push(t.value),void 0===e||r.length!=e?t.continue():o(r)):o(r)})})})});var h={open:function(t,e,r){var o=n(indexedDB,"open",[t,e]),u=o.request;return u&&(u.onupgradeneeded=function(t){r&&r(new l(u.result,t.oldVersion,u.transaction))}),o.then(function(t){return new p(t)})},delete:function(t){return n(indexedDB,"deleteDatabase",[t])}};t.exports=h,t.exports.default=t.exports}()}]);