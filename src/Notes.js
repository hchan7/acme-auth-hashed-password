import React from 'react';
import {useSelector} from 'react-redux';

const Notes = () => {
  const { notes, auth } = useSelector(state => state); 
  
  const filteredNotes = notes.filter(note => note.userId === auth.id);
  return (
    <div>
      <ul>
      {
        filteredNotes.map(note => {
          return(
            <li key={ note.id }>{note.content}</li>
            )
          }
        )
      }
      </ul>
    </div>
    
    );
};

export default Notes;