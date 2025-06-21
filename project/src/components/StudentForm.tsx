import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User, Mail, Phone, MapPin, GraduationCap, Hash, Save, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { addStudent, updateStudent, fetchStudents } from '../store/slices/studentSlice';
import { Student } from '../store/slices/studentSlice';

const StudentForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { students, loading, error } = useAppSelector((state) => state.students);

  const isEditing = !!id;
  const existingStudent = isEditing ? students.find(s => s.id === parseInt(id!)) : null;

  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    class: '',
    email: '',
    phone: '',
    address: '',
  });

  const [errors, setErrors] = useState<Partial<typeof formData>>({});

  useEffect(() => {
    if (isEditing && students.length === 0) {
      dispatch(fetchStudents());
    }
  }, [dispatch, isEditing, students.length]);

  useEffect(() => {
    if (existingStudent) {
      setFormData({
        name: existingStudent.name,
        rollNumber: existingStudent.rollNumber,
        class: existingStudent.class,
        email: existingStudent.email,
        phone: existingStudent.phone,
        address: existingStudent.address,
      });
    }
  }, [existingStudent]);

  const validateForm = () => {
    const newErrors: Partial<typeof formData> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.rollNumber.trim()) newErrors.rollNumber = 'Roll number is required';
    if (!formData.class.trim()) newErrors.class = 'Class is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    // Check for duplicate roll number
    const duplicateRoll = students.find(s => 
      s.rollNumber === formData.rollNumber && (!isEditing || s.id !== parseInt(id!))
    );
    if (duplicateRoll) {
      newErrors.rollNumber = 'Roll number already exists';
    }

    // Check for duplicate email
    const duplicateEmail = students.find(s => 
      s.email === formData.email && (!isEditing || s.id !== parseInt(id!))
    );
    if (duplicateEmail) {
      newErrors.email = 'Email already exists';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (isEditing && existingStudent) {
        await dispatch(updateStudent({ ...existingStudent, ...formData })).unwrap();
      } else {
        await dispatch(addStudent(formData)).unwrap();
      }
      navigate('/students');
    } catch (error) {
      console.error('Failed to save student:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/students')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Edit Student' : 'Add New Student'}
            </h1>
            <p className="text-gray-600">
              {isEditing ? 'Update student information' : 'Enter student details to add to the system'}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter student's full name"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Roll Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Hash className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="rollNumber"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.rollNumber ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter roll number"
                />
              </div>
              {errors.rollNumber && <p className="mt-1 text-sm text-red-600">{errors.rollNumber}</p>}
            </div>

            <div>
              <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-2">
                Class *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="class"
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.class ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a class</option>
                  <option value="9th Grade">9th Grade</option>
                  <option value="10th Grade">10th Grade</option>
                  <option value="11th Grade">11th Grade</option>
                  <option value="12th Grade">12th Grade</option>
                </select>
              </div>
              {errors.class && <p className="mt-1 text-sm text-red-600">{errors.class}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter phone number"
                />
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <div className="relative">
                <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                    errors.address ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter complete address"
                />
              </div>
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/students')}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : isEditing ? 'Update Student' : 'Add Student'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;