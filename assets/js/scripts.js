//function to update search history in local storage//
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