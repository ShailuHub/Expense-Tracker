// Getting references to DOM elements
const toggleBtn = document.getElementById("toggle-btn");
const crossBtn = document.getElementById("cross-btn");
const toggleMenu = document.getElementById("toggle-menu");
const expenseLeaderBoard_lg = document.getElementById("expenseLeaderBoard-lg");
const expenseLeaderBoard_sm = document.getElementById("expenseLeaderBoard-sm");
const expenseHome_lg = document.getElementById("expenseHome-lg");
const expenseHome_sm = document.getElementById("expenseHome-sm");
const menuBtn = document.querySelectorAll(".nav-menu ul li a");
const premiumFeautures_lg = document.getElementById("premiumFeatures-lg");
const premiumFeautures_sm = document.getElementById("premiumFeatures-sm");
const mainContent = document.getElementById("main-content");
const logOut = document.getElementById("logOut");
const logOut_sm = document.getElementById("logOut-sm");
const premiumBtn = document.getElementById("premiumBtn");
const premiumBtn_sm = document.getElementById("premiumBtn-sm");

// Adding event listeners for navigation
expenseLeaderBoard_lg.addEventListener("click", showLeaderBoard);
expenseLeaderBoard_sm.addEventListener("click", showLeaderBoard);
premiumFeautures_lg.addEventListener("click", showPremiumFeautes);
premiumFeautures_sm.addEventListener("click", showPremiumFeautes);
expenseHome_sm.addEventListener("click", showHome);
expenseHome_lg.addEventListener("click", showHome);
premiumBtn.addEventListener("click", buyPremium);
premiumBtn_sm.addEventListener("click", buyPremium);

// Adding event listener to log out buttons
logOut.addEventListener("click", () => {
  window.location.href = "/user/login";
});

logOut_sm.addEventListener("click", () => {
  window.location.href = "/user/login";
});

// Adding event listeners for toggle buttons
toggleBtn.addEventListener("click", () => {
  toggleBtn.style.display = "none";
  crossBtn.style.display = "block";
  toggleMenu.style.display = "block";
});

crossBtn.addEventListener("click", () => {
  toggleBtn.style.display = "block";
  crossBtn.style.display = "none";
  toggleMenu.style.display = "none";
});

// Function to show leaderboard page
async function showLeaderBoard(event) {
  event.preventDefault();
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`http://localhost:3000/premium`, {
      headers: { Authorization: token },
    });
    if (response.data.success === "success") {
      window.location.href = "/premium/leaderboard";
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      alert("Buy premium");
    }
  }
}

// Function to show home page
async function showHome(event) {
  event.preventDefault();
  window.location.href = "/expense/addexpense";
}

// Function to show premium features page
async function showPremiumFeautes() {
  const token = localStorage.getItem("token");
  try {
    const getResponse = await axios.get(`http://localhost:3000/premium`, {
      headers: { Authorization: token },
    });
    if (getResponse.data.success === "success") {
      window.location.href = "/premium/features";
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      alert("You are not a preium user");
    }
  }
}

// Buy premium
async function buyPremium(event) {
  event.preventDefault();
  const token = localStorage.getItem("token");
  try {
    //Get the payment information from the server
    const getResponse = await axios.get(
      `http://localhost:3000/purchase/membership`,
      { headers: { Authorization: token } }
    );

    //Prepare options for the Razorpay payment
    const options = {
      key: getResponse.data.key_id,
      order_id: getResponse.data.order.orderId,
      handler: async function (responseFromRazorPay) {
        const postResponse = await axios.post(
          `http://localhost:3000/purchase/updateTransactionstatus`,
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
        window.location.href = "/expense/addexpense";
      },
    };

    //Initialize Razorpay and open the payment window
    const payToRazorPay = new Razorpay(options);
    payToRazorPay.open();

    //Handle payment failure
    payToRazorPay.on("payment.failed", (response) => {
      alert("Something went wrong");
    });
  } catch (error) {
    console.log(error);
  }
}
