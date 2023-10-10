import { handleActions } from 'redux-actions';

import update from 'immutability-helper';

import { ConcessionItemsStateInterface } from 'functions/Interfaces';

const initialState: ConcessionItemsStateInterface = { concessionItemsCategories: [], totalCount: 0, totalPrice: 0 };

export default handleActions({
  SET_CONCESSION_ITEMS_CATEGORIES(state, { payload }) {
    return update(state, { concessionItemsCategories: { $set: payload } });
  },
  CHANGE_CONCESSION_ITEM_COUNT(state, { payload: { categoryIndex, productIndex, changeType } }) {
    const changedItemPrice = state.concessionItemsCategories[categoryIndex].concession_items[productIndex].price;

    return update(state, { 
      concessionItemsCategories: { 
        [categoryIndex]: { 
          concession_items: {
             [productIndex]: { 
              count: { 
                $apply: (value) => {
                  if (!value) return 1;
                  if (changeType === 'add') return value + 1;
                  return value - 1;
                }
              }
            } 
          } 
        } 
      },
      totalCount: { $apply: value => changeType === 'add' ? value + 1 : value - 1 },
      totalPrice: { $apply: value => changeType === 'add' ? value + +changedItemPrice : value - +changedItemPrice }
    });
  },
  RESET_CONCESSION_ITEMS(state) {
    return update(state, { $set: initialState });
  },
}, initialState);
