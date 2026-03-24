// Application constants for resource types, branches, semesters, exam types, and years

export const RESOURCE_TYPES = [
  { value: 'notes', label: 'Notes' },
  { value: 'pyq', label: 'Previous Year Questions' },
  { value: 'syllabus', label: 'Syllabus' },
  { value: 'book', label: 'Book' },
  { value: 'other', label: 'Other' }
];

export const BRANCHES = [
  { value: 'CSE', label: 'Computer Science Engineering' },
  { value: 'ECE', label: 'Electronics and Communication' }
];

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export const EXAM_TYPES = [
  { value: 'mid1', label: 'Mid-1' },
  { value: 'mid2', label: 'Mid-2' },
  { value: 'end', label: 'End Semester' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'assignment', label: 'Assignment' }
];

export const YEARS = [2020, 2021, 2022, 2023, 2024, 2025];
