document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";
      activitySelect.innerHTML = '<option value="">-- Select an activity --</option>';

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
          <p><strong>Participants:</strong></p>
          <ul>
            ${details.participants.map(participant => `
              <li>
                ${participant}
                <span class="delete-icon" style="cursor: pointer; color: red; margin-left: 10px;">❌</span>
              </li>
            `).join("")}
          </ul>
        `;

        // Add event listeners for delete icons
        activityCard.querySelectorAll(".delete-icon").forEach((icon, index) => {
          icon.addEventListener("click", () => {
            if (confirm(`Are you sure you want to remove ${details.participants[index]} from ${name}?`)) {
              unregisterParticipant(details.participants[index], name);
            }
          });
        });

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Unregister a participant
  async function unregisterParticipant(email, activity) {
    try {
      const response = await fetch("/unregister", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, activity }),
      });

      if (!response.ok) {
        throw new Error("Failed to unregister participant");
      }

      alert("Participant unregistered successfully");
      fetchActivities();
    } catch (error) {
      alert(error.message);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = activitySelect.value;

    try {
      const response = await fetch(`/activities/${activity}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, activity }),
      });

      if (!response.ok) {
        throw new Error("Failed to sign up for activity");
      }

      alert("Signed up successfully");
      fetchActivities(); // Refresh activities list
    } catch (error) {
      alert(error.message);
    }
  });

  fetchActivities();
});
