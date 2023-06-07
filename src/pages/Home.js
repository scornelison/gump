import supabase from "../config/supabaseClients";

import React, { useState, useEffect } from "react";

// import { createClient } from "@supabase/supabase-js";

//comp
import NoteCard from "../components/NoteCard";

const Home = () => {
  const [fetchError, setFetchError] = useState(null);
  const [notes, setNotes] = useState(null);
  const [orderBy, setOrderBy] = useState("created_at");

  const handleDelete = (id) => {
    setNotes((prevNotes) => {
      return prevNotes.filter((nt) => nt.id !== id);
    });
  };

  useEffect(() => {
    const fetchNotes = async () => {
      const { data, error } = await supabase
        .from("notes")
        .select()
        .order(orderBy, { ascending: false });

      if (error) {
        setFetchError("Could Not Fetch Notes");
        setNotes(null);
        console.log(error);
      }
      if (data) {
        setNotes(data);
        setFetchError(null);
      }
    };
    fetchNotes();
  }, [orderBy]);
  console.log("home:", { notes });

  return (
    <div className="page home">
      {fetchError && <p>{fetchError}</p>}
      {notes && (
        <div className="note">
          <div className="order-by">
            <p>Order by:</p>
            <button onClick={() => setOrderBy("created_at")}>
              Time Created
            </button>
            <button onClick={() => setOrderBy("title")}>Title</button>
            {orderBy}
          </div>
          <div className="note-grid">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default Home;
