// DOM elements
const detailItems1 = document.getElementById("tableBody1");
const detailItems2 = document.getElementById("tableBody2");
const form1 = document.getElementById("form1");
const form2 = document.getElementById("form2");
const noRecord1 = document.getElementById("noRecord1");
const noRecord2 = document.getElementById("noRecord2");
const mainContainer1 = document.getElementById("main-table1");
const mainContainer2 = document.getElementById("main-table2");
const previousContainer = document.getElementById("previous-container");

// Attach event listeners to forms
form1.addEventListener("submit", (event) => postDate(event, "date"));
form2.addEventListener("submit", (event) => postDate(event, "month"));

// Initialize search parameters
let searchDate = "";
let searchType = "";

// Function to handle form submission
async function postDate(event, type) {
  event.preventDefault();

  // Determine the search type
  searchType = type;

  // Create the detail object based on form submission
  const detail = {
    date: searchType === "date" ? dayDate.value : undefined,
    month: searchType === "month" ? monthDate.value : undefined,
    searchType: searchType,
  };

  try {
    // Make a POST request to get search date
    const response = await axios.post(
      "http://localhost:3000/premium/features/report",
      detail
    );

    // Set the searchDate based on the response
    searchDate = response.data.date || response.data.month;

    // Fetch and display expenses
    await getExpense();
  } catch (error) {
    console.log(error);
  }
}

// Function to fetch and display expenses
async function getExpense() {
  const token = localStorage.getItem("token");

  try {
    // Make a GET request to fetch expenses
    const response = await axios.get(
      `http://localhost:3000/premium/features/report/${searchType}/${searchDate}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.data.success === "success") {
      // Clear previous data and display expenses
      displayRecord();
      clearAndDisplay(response.data.expenseArray, response.data.totalSum);
    } else if (response.data.success === "failed") {
      // Display "No Record" message
      displayNoRecord();
    }
  } catch (error) {
    console.log(error);
  }
}

// Function to clear previous data and display expenses
function clearAndDisplay(expenseArray) {
  // Clear previous data
  detailItems1.innerHTML = "";
  detailItems2.innerHTML = "";

  // Display each expense and calculate total
  let total = 0;
  expenseArray.forEach((expense) => {
    display(expense);
    total += Number(expense.amount);
  });

  // Create and display the total row
  const listItem = document.createElement("tr");
  listItem.style.borderTop = "none";
  listItem.style.borderBottom = "none";
  listItem.innerHTML = `<td class="col-4 text-center">Total: ${total}</td>`;
  whereToInsert(listItem);
}

// Function to display an expense
function display(data) {
  const listItem = document.createElement("tr");
  listItem.innerHTML = `
    <td class="col-4 text-center">${data.createdAt.toString().slice(0, 10)}</td>
    <td class="col-4 text-center">${data.description}</td>
    <td class="col-4 text-center">${data.category}</td>
    <td class="col-2 text-center">${data.amount}</td>
  `;
  whereToInsert(listItem);
}

// Function to display "Record" message
function displayNoRecord() {
  if (searchType === "date") {
    mainContainer1.style.display = "none";
    noRecord1.style.display = "block";
  } else if (searchType === "month") {
    mainContainer2.style.display = "none";
    noRecord2.style.display = "block";
  }
}

// Function to display "No Record" message
function displayRecord() {
  if (searchType === "date") {
    mainContainer1.style.display = "block";
    noRecord1.style.display = "none";
  } else if (searchType === "month") {
    mainContainer2.style.display = "block";
    noRecord2.style.display = "none";
  }
}

// Function to insert a list item in the appropriate location
function whereToInsert(listItem) {
  if (searchType === "date") {
    detailItems1.appendChild(listItem);
  } else if (searchType === "month") {
    detailItems2.appendChild(listItem);
  }
}

//function to get previous Download files
async function previousDownload() {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`http://localhost:3000/download/url`, {
      headers: {
        Authorization: token,
      },
    });
    if (response.data.success === "success") {
      response.data.downloadURL.forEach((item, idx) => {
        displayDownloadURL(item, `Expense-file-${idx + 1}`);
      });
    }
  } catch (error) {
    console.log(error);
  }
}

function displayDownloadURL(data, fileName) {
  const listItem = document.createElement("div");
  listItem.classList.add("row", "p-1");
  listItem.innerHTML = `
      <div class="col-12 col-md-3 mb-3 text-center text-light">${data.createdAt
        .toString()
        .slice(0, 10)}</div>
      <div class="col-12 col-md-6  mb-3  text-center text-light">${fileName}</div>
      <div class="col-12 col-md-3 mb-3  text-center text-light">
          <a class="btn btn-dark" href="${data.file}">Download</a>
      </div>
      <hr>
    `;
  previousContainer.appendChild(listItem);
}
previousDownload();
