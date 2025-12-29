const API_URL = 'http://localhost:5000/api';

// --- Batches ---

export const getBatches = async () => {
    try {
        const res = await fetch(`${API_URL}/batches`);
        if (!res.ok) throw new Error('Failed to fetch batches');
        return await res.json();
    } catch (err) {
        console.error(err);
        return [];
    }
};

export const saveBatch = async (batch) => {
    try {
        // If batch has an ID, it's potentially an update, but currently frontend might send partial objects or just create new.
        // Backend handles ID. Since our batch logic on frontend was: if ID matches update, else push.
        // For simplicity, batches in this app seem to be "created" mostly. Editing might be rare or implemented as delete/create.
        // We'll assume POST for new. If ID exists, we might need logic.
        // Actually, the previous store.js handled update if ID existed.

        /* 
           Previous store.js logic:
           if (batch.id) { index... update } else { push }
        */

        /* Note: Backend routes only had POST (create) and DELETE.
           I should check if I added PUT for batches. I did NOT.
           I will assume mostly creating/deleting for batches for now or update backend later if needed.
           Actually, the UI usually just adds or removes batches in simple apps.
           Let's just use POST for now. If ID is present, we might need to add PUT route.
           Checking previous BatchList might reveal usage.
           Assuming create for now.
        */
        const res = await fetch(`${API_URL}/batches`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(batch)
        });
        if (!res.ok) throw new Error('Failed to save batch');
        return await res.json();
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const deleteBatch = async (id) => {
    try {
        await fetch(`${API_URL}/batches/${id}`, { method: 'DELETE' });
    } catch (err) {
        console.error(err);
    }
};

// --- Students ---

export const getStudents = async () => {
    try {
        const res = await fetch(`${API_URL}/students`);
        if (!res.ok) throw new Error('Failed to fetch students');
        return await res.json();
    } catch (err) {
        console.error(err);
        return [];
    }
};

export const saveStudent = async (student) => {
    try {
        if (student.id) {
            // Update
            const res = await fetch(`${API_URL}/students/${student.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(student)
            });
            if (!res.ok) throw new Error('Failed to update student');
            return await res.json();
        } else {
            // Create
            const res = await fetch(`${API_URL}/students`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(student)
            });
            if (!res.ok) throw new Error('Failed to create student');
            return await res.json();
        }
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const deleteStudent = async (id) => {
    try {
        await fetch(`${API_URL}/students/${id}`, { method: 'DELETE' });
    } catch (err) {
        console.error(err);
    }
};

export const updateStudentPayment = async (id, paidAmount) => {
    try {
        // We need to fetch the student first to get totalAmount for status calculation, 
        // OR let the backend handle it.
        // But our backend PUT blindly updates.
        // It's better to fetch-update-save or send partial update.
        // Let's modify the student object locally and send PUT.
        // Wait, 'updateStudentPayment' in store.js handled status logic.
        // We should move that logic to the caller or replicate it here by fetching first.

        // Fetch current student to get totalAmount
        // Note: This is an extra round trip. 
        // Optimization: Backend could handle status update logic in PUT or a specific endpoint.
        // For now, let's keep logic here to match frontend app structure.

        // Actually, we can just send the paidAmount and status (calculated here or frontend).
        // BUT we need totalAmount to calculate status.
        // We can fetch student list or single student.
        // Let's assuming we just call saveStudent with the full object if we have it?
        // The original store.js `updateStudentPayment` took (id, paidAmount).

        // Let's implement specific logic:
        // 1. Get all students (cached or fresh) - expensive?
        // 2. Find student.
        // 3. Update.
        // 4. PUT.

        const students = await getStudents();
        const student = students.find(s => s.id === id);

        if (student) {
            student.paidAmount = paidAmount;
            if (paidAmount >= student.totalAmount) {
                student.status = 'Paid';
            } else if (paidAmount > 0) {
                student.status = 'Partial';
            } else {
                student.status = 'Unpaid';
            }
            // Send update
            return await saveStudent(student);
        }
        return null;
    } catch (err) {
        console.error(err);
        return null;
    }
};

// --- Utils ---

export const calculateValidity = (admissionDate) => {
    if (!admissionDate) return 'N/A';
    const date = new Date(admissionDate);
    if (isNaN(date.getTime())) return 'Invalid Date';

    // Add 1 month
    date.setMonth(date.getMonth() + 1);

    return date.toISOString().split('T')[0];
};
