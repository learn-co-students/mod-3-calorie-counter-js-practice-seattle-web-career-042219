document.addEventListener("DOMContentLoaded", () => {
  getCall();
  addListeners();
});

const getAPI = "http://localhost:3000/api/v1/calorie_entries";

function addListeners() {
  let form = document.getElementById("new-calorie-form");
  form.addEventListener("submit", e => {
    e.preventDefault();
    postCalorieIntake(e);
  });
}
function getCall() {
  fetch(getAPI)
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

  let div1 = document.createElement("div");
  div1.classList.add("uk-grid");

  let div2 = document.createElement("div");
  div2.classList.add("uk-width-1-6");
  div2.innerHTML = ` <strong>${datum.calorie}</strong>
  <span>kcal</span>`;

  let div3 = document.createElement("div");
  div3.classList.add("uk-width-4-5");
  div3.innerHTML = `<em class="uk-text-meta">${datum.note}</em>`;

  let div4 = document.createElement("div");
  div4.classList.add("list-item-menu");

  let a1 = document.createElement("a");
  a1.setAttribute("class", "edit-button"),
    a1.setAttribute("uk-icon", "icon: pencil");
  a1.setAttribute("uk-toggle", "target: #edit-form-container");

  let a2 = document.createElement("a");
  a2.classList.add("delete-button");
  a2.setAttribute("uk-icon", "icon: trash");
  a2.addEventListener("click", e => {
    e.preventDefault;
    deleteEntry(datum, li);
  });

  div4.appendChild(a1);
  div4.appendChild(a2);
  div1.appendChild(div2);
  div1.appendChild(div3);
  li.appendChild(div1);
  li.appendChild(div4);
  ulCaloriesList.prepend(li);
}

function calculateSum(datum) {
  console.log("datum=", datum);
  let progressBar = document.getElementsByClassName("uk-progress");
  let calTotal = document.getElementsByClassName("uk-width-1-6");
  let sum = 0;
  for (let i = 0; i < calTotal.length; i++) {
    sum += parseInt(calTotal[i].innerText, 10);
  }
  //   calTotal.forEach(function(element) {
  //     let sum = 0;
  //     sum += element.calorie;
  //   });
  progressBar[0].max = 6000;
  progressBar[0].value = sum;
  console.log("progressBar.value=", progressBar[0].value);
}

function postCalorieIntake(e) {
  let calories = e.target[0].value;
  let note = e.target[1].value;
  e.target[0].value = "";
  e.target[1].value = "";
  fetch(getAPI, {
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

function deleteEntry(datum, li) {
  fetch(getAPI + "/" + datum.id, {
    method: "DELETE"
  })
    .then(res => res.json)
    .then(li.remove())
    .catch(err => console.log(err));
}
