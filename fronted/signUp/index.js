const form = document.getElementById("form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirm_password = document.getElementById("confirm_password");
const submit = document.getElementById("submit");

form.addEventListener("submit", postUserData);

async function postUserData(event) {
  event.preventDefault();
  const details = {
    username: username.value,
    email: username.value,
    password: password.value,
    confirm_password: confirm_password.value,
  };
  try {
    await axios.post("http://localhost:3000/user/signUp", details);
  } catch (err) {
    console.log(err);
  }
}
