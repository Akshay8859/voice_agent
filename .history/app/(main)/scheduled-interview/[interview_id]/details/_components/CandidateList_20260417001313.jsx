import React from 'react'

const CandidateList = ({ candidateList }) => {
  return (
    <div className=''>
        {candidateList.map((candidate, index) => (
            <div>
                <h2></h2>
            </div>
        ))}
    </div>
  )
}

export default CandidateList