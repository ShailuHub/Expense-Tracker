// Getting references to DOM elements
const form = document.getElementById("form");
const email = document.getElementById("email");
const textToShow = document.getElementById("textToShow");

// Adding event listener to form submission
form.addEventListener("submit", postEmail);

// Function to handle form submission
async function postEmail(event) {
  // Display "Processing" message
  textToShow.innerHTML = "Processing....";

  // Prevent default form submission behavior
  event.preventDefault();

  // Creating an object with the email detail
  const detail = {
    email: email.value,
  };

  try {
    // Sending a POST request to the server
    const postResponse = await axios.post(
      "http://3.109.64.14:3000/password/forgotPassword",
      detail
    );

    // Storing userId in local storage
    localStorage.setItem("userId", postResponse.data.userId);

    try {
      // Sending a GET request for pop-up data
      await axios.get("http://3.109.64.14:3000/pop-up");

      // Redirecting to the pop-up page
      window.location.href = "/pop-up";
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
}
