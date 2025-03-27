import React from 'react'
import noDataImage from '../assets/no-data-found.png'

const NoData = () => {
  return (
    <div className="flex items-center justify-center p-4 gap-2 select-none">
      <img src={noDataImage} alt="no data" className="w-36" />
      <p>No Data</p>
    </div>
  );
}

export default NoData