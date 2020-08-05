<a href="https://kite-inc.herokuapp.com/" target="_blank"><img src="https://github.com/andy-9/socialnetwork/blob/master/public/logo.png" align="right" alt="Logo of Kite.Inc"></a>

# Kite.Inc
## Social network for an inclusive kitesurfing community

Users can <a href="https://kite-inc.herokuapp.com/" target="_blank">join a social network</a>, in this case focusing on inclusive kitesurfing communities.<br>

A high priority of this Single Page Application is on conditional rendering, security issues (password hashing, protection against SQL-injection, CSRF- and XSS-attacks, reset code by email) and a differentiated error handling (different error messages get displayed, e.g. if the email is not in the database, the retyped password does not match the first password or the input fields are left empty) in the register, login, and reset password components.

<img src="/public/socialnetwork.gif" alt="gif to display how social network works">

**Tech Stack:** React & Redux, Node/Express, PostgreSQL, Socket.io, Amazon S3 and SES, CSS, HTML

**Features:** registration, login, a personal profile with bio and image upload, sending, receiving and accepting friend requests, unfriend, having conversations in a chat room, display of last 3 registered users, searching for users by first and last name, showing friends of friends, logout



## License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

© <a href="https://andreashechler.com/" target="_blank">Andreas Hechler</a> 2020
