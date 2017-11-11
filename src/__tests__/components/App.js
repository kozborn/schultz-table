import React from 'react';
import { shallow } from 'enzyme';
import App from '../../components/App';

let app;

describe("App", () => {
  it("should render App without crashing", () => {
    app = shallow(<App />);
    expect(app.exists()).toBe(true);
  });
});
