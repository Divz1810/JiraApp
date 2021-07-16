let addBtn= document.querySelector(".add");
let body= document.querySelector("body");
let grid= document.querySelector(".grid");

let colors= ["pink", "blue", "green", "black"]; //colors array in priority sequence

let allFiltersChildren = document.querySelectorAll(".filter div");

for (let i = 0; i < allFiltersChildren.length; i++) {
  allFiltersChildren[i].addEventListener("click", function (e) {
    if(e.currentTarget.classList.contains("pri-selected")){
        e.currentTarget.classList.remove("pri-selected");
        loadTasks();
    }else{
        e.currentTarget.classList.add("pri-selected");
        let filterColor = e.currentTarget.classList[0];
        loadTasks(filterColor);
    }
  });
}


let deleteBtn = document.querySelector(".delete");

let deleteMode = false; //ki delete krna h ya nahi

//permanently saving our ticket to local storage
if (localStorage.getItem("AllTickets") == undefined) { //agar local storage mei allTickets naam ka object nahi h toh
    let allTickets = {}; //object banado
  
    allTickets = JSON.stringify(allTickets); //us object ko string mei covert krdo kuki localStorage string k form mei hi store krti h values
  
    localStorage.setItem("AllTickets", allTickets);//fir local storge mei vo stringified object daaldo
  }

  loadTasks();
//making our delete btn work
deleteBtn.addEventListener("click", function (e) {
  if (e.currentTarget.classList.contains("delete-selected")) { //agar delete mode selected h toh  usme delete selected vali class hoegi
    e.currentTarget.classList.remove("delete-selected");//toh use remove kr do
    deleteMode = false;
  } else {
    e.currentTarget.classList.add("delete-selected");// agar delete select n h toh use ab select krdo
    deleteMode = true; //or delete mode on krdo
  }
});

//adding popup to our page
addBtn.addEventListener("click", function(){ //for adding popup when we click on add

    deleteBtn.classList.remove("delete-selected"); //agar delete mode on h toh use bnd krlo 
    deleteMode = false;

    let preModal = document.querySelector(".modal");
    if(preModal!=null) return;  //agar phle se modal h toh naya modal mt bnao

    let div= document.createElement("div"); //ek div bnaega
    div.classList.add("modal");//us div ko class de dega modal

    div.innerHTML= `<div class="task-section">
    <div class="task-inner-container" contenteditable="true"></div>
</div>
<div class="modal-priority-section">
    <div class="priority-inner-container">
        <div class="priority pink"></div>
        <div class="priority green"></div>
        <div class="priority blue"></div>
        <div class="priority black selected"></div>
    </div>
</div>`;

let ticketColor= "black";

//for selecting particular priority
let allModalPriority = div.querySelectorAll(".priority"); //selects all priority boxes
for(let i=0;i<allModalPriority.length;i++){
    allModalPriority[i].addEventListener("click", function(e){

        for(let j=0;j<allModalPriority.length;j++){ //agar pehle koi box selected tha toh ab use unselect krdo 
             allModalPriority[j].classList.remove("selected");  //mtlb usse selected vali class hata do
        }

        e.currentTarget.classList.add("selected");// ab use select krdo mtlb selected class daal do usme
        ticketColor = e.currentTarget.classList[1]; //gives the color of selected box
    });
}

//adding ticket to our grid
let taskInnerContainer=  div.querySelector(".task-inner-container");
taskInnerContainer.addEventListener("keydown", function(e){
    if(e.key=="Enter"){ //Enter press hone pe ticket grid pe show ho jae
        let id = uid();//unqiue id using library
        let task = e.currentTarget.innerText;

        //Adding ticket to our local storage
        // step1 => jobhi data hai localstorage use lekr aao
        let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

         // step2 => usko update kro
        let ticketObj = {
            color: ticketColor,
            taskValue: task,
        };
        allTickets[id] = ticketObj; //all tickets mei ek naya object store krdo

         // step3 => wapis updated object ko localstorage me save krdo
        localStorage.setItem("AllTickets", JSON.stringify(allTickets));

       

        let ticketDiv= document.createElement("div"); 
        ticketDiv.classList.add("ticket");

        ticketDiv.setAttribute("data-id", id); //id of each ticket

        ticketDiv.innerHTML= `<div data-id="${id}" class="ticket-color ${ticketColor}"></div>
        <div class="ticket-id"> #${id}</div>
        <div data-id="${id}" class="actual-task"  contenteditable="true"> ${task}</div>`;

        //CHANGING PRIORTY (ie. color) OF OUR TICKET
        let ticketColorDiv = ticketDiv.querySelector(".ticket-color");

        let actualTaskDiv = ticketDiv.querySelector(".actual-task");

        //updating task in local storage also if we are editing it in ticket
        actualTaskDiv.addEventListener("input", function (e) { //input-> har baar jab kch type hoega 
            let updatedTask = e.currentTarget.innerText;

            let currTicketId = e.currentTarget.getAttribute("data-id");//naye task ko nikaalo
            let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

            allTickets[currTicketId].taskValue = updatedTask;// old task ki jagah ddal do

            localStorage.setItem("AllTickets", JSON.stringify(allTickets));
        });

        ticketColorDiv.addEventListener("click", function(e){

            let currTicketId = e.currentTarget.getAttribute("data-id");
            let currentColor = e.currentTarget.classList[1]; 
            let idx=-1;
            for(let i=0;i<colors.length;i++){ //finding idx of current color
                if(colors[i]==currentColor) idx=i;
            }

            idx++;
            idx= idx % 4; //so that cyclic motion mei rhe

            let newColor= colors[idx];


            //1- all tickets lana ; 2- update krna ; 3- wapis save krna
            let allTickets = JSON.parse(localStorage.getItem("AllTickets"));
            allTickets[currTicketId].color = newColor;
            localStorage.setItem("AllTickets", JSON.stringify(allTickets));

            ticketColorDiv.classList.remove(currentColor);
            ticketColorDiv.classList.add(newColor);
        });

        //for deleting ticket when delete mode is on
        ticketDiv.addEventListener("click", function (e) {
            if (deleteMode) { 
              let currTicketId = e.currentTarget.getAttribute("data-id");
              e.currentTarget.remove();

              //deleting from local storage also
              let allTickets = JSON.parse(localStorage.getItem("AllTickets"));
              delete allTickets[currTicketId];
              localStorage.setItem("AllTickets", JSON.stringify(allTickets));
            }
          });
    

        grid.append(ticketDiv);

        div.remove(); //kuki ab ticket grid pe aa gai hai toh hum modal ko gayab kr dege
    }else if(e.key== "Escape"){
        div.remove();
    }
});

 body.append(div);
});

