/* eslint-disable no-shadow */

export enum Events {
  status = 'status',
}

export interface iResLocals {
  userid: string;
}

export interface iHtmxWidgetProps extends iResLocals {}

export interface StatusEventParams {
  userid: string;
  status: string;
}

export interface iUser {
  userid: string;
  passHash: string;
}

export enum AccountRestriction {
  free = 'free',
  pilot = 'pilot',
  blocked = 'blocked',
}