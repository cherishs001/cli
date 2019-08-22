import {Environment} from './environments';
import Orm from '@kaishen/orm';

const {databases} = Environment;

const Connection = async (app): Promise<void> => {
    return new Promise<void>(async (resolve, reject): Promise<void> => {
        let flag: boolean = false;
        for (const items in databases) {
            if (databases.hasOwnProperty(items)) {
                const {type} = databases[items];
                if (type === 'mysql') {
                    const dbc = new Orm(databases[items]);
                    try {
                        const connection = await dbc.connect();
                        console.log(`database: ${type}@${items} connect successfully.`);
                        if (!app.context.hasOwnProperty('database')) {
                            app.context.database = {};
                        }
                        app.context.database[items] = connection;
                    } catch (err) {
                        flag = true;
                        console.log(`database: ${type}@${items} connect failed.`);
                        console.log(err);
                        reject()
                    }
                } else if (type === 'redis') {
                    try {
                        const redis = new Orm(databases[items]);
                        const connection = await redis.connect();
                        console.log(`database: ${type}@${items} connect successfully.`);
                        if (!app.context.hasOwnProperty('database')) {
                            app.context.database = {};
                        }
                        app.context.database[items] = connection;
                    } catch (err) {
                        flag = true;
                        console.log(`database: ${type}@${items} connect failed.`);
                        console.log(err);
                        reject()
                    }
                } else {
                    flag = true;
                    console.log(`The unknown database type '${type}'.`);
                    reject()
                    //todo 后续根据需要增加新的database-type
                }
            }
        }
        if (!flag) {
            resolve()
        }
    })
};

export {Connection}
