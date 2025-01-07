// Fetch and Display Prayer Requests
document.getElementById("fetchPrayerRequests").addEventListener("click", async () => {
    const prayerRequestsList = document.getElementById("prayerRequestsList");
    prayerRequestsList.innerHTML = "<li>Loading...</li>";
  
    try {
      const response = await fetch('https://wogsa-backend.onrender.com/api/prayer'); 
  
      // If the response is not ok (e.g. 404, 500)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const prayerRequests = await response.json();
  
      if (prayerRequests.length === 0) {
        prayerRequestsList.innerHTML = "<li>No prayer requests found.</li>";
      } else {
        prayerRequestsList.innerHTML = "";
        prayerRequests.forEach(request => {
          const listItem = document.createElement("li");
          listItem.innerHTML = `
            <strong>Name:</strong> ${request.name}<br>
            <strong>Email:</strong> ${request.email}<br>
            <strong>Request Type:</strong> ${request.requestType}<br>
            <strong>Request:</strong> ${request.request}<br>
            <strong>Preferred Time:</strong> ${request.preferredTime || "N/A"}
          `;
          prayerRequestsList.appendChild(listItem);
        });
      }
    } catch (error) {
      prayerRequestsList.innerHTML = "<li>Failed to fetch prayer requests. Please try again.</li>";
      console.error('Error fetching prayer requests:', error);
    }
  });
  
  // Example Form Submission Handlers
  document.querySelectorAll("form").forEach(form => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      let endpoint = "";
  
      if (e.target.id === "createEventForm") {
        endpoint = "https://wogsa-backend.onrender.com/api/events";
      } else if (e.target.id === "addDevotionalForm") {
        endpoint = "https://wogsa-backend.onrender.com/api/devotional";
      } else if (e.target.id === "addContactForm") {
        endpoint = "https://wogsa-backend.onrender.com/api/contacts";
      }
  
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
  
        // If response is not ok
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const result = await response.json();
        alert(result.message || "Action completed successfully!");
  
        // Clear the form on success
        e.target.reset();
      } catch (error) {
        alert("An error occurred. Please try again.");
        console.error('Error during form submission:', error);
      }
    });
  });
  