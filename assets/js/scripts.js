var searchFormEl = document.querySelector("form")
var searchBoxEl = document.querySelector("#searchBox")
var lat = 0;
var lon = 0;
var weatherTempEL = document.getElementById('weatherTemp');
var weatherConditionEL = document.getElementById('weatherCondition');
var weatherIconEL = document.getElementById('weatherIcon');


var planetList = {

    
    Mercury: "Mercury is the closest planet to the sun, and so its year cycle is only a mere 88 days. It's also the smallest of the planets, being only slightly larger than Earth's moon.",
    Venus: "Venus is the second closest planet to the sun, and is relatively near equal in size to Earth. Venus has a thick, toxic atmospere made of sulfuric acid clouds, this causes the temperature to average at 465°C due to the greenhouse effect.",
    Mars: "Mars is the fourth planet from the sun, it's cold and desert-like, being covered in dust. The red hue of Mars is caused by the dust being made of iron oxides. It's possible that rivers or even oceans existed at some point on Mars' surface.",
    Jupiter: "Jupiter is the fifth planet from the sun, and is the largest in our solar system; being more than twice the size of all of them combined. On Jupiter there is a giant storm more than 10,000 miles wide, that has been raging for the last 150 years.",
    Saturn: "Saturn is the sixth planet from the sun, and is known mostly for its rings made of ice and rock. Each year on Saturn lasts roughly 30 of Earth's years.",
    Uranus: "Uranus is the seventh planet from the sun. Uranus is tilted at a right angle and orbits on its side, due to this its seasons can last for 20+ Earth-years, and the sun can beat down on its poles for 84 Earth-years at a time.",
    Neptune: "Neptune is the eighth planet from the sun, and is known for its wind speeds of over 700 mph. Neptune is the first planet to have been predicted to exist purely through mathematic calculations.",
    Moon: "Our moon is roughly a quater of the size of Earth, and is even bigger than Pluto. It's theorised that the Moon was once a part of Earth, however was torn off due to a collision back when Earth was little more than molten rock." 

}




//this function makes a URL from the location that the user will input into the search bar. The URL is then assigned to the variable "endpointWeather"
function generateEndpointWeather (city) {
     //makes a variable and assigns it whatever the user types into the search box
    
    var endpointWeather = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=aa891061c4eb5441b7aab33d1b619398&units=metric` //makes a global scope variable and assigns the URL to it. The URL will include the value of the "city" variable

    return endpointWeather;

}

//this function takes the url in "endpointWeather" and fetches it. The data is then turned into an object, ready for us to use it however we please
function makeApiRequest (weatherUrl) {

return fetch(weatherUrl) //fetches the data from the url
.then(function(res) {

    return res.json(); //turns data into an object
})
.then(function(weatherData) {
    console.log(weatherData); //shows lat/lon

    //We assign the lattitude and longitude of the location chosen by the user into the "lat" and "lon" variables. This is so we can use the values in our planet API
    lon = weatherData.city.coord.lon
    lat = weatherData.city.coord.lat


    //this code adds weather data from the API to the the elements in our html
    weatherConditionEL.innerText = weatherData.list[0].weather[0].main
    weatherTempEL.innerText = weatherData.list[0].main.temp
    var weatherIconCode = weatherData.list[0].weather[0].icon //here we make a variable and set it to have the icon code of the current weather
    var iconMainUrl = "http://openweathermap.org/img/w/" + weatherIconCode + ".png"; //we then make a url using the icon code that we get from the previous variable
    weatherIconEL.src = iconMainUrl //finally we assign the url to the src of our weather icon html element 
})
.then(function() {

    var endpointPlanets = `https://visible-planets-api.herokuapp.com/v2?latitude=${lat}&longitude=${lon}&showCoords=true` //gets a new URL and assigns it to the variable endpointPlanets. The URL changes based on the lat and lon

    return fetch(endpointPlanets) //we then fetch this URL
})
.then(function (res) {

    return res.json(); //the URL gets turned into an object
})

.then(function (apiPlanetData){

   // console.log(apiPlanetData); //shows planets
    buildCards(apiPlanetData)
})

}

//function to update search history in local storage. to-do check where we are getting input.
function updateSearchHistoryLS(searchInput){
    var searchHistoryLS = JSON.parse(localStorage.getItem("searchHistory"));
    //deals with no search history
    if(searchHistoryLS === null){
        var searchHistoryLS = []
        searchHistoryLS.push(searchInput);
    }else{
        //deal with repeats in search history. Clears the repeat out. 
        for(var i = 0; i < searchHistoryLS.length; i++){
            if(searchHistoryLS[i] === searchInput){
                searchHistoryLS.splice(i, 1);
                break;
            }
        }
        //add the new item to the search history
        searchHistoryLS.unshift(searchInput)
    }
    localStorage.setItem("searchHistory", JSON.stringify(searchHistoryLS));
}

// populates our search history to-do update variable name for search history.
function populateSearchHistory(){
    var searchHistoryEl = document.getElementById("searchHistoryDiv"); 
    //clear out search history
    searchHistoryEl.innerHTML = "";
    var searchHistoryLs = JSON.parse(localStorage.getItem("searchHistory"));

    for(var i = 0; i < searchHistoryLs.length; i++){
        var text = document.createElement("p");
        text.textContent = searchHistoryLs[i];
        searchHistoryEl.appendChild(text);
    }
}

//This function stores the functions that will be ran when the user clicks on the search button
function clickSearchButton(event) {
    event.preventDefault(); //stops page refreshing  

    var searchedCity = searchBoxEl.value;
    console.log(searchedCity);

    var weatherURL = generateEndpointWeather(searchedCity);
    makeApiRequest(weatherURL);
    updateSearchHistoryLS(searchedCity)
    populateSearchHistory();

}

//function to build the content of our planet cards. to-do "will need content fixing", 
function buildCards(planetData){
    var contentDivEl = document.getElementById("planetCardContainer");
    contentDivEl.innerHTML = "";
    console.log(planetData)

    for(var i = 0; i < planetData.data.length; i++){  //We loop this for the amount of planets visible to the user
        
        var planetCardEl = document.createElement("div");  //we make a div container for each card
        planetCardEl.setAttribute("class", "ui grid"); //we then set some classes to the div in order to position it
        contentDivEl.appendChild(planetCardEl); //we finally assign the div container to the planet card container of all the divs

        var planetNameEl = document.createElement("h3");
        planetNameEl.textContent = planetData.data[i].name //Use a variable from our data
        planetNameEl.setAttribute("class", "sixteen wide column");
        planetCardEl.appendChild(planetNameEl);

        var planetInfoEl = document.createElement("div");
        planetInfoEl.setAttribute("class", "five wide column");
        planetInfoEl.textContent = "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Mollitia placeat nobis iusto consequatur ducimus corrupti earum laudantium ut similique repellendus?"
        planetCardEl.appendChild(planetInfoEl);

        var planetBioEl = document.createElement("div");
        planetBioEl.setAttribute("class", "five wide column");
        planetBioEl.textContent = planetList[planetData.data[i].name]
        planetCardEl.appendChild(planetBioEl);

        var planetImgEl = document.createElement("img");
        planetImgEl.setAttribute("class", "six wide column");
        planetImgEl.setAttribute("src"  , `./assets/img/planet-img/${planetData.data[i].name}.jpg`);//use a variable for our img source `${lon}`  
        planetImgEl.setAttribute("alt", "Picture of"); //add the alt text with a variable
        planetCardEl.appendChild(planetImgEl);
    }

}

searchFormEl.addEventListener('submit', clickSearchButton);    