import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import GitHubClassificationAdmin from './components/GitHubClassificationAdmin';
import SnackOperation from './components/SnackOperation';

function App() {

  // const [snackDto, setSnackModel] = React.useState({})

  const [showModalNewClass, setShowModalNewClass] = React.useState(false)

  const [snack, setSnackBarModel] = React.useState({
    message: '',
    show: false,
    model: {}
  })

  const onShowSnackBar = (eventSnackState) => {
    console.log('onShowSnackBar', eventSnackState);

    // setSnackModel(eventSnackState)

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
    <div className="App">
      <Header handlerCreateNewClassification={onCreateNewClassification} />
      <SnackOperation open={snack.show} message={snack.message} variant={snack.variant} />
      <GitHubClassificationAdmin handlerShowSnackBar={onShowSnackBar} classificationPanel={true} />
    </div>
  );
}

export default App;
