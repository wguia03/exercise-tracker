## Exercise Tracker Microservice
- API REST para realizar seguimiento de rutinas de ejercicios
- Registro de usuarios y visualización de una lista completa
- Registro de ejercicios de cada usuario
- Visualización de una lista completa de ejercicios de cada usuario
- Para mayor información puede visitar el siguiente link: https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/exercise-tracker

### Responses
- Exercise
  ~~~
  {
    username: "fcc_test",
    description: "test",
    duration: 60,
    date: "Mon Jan 01 1990",
    _id: "5fb5853f734231456ccb3b05"
  }
  ~~~

- User
  ~~~
  {
    username: "fcc_test",
    _id: "5fb5853f734231456ccb3b05"
  }
  ~~~

- Log
  ~~~
  {
    username: "fcc_test",
    count: 1,
    _id: "5fb5853f734231456ccb3b05",
    log: [{
      description: "test",
      duration: 60,
      date: "Mon Jan 01 1990",
    }]
  }
  ~~~

### Tech Stack
- JavaScript
- Node.js
- Express
- MongoDB
- HTML
- CSS
