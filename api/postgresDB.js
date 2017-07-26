import pool from '../database/index';
import admin from '../database/firebase';

export async function getUser(id) {
  return new Promise(async (res, rej) => {
    try {
      let user = await pool.query(`SELECT * from user_profiles WHERE userid='${id}'`)
      const fbuser = await admin.auth().getUser(id)
      user = renameId(user)[0];
      user = {...user, email: fbuser.email};
      res(user);
      } catch(e) {
         console.log(e);
         rej(e);
      }
  })
    // .then(response => {
    //   return renameId(response.rows)[0];
    //   
    //     .then(function(userRecord) {
    //       // See the UserRecord reference doc for the contents of userRecord.
    //       console.log("Successfully fetched user data:", userRecord.toJSON());
    //     })
    //     .catch(function(error) {
    //       console.log("Error fetching user data:", error);
    //     });
    // })
    // .catch(errors => {
    //   console.log(errors)
    // })    
};

export const getUsers = () => {
  return pool.query(`SELECT * FROM user_profiles`)
    .then(response => {
      return renameId(response.rows);
    })
    .catch(errors => console.log(errors));
}

function renameId(item) {
  item.map(row => Object.keys(row)).reduce(acc, user => {
    acc = {...row, id: row.userid}
    delete acc.userid;
    return acc
  })
}

export function createUser(args) {
  return new Promise(async (resolve, reject) => {
    try {
      const fbUser = await admin.auth().createUser({
        email: args.email,
        password: args.password,
      })
      const query = {
        text: 'INSERT INTO user_profiles(fullname, bio, userid) VALUES($1, $2, $3) RETURNING *',
        values: [args.fullname, args.bio, fbUser.uid],
      }
      let pgUser = await pool.query(query)
      let user = {...pgUser.rows[0], email: fbUser.email, id: fbUser.uid}
      resolve(user)         
    } catch(error) {
      reject(error);
    }
  })
}
