export const EnvConfiguration = () => ({
    environment: process.env.NODE_ENV || 'development',
    mysqlDatabase: process.env.MYSQL_DATABASE,
    mysqlUser: process.env.MYSQL_USER,
    mysqlPassword: process.env.MYSQL_PASSWORD,
    mysqlPasswordRoot: process.env.MYSQL_ROOT_PASSWORD,
    mysqlPort: parseInt(process.env.PORT_MYSQL),
    host: process.env.MYSQL_HOST,
    hostAPI: process.env.HOST_API,
    jwtSecret: process.env.JWT_SECRET,
    portServer: parseInt(process.env.PORT_SERVER, 10) || 3004,
});