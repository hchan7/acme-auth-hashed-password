import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { destroyNote } from './store';

const Notes = () => {
  const { notes, auth } = useSelector(state => state); 
  const dispatch = useDispatch();
  const filteredNotes = notes.filter(note => note.userId === auth.id);
  
  const destroy = note => {
    //note.userId = null;
    dispatch(destroyNote(note));
  };
  
  return (
    <div>
      <ul>
      {
        filteredNotes.map(note => {
          return(
            <li key={ note.id }>
              {note.content}
              <button onClick={ ev => destroy(note) }>X</button>
            </li>
            )
          }
        )
      }
      </ul>
    </div>
    
    );
};

export default Notes;