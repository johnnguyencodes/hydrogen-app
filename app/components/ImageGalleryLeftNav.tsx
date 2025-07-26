import React from 'react';
import {bool, func} from 'prop-types';
import {MoveLeft} from 'lucide-react';

const LeftNav = React.memo(({disabled, onClick}) => {
  return (
    <button
      type="button"
      className="image-gallery-icon image-gallery-left-nav"
      disabled={disabled}
      onClick={onClick}
      aria-label="Previous Slide"
    >
      <MoveLeft />
    </button>
  );
});

LeftNav.displayName = 'LeftNav';

LeftNav.propTypes = {
  disabled: bool.isRequired,
  onClick: func.isRequired,
};

export default LeftNav;
