//Targeting all element
const form = document.getElementById("form");
const expenseAmount = document.getElementById("expenseAmount");
const description = document.getElementById("description");
const category = document.getElementById("category");
const detailItems = document.getElementById("tableBody");
const submitButton = document.getElementById("submit");
form.dataset.mode = "";

//Applying event listener
form.addEventListener("submit", postExpense);
detailItems.addEventListener("click", handleButton);

//Checking for previous expense details and displaying
async function displayData() {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get("http://localhost:3000/user-expense", {
      headers: { Authorization: token },
    });
    const data = response.data;
    detailItems.innerHTML = "";
    data.forEach((item) => {
      display(item);
    });
  } catch (error) {
    console.log("Error fetching data:", error);
  }
}

//Displaying all the expense data for the 1st time
displayData();

//Posting new or updated expense detail
async function postExpense(event) {
  const token = localStorage.getItem("token");
  event.preventDefault();
  const details = {
    amount: expenseAmount.value,
    description: description.value,
    category: category.value,
  };
  try {
    if (form.dataset.mode === "edit") {
      editExpense(form.dataset.itemId, details);
    } else if (form.dataset.mode === "post" || form.dataset.mode === "") {
      await axios.post("http://localhost:3000/user-expense", details, {
        headers: {
          Authorization: token,
        },
      });
      detailItems.innerHTML = "";
      await displayData();
      form.reset();
    }
  } catch (error) {
    console.log("Error storing data:", error);
  }
}

//Editing and posting current expense detail
async function editExpense(itemId, details) {
  try {
    await axios.patch(
      `http://localhost:3000/user-expense/edit/${itemId}`,
      details
    );
    form.dataset.mode = "post";
    submitButton.textContent = "Add Expense";
    detailItems.innerHTML = "";
    await displayData();
    form.reset();
  } catch (error) {
    console.log("Error editing item:", error);
  }
}

//Deleting expense detail
async function deleteItem(itemId) {
  try {
    await axios.delete(`http://localhost:3000/user-expense/delete/${itemId}`);
    detailItems.innerHTML = "";
    await displayData();
  } catch (error) {
    console.log("Error deleting item:", error);
  }
}

//Handling on button click either delete or edit
function handleButton(event) {
  event.preventDefault();
  const target = event.target;
  const parentRow = target.parentNode.parentNode;

  if (!parentRow) return;

  const itemId = getItemId(parentRow);

  if (target.classList.contains("btn-danger")) {
    deleteItem(itemId);
  } else if (target.classList.contains("btn-info")) {
    editButtonClicked(itemId);
  }
}

//Setting the data in edit mode
async function editButtonClicked(itemId) {
  try {
    const response = await axios.get(
      `http://localhost:3000/user-expense/edit/${itemId}`
    );
    const details = response.data;
    expenseAmount.value = details.amount;
    description.value = details.description;
    category.value = details.category;
    form.dataset.mode = "edit";
    submitButton.textContent = "Update Expense";
    form.dataset.itemId = itemId;
  } catch (error) {
    console.log(error);
  }
}

function getItemId(parentRow) {
  return parentRow.dataset.id;
}

function display(data) {
  const listItem = document.createElement("tr");
  listItem.dataset.id = data.id;
  listItem.innerHTML = `
    <td class="col-3 text-center">${data.amount}</</td>
    <td class="col-3 text-center text-break">${data.category}</td>
    <td class="col-3 text-center text-break">${data.description}</td>
    <td class="col-3 text-center">
      <button class="btn btn-info">Edit</button>
      <button class="btn btn-danger">Delete</button>
    </td>
  `;
  detailItems.appendChild(listItem);
}
