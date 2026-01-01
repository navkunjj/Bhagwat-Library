const isLocal = window.location.hostname === 'localhost' ||
    window.location.hostname.match(/^192\.168\./) ||
    window.location.hostname.match(/^10\./) ||
    window.location.hostname.match(/^127\./);

const API_URL = isLocal
    ? `http://${window.location.hostname}:5000/api`
    : 'https://bhagwat-library.onrender.com/api';

// --- Dashboard ---

export const getDashboardStats = async () => {
    try {
        const res = await fetch(`${API_URL}/dashboard`);
        if (!res.ok) throw new Error('Failed to fetch dashboard stats');
        return await res.json();
    } catch (err) {
        console.error(err);
        return { stats: { totalStudents: 0, paidStudents: 0, unpaidStudents: 0, partialStudents: 0, totalRevenue: 0 }, recentStudents: [] };
    }
};

export const getPayments = async (status = 'All') => {
    try {
        const res = await fetch(`${API_URL}/payments?status=${status}`);
        if (!res.ok) throw new Error('Failed to fetch payments');
        return await res.json();
    } catch (err) {
        console.error(err);
        return [];
    }
};

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
        const method = batch.id ? 'PUT' : 'POST';
        const url = batch.id ? `${API_URL}/batches/${batch.id}` : `${API_URL}/batches`;

        const res = await fetch(url, {
            method,
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
        const res = await fetch(`${API_URL}/students`, { cache: 'no-store' });
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
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to update student');
            }
            return await res.json();
        } else {
            // Create
            const res = await fetch(`${API_URL}/students`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(student)
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to create student');
            }
            return await res.json();
        }
    } catch (err) {
        console.error('Store: saveStudent error:', err);
        throw err; // Throw error to be caught by UI
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
        const students = await getStudents();
        const student = students.find(s => s.id === id);

        if (student) {
            student.paidAmount = Number(paidAmount);
            if (student.paidAmount >= student.totalAmount) {
                student.status = 'Paid';
            } else if (student.paidAmount > 0) {
                student.status = 'Partial';
            } else {
                student.status = 'Unpaid';
            }
            // Send update
            return await saveStudent(student);
        }
        throw new Error('Student not found for payment update');
    } catch (err) {
        console.error('Store: updateStudentPayment error:', err);
        throw err;
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
