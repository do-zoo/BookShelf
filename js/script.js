function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

const bookData = {
  id: "f33b702e-b009-4681-9a21-987785cb41e0",
  title: "Buku Pertama",
  author: "Edward",
  year: 2022,
  imageUrl: "",
  isComplete: true,
};

const readWrapper = document.querySelector("#read .items-wrapper");

function makeTodo(data) {
  // create a new book item
  const itemContainer = document.createElement("div");
  itemContainer.setAttribute("class", "item");

  // wrapper image start
  const itemImage = document.createElement("img");
  if (data.imageUrl) {
    itemImage.setAttribute("src", data.imageUrl);
  } else {
    itemImage.setAttribute("src", "https://via.placeholder.com/150");
  }

  const itemImageContainer = document.createElement("div");
  itemImageContainer.setAttribute("class", "item-image");
  itemImageContainer.appendChild(itemImage);

  // wrapper image end

  // wrapper info start
  // create title element
  const itemTitle = document.createElement("h2");
  itemTitle.innerText = data.title;

  // create title wrapper element
  const itemTitleContainer = document.createElement("div");
  itemTitleContainer.setAttribute("class", "title");
  itemTitleContainer.appendChild(itemTitle);

  // create author and year element
  const itemAuthorYear = document.createElement("p");
  itemAuthorYear.setAttribute("class", "item-author-year");
  itemAuthorYear.innerText = `${data.author} | ${data.year}`;

  // create status element
  const itemStatus = document.createElement("p");
  itemStatus.classList.add("status");

  // create status button element
  const btnChangeStatus = document.createElement("button");
  btnChangeStatus.classList.add("btn-action btn-change-sts");

  if (data.isComplete) {
    itemStatus.classList.add("sts-read");
    itemStatus.innerText = "Read";
    btnChangeStatus.classList.add("read");
    btnChangeStatus.innerText = "Read";
  } else {
    itemStatus.classList.add("sts-unread");
    itemStatus.innerText = "Unread";
    btnChangeStatus.classList.add("unread");
    btnChangeStatus.innerText = "Unread";
  }

  // create author and year and status wrapper element
  const itemInfoContainer = document.createElement("div");
  itemInfoContainer.setAttribute("class", "info");
  itemInfoContainer.appendChild(itemAuthorYear, itemStatus);

  const itemInfoWrapper = document.createElement("div");
  itemInfoWrapper.setAttribute("class", "item-info");

  const btnEdit = document.createElement("button");
  btnEdit.setAttribute("class", "btn-action btn-edit").innerText = "Edit";

  const btnDelete = document.createElement("button");
  btnDelete.setAttribute("class", "btn-action btn-delete").innerText = "Delete";

  const otherActionWrapper = document.createElement("div");
  otherActionWrapper.setAttribute("class", "other-act");

  const btnOtherAction = document.createElement("div");
  btnOtherAction.setAttribute("class", "btn-action btn-other-act");

  const itemActionContainer = document.createElement("div");
  itemActionContainer.setAttribute("class", "action");

  //
  //
  //
  // pembeda
  const textTitle = document.createElement("h2");
  textTitle.innerText = data.task;

  const textTimestamp = document.createElement("p");
  textTimestamp.innerText = data.timestamp;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textTimestamp);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `todo-${data.id}`);
  if (data.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");

    undoButton.addEventListener("click", function () {
      undoTaskFromCompleted(data.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");

    trashButton.addEventListener("click", function () {
      removeTaskFromCompleted(data.id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");

    checkButton.addEventListener("click", function () {
      addTaskToCompleted(data.id);
    });

    container.append(checkButton);
  }

  return container;
}

// console.log(readWrapper);
