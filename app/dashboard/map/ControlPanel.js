import * as React from 'react';

import {ControlPosition} from '@vis.gl/react-google-maps';


function ControlPanel() {


  return (
    <div className="control-panel">
      <h3>MapControl Example</h3>
      <p>
        Demonstrates how to use the <code>&lt;MapControl&gt;</code> component to
        add custom control components to the map.
      </p>

      <div>
        <label>Control Position</label>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);