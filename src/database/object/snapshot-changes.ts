import { DataSnapshot } from '@firebase/database-types';
import { Observable } from 'rxjs';

import { AngularFireAction, DatabaseQuery, SnapshotAction } from '../interfaces';
import { fromRef } from '../observable/fromRef';

export function createObjectSnapshotChanges(query: DatabaseQuery): () => Observable<AngularFireAction<DataSnapshot>> {
  return function snapshotChanges(): Observable<SnapshotAction> {
    return fromRef(query, 'value');
  };
}
