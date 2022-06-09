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

        /*let test = dataArray[0].net;
        test = test.slice(11);
        test = test.split("Z");
        test = test[0].split(":");
        for (i = 0; i < test.length; i++) {
          console.log(parseInt(test[i]));
        }*/

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
          launchTimeEl.innerText = launchTime;
          card.appendChild(launchTimeEl);

          rocketDisplay.appendChild(card);
        }
      });
    }
  });
};

launch();
