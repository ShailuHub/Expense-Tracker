// Targeting all elements
const form = document.getElementById("form");
const expenseAmount = document.getElementById("expenseAmount");
const description = document.getElementById("description");
const category = document.getElementById("category");
const detailItems = document.getElementById("tableBody");
const submitButton = document.getElementById("submit");
const premiumBtn = document.getElementById("premiumBtn");
const download = document.querySelector("#download button");
const premiumText = document.getElementById("premium-text");

const pageBtn = document.getElementById("pagination-custom");
const pageNo = document.querySelectorAll(".page");

// Initialize variables
form.dataset.mode = "";
let isFirstTime = true;
let currPage = 1;
let rowsToDisplay = 5;

// Adding event listeners for pagination buttons
pageNo.forEach((page) => {
  page.addEventListener("click", (event) => {
    rowsToDisplay = event.target.textContent;
    displayData(currPage);
  });
});

// Applying event listeners
form.addEventListener("submit", postExpense);
detailItems.addEventListener("click", handleButton);
premiumBtn.addEventListener("click", buyPremium);
download.addEventListener("click", downloadFile);

// Download file function
async function downloadFile() {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get("http://localhost:3000/download", {
      headers: { Authorization: token },
    });
    if (response.data.success === "success") {
      const a = document.createElement("a");
      (a.href = response.data.fileUrl), (a.download = "myexpense.csv");
      a.click();
    }
  } catch (error) {
    console.log(error);
  }
}

// Pagination function
async function pagination(event) {
  const page = event.target.textContent;
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `http://localhost:3000/user-expense/${page}/${rowsToDisplay}`,
      {
        headers: { Authorization: token },
      }
    );
    const { expenses, totalPages, isPremium } = response.data;

    if (isPremium && isFirstTime) {
      premium();
    }
    detailItems.innerHTML = "";
    expenses.forEach((item) => {
      display(item);
    });
    currPage = page; // Update current page
  } catch (error) {
    console.log(error);
  }
}

// Display expense data based on page
async function displayData(page) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `http://localhost:3000/user-expense/${page}/${rowsToDisplay}`,
      {
        headers: { Authorization: token },
      }
    );

    const { expenses, totalPages, isPremium } = response.data;

    if (isPremium && isFirstTime) {
      premium();
    }
    detailItems.innerHTML = "";
    expenses.forEach((item) => {
      display(item);
    });
    pageBtn.innerHTML = "";
    for (let i = 1; i <= totalPages; ++i) {
      const li = document.createElement("li");
      li.classList.add("page-item");
      const a = document.createElement("a");
      a.classList.add("page-link");
      a.setAttribute("href", "#");
      a.addEventListener("click", pagination);
      a.textContent = i;
      li.appendChild(a);
      pageBtn.appendChild(li);
    }
  } catch (error) {
    console.log("Error fetching data:", error);
  }
}

// Displaying all the expense data for the first time
displayData(currPage);

// Posting new or updated expense detail
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
      await editExpense(form.dataset.itemId, details);
    } else if (form.dataset.mode === "post" || form.dataset.mode === "") {
      await axios.post("http://localhost:3000/user-expense", details, {
        headers: {
          Authorization: token,
        },
      });
      detailItems.innerHTML = "";
      await displayData(currPage);
      form.reset();
    }
  } catch (error) {
    console.log("Error storing data:", error);
  }
}

// Editing and posting current expense detail
async function editExpense(itemId, details) {
  const token = localStorage.getItem("token");
  try {
    await axios.patch(
      `http://localhost:3000/user-expense/edit/${itemId}`,
      details,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    form.dataset.mode = "post";
    submitButton.textContent = "Add Expense";
    detailItems.innerHTML = "";
    await displayData(currPage);
    form.reset();
  } catch (error) {
    console.log("Error editing item:", error);
  }
}

// Deleting expense detail
async function deleteItem(itemId) {
  const token = localStorage.getItem("token");
  try {
    await axios.delete(`http://localhost:3000/user-expense/delete/${itemId}`, {
      headers: {
        Authorization: token,
      },
    });
    detailItems.innerHTML = "";
    await displayData(currPage);
  } catch (error) {
    console.log("Error deleting item:", error);
  }
}

// Handling button clicks for edit or delete
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

// Setting data in edit mode
async function editButtonClicked(itemId) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `http://localhost:3000/user-expense/edit/${itemId}`,
      {
        headers: {
          Authorization: token,
        },
      }
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

// Get item ID from parent row
function getItemId(parentRow) {
  return parentRow.dataset.id;
}

// Buy premium
async function buyPremium(event) {
  event.preventDefault();
  const token = localStorage.getItem("token");
  try {
    const getResponse = await axios.get(
      "http://localhost:3000/purchase/membership",
      { headers: { Authorization: token } }
    );
    const options = {
      key: getResponse.data.key_id,
      order_id: getResponse.data.order.orderId,
      handler: async function (responseFromRazorPay) {
        const postResponse = await axios.post(
          "http://localhost:3000/purchase/updateTransactionstatus",
          {
            order_id: responseFromRazorPay.razorpay_order_id,
            payment_id: responseFromRazorPay.razorpay_payment_id,
          },
          { headers: { Authorization: token } }
        );
        if (postResponse.data.success === "success") {
          premium();
        }
        alert("You are a Premium User Now");
      },
    };
    const payToRazorPay = new Razorpay(options);
    payToRazorPay.open();
    payToRazorPay.on("payment.failed", (response) => {
      console.log(response);
      alert("Something went wrong");
    });
  } catch (error) {
    console.log(error);
  }
}

// Display premium status
function premium() {
  premiumBtn.style.display = "none";
  premiumText.style.display = "block";
  download.disabled = false;
  isFirstTime = false;
}

// Display expense data in a row
function display(data) {
  const listItem = document.createElement("tr");
  listItem.dataset.id = data.id;
  listItem.innerHTML = `
    <td class="col-2 text-center">${data.createdAt.toString().slice(0, 10)}</td>
    <td class="col-4 text-center">${data.category}</td>
    <td class="col-4 text-center">${data.description}</td>
    <td class="col-4 text-center">${data.amount}</td>
    <td class="col-1 text-center">
      <button class="btn btn-info">Edit</button>
    </td>
    <td class="col-1 text-center">
      <button class="btn btn-danger">Delete</button>
    </td>
  `;
  detailItems.appendChild(listItem);
}
