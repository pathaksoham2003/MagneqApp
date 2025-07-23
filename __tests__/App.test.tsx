/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
<<<<<<< HEAD
import App from '../src/App';
=======
import App from '../App';
>>>>>>> 366337f5fd26645a8daa3eff1d3c04f83682df08

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
