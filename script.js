const storageKey = "STORAGE_KEY";
const belumSelesaiKey = "BELUM_SELESAI_KEY";
const selesaiKey = "SELESAI_KEY";

const submitAction = document.getElementById("form-data-user");

function checkForStorage() {
  return typeof Storage !== "undefined";
}

function putUserList(data) {
  if (checkForStorage()) {
    let belumSelesaiData = [];
    let selesaiData = [];

    if (localStorage.getItem(belumSelesaiKey) !== null) {
      belumSelesaiData = JSON.parse(localStorage.getItem(belumSelesaiKey));
    }

    if (localStorage.getItem(selesaiKey) !== null) {
      selesaiData = JSON.parse(localStorage.getItem(selesaiKey));
    }

    if (data.isComplete) {
      selesaiData.unshift(data);
    } else {
      belumSelesaiData.unshift(data);
    }

    localStorage.setItem(belumSelesaiKey, JSON.stringify(belumSelesaiData));
    localStorage.setItem(selesaiKey, JSON.stringify(selesaiData));
  }
}

function getUserList() {
  if (checkForStorage()) {
    const belumSelesaiData = JSON.parse(localStorage.getItem(belumSelesaiKey)) || [];
    const selesaiData = JSON.parse(localStorage.getItem(selesaiKey)) || [];

    return { belumSelesaiData, selesaiData };
  } else {
    return { belumSelesaiData: [], selesaiData: [] };
  }
}

function renderUserList() {
  const { belumSelesaiData, selesaiData } = getUserList();
  const belumDibacaList = document.querySelector("#belum-dibaca-list");
  const selesaiDibacaList = document.querySelector("#selesai-dibaca-list");
  belumDibacaList.innerHTML = "";
  selesaiDibacaList.innerHTML = "";

  for (let userData of belumSelesaiData) {
    const card = createBookCard(userData);
    belumDibacaList.appendChild(card);
  }

  for (let userData of selesaiData) {
    const card = createBookCard(userData);
    selesaiDibacaList.appendChild(card);
  }
}

function createBookCard(user) {
  const card = document.createElement("div");
  card.classList.add("card");

  const judul = document.createElement("h3");
  judul.textContent = user.judul;

  const penulis = document.createElement("p");
  penulis.textContent = "Penulis: " + user.penulis;

  const tahun = document.createElement("p");
  tahun.classList.add("year");
  tahun.textContent = "Tahun: " + user.tahun;

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

submitAction.addEventListener("submit", function (event) {
  event.preventDefault();

  const inputJudul = document.getElementById("judul").value;
  const inputPenulis = document.getElementById("penulis").value;
  const inputTahun = document.getElementById("tahun").value;
  const isComplete = document.getElementById("isComplete").checked;

  const newUserData = {
    judul: inputJudul,
    penulis: inputPenulis,
    tahun: inputTahun,
    isComplete: isComplete,
  };

  putUserList(newUserData);
  renderUserList();
});

function moveBook(user) {
  if (checkForStorage()) {
    const { belumSelesaiData, selesaiData } = getUserList();

    const belumSelesaiIndex = belumSelesaiData.findIndex((book) => book.id === user.id);
    const selesaiIndex = selesaiData.findIndex((book) => book.id === user.id);

    if (user.isComplete) {
      if (selesaiIndex !== -1) {
        selesaiData.splice(selesaiIndex, 1);
        user.isComplete = false;
        belumSelesaiData.unshift(user);
      }
    } else {
      if (belumSelesaiIndex !== -1) {
        belumSelesaiData.splice(belumSelesaiIndex, 1);
        user.isComplete = true;
        selesaiData.unshift(user);
      }
    }

    localStorage.setItem(belumSelesaiKey, JSON.stringify(belumSelesaiData));
    localStorage.setItem(selesaiKey, JSON.stringify(selesaiData));

    renderUserList();
  }
}

function deleteBook(user) {
  if (checkForStorage()) {
    const { belumSelesaiData, selesaiData } = getUserList();

    const belumSelesaiIndex = belumSelesaiData.findIndex((book) => book.id === user.id);
    const selesaiIndex = selesaiData.findIndex((book) => book.id === user.id);

    if (belumSelesaiIndex !== -1) {
      belumSelesaiData.splice(belumSelesaiIndex, 1);
    }

    if (selesaiIndex !== -1) {
      selesaiData.splice(selesaiIndex, 1);
    }

    localStorage.setItem(belumSelesaiKey, JSON.stringify(belumSelesaiData));
    localStorage.setItem(selesaiKey, JSON.stringify(selesaiData));

    renderUserList();
  }
}

window.addEventListener("load", function () {
  if (checkForStorage) {
    if (localStorage.getItem(storageKey) !== null) {
      renderUserList();
    }
  } else {
    alert("Browser yang Anda gunakan tidak mendukung Web Storage");
  }
});
