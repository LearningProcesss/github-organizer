import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import GitHubWatching from './components/GitHubWatching';
import GitHubClassificationAdmin from './components/GitHubClassificationAdmin';

function App() {
  return (
    <div className="App">
      <Header />
      {/* <GitHubWatching /> */}
      <GitHubClassificationAdmin classificationPanel={true}/>
    </div>
  );
}

export default App;
