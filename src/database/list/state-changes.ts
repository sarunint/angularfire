import { DataSnapshot } from '@firebase/database-types';
import { Observable, merge as observableMerge } from 'rxjs';

import { AngularFireDatabase } from '../database';
import { AngularFireAction, ChildEvent, DatabaseQuery } from '../interfaces';
import { fromRef } from '../observable/fromRef';
import { validateEventsArray } from './utils';

export function createStateChanges(
  query: DatabaseQuery,
  afDatabase: AngularFireDatabase
): (events?: ChildEvent[] | undefined) => Observable<AngularFireAction<DataSnapshot>> {
  return (events?: ChildEvent[]) =>
    afDatabase.scheduler.keepUnstableUntilFirst(afDatabase.scheduler.runOutsideAngular(stateChanges(query, events)));
}

export function stateChanges(query: DatabaseQuery, events?: ChildEvent[]): Observable<AngularFireAction<DataSnapshot>> {
  events = validateEventsArray(events)!;
  const childEvent$ = events.map(event => fromRef(query, event));
  return observableMerge(...childEvent$);
}
