document.addEventListener("DOMContentLoaded", function () {
  const xidValueElement = document.getElementById("xid-value");
  const asdcValueElement = document.getElementById("asdc-value");
  const errorMessageElement = document.getElementById("error-message");
  const copyXidButton = document.getElementById("copy-xid");
  const copyAsdcButton = document.getElementById("copy-asdc");

  // Function to handle copying
  function setupCopyButton(button, value) {
    button.addEventListener("click", function () {
      const copyIcon = button.querySelector(".copy-icon");
      const successIcon = button.querySelector(".success-icon");

      navigator.clipboard
        .writeText(value)
        .then(function () {
          copyIcon.classList.add("hidden");
          successIcon.classList.remove("hidden");
          setTimeout(() => {
            copyIcon.classList.remove("hidden");
            successIcon.classList.add("hidden");
          }, 1500);
        })
        .catch(function (err) {
          console.error("Failed to copy text: ", err);
          errorMessageElement.textContent = "Failed to copy to clipboard";
          errorMessageElement.style.display = "block";
        });
    });
  }

  // Function to fetch cookie
  function fetchCookie(name, element, copyButton) {
    chrome.cookies.get(
      {
        url: "https://apple.com",
        name: name,
      },
      function (cookie) {
        if (cookie) {
          element.textContent = cookie.value;
          setupCopyButton(copyButton, cookie.value);
        } else {
          element.textContent = "Not found";
          copyButton.style.display = "none";
          errorMessageElement.textContent = `${name} cookie not found. Please make sure you are logged into apple.com`;
          errorMessageElement.style.display = "block";
        }
      }
    );
  }

  // Fetch both cookies
  fetchCookie("XID", xidValueElement, copyXidButton);
  fetchCookie("as_dc", asdcValueElement, copyAsdcButton);
});
