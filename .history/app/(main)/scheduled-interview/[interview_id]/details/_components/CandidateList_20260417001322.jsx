import React from 'react'

const CandidateList = ({ candidateList }) => {
  return (
    <div className=''>
        {candidateList.map((candidate, index) => (
            <div>
                <h2>{candidate.user}</h2>
            </div>
        ))}
    </div>
  )
}

export default CandidateList