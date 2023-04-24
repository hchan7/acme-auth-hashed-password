import { createStore, combineReducers, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk'
import axios from 'axios';

const products = (state = [], action)=> {
  if(action.type === 'SET_PRODUCTS'){
    return action.products;
  }
  return state;
};

const auth = (state = {}, action)=> {
  if(action.type === 'SET_AUTH'){
    return action.auth;
  }
  return state;
};

//
const notes = (state = [], action) => {
  if(action.type === 'SET_NOTES'){
    return action.notes;
  }
  if(action.type === 'DESTROY_NOTE'){
    return state.filter(note => note.id !== action.note.id);
  }
  return state;
};
export const fetchProducts = ()=> {
  return async(dispatch)=> {
    return dispatch({ type: 'SET_PRODUCTS', products: (await axios.get('/api/products')).data});
  };
};

//
export const fetchNotes = () => {
  return async(dispatch)=>{
    return dispatch({ type: 'SET_NOTES', notes: (await axios.get('/api/notes')).data });
  };
};

//
export const destroyNote = note => {
  return async(dispatch) => {
    await axios.delete(`/api/notes/${note.id}`);
    dispatch({ type: 'DESTROY_NOTE', note });
  };
};
export const loginWithToken = ()=> {
  return async(dispatch)=> {
    const token = window.localStorage.getItem('token');
    if(token){
      const response = await axios.get(`/api/auth/${token}`);
      dispatch({ type: 'SET_AUTH', auth: response.data });
    }
  };
};

export const logout = ()=> {
  return (dispatch)=> {
    window.localStorage.removeItem('token');
    dispatch({ type: 'SET_AUTH', auth: {} });
  };
};

export const login = (credentials)=> {
  return async(dispatch)=> {
    const response = await axios.post('/api/auth', credentials);
    const token = response.data.token;
    window.localStorage.setItem('token', token);
    dispatch(loginWithToken());
    //dispatch({ type: 'SET_AUTH', auth: response.data });
  };
};

export const register = (credentials)=> {
  return async(dispatch)=> {
    const response = await axios.post('/api/auth/register', credentials);
    const token = response.data.token;
    window.localStorage.setItem('token', token);
    dispatch(loginWithToken());
    //dispatch({ type: 'SET_AUTH', auth: response.data });
  };
};

const reducer = combineReducers({
  products,
  auth,
  notes //
});

const store = createStore(reducer, applyMiddleware(thunk, logger));


export default store;
