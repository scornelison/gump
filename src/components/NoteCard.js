import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import supabase from "../config/supabaseClients";

const NoteCard = ({ note, onDelete }) => {
  const [showError, showErrorSet] = useState(null);
  const handleDelete = async () => {
    const { data, error } = await supabase
      .from("notes")
      .delete()
      .eq("id", note.id);
    console.log({ data, error });

    if (error) {
      // TODO: add "error" info to UI
      console.log(error);
      showErrorSet(true);
      return;
    }

    console.log(data);
    onDelete(note.id);
  };

  return (
    <div className="note-card">
      <h3>{note.title}</h3>
      <div>
        {note.method.split("\n").map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
      </div>
      <div className="buttons">
        <Link to={"/" + note.id}>
          <i className="material-icons">edit</i>
        </Link>
        <i className="material-icons" onClick={handleDelete}>
          delete
        </i>
        {showError ? "ERROR" : null}
      </div>
    </div>
  );
};

export default NoteCard;
