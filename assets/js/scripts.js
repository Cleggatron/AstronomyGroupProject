var searchFormEl = document.querySelector("form") //this selects the first form element, this is the container for our search box
var searchBoxEl = document.querySelector("#searchBox") //this selects the search box element in our html
var lat = 0; //we create the variables lat and lon, and then assign them 0. This is so we can use them later
var lon = 0;
var weatherTempEL = document.getElementById('weatherTemp'); //We get the span element that lists our weather temperature in our html
var weatherConditionEL = document.getElementById('weatherCondition'); //we get the span element that lists our weather conditions in our html
var weatherIconEL = document.getElementById('weatherIcon'); //we get the element that lists the weather icon in our html
var weatherTempDivEL = document.getElementById('weatherTempDiv') //This element contains the span of the temp element 
var weatherConditionDivEL = document.getElementById('weatherConditionDiv')    //this element contains the span of the condition element
var searchHistoryEl = document.getElementById('searchHistoryDiv') //This contains our search history in the html
var errorBoxEl =  document.getElementById("errorBox"); //This element is for text that appears should the user type in a location that isn't valid
var yourCity= document.getElementById("city") //grabs the span for the city that is inside our weather data. We use it to show the location that the user typed in


//This is an object of all the planet descriptions and facts. This is so that we can then access it later in our generate card function
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
     //makes a variable and assigns it a url containing whatever city the user types into the search box as a query
    
    var endpointWeather = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=aa891061c4eb5441b7aab33d1b619398&units=metric` 

    return endpointWeather;

}

//this function takes the url in "endpointWeather" and fetches it. The data is then turned into an object, ready for us to use it however we please
function makeApiRequest (weatherUrl) {


    fetch(weatherUrl) //fetches the data from the url
    .then(function(res) {


        if(res.ok){   //if the response of the api server is fine then it continues as normal. If not it returns an error asking for a valid location
            res.json()
            .then(function(weatherData) {
               // console.log(weatherData); //shows lat/lon
        
                //We assign the lattitude and longitude of the location chosen by the user into the "lat" and "lon" variables. This is so we can use the values in our planet API
                lon = weatherData.city.coord.lon
                lat = weatherData.city.coord.lat
        
            //this code adds weather data from the API to the the elements in our html
            weatherConditionEL.innerText = weatherData.list[0].weather[0].main
            weatherTempEL.innerText = weatherData.list[0].main.temp
            var weatherIconCode = weatherData.list[0].weather[0].icon //here we make a variable and set it to have the icon code of the current weather
            var iconMainUrl = "http://openweathermap.org/img/w/" + weatherIconCode + ".png"; //we then make a url using the icon code that we get from the previous variable
            weatherIconEL.src = iconMainUrl //finally we assign the url to the src of our weather icon html element 
        
            //finally we unhide the weather elements so that the user can see them
            weatherTempDivEL.classList.remove('invisible') 
            weatherConditionDivEL.classList.remove('invisible')
            weatherIconEL.classList.remove('hidden')

            //this code takes the city name of our weather data and assigns it to the inner text of yourCity. This means in the weather div it will show the user the location they are viewing for
            yourCity.innerText = weatherData.city.name
           
            })
            .then(function() {
        
                var endpointPlanets = `https://visible-planets-api.herokuapp.com/v2?latitude=${lat}&longitude=${lon}&showCoords=true` //gets a new URL and assigns it to the variable endpointPlanets. The URL changes based on the lat and lon
        
                return fetch(endpointPlanets) //we then fetch this URL
            })
            .then(function (res) {
        
                return res.json(); //the URL gets turned into an object
            })
        
            .then(function (apiPlanetData){
        
                //console.log(apiPlanetData); //shows planets
                buildCards(apiPlanetData) //runs the buildCards function, this should create the planet data cards
            })
        } else { //this runs only if the api response returns and invalid response. It hides the weather data and returns an error message
            errorBoxEl.textContent = "Please Enter A Valid Location"

            //hide our weather data.
            weatherTempDivEL.classList.add('invisible')
            weatherConditionDivEL.classList.add('invisible')
            weatherIconEL.classList.add('hidden')
        }
            
    }) 
}

//function to update search history in local storage
function updateSearchHistoryLS(searchInput){
    var searchHistoryLS = JSON.parse(localStorage.getItem("searchHistory")); //makes a variable and assigns it the object for the search history

    //deals with no search history
    if(searchHistoryLS === null){
        var searchHistoryLS = [] //if there is no search history then make an empty array and assign it to this variable
        searchHistoryLS.push(searchInput); //then push the unputted city to that array
    }else{
        //deal with repeats in search history. Clears the repeat out. 
        for(var i = 0; i < searchHistoryLS.length; i++){ 
            if(searchHistoryLS[i] === searchInput){ //loops through and checks the history for any names that are identical to the searched location
                searchHistoryLS.splice(i, 1); //if it finds one then the old location is removed and the new one is added to the top of the history
                break;
            }
        }
        //add the new item to the search history
        searchHistoryLS.unshift(searchInput)
    }
    localStorage.setItem("searchHistory", JSON.stringify(searchHistoryLS)); //we then assign the stringified search history to our search history element
}

