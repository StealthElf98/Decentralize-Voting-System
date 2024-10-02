import React, { useEffect, useState } from 'react'
import './VoterPage.css'
import { getAllCandidates, getElectionDates, vote } from '../../scripts/script' // Import your script functions
import { useNavigate } from 'react-router'

type Candidate = {
  id: string
  name: string
  lastName: string
  party: string
  votes: number
}

const VoterPage: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [electionOver, setElectionOver] = useState(false);
  const [winner, setWinner] = useState<Candidate | null>(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidatesAndCheckElection = async () => {
      try {
        const candidateData = await getAllCandidates();
        setCandidates(candidateData);

        const dates = await getElectionDates();
        if (dates) {
          const { endTime } = dates;
          const currentTime = Math.floor(Date.now() / 1000);

          if (currentTime >= endTime) {
            setElectionOver(true);
            determineWinner(candidateData);
          }
        }
      } catch (error) {
        console.error('Error fetching candidates or election dates:', error);
      }
    };

    fetchCandidatesAndCheckElection();
  }, []);

  const determineWinner = (candidateData: Candidate[]) => {
    if (candidateData.length > 0) {
      const winnerCandidate = candidateData.reduce((prev, curr) => (prev.votes > curr.votes ? prev : curr));
      setWinner(winnerCandidate);
    }
  };

  const handleVote = async (candidateId: string) => {
    try {
      console.log('ID: ' + candidateId);
      await vote(parseInt(candidateId));
      setSelectedCandidate(candidateId);
      await getAllCandidates();
      window.location.reload();
    } catch (error) {
      console.error('Error casting vote:', error);
      alert('Failed to cast vote.');
    }
  };

  const handleLogout = () => {
    navigate('/');
  };
  return (
    <div className="main-container">
      <div className="voter-page">
        <h1>Vote for Your Favorite Candidate</h1>
        <div className="candidate-list">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="candidate-card">
              <img
                src={require(`../../assets/${candidate.id.toString()}.jpg`)}
                alt={`${candidate.name} ${candidate.lastName}`}
                className="candidate-image"
              />
              <div className="candidate-details">
                <h2>
                  {candidate.name} {candidate.lastName}
                </h2>
                <p>{candidate.party}</p>
                <p>Votes: {candidate.votes.toString()}</p>
              </div>
              <button
                className="vote-button"
                onClick={() => handleVote(candidate.id)}
                disabled={selectedCandidate === candidate.id || electionOver}
              >
                {selectedCandidate === candidate.id ? 'Voted' : 'Vote'}
              </button>
            </div>
          ))}
        </div>
        <div className="winner">
          {electionOver && winner && (
            <div className="winner-announcement">
              <h2>
                Candidate {winner.name} {winner.lastName} won the election with {winner.votes.toString()} votes!
              </h2>
            </div>
          )}
        </div>
      </div>
      <button className="logout-button-v" onClick={handleLogout}>
        Logout
      </button>
    </div>
  )
}

export default VoterPage
