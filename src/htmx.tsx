/// <reference types="@kitajs/html/htmx.d.ts" />
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Html from '@kitajs/html';

import {
  defaultTo as _defaultTo,
  isNull as _isNull,
  isEmpty as _isEmpty,
  isUndefined as _isUndefined,
  get as _get,
} from 'lodash';

import { vars } from './constants';
import { iHtmxWidgetProps } from './types';

import { store } from '.';

export const getHtmxWidgetProps = (res: Express.Response): iHtmxWidgetProps => {
  return { userid: _get({res}, 'res.locals.userid', '') };
}

// -> -> -> Fragments <- <- <-
function getRefreshButton(
  hxGet: string,
  hxTarget: string,
  hxIndicator: string,
  hxSwap: string = 'outerHTML',
) {
  return (
    <button
      style={{ cursor: 'pointer' }}
      class="btn"
      hx-get={hxGet}
      hx-target={hxTarget}
      hx-swap={hxSwap}
      hx-indicator={hxIndicator}
      hx-disabled-elt="this"
    >
      <img style={{ maxWidth: '20' }} src="./svg-refresh" alt="Refresh" />
    </button>
  );
}

// -> -> -> Required in login.html <- <- <-

export function getUnauthorized() {
  return <h4>Sorry. You are not authorized to use this platform</h4>;
}

export function getSuccessLogin() {
  return (
    <h4>
      Welcome. You can now <a href="./dashboard">proceed</a>
    </h4>
  );
}

// -> -> -> Required in dashboard.html <- <- <-

export function getDashboard(props: iHtmxWidgetProps) {
  return (
    <div>
      <div class="row">
        <div class="card 6 col">{getStatusWidget(props)}</div>
      </div>
    </div>
  );
}

export function getStatusWidget(props: iHtmxWidgetProps) {
  return (
    <div id="status-result-div">
      <div class="row">
        <h3 class="col">Latest Status message</h3>
        <div class="col">
          <img
            id="status-result-indicator"
            class="htmx-indicator"
            style={{ maxWidth: '30' }}
            src="./svg-progress-hourglass"
            alt="API Call in Progress"
          />
        </div>
        <div class="col">
          {getRefreshButton('./widget/status', '#status-result-div', '#status-result-indicator')}
        </div>
      </div>
      <div
        class="row"
        id="status-result-message"
        style={{ color: 'darkblue', fontWeight: 'bold', fontStyle: 'italic' }}
      >
        {_defaultTo(store.getVar(props.userid, vars.status), '-')}
      </div>
    </div>
  );
}
