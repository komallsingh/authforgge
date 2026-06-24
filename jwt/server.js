const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoute');

dotenv.config();

const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});


app.get("/api/protected", require('./middleware/authMidd'), (req, res) => {
    res.json({
        message:"You are authorized to access this route", 
        user:req.user});
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});