const apiKey =
  'pk.eyJ1IjoiZGViYWppdDA2NDciLCJhIjoiY2w0OHJnZHpnMDE1bjNtb3kzd2tudTFldCJ9.fDKOaixKnGmY77NnyoL-LQ'

var dropDownEl = document.querySelector('.dropdown-content')
var searchResultEl = document.querySelector('.search-results-container')
let displayMap = (longitude, latitude) => {
  mapboxgl.accessToken = apiKey
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [longitude, latitude], // starting position [lng, lat]
    zoom: 5, // starting zoom
  })
  const marker = new mapboxgl.Marker()
    .setLngLat([longitude, latitude])
    .setPopup(new mapboxgl.Popup().setHTML('<h1>Hello World!</h1>')) // add popup
    .addTo(map)
}

var displayListByCategory = function (data) {
  // searchResultEl.textContent = 'Some of the best restuarants are ....'

  for (var i = 0; i < data.features.length; i++) {
    var nameAddress = data.features[i].place_name
    var nameAddressEl = document.createElement('p')
    nameAddressEl.className = 'list-address'
    nameAddressEl.textContent = nameAddress
    searchResultEl.appendChild(nameAddressEl)
  }
}

let displayCategoryData = (categoryName, longitude, latitude) => {
  let apiCategoryUrl =
    'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
    categoryName +
    '.json?limit=20&proximity=' +
    longitude +
    ',' +
    latitude +
    '&access_token=' +
    apiKey
  fetch(apiCategoryUrl).then(function (response) {
    response.json().then(function (data) {
      displayListByCategory(data)
    })
  })
}

var listAddressExists = function () {
  console.log('we are here')
  if (document.querySelector('.list-address') !== null) {
    return true
  }
  return false
}

let dropDownHandler = (event) => {
  var categoryName = event.target.textContent
  var placeName = document.querySelector('.city-name').textContent
  console.log(document.querySelector('.list-address'))

  if (listAddressExists == true) {
    console.log('true')
    document.querySelector('.list-address').remove()
  }

  let apiPlaceUrl =
    'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
    placeName +
    '.json?limit=1&access_token=' +
    apiKey

  fetch(apiPlaceUrl).then(function (response) {
    response.json().then(function (data) {
      let longitude = data.features[0].center[0]
      let latitude = data.features[0].center[1]
      displayCategoryData(categoryName, longitude, latitude)
      // displayMap(longitude, latitude)
    })
  })
}

// var saveCityName = function (searchCityName) {
//   arrCityName.push(searchCityName)
//   existingEntries = JSON.parse(localStorage.getItem('city') || '[]')
//   var isCityInArray = checkArrForCityName(existingEntries, searchCityName)
//   if (isCityInArray === false) {
//     var buttonEl = document.createElement('button')
//     buttonEl.classList = 'button is-info is-fullwidth is-hovered btn-city'
//     buttonEl.textContent = searchCityName
//     btnSearchAddCity.prepend(buttonEl) //adding element at the start of the container
//     existingEntries.unshift(arrCityName) // adding array element at the start of the array
//     localStorage.setItem('city', JSON.stringify(existingEntries))
//   } else {
//     arrCityName.pop()
//   }

//   // empty the array because in case you don't refresh the page it will create new array with 2 elements
//   arrCityName.splice(0, arrCityName.length)
// }

// var loadSaveCityName = function () {
//   var loadCityName = JSON.parse(localStorage.getItem('city'))
//   if (loadCityName != null || loadCityName != undefined) {
//     for (var i = 0; i < loadCityName.length; i++) {
//       var buttonEl = document.createElement('button')
//       buttonEl.classList = 'button is-info is-fullwidth is-hovered btn-city'
//       buttonEl.textContent = loadCityName[i][0]
//       btnSearchAddCity.appendChild(buttonEl)
//     }
//   }
// }

// var btnSearchHandler = function (event) {
//   var targetEl = event.target
//   if (targetEl.matches('.btn-search')) {
//     var searchInputEl = document.querySelector('.input')
//     var searchCityName = searchInputEl.value.toLowerCase()

//     if (
//       searchCityName === '' ||
//       searchCityName === null ||
//       searchCityName === undefined
//     ) {
//       alert('Please type a city name')
//     } else {
//       //   saveCityName(searchCityName)
//       getCityBreweryData(searchCityName)
//     }
//   } else if (targetEl.matches('.btn-city')) {
//     searchCityName = targetEl.textContent
//     // getCityBreweryData(searchCityName)
//   }
// }

// // loadSaveCityName()
// // btnSearchAddCity.addEventListener('click', btnSearchHandler)
dropDownEl.addEventListener('click', dropDownHandler)
