import React from 'react';
import { IUser } from '../AppContext';

// to display username on the top 
export const Header = (user: IUser | null) => {
  if (user !== null) {
    return (
      <div>
        Hello {user.username}
      </div>
    )
  }
  else {
    return (
      <div>
        PorkBelly
      </div>
    )
  }
}
