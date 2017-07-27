import pool from '../database/index';
import admin from '../database/firebase';
import fetch from 'node-fetch';


export async function getUser(id) {
  return new Promise(async (res, rej) => {
    try {
      let user = await pool.query(`SELECT * from user_profiles WHERE userid='${id}'`)
      const fbUser = await admin.auth().getUser(id)
      user = (user.rows)[0];
      user = {...user, email: fbUser.email};
      res(user);
      } catch(e) {
         console.log(e);
         rej(e);
      }
  })
};

// function renameId(item) {
//   item.map(row => Object.keys(row)).reduce(acc, user => {
//     acc = {...row, id: row.userid}
//     delete acc.userid;
//     return acc
//   })
// }
export function newItem(args, context) {
  return new Promise(async (resolve, reject) => {
    try {
      const itemQuery = {
        text: 'INSERT INTO items(title, description, imageurl) VALUES($1, $2, $3) RETURNING *',
        values: [args.title, args.description, args.imageurl, args.itemowner],
      }
      const newItem = await pool.query(itemQuery)
      function insertTag(tags) {
        return tagQuerys.map(tag => {
          return `(${newItem.rows[0].id}, ${tagid})`
        }).join(',')
      }
      const tagQuery = {
        text: 'INSERT INTO itemtags(itemid, tagid) VALUES ${inserTag(args.tags)}',
      }
      const tags = await pool.query(itemQuery)
      resolve({id: newItem.rows[0].id})
    } catch(error) {
      reject(error)
    }
  })
}

export function createUser(args, context) {
  return new Promise(async (resolve, reject) => {
    try {
      const fbUser = await admin.auth().createUser({
        email: args.email,
        password: args.password,
      })
      const query = {
        text: 'INSERT INTO user_profiles(fullname, bio, id) VALUES($1, $2, $3) RETURNING *',
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

export const getUsers = () => {
  return pool.query(`SELECT * FROM user_profiles`)
    .then(response => {
      return response.rows;
    })
    .catch(errors => console.log(errors));
}


export function getItems() {
  return pool.query(`SELECT * FROM items`)
  .then(response => {
    return response.rows 
  })
  .catch(errors => console.log(errors))
};

export function getItem(id) {
  return pool.query(`SELECT * FROM items WHERE id = ${id}`)
  .then(response => {
    return response.rows[0]
  })
  .catch(errors => console.log(errors))
};

// export function getUsers() {
//   return pool.query(`SELECT * from user_profile`)
//   .then((response) => response.rows)
//   .catch(errors => console.log(errors))
// };

// export function getUser(id) {
//   return pool.query(`SELECT * FROM user_profiles WHERE id = ${id}`)  
//   .then((response) => response.rows[0])
//   .catch(errors => console.log(errors))
// };

// User helpers

export function getUserItems(id) {
  // return fetch(`http://localhost:3001/items/?itemowner=${user.id}`)
  return pool.query(`SELECT * FROM items WHERE itemowner = ${id}`)
  .then((response) => {
    retirn (response.rows);
  })
  .catch(errors => console.log(errors))
};

export function getUserBorrowedItems(id) {
  // return fetch(`http://localhost:3001/items/?borrower=${user.id}`)
  return pool.query(`SELECT * FROM items WHERE borrower = ${id}`)
  .then((response) => {
    return (response.rows)
  })
  .catch(errors => console.log(errors))
};

// Post helper

// export function newItem(newItem) {
//   return fetch(`http://localhost:3001/items/`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(newItem)
//   }).then(response => response.json())
//     .catch(errors => console.log(errors));
//     return addItem;
// }

//SQL 

export function getTags() {
  return pool.query(`SELECT * FROM tags`)
             .then((response) => response.rows)
             .catch(errors => console.log(errors));
}

export function getTagsfromItem(itemid) {
  return pool.query(`
    SELECT tags.title as tagname
      FROM tags 
      INNER JOIN itemtags
      ON itemtags.tagid = tags.id
    WHERE itemtags.itemid = ${itemid}
  `).then((response) => response.rows);
}

export function getItemsFromTags(tagId) {
  return pool.query(`
     SELECT * FROM items
       INNER JOIN itemtags
       ON items.id = itemtags.itemid
     WHERE itemtags.tagid = ${tagid}
  `).then(response => {
    return (response.rows)
  }).catch(errors => console.log(errors));
}










