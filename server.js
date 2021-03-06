const express = require('express');
const mongoose = require('mongoose');
const config = require('config');

const app = express();

/* Enable CORS */
app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

/* Get database credentials */
const db = config.get('mongoURI');

/* Connect to DB */
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('MongoDB is connected'))
  .catch((err) => console.log(err));

/* Get Mongoose schema */
const Doggo = require('./models/Doggo');

/* RESTful API METHODS */
//GET
app.get('/', (_, res) => {
  Doggo.find()
    .sort({ date: -1 })
    .then((items) => res.json(items));
});

//POST
app.use(express.json());

app.post('/', (req, res) => {
  const doggo = new Doggo({
    name: req.body.name,
    type: req.body.type,
    isGoodBoi: req.body.isGoodBoi,
  });

  doggo
    .save()
    .then((item) => res.json(item))
    .catch((err) => res.send(err));
});

//PUT
app.put('/:name', (req, res) => {
  Doggo.findOneAndUpdate({ name: req.params.name }, req.body)
    .then((item) => {
      let itemUpd = item;

      itemUpd.name !== req.body.name ? (itemUpd.name = req.body.name) : false;
      itemUpd.type !== req.body.type ? (itemUpd.type = req.body.type) : false;
      itemUpd.isGoodBoi !== req.body.isGoodBoi
        ? (itemUpd.isGoodBoi = req.body.isGoodBoi)
        : false;

      res.json(itemUpd);
    })
    .catch(() => res.status(404).json({ success: false }));
});

//DELETE
app.delete('/:name', (req, res) => {
  Doggo.findOneAndDelete({ name: req.params.name })
    .then((item) =>
      item === null
        ? res.status(404).json({ success: false })
        : res.send(req.params.name + ' is gone')
    )
    .catch(() => res.status(404).json({ success: false }));
});

/* Listen from port 5000 */
const port = 5000;
app.listen(port, () =>
  console.log(`Server started on port: http://localhost:${port}`)
);
