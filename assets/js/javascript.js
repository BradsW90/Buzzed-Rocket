
let launch = () => {
  //if needing to test page for anything add dev after the ll
  let rocketApi = "https://ll.thespacedevs.com/2.2.0/launch/upcoming?limit=25";

  //call api
  fetch(rocketApi).then((response) => {
    //make sure api returned a response
    if (response.ok) {
      //turns response into json and then sets up data array for rocket cards
      response.json().then((data) => {
        var dataArray = data.results;
        //console.log(dataArray);

        //empty array to sort out unwaned locations
        var filteredArray = [];

        //iterates though data array and returns the 2 florida sites that i found
        for (j = 0; j < dataArray.length; j++) {
          if (
            dataArray[j].pad.location.id === 27 ||
            dataArray[j].pad.location.id === 12
          ) {
            filteredArray.push(dataArray[j]);
          }
        }

        //calls the function to dynamiclly create cards using the new filtered array
        launchAppend(filteredArray);
      });
    }
  });
};

/*var countDown = (launchTime, statusAbbrev, i) => {
  var launchTimeEle = document.getElementsByClassName("launch-time");

  //console.log(launchTime);

  let getTime = launchTime.slice(11);
  getTime = getTime.split("Z");
  getTime = getTime[0].split(":");
  var hours = getTime[0];
  var minutes = getTime[1];
  var seconds = getTime[2];

  let launchDate = launchTime.split("T");
  launchDate = launchDate[0].split("-");
  var launchYear = launchDate[0];
  var launchMonth = launchDate[1];
  var launchDay = launchDate[2];

  var launchTimeString = new Date(
    launchMonth +
      " " +
      launchDay +
      ", " +
      launchYear +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds
  ).getTime();

  console.log(
    "launch",
    launchYear,
    launchMonth,
    launchDay,
    statusAbbrev,
    seconds
  );
  //console.log("time", launchTimeString);

  if (
    statusAbbrev === "Go" &&
    launchYear == theYear &&
    launchMonth == theMonth &&
    launchDay == theDate
  ) {
    var intervalId = setInterval(function () {
      var now = new Date().getTime();
      var timeToLaunch = launchTimeString - now;

      var hoursLeft = Math.floor(
        (now % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      var minutesLeft = Math.floor((now % (1000 * 60 * 60)) / (1000 * 60));
      var secondsLeft = Math.floor((now % (1000 * 60)) / 1000);
      console.log(
        "Hours left: " +
          hoursLeft +
          " Minutes left: " +
          minutesLeft +
          " Seconds left: " +
          secondsLeft
      );
    }, 1000);
  } else {
    launchTimeEle[i].innerText =
      "[ T- " + hours + " : " + minutes + " : " + seconds + " ]";
  }
};*/

var launchAppend = function (dataArray) {
  //gets html element to create the cards in
  let rocketDisplay = document.querySelector(".rocket-display");

  for (i = 0; i < dataArray.length; i++) {
    //variable library for data on cards
    var rocket = dataArray[i].rocket.configuration.full_name;
    var rocketImgUrl = dataArray[i].image;
    var launchLocation = dataArray[i].pad.location.name;
    var launchTime = dataArray[i].net;
    var launchStatus = dataArray[i].status.name;
    var statusAbbrev = dataArray[i].status.abbrev;

    let getTime = launchTime.slice(11);
    getTime = getTime.split("Z");
    getTime = getTime[0].split(":");
    var hours = getTime[0];
    var minutes = getTime[1];
    var seconds = getTime[2];

    let launchDate = launchTime.split("T");
    launchDate = launchDate[0].split("-");
    var launchYear = launchDate[0];
    var launchMonth = launchDate[1];
    var launchDay = launchDate[2];

    //starts card creation
    var card = document.createElement("div");
    card.setAttribute("class", "rocket-card");

    //card title
    var rocketNameEl = document.createElement("h4");
    rocketNameEl.setAttribute("class", "rocket-name");
    rocketNameEl.innerText = rocket;
    card.appendChild(rocketNameEl);

    //card img
    var rocketImgEl = document.createElement("img");
    rocketImgEl.setAttribute("src", rocketImgUrl);
    card.appendChild(rocketImgEl);

    //launch location
    var launchLocationEl = document.createElement("h3");
    launchLocationEl.innerText = launchLocation;
    card.appendChild(launchLocationEl);

    //div class for launch status
    var statusContainerEl = document.createElement("div");
    statusContainerEl.setAttribute("class", "wrapper");
    card.appendChild(statusContainerEl);

    //span for first part of status
    var statusSpanEl = document.createElement("span");
    statusSpanEl.innerText = "Status: ";
    statusContainerEl.appendChild(statusSpanEl);

    //p element for acutal launch status
    var launchStatusEl = document.createElement("p");

    //used to determine color of launch status text
    switch (statusAbbrev) {
      case "Go":
        launchStatusEl.setAttribute("class", "good-color");
        break;
      case "TBD":
        launchStatusEl.setAttribute("class", "bad-color");
        break;
      case "TBC":
        launchStatusEl.setAttribute("class", "no-color");
        break;
      case "In Flight":
        launchLocationEl.setAttribute("class", "flight-color");
        break;
    }

    launchStatusEl.innerText = launchStatus;
    statusContainerEl.appendChild(launchStatusEl);

    //launch date
    var launchDateEl = document.createElement("p");
    launchDateEl.innerText =
      "Launch Date: " + launchMonth + " / " + launchDay + " / " + launchYear;
    card.appendChild(launchDateEl);

    //launch time
    var launchTimeEl = document.createElement("p");
    launchTimeEl.setAttribute("class", "launch-time");
    launchTimeEl.innerText =
      "[ T- " + hours + " : " + minutes + " : " + seconds + " ]";
    card.appendChild(launchTimeEl);

    rocketDisplay.appendChild(card);

    //future call for launch count down
    //countDown(launchTime, statusAbbrev, i);
  }
};

launch();

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

