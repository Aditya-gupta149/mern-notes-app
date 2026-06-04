import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Home() {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();

    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState([]);
    const [search, setSearch] = useState("");
    const [darkMode, setDarkMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [noteData, setNoteData] = useState({
        title: "",
        content: "",
    });

    // Fetch all notes
    const fetchNotes = async () => {
        try {
            setLoading(true);

            const { data } = await API.get("/notes");

            setNotes(data.notes);

        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to fetch notes"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        setNoteData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // Create or update note
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!noteData.title || !noteData.content) {
            return toast.error(
                "Title and content are required"
            );
        }

        try {
            if (editId) {
                const { data } = await API.put(
                    `/notes/${editId}`,
                    noteData
                );

                setNotes((prev) =>
                    prev.map((note) =>
                        note._id === editId
                            ? data.note
                            : note
                    )
                );

                toast.success(
                    "Note updated successfully"
                );

                setEditId(null);

            } else {
                const { data } = await API.post(
                    "/notes",
                    noteData
                );

                setNotes((prev) => [
                    data.note,
                    ...prev,
                ]);

                toast.success(
                    "Note created successfully"
                );
            }

            setNoteData({
                title: "",
                content: "",
            });

        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Operation failed"
            );
        }
    };

    // Delete note
    const handleDelete = async (id) => {
        try {
            const { data } = await API.delete(
                `/notes/${id}`
            );

            setNotes((prev) =>
                prev.filter(
                    (note) => note._id !== id
                )
            );

            toast.success(data.message);

        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Delete failed"
            );
        }
    };

    // Pin / Unpin note
    const handlePin = async (id, currentPinStatus) => {
        try {
            const { data } = await API.put(
                `/notes/${id}`,
                {
                  isPinned: !currentPinStatus,
                }
            );
            setNotes((prev) => prev.map((note) => note._id === id ? data.note : note));
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Pin update failed"
            );
        }
    };

    // Logout user
    const handleLogout = async () => {
        try {
            const { data } = await API.post("/users/logout");
            setUser(null);
            toast.success(data.message);
            navigate("/login");

        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Logout failed"
            );
        }
    };

    const filteredNotes = notes.filter((note) =>
        note.title
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const sortedNotes = [...filteredNotes].sort(
        (a, b) => b.isPinned - a.isPinned
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading notes...
            </div>
        );
    }

    return (
        <div
            className={
                darkMode
                    ? "bg-gray-900 text-white min-h-screen p-5"
                    : "bg-gray-100 text-black min-h-screen p-5"
            }
        >
            <div className="flex gap-3 mb-5">
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                    Logout
                </button>

                <button
                    onClick={() =>
                        setDarkMode(!darkMode)
                    }
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                    Toggle Mode
                </button>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold">
                    Welcome back,{" "}
                    {user?.username}
                </h2>

                <p>{user?.email}</p>
            </div>

            <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">
                Welcome to Notes App 🚀
            </h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-2xl shadow-lg"
            >
                <input
                    type="text"
                    name="title"
                    placeholder="Enter Note Title"
                    value={noteData.title}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl border mb-4"
                />

                <textarea
                    name="content"
                    placeholder="Write your note..."
                    value={noteData.content}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl border h-32"
                />

                <button
                    type="submit"
                    className="bg-green-500 text-white px-5 py-2 rounded-xl mt-4"
                >
                    {editId
                        ? "Update Note"
                        : "Add Note"}
                </button>
            </form>

            <input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
                className="w-full p-3 rounded-xl border shadow-sm mt-6"
            />

            <div className="bg-white p-4 rounded-xl shadow-md mt-6">
                <h3>📊 Dashboard</h3>

                <p>
                    Total Notes: {notes.length}
                </p>

                <p>
                    Mode:{" "}
                    {darkMode
                        ? "🌙 Dark"
                        : "☀️ Light"}
                </p>
            </div>

            <h2 className="text-2xl font-bold mt-6 mb-4">
                Your Notes
            </h2>

            {sortedNotes.length === 0 ? (
                <div className="bg-white p-6 rounded-xl shadow">
                    <h3>No notes found 🚀</h3>
                    <p>Create your first note.</p>
                </div>
            ) : (
                sortedNotes.map((note) => (
                    <div
                        key={note._id}
                        className={`p-5 rounded-2xl shadow-md mb-5 border-l-4 ${
                            note.isPinned
                                ? "border-yellow-500 bg-yellow-50"
                                : "border-blue-500 bg-white"
                        }`}
                    >
                        <h3 className="text-xl font-semibold">
                            {note.isPinned &&
                                "📌 "}
                            {note.title}
                        </h3>

                        <p className="mt-2">
                            {note.content}
                        </p>

                        <p className="text-sm text-gray-500 mt-2">
                            📅{" "}
                            {new Date(
                                note.createdAt
                            ).toLocaleString()}
                        </p>

                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() =>
                                    handleDelete(
                                        note._id
                                    )
                                }
                                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                            >
                                Delete
                            </button>

                            <button
                                onClick={() =>
                                    handlePin(
                                        note._id,
                                        note.isPinned
                                    )
                                }
                                className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                            >
                                {note.isPinned
                                    ? "📌 Unpin"
                                    : "📍 Pin"}
                            </button>

                            <button
                                onClick={() => {
                                    setNoteData({
                                        title:
                                            note.title,
                                        content:
                                            note.content,
                                    });

                                    setEditId(
                                        note._id
                                    );
                                }}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default Home;