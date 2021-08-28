import { asyncRouteHandler } from './asyncRouteHandler';
import { HttpStatusError } from './HttpStatusError';
import { User } from '../models/user';
import {Types, model} from 'mongoose';

export const register =  asyncRouteHandler(async function login({ body }, res) {
    if (body != null) { // ensure no null body
        const { username, password } = body;
        if (typeof username === 'string' && typeof password === 'string') { // ensure username and password is in a correct type
            try { // ensure the username and password string is parseable
                JSON.parse(username).toString();
                JSON.parse(password).toString();
            } catch (error) {
                throw new HttpStatusError(error); // throw error
            }
            const users = await this.Users.find({ username });
            if (users.length === 0) { // ensure there is no existing identical username
                // generate a new user document in the user collection
                const nUser = new User({
                    _id: new Types.ObjectId(),
                    username: username,
                    password: password
                    // add setting here
                })
                nUser.save()
                .then(result => {
                    return res.status(201).json({ // return 201 on successful save
                        user: result
                    });
                })
                .catch(error => {
                    return res.status(500).json({ // return error 500 if cant create
                        message: error.message, 
                        error
                    });
                })
            }
        }
    }
    throw new HttpStatusError(400); // throw bad request
});