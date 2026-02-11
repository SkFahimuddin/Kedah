import React from 'react';
import { useParams } from 'react-router-dom';

const ComplaintDetails = () => {
  const { id } = useParams();
  
  return (
    <div>
      <h1 className="text-2xl font-bold">Complaint Details</h1>
      <p>Viewing complaint: {id}</p>
      {/* Implement full complaint details view */}
    </div>
  );
};

export default ComplaintDetails;
