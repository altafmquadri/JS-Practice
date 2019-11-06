// fetch

horrorApi = 'http://localhost:4000/horror'
comedyApi = 'http://localhost:4000/comedy'
actionApi = 'http://localhost:4000/action'

fetch(horrorApi)
.then(function(response){
    return response.json()
}).then(function(horrorMovies){
    iterateMovies(horrorMovies, "horror")
})

fetch(comedyApi)
.then(function(response){
    return response.json()
}).then(function(comedyMovies){
    iterateMovies(comedyMovies, "comedy")
})

fetch(actionApi)
.then(function(response){
    return response.json()
}).then(function(actionMovies){
    iterateMovies(actionMovies, "action")
}) //end all fetches

// iterate all movies
const iterateMovies = function(movies, genre) {
    movies.forEach(function(movie){
        movieCard(movie, genre)
    })
}

//append a movie
const movieCard = function(movie, genre) {
    let ul = document.getElementById(genre)
    let li = document.createElement("li")
    li.className = "movie-card"
    li.dataset.genre = genre

    let title = document.createElement("h1")
    let duration = document.createElement("p")
    let cover = document.createElement("img")

    title.innerText = movie.title
    duration.innerText = movie["duration-in-hours"]
    cover.src = movie.cover
    let div = document.createElement("div")
    div.style.display = "none"
    div.className = "cast"
    

    let button = document.createElement("button")
    button.innerText = "View Cast"
    // iterate through cast
    movie.cast.forEach(function(actor) {
        let cast = document.createElement("p")
        cast.innerText = `Actor ${actor.name} plays ${actor.character}`
        div.appendChild(cast)
    })
    
    //put the view together
    li.appendChild(title)
    li.appendChild(duration)
    li.appendChild(cover)
    li.appendChild(button)
    ul.appendChild(li)
    li.appendChild(div)

    //add button listener to view/hide cast details
    button.addEventListener('click', function(e){
        if (e.target.nextSibling.style.display === "none") {
            e.target.nextSibling.style.display = "block" 
        } else if (e.target.nextSibling.style.display === "block") {
            e.target.nextSibling.style.display = "none"
        }
    }) //end button listener
} //end of append movies

// dropdown listener
let dropdown = document.getElementsByName("genre-dropdown")[0]
dropdown.addEventListener('change', function(e){
    let horror = document.getElementById("horror")
    let comedy = document.getElementById("comedy")
    let action = document.getElementById("action")

    if (e.target.value === "horror") {
        comedy.style.display = "none"
        action.style.display = "none"
        horror.style.display = "block"
    } else if (e.target.value === "comedy") {
        comedy.style.display = "block"
        horror.style.display = "none"
        action.style.display = "none"
    } else if (e.target.value === "action") {
        horror.style.display = "none"
        comedy.style.display = "none"
        action.style.display = "block"
    } else if (e.target.value === "all") {
        horror.style.display = "block"
        comedy.style.display = "block"
        action.style.display = "block"
    }
}) //end event listener for drop down

//place holder for "POST" link
const postfetchApi = function(movieObj, genreApi) {
    fetch(genreApi, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            accepts: "application/json"
        },
        body: JSON.stringify(movieObj)
    }).then(function(res){
        return res.json()
    }).then(function(json){
        console.log(json);
        movieCard(json, genreApi.split('/').pop())
    })


    console.log(movieObj)
    console.log(genreApi)
}

//form for adding a movie
let divFormContainer = document.createElement("div")
let form = document.createElement('form')
form.id = "add-movie"
form.innerHTML = `<h2>Add a Movie:</h2>
<form>
Title:<br>
<input type="text" name="title"><br>
Duration:<br>
<input type="text" name="duration-in-hours"><br>
Cover:<br>
<input type="text" name="cover"><br>
<h4>Cast Member:</h4>
Actor Name:<br>
<input type="text" name="actor[name]"><br>
Character Name:<br>
<input type="text" name="actor[character]"><br>
Genre:
<select name="genres">
    <option value="horror">Horror</option>
    <option value="comedy">Comedy</option>
    <option value="action">Action</option>
</select>
<br><br>
<input type="submit" value="Add Movie"></form>`
divFormContainer.appendChild(form)
let toolsContainer = document.getElementsByClassName("tools")[0]
toolsContainer.appendChild(divFormContainer)
form.style.display = "none"
let addMovieButton = document.querySelector(`[data-id="add-movie"]`)

// movie listener
addMovieButton.addEventListener("click", function(e){
    form.style.display === "none" ? form.style.display = "block" : form.style.display = "none"
}) //end add movie listener

form.addEventListener("submit", function(e){
    e.preventDefault()
    let title = e.target[0].value
    let duration = e.target[1].value
    let cover = e.target[2].value
    let actorName = e.target[3].value
    let characterName = e.target[4].value
    let genre = e.target[5].value
    
    let movieObj = {
        title: title,
        "duration-in-hours": duration,
        cover: cover,
        "cast": [
            {
            name: actorName,
            character: characterName 
            }
        ]
    }

    let genreApi = function(genre) {
        switch (genre) {
            case "horror":
                return horrorApi
            case "comedy":
                return comedyApi
            case "action":
                return actionApi
        }
    }// end switch

    postfetchApi(movieObj, genreApi(genre))
    
})
