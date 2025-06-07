"use client"

import { useState, useEffect } from "react"
import Header from "../components/Common/Header"
import { useAuth } from "../features/auth/AuthContext"

// Helper functions for localStorage operations with error handling
const getStoredData = (key) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error)
    return []
  }
}

const setStoredData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error)
  }
}

// Games management
const getGameData = () => {
  return getStoredData("vyb_games")
}

const saveGameResult = (gameResult) => {
  const games = getGameData()
  const newResult = {
    id: `game_${Date.now()}`,
    ...gameResult,
    timestamp: new Date().toISOString(),
  }
  games.unshift(newResult)
  if (games.length > 100) games.splice(100) // Keep only last 100 results
  setStoredData("vyb_games", games)
  return newResult
}

export default function GamesPage() {
  const { user } = useAuth()
  const [activeGame, setActiveGame] = useState(null)
  const [gameResults, setGameResults] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [gameState, setGameState] = useState({})
  const [showGameModal, setShowGameModal] = useState(false)

  useEffect(() => {
    loadGameData()
  }, [])

  const loadGameData = () => {
    const results = getGameData().filter((game) => game.userId === user.uid)
    setGameResults(results)
  }

  const games = [
    {
      id: "truth-or-dare",
      title: "Truth or Dare",
      icon: "🎯",
      color: "#FF6B6B",
      description: "Play the classic game with friends",
      players: "2+ players",
    },
    {
      id: "roast-bot",
      title: "Roast Bot",
      icon: "🤖",
      color: "#4ECDC4",
      description: "Get playfully roasted by our AI",
      players: "Single player",
    },
    {
      id: "mood-battle",
      title: "Mood Battle",
      icon: "😎",
      color: "#45B7D1",
      description: "Compete with emoji moods",
      players: "2-8 players",
    },
    {
      id: "poll-games",
      title: "Poll Games",
      icon: "📊",
      color: "#96CEB4",
      description: "Create fun polls for friends",
      players: "3+ players",
    },
  ]

  const truthQuestions = [
    "What's the most embarrassing thing you've done?",
    "Who was your first crush?",
    "What's your biggest fear?",
    "Have you ever lied to your best friend?",
    "What's the weirdest dream you've had?",
    "If you could swap lives with anyone, who would it be?",
    "What's your most unpopular opinion?",
    "Have you ever broken the law?",
  ]

  const dareQuestions = [
    "Do your best impression of a celebrity",
    "Sing the chorus of your favorite song",
    "Do 10 push-ups",
    "Call someone and sing happy birthday",
    "Dance for 30 seconds",
    "Act like your favorite animal for 1 minute",
    "Do a cartwheel",
    "Make up a poem about the person to your right",
  ]

  const roastMessages = [
    "You're like a software update - everyone ignores you until they need you! 😂",
    "Your personality is so dry, you could be a conversation desert! 🌵",
    "You're not weird, you're just a limited edition! 🤪",
    "If being awesome was a crime, you'd be serving a life sentence... in minimum security! 😎",
    "You're like WiFi - when you're not around, people can't connect! 📶",
    "Your jokes are like dad jokes, but without the qualification! 👨‍👧‍👦",
    "You're so unique, even autocorrect can't figure you out! 📱",
  ]

  const moodBattleEmojis = ["😊", "😂", "😍", "🤩", "😎", "🥳", "🤪", "😇", "🙃", "🤗"]

  const handleGameSelect = (gameId) => {
    setActiveGame(gameId)
    setShowGameModal(true)
    initializeGame(gameId)
  }

  const initializeGame = (gameId) => {
    switch (gameId) {
      case "truth-or-dare":
        setGameState({
          mode: null,
          currentPlayer: user.username,
          round: 1,
        })
        break
      case "roast-bot":
        setGameState({
          roastsGiven: 0,
          totalRoasts: 5,
        })
        break
      case "mood-battle":
        setGameState({
          playerMood: null,
          opponentMood: null,
          round: 1,
          playerScore: 0,
          opponentScore: 0,
        })
        break
      case "poll-games":
        setGameState({
          question: "",
          options: ["", ""],
          votes: {},
        })
        break
      default:
        break
    }
  }

  const playTruthOrDare = (choice) => {
    const questions = choice === "truth" ? truthQuestions : dareQuestions
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)]
    setCurrentQuestion(randomQuestion)

    setGameState({
      ...gameState,
      mode: choice,
      question: randomQuestion,
    })
  }

  const getRoast = () => {
    const randomRoast = roastMessages[Math.floor(Math.random() * roastMessages.length)]
    setCurrentQuestion(randomRoast)

    setGameState({
      ...gameState,
      roastsGiven: gameState.roastsGiven + 1,
    })

    // Save game result
    saveGameResult({
      gameType: "roast-bot",
      userId: user.uid,
      result: "roasted",
      details: randomRoast,
    })
  }

  const playMoodBattle = (selectedMood) => {
    const opponentMood = moodBattleEmojis[Math.floor(Math.random() * moodBattleEmojis.length)]
    const playerWins = Math.random() > 0.5 // Random winner for demo

    setGameState({
      ...gameState,
      playerMood: selectedMood,
      opponentMood: opponentMood,
      playerScore: gameState.playerScore + (playerWins ? 1 : 0),
      opponentScore: gameState.opponentScore + (playerWins ? 0 : 1),
    })

    setCurrentQuestion(
      playerWins
        ? `You won this round! ${selectedMood} beats ${opponentMood}`
        : `You lost this round! ${opponentMood} beats ${selectedMood}`,
    )
  }

  const createPoll = () => {
    const { question, options } = gameState
    if (!question.trim() || options.some((opt) => !opt.trim())) return

    const pollData = {
      id: Date.now(),
      question,
      options,
      votes: {},
      createdBy: user.username,
      createdAt: new Date().toISOString(),
    }

    // Save poll (in real app, this would go to a shared space)
    saveGameResult({
      gameType: "poll-games",
      userId: user.uid,
      result: "poll_created",
      details: pollData,
    })

    setCurrentQuestion(`Poll created: "${question}"`)
  }

  const renderGameContent = () => {
    switch (activeGame) {
      case "truth-or-dare":
        return (
          <div className="game-content">
            <h3>Truth or Dare</h3>
            {!gameState.mode ? (
              <div className="game-choices">
                <button onClick={() => playTruthOrDare("truth")} className="game-choice-btn truth">
                  Truth
                </button>
                <button onClick={() => playTruthOrDare("dare")} className="game-choice-btn dare">
                  Dare
                </button>
              </div>
            ) : (
              <div className="game-question">
                <div className="question-type">{gameState.mode.toUpperCase()}</div>
                <p>{currentQuestion}</p>
                <button onClick={() => setGameState({ ...gameState, mode: null })} className="next-question-btn">
                  Next Question
                </button>
              </div>
            )}
          </div>
        )

      case "roast-bot":
        return (
          <div className="game-content">
            <h3>Roast Bot 🤖</h3>
            <div className="roast-counter">
              Roasts: {gameState.roastsGiven}/{gameState.totalRoasts}
            </div>

            {currentQuestion && (
              <div className="roast-message">
                <p>{currentQuestion}</p>
              </div>
            )}

            <button onClick={getRoast} className="roast-btn" disabled={gameState.roastsGiven >= gameState.totalRoasts}>
              {gameState.roastsGiven >= gameState.totalRoasts ? "No More Roasts!" : "Roast Me! 🔥"}
            </button>
          </div>
        )

      case "mood-battle":
        return (
          <div className="game-content">
            <h3>Mood Battle</h3>
            <div className="battle-score">
              You: {gameState.playerScore} | Opponent: {gameState.opponentScore}
            </div>

            {currentQuestion && (
              <div className="battle-result">
                <p>{currentQuestion}</p>
              </div>
            )}

            <div className="mood-selection">
              <h4>Choose your mood:</h4>
              <div className="mood-battle-grid">
                {moodBattleEmojis.map((mood) => (
                  <button key={mood} onClick={() => playMoodBattle(mood)} className="mood-battle-btn">
                    {mood}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case "poll-games":
        return (
          <div className="game-content">
            <h3>Create a Poll</h3>

            <div className="poll-form">
              <input
                type="text"
                placeholder="Enter your question..."
                value={gameState.question}
                onChange={(e) =>
                  setGameState({
                    ...gameState,
                    question: e.target.value,
                  })
                }
                className="poll-question-input"
              />

              {gameState.options.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...gameState.options]
                    newOptions[index] = e.target.value
                    setGameState({
                      ...gameState,
                      options: newOptions,
                    })
                  }}
                  className="poll-option-input"
                />
              ))}

              <button
                onClick={() =>
                  setGameState({
                    ...gameState,
                    options: [...gameState.options, ""],
                  })
                }
                className="add-option-btn"
              >
                Add Option
              </button>

              <button
                onClick={createPoll}
                className="create-poll-btn"
                disabled={!gameState.question.trim() || gameState.options.some((opt) => !opt.trim())}
              >
                Create Poll
              </button>
            </div>

            {currentQuestion && (
              <div className="poll-success">
                <p>{currentQuestion}</p>
              </div>
            )}
          </div>
        )

      default:
        return <div>Game not found</div>
    }
  }

  const popularGames = [
    {
      id: 1,
      title: "Word Association",
      icon: "📝",
      players: 24,
    },
    {
      id: 2,
      title: "Emoji Pictionary",
      icon: "🎨",
      players: 56,
    },
    {
      id: 3,
      title: "Guess Who",
      icon: "👤",
      players: 18,
    },
  ]

  return (
    <div className="page-container">
      <Header title="Games" showBackButton={true} />

      <div className="games-container">
        <section className="games-featured">
          <h3>Featured Games</h3>
          <div className="games-grid">
            {games.map((game) => (
              <div
                key={game.id}
                className={`game-card ${activeGame === game.id ? "active" : ""}`}
                style={{ borderColor: game.color }}
                onClick={() => handleGameSelect(game.id)}
              >
                <div className="game-icon" style={{ backgroundColor: game.color }}>
                  {game.icon}
                </div>
                <div className="game-info">
                  <h4>{game.title}</h4>
                  <p>{game.description}</p>
                  <span className="game-players">{game.players}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="games-popular">
          <h3>Popular Now</h3>
          <div className="popular-games-list">
            {popularGames.map((game) => (
              <div key={game.id} className="popular-game-item">
                <div className="popular-game-icon">{game.icon}</div>
                <div className="popular-game-info">
                  <h4>{game.title}</h4>
                  <p>{game.players} playing now</p>
                </div>
                <button className="play-now-btn">Play</button>
              </div>
            ))}
          </div>
        </section>

        <section className="game-results">
          <h3>Your Game History</h3>
          {gameResults.length > 0 ? (
            <div className="results-list">
              {gameResults.slice(0, 5).map((result) => (
                <div key={result.id} className="result-item">
                  <div className="result-game">{result.gameType}</div>
                  <div className="result-details">{result.result}</div>
                  <div className="result-time">{new Date(result.timestamp).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-results">No game history yet. Start playing!</p>
          )}
        </section>

        {/* Game Modal */}
        {showGameModal && (
          <div className="modal-overlay">
            <div className="modal-content game-modal">
              <div className="modal-header">
                <h3>{games.find((g) => g.id === activeGame)?.title}</h3>
                <button
                  onClick={() => {
                    setShowGameModal(false)
                    setActiveGame(null)
                    setCurrentQuestion("")
                  }}
                  className="modal-close"
                >
                  ✕
                </button>
              </div>

              {renderGameContent()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
