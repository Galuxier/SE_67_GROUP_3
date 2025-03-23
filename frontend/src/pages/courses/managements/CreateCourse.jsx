import React from 'react';
import CreateCourseForm from './CreateCourseForm';
import { useOutletContext } from 'react-router-dom';

const CreateCourse = () => {
  // Get gym data from the outlet context
  const { gymData } = useOutletContext() || {};

  return (
    <div className="p-4">
      <CreateCourseForm />
    </div>
  );
};

export default CreateCourse;