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

form1.addEventListener("submit", postUserData1);
form2.addEventListener("submit", postUserData2);
signup.addEventListener("click", handleSignup);
login.addEventListener("click", handlelogin);

function handleSignup() {
  one.classList.remove("display-block");
  one.classList.add("display-none");
  two.classList.remove("display-none");
  two.classList.add("display-block");
  history.pushState(null, null, "/user/signup");
}

function handlelogin() {
  one.classList.remove("display-none");
  one.classList.add("display-block");
  two.classList.remove("display-block");
  two.classList.add("display-none");
  history.pushState(null, null, "/user/login");
}

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
    if (response.data.success == "success") {
      window.location.href = "/expense/addexpense";
    } else {
      window.location.href = "/user/login";
    }
  } catch (err) {
    console.log(err);
  }
}

async function postUserData2(event) {
  event.preventDefault();
  const details = {
    username: username.value,
    email: email.value,
    password: password.value,
    confirm_password: confirm_password.value,
  };
  try {
    await axios.post("http://localhost:3000/user/signUp", details);
    form2.reset();
    window.location.href = "/user/login";
  } catch (err) {
    console.log(err);
  }
}
