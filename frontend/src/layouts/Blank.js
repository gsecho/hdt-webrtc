import React, { PureComponent } from 'react';
import Blanklayout from './BlankLayout';

export default class Blank extends PureComponent{
  render () {
    let res = Blanklayout({text: 'blank'});

    return (
      <div style={{display: 'none', width: '0px', height: '0px'}}>
        {res}
      </div>
    );
  }
}
