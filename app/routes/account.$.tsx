import {redirect, type LoaderFunctionArgs} from 'react-router';
import type {Route} from './+types/account.$';

// fallback wild card for all unauthenticated routes in account section
export async function loader({context}: LoaderFunctionArgs) {
  await context.customerAccount.handleAuthStatus();

  return redirect('/account');
}
