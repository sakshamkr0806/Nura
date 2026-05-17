module.exports = async (req, res) => {
  try {
    const server = require('../dist/main').default;
    await server(req, res);
  } catch (err) {
    console.error('NestJS Startup Error:', err);
    res.status(500).json({
      error: 'FUNCTION_INVOCATION_FAILED',
      message: err.message,
      stack: err.stack,
    });
  }
};
