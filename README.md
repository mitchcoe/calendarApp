# Simple Calendar App

Very simple (probably over-engineered) calendar app. This project was created mainly with Create React App, Typescript, Redux Toolkit, MUI, Express and Postgres. I tried to use as few libraries/frameworks as possible.

# Getting Started
There are a few things you will need to do outside this app to make it work

Note: I made this on my Macbook, so all the instructions below are for MacOS. If you use Windows or otherwise, use the correct commands for your OS where applicable.

First you need to install Postgres on your computer. I used Postgres 14.7 at the time of this writing, YMMV depending on which version you use. If you use Homebrew, run this command: `brew install postgresql@14`. After that, run `brew services start postgresql@14`. You can stop postgres with `brew services stop postgresql`.

Next, we will create a database. I used the interactive terminal front-end `psql`. To start, connect to the default database with `psql postgres`.

After that, run `\conninfo` to get the username and port you are connected to, we will need these later. At this point, we can create a simple role in the databse instead of using our superuser role. Use this command: `CREATE ROLE me WITH LOGIN PASSWORD 'password';`. `me` and `password` can be whatever you want, just remember them. Also run this: `ALTER ROLE me CREATEDB;`.

Lastly create a databse with this: `CREATE DATABASE database` where `database` is whatever you choose. If you need to manually connect to the database to look at things, run this: `\c database`. `\q` lets you quit back to the terminal.

Now we need to update the `knexfile.ts`. In the `development` object inside the `connection` key, update the `user`, `database`, `password`, and `port` if necessary to reflect the values you chose earlier.

The other thing you need to be aware of is if you delete the 2 default attachments for the events with `event_id` equal to `1` or `2`, this will remove them from the `uploads` folder. This is expected, but due to the way the uploads work via `multer`, you wont be able to recreate the exact filename even if you upload the same exact image or file. The default image I used for convenience was the React logo, specifically the `logo192.png` in the `public` directory. You can copy this image to your desktop, attach it via the attachments modal when editing the first or second event, and then find it in the uploads folder. Get the filename, and update the corresponding `file_path` in this file: `02_initialize_attachments_data.ts`, which is in the `seeds` directory. This will ensure if you do any migrations or seed commands, or especially `yarn data_reset`, the attachments will show up in the app correctly. Adding or deleting attachments to other events will not cause any issues.

## Available Scripts

In the project directory, you can run:

### `yarn dev`

Runs both the app and server at the same time. Make sure postgres is running first

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `yarn server`

Runs the server

### `yarn data_reset`

Resets the database to its default state.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.
