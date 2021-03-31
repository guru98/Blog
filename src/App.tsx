import  { useState,useEffect } from 'react';
import {createStore,applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import {reducer} from './core/reducers';
import thunk from 'redux-thunk';
import {  loadTheme, initializeIcons } from '@fluentui/react';
import {utils} from './Utils/Utils';
import {v1 as createGUID} from 'uuid';
import './App.css';
import HomeScreen from './components/HomeScreen';
import ConfigurationScreen from './containers/Configuration';
import GroupCall from './containers/GroupCall';
import EndCall from './components/EndCall';

const sdkVersion = require('../package.json').dependencies['@azure/communication-calling'];
const lastUpdate = `Last Update ${utils.getBuildTime()} with @azure/communication-calling :${sdkVersion}`;

loadTheme({});
initializeIcons();

const store = createStore(reducer,applyMiddleware(thunk));
const App = () => {
  const [page,setPage] = useState('home');
  const [groupId, setGroupId] = useState('');
  const [dispName,setDispName] = useState('');
  const [screenWidth,setScreenWidth] = useState(0);
  useEffect(() => {
    const SetWindowsWidth = () => {
      const width = typeof window !== undefined ? window.innerWidth : 0;
      setScreenWidth(width);      
    };
    SetWindowsWidth();
    window.addEventListener('resize',SetWindowsWidth);
    return () => window.removeEventListener('resize',SetWindowsWidth);
  },[]);

  const getGroupIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('groupId');
  };

  const getUserDisplayNameFromUrl = () =>{
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('userName');
  }

  const getGroupId = () => {
    if (groupId) return groupId;
    const uri_gid = getGroupIdFromUrl();
    const gid = uri_gid == null || uri_gid === '' ? createGUID() : uri_gid;
    console.log('The group id is ' + gid);
    setGroupId(gid);
    return gid;
  };

  const getUserDisplayName = () =>{
    if(dispName) return dispName;
    const uri_dispName = getUserDisplayNameFromUrl();
    const usrName = uri_dispName == null || uri_dispName === '' ? 'user' + Math.ceil(Math.random() * 1000) : uri_dispName;   
    setDispName(usrName);
    console.log('The User Display Name is ' + usrName);
    return usrName;
  }

  const getContent = () => {
    if (page === 'home') {
      return (
        <HomeScreen
          startCallHandler={() => {
            window.history.pushState({}, document.title, window.location.href.split("?")[0] + '?groupId=' + getGroupId() +',userName=' + getUserDisplayName());
          }}       
          screenWidth={screenWidth}
        />
      );
    } else if (page === 'configuration') {
      return (
        <ConfigurationScreen
          startCallHandler={() => setPage('call')}
          unsupportedStateHandler={() => setPage('error')}
          endCallHandler={() => setPage('endCall')}
          groupId={getGroupId()}
          userName={getUserDisplayName()}
          screenWidth={screenWidth}
        />
      );
    }else if (page === 'call') {
      return (
        <GroupCall
          endCallHandler={() => setPage('endCall')}
          groupId={getGroupId()}
          screenWidth={screenWidth}
        />
      );
    }else if (page === 'endCall') {
      return (
        <EndCall
          message={ store.getState().calls.attempts > 3 ? 'Unable to join the call' : 
          'You left the call'}
          rejoinHandler={() => {
            window.location.href = window.location.href;
          }}
          homeHandler={() => {
            window.location.href = window.location.href.split('?')[0];
          }}
        />
      );
        }
    else {
      // page === 'error'
      window.document.title = 'Unsupported browser';
      return (
        <>
          <a href="https://docs.microsoft.com/en-us/azure/communication-services/concepts/voice-video-calling/calling-sdk-features#calling-client-library-browser-support">Learn more</a>&nbsp;about
          browsers and platforms supported by the web calling sdk
        </>
      );
    }
  };

  
  if (getGroupIdFromUrl() && page === 'home') {
    setPage('configuration');
  }

  return <Provider store={store}>{getContent()}</Provider>;
};

window.setTimeout(() => {
  try {
    console.log(`Azure Communication Services sample group calling app: ${lastUpdate}`);
  } catch (e) {}
}, 0);

export default App;


