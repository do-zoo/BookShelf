const RENDER_EVENT = "render-book";
const STORAGE_KEY = "BOOKSHELF_APP";
const SAVED_EVENT = "saved-book";

const bookData = [];
let deleteId = "";

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function loadFromStorage() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (data) {
    return data;
  }
  return [];
}

function saveToStorage() {
  if (isStorageExist()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookData));
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

const formContainer = document.querySelector("#form");
const btnDeleteModal = document.getElementById("popup");
const closeFormBtn = document.querySelector(".form-wrapper > .close-btn");
closeFormBtn.addEventListener("click", () => {
  formContainer.classList.remove("show");
});

const closeModal = document.querySelector(".popup-wrapper > .close-btn");
closeModal.addEventListener("click", () => {
  btnDeleteModal.classList.remove("show");
});

const btnDeleteItem = document.getElementById("delete-item");

const addBookBtn = document.querySelector(".add-book-btn");
addBookBtn.addEventListener("click", () => {
  formContainer.classList.add("show");
});

btnDeleteItem.addEventListener("click", () => {
  deleteBook(deleteId);
  btnDeleteModal.classList.remove("show");
});

function makeBookItem(data) {
  const itemImage = document.createElement("img");
  if (data.cover) {
    itemImage.setAttribute("src", data.cover);
    itemImage.addEventListener("error", () => {
      itemImage.setAttribute("src", "./assets/bookPlaceholder.png");
      console.log("error", data.cover);
    });
  } else {
    itemImage.setAttribute("src", "./assets/bookPlaceholder.png");
  }

  const itemImageContainer = document.createElement("div");
  itemImageContainer.setAttribute("class", "item-image");
  itemImageContainer.append(itemImage);

  const itemTitle = document.createElement("h2");
  itemTitle.innerText = data.title;

  const itemTitleWrapper = document.createElement("div");
  itemTitleWrapper.setAttribute("class", "title");
  itemTitleWrapper.append(itemTitle);

  const itemAuthorYear = document.createElement("p");
  itemAuthorYear.setAttribute("class", "item-author-year");
  itemAuthorYear.innerText = `${data.author} | ${data.year}`;

  const itemStatus = document.createElement("p");
  itemStatus.classList.add("status");

  const btnChangeStatus = document.createElement("button");
  btnChangeStatus.classList.add("btn-action", "btn-change-sts");

  if (data.isComplete) {
    itemStatus.classList.add("sts-read");
    itemStatus.innerText = "Read";
    btnChangeStatus.classList.add("read");
    btnChangeStatus.innerText = "Read";
    btnChangeStatus.addEventListener("click", () => {
      addBookToIncompleteList(data.id);
    });
  } else {
    itemStatus.classList.add("sts-unread");
    itemStatus.innerText = "Unread";
    btnChangeStatus.classList.add("unread");
    btnChangeStatus.innerText = "Unread";
    btnChangeStatus.addEventListener("click", () => {
      addBookToCompleteList(data.id);
    });
  }

  const itemInfoWrapper = document.createElement("div");
  itemInfoWrapper.setAttribute("class", "info");
  itemInfoWrapper.append(itemAuthorYear, itemStatus);

  const otherActionWrapper = document.createElement("div");
  otherActionWrapper.setAttribute("class", "other-act");
  const btnEdit = document.createElement("button");
  btnEdit.setAttribute("class", "btn-action btn-edit");
  btnEdit.innerText = "Edit";
  btnEdit.addEventListener("click", () => {
    editBook(data.id);
    otherActionWrapper.classList.toggle("active");
  });

  const btnDelete = document.createElement("button");
  btnDelete.setAttribute("class", "btn-action btn-delete");
  btnDelete.innerText = "Delete";
  btnDelete.addEventListener("click", () => {
    deleteId = data.id;
    btnDeleteModal.classList.add("show");
  });

  otherActionWrapper.append(btnEdit, btnDelete);

  const btnOtherAction = document.createElement("div");
  btnOtherAction.setAttribute("class", "btn-action btn-other-act");
  btnOtherAction.innerText = "Action";
  btnOtherAction.addEventListener("click", () => {
    otherActionWrapper.classList.toggle("active");
  });

  const itemActionWrapper = document.createElement("div");
  itemActionWrapper.setAttribute("class", "action");
  itemActionWrapper.append(btnChangeStatus, btnOtherAction, otherActionWrapper);

  const itemInfoContainer = document.createElement("div");
  itemInfoContainer.setAttribute("class", "item-info");
  itemInfoContainer.append(
    itemTitleWrapper,
    itemInfoWrapper,
    itemActionWrapper
  );

  const itemContainer = document.createElement("div");
  itemContainer.setAttribute("class", "item");
  itemContainer.append(itemImageContainer, itemInfoContainer);

  return itemContainer;
}

