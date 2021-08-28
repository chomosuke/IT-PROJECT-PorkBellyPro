import { asyncRouteHandler } from './asyncRouteHandler';
import { HttpStatusError } from './HttpStatusError';

export const register = asyncRouteHandler(async function register({ body }, res) {
    // ensure no null body
    if (body != null) {
        const { username, password } = body;
        // ensure username and password is in a correct type
        if (typeof username === 'string' && typeof password === 'string') {
            // transaction start here !!!!!!!!
            const users = await this.Users.find({ username });
            // ensure there is no existing identical username
            if (users.length === 0) {
                // generate a new user document in the user collection
                await this.Users.create({
                    username,
                    password,
                    // add setting here
                });
                // send respond 201 on successful save
                res.sendStatus(201);
                return;
                // end transaction here by using "finally"
            }
            // throw conflict
            throw new HttpStatusError(409);
        }
    }
    // throw bad request
    throw new HttpStatusError(400);
});
