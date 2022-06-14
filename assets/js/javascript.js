const apiKey =
  'pk.eyJ1IjoiZGViYWppdDA2NDciLCJhIjoiY2w0OHJnZHpnMDE1bjNtb3kzd2tudTFldCJ9.fDKOaixKnGmY77NnyoL-LQ'

var dropDownEl = document.querySelector('.dropdown-content')
var searchResultEl = document.querySelector('.search-results-container')
var mapContainerEl = document.querySelector('.map-container')
var backBtnEl = document.querySelector('.back-btn')
var searchHistoryListEl = document.querySelector('.search-history-container')

arrLongLat = []
arrPlacePointofInterest = []

let displayMap = (longitude, latitude, addressText) => {
  var listItemWrapper = document.querySelector('.list-items')
  if (listItemWrapper !== null) {
    listItemWrapper.remove()
  }
  var mapEl = document.createElement('a')
  mapEl.id = 'map'
  mapContainerEl.appendChild(mapEl)

  mapboxgl.accessToken = apiKey
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [longitude, latitude], // starting position [lng, lat]
    zoom: 15, // starting zoom
  })
  const marker = new mapboxgl.Marker({ color: '#b40219' })
    .setLngLat([longitude, latitude])
    .setPopup(new mapboxgl.Popup().setHTML(addressText)) // add popup
    .addTo(map)
}

var displayListByCategory = function (data) {
  var listItemContainer = document.createElement('div')
  listItemContainer.className = 'list-items'

  for (var i = 0; i < data.features.length; i++) {
    var nameAddress = data.features[i].place_name
    var arrNameAddress = nameAddress.split(' ')
    var stringNameAddress = arrNameAddress.join()
    var nameAddressEl = document.createElement('li')
    nameAddressEl.className = 'list-address'
    nameAddressEl.textContent = nameAddress
    listItemContainer.appendChild(nameAddressEl)
  }
  searchResultEl.appendChild(listItemContainer)
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

var searchResultHandler = function (event) {
  var addressDetails = event.target.textContent
  var arrAddress = addressDetails.split(' ')
  var stringAddress = arrAddress.join()
  var long = arrLongLat[0].long
  var lat = arrLongLat[0].lat
  for (const key in arrLongLat[0]) {
    delete arrLongLat[0][key]
  }

  apiAddressUrl =
    'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
    stringAddress +
    '.json?limit=1&proximity=' +
    long +
    ',' +
    lat +
    '&access_token=' +
    apiKey

  fetch(apiAddressUrl).then(function (response) {
    response.json().then(function (data) {
      var longValue = data.features[0].center[0]
      var latValue = data.features[0].center[1]
      var addressValue = data.features[0].place_name
      displayMap(longValue, latValue, addressValue)
    })
  })
}

var saveSearch = function (placeName, categoryName) {
  var existingEntries = JSON.parse(
    localStorage.getItem('Place_Category') || '[]',
  )
  if (!existingEntries.includes(placeName)) {
    existingEntries.unshift(placeName)
  }
  if (!existingEntries.includes(categoryName)) {
    existingEntries.unshift(categoryName)
  }

  if (existingEntries.length > 50) {
    existingEntries.pop()
  }
  localStorage.setItem('Place_Category', JSON.stringify(existingEntries))
}

var dropDownHandler = (event) => {
  var placeName = document.querySelector('.city-place-name').value
  var categoryName = event.target.textContent

  saveSearch(placeName, categoryName)

  var listItemWrapper = document.querySelector('.list-items')
  var mapEl = document.querySelector('#map')

  if (listItemWrapper !== null) {
    listItemWrapper.remove()
  }
  if (mapEl !== null) {
    mapEl.remove()
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
      var objLongLat = {
        long: longitude,
        lat: latitude,
      }
      arrLongLat.push(objLongLat)
    })
  })
}

var btnBackHandler = function () {
  location.reload()
}

var loadSaveSearch = function () {
  var loadPlacePointInterest = JSON.parse(
    localStorage.getItem('Place_Category'),
  )
  console.log(loadPlacePointInterest)

  if (loadPlacePointInterest !== null) {
    for (var i = 0; i < loadPlacePointInterest.length; i++) {
      var listEl = document.createElement('div')
      listEl.className = 'search-item'
      listEl.textContent = loadPlacePointInterest[i]
      // listEl.textContent = loadPlacePointInterest[i][i].category
      searchHistoryListEl.prepend(listEl)
    }
  }
}
loadSaveSearch()
backBtnEl.addEventListener('click', btnBackHandler)
searchResultEl.addEventListener('click', searchResultHandler)
dropDownEl.addEventListener('click', dropDownHandler)
