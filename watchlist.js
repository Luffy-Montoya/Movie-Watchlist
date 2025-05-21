let watchList = []
let markedWatched = []
let watched = true
const watchlistLocalStorage = JSON.parse( localStorage.getItem("watchList") )
const markedWatchedLocalStorage = JSON.parse( localStorage.getItem("markedWatched") )
const watchlistResults = document.getElementById("watchlist-results")

if (watchlistLocalStorage) {
    watchList = watchlistLocalStorage
}

if (markedWatchedLocalStorage) {
    markedWatched = markedWatchedLocalStorage
}

renderWatchList()

async function renderWatchList(){
    
    watchlistResults.innerHTML = ""

    if (watchList[0]) {

        watchList.map(async function(obj){
            const filmRes = await fetch(`https://www.omdbapi.com/?i=${obj}&apikey=c67d68ae`)
            const filmData = await filmRes.json()
            
            watchlistResults.innerHTML += `
                <div id="${obj}-div" class="result-container">
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
                                <i id="${obj}" class="remove fa-solid fa-minus"></i>
                                <p id="${obj}-watch" class="watchlist-label remove-text">Remove</p>
                            </div>
                        </div>
                        <div class="genres">${filmData.Genre}</div>
                        <div class="plot">${filmData.Plot}</div>
                        <div class="watched-container">
                            <i id="${obj}-check" class="checkmark fa-solid fa-check"></i>
                            <p id="${obj}-checkmarked" class="mark-as-watched">Mark as Watched</p>
                        </div>
                    </div>
                </div>
                `
            if (markedWatched.includes(`${obj}-check`)) {
                document.getElementById(`${obj}-checkmarked`).innerText = "Watched!"
                document.getElementById(`${obj}-checkmarked`).style.color = "black"
                document.getElementById(`${obj}-check`).classList.toggle("watched")
            }
        })
    } else {
        document.getElementById("empty-section").innerHTML = `
        <div class="empty-container">
            <div class="empty">Your Watchlist is empty.</div>
            <a class="empty-link" href="/index.html">Go find some movies!</a>
        </div>`
    }
}

function remove(e){
    if (e.target.className === "remove fa-solid fa-minus") {
        let confirm = true
        let removeText = document.getElementById(`${e.target.id}-watch`)
        removeText.innerText = "Confirm?"
        removeText.style.color = "black"
        setTimeout(() => {
            document.getElementById(`${e.target.id}-watch`).innerText = "Remove"
            removeText.style.color = "rgb(125,125,125)"
            confirm = false
        }, 1500)
        e.target.addEventListener("click", () => {
            if (confirm === true) {
                watchList.splice(watchList.indexOf(e.target.id), 1)
                localStorage.setItem("watchList", JSON.stringify(watchList))
                document.getElementById(`${e.target.id}-div`).remove()
            }

            if (!watchList[0]) {
                renderWatchList()
            }
        })
    } else if (e.target.className === "checkmark fa-solid fa-check watched" ||
        e.target.className === "checkmark fa-solid fa-check"){
        updateWatched(e)
    }
}

function updateWatched(e) {
     
    let checkmark = document.getElementById(`${e.target.id}`)
    let watchedEl = document.getElementById(`${e.target.id}marked`)
    if (!markedWatched.includes(`${e.target.id}`)) {
        watchedEl.innerText = "Watched!"
        watchedEl.style.color = "black"
        checkmark.classList.toggle("watched")
        markedWatched.push(e.target.id)
        localStorage.setItem("markedWatched", JSON.stringify(markedWatched))
    } else if (markedWatched.includes(`${e.target.id}`)) {
        watchedEl.innerText = "Mark as Watched"
        watchedEl.style.color = "rgb(175,175,175)"
        checkmark.classList.toggle("watched")
        let index = markedWatched.indexOf(e.target.id)
        markedWatched.splice(index, 1)
        localStorage.setItem("markedWatched", JSON.stringify(markedWatched))
    }
    
}

document.addEventListener("click", remove)

