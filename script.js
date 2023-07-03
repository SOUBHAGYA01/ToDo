let allFilters = document.querySelectorAll(".filter");
let openModal = document.querySelector(".open-modal");
let closeModal = document.querySelector(".close-modal");
let allFilterClasses = ["red", "blue", "green", "yellow", "black"];
let ticketsContainer = document.querySelector(".tickets-container");
let myDB = window.localStorage;

let ticketModalOpen = false;
let isTextTyped = false;

let editing = false;
let prevedit;
let mapa = false;

openModal.addEventListener("click", openTicketModal);
closeModal.addEventListener("click", closeTicketModal);


for(let i=0;i<allFilters.length;i++){
  allFilters[i].addEventListener("click",selectFilter);
}



function selectFilter(e){
  // console.log(e);
  if(e.target.classList.contains("active-filter")){
    e.target.classList.remove("active-filter");
    ticketsContainer.innerHTML="";
    loadTickets();
  }else{
    if(document.querySelector(".active-filter")){
      document.querySelector(".active-filter").classList.remove("active-filter");
    }
    e.target.classList.add("active-filter");
    ticketsContainer.innerHTML = "";
    let filterClicked = e.target.classList[1];
    loadSelectedTickets(filterClicked);
  }

}




function loadSelectedTickets(filter){
  let allTickets = myDB.getItem("allTickets");
  if(allTickets){
    allTickets = JSON.parse(allTickets);
    for(let i = 0; i < allTickets.length;i++){
       let ticketobj = allTickets[i];
       if(ticketobj.ticketFilter==filter){
         appendTicket(ticketobj);
       }
    }
  }
}




function loadTickets()
{
  let allTickets = localStorage.getItem("allTickets");
  if(allTickets){
    allTickets = JSON.parse(allTickets);
    for(let i = 0; i < allTickets.length;i++){
      let ticketobj = allTickets[i];
      appendTicket(ticketobj);
    }
  }


  let pm=document.querySelector(".active-filter");

  if( pm != null){
    
    pm.classList.remove("active-filter")

  }

}

loadTickets();

function openTicketModal(object) {
  // console.log(e);
  if (ticketModalOpen) {
    return;
  }

  let ticketModal = document.createElement("div");
  ticketModal.classList.add("ticket-modal");
  ticketModal.innerHTML = `
    
        <div class="ticket-text" contenteditable="true" spellcheck="false" >Enter your text
        </div>
    

        <div class="ticket-filters">
            <div class="ticket-filter2 red selected-filter"></div>
            <div class="ticket-filter2 blue"></div>
            <div class="ticket-filter2 green"></div>
            <div class="ticket-filter2 yellow"></div>
            <div class="ticket-filter2 black"></div>
        </div>
    `;
  document.querySelector("body").append(ticketModal);
  ticketModalOpen = true;
  isTextTyped = false;
  let tickettextDiv = ticketModal.querySelector(".ticket-text");
  
//   tickettextDiv.innerText=`mu`


  tickettextDiv.addEventListener("keypress", handleKeyPress);

  let ticketFilters = ticketModal.querySelectorAll(".ticket-filter2");

  for (let i = 0; i < ticketFilters.length; i++) {
    ticketFilters[i].addEventListener("click", function (e) {
      if (e.target.classList.contains("selected-filter")) {
        return;
      }
      document
        .querySelector(".selected-filter")
        .classList.remove("selected-filter");
      e.target.classList.add("selected-filter");
    });
  }
}

function closeTicketModal(e) {

  if (ticketModalOpen ) {
    document.querySelector(".ticket-modal").remove();
    ticketModalOpen = false;
    // deleteTicketBtn.click();
    editing = false;
    
  }
  
}

function handleKeyPress(e) {
 // console.log(e);
  if (e.key == "Enter" && isTextTyped && e.target.textContent) {
    // console.log("inside if");
    let filterSelected =
      document.querySelector(".selected-filter").classList[1];

    let ticketId = uuid();
    // console.log(editing);
    // if( editing)
    // console.log(prevedit)

    if(editing){ticketId=prevedit}
   
    let ticketInfoObject = {
      ticketFilter: filterSelected,
      ticketValue: e.target.textContent,
      ticketId: ticketId,
    };
    appendTicket(ticketInfoObject);
    closeModal.click();
    // editing= false;
    // console.log(editing);
    saveTicketToDb(ticketInfoObject);
  }
  if(editing){
    isTextTyped= true;
  }
  if (!isTextTyped) {
    isTextTyped = true;
    e.target.textContent = "";
  }
}

function saveTicketToDb(ticketInfoObject) {
  let allTickets = myDB.getItem("allTickets");
  if (allTickets) {
    allTickets = JSON.parse(allTickets);
    allTickets.push(ticketInfoObject);
    myDB.setItem("allTickets", JSON.stringify(allTickets));
  } else {
    let allTickets = [ticketInfoObject];
    myDB.setItem("allTickets", JSON.stringify(allTickets));
  }
}