// populates our search history
function populateSearchHistory(){
    var searchHistoryEl = document.getElementById("searchHistoryDiv"); //get the search history div from our html
    //clear out search history
    searchHistoryEl.innerHTML = ""; 
    var searchHistoryLs = JSON.parse(localStorage.getItem("searchHistory")); //we make a variable and assign it data from our search history 

    for(var i = 0; i < searchHistoryLs.length; i++){ //we then loop through it and create a p element for each item in the search history
        var text = document.createElement("p");
        text.textContent = searchHistoryLs[i];
        searchHistoryEl.appendChild(text);
    }
}

//This function stores the functions that will be ran when the user clicks on the search button
function clickSearchButton(event) {
    event.preventDefault(); //stops page refreshing  

    var searchedCity = searchBoxEl.value; //makes a new variable and assigns it the value of the search box

    var planetCardContainerEl = document.getElementById("planetCardContainer") //gets our planet card container from our html
    planetCardContainerEl.innerHTML = ""; //clears the inner html, ready for us to input our own data

    
    //handles any blank input
    if(searchedCity === ""){
        errorBoxEl.textContent = "You have not entered a location!"
        return;
    }
    errorBoxEl.textContent = ""; //clears the search bar after use

    var weatherURL = generateEndpointWeather(searchedCity); //assigns the result of generateEndpointWeather to our weatherURL
    makeApiRequest(weatherURL); //makes an api request using the URL in weatherURL
    updateSearchHistoryLS(searchedCity) //updates the search history with the user inputted location
    populateSearchHistory(); //populates the search history with all the inputted locations

}

//function to build the content of our planet cards
function buildCards(planetData){

    var contentDivEl = document.getElementById("planetCardContainer");
    contentDivEl.innerHTML = "";
  
    for(var i = 0; i < planetData.data.length; i++){  //We loop this for the amount of planets visible to the user
        
        var planetCardEl = document.createElement("div");  //we make a div container for each card
        planetCardEl.setAttribute("class", "ui grid planetcard"); //we then set some classes to the div in order to position it
        contentDivEl.appendChild(planetCardEl); //we finally assign the div container to the planet card container of all the divs

        var planetNameEl = document.createElement("h3"); //we make a h3 for each planet and assign it the name of said planet
        planetNameEl.textContent = planetData.data[i].name //Use a variable from our data
        planetNameEl.setAttribute("class", "sixteen wide column"); //more classes to position it
        planetCardEl.appendChild(planetNameEl); //finally we add it to the planet card

        var planetInfoEl = document.createElement("div"); //we make a div for each planet card that will contain the planets location
        planetInfoEl.setAttribute("class", "five wide column");
        var planetLocationEl = document.createElement("h3");
        planetLocationEl.textContent = "Planet Location"
        
        //here we create some p elements and assign them data from out api so that users can see the location of the planets
        var rightAscensionEl = document.createElement("p")
        rightAscensionEl.textContent = "Right Ascension: " + planetData.data[i].rightAscension.hours + " Hours " + planetData.data[i].rightAscension.minutes + " Minutes " + planetData.data[i].rightAscension.seconds + " Seconds";
        
        var declinationEl = document.createElement("p")
        declinationEl.textContent = "Declination: " + planetData.data[i].declination.degrees + " Degrees."

        planetInfoEl.appendChild(planetLocationEl); //finally we append all this info to the planetInfo div and append that div to the planet card
        planetInfoEl.appendChild(rightAscensionEl);
        planetInfoEl.appendChild(declinationEl);
        planetCardEl.appendChild(planetInfoEl);

        var planetBioEl = document.createElement("div"); //creates a div for each planet card
        planetBioEl.setAttribute("class", "five wide column");
        planetBioEl.textContent = planetList[planetData.data[i].name] //assigns the div the text that is inside the object array at the top of the JS. It will check the name first so it gets the right one
        planetCardEl.appendChild(planetBioEl);

        var planetImgEl = document.createElement("img");

        planetImgEl.setAttribute("class", "six wide column");
        planetImgEl.setAttribute("src"  , `./assets/img/planet-img/${planetData.data[i].name}.jpg`);//the image source is a variable that changes based on the name of the planet 
        planetImgEl.setAttribute("alt", "Picture of"); //add the alt text with a variable
        planetCardEl.appendChild(planetImgEl);
    }

}

//when the search history is clicked it will use the clicked location to search for planets
function clickSearchHistory(event){
    event.preventDefault; //prevent page refresh

    var eventTarget = event.target; //make a variable and assigns it the value of the clicked element
    
    //clear previous planet data
    var planetCardContainerEl = document.getElementById("planetCardContainer")
    planetCardContainerEl.innerHTML = "";


    //removes old error message
    errorBoxEl.textContent = "";
    
    if(eventTarget.matches("p")){ //if the clicked element is a p element then:
        var searchCity = eventTarget.textContent; //make a new variable that is the textcontent of the clicked element
        var weatherURL = generateEndpointWeather(searchCity); //then run generateEndpointWeather with that textcontent as the parameter and assign to a URL
        
        makeApiRequest(weatherURL); //the URL is then used to get an api request for the weather data
        updateSearchHistoryLS(searchCity) //the search history is updated with the clicked element
        populateSearchHistory(); //finally the search history gets populated
    }
}

searchFormEl.addEventListener('submit', clickSearchButton);  //an event listener for our search button that runs a function on submit
searchHistoryEl.addEventListener("click", clickSearchHistory); //an event listener for when we click on any of our search history elements
populateSearchHistory(); //populates the search history of previous sessions on start-up