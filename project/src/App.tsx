import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import LoginForm from './components/LoginForm';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import StudentDetails from './components/StudentDetails';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/" element={<Navigate to="/students" replace />} />
            <Route
              path="/students"
              element={
                <PrivateRoute>
                  <StudentList />
                </PrivateRoute>
              }
            />
            <Route
              path="/students/add"
              element={
                <PrivateRoute>
                  <StudentForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/students/:id"
              element={
                <PrivateRoute>
                  <StudentDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/students/:id/edit"
              element={
                <PrivateRoute>
                  <StudentForm />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;