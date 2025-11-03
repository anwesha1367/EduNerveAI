export const login = (req, res) => {
  const { email, password } = req.body

  // Mock authentication
  if (email && password) {
    const user = {
      id: '1',
      name: email.split('@'),
      email,
      interviews: 3,
      skills: 12
    }

    res.json({
      success: true,
      user,
      token: 'mock-jwt-token-' + Date.now()
    })
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    })
  }
}

export const signup = (req, res) => {
  const { name, email, password, interests, skillLevel } = req.body

  // Mock user creation
  const user = {
    id: Date.now().toString(),
    name,
    email,
    interests,
    skillLevel,
    interviews: 0,
    skills: 0
  }

  res.json({
    success: true,
    user,
    token: 'mock-jwt-token-' + Date.now()
  })
}
