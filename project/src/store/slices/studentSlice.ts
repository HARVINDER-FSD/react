import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Student {
  id: number;
  name: string;
  rollNumber: string;
  class: string;
  email: string;
  phone: string;
  address: string;
}

interface StudentState {
  students: Student[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  sortBy: 'name' | 'rollNumber' | 'class';
  sortOrder: 'asc' | 'desc';
  filterBy: string;
}

const initialState: StudentState = {
  students: [],
  loading: false,
  error: null,
  searchTerm: '',
  sortBy: 'name',
  sortOrder: 'asc',
  filterBy: '',
};

const API_BASE_URL = 'http://localhost:3001';

export const fetchStudents = createAsyncThunk(
  'students/fetchStudents',
  async () => {
    const response = await fetch(`${API_BASE_URL}/students`);
    if (!response.ok) {
      throw new Error('Failed to fetch students');
    }
    return response.json();
  }
);

export const addStudent = createAsyncThunk(
  'students/addStudent',
  async (student: Omit<Student, 'id'>) => {
    const response = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(student),
    });
    if (!response.ok) {
      throw new Error('Failed to add student');
    }
    return response.json();
  }
);

export const updateStudent = createAsyncThunk(
  'students/updateStudent',
  async (student: Student) => {
    const response = await fetch(`${API_BASE_URL}/students/${student.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(student),
    });
    if (!response.ok) {
      throw new Error('Failed to update student');
    }
    return response.json();
  }
);

export const deleteStudent = createAsyncThunk(
  'students/deleteStudent',
  async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete student');
    }
    return id;
  }
);

const studentSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'name' | 'rollNumber' | 'class'>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    setFilterBy: (state, action: PayloadAction<string>) => {
      state.filterBy = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch students';
      })
      .addCase(addStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students.push(action.payload);
      })
      .addCase(addStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add student';
      })
      .addCase(updateStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.students.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.students[index] = action.payload;
        }
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update student';
      })
      .addCase(deleteStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students = state.students.filter(s => s.id !== action.payload);
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete student';
      });
  },
});

export const { setSearchTerm, setSortBy, setSortOrder, setFilterBy, clearError } = studentSlice.actions;
export default studentSlice.reducer;