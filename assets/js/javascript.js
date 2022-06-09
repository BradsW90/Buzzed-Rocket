// API - generic
let getAPIdata = (cityName) => {
  var apiUrl =
    "https://api.openbrewerydb.org/breweries?by_city=" +
    cityName +
    "&per_page=10";

  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      console.log(data);
    });
  });
};

getAPIdata("Miami");
getAPIdata("Orlando");

let launch = () => {
  let rocketApi = "https://lldev.thespacedevs.com/2.2.0/launch/upcoming";
  let rocketDisplay = document.querySelector(".rocket-display");

  fetch(rocketApi).then((response) => {
    if (response.ok) {
      response.json().then((data) => {
        var dataArray = data.results;

        for (i = 0; i < dataArray.length; i++) {
          var rocket = data.results[i].rocket.configuration.full_name;
          var rocketImgUrl = data.results[i].image;
          var launchLocation = data.results[i].pad.location.name;
          var launchTime = data.results[i].net;
          var launchStatus = data.results[i].status.name;
          var statusAbbrev = data.results[i].status.abbrev;

          var card = document.createElement("div");
          card.setAttribute("class", "rocket-card");

          var rocketNameEl = document.createElement("h4");
          rocketNameEl.setAttribute("class", "rocket-name");
          rocketNameEl.innerText = rocket;
          card.appendChild(rocketNameEl);

          var rocketImgEl = document.createElement("img");
          rocketImgEl.setAttribute("src", rocketImgUrl);
          card.appendChild(rocketImgEl);

          var launchLocationEl = document.createElement("h3");
          launchLocationEl.innerText = launchLocation;
          card.appendChild(launchLocationEl);

          var statusContainerEl = document.createElement("div");
          statusContainerEl.setAttribute("class", "wrapper");
          card.appendChild(statusContainerEl);

          var statusSpanEl = document.createElement("span");
          statusSpanEl.innerText = "Status: ";
          statusContainerEl.appendChild(statusSpanEl);

          var launchStatusEl = document.createElement("p");

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

          var launchTimeEl = document.createElement("p");

          var convertedTime = countDown(launchTime, statusAbbrev);

          launchTimeEl.innerText = convertedTime;
          card.appendChild(launchTimeEl);

          rocketDisplay.appendChild(card);
        }
      });
    }
  });
};

var countDown = (launchTime, statusAbbrev) => {
  let getTime = launchTime.slice(11);
  getTime = getTime.split("Z");
  getTime = getTime[0].split(":");
  var hours = getTime[0];
  var minutes = getTime[1];
  var seconds = getTime[2];

  let fullDate = new Date();
  var theDate = fullDate.getDate();
  var theMonth = fullDate.getMonth() + 1;
  var theYear = fullDate.getFullYear();
  var theHour = fullDate.getHours() + 1;
  var theMinute = fullDate.getMinutes() + 1;
  var theSecond = fullDate.getSeconds() + 1;

  let launchDate = launchTime.split("T");
  launchDate = launchDate[0].split("-");
  var launchYear = parseInt(launchDate[0]);
  var launchMonth = parseInt(launchDate[1]);
  var launchDay = parseInt(launchDate[2]);

  if (
    statusAbbrev === "Go" &&
    launchYear === theYear &&
    launchMonth === theMonth &&
    launchDay === theDate
  ) {
    console.log("something met this criteria!");
  }

  var timeParsed = "[ T- " + hours + " : " + minutes + " : " + seconds + " ]";

  return timeParsed;
};

launch();
