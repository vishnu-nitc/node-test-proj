const winston = require('winston');
require('express-async-errors');

module

winston.add(new winston.transports.File({ filename : 'logfile.log' , format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD hh:mm:ss A ZZ'
    }),
    winston.format.json()
  )}));

// adding logfile to capturelogs
