<<<<<<< HEAD
// your code here, it may be worth it to ensure this file only runs AFTER the dom has loaded.

document.addEventListener("DOMContentLoaded", () => {});
=======
document.addEventListener("DOMContentLoaded", () => {
  getCall();
  addListeners();
});

const baseURL = "http://localhost:3000/api/v1/calorie_entries";

function addListeners() {
  const form = document.getElementById("new-calorie-form");
  form.addEventListener("submit", e => {
    e.preventDefault();
    postEntry(e);
  });
  const calBtn = document.getElementById("calculate-button");
  calBtn.addEventListener("click", e => {
    e.preventDefault();
    calculateBMI();
  });
}

function getCall() {
  fetch(baseURL)
    .then(res => res.json())
    .then(data => loadInfo(data))
    .catch(err => console.log(err));
}

function loadInfo(data) {
  let ulCaloriesList = document.getElementById("calories-list");
  ulCaloriesList.innerHTML = "";
  data.forEach(datum => loadOneDatum(datum));
  calculateSum(data);
}

function loadOneDatum(datum) {
  let ulCaloriesList = document.getElementById("calories-list");

  let li = document.createElement("li");
  li.classList.add("calories-list-item");

  let mainDiv1 = document.createElement("div");
  mainDiv1.classList.add("uk-grid");

  let calorieDiv2 = document.createElement("div");
  calorieDiv2.classList.add("uk-width-1-6");
  calorieDiv2.innerHTML = ` <strong>${datum.calorie}</strong>
  <span>kcal</span>`;

  let noteDiv3 = document.createElement("div");
  noteDiv3.classList.add("uk-width-4-5");
  noteDiv3.innerHTML = `<em class="uk-text-meta">${datum.note}</em>`;

  let menuDiv4 = document.createElement("div");
  menuDiv4.classList.add("list-item-menu");

  let a1Edit = document.createElement("a");
  a1Edit.setAttribute("class", "edit-button"),
    a1Edit.setAttribute("uk-icon", "icon: pencil"),
    a1Edit.setAttribute("uk-toggle", "target: #edit-form-container");
  a1Edit.addEventListener("click", e => {
    e.preventDefault();
    openForm(datum, li);
  });

  let a2Delete = document.createElement("a");
  a2Delete.setAttribute("class", "delete-button");
  a2Delete.setAttribute("uk-icon", "icon: trash");
  a2Delete.addEventListener("click", e => {
    e.preventDefault();
    deleteEntry(datum, li);
  });

  menuDiv4.appendChild(a1Edit);
  menuDiv4.appendChild(a2Delete);
  mainDiv1.appendChild(calorieDiv2);
  mainDiv1.appendChild(noteDiv3);
  li.appendChild(mainDiv1);
  li.appendChild(menuDiv4);
  ulCaloriesList.prepend(li);
}

function calculateSum() {
  let progressBar = document.getElementById("progress-bar");
  let calTotal = document.getElementsByClassName("uk-width-1-6");
  let sum = 0;
  for (let i = 0; i < calTotal.length; i++) {
    sum += parseInt(calTotal[i].innerText, 10);
  }
  progressBar.value = sum;
}

function calculateBMI() {
  let weight = document.getElementById("weight").value;
  let height = document.getElementById("height").value;
  let age = document.getElementById("age").value;
  let lowerRange = 655 + 4.35 * weight + 4.7 * height - 4.7 * age;
  let higherRange = 655 + 6.23 * weight + 12.7 * height - 6.8 * age;
  document.getElementById("lower-bmr-range").innerHTML = lowerRange;
  document.getElementById("higher-bmr-range").innerHTML = higherRange;
  let progressBar = document.getElementById("progress-bar");
  progressBar.max = (lowerRange + higherRange) / 2;
}

function postEntry(e) {
  let calories = e.target[0].value;
  let note = e.target[1].value;
  e.target[0].value = "";
  e.target[1].value = "";
  fetch(baseURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      api_v1_calorie_entry: { calorie: calories, note: note }
    })
  })
    .then(res => res.json())
    .then(function(datum) {
      loadOneDatum(datum);
      calculateSum(datum);
    })
    .catch(err => console.log(err));
}

function openForm(datum, li) {
  let editCalories = document.getElementById("edit-calories");
  let editNotes = document.getElementById("edit-notes");
  editCalories.value = datum.calorie;
  editNotes.value = datum.note;
  const editForm = document.getElementById("edit-calorie-form");
  editForm.addEventListener("submit", e => {
    e.preventDefault();
    editEntry(editCalories, editNotes, datum, li);
  });
}

function editEntry(editCalories, editNotes, datum, li) {
  let calories = editCalories.value;
  let note = editNotes.value;
  fetch(baseURL + "/" + datum.id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      api_v1_calorie_entry: { calorie: calories, note: note }
    })
  })
    .then(res => res.json())
    .then(function(response) {
      loadOneDatum(response);
      calculateSum(response);
    })
    .then(li.remove())
    .catch(err => console.log(err));
}

function deleteEntry(datum, li) {
  fetch(baseURL + "/" + datum.id, {
    method: "DELETE"
  })
    .then(res => res.json)
    .then(li.remove())
    .then(calculateSum())
    .then(calculateBMI())
    .catch(err => console.log(err));
}
>>>>>>> e8d4b5563b2d3197de5901b63612f5ec245760ec
