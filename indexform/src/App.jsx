



import { useState } from 'react'
import './App.css'

function App() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [city, setCity] = useState("")
  const [gender, setGender] = useState("")

  const [isMarried, setIsMarried] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({
      name,
      email,
      password,
      city,
      gender,
      isMarried
    
    })
    setName("")
    setCity("")
    setGender("")
    setIsMarried("")
    setEmail("")
  }

  return (
    <>
    <h1>Registration form</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name" value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br /><br />

        <input
          type="email"
          placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <select value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">Select City</option>
          <option value="delhi">Delhi</option>
          <option value="mumbai">Mumbai</option>
          <option value="bangalore">Bangalore</option>
        </select>
        <br /><br />

        Male:
        <input
          type="radio"
          name="gender"
          value="male"
           onChange={(e) => setGender(e.target.value)}
        />
        Female:
        <input
          type="radio"
          name="gender"
          value="female"
          onChange={(e) => setGender(e.target.value)}
        />
        <br /><br />

        Is Married:
        <input
          type="checkbox"
          onChange={(e) => setIsMarried(e.target.checked ? "Married" :"unmarried")}
        />
        <br /><br />

        <button type="submit">Submit</button>
      </form>
    </>
  )
}

export default App
