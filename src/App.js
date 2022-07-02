import 'antd/dist/antd.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './screens/Homepage';
import Parking from './screens/Parking';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/parking/:name/:id" element={<Parking />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
