const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');  

exports.login = async (req, res) => {
  const { email, password, role_id } = req.body;

  try {
    const user = await User.findOne({ email }).populate('role_id');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (String(user.role_id._id) !== role_id) {
      return res.status(401).json({ message: 'Invalid role for this user' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role_id.name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    user.token = token;
    await user.save();

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role_id.name,
      },
    });
  } catch (err) {
    console.error('Error in login:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.logout = async (req, res) => {
  try {
    const userId = req.user.id;
   
    await User.findByIdAndUpdate(userId, { $unset: { token: "" } });

    res.json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Server error during logout' });
  }
};

