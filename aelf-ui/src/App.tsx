import { Fragment, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { IPortkeyProvider } from '@portkey/provider-types';

import ProfilePage from './pages/profile';
import Header from './components/layout/header';
import HomePage from './pages/home';
import './app.scss';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SetAdminWallet from './pages/set-admin-wallet';
import GetOwner from './pages/get-owner';
import GetBalanceOf from './pages/get-balance-of';
import AddPaymentToken from './pages/add-payment-token';
import RemovePaymentToken from './pages/remove-payment-token';
import AddItems from './pages/add-items';
import PurchaseItems from './pages/purchase-items';
import RemoveItems from './pages/remove-items';
import TransferOwnerShip from './pages/transfer-owner-ship';
import AvailablePaymentToken from './pages/available-payment-token';
import AvailableItems from './pages/available-items';
import GetAdminWallet from './pages/get-admin-wallet';

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
            <Route path='/set-admin-wallet' element={<SetAdminWallet provider={provider} currentWalletAddress={currentWalletAddress} />} />
            <Route path='/get-owner' element={<GetOwner provider={provider} currentWalletAddress={currentWalletAddress} />} />
            <Route path='/get-balance-of' element={<GetBalanceOf provider={provider} currentWalletAddress={currentWalletAddress} />} />
            <Route path='/add-payment-token' element={<AddPaymentToken provider={provider} currentWalletAddress={currentWalletAddress} />} />
            <Route path='/remove-payment-token' element={<RemovePaymentToken provider={provider} currentWalletAddress={currentWalletAddress} />} />
            <Route path='/add-items' element={<AddItems provider={provider} currentWalletAddress={currentWalletAddress} />} />
            <Route path='/remove-items' element={<RemoveItems provider={provider} currentWalletAddress={currentWalletAddress} />} />
            <Route path='/transfer-owner-ship' element={<TransferOwnerShip provider={provider} currentWalletAddress={currentWalletAddress} />} />
            <Route path='/available-payment-token' element={<AvailablePaymentToken provider={provider} currentWalletAddress={currentWalletAddress} />} />
            <Route path='/available-items' element={<AvailableItems provider={provider} currentWalletAddress={currentWalletAddress} />} />
            <Route path='/get-admin-wallet' element={<GetAdminWallet provider={provider} currentWalletAddress={currentWalletAddress} />} />
          </Fragment>
        )}
      </Routes>
    </div>
  );
};

export default App;
