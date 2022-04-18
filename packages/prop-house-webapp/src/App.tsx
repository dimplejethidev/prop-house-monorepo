import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/css/globals.css';
import Auction from './components/pages/Auction';
import NavBar from './components/NavBar';
import Home from './components/pages/Home';
import Learn from './components/pages/Learn';
import Create from './components/pages/Create';
import NotFound from './components/pages/NotFound';
import Proposal from './components/pages/Proposal';
import Footer from './components/Footer';
import { Container } from 'react-bootstrap';
import './App.css';
import { useAppDispatch, useAppSelector } from './hooks';
import { StoredAuction } from '@nouns/prop-house-wrapper/dist/builders';
import { addAuctions } from './state/slices/propHouse';
import { Mainnet, DAppProvider, Config, useEthers } from '@usedapp/core';
import { PropHouseWrapper } from '@nouns/prop-house-wrapper';
import { useEffect, useRef } from 'react';
import Upload from './components/pages/Upload';
import FAQ from './components/pages/FAQ';

const config: Config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]:
      'https://mainnet.infura.io/v3/0be66e03abae4c0583466f8bc3d003a4',
  },
  autoConnect: false,
};

function App() {
  const dispatch = useAppDispatch();
  const { library: provider } = useEthers();
  const backendHost = useAppSelector(
    (state) => state.configuration.backendHost
  );
  const backendClient = useRef(
    new PropHouseWrapper(backendHost, provider?.getSigner())
  );

  useEffect(() => {
    backendClient.current = new PropHouseWrapper(
      backendHost,
      provider?.getSigner()
    );
  }, [provider, backendHost]);

  // Fetch initial auctions
  backendClient.current
    .getAuctions()
    .then((auctions: StoredAuction[]) => dispatch(addAuctions(auctions)));

  return (
    <DAppProvider config={config}>
      <Container>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/auction/:id" element={<Auction />} />
          <Route path="/proposal/:id" element={<Proposal />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </Container>
    </DAppProvider>
  );
}

export default App;