import React, { PureComponent } from 'react';
import router from 'umi/router';

class Redirect404 extends PureComponent{
  componentDidMount(){
    router.push('/exception/404');
  }

  render(){
    return (
      <div></div>
    );
  }
}

export default Redirect404;
