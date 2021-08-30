import { genSaltSync, hashSync } from 'bcrypt';
import { asyncRouteHandler } from './asyncRouteHandler';
import { HttpStatusError } from './HttpStatusError';

export const register = asyncRouteHandler(async function register({ body }, res) {
  // ensure no null body
  if (body != null) {
    const { username, password } = body;
    // ensure username and password is in a correct type
    if (typeof username === 'string' && typeof password === 'string') {
      // transaction start here !!!!!!!!
      const dbs = await this.db.startSession();
      try {
        await dbs.withTransaction(async () => {
          const users = await this.Users.find({ username });

          // ensure there is no existing identical username
          if (users.length === 0) {
            // generate a new user document in the user collection
            const hashedPw = hashSync(password, genSaltSync());
            await this.Users.create({
              username,
              // store the 2 layer hashed password
              password: hashedPw,
              // add setting here
            });
            // send respond 201 on successful save
            res.sendStatus(201);
          } else {
            // throw conflict
            throw new HttpStatusError(409);
          }
        });
      } finally {
        // make sure the session end
        dbs.endSession();
      }
      return;
    }
  }
  // throw bad request
  throw new HttpStatusError(400);
});
