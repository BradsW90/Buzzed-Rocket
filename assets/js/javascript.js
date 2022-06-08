// API - generic
let getAPIdata = (cityName) => {
  var apiUrl =
    'https://api.openbrewerydb.org/breweries?by_city=' +
    cityName +
    '&per_page=10'

  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      console.log(data)
    })
  })
}

getAPIdata('Miami')
getAPIdata('Orlando')
