import { createAction } from 'redux-actions';

export const addTicket = createAction('ADD_TICKET');
export const removeTicket = createAction('REMOVE_TICKET');
export const removeTickets = createAction('REMOVE_TICKETS');
export const updateBar = createAction('UPDATE_BAR');
export const updateOrder = createAction('UPDATE_ORDER');
export const resetOrder = createAction('RESET_ORDER');
