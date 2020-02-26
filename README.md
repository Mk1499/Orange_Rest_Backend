# Orange Resturant

Restful API For Fancy Resturant for Booking Resturant Tables 

# Features!

  - View all Tables.
  - Add new Table.
  - Delete an existing Table.
  - View all the currently available tables, along with the number of persons for each Table.
  - Reserve a Table.
  - View the reservations/bookings for a specific date.


You can also:
  - Login as Resturant Admin or Normal Client.
  - Admin View All Users.
  - Regesteration

### Tech

OrangeRest uses a number of open source projects to work properly:

* NodeJS - evented I/O for the backend
* Express - fast node.js network app framework
* Mocha & Chai & Supertest


### Installation

- Create .env file with following content

```sh
Developer="Mohamed Khaled"
PORT=3000
DBHOST="YOUR DB HOSTNAME"
DBUSER="YOUR DB USERNAME"
DBPW="YOUR DB PASSWORD"
DBNAME="YOUR DB NAME"

tokenSecret="Orange_Rest"
```

OrangeRest requires [Node.js](https://nodejs.org/) v4+ to run.

Install the dependencies and devDependencies and start the server.

```sh
$ cd Orange_Rest_Backend
$ npm install 
$ node app.js
```

For Testing

```sh
$ npm run test
```

