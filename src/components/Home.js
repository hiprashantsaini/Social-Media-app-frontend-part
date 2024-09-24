import React from 'react';
import Body from './Body';
import CoverPage from './CoverPage';
import Header from './Header';

function Home() {
 
  return (
    <div className='home'>
       <Header/>
       <CoverPage/>
       <Body/>
    </div>
  )
}

export default Home