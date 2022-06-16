//gets current screen width
var screensWidth = window.innerWidth;

//gets html element to create the cards in
let rocketDisplay = document.querySelector(".rocket-display");

//handles single card generation and correct new element layout
var miniCard = (dataArray, index) => {
  //create new card
  launchAppend(dataArray, index);

  //create next button
  var nextBtn = document.createElement("button");
  nextBtn.setAttribute("id", "next-btn");
  nextBtn.innerText = ">";
  rocketDisplay.appendChild(nextBtn);
};

var launchAppend = function (dataArray, index) {
  //variable library for data on cards
  var rocket = dataArray.rocket.configuration.full_name;
  var rocketImgUrl = dataArray.image;
  var launchLocation = dataArray.pad.location.name;
  var launchTime = dataArray.net;
  var launchStatus = dataArray.status.name;
  var statusAbbrev = dataArray.status.abbrev;

  //getting the hours, minutes and seconds of the launch time
  let getTime = launchTime.slice(11);
  getTime = getTime.split("Z");
  getTime = getTime[0].split(":");
  var hours = getTime[0];
  var minutes = getTime[1];
  var seconds = getTime[2];

  //getting the launch year, month, and day
  let launchDate = launchTime.split("T");
  launchDate = launchDate[0].split("-");
  var launchYear = launchDate[0];
  var launchMonth = launchDate[1];
  var launchDay = launchDate[2];

  //starts card creation
  var card = document.createElement("div");
  card.setAttribute("class", "rocket-card");
  card.dataset.index = index;

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
};
let launch = () => {
  //if needing to test page for anything add dev after the ll
  let rocketApi = "https://ll.thespacedevs.com/2.2.0/launch/upcoming?limit=8";

  //call api
  fetch(rocketApi).then((response) => {
    //make sure api returned a response
    if (response.ok) {
      //turns response into json and then sets up data array for rocket cards
      response.json().then((data) => {
        var dataArray = data.results;
        var index = 0;
        //console.log(dataArray);

        //checking for mobile screen size
        if (screensWidth > 480) {
          //generates all cards to screen since screen is bigger then mobile
          for (i = 0; i < dataArray.length; i++) {
            launchAppend(dataArray[i]);
          }
          //starts single creation cards
        } else {
          //makes previous button element
          var prevBtn = document.createElement("button");
          prevBtn.setAttribute("id", "prev-btn");
          prevBtn.innerText = "<";
          rocketDisplay.appendChild(prevBtn);

          //calls mini card to create first card and next button element
          miniCard(dataArray[index], index);

          //setup event listener on card container to listen for button presses
          rocketDisplay.addEventListener("click", (e) => {
            //if previous button pressed
            if (e.target.innerText === "<") {
              var prevParentEl = e.target.parentNode;
              var prevCurrentEl = prevParentEl.childNodes;

              //checks to see if current card is beginning of array
              if (parseInt(prevCurrentEl[1].dataset.index) === 0) {
                //if beginning of array create card from last array data
                for (c = 0; c < 2; c++) {
                  prevCurrentEl[1].remove();
                }
                miniCard(dataArray[7], 7);
                return;

                //if current card is not beginning create card based on last data down
              } else {
                //gets last index used
                var prevRocket = prevCurrentEl[1].dataset.index;

                //removes card and nex button
                for (b = 0; b < 2; b++) {
                  prevCurrentEl[1].remove();
                }

                //decriment current index
                prevRocket--;

                //create new card and next button based on new index
                miniCard(dataArray[prevRocket], prevRocket);
              }

              //in next button is pressed
            } else if (e.target.innerText === ">") {
              var parentEl = e.target.parentNode;
              var currentEl = parentEl.childNodes;

              //check if card is the last in array
              if (parseInt(currentEl[1].dataset.index) === 7) {
                //remove card and next button
                for (c = 0; c < 2; c++) {
                  currentEl[1].remove();
                }

                //create first card in array
                miniCard(dataArray[0], 0);
                return;

                //if card is not first card in array
              } else {
                var nextRocket = currentEl[1].dataset.index;

                //remove current element and next button
                for (a = 0; a < 2; a++) {
                  currentEl[1].remove();
                }

                //increment index
                nextRocket++;

                //call function to create next card in array and recreate next button
                miniCard(dataArray[nextRocket], nextRocket);
              }
            }
          });
        }
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

const apiKey =
  "pk.eyJ1IjoiZGViYWppdDA2NDciLCJhIjoiY2w0OHJnZHpnMDE1bjNtb3kzd2tudTFldCJ9.fDKOaixKnGmY77NnyoL-LQ";

var dropDownEl = document.querySelector(".dropdown-content");
var searchResultEl = document.querySelector(".search-results-container");
var mapContainerEl = document.querySelector(".map-container");
var backBtnEl = document.querySelector(".back-btn");
var searchHistoryListEl = document.querySelector(".search-history-container");

arrLongLat = [];
arrPlacePointofInterest = [];

let displayMap = (longitude, latitude, addressText) => {
  var listItemWrapper = document.querySelector(".list-items");
  if (listItemWrapper !== null) {
    listItemWrapper.remove();
  }
  var mapEl = document.createElement("a");
  mapEl.id = "map";
  mapContainerEl.appendChild(mapEl);

  mapboxgl.accessToken = apiKey;
  const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/streets-v11", // style URL
    center: [longitude, latitude], // starting position [lng, lat]
    zoom: 15, // starting zoom
  });
  const marker = new mapboxgl.Marker({ color: "#b40219" })
    .setLngLat([longitude, latitude])
    .setPopup(new mapboxgl.Popup().setHTML(addressText)) // add popup
    .addTo(map);
};

var displayListByCategory = function (data) {
  var listItemContainer = document.createElement("div");
  listItemContainer.className = "list-items";

  for (var i = 0; i < data.features.length; i++) {
    var nameAddress = data.features[i].place_name;
    var arrNameAddress = nameAddress.split(" ");
    var stringNameAddress = arrNameAddress.join();
    var nameAddressEl = document.createElement("li");
    nameAddressEl.className = "list-address";
    nameAddressEl.textContent = nameAddress;
    listItemContainer.appendChild(nameAddressEl);
  }
  searchResultEl.appendChild(listItemContainer);
};

let displayCategoryData = (categoryName, longitude, latitude) => {
  let apiCategoryUrl =
    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
    categoryName +
    ".json?limit=20&proximity=" +
    longitude +
    "," +
    latitude +
    "&access_token=" +
    apiKey;
  fetch(apiCategoryUrl).then(function (response) {
    response.json().then(function (data) {
      displayListByCategory(data);
    });
  });
};

var searchResultHandler = function (event) {
  var addressDetails = event.target.textContent;
  var arrAddress = addressDetails.split(" ");
  var stringAddress = arrAddress.join();
  var long = arrLongLat[0].long;
  var lat = arrLongLat[0].lat;
  for (const key in arrLongLat[0]) {
    delete arrLongLat[0][key];
  }

  apiAddressUrl =
    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
    stringAddress +
    ".json?limit=1&proximity=" +
    long +
    "," +
    lat +
    "&access_token=" +
    apiKey;

  fetch(apiAddressUrl).then(function (response) {
    response.json().then(function (data) {
      var longValue = data.features[0].center[0];
      var latValue = data.features[0].center[1];
      var addressValue = data.features[0].place_name;
      displayMap(longValue, latValue, addressValue);
    });
  });
};

var saveSearch = function (placeName, categoryName) {
  var existingEntries = JSON.parse(
    localStorage.getItem("Place_Category") || "[]"
  );
  if (!existingEntries.includes(placeName)) {
    existingEntries.unshift(placeName);
  }
  if (!existingEntries.includes(categoryName)) {
    existingEntries.unshift(categoryName);
  }

  if (existingEntries.length > 50) {
    existingEntries.pop();
  }
  localStorage.setItem("Place_Category", JSON.stringify(existingEntries));
};

var dropDownHandler = (event) => {
  var placeName = document.querySelector(".city-place-name").value;
  var categoryName = event.target.textContent;

  saveSearch(placeName, categoryName);

  var listItemWrapper = document.querySelector(".list-items");
  var mapEl = document.querySelector("#map");

  if (listItemWrapper !== null) {
    listItemWrapper.remove();
  }
  if (mapEl !== null) {
    mapEl.remove();
  }

  let apiPlaceUrl =
    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
    placeName +
    ".json?limit=1&access_token=" +
    apiKey;

  fetch(apiPlaceUrl).then(function (response) {
    response.json().then(function (data) {
      let longitude = data.features[0].center[0];
      let latitude = data.features[0].center[1];
      displayCategoryData(categoryName, longitude, latitude);
      var objLongLat = {
        long: longitude,
        lat: latitude,
      };
      arrLongLat.push(objLongLat);
    });
  });
};

var btnBackHandler = function () {
  location.reload();
};

var loadSaveSearch = function () {
  var loadPlacePointInterest = JSON.parse(
    localStorage.getItem("Place_Category")
  );
  console.log(loadPlacePointInterest);

  if (loadPlacePointInterest !== null) {
    for (var i = 0; i < loadPlacePointInterest.length; i++) {
      var listEl = document.createElement("div");
      listEl.className = "search-item";
      listEl.textContent = loadPlacePointInterest[i];
      // listEl.textContent = loadPlacePointInterest[i][i].category
      searchHistoryListEl.prepend(listEl);
    }
  }
};
launch();
loadSaveSearch();
backBtnEl.addEventListener("click", btnBackHandler);
searchResultEl.addEventListener("click", searchResultHandler);
dropDownEl.addEventListener("click", dropDownHandler);
