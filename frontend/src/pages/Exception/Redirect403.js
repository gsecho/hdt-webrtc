import React, { PureComponent } from 'react';
import router from 'umi/router';

class Redirect403 extends PureComponent{
  componentDidMount(){
    router.push('/exception/403');
  }

  render(){
    return (
      <div></div>
    );
  }
}

export default Redirect403;
