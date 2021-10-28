import React, {useEffect, useState} from 'react';
import './index.scss';

function Demo() {
const [notes, setNotes]= useState<string[]>([""])

useEffect(() => {
  document.getElementById("note" + (notes.length - 1))?.focus()
}, [notes.length]);


function addNewNote(){
  setNotes([...notes, ""])
}

function handleBlur(noteIndex: number, e: any){
  const newNotes: string[] = [...notes]
  newNotes[noteIndex] = e.target.value;
  setNotes(newNotes)
}

function deleteNote(noteIndex: number){
  let newNotes = [...notes]
  newNotes.splice(noteIndex, 1)
  setNotes(newNotes)
}

  return (
    <div className="demo">
      <div className="container">
      <div className="new_note" onClick={addNewNote}>+   New note</div>
      <hr/>
      {notes.map((note, index) => (
        <div className="note"  key={"note" + index}        >
          <span onClick={(e)=>{deleteNote(index)}}>x</span>
        <textarea
          id={"note" + index}
          onChange={(e)=>{handleBlur(index, e)}}
          placeholder="Type here..."
          value={note}
        />
        </div>
      ))}
      </div>
    </div>
  );
}

export default Demo;
