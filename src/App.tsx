import React, { useEffect, useState } from "react";
import "./index.scss";

type NoteType = {
  id: number;
  content: string;
};

function Demo() {
  const [notes, setNotes] = useState<NoteType[]>([]);

  useEffect(() => {
    fetch(process["env"]["REACT_APP_API_ROOT"] + "/demo/")
      .then((res) => res.json())
      .then((notes: NoteType[]) => {
        setNotes(notes);
      })
      .catch(console.log);
  }, []);

  useEffect(() => {
    document.getElementById("note" + (notes.length - 1))?.focus();
  }, [notes.length]);

  function addNewNote() {
    fetch(process["env"]["REACT_APP_API_ROOT"] + "/demo/add")
      .then((res) => res.json())
      .then((id: number) => {
        setNotes([...notes, { id, content: "" }]);
      })
      .catch(console.log);
  }

  function handleChange(noteIndex: number, e: any) {
    let newNotes = [...notes];
    newNotes[noteIndex].content = e.target.value;
    setNotes(newNotes);
  }

  function saveChanges(note: NoteType) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: note.content, id: note.id }),
    };
    fetch(
      process["env"]["REACT_APP_API_ROOT"] + "/demo/update",
      requestOptions
    ).catch(console.log);
  }

  function deleteNote(noteIndex: number, noteID: number) {
    fetch(process["env"]["REACT_APP_API_ROOT"] + "/demo/delete/" + noteID, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((result: boolean) => {
        if (result) {
          let newNotes = [...notes];
          newNotes.splice(noteIndex, 1);
          setNotes(newNotes);
        }
      })
      .catch(console.log);
  }

  return (
    <div className="demo">
      <div className="container">
        <div className="new_note" onClick={addNewNote}>
          + New note
        </div>
        <hr />
        {notes.map((note, index) => (
          <div className="note" key={note.id}>
            <span
              onClick={(e) => {
                deleteNote(index, note.id);
              }}
            >
              x
            </span>
            <textarea
              id={"note" + index}
              onChange={(e) => {
                handleChange(index, e);
              }}
              onBlur={() => {
                saveChanges(note);
              }}
              placeholder="Type here..."
              value={note.content}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Demo;