function appendTicket(ticketInfoObject) {
  let { ticketFilter, ticketValue, ticketId } = ticketInfoObject;

  
  let ticketDiv = document.createElement("div");
  ticketDiv.classList.add("ticket");
  ticketDiv.innerHTML = `
  <div class="ticket">
  <div class="ticket-header ${ticketFilter}">
  </div>

  <div class="ticket-content">
      <div class="ticket-info">
          <div class="ticket-id">${ticketId}</div>
          <div class="editableco">
              <div class="ticket-edit"><i class="fa-solid fa-pencil"></i></div>

              <div class="ticket-delete"><i class="fa-solid fa-trash"></i></div>
          </div>
          </div>
      <div class="ticket-value">
              ${ticketValue}
      </div>

  </div>
</div>
    `;

    // console.log(ticketDiv);
  let ticketHeader = ticketDiv.querySelector(".ticket-header");

  ticketHeader.addEventListener("click", function (e) {
   
    let currentFilter = e.target.classList[1]; // yellow

    let indexOfCurrFilter = allFilterClasses.indexOf(currentFilter); // 3

    let newIndex = (indexOfCurrFilter + 1) % allFilterClasses.length;

    let newFilter = allFilterClasses[newIndex];
      console.log({currentFilter,newFilter});
      console.log(ticketHeader)
    //ticketHeader.style.backgroundColor = newFilter;
    ticketHeader.classList.remove(currentFilter);
    ticketHeader.classList.add(newFilter);


    let allTickets = JSON.parse(myDB.getItem("allTickets"));

    for (let i = 0; i < allTickets.length; i++) {
      if (allTickets[i].ticketId == ticketId) {
        allTickets[i].ticketFilter = newFilter;
      }
    }

    myDB.setItem("allTickets", JSON.stringify(allTickets));
  });
  let allTickets = JSON.parse(myDB.getItem("allTickets"));

  


  let deleteTicketBtn = ticketDiv.querySelector(".ticket-delete");

  deleteTicketBtn.addEventListener("click", function (e) {
    ticketDiv.remove();
    let allTickets = JSON.parse(myDB.getItem("allTickets"));

    let updatedTicket = allTickets.filter(function (ticketObject) {
      if (ticketObject.ticketId == ticketId) {
        return false;
      }
      return true;
    });

    myDB.setItem("allTickets", JSON.stringify(updatedTicket));
  });

  
   if(ticketModalOpen){

    let af =document.querySelector(".active-filter")

    if(af==null){
       ticketsContainer.append(ticketDiv);
    }
    // console.log(af)
    // console.log("planr");
    // console.log(ticketFilter);
    if(af!=null){
    if(af.classList[1]==ticketFilter){
        ticketsContainer.append(ticketDiv);
    }  
   }
}
   else{
    ticketsContainer.append(ticketDiv)
   }

    


//    for editing purpose

  let editTicketBtn= ticketDiv.querySelector(".ticket-edit");

//   console.log(editTicketBtn);

  editTicketBtn.addEventListener("click",editThelist);

  function  editThelist(e){
    if( editing== true ){
        return ;
    }
    editing= true ;
    prevedit= ticketId;
      



    openTicketModal2(ticketInfoObject);
   
   
}


//  for editing part 

function openTicketModal2(theObject){

    console.log("editing")

    let   { ticketFilter , ticketValue,  ticketId } = theObject
    // console.log(ticketFilter)
  
    

    if (ticketModalOpen) {
        return;
      }
    
      let ticketModal = document.createElement("div");
      ticketModal.classList.add("ticket-modal");
      ticketModal.innerHTML = `
        
            <div class="ticket-text" contenteditable="true" spellcheck="false" >${ticketValue}
            </div>
        
    
            <div class="ticket-filters">
                <div class="ticket-filter2 red "></div>
                <div class="ticket-filter2 blue"></div>
                <div class="ticket-filter2 green"></div>
                <div class="ticket-filter2 yellow"></div>
                <div class="ticket-filter2 black"></div>
            </div>
        `;
      
      let editingFilter = ticketModal.querySelectorAll(".ticket-filter2");
       
      for(let  i = 0 ;i< editingFilter.length;i++){
             
        if(editingFilter[i].classList[1]==ticketFilter){
                 
            editingFilter[i].classList.add("selected-filter")
        }

      }
      document.querySelector("body").append(ticketModal);
      
      ticketModalOpen = true;
      isTextTyped = false;
      let tickettextDiv = ticketModal.querySelector(".ticket-text");


    
      tickettextDiv.addEventListener("keypress", handleKeyPress);
    
      let ticketFilters = ticketModal.querySelectorAll(".ticket-filter2");
    
      for (let i = 0; i < ticketFilters.length; i++) {
        ticketFilters[i].addEventListener("click", function (e) {
          if (e.target.classList.contains("selected-filter")) {
            return;
          }
          document
            .querySelector(".selected-filter")
            .classList.remove("selected-filter");
          e.target.classList.add("selected-filter");
        });
      }


    deleteTicketBtn.click();
    
      }


    


 }
