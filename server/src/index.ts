import './preStart'; // Must be the first import
import app from '@server';
import logger from '@shared/Logger';
import testAPIRouter from "./routes/testApi";


// Start the server
const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
    logger.info('Express server started on port: ' + port);
});

// app.use("/testAPI", testAPIRouter);