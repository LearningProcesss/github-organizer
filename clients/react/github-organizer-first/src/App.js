import React, { useContext } from 'react';
// import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import GitHubClassificationAdmin from './components/GitHubClassificationAdmin';
import SnackOperation from './components/SnackOperation';
import { appReducer, initialState } from './lib/reducer';

const Context = React.createContext()

function App() {

  const [state, dispacth] = React.useReducer(appReducer, initialState)

  const [showModalNewClass, setShowModalNewClass] = React.useState(false)

  const [snack, setSnackBarModel] = React.useState({
    message: '',
    show: false,
    model: {}
  })

  const onShowSnackBar = (eventSnackState) => {
    console.log('onShowSnackBar', eventSnackState);

    setSnackBarModel({
      show: true,
      ...eventSnackState
    })
  }

  const onCreateNewClassification = () => {
    console.log('onCreateNewClassification');

    setShowModalNewClass(true)
  }

  return (
    <Context.Provider value={dispacth}>
      <div className="App">
        <Header handlerCreateNewClassification={onCreateNewClassification} />
        <SnackOperation open={snack.show} message={snack.message} variant={snack.variant} />
        <GitHubClassificationAdmin handlerShowSnackBar={onShowSnackBar} classificationPanel={true} />
      </div>
    </Context.Provider>
  );
}

export default App;
