const taskTitle = document.getElementById("task__name--input");
const taskDscrip = document.getElementById("task__dscrip--input");
const taskAdder = document.getElementById("task--adder");

const searchBar = document.getElementById("identifier");
const searchContainer = document.getElementById("matched--tasks");

const bodyEmpty = document.getElementById("empty__body");

const navCompleted = document.getElementById("completed");
const navRemaining = document.getElementById("remaining");
const navHome = document.getElementById("home");

const taskContainer = document.getElementById("all--tasks");
const completedContainer = document.getElementById("completed--tasks");
const remainingContainer = document.getElementById("remaining--tasks");

//variables
let i = 1;
let activeComponent = "task";

//initializer
let empty;
bodyEmpty.classList.contains("active") ? (empty = true) : empty;
let completed = [];
let remaining = [];
let all = [];

const emptyTheBody = () => {
  taskContainer.classList.remove("active");
  remainingContainer.classList.remove("active");
  completedContainer.classList.remove("active");
};

const emptyTheNav = () => {
  navCompleted.classList.remove("active");
  navRemaining.classList.remove("active");
  navHome.classList.remove("active");
};

//functions

//check for emptiness
const checkEmptiness = () => {
  const parentDiv = document.querySelector(`.${activeComponent}`);
  const emptyImage = parentDiv.querySelector(".empty");
  if (parentDiv.querySelector(".task--item"))
    emptyImage.classList.remove("active");
  else emptyImage.classList.add("active");
};

//set html content
const setHTML = (id, title, description, state = false) => {
  return `<div class="task--item" data-id="${id}">
  <p class="name">${title}</p>
  <p class="dscrip">${description}</p>
  <input type="checkbox" class="checkbox" ${state ? `checked="${state}"` : ``}/>
</div>`;
};

//render the matching tasks when searching
const renderSearch = (arr) => {
  document.querySelector(`.${activeComponent}`).classList.remove("active");
  searchContainer.classList.remove("active");
  console.log(searchContainer.childNodes.length);
  searchContainer.innerHTML = "";
  searchContainer.insertAdjacentHTML(
    "afterbegin",
    `<div class="empty active" id="empty__body">
    <img src="images/bullets.svg" alt="bullets" class="bullets" />
    <p>You have no tasks</p>
  </div>`
  );

  if (arr) searchContainer.querySelector(".empty").classList.remove("active");
  else searchContainer.querySelector(".empty").classList.add("active");

  arr.forEach((arr) => {
    const state = completed.some((subArr) =>
      arr.every((value, index) => value === subArr[index])
    );
    const HTML = setHTML(...arr, state);
    searchContainer.insertAdjacentHTML("afterbegin", HTML);
  });
  searchContainer.classList.add("active");
};

//add task to the completed div and remove from the remaining div
const addToCompletedDiv = (id, title, description, e) => {
  const HTMLContent = setHTML(id, title, description, "checked");
  completedContainer.insertAdjacentHTML("afterbegin", HTMLContent);

  document.querySelectorAll(".checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", checkboxChanged);
  });

  if (remaining.length > 0) {
    const elementToRemove = remainingContainer.querySelector(
      `[data-id="${id}"]`
    );
    elementToRemove.parentNode.removeChild(elementToRemove);
  } else if (remaining.length == 0) {
    if (remainingContainer.firstChild)
      remainingContainer.removeChild(remainingContainer.firstChild);
  }
};

//add to the remaining div and remove from completed div
const addToRemainingDiv = (id, title, description, e) => {
  const HTMLContent = setHTML(id, title, description);
  remainingContainer.insertAdjacentHTML("afterbegin", HTMLContent);

  document.querySelectorAll(".checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", checkboxChanged);
  });

  if (completed.length > 0) {
    const elementToRemove = completedContainer.querySelector(
      `[data-id="${id}"]`
    );
    elementToRemove.parentNode.removeChild(elementToRemove);
  } else if (completed.length == 0) {
    if (completedContainer.firstChild)
      completedContainer.removeChild(completedContainer.firstChild);
  }
};

