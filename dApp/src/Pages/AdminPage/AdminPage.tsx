import React, { useState, useEffect } from 'react'
import './AdminPage.css'
import { addCandidate, endElection, getAllCandidates, getElectionDates, startElection } from '../../scripts/script'
import { Navigate, useNavigate } from 'react-router'

const AdminPage: React.FC = () => {
  const [candidateName, setCandidateName] = useState('')
  const [candidateLastName, setCandidateLastName] = useState('')
  const [candidateParty, setCandidateParty] = useState('')
  const [startDateTime, setStartDateTime] = useState('')
  const [endDateTime, setEndDateTime] = useState('')
  const [candidates, setCandidates] = useState<string[]>([])
  const [countdown, setCountdown] = useState<number | null>(null)
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)
  const [isVotingStarted, setIsVotingStarted] = useState(false)
  const [isVotingEnded, setIsVotingEnded] = useState(false) // New state to track if voting has ended
  const navigate = useNavigate()

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (candidateName && candidateLastName && candidateParty) {
      try {
        await addCandidate(candidateName, candidateLastName, candidateParty)
        const fullName = `${candidateName} ${candidateLastName} (${candidateParty})`
        setCandidates([...candidates, fullName])
        setCandidateName('')
        setCandidateLastName('')
        setCandidateParty('')
        await fetchCandidates()
      } catch (error) {
        console.error('Error adding candidate:', error)
      }
    } else {
      alert("Please fill all candidate fields!")
    }
  }

  const fetchCandidates = async () => {
    const fetchedCandidates = await getAllCandidates()
    const candidateList = fetchedCandidates.map(
      (candidate: { name: string; lastName: string; party: string, votes: Number }) =>
        `${candidate.name} ${candidate.lastName} (${candidate.party}) Votes: ${candidate.votes}`
      )
    setCandidates(candidateList)
  }

  const handleSetDates = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('Start Date and Time:', startDateTime)
    console.log('End Date and Time:', endDateTime)

    const startTime = Math.floor(new Date(startDateTime).getTime() / 1000)
    const endTime = Math.floor(new Date(endDateTime).getTime() / 1000)
    const currentTime = Math.floor(Date.now() / 1000)
    
    if (startTime < currentTime) {
      alert('Start date must be in the future.')
      return
    }

    if (endTime <= startTime) {
      alert('End date must be later than the start date.')
      return
    }

    try {
      await startElection(startTime, endTime)
      setIsVotingStarted(true) // Disable inputs and start the countdown
      startCountdown(endTime)
      window.location.reload();
    } catch (error) {
      console.error('Error starting the election:', error)
    }
  }

  // Function to start the countdown based on endTime
  const startCountdown = (endTime: number) => {
    const duration = endTime - Math.floor(Date.now() / 1000)
    if (duration <= 0) {
      setIsVotingEnded(true)
      endElection()
      return
    }
    
    setCountdown(duration) // Set countdown to the calculated duration
    const id = setInterval(() => {
      setCountdown(prev => {
        if (prev === null ? 0 : prev <= 1) {
          clearInterval(id)
          setIsVotingEnded(true)
          endElection()
          return 0
        }
        return prev === null ? 0 : prev - 1 // Decrement countdown
      })
    }, 1000)
    setIntervalId(id) // Store the interval ID
  }

  const formatDateTimeLocal = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const formattedDate = date.toISOString().slice(0, 16); // This removes the milliseconds and the Z at the end
    return formattedDate;
  };

  // Format countdown into hours, minutes, and seconds
  const formatCountdown = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    return `${hours}h ${minutes}m ${secs}s`
  }

  useEffect(() => {
    // Fetch the election dates and set the countdown
    const fetchElectionDates = async () => {
      const dates = await getElectionDates()
      if (dates) {
        const { startTime, endTime } = dates
        const currentTime = Math.floor(Date.now() / 1000)
        
        setStartDateTime(formatDateTimeLocal(startTime));
        setEndDateTime(formatDateTimeLocal(endTime));

        if (currentTime < endTime) {
          setIsVotingStarted(true)
          startCountdown(endTime)
        } else {
          setIsVotingEnded(true)
        }
      }
    }

    if (candidates.length == 0)
      fetchCandidates()

    fetchElectionDates()

    // Cleanup the interval on component unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [intervalId])

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="main-container">
      <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="dashboard-container">
        {/* Left Side Form - Add Candidate */}
        <form className="candidate-form" onSubmit={handleAddCandidate}>
          <h2>Add Candidate</h2>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              disabled={isVotingStarted}
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              value={candidateLastName}
              onChange={(e) => setCandidateLastName(e.target.value)}
              disabled={isVotingStarted}
            />
          </div>
          <div className="form-group">
            <label>Party</label>
            <input
              type="text"
              value={candidateParty}
              onChange={(e) => setCandidateParty(e.target.value)}
              disabled={isVotingStarted}
            />
          </div>
          <button type="submit" className="submit-button" disabled={isVotingStarted}>Add Candidate</button>
        </form>

        {/* Right Side Form - Set Voting Date and Time */}
        <form className="date-form" onSubmit={handleSetDates}>
          <h2>Set Voting Dates and Times</h2>
          <div className="form-group">
            <label>Start Date and Time</label>
            <input
              type="datetime-local"
              value={startDateTime}
              onChange={(e) => setStartDateTime(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>End Date and Time</label>
            <input
              type="datetime-local"
              value={endDateTime}
              onChange={(e) => setEndDateTime(e.target.value)}
            />
          </div>
          <button type="submit" className="submit-button" disabled={isVotingStarted}>Start Vote</button>

          {/* Show countdown or voting ended message */}
          {isVotingEnded ? (
            <div className="countdown">
              <h3>Voting ended</h3>
            </div>
          ) : (
            countdown !== null && countdown > 0 && (
              <div className="countdown">
                <h3>Time left: {formatCountdown(countdown)}</h3>
              </div>
            )
          )}
        </form>
      </div>

      <div className="candidate-list">
        <ul>
          {candidates.map((candidate, index) => (
            <li key={index}>{candidate}</li>
          ))}
        </ul>
      </div>
    </div>
    <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
    
  )
}

export default AdminPage
