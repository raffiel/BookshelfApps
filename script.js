const STORAGE_KEY = "bookshelf_data";
let todos = [];

function checkForStorage() {
  return typeof Storage !== "undefined";
}

function putUserList() {
  if (checkForStorage()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);

  if (serializedData !== null) {
    todos = JSON.parse(serializedData);
  }
}

function renderUserList() {
  const belumDibacaList = document.querySelector("#belum-dibaca-list");
  const selesaiDibacaList = document.querySelector("#selesai-dibaca-list");
  belumDibacaList.innerHTML = "";
  selesaiDibacaList.innerHTML = "";

  for (let userData of todos) {
    const card = createBookCard(userData);
    if (userData.isComplete) {
      selesaiDibacaList.appendChild(card);
    } else {
      belumDibacaList.appendChild(card);
    }
  }
}

function createBookCard(user) {
  const card = document.createElement("div");
  card.classList.add("card");

  const judul = document.createElement("h3");
  judul.textContent = user.title;

  const penulis = document.createElement("p");
  penulis.textContent = "Penulis: " + user.author;

  const tahun = document.createElement("p");
  tahun.classList.add("year");
  tahun.textContent = "Tahun: " + user.year;

  const moveButton = document.createElement("button");
  moveButton.textContent = user.isComplete ? "Belum Selesai Dibaca" : "Selesai Dibaca";
  moveButton.id = "moveButton_" + user.id;

  moveButton.addEventListener("click", function () {
    moveBook(user);
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Hapus";
  deleteButton.classList.add("delete-button");
  deleteButton.id = "deleteButton_" + user.id;

  deleteButton.addEventListener("click", function () {
    deleteBook(user);
  });

  card.appendChild(judul);
  card.appendChild(penulis);
  card.appendChild(tahun);
  card.appendChild(moveButton);
  card.appendChild(deleteButton);

  return card;
}
const submitAction = document.getElementById("form-data-user");
submitAction.addEventListener("submit", function (event) {
  event.preventDefault();

  const inputJudul = document.getElementById("judul").value;
  const inputPenulis = document.getElementById("penulis").value;
  const inputTahun = document.getElementById("tahun").value;
  const isComplete = document.getElementById("isComplete").checked;

  const newUserData = {
    id: Date.now(),
    title: inputJudul,
    author: inputPenulis,
    year: parseInt(inputTahun),
    isComplete: isComplete,
  };

  todos.push(newUserData);
  putUserList();
  renderUserList();
});

function moveBook(user) {
  const bookIndex = todos.findIndex((book) => book.id === user.id);

  if (bookIndex !== -1) {
    todos[bookIndex].isComplete = !user.isComplete;
    putUserList();
    renderUserList();
  }
}

function deleteBook(user) {
  const bookName = user.title;
  const bookIndex = todos.findIndex((book) => book.id === user.id);

  console.log("user.id:", user.id);
  console.log("todos:", todos);

  const confirmPopup = document.getElementById("confirm-popup");
  const bookNameSpan = document.getElementById("book-name");

  bookNameSpan.textContent = bookName;
  confirmPopup.style.display = "block";

  const closePopupButton = document.querySelector(".close-popup");
  closePopupButton.addEventListener("click", function () {
    confirmPopup.style.display = "none";
  });

  const confirmYesButton = document.getElementById("confirm-yes");
  confirmYesButton.addEventListener("click", function () {
    if (bookIndex !== -1) {
      todos.splice(bookIndex, 1);
      putUserList();
      renderUserList();
    }

    confirmPopup.style.display = "none";
  });

  const confirmNoButton = document.getElementById("confirm-no");
  confirmNoButton.addEventListener("click", function () {
    confirmPopup.style.display = "none";
  });
}

const searchForm = document.getElementById("search-form");
const searchResults = document.getElementById("search-results");
const searchResultList = document.getElementById("search-result-list");

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const searchJudulInput = document.getElementById("search-judul").value.toLowerCase();
  const userData = getUserList();
  const searchResultsData = userData.filter((book) => {
    const lowercaseJudul = book.judul.toLowerCase();
    return lowercaseJudul.includes(searchJudulInput);
  });

  if (searchJudulInput.trim() !== "") {
    displaySearchResults(searchResultsData);
  } else {
    searchResultList.innerHTML = "<p>Silakan masukkan kata kunci pencarian.</p>";
    searchResults.style.display = "block";
  }
});

function displaySearchResults(results) {
  searchResultList.innerHTML = "";
  if (results.length === 0) {
    searchResultList.innerHTML = "<p>Buku tidak ditemukan</p>";
  } else {
    results.forEach((book) => {
      const card = createBookCard(book);
      searchResultList.appendChild(card);
    });
  }

  searchResults.style.display = "block";
}

document.addEventListener("DOMContentLoaded", function () {
  if (checkForStorage()) {
    loadDataFromStorage();
    renderUserList();
  } else {
    alert("Browser yang Anda gunakan tidak mendukung Web Storage");
  }
});

const form = document.getElementById("form-data-user");
const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const inputJudul = document.getElementById("judul").value;
  const newUserData = {
    judul: inputJudul,
  };

  popupText.textContent = `Buku "${inputJudul}" berhasil ditambahkan`;

  popup.style.display = "block";

  setTimeout(function () {
    popup.style.display = "none";
  }, 4000);
});
