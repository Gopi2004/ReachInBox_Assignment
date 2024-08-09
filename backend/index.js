// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const threadRoutes = require('./routes/threadRoutes.js');

// const app = express();
// const PORT = process.env.PORT || 5002;

// app.use(cors());
// app.use(bodyParser.json());

// // Connect to MongoDB
// mongoose.connect('mongodb+srv://gopichandm:123123123@cluster0.7jptq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });

// mongoose.connection.once('open', () => {
//   console.log('Connected to MongoDB');
// });

// app.use('/onebox', threadRoutes);

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let threads = [
  {
    _id: uuidv4(),
    subject: 'First Thread',
    body: 'This is the first thread',
    creator: 'creator1@gmail.com',  // Added creator field
    date: new Date().toISOString(),  // Added date field
    replies: [],
  },
  {
    _id: uuidv4(),
    subject: 'Second Thread',
    body: 'This is the second thread',
    creator: 'creator2@gmail.com',  // Added creator field
    date: new Date().toISOString(),  // Added date field
    replies: [],
  },
];

// Fetch all threads
app.get('/onebox/list', (req, res) => {
  res.json(threads);
});

// Fetch a specific thread by ID
app.get('/onebox/:thread_id', (req, res) => {
  const thread = threads.find(t => t._id === req.params.thread_id);
  if (thread) {
    res.json(thread);
  } else {
    res.status(404).json({ error: 'Thread not found' });
  }
});

// Delete a thread by ID
app.delete('/onebox/:thread_id', (req, res) => {
  threads = threads.filter(t => t._id !== req.params.thread_id);
  res.json({ message: 'Thread deleted' });
});

// Create a new thread
app.post('/onebox/create', (req, res) => {
  const { subject, body, creator } = req.body;
  if (!subject || !body || !creator) {
    return res.status(400).json({ error: 'Subject, body, and creator are required' });
  }
  const newThread = {
    _id: uuidv4(),
    subject,
    body,
    creator,
    date: new Date().toISOString(),
    replies: [],
  };
  threads.push(newThread);
  res.json({ message: 'Thread created', thread: newThread });
});
app.delete('/onebox/:thread_id', (req, res) => {
  threads = threads.filter(t => t._id !== req.params.thread_id);
  res.json({ message: 'Thread deleted' });
});

// Post a reply to a thread
app.post('/reply/:thread_id', (req, res) => {
  const { from, to, subject, body } = req.body;
  const thread = threads.find(t => t._id === req.params.thread_id);
  
  if (thread) {
    const reply = { from, to, subject, body, _id: uuidv4(), date: new Date().toISOString() };
    thread.replies.push(reply);
    res.json({ message: 'Reply added', reply });
  } else {
    res.status(404).json({ error: 'Thread not found' });
  }
});

const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
