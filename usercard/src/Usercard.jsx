import React, { useState } from 'react';

const UserCard = ({ name, avatar, posts, followers, address }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(followers);

  const toggleFollow = () => {
    if (isFollowing) {
      setFollowerCount(prev => prev - 1);
    } else {
      setFollowerCount(prev => prev + 1);
    }
    setIsFollowing(prev => !prev);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      border: '1px solid black',
      padding: '20px',
      maxWidth: '600px',
      marginTop: '20px'
    }}>
      {/* Avatar */}
      <img 
        src={avatar} 
        alt={name} 
        style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          marginRight: '30px',
          border: '2px solid black',
        }}
      />

      {/* Info Section */}
      <div style={{ flex: 1 }}>
        <h2 style={{ margin: 0 }}>{name}</h2>
        <p style={{ margin: '5px 0 15px' }}>{address}</p>

        {/* Posts & Followers Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '250px',
          marginBottom: '15px'
        }}>
          <div>
            <h3 style={{ margin: 0 }}>Posts</h3>
            <p style={{ margin: 0 }}>{posts}</p>
          </div>
          <div>
            <h3 style={{ margin: 0 }}>Followers</h3>
            <p style={{ margin: 0 }}>{followerCount}</p>
          </div>
        </div>

        {/* Follow Button */}
        <button 
          onClick={toggleFollow}
          style={{
            padding: '8px 20px',
            borderRadius: '8px',
            border: '1px solid black',
            cursor: 'pointer'
          }}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      </div>
    </div>
  );
};

export default UserCard;
