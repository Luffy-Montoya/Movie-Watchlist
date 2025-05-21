const searchInput = document.getElementById("search-input")
const searchForm = document.getElementById("search-form")
const resultsSection = document.getElementById("results-section")
const watchlistLocalStorage = JSON.parse(localStorage.getItem("watchList"))
const lastSearchLocalStorage = JSON.parse (localStorage.getItem("lastSearch"))
let watchList = []

if (watchlistLocalStorage) {
    watchList = watchlistLocalStorage
}

if (lastSearchLocalStorage) {
    searchInput.value = lastSearchLocalStorage
} else {
    searchInput.value = "Life"
}

getData()

async function getData() {
    const res = await fetch(`https://www.omdbapi.com/?s=${searchInput.value}&apikey=c67d68ae`)
    const data = await res.json()
    const results = data.Search
    resultsSection.innerHTML = ""

    if (results) {

        results.map(async function(obj){
            const filmRes = await fetch(`https://www.omdbapi.com/?i=${obj.imdbID}&apikey=c67d68ae`)
            const filmData = await filmRes.json()

            resultsSection.innerHTML += `
                <div class="result-container">
                    <img id="poster" class="movie-poster" src="${filmData.Poster}" alt="Not Found" 
                        onerror="this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoWcWg0E8pSjBNi0TtiZsqu8uD2PAr_K11DA&s'">
                    <div class="movie-description">
                        <div class="result-header">
                            <a href="https://www.imdb.com/title/${obj.imdbID}/" class="title" target="_blank">${filmData.Title}</a>
                            <div class="rating-container">
                                <i class="star fa-solid fa-star"></i>
                                <div class="rating">${filmData.imdbRating}</div>
                            </div>
                        </div>
                        <div class="second-row">
                            <div class="year-time">    
                                <div class="year">${filmData.Year}</div>
                                <div class="runtime">${filmData.Runtime}</div>
                            </div>
                            <div class="add-container">
                                <i id="${obj.imdbID}" class="add-to-watchlist fa-solid fa-plus"></i>
                                <p id="${obj.imdbID}-watch" class="watchlist-label">Watchlist</p>
                            </div>
                        </div>
                        <div class="genres">${filmData.Genre}</div>
                        <div class="plot">${filmData.Plot}</div>
                    </div>
                </div>
                `
            if (watchList.includes(`${obj.imdbID}`)){
                document.getElementById(`${obj.imdbID}`).classList.add("added")
                document.getElementById(`${obj.imdbID}-watch`).innerText = "Added"
            }
        }) 
    } else {
            document.getElementById("empty-section").innerHTML = `
        <div class="empty-container">
            <div class="empty">Ah dang... No results.</div>
            <div class="empty">Try searching for something else!</a>
        </div>`
        }      
}

function addRemove(e){
    if (e.target.className === "add-to-watchlist fa-solid fa-plus"){
        watchList.push(e.target.id)
        localStorage.setItem("watchList", JSON.stringify(watchList))
        document.getElementById(`${e.target.id}-watch`).innerText = "Added"
        e.target.classList.toggle("added")
    } else if (e.target.className === "add-to-watchlist fa-solid fa-plus added"){
        e.target.classList.toggle("added")
        document.getElementById(`${e.target.id}-watch`).innerText = "Watchlist"
        watchList.splice(watchList.indexOf(e.target.id), 1)
        localStorage.setItem("watchList", JSON.stringify(watchList))
    }
}

searchForm.addEventListener("submit", function(e) {
    e.preventDefault()
    localStorage.setItem("lastSearch", JSON.stringify(searchInput.value))
    getData()
})

document.addEventListener("click", addRemove)


