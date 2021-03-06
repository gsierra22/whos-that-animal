import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';
import store from '../store';

// worker Saga: will be fired on "FETCH_PETS" actions
function* fetchPets(action) {
  //console.log('Petstest')
  try {
    //console.log(action.payload)
      const pets = yield axios.get(`/api/pets/mypets/${action.payload}`);
      console.log('get pet:', pets.data);
      yield put({ type: 'SET_PETS', payload: pets.data });

  } catch (err) {
      console.log('get mypets error', err);
  }
      
}

function* fetchAll() {
  // get all pets from the DB
  try {
      const pets = yield axios.get(`/api/pets/all`);
      //console.log('get all:', pets);
      yield put({ type: 'SET_PETS', payload: pets.data });

  } catch {
      console.log('get all error');
  }
      
}



function *postPets( action ){
  //console.log( 'in *postSaga:', action );
  try {
    const response = yield axios.post('/api/pets', action.payload);
    yield put({type: 'FETCH_PETS', payload: store.user.id})
  } catch (err) {
      console.log('error:', err);
  }
}

function *removePets( action ){
  console.log( 'in *deleteSaga:', action.payload );
  try {
    const response = yield axios.delete(`/api/pets/delete/${action.payload}`);
    yield put({type: 'FETCH_PETS', payload: store.user.id})
  } catch (err) {
      console.log('error:', err);
  }
}

function* updateMissing(action){
console.log('in putSaga:', action.payload)
  try {
    const updatedTask = yield axios.put(`/api/pets/missing/${action.payload.id}?missing=${action.payload.missing}`);  
  } catch (err) {
    console.log('update error', error);
  } 
}

function* PetSaga() {
  yield takeLatest('FETCH_PETS', fetchPets)
  yield takeLatest('FETCH_ALL', fetchAll);
  yield takeLatest( 'ADD_PETS', postPets );
  yield takeLatest('REMOVE_PETS', removePets);
  yield takeLatest ('UPDATE_PETS', updateMissing)
}

export default PetSaga;
