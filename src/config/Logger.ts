import winston, { format } from "winston";

const logger = winston.createLogger({
  format: format.combine(
    format.timestamp(),
    format.json()
),
  defaultMeta: { name: "cralwer-app" },
  transports: [
    new winston.transports.File({
      filename: __dirname + '/../../logs/error.log', level: 'error'
    }),
    new winston.transports.File({ 
      filename: __dirname + `/../../logs/info.log`, level: 'info'
    })
  ]
});

export default logger