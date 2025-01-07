document.addEventListener("DOMContentLoaded", () => {
    // Initial setup: Add event listeners for fetch buttons
    document.getElementById("fetchEventsBtn").addEventListener("click", fetchEvents);
    document.getElementById("fetchContactsBtn").addEventListener("click", fetchContacts);
    document.getElementById("fetchPrayerRequestsBtn").addEventListener("click", fetchPrayerRequests);
  
    // Add form submission listeners
    document.getElementById("createEventForm").addEventListener("submit", addEvent);
    document.getElementById("createContactForm").addEventListener("submit", addContact);
    document.getElementById("createDevotionalForm").addEventListener("submit", addDevotional);
  
    // Add modal close functionality
    document.querySelectorAll('.close-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const modal = this.closest('.modal');
        if (modal) {
          modal.style.display = "none";
        }
      });
    });
  
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
      if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
      }
    });
  
    // Save buttons event listeners
    document.getElementById('saveEventBtn').addEventListener('click', saveEventChanges);
    document.getElementById('saveContactBtn').addEventListener('click', saveContactChanges);
    document.getElementById('saveDevotionalBtn').addEventListener('click', saveDevotionalChanges);
  });
  
  // Fetch Events
  async function fetchEvents() {
    try {
      const response = await fetch('https://wogsa-backend.onrender.com/api/events');
      const events = await response.json();
      const eventsList = document.getElementById("eventsList");
      eventsList.innerHTML = "";
  
      events.forEach(event => {
        const eventCard = document.createElement("div");
        eventCard.className = "card";
        
        // Create the card content
        const content = document.createElement("div");
        content.innerHTML = `
          <strong>${event.title}</strong><br>
          <p>${new Date(event.date).toLocaleDateString()}</p>
          <p>${event.location}</p>
          <p>${event.description || ''}</p>
        `;
        
        // Create action buttons div
        const actions = document.createElement("div");
        actions.className = "actions";
        
        // Create edit button
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", () => editEvent(event._id));
        
        // Create delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => deleteEvent(event._id));
        
        // Append buttons to actions div
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        
        // Append content and actions to card
        eventCard.appendChild(content);
        eventCard.appendChild(actions);
        
        // Append card to list
        eventsList.appendChild(eventCard);
      });
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }
  
  // Fetch Contacts
  async function fetchContacts() {
    try {
      const response = await fetch('https://wogsa-backend.onrender.com/api/contacts');
      const contacts = await response.json();
      const contactsList = document.getElementById("contactsList");
      contactsList.innerHTML = "";
  
      contacts.forEach(contact => {
        const contactCard = document.createElement("div");
        contactCard.className = "card";
        
        const content = document.createElement("div");
        content.innerHTML = `
          <strong>${contact.name}</strong><br>
          <p>Role: ${contact.role}</p>
          <p>Phone: ${contact.phone}</p>
          <p>Email: ${contact.email}</p>
          <p>${contact.description || ''}</p>
        `;
        
        const actions = document.createElement("div");
        actions.className = "actions";
        
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", () => editContact(contact._id));
        
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => deleteContact(contact._id));
        
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        contactCard.appendChild(content);
        contactCard.appendChild(actions);
        contactsList.appendChild(contactCard);
      });
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  }
  
  // Fetch Prayer Requests
  async function fetchPrayerRequests() {
    try {
      const response = await fetch('https://wogsa-backend.onrender.com/api/prayer');
      const prayerRequests = await response.json();
      const prayerRequestsList = document.getElementById("prayerRequestsList");
      prayerRequestsList.innerHTML = "";
  
      prayerRequests.forEach(request => {
        const requestCard = document.createElement("div");
        requestCard.className = "card";
        requestCard.innerHTML = `
          <strong>${request.name}</strong><br>
          <p>Email: ${request.email}</p>
          <p>Request Type: ${request.requestType}</p>
          <p>Request Details: ${request.request}</p>
          ${request.preferredTime ? `<p>Preferred Time: ${request.preferredTime}</p>` : ''}
        `;
        prayerRequestsList.appendChild(requestCard);
      });
    } catch (error) {
      console.error('Error fetching prayer requests:', error);
    }
  }
  
  // Add Event
  async function addEvent(e) {
    e.preventDefault();
    const newEvent = {
      title: document.getElementById("eventTitle").value,
      date: document.getElementById("eventDate").value,
      location: document.getElementById("eventLocation").value,
      description: document.getElementById("eventDescription").value
    };
  
    try {
      const response = await fetch('https://wogsa-backend.onrender.com/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
      });
      const data = await response.json();
      console.log("Event added:", data);
      fetchEvents();
      e.target.reset();
    } catch (error) {
      console.error('Error adding event:', error);
    }
  }
  
  // Add Contact
  async function addContact(e) {
    e.preventDefault();
    const newContact = {
      name: document.getElementById("contactName").value,
      role: document.getElementById("contactRole").value,
      phone: document.getElementById("contactPhone").value,
      email: document.getElementById("contactEmail").value,
      description: document.getElementById("contactDescription").value
    };
  
    try {
      const response = await fetch('https://wogsa-backend.onrender.com/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContact)
      });
      const data = await response.json();
      console.log("Contact added:", data);
      fetchContacts();
      e.target.reset();
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  }
  
  // Add Devotional
  async function addDevotional(e) {
    e.preventDefault();
    const newDevotional = {
      title: document.getElementById("devotionalTitle").value,
      content: document.getElementById("devotionalContent").value
    };
  
    try {
      const response = await fetch('https://wogsa-backend.onrender.com/api/devotional', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDevotional)
      });
      const data = await response.json();
      console.log("Devotional added:", data);
      e.target.reset();
    } catch (error) {
      console.error('Error adding devotional:', error);
    }
  }
  
  // Edit Event
  async function editEvent(eventId) {
    try {
      console.log('Editing event with ID:', eventId);
      const response = await fetch(`https://wogsa-backend.onrender.com/api/events/${eventId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const event = await response.json();
      
      console.log('Event data received:', event);
      
      document.getElementById('editTitle').value = event.title || '';
      document.getElementById('editDate').value = event.date ? event.date.split('T')[0] : '';
      document.getElementById('editLocation').value = event.location || '';
      document.getElementById('editDescription').value = event.description || '';
      
      document.getElementById('editEventForm').dataset.eventId = eventId;
      
      const modal = document.getElementById('editEventModal');
      modal.style.display = "block";
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
  }
  
  // Edit Contact
  async function editContact(contactId) {
    try {
      console.log('Editing contact with ID:', contactId);
      const response = await fetch(`https://wogsa-backend.onrender.com/api/contacts/${contactId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contact = await response.json();
      
      console.log('Contact data received:', contact);
      
      document.getElementById('editContactName').value = contact.name || '';
      document.getElementById('editContactRole').value = contact.role || '';
      document.getElementById('editContactPhone').value = contact.phone || '';
      document.getElementById('editContactEmail').value = contact.email || '';
      document.getElementById('editContactDescription').value = contact.description || '';
      
      document.getElementById('editContactForm').dataset.contactId = contactId;
      
      const modal = document.getElementById('editContactModal');
      modal.style.display = "block";
    } catch (error) {
      console.error('Error fetching contact details:', error);
    }
  }
  
  // Save Event Changes
  async function saveEventChanges() {
    const eventId = document.getElementById('editEventForm').dataset.eventId;
    console.log('Saving event with ID:', eventId);
    
    const updatedEvent = {
      title: document.getElementById('editTitle').value,
      date: document.getElementById('editDate').value,
      location: document.getElementById('editLocation').value,
      description: document.getElementById('editDescription').value
    };
  
    try {
      const response = await fetch(`https://wogsa-backend.onrender.com/api/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEvent)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const modal = document.getElementById('editEventModal');
      modal.style.display = "none";
      await fetchEvents();
    } catch (error) {
      console.error('Error updating event:', error);
    }
  }
  
  // Save Contact Changes
  async function saveContactChanges() {
    const contactId = document.getElementById('editContactForm').dataset.contactId;
    console.log('Saving contact with ID:', contactId);
    
    const updatedContact = {
      name: document.getElementById('editContactName').value,
      role: document.getElementById('editContactRole').value,
      phone: document.getElementById('editContactPhone').value,
      email: document.getElementById('editContactEmail').value,
      description: document.getElementById('editContactDescription').value
    };
  
    try {
      const response = await fetch(`https://wogsa-backend.onrender.com/api/contacts/${contactId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContact)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const modal = document.getElementById('editContactModal');
      modal.style.display = "none";
      await fetchContacts();
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  }
  
  // Delete Event
  async function deleteEvent(eventId) {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(`https://wogsa-backend.onrender.com/api/events/${eventId}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        await fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  }
  
  // Delete Contact
  async function deleteContact(contactId) {
    if (confirm('Are you sure you want to delete this contact?')) {
      try {
        const response = await fetch(`https://wogsa-backend.onrender.com/api/contacts/${contactId}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        await fetchContacts();
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  }
  
  // Save Devotional Changes
  async function saveDevotionalChanges() {
    const devotionalId = document.getElementById('editDevotionalForm').dataset.devotionalId;
    console.log('Saving devotional with ID:', devotionalId);
    
    const updatedDevotional = {
      title: document.getElementById('editDevotionalTitle').value,
      content: document.getElementById('editDevotionalContent').value
    };
  
    try {
      const response = await fetch(`https://wogsa-backend.onrender.com/api/devotional/${devotionalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDevotional)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const modal = document.getElementById('editDevotionalModal');
      modal.style.display = "none";
    } catch (error) {
      console.error('Error updating devotional:', error);
    }
  }