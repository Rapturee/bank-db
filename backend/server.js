import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import knex from 'knex';

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: './bank.db'
  },
  useNullAsDefault: true
});

const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
};

// Create User
app.post('/users', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [userId] = await db('users').insert({ username, password });
    await db('accounts').insert([{ userId, type: 'primary', amount: 0 }, { userId, type: 'savings', amount: 0 }]);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});

// Login User
app.post('/sessions', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db('users').where({ username, password }).first();
    if (user) {
      const token = generateOTP();
      await db('sessions').insert({ userId: user.id, token });
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

// Get Profile
app.post('/me/profile', async (req, res) => {
  const { token } = req.body;
  try {
    const session = await db('sessions').where({ token }).first();
    if (session) {
      const user = await db('users').where({ id: session.userId }).first();
      res.status(200).json({ username: user.username, email: `${user.username}@example.com` });
    } else {
      res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
});

// Get Account Balance
app.post('/me/accounts', async (req, res) => {
  const { token } = req.body;
  try {
    const session = await db('sessions').where({ token }).first();
    if (session) {
      const userAccounts = await db('accounts').where({ userId: session.userId });
      res.status(200).json(userAccounts);
    } else {
      res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching accounts', error });
  }
});

// Deposit Money
app.post('/me/accounts/transactions', async (req, res) => {
  const { token, amount } = req.body;
  try {
    const session = await db('sessions').where({ token }).first();
    if (session) {
      const account = await db('accounts').where({ userId: session.userId, type: 'primary' }).first();
      if (account) {
        await db('accounts').where({ id: account.id }).update({ amount: account.amount + amount });
        res.status(200).json({ message: 'Deposit successful', amount: account.amount + amount });
      } else {
        res.status(404).json({ message: 'Account not found' });
      }
    } else {
      res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error depositing money', error });
  }
});

// Transfer Money
app.post('/me/transfer', async (req, res) => {
  const { token, fromAccountId, toAccountId, amount } = req.body;
  try {
    const session = await db('sessions').where({ token }).first();
    if (session) {
      const fromAccount = await db('accounts').where({ id: fromAccountId, userId: session.userId }).first();
      const toAccount = await db('accounts').where({ id: toAccountId, userId: session.userId }).first();
      if (fromAccount && toAccount) {
        if (fromAccount.amount >= amount) {
          await db('accounts').where({ id: fromAccountId }).update({ amount: fromAccount.amount - amount });
          await db('accounts').where({ id: toAccountId }).update({ amount: toAccount.amount + amount });
          res.status(200).json({ message: 'Transfer successful' });
        } else {
          res.status(400).json({ message: 'Insufficient funds' });
        }
      } else {
        res.status(404).json({ message: 'Account not found' });
      }
    } else {
      res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error transferring money', error });
  }
});

// Create Additional Account
app.post('/me/accounts/create', async (req, res) => {
  const { token, type } = req.body;
  try {
    const session = await db('sessions').where({ token }).first();
    if (session) {
      const newAccount = { userId: session.userId, type, amount: 0 };
      await db('accounts').insert(newAccount);
      res.status(201).json({ message: 'Account created successfully', account: newAccount });
    } else {
      res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating account', error });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
