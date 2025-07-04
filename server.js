const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./models');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const propertyRoutes = require('./routes/property.routes');
const clientRoutes = require('./routes/client.routes');
const rolRoutes = require('./routes/rol.routes');
const statsRoutes = require('./routes/stats.routes');

dotenv.config();

const app = express();
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/roles', rolRoutes);
app.use('/api/stats', statsRoutes);



const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connection established');
    await sequelize.sync(); // Si es necesario: { alter: true }
    console.log('✅ DB synced');

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
  }
}

start();
