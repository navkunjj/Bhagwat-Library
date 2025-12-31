import { useEffect, useState } from "react";
import { Loader } from "@/components/Loader"; // adjust path if needed

const API_URL = import.meta.env.VITE_API_URL;

export default function Students() {
    const [students, setStudents] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const fetchStudents = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/students?page=${page}`);
            const data = await res.json();

            if (data.length === 0) {
                setHasMore(false);
            } else {
                setStudents(prev => [...prev, ...data]);
                setPage(prev => prev + 1);
            }
        } catch (err) {
            console.error("Error fetching students", err);
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchStudents();
    }, []);

    // Infinite scroll
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 150
            ) {
                fetchStudents();
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loading, hasMore]);

    return (
        <div className="p-4">
            {students.map(student => (
                <div
                    key={student.id}
                    className="border rounded-md p-3 mb-3 shadow-sm"
                >
                    <h3 className="font-semibold">{student.name}</h3>
                    <p>Phone: {student.phone}</p>
                    <p>Status: {student.status}</p>
                </div>
            ))}

            {/* Loader */}
            {loading && <Loader />}

            {/* End message */}
            {!hasMore && (
                <p className="text-center text-gray-500 mt-4">
                    No more students
                </p>
            )}
        </div>
    );
}
