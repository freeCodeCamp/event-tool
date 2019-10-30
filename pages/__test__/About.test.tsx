import React from 'react';
import { render } from '@testing-library/react';

import About from '../pages/About';

describe('About', () => {
  it('should render text', () => {
    const { getByText } = render(<About />);
    expect(getByText('This is an imported component')).toBeDefined();
  });
});
