import React from 'react'
import ForgotPass from '../../components/ForgotPass'

const AdminForgotPass = () => {
  return (
    <div>
      <ForgotPass
        role="Admin"
        rouet="/login/admin"
      />
    </div>
  )
}

export default AdminForgotPass
