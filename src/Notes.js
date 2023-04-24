import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { destroyNote, createNote } from './store';

const Notes = () => {
  const { notes, auth } = useSelector(state => state); 
  const dispatch = useDispatch();
  const filteredNotes = notes.filter(note => note.userId === auth.id);
  const [content, setContent] = useState('');
  console.log('auth: ',auth);

  const destroy = note => {
    dispatch(destroyNote(note));
  };
  
  const create = async(ev) =>{
    ev.preventDefault();
    try{
      console.log('notes:',notes);
      await dispatch(createNote({ content, userId: auth.id }));
      console.log('notes:',notes);
      setContent('');
    }
    catch(ex){
      console.log(ex);
    }
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
      <form onSubmit={ create }>
        <input value={ content } onChange={ ev => setContent(ev.target.value) } placeholder='note' />
        <button>Create</button>
      </form>
    </div>
    
    );
};

export default Notes;