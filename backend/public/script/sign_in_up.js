// Get DOM elements
const form1 = document.getElementById("form1");
const form2 = document.getElementById("form2");
const username = document.getElementById("username");
const email = document.getElementById("email");
const loginEmail = document.getElementById("loginEmail");
const password = document.getElementById("password");
const loginPassword = document.getElementById("loginPassword");
const confirm_password = document.getElementById("confirm_password");
const submit1 = document.getElementById("submit1");
const submit2 = document.getElementById("submit2");
const login = document.getElementById("login");
const signup = document.getElementById("signup");
const one = document.getElementById("one");
const two = document.getElementById("two");
const forgotPasswordBtn = document.getElementById("forgotPassword");
const popUp_success = document.getElementById("popUp-success");
const popUp_email = document.getElementById("popUp-email-error");
const popUp_password = document.getElementById("popUp-password-error");
const popUp_logIn = document.getElementById("popUp-error-logIn");

// Event listeners
form1.addEventListener("submit", postUserData1);
form2.addEventListener("submit", postUserData2);
signup.addEventListener("click", handleSignup);
login.addEventListener("click", handleLogin);
forgotPasswordBtn.addEventListener("click", handleForgotPassword);

// Switch to signup form
function handleSignup() {
  one.classList.remove("display-block");
  one.classList.add("display-none");
  two.classList.remove("display-none");
  two.classList.add("display-block");
}

// Switch to login form
function handleLogin() {
  one.classList.remove("display-none");
  one.classList.add("display-block");
  two.classList.remove("display-block");
  two.classList.add("display-none");
}

// Redirect to forgot password page
function handleForgotPassword() {
  window.location.href = "/password/forgotPassword";
}

// Handle login form submission
async function postUserData1(event) {
  event.preventDefault();
  const details = {
    email: loginEmail.value,
    password: loginPassword.value,
  };
  try {
    const response = await axios.post(
      "http://localhost:3000/user/logIn",
      details
    );
    localStorage.setItem("token", response.data.token);
    if (response.data.success === "success") {
      window.location.href = "/expense/addexpense";
    } else {
      window.location.href = "/user/login";
    }
  } catch (err) {
    if (err.response && err.response.status === 404) {
      popUp_logIn.style.display = "block";
      setTimeout(() => {
        popUp_logIn.style.display = "none";
      }, 3000);
    }
  }
}

// Handle signup form submission
async function postUserData2(event) {
  event.preventDefault();
  const details = {
    username: username.value,
    email: email.value,
    password: password.value,
    confirm_password: confirm_password.value,
  };
  try {
    const response = await axios.post(
      "http://localhost:3000/user/signUp",
      details
    );
    form2.reset();
    popUp_success.style.display = "block";
    setTimeout(() => {
      window.location.href = "/user/login";
    }, 2000);
  } catch (err) {
    console.log(err);
    if (err.response && err.response.status === 400) {
      popUp_password.style.display = "block";
      setTimeout(() => {
        popUp_password.style.display = "none";
      }, 3000);
    } else if (err.response && err.response.status === 409) {
      popUp_email.style.display = "block";
      setTimeout(() => {
        popUp_email.style.display = "none";
      }, 3000);
    }
  }
}
