import {redirect} from 'react-router';
import type {Route} from './+types/account._index';

export async function loader() {
  return redirect('/account/orders');
}