//remove task from completed
const popFromCompleted = (id, title, description) => {
  id = Number(id);
  const index = completed.findIndex(
    (item) => item[0] === id && item[1] === title && item[2] === description
  );
  completed.splice(index, 1);
  remaining.push([id, title, description]);
  addToRemainingDiv(id, title, description);
};

const pushToCompleted = (id, title, description, e) => {
  id = Number(id);
  const index = remaining.findIndex(
    (item) => item[0] === id && item[1] === title && item[2] === description
  );
  remaining.splice(index, 1);
  completed.push([id, title, description]);
  addToCompletedDiv(id, title, description);
};

//completing a task
function checkboxChanged(e) {
  const parentElement = e.target.closest(".task--item");
  const dataId = parentElement.dataset.id;
  const title = parentElement.querySelector(".name").textContent;
  const description = parentElement.querySelector(".dscrip")?.textContent || "";
  if (e.target.checked) {
    pushToCompleted(dataId, title, description);
    taskContainer.querySelector(
      `[data-id="${dataId}"] .checkbox`
    ).checked = true;
  } else {
    popFromCompleted(dataId, title, description);
    taskContainer.querySelector(
      `[data-id="${dataId}"] .checkbox`
    ).checked = false;
  }
}

const addTaskToList = (event) => {
  event.preventDefault();
  const title = taskTitle.value;
  let dscrip;
  if (taskDscrip) {
    dscrip = taskDscrip.value;
  }
  HTMLContent = `
    <div class="task--item" data-id="${i}">
        <p class="name">${title}</p>
        ${dscrip ? `<p class="dscrip">${dscrip}</p>` : ``}
        <input type="checkbox" class="checkbox" />
    </div>`;
  taskContainer.insertAdjacentHTML("afterbegin", HTMLContent);

  document
    .querySelector(".checkbox")
    .addEventListener("change", checkboxChanged);

  if (empty) {
    bodyEmpty.classList.remove("active");
  }
  taskTitle.value = "";
  remaining.push([i, title, dscrip || ""]);
  addToRemainingDiv(i, title, dscrip || "", 1);
  all.push([i, title, dscrip || ""]);
  checkEmptiness();
  i++;
};

//event listeners

//navigation
navCompleted.addEventListener("click", (e) => {
  emptyTheBody();
  emptyTheNav();
  completedContainer.classList.add("active");
  navCompleted.classList.add("active");
  activeComponent = "completed";
  checkEmptiness();
});
navRemaining.addEventListener("click", (e) => {
  emptyTheBody();
  emptyTheNav();
  remainingContainer.classList.add("active");
  navRemaining.classList.add("active");
  activeComponent = "remaining";
  checkEmptiness();
});
navHome.addEventListener("click", (e) => {
  emptyTheBody();
  emptyTheNav();
  taskContainer.classList.add("active");
  navHome.classList.add("active");
  activeComponent = "task";
  checkEmptiness();
});

//adding a task
taskAdder.addEventListener("click", (e) => {
  addTaskToList(e);
});

taskTitle.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTaskToList(e);
  }
});

//seraching
searchBar.addEventListener("input", (e) => {
  let checker = e.target.value.toLowerCase();
  console.log(checker);
  if (checker === "") {
    searchContainer.classList.remove("active");
    document.querySelector(`.${activeComponent}`).classList.add("active");
  }

  if (activeComponent === "task") {
    const tasks = all.filter((arr) => {
      return arr[1].toLowerCase().startsWith(checker);
    });
    renderSearch(tasks);
  } else if (activeComponent === "completed") {
    const tasks = completed.filter((arr) => {
      return arr[1].toLowerCase().startsWith(checker);
    });
    renderSearch(tasks);
  } else {
    const tasks = remaining.filter((arr) => {
      return arr[1].toLowerCase().startsWith(checker);
    });
    renderSearch(tasks);
  }
});
