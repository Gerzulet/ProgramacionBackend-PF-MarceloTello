import dotenv from 'dotenv';
import { Command } from 'commander';

const program = new Command();
program.option('--mode <mode>', 'set the mode', 'development');
program.parse(process.argv);

const options = program.opts();

const env = options.mode;
dotenv.config({
    path: env === 'production' ? './.env.prod' : './.env.dev'
});

export default {
    port: process.env.PORT,
    mongo_url: process.env.MONGO_URL,
    admin_name: process.env.ADMIN_NAME,
    admin_pass: process.env.ADMIN_PASS,
    persistence: process.env.PERSISTENCE,
    env: env  
};