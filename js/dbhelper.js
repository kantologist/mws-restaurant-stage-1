import idb from 'idb';

/**
 * Common database helper functions.
 */



// function for opening restaurants database
const openRestaurantDataBase = () =>  {
    if (!navigator.serviceWorker) {
        return Promise.resolve();
    }

    return idb.open('restaurant', 1, (upgradeDb) => {
        const store = upgradeDb.createObjectStore('restaurants', {
            keyPath: 'id'
        })
    })
};

// function for opening reviews database
const openReviewsDataBase = () =>  {
    if (!navigator.serviceWorker) {
        return Promise.resolve();
    }

    return idb.open('review', 1, (upgradeDb) => {
        const store = upgradeDb.createObjectStore('reviews', {
            keyPath: 'id'
        })
    })
};

const fetchRestaurantsLocally = () =>  {
    return openRestaurantDataBase(). then((db) => {
        if(!db) return;
        const store = db.transaction('restaurants').objectStore('restaurants');

        return store.getAll();
    })
};

const fetchReviewsLocally = () => {
    return openReviewsDataBase().then((db) => {
        if(!db) return;
        const store = db.transaction('reviews').objectStore('reviews');

        return store.getAll();
    })
};

const fetchRestaurantsOnline = ()  => {
    return fetch(DBHelper.DATABASE_URL)
        .then(handleErrors)
        .then(
            (response) => {
                // console.log(response.json());
                return response.json();
            })
        .then(
            (restaurants) => {
                openRestaurantDataBase().then((db) => {
                    if (!db) return;
                    const tx = db.transaction('restaurants', 'readwrite');
                    const store = tx.objectStore('restaurants');
                    restaurants.forEach((restaurant) => {
                        store.put(restaurant);
                    });
                });
                return fetchRestaurantsLocally();
            }).catch((error) => {
            console.log(error);
            return fetchRestaurantsLocally();
    });
};

const updateReviewOnline = () => {
    openReviewsDataBase().then((db) => {
        if(!db) return;
        const store = db.transaction('reviews').objectStore('reviews');
        store.getAll().then((reviews) => {
            console.log("uploading reviews");

            reviews.forEach((review) => {
                // console.log(review);
                if(String(review["id"]).startsWith("offline")){
                    const payload = {"restaurant_id": review.restaurant_id,
                        "name": review.name,
                        "rating": parseInt(review.rating),
                        "comments": review.comments};
                    fetch(DBHelper.POST_REVIEW_URL,{
                        method: 'post',
                        body: JSON.stringify(payload),
                    }).then((response) => {
                        // console.log(response);
                    }).then((response) => {
                        const tx = db.transaction('reviews', 'readwrite');
                        const store = tx.objectStore('reviews');
                        store.delete(review.id).then(
                          console.log("deleted")
                        )}
                    ).catch((error) => {
                        console.log(error);
                    });
                }
            });
        });
    })
};

const fetchReviewsOnline = (id)  => {
    return fetch(DBHelper.get_review_url(id))
        .then(handleReviewsErrors)
        .then(
            (response) => {
                // console.log(response.json());
                return response.json();
            })
        .then(
            (reviews) => {
                openReviewsDataBase().then((db) => {
                    if (!db) return;
                    const tx = db.transaction('reviews', 'readwrite');
                    const store = tx.objectStore('reviews');
                    reviews.forEach((review) => {
                        store.put(review);
                    });
                });
                return fetchReviewsLocally();
            }).catch((error) => {
            console.log(error);
            return fetchReviewsLocally();
        });
};


// function for handling errors
const handleErrors = (response) =>  {
    if(!response) {
        return fetchRestaurantsLocally();
        // throw Error(response.statusText);
    }
    return response;
};

// function for handling errors
const handleReviewsErrors = (response) =>  {
    if(!response) {
        return fetchReviewsLocally();
        // throw Error(response.statusText);
    }
    return response;
};



class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337; // Change this to your server port
    return `http://localhost:${port}/restaurants`;
  }

  static get POST_REVIEW_URL() {
      const port = 1337;
      return `http://localhost:${port}/reviews/`;
  }

    static get_review_url(id) {
        const port = 1337;
        return `http://localhost:${port}/reviews/?restaurant_id=${id}`;
    }

  static fetchReviews(id, callback) {
      updateReviewOnline();
      fetchReviewsOnline(id).then((reviews) => {
          // console.log(reviews);
          callback(null, reviews);
      })
  }


  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    // let xhr = new XMLHttpRequest();
    // xhr.open('GET', DBHelper.DATABASE_URL);
    // xhr.onload = () => {
    //   if (xhr.status === 200) { // Got a success response from server!
    //       const restaurants = JSON.parse(xhr.responseText);
    //     // const restaurants = json.restaurants;
    //     callback(null, restaurants);
    //   } else { // Oops!. Got an error from server.
    //     const error = (`Request failed. Returned status of ${xhr.status}`);
    //     callback(error, null);
    //   }
    // };
    // xhr.send();

      fetchRestaurantsOnline().then((restaurants) => {
          callback(null, restaurants);
      })
  }

  static storeReview(payload, callback){
      fetch(DBHelper.POST_REVIEW_URL,{
              method: 'post',
              body: JSON.stringify(payload),
          }).then((response) => {
              if(!response) {
                  openReviewsDataBase().then((db) => {
                      if (!db) callback("error");
                      const tx = db.transaction('reviews', 'readwrite');
                      const store = tx.objectStore('reviews');
                      store.put(payload);
                  }).then(callback("offline"))
              } else {
                  callback("success")
              }
      }).catch((error) => {
          console.log(error);
          payload.id = "offline" + String(Date.now());
          // console.log(payload);
          openReviewsDataBase().then((db) => {
              if (!db) callback("error");
              const tx = db.transaction('reviews', 'readwrite');
              const store = tx.objectStore('reviews');
              store.put(payload);
              // console.log("payload is stored locally");
              // console.log(payload);
          }).then(callback("offline"));
      });
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }


    /**
     * Fetch a review by its Restaurant ID.
     */
    static fetchReviewById(id, callback) {
        // fetch all reviews with proper error handling.
        DBHelper.fetchReviews(id, (error, reviews) => {
            if (error) {
                callback(error, null);
            } else {
                const review_list = reviews.filter(r => r.restaurant_id == id);
                // console.log(review_list);
                if (review_list.length > 0) { // Got reviews
                    callback(null, review_list);
                } else { // Reviews not in database
                    callback('no reviews', null);
                }
            }
        });
    }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/mws-restaurant-stage-1/img/${restaurant.photograph?restaurant.photograph:restaurant.id}.webp`);
  }

  /**
   * Map marker for a restaurant.
   */
   static mapMarkerForRestaurant(restaurant, map) {
    // https://leafletjs.com/reference-1.3.0.html#marker  
    const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
      {title: restaurant.name,
      alt: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant)
      })
      marker.addTo(newMap);
    return marker;
  } 
  /* static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  } */

}

export default DBHelper;

