import React, { PureComponent } from 'react';
import router from 'umi/router';

class Redirect500 extends PureComponent{
  componentDidMount(){
    router.push('/exception/500');
  }

  render(){
    return (
      <div></div>
    );
  }
}

export default Redirect500;
