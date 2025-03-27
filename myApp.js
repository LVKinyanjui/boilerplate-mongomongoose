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

/** 4) Create many People with `Model.create()` */
let arrayOfPeople = [
  {name: "Frankie", age: 74, favoriteFoods: ["Del Taco"]},
  {name: "Sol", age: 76, favoriteFoods: ["roast chicken"]},
  {name: "Robert", age: 78, favoriteFoods: ["wine"]}
];

let createManyPeople = function(arrayOfPeople, done) {
  Person.create(arrayOfPeople, function (err, people) {
    if (err) return console.error(err);
    done(null, people);
  });
};

const findPeopleByName = (personName, done) => {
  Person.find({'name': personName}, (err, data) => {
    if (err) return console.error(err);
    done(null, data);
  });
};

const findOneByFood = (food, done) => {
  Person.findOne({'favoriteFoods': food}, (err, data) => {
    if (err) return console.error(err);
    done(null, data);
  });
};

const findPersonById = (personId, done) => {
  // When saving a document, MongoDB automatically adds the field _id, 
  // and set it to a unique alphanumeric key
  Person.findOne({'_id': personId}, (err, data) => {
    if (err) return console.error(err);
    console.log(data);
    done(null, data);
  });
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  Person.findOne({'_id': personId}, (err, person) => {
    if (err) return console.error(err);
    
    // Array.push() method to add "hamburger" to the list of the person's favoriteFoods
    person.favoriteFoods.push(foodToAdd);

    // and inside the find callback - save() the updated Person.
    person.save((err, updatedPerson) => {
      if(err) return console.log(err);
      done(null, updatedPerson)
    })
  })
};


// Functionally correct but more verbose
// Than the other function of the same name
// const findAndUpdate = (personName, done) => {
//   const ageToSet = 20;

//   Person.findOne({'name': personName}, (err, person) => {
//     if (err) return console.error(err);
//     person.age = ageToSet;

//     person.save((err, updatedPerson) => {
//       if (err) return console.error(err);
//       done(null, updatedPerson);
//     })
//   })
// };

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  // Takes a callback as the 4th argument
  // A callback is necessary to execute the query
  // To return the updated doc, you need to pass { new: true } to the options argument
  Person.findOneAndUpdate({'name': personName}, {'age': ageToSet}, 
    { new: true }, (err, updatedDoc) => {
      if (err) return console.error(err);
      done(null, updatedDoc);
    })
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, person) => {
    if (err) return console.error(err);
    done(null, person);
  });
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";

  Person.remove({'name': nameToRemove}, (err, people) => {
    if (err) return console.error(err);
    done(null, people);
  })
};

const queryChain = (done) => {
  const foodToSearch = "burrito";

  Person.find({'favoriteFoods': foodToSearch}).
    sort({name: 1}).
    limit(2).
    select({ age: 0}).
    exec( (err, data) => {
      if (err) return console.error(err);
      done(null, data);
    });
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
