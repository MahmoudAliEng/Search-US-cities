// A url to a JSON data (an array) of 1000 US cities
const endpoint = 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';

// Linking the  search bar, the suggestions list and the radio buttons
const searchInput = document.querySelector('.search');
const suggestions = document.querySelector('.suggestions');
const sortSearchPop = document.getElementById('sortSearchPop');
const sortSearchCity = document.querySelector('#sortSearchCity');
const sortSearchState = document.getElementById('sortSearchState');
const resultNumSpan = document.getElementById("number-results-span");


// The coming data from the web
const cities = [];
let matchArray = [];

// Fetching JSON data from URL and put it in a new array
fetch(endpoint)
   .then(blob => blob.json())
   .then(data => cities.push(...data)); // To get elements inserted directly not array inserted as one element

// Function that return the matches cities or states case-insensative for a research word
function findMatches(wordMatch, cities) {
    return cities.filter(place => {
        let regex = new RegExp(wordMatch, 'gi');
        return place.state.match(regex) || place.city.match(regex);
    });
}

// Adds commas after each 3 numbers - US number style -
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }



// Function that fill the result in HTML format
function displayResults(e){
    matchArray = findMatches(this.value, cities);
    
    if(sortSearchCity.checked){
        matchArray.sort((a, b) => (a.city < b.city) ? -1: 1  );
    }
    if(sortSearchState.checked){
        matchArray.sort((a, b) => (a.state < b.state) ? -1: 1  );
    }
    if(sortSearchPop.checked){
        matchArray.sort((a, b) => b.population - a.population);
    }
    
    
    
    suggestions.style.visibility = "visible";
    const returnedHTML = matchArray.map(place => {
        const regex = new RegExp(this.value, 'gi');// To highlight the researched value in the resultes
        const cityName = place.city.replace(regex, `<span class="hl">${this.value}</span>`);
        const stateName = place.state.replace(regex, `<span class="hl">${this.value}</span>`);
        return `<li>
                    <span class= "name">${cityName}, ${stateName} </span>
                    <span class="population"> ${numberWithCommas(place.population)} </span>
                </li>`; 

    }).join(''); // To convert the map returned result from array to a string 
    suggestions.innerHTML = returnedHTML;
    //searchInput.value += `\t${numberWithCommas(matchArray.length)}`;

    if (e.target.value === '' || e.target.value === undefined){
        suggestions.style.visibility = "hidden";
    }
}

function displyNumberResults(e){
    if (e.target.value === '' || e.target.value === undefined){
        resultNumSpan.style.visibility = "hidden";
        return;
    }
    resultNumSpan.style.visibility = "visible";  
    resultNumSpan.innerHTML = `${numberWithCommas(matchArray.length)} results`;
}

// TODO 
// #Done#  Hide the list before search and after selecting the desired result
// #Done# Sord the result with their population or other criteria
// #Done# Display how many results are matched to the searched word

searchInput.addEventListener('change', displayResults);
//searchInput.addEventListener('change', displyNumberResults);

searchInput.addEventListener('keyup', displayResults);
searchInput.addEventListener('keyup', displyNumberResults);


/* searchInput.addEventListener('change', displyNumberResults);
searchInput.addEventListener('keyup', displyNumberResults); */
