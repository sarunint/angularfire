import { Observable } from 'rxjs';

import { ChildEvent, DatabaseQuery, SnapshotAction } from '../interfaces';
import { listChanges } from './changes';
import { validateEventsArray } from './utils';

export function snapshotChanges(query: DatabaseQuery, events?: ChildEvent[]): Observable<SnapshotAction[]> {
  events = validateEventsArray(events);
  return listChanges(query, events!);
}