function loadTasks(color) {
    let ticketsOnUi = document.querySelectorAll(".ticket");
  
    for (let i = 0; i < ticketsOnUi.length; i++) {
      ticketsOnUi[i].remove();
    }
  
    //1- fetch alltickets data
  
    let allTickets = JSON.parse(localStorage.getItem("AllTickets"));
  
    //2- create ticket UI for each ticket obj
    //3- attach required listeners
    //4- add tickets in the grid section of ui
  
    for (x in allTickets) {
      let currTicketId = x;
      let singleTicketObj = allTickets[x]; //pink
  
      //passed color was black
      if (color) {
        if (color != singleTicketObj.color) continue;
      }
  
      let ticketDiv = document.createElement("div");
      ticketDiv.classList.add("ticket");
  
      ticketDiv.setAttribute("data-id", currTicketId);
  
      ticketDiv.innerHTML = ` <div data-id="${currTicketId}" class="ticket-color ${singleTicketObj.color}"></div>
        <div class="ticket-id">
          #${currTicketId}
        </div>
        <div data-id="${currTicketId}" class="actual-task" contenteditable="true">
          ${singleTicketObj.taskValue}
        </div>`;
  
      let ticketColorDiv = ticketDiv.querySelector(".ticket-color");
  
      let actualTaskDiv = ticketDiv.querySelector(".actual-task");
  
      actualTaskDiv.addEventListener("input", function (e) {
        let updatedTask = e.currentTarget.innerText;
  
        let currTicketId = e.currentTarget.getAttribute("data-id");
        let allTickets = JSON.parse(localStorage.getItem("AllTickets"));
  
        allTickets[currTicketId].taskValue = updatedTask;
  
        localStorage.setItem("AllTickets", JSON.stringify(allTickets));
      });
  
      ticketColorDiv.addEventListener("click", function (e) {
        // let colors = ["pink", "blue", "green", "black"];
  
        let currTicketId = e.currentTarget.getAttribute("data-id");
  
        let currColor = e.currentTarget.classList[1]; //green
  
        let index = -1;
        for (let i = 0; i < colors.length; i++) {
          if (colors[i] == currColor) index = i;
        }
  
        index++;
        index = index % 4;
  
        let newColor = colors[index];
  
        //1- all tickets lana ; 2- update krna ; 3- wapis save krna
  
        let allTickets = JSON.parse(localStorage.getItem("AllTickets"));
  
        allTickets[currTicketId].color = newColor;
  
        localStorage.setItem("AllTickets", JSON.stringify(allTickets));
  
        ticketColorDiv.classList.remove(currColor);
        ticketColorDiv.classList.add(newColor);
      });
  
      ticketDiv.addEventListener("click", function (e) {
        if (deleteMode) {
          let currTicketId = e.currentTarget.getAttribute("data-id");
  
          e.currentTarget.remove();
  
          let allTickets = JSON.parse(localStorage.getItem("AllTickets"));
  
          delete allTickets[currTicketId];
  
          localStorage.setItem("AllTickets", JSON.stringify(allTickets));
        }
      });
  
      grid.append(ticketDiv);
    }
  }