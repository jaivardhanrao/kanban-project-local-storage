
let ticketArrforLS = [];

// localStorage.clear();
//add button


let addBtn = document.querySelector(".add-btn");
addBtn.addEventListener("click", () => {
  let modal = document.querySelector(".modal-cont");
  // console.log(modalDiv.style.display);
  if (modal.style.display == "none") {
    modal.querySelector("textarea").value = "";
    modal.style.display = "flex";
  } else {
    modal.style.display = "none";
  }
});

// edit lock unlock button



function makeEditable(ticket) {
  let lockBtn = ticket.querySelector(".lock");
  let unlockBtn = ticket.querySelector(".unlock");
  lockBtn.addEventListener("click", () => {
    let taskArea = ticket.querySelector(".task-area");
    taskArea.contentEditable = "true";
    lockBtn.style.display = "none";
    unlockBtn.style.display = "block";
  });

  unlockBtn.addEventListener("click", () => {
    let taskArea = ticket.querySelector(".task-area");
    taskArea.contentEditable = "false";
    lockBtn.style.display = "block";
    unlockBtn.style.display = "none";
  });
}




// makeEditable(document.querySelector('.ticket-cont'));

//select color

let selectColor = document.querySelectorAll(".addTask");

let ticketColor = "";

for (let i = 0; i < selectColor.length; i++) {
  selectColor[i].addEventListener("click", () => {
    ticketColor = selectColor[i].getAttribute("data-color");
    for (let j = 0; j < selectColor.length; j++) {
      if (j != i) {
        selectColor[j].style.border = "2px solid rgb(39, 33, 33)";
      } else {
        selectColor[j].style.border = "2px solid #0267eb";
      }
    }
  });
}

// add a task

let modalCont = document.querySelector(".modal-cont");
document.addEventListener("keydown", (e) => {
  if (modalCont.style.display == "flex") {
    if (e.key == "Enter") {
      // let taskId = totalTask;
      const idGen = shortid();
      let taskName = document.querySelector("textarea").value;
      if (!taskName || taskName.trim() == "" || ticketColor == "") {
        alert("Please Select a Color and Enter Task Name");
        return;
      }
      createTicket(idGen, taskName, ticketColor);
      let modal = document.querySelector(".modal-cont");
      modal.querySelector("textarea").value = "";
      modal.style.display = "none";

      //local storage updation
      ticketArrforLS.push({color : ticketColor, id : idGen, task : taskName});
      ticketColor = "";
      // console.log(ticketArrforLS);
      updateLocalStorage();
    }
    if (e.key == "Escape") {
      let modal = document.querySelector(".modal-cont");
      modal.querySelector("textarea").value = "";
      modal.style.display = "none";
      ticketColor = "";
    }
  } else {
    return;
  }
});

// create ticket

function createTicket(Id, Name, Color) {
  let newTicket = document.createElement("div");
  newTicket.setAttribute("class", "ticket-cont");
  newTicket.innerHTML = `<div class="ticket-color"></div>
             <div class="ticket-id">${Id}</div>
             <div class="task-area" contenteditable="false">${Name}</div>
             <div class="ticket-lock">
                <i class="fa-solid fa-lock lock"></i>
                <i class="fa-solid fa-unlock unlock"></i>
              </div>`;
  let parent = document.querySelector(".main-cont");
  newTicket.querySelector(".ticket-color").style.backgroundColor = Color;
  makeEditable(newTicket);
  parent.appendChild(newTicket);
  removeTicket(newTicket);

  // Correctly initialize priority color change functionality
  let ticketClick = newTicket.querySelector(".ticket-color");
  changePriorityColor(newTicket);
}






// delete btn feature
let dltBtn = document.querySelector(".del");
let DELETE_MODE = false;


function removeTicket(ticket) {
    ticket.addEventListener("mouseover", () => {
        if (DELETE_MODE) {
            ticket.style.cursor = "pointer";
        } else {
            ticket.style.cursor = "default";
        }
    });

    ticket.addEventListener("click", () => {
        if (DELETE_MODE) { 
          let ticketId123 = ticket.querySelector(".ticket-id").textContent;
          console.log(ticketId123);
          let idx = ticketArrforLS.findIndex((data) => data.id == ticketId123);
          if (idx != -1) {
            ticketArrforLS.splice(idx, 1);
            updateLocalStorage();
          }
          ticket.remove();
        }
    });
    
   
}


