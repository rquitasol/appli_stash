document.addEventListener("DOMContentLoaded", function () {
  const url = "http://localhost:3000"; // Base URL for API requests

  //   document.getElementById("saveForm").onsubmit =
  //     async function (e) {
  //       e.preventDefault();
  //       const form = e.target;
  //       const data = {
  //         company_name: form.company_name.value,
  //         position: form.position.value,
  //         url: form.url.value,
  //         notes: form.notes.value,
  //         // Add more fields as needed
  //       };
  //       // TODO: Add authentication/session handling
  //       const res = await fetch(`${url}/api/application`, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(data),
  //         credentials: "include",
  //       });
  //       const resultDiv = document.getElementById("result");
  //       if (res.ok) {
  //         resultDiv.textContent = "Saved!";
  //         form.reset();
  //       } else {
  //         const err = await res.json();
  //         resultDiv.textContent =
  //           err.error || "Failed to save.";
  //       }
  //     };

  document.getElementById("loginForm").onsubmit =
    async function (e) {
      e.preventDefault();
      const form = e.target;
      const data = {
        email: form.email.value,
        password: form.password.value, // Send plain password
      };

      try {
        const res = await fetch(`${url}/api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          credentials: "include",
        });

        const resultDiv = document.getElementById("result");
        if (res.ok) {
          const responseData = await res.json();
          console.log("JWT Response Data:", responseData);
          const token = responseData.token; // Assuming the API returns a JWT token

          // Log the token for debugging
          console.log("JWT Token:", token);

          // Save the token to localStorage or chrome.storage
          localStorage.setItem("authToken", token);

          resultDiv.textContent = "Login successful!";
          // Optionally redirect or close the popup
        } else {
          const err = await res.json();
          resultDiv.textContent =
            err.error || "Login failed.";
        }
      } catch (error) {
        console.error("Error during login:", error);
        document.getElementById("result").textContent =
          "An error occurred. Please try again.";
      }
    };
});
