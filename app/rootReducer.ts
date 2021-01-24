import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
// eslint-disable-next-line import/no-cycle
import counterReducer from './components/counter/counterSlice';
import { ModalReduce } from './components/common/Modals';
import { HomeReducer } from './components/home/slice';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    counter: counterReducer,
    modals:ModalReduce,
    home:HomeReducer,
  });
}

