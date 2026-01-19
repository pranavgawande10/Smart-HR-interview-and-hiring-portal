# HR panel
- database link

# HR Schema and job Schema
- in models folder (user.js and job.js)

# POST API
- signup => signup the HR
- login
- logout
- forgotpassword => via NodeMailer
- resetpassword
- job/create

# GET API
- job/myjobs
- profile/view
- profile/edit

# Routers used (server -> src-> routers )
 - authRouter in auth.js containing ( signup, login, logout, forgotpassword, resetpassword)
 - jobRouter in job.js containing (job create, view myjobs)
 - profileRouter in profile.js containing (profile/view , profile/edit)

# middlewares used (server -> src-> middlewares )
auth.js in middlewares (userAuth)

# Validations (server -> src-> utils )
- in utils folder (validation.js)  

# mail transporter (server -> src-> utils )
- in utils folder (sendEmail.js) 


