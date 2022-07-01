import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useObserver } from 'mobx-react-lite';
import { ToastContainer } from 'react-toastify';
import SearchBar from '../SearchBar/SearchBar';
import AccountView from '../AccountView/AccountView';
import Message from '../Message/Message';
import { useStores } from '../store';
import './App.css';

import ShenImage from '../../../assets/notificon.jpg';
import LogoImage from '../../../assets/logo.svg';
import BgImage from '../../../assets/dcbd2fq-c957f7c3-e5a2-40f4-a886-31852245df63.png';

const Home = () => {
  const Store = useStores();
  const [isHomeClass, setIsHomeClass] = useState('active');

  useEffect(() => {
    setIsHomeClass(Store.currentView == 'home' ? 'active' : '');
  });

  return useObserver(() => {
    return (
      <div className="Home">
        <div className="titleBar" />

        <img src={LogoImage} className={`introLogo ${isHomeClass}`} />

        <div className="homeContent">
          <div className={`shenIntro ${isHomeClass}`}>
            <Message
              message="Hey you, what can I help with?"
              img={ShenImage}
              side="left"
              person="Shen"
            />
          </div>
          <SearchBar />
        </div>

        <div className="mainContainer">
          <div
            className={`accountContainer ${
              Store.currentView == 'account' ? 'active' : ''
            }`}
          >
            <AccountView />
          </div>
        </div>

        <img src={BgImage} className="bgImage" />

        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={true}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    );
  });
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
