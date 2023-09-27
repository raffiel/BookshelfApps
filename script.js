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
  deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
  deleteButton.classList.add("delete-button");
  deleteButton.id = "deleteButton_" + user.id;

  deleteButton.addEventListener("click", function () {
    deleteBook(user);
  });

  const editButton = document.createElement("button");
  editButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
  editButton.classList.add("edit-button");
  editButton.id = "editButton_" + user.id;

  editButton.addEventListener("click", function () {
    editBook(user);
  });

  card.appendChild(judul);
  card.appendChild(penulis);
  card.appendChild(tahun);
  card.appendChild(moveButton);
  card.appendChild(editButton);
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

function editBook(user) {
  const formHTML = `
    <form id="edit-form-data-user">
      <div class="form-element">
        <label for="judul">Judul</label><br />
        <input id="edit-judul" type="text" name="judul" placeholder="Judul" value="${user.title}" maxlength="50" required /><br />
      </div>
      <div class="form-element">
        <label for="penulis">Penulis</label><br />
        <input id="edit-penulis" type="text" name="penulis" placeholder="Penulis" value="${user.author}" maxlength="50" required /><br />
      </div>
      <div class="form-element">
        <label for="tahun">Tahun:</label><br />
        <input type="number" id="edit-tahun" name="tahun" class="year-input" placeholder="Tahun" value="${user.year}" min="0" max="2023" required />
      </div>
      <div class="form-element">
        <label for="isComplete">Sudah dibaca</label>
        <input type="checkbox" id="edit-isComplete" name="isComplete" ${user.isComplete ? "checked" : ""} class="complete-checkbox" />
      </div>
    </form>
  `;

  Swal.fire({
    title: "Edit Buku",
    html: formHTML,
    confirmButtonText: "Simpan",
    showCancelButton: true,
    cancelButtonText: "Batal",
    showCloseButton: "true",
    preConfirm: () => {
      const editedJudul = document.getElementById("edit-judul").value;
      const editedPenulis = document.getElementById("edit-penulis").value;
      const editedTahun = document.getElementById("edit-tahun").value;
      const editedIsComplete = document.getElementById("edit-isComplete").checked;

      // Simpan perubahan ke data buku
      user.title = editedJudul;
      user.author = editedPenulis;
      user.year = parseInt(editedTahun);
      user.isComplete = editedIsComplete;

      // Update data di local storage
      putUserList();
      renderUserList();
    },
  }).then((result) => {
    if (result.isConfirmed) {
      // Menangani pengiriman form edit di sini
      const editedJudul = document.getElementById("edit-judul").value;
      const editedPenulis = document.getElementById("edit-penulis").value;
      const editedTahun = document.getElementById("edit-tahun").value;
      const editedIsComplete = document.getElementById("edit-isComplete").checked;

      // Simpan perubahan ke data buku
      user.title = editedJudul;
      user.author = editedPenulis;
      user.year = parseInt(editedTahun);
      user.isComplete = editedIsComplete;

      // Update data di local storage
      putUserList();
      renderUserList();

      // Menampilkan response popup
      Swal.fire({
        position: "center",
        icon: "success",
        text: `Buku ${editedJudul} berhasil diubah`,
        showConfirmButton: false,
        timer: 2000,
      });
    }
  });
}

function deleteBook(user) {
  const bookName = user.title;

  Swal.fire({
    text: `Apakah kamu ingin menghapus buku "${bookName}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Ya",
    cancelButtonText: "Tidak",
  }).then((result) => {
    if (result.isConfirmed) {
      const bookIndex = todos.findIndex((book) => book.id === user.id);

      if (bookIndex !== -1) {
        todos.splice(bookIndex, 1);
        putUserList();
        renderUserList();
      }

      Swal.fire("Deleted!", `Buku "${bookName}" telah dihapus.`, "success");
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  if (checkForStorage()) {
    loadDataFromStorage();
    renderUserList();
  } else {
    alert("Browser yang Anda gunakan tidak mendukung Web Storage");
  }

  const searchForm = document.getElementById("search-form");
  const searchResults = document.getElementById("search-results");
  const searchResultList = document.getElementById("search-result-list");

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Mencegah formulir untuk memuat ulang halaman

    const searchJudulInput = document.getElementById("search-judul").value.toLowerCase();
    const filteredData = todos.filter((book) => {
      const lowercaseTitle = book.title.toLowerCase();
      return lowercaseTitle.includes(searchJudulInput);
    });

    if (searchJudulInput.trim() !== "") {
      // Memastikan formulir tidak kosong
      displaySearchResults(filteredData);
    } else {
      // Menampilkan pesan jika formulir kosong
      searchResultList.innerHTML = "<p>Silakan masukkan kata kunci pencarian.</p>";
      searchResults.style.display = "block";
    }
  });
});

function displaySearchResults(results) {
  const searchResults = document.getElementById("search-results");
  const searchResultList = document.getElementById("search-result-list"); // Deklarasi ulang variabel
  searchResultList.innerHTML = ""; // Bersihkan daftar hasil pencarian

  if (results.length === 0) {
    // Jika tidak ada hasil pencarian
    searchResultList.innerHTML = "<p>Buku tidak ditemukan</p>";
  } else {
    // Jika ada hasil pencarian, tampilkan masing-masing buku dalam hasil
    results.forEach((book) => {
      const card = createBookCard(book);
      searchResultList.appendChild(card);
    });
  }

  // Tampilkan hasil pencarian
  searchResults.style.display = "block";
}

const form = document.getElementById("form-data-user");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const inputJudul = document.getElementById("judul").value;
  const newUserData = {
    judul: inputJudul,
  };

  Swal.fire({
    icon: "success",
    title: "Berhasil!",
    text: `Buku "${inputJudul}" berhasil ditambahkan`,
  });

  form.reset();
});
