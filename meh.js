let wins = 0
let losses = 0
let numberOfDoors
let gameOver

function promptUser() {
    numberOfDoors = parseInt(prompt("Set the number of doors you want to play with!\nIt has to be a number between 3 and 2000!"))
}

while (numberOfDoors < 3 || numberOfDoors > 2000 || isNaN(numberOfDoors)) {
    snumberOfDoors = promptUser()
}

function playGame(numberOfDoors) {

    if (gameOver) return
    document.querySelector("main").remove()
    const mainElement = document.createElement("main")
    document.querySelector("body").appendChild(mainElement)

    const messageContainer = document.createElement("div")
    messageContainer.className = "message_container"
    mainElement.appendChild(messageContainer)

    const messageElement = document.createElement("p")
    messageElement.className = "message"
    messageContainer.appendChild(messageElement)

    const doors_grid = document.createElement("div")
    doors_grid.className = "doors_grid"
    mainElement.appendChild(doors_grid)


    const doors = []

    class Door {
        constructor(number, opened = false, selected = false, value = "goat") {
            this.number = number
            this.opened = opened
            this.selected = selected
            this.value = value
        }
    }

    for (let i = 0; i < numberOfDoors; i++) doors.push(new Door(i))

    const doorsDiv = document.querySelector(".doors_grid")
    let selectedDoor

    for (let i = 0; i < doors.length; i++) {
        const newDoor = document.createElement("div")
        newDoor.className = "door active"
        newDoor.innerText = i + 1

        function handleDoorSelection(e) {

            const selectionExists = () => {
                return doors.some(door => door.selected === true)
            }
            if (selectionExists()) return

            selectedDoor = doors[parseInt(e.target.innerText) - 1]
            doors.map(door => door.selected = false)
            selectedDoor.selected = true
            e.target.classList.add("selected")

            let gmDoor
            for (let door of doors) {
                if (door.selected === false) {
                    if (door.value != "car") {
                        gmDoor = door
                        gmDoor.opened = true
                    }
                }
            }

            if (selectedDoor.value === "car") {

                const goatDoors = doors.filter(door => door.value !== "car")

                const randomGoatDoorNr = Math.floor(Math.random() * goatDoors.length - 1) + 1
                goatDoors[randomGoatDoorNr].opened = false
            }

            const otherDoorStillInPlay = doors.filter(door => door.selected === false && door.opened === false)[0]
            console.log(doors)

            const doorElements = document.querySelectorAll(".door")
            doors.map((door, index) => {
                if (door.selected === false) doorElements[index].classList.replace("active", "inactive")
            })

            doorElements[otherDoorStillInPlay.number].classList.replace("inactive", "active")

            document.querySelector(".message").innerText = `You selected door ${selectedDoor.number + 1}. The game master opened every door, except door Nr. ${otherDoorStillInPlay.number + 1}. Behing every opened door there is a goat. \n\nWould you like to go with the other door instead of your initial selection?`

            function resetGame() {
                gameOver = false
                playGame(numberOfDoors)
            }

            function handleFinalDecision(e) {

                if (e.target.className === "yesButton") {
                    for (let door of doors) {
                        if (door.opened === false) door.selected = !door.selected
                    }

                    doorElements.forEach(door => door.classList.remove("selected"))
                    doorElements[otherDoorStillInPlay.number].classList.add("selected")
                }

                for (let door of doors) {
                    if (door.selected === true) {
                        document.querySelector(".message").innerText = "Behind your door was a " + door.value + "."

                        if (door.value === "car") wins++
                        else losses++

                        doors.map((door, index) => {
                            if (door.value != "car") doorElements[index].classList.replace("active", "inactive")
                        })
                        doors.map(door => door.opened = true)

                        gameOver = true

                        yesButton.style.display = "none"
                        noButton.style.display = "none"

                    }

                }

                const winsElement = document.querySelector(".wins")
                const lossesElement = document.querySelector(".losses")

                winsElement.innerText = `Wins: ${wins}`
                lossesElement.innerText = `Losses: ${losses}`

                const restartButton = document.createElement("button")
                restartButton.className = "restartButton"
                restartButton.innerText = "Play Again"
                restartButton.addEventListener("click", resetGame)
                buttonDiv.appendChild(restartButton)
            }

            const buttonDiv = document.createElement("div")
            buttonDiv.className = "buttons"
            document.querySelector("main").appendChild(buttonDiv)

            const yesButton = document.createElement("button")
            yesButton.className = "yesButton"
            yesButton.innerText = "Yes"
            yesButton.addEventListener("click", handleFinalDecision)
            buttonDiv.appendChild(yesButton)

            const noButton = document.createElement("button")
            noButton.className = "noButton"
            noButton.innerText = "No"

            noButton.addEventListener("click", handleFinalDecision)
            buttonDiv.appendChild(noButton)
        }

        newDoor.addEventListener("click", handleDoorSelection)
        doorsDiv.appendChild(newDoor)

    }
    document.querySelector(".message").innerText = "A brand new sportscar awaits you behind one of these doors, the others hide goats behind them. Make your selection!"


    const randomDoorNr = Math.floor(Math.random() * doors.length - 1) + 1
    const carDoor = doors[randomDoorNr]

    carDoor.value = "car"

}
playGame(numberOfDoors)
