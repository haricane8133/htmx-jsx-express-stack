import events from 'events';

import { Events, StatusEventParams } from './types';
import { vars } from './constants';
import { store } from '.';



/**
 * This is an Event Emitter variable that you can use to fire and listen and handle events.
 */
export const statusEvents = new events.EventEmitter();
statusEvents.addListener(Events.status.toString(), (param: StatusEventParams) => {
  store.putVar(param.userid, vars.status, param.status);
});
