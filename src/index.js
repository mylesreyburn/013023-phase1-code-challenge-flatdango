// Your code here

const filmList = document.querySelector("ul#films.ui.divided.list")

const filmBox = document.querySelector("div#showing.ui.cards")

const filmBoxTitle = document.querySelector("div#title.title")
const filmBoxRuntime = document.querySelector("div#runtime.meta")
const filmBoxDescription = document.querySelector("div#film-info")
const filmBoxShowtime = document.querySelector("span#showtime.ui.label")
const filmBoxPoster = document.querySelector("img#poster")
const filmBoxTickets = document.querySelector("span#ticket-num")

const buyTicketButton = document.getElementById("buy-ticket")

buyTicketButton.addEventListener("click", () =>{

    if(filmBox.selectedMovieTickets > 0){
        filmBox.selectedMovieTickets -= 1
        
        filmBox.selectedMovieTicketsSold += 1

        filmBoxTickets.textContent = filmBox.selectedMovieTickets

        fetch(`http://localhost:3000/films/${filmBox.selectedMovieId}`, {
            method: "PATCH",
            headers:
            {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({
                tickets_sold: filmBox.selectedMovieTicketsSold
            })
        })
    }

    if(filmBox.selectedMovieTickets == 0){
        buyTicketButton.textContent = "SOLD OUT"
    }

})



renderMovies()

function renderMovies(){

    let firstMovie = true

    fetch("http://localhost:3000/films")
    .then(response => response.json())
    .then((data) =>{
        for(movie in data){

            // initial blocks to port over data from db as variables
            let currentMovie = data[movie]

            let currentId = currentMovie.id
            let currentTitle = currentMovie.title
            let currentRuntime = currentMovie.runtime
            let currentCapacity = currentMovie.capacity
            let currentShowtime = currentMovie.showtime
            let currentTicketsSold = currentMovie.tickets_sold
            let currentDescription = currentMovie.description
            let currentPoster = currentMovie.poster

            // method to render first movie in the list when page first loads
            if(firstMovie){
                filmBoxTitle.textContent = currentTitle
                filmBoxRuntime.textContent = currentRuntime
                filmBoxDescription.textContent = currentDescription
                filmBoxPoster.src = currentPoster
                filmBoxShowtime.textContent = currentShowtime

                filmBox.selectedMovieId = currentId
                filmBox.selectedMovieTicketsSold = currentTicketsSold
                filmBox.selectedMovieTickets = currentCapacity - currentTicketsSold
                filmBoxTickets.textContent = filmBox.selectedMovieTickets

                firstMovie = false
            }

            

            // method to render movies in list and add functionality
            let movieListTitle = document.createElement("li")
            movieListTitle.classList.add("film")
            movieListTitle.classList.add("item")
            movieListTitle.textContent = currentTitle
            movieListTitle.addEventListener("click", () => {

                // method to render movies in the list into the detailed box in the middle of the page when clicked
                filmBoxTitle.textContent = currentTitle
                filmBoxRuntime.textContent = currentRuntime
                filmBoxDescription.textContent = currentDescription
                filmBoxPoster.src = currentPoster
                filmBoxShowtime.textContent = currentShowtime

                // neat thing I found out while researching for the toy tale lab: you can assign values to attributes
                // within html elements, allowing you to carry variables around between differently scoped objects
                filmBox.selectedMovieId = currentId
                filmBox.selectedMovieTicketsSold = currentTicketsSold
                filmBox.selectedMovieTickets = currentCapacity - currentTicketsSold

                filmBoxTickets.textContent = filmBox.selectedMovieTickets
                
                
            })

            // nonfunctional code for a delete button (deleted the film with the id of "1", rather than the actually correct film)
            
            // let deleteButton = document.createElement("button")
            // deleteButton.textContent = "[X]"
            // deleteButton.addEventListener("click", () => {
            //     fetch(`http://localhost:3000/films/${filmBox.selectedMovieId}`, {
            //         method: "DELETE",
            //         headers:{
            //             "Content-Type": "application.json"
            //         }  
            //     })
            //     filmList.removeChild(movieListTitle)
            // })
            
            // movieListTitle.appendChild(deleteButton)
            
            filmList.appendChild(movieListTitle)
            
        }
            
        
    })
}