dltBtn.addEventListener("click", () => {
    DELETE_MODE = !DELETE_MODE; 
    let bgTicket = document.querySelector("body");
    if (DELETE_MODE) {
        dltBtn.style.color = "red";
        bgTicket.style.backgroundColor = "#828385";
    } else {
        dltBtn.style.color = "white";
        bgTicket.style.backgroundColor = "white";
    }
});


const colors = ["lightpink", "lightgreen", "lightblue", "black"];


function changePriorityColor(ticket) {
  // Ensure the event listener is attached only once per ticket
  let ticketColorElement = ticket.querySelector(".ticket-color");
  
  ticketColorElement.addEventListener("click", () => {
    let currentColor = ticketColorElement.style.backgroundColor;
    let idx = colors.indexOf(currentColor);
    let newColor = colors[(idx + 1) % colors.length];
    
    // Update the ticket's color in the DOM
    ticketColorElement.style.backgroundColor = newColor;

    // Retrieve the ticket ID
    let ticketId = ticket.querySelector(".ticket-id").textContent;

    // Find and update the color in the ticketArrforLS array
    let ticketIndex = ticketArrforLS.findIndex(ticket => ticket.id === ticketId);
    if (ticketIndex !== -1) {
      ticketArrforLS[ticketIndex].color = newColor;
      updateLocalStorage();
    }
  });
}



function getIndexOf(idFind) {
    for (let i = 0; i < ticketArrforLS.length; i++) {
        if (ticketArrforLS[i].id == idFind) return i;
    }
    return -1;
}


// filter functionality

let filterVals = document.querySelectorAll('.colorFilter');

filterVals.forEach(filterVal => {
    filterVal.addEventListener('click', (e) => {
        let colorFilterVal = filterVal.getAttribute('data-color');
        let allTickets = document.querySelectorAll('.ticket-color');

        allTickets.forEach(ticket => {
            if (ticket.style.backgroundColor == colorFilterVal) {
                ticket.parentElement.style.display = 'block';
            } else {
                ticket.parentElement.style.display = 'none';
            }
        })
    })
})

//clear filter function

let clearFilter = document.querySelector('.clearFilter');
clearFilter.addEventListener('click', () => {
    let allTickets = document.querySelectorAll('.ticket-color');
    allTickets.forEach(ticket => {
        ticket.parentElement.style.display = 'block';
    })
})


// light mode dark mode toggles

let darkMode = document.querySelector('.fa-toggle-on');
let lightMode = document.querySelector('.fa-toggle-off');

lightMode.addEventListener('click', () => {
    document.body.style.backgroundColor = '#363734';
    lightMode.style.display = 'none';
    darkMode.style.display = 'block';

    // icons
    let icons = document.querySelectorAll('.changeOnMode');
    let iconsBG = document.querySelectorAll('.changeOnModeDiv');
    icons.forEach(icon => {
      icon.style.color = 'black';
    })
    iconsBG.forEach(icon => {
      icon.style.backgroundColor = 'white';
    })

    // modal

    let modalChange = document.querySelector('.textArea-cont');
    modalChange.style.backgroundColor = 'gray';
    modalChange.style.color = 'white';
    modalChange.classList.replace('placeholderLight', 'placeholderDark');


  })
  
  darkMode.addEventListener('click', () => {


    document.body.style.backgroundColor = 'white';
    darkMode.style.display = 'none';
    lightMode.style.display = 'block';


    let icons = document.querySelectorAll('.changeOnMode');
    let iconsBG = document.querySelectorAll('.changeOnModeDiv');


    // icons
    icons.forEach(icon => {
      icon.style.color = 'white';
    })
    iconsBG.forEach(icon => {
      icon.style.backgroundColor = '#353030';
    })

    // modal container

    let modalChange = document.querySelector('.textArea-cont');
    modalChange.style.backgroundColor = '';
    modalChange.style.color = 'black';
    modalChange.classList.replace('placeholderDark', 'placeholderLight');


})



// applying local storage


// function updateLocalStorage(){
//     localStorage.setItem('appTickets' , JSON.stringify(ticketArrforLS));
// }
function loadTickets() {
    let test = localStorage.getItem('appTickets');
    // console.log(test);
    if(test){
      ticketArrforLS = JSON.parse(test);
    }
}
loadTickets();

function fetchTickets() {
    if (ticketArrforLS.length === 0) return;
    ticketArrforLS.forEach(data => {
        const { id, color, task } = data;
        createTicket(id, task, color);
    });
    // clear the array
    ticketArrforLS.length = 0;
}
fetchTickets();



// localStorage.clear();






