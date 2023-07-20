const form = document.getElementById("form");
const expenseAmount = document.getElementById("expenseAmount");
const description = document.getElementById("description");
const category = document.getElementById("category");
const submit = document.getElementById("submit");
const listItem = document.getElementById("listItem");

form.addEventListener("submit", storeData);

function storeData(event) {
  event.preventDefault();
  const detail = {
    expense: expenseAmount.value,
    des: description.value,
    cat: category.value,
  };
  const key = detail.cat.trim();
  const value = JSON.stringify(detail);
  localStorage.setItem(key, value);
  const deserialized_data = JSON.parse(localStorage.getItem(key));

  const newList = document.createElement("li");
  newList.className =
    "list-group-item mb-3 d-flex justify-content-between align-items-center";

  const newDiv = document.createElement("div");
  const delBtn = document.createElement("button");
  delBtn.className = "btn btn-danger btn-sm";
  delBtn.appendChild(document.createTextNode("Delete"));
  const editBtn = document.createElement("button");
  editBtn.appendChild(document.createTextNode("Edit"));
  editBtn.className = "btn btn-primary btn-sm"; // Added ml-2 for margin
  const text = `${deserialized_data.expense} ${deserialized_data.cat} ${deserialized_data.des}`;

  delBtn.addEventListener("click", delList);
  editBtn.addEventListener("click", editList);

  newList.appendChild(document.createTextNode(text));
  newDiv.appendChild(editBtn);
  newDiv.appendChild(delBtn);
  newList.appendChild(newDiv);
  listItem.appendChild(newList);
}

function editList(event) {
  event.preventDefault();
  const cat = event.target.parentNode.parentNode.textContent
    .split(" ")[1]
    .trim();
  const editItem = JSON.parse(localStorage.getItem(cat));
  expenseAmount.value = editItem.expense;
  description.value = editItem.des;
  category.value = editItem.cat;

  const itemToEdit = document.getElementsByTagName("li");
  Array.from(itemToEdit).forEach((element) => {
    if (element.textContent.includes(cat)) {
      listItem.removeChild(element);
      localStorage.removeItem(category.value);
    }
  });
}

function delList(event) {
  event.preventDefault();
  const itemToDel = event.target.parentNode.parentNode;
  const des = itemToDel.textContent.split(" ")[1].trim();
  const removeItem = document.getElementsByTagName("li");
  Array.from(removeItem).forEach((element) => {
    if (element.textContent.includes(des)) {
      listItem.removeChild(element);
      localStorage.removeItem(des);
    }
  });
}
