let launch = () => {
  let rocketApi = "https://ll.thespacedevs.com/2.2.0/launch/upcoming?limit=25";

  fetch(rocketApi).then((response) => {
    if (response.ok) {
      response.json().then((data) => {
        var dataArray = data.results;
        //console.log(dataArray);
        var filteredArray = [];

        for (j = 0; j < dataArray.length; j++) {
          if (
            dataArray[j].pad.location.id === 27 ||
            dataArray[j].pad.location.id === 12
          ) {
            filteredArray.push(dataArray[j]);
          }
        }
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
  let rocketDisplay = document.querySelector(".rocket-display");
  for (i = 0; i < dataArray.length; i++) {
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

    var launchDateEl = document.createElement("p");
    launchDateEl.innerText =
      "Launch Date: " + launchMonth + " / " + launchDay + " / " + launchYear;
    card.appendChild(launchDateEl);

    var launchTimeEl = document.createElement("p");
    launchTimeEl.setAttribute("class", "launch-time");
    launchTimeEl.innerText =
      "[ T- " + hours + " : " + minutes + " : " + seconds + " ]";
    card.appendChild(launchTimeEl);

    rocketDisplay.appendChild(card);

    //countDown(launchTime, statusAbbrev, i);
  }
};

launch();
