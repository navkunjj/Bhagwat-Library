const fetch = require('node-fetch');

const API_URL = 'http://localhost:5000/api';

async function testSeatUpdate() {
    try {
        // 1. Get all students to find one to update
        const studentsRes = await fetch(`${API_URL}/students`);
        const students = await studentsRes.json();

        if (students.length === 0) {
            console.log("No students found to test with.");
            return;
        }

        const target = students[0];
        console.log(`Testing with student: ${target.name} (ID: ${target.id})`);
        console.log(`Current Seat: ${target.seatNumber}`);

        const newSeat = Math.floor(Math.random() * 100) + 1;
        console.log(`Attempting to update to seat: ${newSeat}`);

        // 2. Perform Update
        const updateRes = await fetch(`${API_URL}/students/${target.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...target, seatNumber: newSeat })
        });

        const updated = await updateRes.json();
        console.log(`Response Seat: ${updated.seatNumber}`);

        if (updated.seatNumber === newSeat) {
            console.log("SUCCESS: Seat number persisted in response.");
        } else {
            console.log("FAILURE: Seat number did NOT persist in response.");
        }

        // 3. Double Check with GET
        const verifyRes = await fetch(`${API_URL}/students`);
        const verifyStudents = await verifyRes.json();
        const verified = verifyStudents.find(s => s.id === target.id);
        console.log(`Verified Get Seat: ${verified.seatNumber}`);

        if (verified.seatNumber === newSeat) {
            console.log("DOUBLE CHECK SUCCESS: Seat number persists in subsequent GET.");
        } else {
            console.log("DOUBLE CHECK FAILURE: Seat number missing in subsequent GET.");
        }

    } catch (err) {
        console.error("Test Error:", err);
    }
}

testSeatUpdate();
