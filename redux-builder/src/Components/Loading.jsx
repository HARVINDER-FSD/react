import React from 'react';
import ReactLoading from 'react-loading';

const First = ({ type = 'spin', color = '#000' }) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <ReactLoading type={type} color={color} height={'20%'} width={'20%'} />
  </div>
);

export default First;
