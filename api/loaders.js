import DataLoader from 'dataloader';
import {
  getUserItems,
  getUserBorrowedItems,
  getItem,
  getUser 
} from './jsonServer';

export default function() {
  return {
    UserOwnedItems: new DataLoader(ids => (
      Promise.all(ids.map(id => getUserItems(id))
    ))),
    UserBorrowedItems: new DataLoader(ids => (
      Promise.all(ids.map(id => getUserBorrowedItems(id))
    ))),
    SingleItem: new DataLoader(ids => (
      Promise.all(ids.map(id => getItem(id))
    ))),
    SingleUser: new DataLoader(ids => (
      Promise.all(ids.map(id => getUser(id))
    ))),

    // getUser: new DataLoader(ids => {      
    //   return Promise.all(ids.map(id => getUser(id)))
    // }),
  }
};