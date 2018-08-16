let restaurant;
var newMap;
import DBHelper from "./dbhelper";



// register service worker
if('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then((reg) => {
            if (!navigator.serviceWorker.controller) {
                return;
            }

            if (reg.waiting) {
                updateReady(reg.waiting);
                return;
            }

            if (reg.installing) {
                trackInstalling(reg.installing);
                return;
            }

            reg.addEventListener('updatefound', function () {
                trackInstalling(reg.installing);
            });
        });
    });
}


// ask for notification permission
Notification.requestPermission();

// function for handling errors
const handleErrors = (response) => {
    if(!response) {
        throw Error(response.statusText);
    }
    return response;
};

// DBHelper.fetchRestaurantsOnline();


const updateReady = (worker) => {
    worker.postMessage({action: 'skipWaiting'});
};

const trackInstalling = (worker) => {
    worker.addEventListener('statechange', function() {
        if (worker.state == 'installed') {
            updateReady(worker);
        }
    });
};



/**
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {  
  initMap();
});

/**
 * Initialize leaflet map
 */
let initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {      
      self.newMap = L.map('map', {
        center: [restaurant.latlng.lat, restaurant.latlng.lng],
        zoom: 16,
        scrollWheelZoom: false
      });
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
        mapboxToken: 'pk.eyJ1Ijoia2FudG9sb2dpc3QiLCJhIjoiY2pranN3a2IzMDU5azNxcGJjOWg2OXBkbyJ9.Ic3yoMbrKwlh1ot9gTEmcw',
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'    
      }).addTo(self.newMap);
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
    }
  });
};
 
/* window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
} */

/**
 * Get current restaurant from page URL.
 */
let fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant);
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL';
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
};

/**
 * Create restaurant HTML and add it to the webpage
 */
let fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.setAttribute("tabindex", "0");
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.setAttribute("tabindex", "0");
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img';
  image.setAttribute("tabindex", "0");
  image.alt = `image of ${restaurant.name} restaurant`;
  image.src = DBHelper.imageUrlForRestaurant(restaurant);

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.setAttribute("tabindex", "0");
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fetch reviews
  fetchReviews();
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
let fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  hours.setAttribute("tabindex", "0");
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
};


let fetchReviews = () => {
    DBHelper.fetchReviewById(self.restaurant.id, (error, reviews) => {
        if (error) { // Got an error!
            console.error(error);
            fillReviewsHTML();
        } else {
            self.restaurant.reviews = reviews;
            fillReviewsHTML();
        }
    });
};

/**
 * Create all reviews HTML and add them to the webpage.
 */
let fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h2');
  container.setAttribute("tabindex", "0");
  title.setAttribute("tabindex", "0");
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  // favourite  button
    const fav  = document.createElement("input");
    fav.setAttribute('type',"checkbox");
    fav.setAttribute("id", "fav_button");
    fav.setAttribute("tabindex", "0");
    fav.setAttribute('name',"favourite");
    fav.setAttribute("aria-labelledby", "fav_label");
    fav.setAttribute("role", "checkbox");
    if(self.restaurant.is_favorite === "true") {
        fav.checked = true;
        fav.setAttribute("aria-checked", "true");
    } else {
        fav.checked = false;
        fav.setAttribute("aria-checked", "false");
    }

    const fav_label = document.createElement("label");
    fav_label.setAttribute("id", "fav_label");
    fav_label.setAttribute("for", "favourite");
    fav_label.innerHTML = "Favourite?";

    fav.addEventListener("change", (e) => {
        fav.disabled = true;
        if (fav.checked == true){
            fetch(`http://localhost:1337/restaurants/${self.restaurant.id}/?is_favorite=true`, {
                method: "PUT"
            }).then((response) => {
                if (response.status == 200) fav.disabled = false;
                else {
                    fav.checked = false;
                    fav.setAttribute("aria-checked", "false");
                    fav.disabled = false;}
            }).catch((error) => {
                console.log(error);
                fav.checked = false;
                fav.setAttribute("aria-checked", "false");
                fav.disabled = false;
            })
        } else {
            fetch(`http://localhost:1337/restaurants/${self.restaurant.id}/?is_favorite=false`, {
                method: "PUT"
            }).then((response) => {
                if (response.status == 200) fav.disabled = false;
                else {
                    fav.checked = true;
                    fav.setAttribute("aria-checked", "true");
                    fav.disabled = false;
                }
            }).catch((error) => {
                console.log(error);
                fav.checked = true;
                fav.setAttribute("aria-checked", "true");
                fav.disabled = false;
            })
        }
    });

  container.appendChild(fav_label);
  container.appendChild(fav);

  const form = document.createElement('form');
  form.setAttribute("id", "review_form");
  form.setAttribute("method", "post");
  // form.setAttribute("action", "");
  form.setAttribute("tabindex", "0");

  // const id  = document.createElement("input");
  // id.setAttribute('type',"text");
  // id.setAttribute('name',"id");
  // id.readOnly = true;
  // id.setAttribute("tabindex", "0");
  // id.setAttribute("value", self.restaurant.id);
  //
  // const id_label = document.createElement("label");
  // id_label.setAttribute("for", "id");
  // id_label.setAttribute("tabindex", "0");
  // id_label.innerHTML = "Restaurant Id";

  const name  = document.createElement("input");
  name.setAttribute('type',"text");
  name.setAttribute("id", "user_name");
  name.setAttribute("tabindex", "0");
  name.required = true;
  name.setAttribute('name',"username");
  name.setAttribute("aria-labelledby", "name_label");

  const name_label = document.createElement("label");
  name_label.setAttribute("id", "name_label");
  name_label.setAttribute("for", "username");
  name_label.setAttribute("tabindex", "0");
  name_label.innerHTML = "Name";

  const rating  = document.createElement("select");
  // rating.setAttribute('type',"text");
  rating.setAttribute("tabindex", "0");
  rating.setAttribute("id", "user_rating");
  rating.setAttribute("aria-labelledby", "rating_label");
  rating.required = true;
  rating.setAttribute('name',"rating");
  for (let i=1; i<6; i++ ){
      const op = document.createElement("option");
      op.setAttribute("value", `${i}`);
      op.innerHTML = `${i}`;
      rating.appendChild(op);
  }

  const rating_label = document.createElement("label");
  rating_label.setAttribute("id", "rating_label");
  rating_label.setAttribute("for", "rating");
  rating_label.setAttribute("tabindex", "0");
  rating_label.innerHTML = "Rating";

  const comment  = document.createElement("textarea");
  // comment.setAttribute('type',"text");
  comment.setAttribute("tabindex", "0");
  comment.setAttribute("aria-labelledby", "comment_label");
  comment.setAttribute("id", "user_comment");
  comment.required = true;
  comment.setAttribute('name',"comment");

  const comment_label = document.createElement("label");
  comment_label.setAttribute("id", "comment_label");
  comment_label.setAttribute("for", "comment");
  comment_label.setAttribute("tabindex", "0");
  comment_label.innerHTML = "Comments";

  const s = document.createElement("button");
  s.setAttribute('type',"submit");
  s.setAttribute('id', "submit");
  s.setAttribute("tabindex", "0");
  s.innerHTML = "Submit";
  s.setAttribute('value',"Submit");

  // form.appendChild(id_label);
  // form.appendChild(id);

  form.appendChild(name_label);
  form.appendChild(name);

  form.appendChild(rating_label);
  form.appendChild(rating);

  form.appendChild(comment_label);
  form.appendChild(comment);

  form.appendChild(s);

  form.addEventListener("submit", (e) => {
        e.preventDefault();
        // const name  = document.getElementById("user_name");
        // const rating  = document.getElementById("user_rating");
        // const comment  = document.getElementById("user_comment");
        const payload = {"restaurant_id": self.restaurant.id,
            "name": name.value,
            "rating": parseInt(rating.value),
            "comments": comment.value};
        console.log(payload);

        DBHelper.storeReview(payload, (status) => {
            switch(status) {
                case "success":
                    alert("Review posted");
                    window.location.reload(false);
                    break;
                case "offline":
                    alert(" You are currently offline. But your data is stored for now.");
                    window.location.reload(false);
                    break;
                default:
                    alert("something bad happened");
                    break;
            }
        })
    });

  container.appendChild(form);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    noReviews.setAttribute("tabindex", "0");
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  ul.setAttribute("tabindex", "0");
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
};


/**
 * Create review HTML and add it to the webpage.
 */
let createReviewHTML = (review) => {
  const li = document.createElement('li');
  const name = document.createElement('p');
  li.setAttribute("tabindex", "0");
  name.setAttribute("tabindex", "0");
  name.innerHTML = review.name;
  li.appendChild(name);

  // const date = document.createElement('p');
  // date.innerHTML = review.updatedAt;
  // date.setAttribute("tabindex", "0");
  // li.appendChild(date);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  rating.setAttribute("tabindex", "0");
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  comments.setAttribute("tabindex", "0");
  li.appendChild(comments);

  return li;
};

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
let fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.setAttribute("tabindex", "0");
  breadcrumb.setAttribute("tabindex", "0");
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
};

/**
 * Get a parameter by name from page URL.
 */
let getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};
