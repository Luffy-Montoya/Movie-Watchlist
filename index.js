const searchInput = document.getElementById("search-input")
const searchForm = document.getElementById("search-form")
const resultsSection = document.getElementById("results-section")
let watchList = []
const watchlistLocalStorage = JSON.parse( localStorage.getItem("watchList") )

if (watchlistLocalStorage) {
    watchList = watchlistLocalStorage
}

async function getData() {
    const res = await fetch(`http://www.omdbapi.com/?s=${searchInput.value}&apikey=c67d68ae`)
    const data = await res.json()
    const results = data.Search

    results.map(async function(obj){
        const filmRes = await fetch(`http://www.omdbapi.com/?i=${obj.imdbID}&apikey=c67d68ae`)
        const filmData = await filmRes.json()
        
        resultsSection.innerHTML += `
            <div class="result-container">
                <img id="poster" class="movie-poster" src="${filmData.Poster}" alt="Not Found" 
                    onerror="this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoWcWg0E8pSjBNi0TtiZsqu8uD2PAr_K11DA&s'">
                <div class="movie-description">
                    <div class="result-header">
                        <div class="title">${filmData.Title}</div>
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
})}

function addRemove(e){
    if (e.target.className === "add-to-watchlist fa-solid fa-plus"){
        watchList.push(e.target.id)
        localStorage.setItem("watchList", JSON.stringify(watchList))
        document.getElementById(`${e.target.id}-watch`).innerText = "Added"
        e.target.classList.toggle("added")
        console.log(watchList)
    } else if (e.target.className === "add-to-watchlist fa-solid fa-plus added"){
        e.target.classList.toggle("added")
        document.getElementById(`${e.target.id}-watch`).innerText = "Watchlist"
        let index = watchList.indexOf(e.target.id)
        watchList.splice(index, 1)
        localStorage.setItem("watchList", JSON.stringify(watchList))
        console.log(watchList)
    }
}

searchForm.addEventListener("submit", function(e) {
    e.preventDefault()
    resultsSection.innerHTML = ""
    getData()
})

document.addEventListener("click", addRemove)


