import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, User, Mail, Phone, MapPin, GraduationCap, Hash, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchStudents, deleteStudent } from '../store/slices/studentSlice';

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { students, loading, error } = useAppSelector((state) => state.students);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const student = students.find(s => s.id === parseInt(id));

  useEffect(() => {
    if (students.length === 0) {
      dispatch(fetchStudents());
    }
  }, [dispatch, students.length]);

  const handleDelete = () => {
    if (student) {
      dispatch(deleteStudent(student.id));
      navigate('/students');
    }
  };

  if (loading && !student) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Not Found</h2>
          <p className="text-gray-600 mb-6">The student you're looking for doesn't exist or may have been deleted.</p>
          <Link
            to="/students"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Students</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/students')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Details</h1>
              <p className="text-gray-600">View and manage student information</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Link
              to={`/students/${student.id}/edit`}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{student.name}</h2>
              <p className="text-blue-100">Student ID: {student.rollNumber}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-white bg-opacity-20 text-white text-sm rounded-full">
                {student.class}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <Hash className="w-5 h-5 text-gray-400" />
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Roll Number</h3>
                </div>
                <p className="text-lg font-mono text-gray-900">{student.rollNumber}</p>
              </div>

              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <GraduationCap className="w-5 h-5 text-gray-400" />
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Class</h3>
                </div>
                <p className="text-lg text-gray-900">{student.class}</p>
              </div>

              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Email</h3>
                </div>
                <p className="text-lg text-gray-900">{student.email}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Phone</h3>
                </div>
                <p className="text-lg text-gray-900">{student.phone}</p>
              </div>

              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Address</h3>
                </div>
                <p className="text-lg text-gray-900 leading-relaxed">{student.address}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Student record created and maintained in the system
            </p>
            <div className="flex space-x-3">
              <Link
                to={`/students/${student.id}/edit`}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Edit Information
              </Link>
              <Link
                to="/students"
                className="text-gray-600 hover:text-gray-700 text-sm font-medium"
              >
                Back to List
              </Link>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Confirm Delete</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete <strong>{student.name}</strong>? This action cannot be undone and will permanently remove all student data.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Delete Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDetails;