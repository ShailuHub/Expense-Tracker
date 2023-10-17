// Getting references to DOM elements
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm_password");
const form = document.getElementById("form");

// Adding event listener to form submission
form.addEventListener("submit", postResetPassword);

// Function to handle password reset submission
async function postResetPassword(event) {
  // Retrieve userId from local storage
  const userId = localStorage.getItem("userId");
  // Prevent default form submission behavior
  event.preventDefault();

  // Creating an object with password details
  const details = {
    password: password.value,
    confirmPassword: confirmPassword.value,
  };

  try {
    // Sending a POST request to reset the password
    const response = await axios.post(
      `http://localhost:3000/password/resetpassword/${userId}`,
      details
    );

    // If password reset is successful, redirect to login page
    if (response.data.success === "success") {
      window.location.href = "/user/login";
    }

    console.log(response); // Display the response in console
  } catch (error) {
    console.log(error); // Display any errors in console
  }
}
