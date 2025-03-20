require('dotenv').config();

// console.log(process.env.MONGO_URI);

/** # MONGOOSE SETUP #
/*  ================== */
const mongoose = require('mongoose');

// Like
// MONGO_URI=mongodb+srv://<user>:<db-password>@<cluster-name>.d2ylz.mongodb.net/<db-name>?retryWrites=true&w=majority&appName=<cluster-name>
// The database name can also be specified (without a trailing /)
// To avoid connecting to the admin database by default
// for which we may not have the necessary permissions
// Ensure useNewUrlParser: true is specified in mongoose.connect
const uri = process.env.MONGO_URI;

const clientOptions = { useNewUrlParser: true, serverApi: { version: '1', strict: true, deprecationErrors: true } };
// mongoose.connect(uri, clientOptions);


let personSchema = new mongoose.Schema({
  name: String,
  age: Number,
  favoriteFoods: [String]
})


async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
  }
}
// run().catch(console.dir);

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    mongoose
      .connect(uri, clientOptions)
      .then(() => {
        console.log('Database connection successful');
      })
      .catch((err) => {
        console.error('Database connection error');
      });
  }
}

let database = new Database();

let Person = new mongoose.model("Person", personSchema);

let createAndSavePerson = function(done) {
  let janeFonda = new Person({name: "Jane Fonda", age: 84, favoriteFoods: ["eggs", "fish", "fresh fruit"]});

  janeFonda.save(function(err, data) {
    if (err) return console.error(err);
    done(null, data)
  });
};


const createManyPeople = (arrayOfPeople, done) => {
  done(null /*, data*/);
};

const findPeopleByName = (personName, done) => {
  done(null /*, data*/);
};

const findOneByFood = (food, done) => {
  done(null /*, data*/);
};

const findPersonById = (personId, done) => {
  done(null /*, data*/);
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  done(null /*, data*/);
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  done(null /*, data*/);
};

const removeById = (personId, done) => {
  done(null /*, data*/);
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";

  done(null /*, data*/);
};

const queryChain = (done) => {
  const foodToSearch = "burrito";

  done(null /*, data*/);
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
