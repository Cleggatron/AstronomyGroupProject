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
function makeApiRequest () {
//event.preventDefault(); //stops the page from refreshing    (commented out until connected to a button)

return fetch(endpointWeather) //fetches the data from the url
.then(function(res) {

    return res.json(); //turns data into an object
})
.then(function(data) {
    //console.log(data); //shows lat/lon

    //We assign the lattitude and longitude of the location chosen by the user into the "lat" and "lon" variables. This is so we can use the values in our planet API
    lon = data.city.coord.lon

    lat = data.city.coord.lat
})
.then(function() {

    endpointPlanets = `https://visible-planets-api.herokuapp.com/v2?latitude=${lat}&longitude=${lon}&showCoords=true` //gets a new URL and assigns it to the variable endpointPlanets. The URL changes based on the lat and lon

    return fetch(endpointPlanets) //we then fetch this URL
})
.then(function (res) {

    return res.json(); //the URL gets turned into an object
})

.then(function (data){

    //console.log(data); //shows planets

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
    //var searchHistoryEl = document.getElementById("searchHistory"); 
    //clear out search history
    //searchHistoryEl.innerHTML = "";
    var searchHistoryLs = json.parse(localStorage.getItem("searchHistory"));

    for(var i = 0; i < searchHistoryLs.length; i++){
        var text = document.createElement("p");
        text.textContent = searchHistoryLs[i];
        searchHistoryLs.append(text);
    }
}

//This function stores the functions that will be ran when the user clicks on the search button
function clickSearchButton() {
    //event.preventDefault(); //stops page refreshing  (commented out until button is added)

    generateEndpointWeather();
    makeApiRequest();

}

//function to build the content of our planet cards. to-do "will need content fixing", "will need to check the contentDivEl"
function buildCards(){
    var contentDivEl = document.getElementById("contentDiv");
    var planetCardEl = document.createElement("div");
    planetCardEl.setAttribute("class", "ui grid");
    contentDivEl.appendChild(planetCardEl);

    var planetNameEl = document.createElement("h3");
    planetNameEl.textContent = "Planet Name" //Use a variable from our data
    planetCardEl.appendChild(planetNameEl);

    var planetInfoEl = document.createElement("div");
    planetInfoEl.setAttribute("class", "five wide column");
    planetInfoEl.textContent = "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Mollitia placeat nobis iusto consequatur ducimus corrupti earum laudantium ut similique repellendus?"
    planetCardEl.appendChild(planetInfoEl);

    var planetBioEl = document.createElement("div");
    planetBioEl.setAttribute("class", "five wide column");
    planetBioEl.textContent = "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Mollitia placeat nobis iusto consequatur ducimus corrupti earum laudantium ut similique repellendus?"
    planetCardEl.appendChild(planetBioEl);

    var planetImgEl = document.createElement("img");
    planetImgEl.setAttribute("class", "six wide column");
    planetImgEl.setAttribute("src", "#");//use a variable for our img source
    planetImgEl.setAttribute("alt", "Picture of"); //add the alt text with a variable
    planetCardEl.appendChild(planetImgEl);

}

//placeHolderButtonName.addEventListener('click', clickSearchButton);    (commented out until html is added)
