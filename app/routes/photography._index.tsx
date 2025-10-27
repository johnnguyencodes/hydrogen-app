import {Link} from '@remix-run/react';

export default function Photography() {
  return (
    <div className="photography xxs:mx-5 2xl:mx-0">
      <p>This is the Photography page</p>

      <p>Checkout my photography albums</p>

      <Link to="/photography/08-22-2025">08-22-2025</Link>
      <Link to="/photography/09-10-2025">09-10-2025</Link>
      <Link to="/photography/10-25-2025">10-25-2025</Link>
    </div>
  );
}
