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
        url: "https://apple.com", // Base domain is sufficient
        name: name,
      },
      function (cookie) {
        if (cookie) {
          if (element.textContent !== cookie.value) {
            element.textContent = cookie.value;
            setupCopyButton(copyButton, cookie.value);
          }
        } else {
          element.textContent = "Not found";
          copyButton.style.display = "none";
          errorMessageElement.textContent = `${name} cookie not found. Please make sure you are logged into apple.com`;
          errorMessageElement.style.display = "block";
        }
      }
    );
  }

  // Add this function to check if current tab is on apple.com
  function checkCurrentTab() {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentTab = tabs[0];
        const url = new URL(currentTab.url);

        if (!url.hostname.endsWith("apple.com")) {
          // Hide the cookie sections
          document.querySelectorAll(".cookie-section").forEach((section) => {
            section.style.display = "none";
          });

          // Show error message
          errorMessageElement.textContent =
            "Please navigate to apple.com to use this extension";
          errorMessageElement.style.display = "block";

          resolve(false);
          return;
        }

        // Show cookie sections
        document.querySelectorAll(".cookie-section").forEach((section) => {
          section.style.display = "block";
        });
        resolve(true);
      });
    });
  }

  // Modify refreshCookies to only run if we're on apple.com
  async function refreshCookies() {
    const isAppleDomain = await checkCurrentTab();
    if (isAppleDomain) {
      fetchCookie("XID", xidValueElement, copyXidButton);
      fetchCookie("as_dc", asdcValueElement, copyAsdcButton);
    }
  }

  // Function to refresh all cookies
  // function refreshCookies() {
  //   fetchCookie("XID", xidValueElement, copyXidButton);
  //   fetchCookie("as_dc", asdcValueElement, copyAsdcButton);
  // }

  // Initial fetch
  refreshCookies();
  // setInterval(refreshCookies, 1000);
});
