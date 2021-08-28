import { asyncRouteHandler } from './asyncRouteHandler';
import { HttpStatusError } from './HttpStatusError';
import { userSchema } from '../models/user';
import { model } from 'mongoose';

const User = model('User', userSchema);

export const register =  asyncRouteHandler(async function login({ body }, res) {
    if (body != null) { // ensure no null body
        const { username, password } = body;
        if (typeof username === 'string' && typeof password === 'string') { // ensure username and password is in a correct type
            
            const users = await this.Users.find({ username });
            if (users.length === 0) { // ensure there is no existing identical username
                // generate a new user document in the user collection
                const nUser = new User({
                    username,
                    password,
                    // add setting here
                })
                // save the result
                await nUser.save()
                await res.sendStatus(201); // send respond 201 on successful save
                return;
            }
            throw new HttpStatusError(409); // throw conflict
        }
    }
    throw new HttpStatusError(400); // throw bad request
});