//Some variables I will need for future functions

var lat

var lon



//this function makes a URL from the location that the user will input into the search bar. The URL is then assigned to the variable "endpointWeather"
function generateEndpointWeather (city) {
    //event.preventDefault();  //stops the page from refreshing on submit   (commented out until connected to a button)

    var city = SearchBoxPlaceholder.value //makes a variable and assigns it whatever the user types into the search box
    
    endpointWeather = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=aa891061c4eb5441b7aab33d1b619398&units=metric` //makes a global scope variable and assigns the URL to it. The URL will include the value of the "city" variable


}


//this function takes the url in "endpointWeather" and fetches it. The data is then turned into an object, ready for us to use it however we please
function makeRequestWeather () {
//event.preventDefault(); //stops the page from refreshing    (commented out until connected to a button)

return fetch(endpointWeather) //fetches the data from the url
.then(function(res) {

    return res.json(); //turns data into an object
})
.then(function(data) {
    //console.log(data);

    //We assign the lattitude and longitude of the location chosen by the user into the "lat" and "lon" variables. This is so we can use the values in our planet API
    lon = data.city.coord.lon

    lat = data.city.coord.lat
}) 
}

