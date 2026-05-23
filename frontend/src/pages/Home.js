import { toast } from "react-toastify";
import { useState , useEffect } from "react";
import API from "../services/api";

function Home() {

  const [noteData, setNoteData] = useState({
    title: "",
    content: "",
  });

  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [editId, setEditId] = useState(null);
  const totalNotes = notes.length;

  const handleChange = (e) => {
    setNoteData({
      ...noteData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {

    const token = localStorage.getItem("token");

    let res;

    if (editId) {

      res = await API.put(
        `/notes/${editId}`,
        noteData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedNotes = notes.map((note) =>
        note._id === editId ? res.data : note
      );

      setNotes(updatedNotes);

      toast.info("Note Updated ✏️");

      setEditId(null);

    } else {

      res = await API.post(
        "/notes",
        noteData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotes([...notes, res.data]);

      toast.success("Note Added 🚀");
    }

    setNoteData({
      title: "",
      content: "",
    });

  } catch (error) {

    console.log(error);

    toast.error("Something went wrong ❌");
  }
};

const fetchProfile = async () => {

  try {

    const res = await API.get("/users/profile");

    console.log(res.data);

    setUser(res.data);

  } catch (error) {

    console.log(error);

  }
};

const fetchNotes = async () => {

  try {

    const token = localStorage.getItem("token");

    const res = await API.get("/notes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(res.data);

    setNotes(res.data);

  } catch (error) {

    console.log(error);

  }
};

useEffect(() => {
  
  
  fetchNotes();
  fetchProfile();

}, []);

const handleDelete = async (id) => {

  try {

    const token = localStorage.getItem("token");

    await API.delete(`/notes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const updatedNotes = notes.filter(
      (note) => note._id !== id
    );

    setNotes(updatedNotes);

    toast.error("Note Deleted 🗑");

  } catch (error) {

    console.log(error);

    toast.error("Delete Failed ❌");
  }
};

const handlePin = async (id, currentPinStatus) => {

  try {

    const token = localStorage.getItem("token");

    const res = await API.put(
      `/notes/${id}`,
      {
        isPinned: !currentPinStatus,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const updatedNotes = notes.map((note) =>
      note._id === id ? res.data : note
    );

    setNotes(updatedNotes);

  } catch (error) {

    console.log(error);

    toast.error("Pin update failed ❌");

  }
};

const handleLogout = () => {

  localStorage.removeItem("token");

  toast.success("Logged out 👋");

  window.location.href = "/login";
};

 return (
  <div
    className={
      darkMode
        ? "bg-gray-900 text-white min-h-screen p-5"
        : "bg-gray-100 text-black min-h-screen p-5"
    }
  >
        <button onClick={handleLogout}
  className="bg-red-500 text-white px-4 py-2 rounded-lg mr-3"
>
            Logout
        </button>
      
      <button onClick={() => setDarkMode(!darkMode)}
  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
>
  Toggle Mode
</button>

      {user && (

  <div className="bg-gray-900 text-white p-5 rounded-2xl shadow-lg mb-6">

    <h3>👤 User Profile</h3>

    <p><strong>Name:</strong> {user.name}</p>

    <p><strong>Email:</strong> {user.email}</p>

  </div>

)}
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">
       Welcome to Notes App 🚀 </h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg" >

      <input
  type="text"
  name="title"
  className="w-full p-3 rounded-xl border shadow-sm mb-4"
  placeholder="Enter Note Title"
  value={noteData.title}
  onChange={handleChange}
/>

        <br />
        <br />

      <textarea
  name="content"
  className="w-full p-3 rounded-xl border shadow-sm h-32"
  placeholder="Write your note..."
  value={noteData.content}
  onChange={handleChange}
/>

        <br />
        <br />

        <button
  type="submit"
  className="bg-green-500 text-white px-5 py-2 rounded-xl mt-4 hover:bg-green-600 transition"
>
  Add Note
</button>

      </form>

      <hr />
       
   <input
  type="text"
  className="w-full p-3 rounded-xl border shadow-sm"
  placeholder="Search notes..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

<br />
<br />

    <div className="bg-white p-4 rounded-xl shadow-md mt-6">
  <h3>📊 Dashboard</h3>

  <p>Total Notes: {totalNotes}</p>

  <p>
    Mode: {darkMode ? "🌙 Dark" : "☀ Light"}
  </p>
</div>

           <h2>Your Notes</h2>

      {notes.filter((note) =>
        note.title.toLowerCase().includes(search.toLowerCase())
      ).length === 0 ? (

        <div className="empty-box">

          <h3>No notes found 🚀</h3>

          <p>Create a new note!</p>

        </div>

      ) : (

        notes
        .sort((a, b) => b.isPinned - a.isPinned)
        .filter((note) =>
            note.title.toLowerCase().includes(search.toLowerCase())
          )
          .map((note) => (

           <div key={note._id} className={`p-5 rounded-2xl shadow-md mb-5 border-l-4 ${ note.pinned
            ? "border-yellow-500 bg-yellow-50"
            : "border-blue-500 bg-white"
           }`} >

              <h3> {note.isPinned && "📌 "} {note.title} </h3>

              <p>{note.content}</p>

              <p className="note-date">
           📅 {new Date(note.createdAt).toLocaleString()}
              </p>

              <button
              onClick={() => handleDelete(note._id)}
               className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2" >
               Delete
              </button>

              <button
             onClick={() =>
              handlePin(note._id, note.isPinned)
              }
               className="bg-yellow-500 text-white px-4 py-2 rounded-lg mr-2" >
             {note.isPinned ? "📌 Unpin" : "📍 Pin"}
             </button>

              <button
                onClick={() => {

                  setNoteData({
                    title: note.title,
                    content: note.content,
                  });

                  setEditId(note._id);

                }} className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Edit
              </button>

              <hr />

            </div>

          ))

      )}

    </div>
  );
}

export default Home;