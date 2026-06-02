async function testAPI() {
  console.log("Testing GET /api/slots...");
  try {
    const resSlots = await fetch('http://localhost:3000/api/slots?date=2026-06-10');
    const slots = await resSlots.json();
    console.log("Slots Response:", slots);
    
    let slotToBook = "10:00-10:30";
    if (slots.data && slots.data.slots && slots.data.slots.length > 0) {
       const available = slots.data.slots.find(s => s.available);
       if (available) slotToBook = `${available.start}-${available.end}`;
    }

    console.log("\nTesting POST /api/book...");
    const resBook = await fetch('http://localhost:3000/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: "John Doe",
        phone: "+91-9876543210",
        email: "john@example.com",
        reason: "Regular checkup",
        preferredDate: "2026-06-10",
        preferredTimeSlot: slotToBook,
        consentGiven: true
      })
    });
    const bookResult = await resBook.json();
    console.log("Book Response:", bookResult);

    console.log("\nTesting POST /api/contact...");
    const resContact = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: "Jane Smith",
        phone: "+91-9123456789",
        email: "jane@example.com",
        message: "I would like to know the clinic timings.",
      })
    });
    console.log("Contact Response:", await resContact.json());

    console.log("\nTesting POST /api/request-data...");
    const resData = await fetch('http://localhost:3000/api/request-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: "john@example.com",
        phone: "+91-9876543210",
        requestType: "access",
      })
    });
    console.log("Request Data Response:", await resData.json());
    
  } catch (err) {
    console.error("Test Error:", err);
  }
}

testAPI();
