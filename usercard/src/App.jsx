import React from 'react';
import Title from './Title';
import UserCard from './Usercard';
import avatarImage from './assets/react.svg'; // make sure this image exists

const App = () => {
  return (
    <div style={{ padding: '30px' }}>
      <Title />
      <UserCard
        name="Chrisse"
        avatar={avatarImage}
        posts={1841}
        followers={66868}
        address="4018 Sachs Trail"
      />
    </div>
  );
};

export default App;