function findBook(bookId) {
  for (const book of bookData) {
    if (book.id === bookId) {
      return book;
    }
  }
  return null;
}

function addBookToCompleteList(bookId) {
  const book = findBook(bookId);
  if (book) {
    book.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveToStorage();
  }
}

function addBookToIncompleteList(bookId) {
  const book = findBook(bookId);
  if (book) {
    book.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveToStorage();
  }
}

function deleteBook(bookId) {
  const book = findBook(bookId);
  if (book) {
    const index = bookData.indexOf(book);
    bookData.splice(index, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveToStorage();
  }
}

function searchBook(searchText) {
  const bookFormStorage = loadFromStorage();
  const searchResult = bookFormStorage.filter((book) => {
    return book.title.toLowerCase().includes(searchText.toLowerCase());
  });
  return searchResult;
}

function editBook(bookId) {
  const book = findBook(bookId);
  if (book) {
    formContainer.classList.add("show");
    document.querySelector("#id").value = book.id;
    document.querySelector("#title").value = book.title;
    document.querySelector("#author").value = book.author;
    document.querySelector("#year").value = book.year;
    document.querySelector("#cover").value = book.cover;
    document.querySelector("#status").value = book.isComplete
      ? "read"
      : "unread";
  }
  formContainer.classList.add("show");
}

document.addEventListener(RENDER_EVENT, () => {
  const readWrapper = document.querySelector("#read .items-wrapper");
  readWrapper.innerHTML = "";
  const unreadWrapper = document.querySelector("#unread .items-wrapper");
  unreadWrapper.innerHTML = "";
  if (bookData) {
    bookData.map((item) => {
      if (item.isComplete) {
        readWrapper.appendChild(makeBookItem(item));
      } else {
        unreadWrapper.appendChild(makeBookItem(item));
      }
    });
  }

  if (readWrapper.children.length === 0) {
    readWrapper.innerHTML = `<p class="no-item">No book in complete list</p>`;
  }

  if (unreadWrapper.children.length === 0) {
    unreadWrapper.innerHTML = `<p class="no-item">No book in incomplete list</p>`;
  }
});

function renderBookList(data) {
  bookData.splice(0, bookData.length);
  for (const book of data) {
    bookData.push(book);
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener("DOMContentLoaded", () => {
  const dataStorage = loadFromStorage();
  const form = document.getElementById("add-book");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.querySelector("#id").value;
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const year = document.querySelector("#year").value;
    const cover = document.querySelector("#cover").value;
    const status = document.querySelector("#status").value;
    let isComplete = false;
    if (status === "read") {
      isComplete = true;
    }

    if (id) {
      const book = findBook(id);
      if (book) {
        book.title = title;
        book.author = author;
        book.year = year;
        book.cover = cover;
        book.isComplete = isComplete;
      }
    } else {
      const data = {
        id: uuidv4(),
        title,
        author,
        year,
        cover,
        isComplete,
      };
      bookData.push(data);
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveToStorage();
    form.reset();
    formContainer.classList.remove("show");
  });

  const searchInput = document.querySelector(".search-input");
  searchInput.addEventListener("keyup", (e) => {
    const searchText = e.target.value;
    const searchResult = searchBook(searchText);

    if (searchText !== "") {
      renderBookList(searchResult);
    } else {
      renderBookList(dataStorage);
    }
  });
  if (isStorageExist()) {
    renderBookList(dataStorage);
  }
});
