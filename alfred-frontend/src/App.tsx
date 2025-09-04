import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { store } from './store';
import CommandCentre from './pages/CommandCentre';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<CommandCentre />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
