import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Smart HR Interview & Hiring Portal</h1>

      <p style={styles.subtitle}>
        Manage hiring, interviews, and candidates in one place.
      </p>

      <div style={styles.buttonGroup}>
        <Link to="/hr" style={styles.button}>
          Go to HR Panel
        </Link>

        <Link to="/about" style={styles.outlineButton}>
          About
        </Link>

        <Link to="/contact" style={styles.outlineButton}>
          Contact
        </Link>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
    color: '#fff',
    textAlign: 'center',
    padding: '20px',
  },
  title: {
    fontSize: '36px',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '18px',
    maxWidth: '500px',
    marginBottom: '30px',
    color: '#ddd',
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
  },
  button: {
    background: '#4CAF50',
    padding: '12px 24px',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
  },
  outlineButton: {
    border: '2px solid #fff',
    padding: '12px 24px',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '6px',
  },
}

export default Home
