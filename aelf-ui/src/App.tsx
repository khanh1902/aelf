import { Fragment, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { IPortkeyProvider } from '@portkey/provider-types';

import ProfilePage from './pages/profile';
import Header from './components/layout/header';
import HomePage from './pages/home';
import './app.scss';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PurchaseItems from './pages/purchase-items';

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentWalletAddress, setCurrentWalletAddress] = useState<string>();
  const [provider, setProvider] = useState<IPortkeyProvider | null>(null);

  return (
    <div className='app-layout'>
      <ToastContainer />
      <Header
        isConnected={isConnected}
        currentWalletAddress={currentWalletAddress}
        setIsConnected={setIsConnected}
        setCurrentWalletAddress={setCurrentWalletAddress}
        setProvider={setProvider}
        provider={provider}
      />
      <Routes>
        <Route path='/' element={<HomePage provider={provider} currentWalletAddress={currentWalletAddress} />} />
        {isConnected && currentWalletAddress && (
          <Fragment>
            <Route path='/profile' element={<ProfilePage provider={provider} currentWalletAddress={currentWalletAddress} />} />

            <Route path='/purchase-items' element={<PurchaseItems provider={provider} currentWalletAddress={currentWalletAddress} />} />
          </Fragment>
        )}
      </Routes>
    </div>
  );
};

export default App;
