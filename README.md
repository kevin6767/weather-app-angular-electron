
# Weather App in Electron and Angular

I have developed a dynamic weather application using Electron, Angular, OAuth2, and SQLite3. The app features a secure login system where users can authenticate via OAuth2, and their credentials are stored in a local SQLite3 database. Users can customize API keys for both OAuth2 and the weather service, with these keys stored for future use. Upon login, new users are automatically added to the database. The app’s dashboard allows users to input a city name or zip code, instantly retrieving and displaying current weather data for the specified location.



## Screenshots

![Login flow](/images/weather-app-angular-electron-user-login-flow.PNG)
![Post login flow](/images/post_login.PNG)
![ipc handlers flow](/images/ipc_handlers_flow.PNG)
![Dashboard](/images/weather_app1.PNG)
![Settings Page](/images/settings_page.PNG)
![Dashboard Logged in](/images/logged_in_dashboard_weather_search.PNG)


## Features

- oAuth2 login Features
- Database support
- Electron browserless support
- Dynamic API keys
- Dynamic Rendering 

## Roadmap

* [x]  setup for google auth oauth provider
* [x]  setup electron for window 
* [x]  setup state management (ngrx)
* [x]  routes
* [x]  setup SQL database
* [x]  project directory with components/services/enviroments/etc
* [x]  create title bar
* [x]  login/logout
* [x]  weather api setup
* [x]  weather display
* [x]  welcome page if user isn't logged in / dashboard if they are logged in
* [x]  setup setting for console
* [x]  after loggin in, change the login button to logout and update the functionality
* [x]  basic error handling
* [x]  setup welcome page 
* [x]  using SQL database to store API keys and user information

nice to haves 
* [x]  state management for error handlign and error handling component?
* [ ]  change window controls based on state (if minimized, use a different icon)
* [ ]  recognzing f12 for dev tools instead of manually adding it on app load
* [ ]  add another state for before the user has logged in, but is in a different window, so you can't keep clicking the login button
* [x]  move app.js and preload.js to src/
* [ ]  smart check for storing api keys - if they don't work, don't store in db
* [ ]  util for celcius to farenheight