import express from 'express';

const router = express.Router();

const modules = [
  'auth', 'users', 'ngos', 'reports', 'rescues', 
  'volunteers', 'adoptions', 'donations', 'community', 'notifications'
];

modules.forEach(mod => {
  router.get(`/${mod}`, (req, res) => {
    res.status(200).json({
      module: mod,
      status: 'Stubbed',
      message: `Endpoint for ${mod} is stubbed and ready for future implementation.`
    });
  });
});

export default router;
