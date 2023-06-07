const tblBody = document.querySelector("tbody");
const buttonStart = document.querySelector("button");
let categories = [];

async function getCategoryIds(category) {
  const res = await axios.get("https://jservice.io/api/clues", {
    params: { category },
  });
  const data = res.data.sort(() => Math.random() - 0.5).slice(0, 6);
  data.map(function (clues, index) {
    categories[index].clues.push({
      answer: clues.answer,
      question: clues.question,
      showing: null,
    });
  });
}

async function getCategory() {
  showLoadingView();
  buttonStart.innerHTML = "Loading...";
  categories = [];
  const res = await axios.get("https://jservice.io/api/categories", {
    params: { count: 100 },
  });
  const data = res.data.sort(() => Math.random() - 0.5).slice(0, 6);
  for (let category of data) {
    categories.push({ title: category.title, clues: [] });
    getCategoryIds(category.id);
  }
  buttonStart.innerHTML = "RESET";
  hideLoadingView();
  fillTable();
}

function fillTable() {
  const tableHead = document.querySelector("thead");
  const tableBody = document.querySelector("tbody");

  for (let tr of document.querySelectorAll("tr")) {
    tr.remove();
  }

  for (let th of document.querySelectorAll("th")) {
    th.remove();
  }

  for (let x = 0; x < categories.length; x++) {
    const thCategory = document.createElement("th");
    const trCategory = document.createElement("tr");
    let title = categories[x].title.toUpperCase();

    for (let y = 0; y < categories.length; y++) {
      const thClues = document.createElement("th");
      thClues.innerText = "?";
      thClues.dataset.id = `${x}-${y}`;
      trCategory.append(thClues);
    }
    thCategory.innerText = title;
    tableHead.append(thCategory);
    tableBody.append(trCategory);
  }
}

function handleClick(evt) {
  const target = evt.target;
  const position = [...target.dataset.id];
  const question = categories[position[0]].clues[position[2]].question;
  const answer = categories[position[0]].clues[position[2]].answer;
  let showing = categories[position[0]].clues[position[2]].showing;

  if (showing === null) {
    target.innerText = question;
    categories[position[0]].clues[position[2]].showing = "question";
  } else if (showing === "question") {
    target.innerText = answer;
    target.classList.add("clues-answer");
    categories[position[0]].clues[position[2]].showing = "answer";
  }

  evt.preventDefault;
}

function showLoadingView() {
  const loader = document.querySelector(".loader");
  loader.style.display = "flex";
}

function hideLoadingView() {
  const loader = document.querySelector(".loader");
  loader.style.display = "none";
}

function setupAndStart(e) {
  getCategory();
  e.preventDefault();
}

tblBody.addEventListener("click", handleClick);
buttonStart.addEventListener("click", setupAndStart);
